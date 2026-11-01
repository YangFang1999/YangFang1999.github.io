<script setup lang="ts">
// 文章评论面板：Giscus（基于本仓库的 GitHub Discussions），挂在文章页右侧
// （与悬浮目录同层：底部右侧，可展开，内部滚动）。
// - 按「文章 id」映射讨论（mapping=specific），避开 hash 路由下 pathname 全相同
//   导致的全站共用评论区问题
// - 首次展开才注入 giscus 脚本；切换文章时清空重建，评论各归各的文章
// - 监听 giscus 的 discussion 元数据消息，标题栏实时显示评论数
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ articleId: string }>();

const open = ref(false);
const count = ref<number | null>(null);
const boxEl = ref<HTMLElement | null>(null);
const status = ref<'loading' | 'ready' | 'timeout' | 'error'>('loading');
const errMsg = ref('');
let injectedFor = '';   // 已为哪个文章 id 注入过脚本
let timeoutTimer: ReturnType<typeof setTimeout> | undefined;

// giscus.app 生成的仓库配置（Announcements 分类：只有仓库维护者能创建讨论，
// 访客只能回复，天然防止乱开主题帖）
const GISCUS = {
  repo: 'YangFang1999/YangFang1999.github.io',
  repoId: 'R_kgDOQWog1A',
  category: 'Announcements',
  categoryId: 'DIC_kwDOQWog1M4DKJgn',
};

function injectGiscus(): void {
  const box = boxEl.value;
  if (!box || injectedFor === props.articleId) return;
  injectedFor = props.articleId;
  box.innerHTML = '';
  status.value = 'loading';
  errMsg.value = '';
  // 记录来源文章：giscus 登录后回跳会丢 hash 路由，入口脚本靠这个回到原文页
  try { localStorage.setItem('giscus-return', `#/notes/${props.articleId}`); } catch { /* 忽略 */ }
  // 加载超时：giscus.app（Vercel）在部分地区不稳定，widget 挂起时给出重试入口
  if (timeoutTimer) clearTimeout(timeoutTimer);
  timeoutTimer = setTimeout(() => {
    if (status.value === 'loading') status.value = 'timeout';
  }, 10000);
  const s = document.createElement('script');
  s.src = 'https://giscus.app/client.js';
  s.async = true;
  s.crossOrigin = 'anonymous';
  Object.assign(s.dataset, {
    repo: GISCUS.repo,
    repoId: GISCUS.repoId,
    category: GISCUS.category,
    categoryId: GISCUS.categoryId,
    mapping: 'specific',
    term: `notes/${props.articleId}`,
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '1',
    inputPosition: 'top',
    theme: 'light',
    lang: 'zh-CN',
    loading: 'lazy',
  });
  box.appendChild(s);
}

function retry(): void {
  injectedFor = '';
  injectGiscus();
}

// 换文章：清空容器与计数，展开状态下按新 id 重新注入
watch(() => props.articleId, () => {
  injectedFor = '';
  count.value = null;
  if (boxEl.value) boxEl.value.innerHTML = '';
  if (open.value) injectGiscus();
});

// giscus 通过 postMessage 上报数据：{ giscus: { resizeHeight } } / { giscus: { error } }
// / { giscus: { discussion: { totalCommentCount, ... } } }（需 emitMetadata=1）。
// "Discussion not found"（首条评论前）会伴随正常渲染出现，不打扰用户；
// 只有渲染都没开始就报错/超时才提示。
function onMessage(e: MessageEvent): void {
  if (e.origin !== 'https://giscus.app') return;
  const d = (e.data as { giscus?: { resizeHeight?: number; error?: string | null; discussion?: { totalCommentCount?: number } } } | null)?.giscus;
  if (!d) return;
  if (typeof d.resizeHeight === 'number') {
    status.value = 'ready';
    if (timeoutTimer) clearTimeout(timeoutTimer);
  } else if (d.error) {
    if (status.value === 'loading') {
      errMsg.value = d.error;
      status.value = 'error';
      if (timeoutTimer) clearTimeout(timeoutTimer);
    }
  }
  const n = d.discussion?.totalCommentCount;
  if (typeof n === 'number') count.value = n;
}

// 登录弹窗关闭时通过 opener 通知到这里：重新注入 widget 立刻带上登录态
function onSessionReady(): void {
  if (!open.value || !boxEl.value) return;
  injectedFor = '';
  injectGiscus();
}

onMounted(() => {
  window.addEventListener('message', onMessage);
  window.addEventListener('giscus-session-ready', onSessionReady);
  // 从登录回跳而来：自动展开面板展示登录态
  try {
    if (sessionStorage.getItem('giscus-just-logged-in')) {
      sessionStorage.removeItem('giscus-just-logged-in');
      open.value = true;
      injectGiscus();
    }
  } catch { /* 忽略 */ }
});
onUnmounted(() => {
  window.removeEventListener('message', onMessage);
  window.removeEventListener('giscus-session-ready', onSessionReady);
  if (timeoutTimer) clearTimeout(timeoutTimer);
});

function toggle(): void {
  open.value = !open.value;
  if (open.value) injectGiscus();
}
</script>

<template>
  <div class="read-comments" :class="{ open }">
    <button type="button" class="read-comments-head" @click="toggle">
      <i class="fa fa-comments-o"></i>
      <span>评论</span>
      <span v-if="count !== null" class="read-comments-count">{{ count }}</span>
      <i class="fa fa-angle-double-down toggle"></i>
    </button>
    <div v-show="open" class="read-comments-body">
      <p class="read-comments-tip">
        <i class="fa fa-github"></i>
        评论基于 GitHub Discussions：登录 GitHub 后发表，内容同步保存在本站仓库；首次评论会自动创建对应讨论。
      </p>
      <div v-if="status === 'timeout' || status === 'error'" class="read-comments-fail">
        <span>{{ status === 'timeout' ? '评论服务加载超时（giscus.app 网络不畅?）' : `评论服务错误：${errMsg}` }}</span>
        <button type="button" @click="retry">重试</button>
      </div>
      <div ref="boxEl" class="read-comments-box"></div>
    </div>
  </div>
</template>

<style scoped>
.read-comments {
  position: fixed;
  right: 10px;
  bottom: 56px;               /* 任务栏上方 */
  width: min(344px, calc(100vw - 20px));
  display: flex;
  flex-direction: column;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #0a0a0a #0a0a0a #ffffff;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4);
  z-index: 46;                /* 展开后盖在目录之上，避免互相顶住 */
  font-family: 'MS Sans Serif', Tahoma, 'Microsoft YaHei', sans-serif;
}
.read-comments-head {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  border: none;
  background: #c0c0c0;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: bold;
  color: #000080;
  cursor: pointer;
  text-align: left;
  border-bottom: 1px solid #808080;
  box-shadow: inset 0 1px 0 #ffffff;
}
.read-comments.open .read-comments-head { border-bottom-color: #808080; }
.read-comments-head .read-comments-count {
  min-width: 16px;
  padding: 0 4px;
  font-weight: normal;
  color: #555;
  font-size: 10px;
  background: #fff;
  border: 1px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
  text-align: center;
}
.read-comments-head .toggle {
  margin-left: auto;
  color: #555;
  font-size: 12px;
  transition: transform 0.15s;
}
.read-comments.open .toggle { transform: rotate(180deg); }
.read-comments-body {
  display: flex;
  flex-direction: column;
  max-height: min(52vh, 470px);
  padding: 4px;
}
.read-comments-tip {
  margin: 0 0 4px;
  padding: 4px 6px;
  font-size: 10px;
  line-height: 1.5;
  color: #555;
  background: #fff;
  border: 1px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}
.read-comments-tip i { margin-right: 3px; }
.read-comments-fail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 0 0 4px;
  padding: 5px 7px;
  font-size: 10px;
  line-height: 1.5;
  color: #a00;
  background: #fff;
  border: 1px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}
.read-comments-fail button {
  flex-shrink: 0;
  padding: 2px 10px;
  font-size: 10px;
  font-weight: bold;
  background: #c0c0c0;
  color: #000;
  border: none;
  cursor: pointer;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf;
  font-family: inherit;
}
.read-comments-fail button:active { box-shadow: inset -1px -1px #ffffff, inset 1px 1px #0a0a0a; }
.read-comments-box {
  overflow-y: auto;
  background: #fff;
  border: 1px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
  min-height: 120px;
}
/* giscus iframe 撑满容器宽度 */
.read-comments-box :deep(iframe.giscus-frame) { width: 100%; border: none; }
/* 移动端不再隐藏：面板默认收起，展开后接近全屏、可随时收起，手机也能评论 */
@media (max-width: 899px) {
  .read-comments {
    width: calc(100vw - 16px);
    right: 8px;
    bottom: 52px;
  }
  .read-comments-body { max-height: 70vh; }
}
</style>

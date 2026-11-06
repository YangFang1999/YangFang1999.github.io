<script setup lang="ts">
import { ref, watch, computed, provide, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DesktopIcon from './components/DesktopIcon.vue';
import Taskbar from './components/Taskbar.vue';
import QQPet from './components/QQPet.vue';
import FindDialog from './components/FindDialog.vue';
import ScreenSaver from './views/ScreenSaver.vue';
import { notes } from './data/notes';
import { desktopTheme, THEMES } from './settings';
import { loadAllArticles, sizeKB } from './data/articlesIndex';

const router = useRouter();
const route = useRoute();

// ============ 全局搜索「查找：全部文件」 ============
const findOpen = ref(false);
const diskKB = ref(0);

// ============ 系统属性对话框 ============
const sysPropsOpen = ref(false);
const visitCount = ref(0);
const uaShort = computed(() => {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Microsoft Edge';
  if (/Chrome\//.test(ua)) return 'Chromium 内核浏览器';
  if (/Firefox\//.test(ua)) return 'Mozilla Firefox';
  if (/Safari\//.test(ua)) return 'Safari';
  return '未知浏览器';
});

function openSysProps(): void {
  ctxMenu.value = null;
  sysPropsOpen.value = true;
  // 后台算一次全站文档磁盘占用（带缓存，只算一次）
  void loadAllArticles().then(all => {
    let total = 0;
    for (const html of all.values()) total += sizeKB(html);
    diskKB.value = total;
  });
}

onMounted(() => {
  const n = (parseInt(localStorage.getItem('visit-count') || '0', 10) || 0) + 1;
  try { localStorage.setItem('visit-count', String(n)); } catch { /* 忽略 */ }
  visitCount.value = n;
  window.addEventListener('open-sysprops', openSysProps);
  window.addEventListener('keydown', onRootKeydown);
  window.addEventListener('win-close', onWinClose);
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('pointermove', resetIdle);
  window.addEventListener('pointerdown', resetIdle);
  window.addEventListener('keydown', resetIdle);
  window.addEventListener('wheel', resetIdle, { passive: true });
  resetIdle();
});
onUnmounted(() => {
  window.removeEventListener('open-sysprops', openSysProps);
  window.removeEventListener('keydown', onRootKeydown);
  window.removeEventListener('win-close', onWinClose);
  window.removeEventListener('popstate', onPopState);
  window.removeEventListener('resize', onWindowResize);
  window.removeEventListener('pointermove', resetIdle);
  window.removeEventListener('pointerdown', resetIdle);
  window.removeEventListener('keydown', resetIdle);
  window.removeEventListener('wheel', resetIdle);
  if (idleTimer) clearTimeout(idleTimer);
  if (resizeSaveTimer) { clearTimeout(resizeSaveTimer); resizeSaveTimer = undefined; saveLayout(); }
});

let resizeSaveTimer: ReturnType<typeof setTimeout> | undefined;

function onWindowResize(): void {
  vhTick.value++;
  // 窗口变小时把自定义摆放的图标夹回视口内
  for (const [id, p] of Object.entries(iconPos.value)) {
    iconPos.value[id] = {
      x: Math.max(0, Math.min(window.innerWidth - 90, p.x)),
      y: Math.max(0, Math.min(window.innerHeight - 130, p.y)),
    };
  }
  // 拖窗口边缘时 resize 连发，落盘防抖（此前每个事件写一次 localStorage）
  if (resizeSaveTimer) clearTimeout(resizeSaveTimer);
  resizeSaveTimer = setTimeout(saveLayout, 300);
}

// ============ 桌面图标：定义 + 拖拽布局 ============
interface IconDef {
  id: string; label: string; iconClass: string; color: string;
  to?: string; action?: () => void;
}

const icons: IconDef[] = [
  { id: 'computer', label: '我的电脑', iconClass: 'fa fa-desktop', color: 'text-white', to: '/computer' },
  { id: 'docs', label: '我的文章', iconClass: 'fa fa-folder-open', color: 'text-yellow-400', to: '/all-notes' },
  { id: 'control', label: '控制面板', iconClass: 'fa fa-cog', color: 'text-pink-300', to: '/categories' },
  { id: 'ie', label: 'Internet 浏览器', iconClass: 'fa fa-globe', color: 'text-blue-300', to: 'https://github.com/YangFang1999' },
  { id: 'notepad', label: '记事本', iconClass: 'fa fa-pencil-square-o', color: 'text-white', to: '/notepad' },
  { id: 'airplane', label: '飞机大战', iconClass: 'fa fa-fighter-jet', color: 'text-yellow-300', to: '/airplane' },
  { id: 'survivor', label: '桌面保卫战', iconClass: 'fa fa-shield', color: 'text-red-300', to: '/survivors' },
  { id: 'mine', label: '扫雷', iconClass: 'fa fa-bomb', color: 'text-slate-200', to: '/minesweeper' },
  { id: 'paint', label: '画图', iconClass: 'fa fa-paint-brush', color: 'text-orange-300', to: '/paint' },
  { id: 'calc', label: '计算器', iconClass: 'fa fa-calculator', color: 'text-white', to: '/calculator' },
  { id: 'terminal', label: '命令提示符', iconClass: 'fa fa-terminal', color: 'text-green-300', to: '/terminal' },
  { id: 'typing', label: '打字练习', iconClass: 'fa fa-keyboard-o', color: 'text-cyan-300', to: '/typing' },
  { id: 'bin', label: '回收站', iconClass: 'fa fa-trash-o', color: 'text-gray-400', action: () => showAlert('回收站是空的。') },
];

const LAYOUT_KEY = 'icon-layout';
const iconPos = ref<Record<string, { x: number; y: number }>>(loadLayout());
const vhTick = ref(0);
const refreshKey = ref(0);

function loadLayout(): Record<string, { x: number; y: number }> {
  try {
    const raw = JSON.parse(localStorage.getItem(LAYOUT_KEY) || '{}');
    if (raw && typeof raw === 'object') return raw;
  } catch { /* 忽略 */ }
  return {};
}

function saveLayout(): void {
  try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(iconPos.value)); } catch { /* 忽略 */ }
}

function defaultPos(i: number): { x: number; y: number } {
  void vhTick.value; // 依赖 vhTick 使窗口尺寸变化后重新计算
  const rows = Math.max(1, Math.floor((window.innerHeight - 60) / 88));
  return { x: 14 + Math.floor(i / rows) * 94, y: 10 + (i % rows) * 88 };
}

function posStyle(id: string, i: number): Record<string, string> {
  const p = iconPos.value[id] ?? defaultPos(i);
  return { left: p.x + 'px', top: p.y + 'px' };
}

const iconDrag = ref<{ id: string; dx: number; dy: number; startX: number; startY: number; moved: boolean } | null>(null);
const suppressClick = ref(false);

function onIconPointerDown(e: PointerEvent, id: string): void {
  if (e.button !== 0) return;
  const el = e.currentTarget as HTMLElement;
  try { el.setPointerCapture(e.pointerId); } catch { /* 忽略 */ }
  const idx = icons.findIndex(ic => ic.id === id);
  const cur = iconPos.value[id] ?? defaultPos(idx);
  iconDrag.value = { id, dx: e.clientX - cur.x, dy: e.clientY - cur.y, startX: e.clientX, startY: e.clientY, moved: false };
}

function onIconPointerMove(e: PointerEvent): void {
  const d = iconDrag.value;
  if (!d) return;
  if (Math.abs(e.clientX - d.startX) + Math.abs(e.clientY - d.startY) > 5) d.moved = true;
  if (!d.moved) return;
  const x = Math.max(0, Math.min(window.innerWidth - 90, e.clientX - d.dx));
  const y = Math.max(0, Math.min(window.innerHeight - 130, e.clientY - d.dy));
  iconPos.value = { ...iconPos.value, [d.id]: { x, y } };
}

function onIconPointerUp(): void {
  const d = iconDrag.value;
  if (!d) return;
  if (d.moved) {
    // 拖拽结束：抑制紧随其后的 click（60ms），避免拖完误打开应用
    saveLayout();
    suppressClick.value = true;
    setTimeout(() => { suppressClick.value = false; }, 60);
  }
  iconDrag.value = null;
}

// 图标点击（捕获会使 click 落在外层容器上，因此导航统一在这里处理）
function onIconClick(ic: IconDef): void {
  if (suppressClick.value) return;
  if (ic.to) navigateTo(ic.to);
  else ic.action?.();
}

// ============ 桌面右键菜单 ============
const ctxMenu = ref<{ x: number; y: number } | null>(null);

function onDesktopContext(e: MouseEvent): void {
  e.preventDefault();
  ctxMenu.value = {
    x: Math.min(e.clientX, window.innerWidth - 150),
    y: Math.min(e.clientY, window.innerHeight - 130),
  };
}

function closeCtxMenu(): void {
  ctxMenu.value = null;
}

function arrangeIcons(): void {
  iconPos.value = {};
  try { localStorage.removeItem(LAYOUT_KEY); } catch { /* 忽略 */ }
  refreshKey.value++;
  closeCtxMenu();
}

function refreshDesktop(): void {
  refreshKey.value++;
  closeCtxMenu();
}

function onRootClick(): void {
  closeCtxMenu();
}

function onRootKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') closeCtxMenu();
  // Ctrl+K 唤出全局查找（Mac 用 Cmd+K，两者都接受）
  if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyK' || e.key === 'k')) {
    e.preventDefault();
    findOpen.value = !findOpen.value;
  }
}

// ============ 窗口路由模拟 ============
// 时间线式持久注册表：按打开顺序排列。任务栏点击第 N 个窗口 = 关闭其后打开的
// 全部窗口并回到它；窗口 X = 移除自身、退回前一个窗口（无则桌面）。全程不用 history.back。
interface WinEntry { id: string; title: string; icon: string; isActive: boolean; path?: string }

const openWindows = ref<WinEntry[]>([]);

const activeWindowId = computed(() => {
  const active = openWindows.value.find(w => w.isActive);
  return active?.id || null;
});
provide('activeWindowId', activeWindowId);

// 浏览器后退/前进落到已关闭窗口的旧路由：不复活窗口，直接回桌面。
// 信号 = popstate 标记 ∨ position 记账（后退 pos<lastPos、跳步前进 pos>lastPos+1）。
// 记账必须用 route.fullPath：route.path 不含 query，文件夹跳转（?category=）不改 path
// 会漏记一步，导致下一次真实跳转被误判成跳变（踩过：随笔文件夹 → 文章被守卫吞掉）。
// 已知窗口按 path 前缀匹配：回退进 ?category= 文件夹视图属于同一窗口，放行。
let lastNavPos: number | null = null;
let popNav = false;
const onPopState = (): void => { popNav = true; };
window.addEventListener('popstate', onPopState);

watch(() => route.fullPath, () => {
  const newPath = route.path;
  const pos = (window.history.state as { position?: number } | null)?.position ?? null;
  const backPop = lastNavPos !== null && pos !== null && pos < lastNavPos;
  const skipFwd = lastNavPos !== null && pos !== null && pos > lastNavPos + 1;
  lastNavPos = pos;
  const wasPop = popNav || backPop || skipFwd;
  popNav = false;
  const basePath = newPath.split('?')[0];
  if (wasPop && basePath !== '/' && !openWindows.value.some(w => w.path === basePath)) {
    router.replace('/');
    return;
  }

  // 持久窗口注册表：窗口一经打开就保留在任务栏（直到用户点 X 关闭），
  // 路由切换只决定哪个窗口在前台。此前是整表重建——打开文章后"我的电脑"
  // 会从任务栏消失、从控制面板进文章却硬挂一个"我的文章"（张冠李戴）。
  openWindows.value.forEach(w => { w.isActive = false; });

  const add = (id: string, title: string, icon: string, path: string) => {
    const existing = openWindows.value.find(w => w.id === id);
    if (existing) {
      existing.title = title;
      existing.icon = icon;
      existing.path = path;
      existing.isActive = true;
    } else {
      openWindows.value.push({ id, title, icon, isActive: true, path });
    }
  };

  if (newPath === '/') {
    // 桌面前台：本会话欢迎窗未关闭过则保持注册（与 Desktop 的显示条件一致）
    let welcomeAlive = true;
    try { welcomeAlive = sessionStorage.getItem('welcome-dismissed') !== '1'; } catch { /* 忽略 */ }
    if (welcomeAlive) add('welcome', '欢迎来到 YF 的 Blog.exe', 'fa fa-info-circle', '/');
  }
  else if (newPath === '/computer') add('computer', '我的电脑', 'fa fa-desktop', '/computer');
  else if (newPath === '/all-notes') add('docs', '我的文章', 'fa fa-folder-open', '/all-notes');
  else if (newPath === '/categories') add('categories', '分类', 'fa fa-cog', '/categories');
  else if (newPath.startsWith('/notes/')) {
    const noteId = route.params.id as string;
    const note = notes.find(n => n.id === noteId);
    add('note', note ? note.title : 'Note', 'fa fa-file-text-o', `/notes/${noteId}`);
  }
  else if (newPath === '/airplane') add('airplane', '飞机大战', 'fa fa-fighter-jet', '/airplane');
  else if (newPath === '/survivors') add('survivor', '桌面保卫战', 'fa fa-shield', '/survivors');
  else if (newPath === '/minesweeper') add('mine', '扫雷', 'fa fa-bomb', '/minesweeper');
  else if (newPath === '/notepad') add('notepad', '记事本 - 未命名', 'fa fa-pencil-square-o', '/notepad');
  else if (newPath === '/paint') add('paint', '画图 - 未命名', 'fa fa-paint-brush', '/paint');
  else if (newPath === '/calculator') add('calculator', '计算器', 'fa fa-calculator', '/calculator');
  else if (newPath === '/terminal') add('terminal', '命令提示符', 'fa fa-terminal', '/terminal');
  else if (newPath === '/typing') add('typing', '打字练习', 'fa fa-keyboard-o', '/typing');
  // '/'：桌面在前台，全部窗口退居任务栏
}, { immediate: true });

// 视图层点 X：移除该窗口，退回打开顺序里它之前最近的窗口；没有则回桌面
const onWinClose = (e: Event): void => {
  const detail = (e as CustomEvent).detail as { ids: string[] } | undefined;
  const ids = detail?.ids ?? [];
  const idx = openWindows.value.findIndex(w => ids.includes(w.id));
  if (idx < 0) return;   // 重复的关窗事件：忽略
  openWindows.value = openWindows.value.filter(w => !ids.includes(w.id));
  const prev = openWindows.value[idx - 1] ?? null;
  if (prev?.path) {
    if (prev.path !== route.path) router.push(prev.path);
    openWindows.value.forEach(w => w.isActive = w.id === prev.id);
  } else {
    openWindows.value.forEach(w => w.isActive = false);
    if (route.path !== '/') router.push('/');
  }
};

const navigateTo = (path: string) => {
  if (path.startsWith('http')) {
    // noopener：新标签页拿不到本站引用，也更防标签劫持
    window.open(path, '_blank', 'noopener,noreferrer');
  } else {
    router.push(path);
  }
};

const activateWindow = (id: string) => {
  // Win98：点已激活窗口的任务栏按钮 = 最小化（窗口隐藏、按钮弹起，再点走恢复路径）
  if (activeWindowId.value === id) {
    window.dispatchEvent(new CustomEvent('win-minimize'));
    const entry = openWindows.value.find(w => w.id === id);
    if (entry) entry.isActive = false;
    return;
  }
  // 时间线回退：点击第 N 个窗口 = 关闭其后打开的全部窗口，回到它
  const idx = openWindows.value.findIndex(w => w.id === id);
  if (idx < 0) return;
  openWindows.value = openWindows.value.slice(0, idx + 1);
  window.dispatchEvent(new CustomEvent('win-restore'));
  const target = openWindows.value[idx];
  if (target.path && target.path !== route.path) router.push(target.path);
  openWindows.value.forEach(w => w.isActive = w.id === id);
};

const isShutdown = ref(false);

const handleShutdown = () => {
  isShutdown.value = true;
};

// ============ 屏幕保护程序（闲置触发，任意输入退出） ============
const saverOn = ref(false);
let idleTimer: ReturnType<typeof setTimeout> | undefined;
const IDLE_MS = (() => {
  const v = parseInt(localStorage.getItem('screensaver-ms') || '', 10);
  return Number.isFinite(v) && v > 0 ? v : 120000; // 默认闲置 2 分钟进入屏保
})();

// 游戏路由（屏保不触发，hash 形式）——玩到一半被管道盖住很离谱；新增游戏路由要同步这里
const GAME_HASHES = ['#/airplane', '#/survivors', '#/minesweeper', '#/terminal', '#/typing'];

function resetIdle(): void {
  if (saverOn.value) saverOn.value = false;
  if (idleTimer) clearTimeout(idleTimer);
  const onGameRoute = GAME_HASHES.includes(location.hash);
  if (IDLE_MS > 0 && !isShutdown.value && !onGameRoute) {
    idleTimer = setTimeout(() => {
      if (GAME_HASHES.includes(location.hash)) {
        saverOn.value = true;
      }
    }, IDLE_MS);
  }
}

function onSaverExit(): void {
  resetIdle();
}

const closeTab = () => {
  window.close();
  // Fallback for browsers that block window.close()
  window.location.href = "about:blank";
};

const showAlert = (message: string) => {
  alert(message);
};

// 桌面主题样式（注意：url() 里用双引号，避免 Tailwind 提取类名时被 \' 转义破坏）
const rootBgClass = computed(() =>
  desktopTheme.value === 'wallpaper' ? 'bg-[url("/wallpaper.webp")] bg-cover bg-center' : ''
);
const rootBgStyle = computed((): Record<string, string> => {
  const t = desktopTheme.value;
  if (t === 'wallpaper') return {};
  return { background: THEMES[t].bg ?? '#008080' };
});
const screenInfo = computed(() => `${window.screen.width} × ${window.screen.height}`);
const dprInfo = computed(() => Math.round((window.devicePixelRatio || 1) * 100) / 100);
</script>

<template>
  <div
    class="h-screen w-screen overflow-hidden flex flex-col relative"
    :class="rootBgClass"
    :style="rootBgStyle"
    @click="onRootClick"
  >
    <!-- 桌面图标（可拖拽排列） -->
    <main
      class="absolute top-0 left-0 bottom-10 w-full z-0"
      @contextmenu="onDesktopContext"
    >
      <div
        v-for="(ic, i) in icons"
        :key="ic.id + '-' + refreshKey"
        class="absolute"
        :data-icon="ic.id"
        :style="posStyle(ic.id, i)"
        @pointerdown="onIconPointerDown($event, ic.id)"
        @pointermove="onIconPointerMove"
        @pointerup="onIconPointerUp"
        @pointercancel="onIconPointerUp"
        @click="onIconClick(ic)"
      >
        <DesktopIcon
          :label="ic.label"
          :iconClass="ic.iconClass"
          :color="ic.color"
        />
      </div>
    </main>

    <!-- 桌面右键菜单 -->
    <div
      v-if="ctxMenu"
      class="fixed z-[80] min-w-[140px] bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] shadow-[3px_3px_8px_rgba(0,0,0,0.4)] py-[3px] text-[12px] text-black"
      :style="{ left: ctxMenu.x + 'px', top: ctxMenu.y + 'px' }"
      @click.stop
    >
      <div class="px-4 py-[5px] cursor-default text-[#808080]" @click="arrangeIcons">排列图标</div>
      <div class="px-4 py-[5px] hover:bg-[#000080] hover:text-white cursor-pointer" @click="refreshDesktop">
        <i class="fa fa-refresh mr-1.5"></i>刷新
      </div>
      <hr class="border-t-[#808080] border-b-[#ffffff] my-[3px] mx-1">
      <div class="px-4 py-[5px] hover:bg-[#000080] hover:text-white cursor-pointer" @click="openSysProps">
        <i class="fa fa-info-circle mr-1.5"></i>属性
      </div>
    </div>

    <!-- 系统属性对话框 -->
    <div v-if="sysPropsOpen" class="fixed inset-0 z-[90] flex items-center justify-center bg-black/25" @click.self="sysPropsOpen = false">
      <div class="w-[400px] max-w-[92vw] bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] shadow-[6px_6px_16px_rgba(0,0,0,0.5)]">
        <div class="h-[26px] bg-[linear-gradient(90deg,#000080,#1084d0)] flex items-center px-2">
          <i class="fa fa-info-circle text-white text-[11px] mr-2"></i>
          <span class="text-white text-[12px] font-bold flex-1">系统属性</span>
          <button @click="sysPropsOpen = false" class="text-white text-[12px] font-bold px-1 cursor-pointer">✕</button>
        </div>
        <div class="p-4 text-[12px] text-black">
          <div class="flex items-center gap-3 mb-3">
            <img src="/icons/windows-0.png" class="w-10 h-10" alt="windows">
            <div>
              <div class="font-bold text-[#000080] text-sm">YF's Blog v2.2</div>
              <div class="text-gray-700 text-[11px]">Windows 98 Edition · Powered by Vue 3</div>
            </div>
          </div>
          <hr class="border-t-[#808080] border-b-[#ffffff] mb-3">
          <table class="w-full">
            <tbody>
              <tr><td class="py-[3px] text-gray-700 w-[84px]">内容</td><td>技术文章 {{ notes.length }} 篇 · 游戏 3 款 · 桌宠 1 只</td></tr>
              <tr><td class="py-[3px] text-gray-700">磁盘 C:</td><td>文档 {{ notes.length }} 个 · 约 <b class="text-[#000080]">{{ diskKB }}</b> KB</td></tr>
              <tr><td class="py-[3px] text-gray-700">处理器</td><td>{{ uaShort }}</td></tr>
              <tr><td class="py-[3px] text-gray-700">显示</td><td>{{ screenInfo }} @ DPR {{ dprInfo }}</td></tr>
              <tr><td class="py-[3px] text-gray-700">访客</td><td>您是本机第 <b class="text-[#000080]">{{ visitCount }}</b> 次到访</td></tr>
              <tr><td class="py-[3px] text-gray-700">注册到</td><td>YF</td></tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end gap-2 px-4 pb-3">
          <button
            @click="sysPropsOpen = false"
            class="min-w-[76px] px-3 py-1 bg-[#c0c0c0] text-[12px] font-bold text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer"
          >确定</button>
        </div>
      </div>
    </div>

    <!-- Router View (Windows) -->
    <div class="z-10 w-full h-full pointer-events-none">
      <router-view v-slot="{ Component }">
        <component :is="Component" class="pointer-events-auto" />
      </router-view>
    </div>

    <!-- 全局搜索：查找全部文件（Ctrl+K / 开始菜单） -->
    <FindDialog :open="findOpen" @close="findOpen = false" @navigate="navigateTo" />

    <!-- 桌宠：QQ 企鹅（走在任务栏上沿） -->
    <QQPet />

    <!-- 屏幕保护程序 -->
    <ScreenSaver v-if="saverOn" @exit="onSaverExit" />

    <!-- Taskbar -->
    <Taskbar
      :openWindows="openWindows"
      @activate-window="activateWindow"
      @navigate="navigateTo"
      @open-find="findOpen = true"
      @shutdown="handleShutdown"
    />

    <!-- Shutdown Screen -->
    <div v-if="isShutdown" class="fixed inset-0 bg-[#008080] z-[100] flex flex-col items-center justify-center gap-6 font-bold font-mono">
      <div class="bg-[#c0c0c0] p-8 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] text-center border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]">
        <div class="flex items-center gap-4 mb-4">
          <img src="/icons/windows-0.png" class="w-12 h-12" alt="windows">
          <div>
            <div class="text-xl text-black">Windows 98</div>
            <div class="text-sm text-gray-600">正在关机...</div>
          </div>
        </div>
        <hr class="border-t-[#808080] border-b-[#ffffff] mb-4">
        <div class="text-lg text-black">It is now safe to turn off your computer.</div>
        <div class="text-xs text-gray-600 mt-1">(现在可以安全地关闭浏览器了)</div>
      </div>
      <button @click="closeTab" class="px-6 py-2 bg-[#c0c0c0] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-bold font-sans border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]">
        关闭页面
      </button>
    </div>
  </div>
</template>

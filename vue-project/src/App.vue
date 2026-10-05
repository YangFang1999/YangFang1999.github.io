<script setup lang="ts">
import { ref, watch, computed, provide, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DesktopIcon from './components/DesktopIcon.vue';
import Taskbar from './components/Taskbar.vue';
import QQPet from './components/QQPet.vue';
import ScreenSaver from './views/ScreenSaver.vue';
import { notes } from './data/notes';
import { desktopTheme, THEMES } from './settings';

const router = useRouter();
const route = useRoute();

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
}

onMounted(() => {
  const n = (parseInt(localStorage.getItem('visit-count') || '0', 10) || 0) + 1;
  try { localStorage.setItem('visit-count', String(n)); } catch { /* 忽略 */ }
  visitCount.value = n;
  window.addEventListener('open-sysprops', openSysProps);
  window.addEventListener('keydown', onRootKeydown);
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
  window.removeEventListener('resize', onWindowResize);
  window.removeEventListener('pointermove', resetIdle);
  window.removeEventListener('pointerdown', resetIdle);
  window.removeEventListener('keydown', resetIdle);
  window.removeEventListener('wheel', resetIdle);
  if (idleTimer) clearTimeout(idleTimer);
});

function onWindowResize(): void {
  vhTick.value++;
  // 窗口变小时把自定义摆放的图标夹回视口内
  for (const [id, p] of Object.entries(iconPos.value)) {
    iconPos.value[id] = {
      x: Math.max(0, Math.min(window.innerWidth - 90, p.x)),
      y: Math.max(0, Math.min(window.innerHeight - 130, p.y)),
    };
  }
  saveLayout();
}

// ============ 桌面图标：定义 + 拖拽布局 ============
interface IconDef {
  id: string; label: string; iconClass: string; color: string;
  to?: string; action?: () => void;
}

const icons: IconDef[] = [
  { id: 'computer', label: '我的电脑', iconClass: 'fa fa-desktop', color: 'text-white', to: '/computer' },
  { id: 'docs', label: '我的文档', iconClass: 'fa fa-folder-open', color: 'text-yellow-400', to: '/all-notes' },
  { id: 'control', label: '控制面板', iconClass: 'fa fa-cog', color: 'text-pink-300', to: '/categories' },
  { id: 'ie', label: 'Internet 浏览器', iconClass: 'fa fa-globe', color: 'text-blue-300', to: 'https://github.com' },
  { id: 'notepad', label: '记事本', iconClass: 'fa fa-pencil-square-o', color: 'text-white', to: '/notepad' },
  { id: 'airplane', label: '飞机大战', iconClass: 'fa fa-fighter-jet', color: 'text-yellow-300', to: '/airplane' },
  { id: 'survivor', label: '桌面保卫战', iconClass: 'fa fa-shield', color: 'text-red-300', to: '/survivors' },
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
}

// ============ 窗口路由模拟 ============
const openWindows = ref<{ id: string; title: string; icon: string; isActive: boolean }[]>([
  { id: 'welcome', title: '欢迎来到 YF 的 Blog.exe', icon: 'fa fa-info-circle', isActive: true }
]);

const activeWindowId = computed(() => {
  const active = openWindows.value.find(w => w.isActive);
  return active?.id || null;
});
provide('activeWindowId', activeWindowId);

watch(() => route.path, (newPath) => {
  const newWindows: { id: string; title: string; icon: string; isActive: boolean }[] = [];

  const welcomeWin = openWindows.value.find(w => w.id === 'welcome');
  if (welcomeWin) newWindows.push({ ...welcomeWin, isActive: false });

  if (newPath === '/computer') {
    newWindows.push({ id: 'computer', title: '我的电脑', icon: 'fa fa-desktop', isActive: true });
  }
  else if (newPath === '/all-notes') {
    newWindows.push({ id: 'computer', title: '我的电脑', icon: 'fa fa-desktop', isActive: false });
    newWindows.push({ id: 'docs', title: '我的文档', icon: 'fa fa-folder-open', isActive: true });
  }
  else if (newPath === '/categories') {
    newWindows.push({ id: 'computer', title: '我的电脑', icon: 'fa fa-desktop', isActive: false });
    newWindows.push({ id: 'categories', title: '分类', icon: 'fa fa-cog', isActive: true });
  }
  else if (newPath.startsWith('/notes/')) {
    const noteId = route.params.id as string;
    const note = notes.find(n => n.id === noteId);
    const title = note ? note.title : 'Note';

    newWindows.push({ id: 'docs', title: '我的文档', icon: 'fa fa-folder-open', isActive: false });
    newWindows.push({ id: 'note', title: title, icon: 'fa fa-file-text-o', isActive: true });
  }
  else if (newPath === '/airplane') {
    newWindows.push({ id: 'airplane', title: '飞机大战', icon: 'fa fa-fighter-jet', isActive: true });
  }
  else if (newPath === '/survivors') {
    newWindows.push({ id: 'survivor', title: '桌面保卫战', icon: 'fa fa-shield', isActive: true });
  }
  else if (newPath === '/notepad') {
    newWindows.push({ id: 'notepad', title: '记事本 - 未命名', icon: 'fa fa-pencil-square-o', isActive: true });
  }
  else if (newPath === '/paint') {
    newWindows.push({ id: 'paint', title: '画图 - 未命名', icon: 'fa fa-paint-brush', isActive: true });
  }
  else if (newPath === '/calculator') {
    newWindows.push({ id: 'calculator', title: '计算器', icon: 'fa fa-calculator', isActive: true });
  }

  openWindows.value = newWindows;
}, { immediate: true });

const navigateTo = (path: string) => {
  if (path.startsWith('http')) {
    window.open(path, '_blank');
  } else {
    router.push(path);
  }
};

const activateWindow = (id: string) => {
  if (id === 'computer') router.push('/computer');
  else if (id === 'docs') router.push('/all-notes');
  else if (id === 'welcome') router.push('/');
  else if (id === 'categories') router.push('/categories');
  else if (id === 'airplane') router.push('/airplane');
  else if (id === 'survivor') router.push('/survivors');
  else if (id === 'notepad') router.push('/notepad');
  else if (id === 'paint') router.push('/paint');
  else if (id === 'calculator') router.push('/calculator');

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
  return Number.isFinite(v) && v > 0 ? v : 60000;
})();

function resetIdle(): void {
  if (saverOn.value) saverOn.value = false;
  if (idleTimer) clearTimeout(idleTimer);
  // 游戏进行中不触发屏保（玩到一半被管道盖住很离谱）
  const onGameRoute = ['#/airplane', '#/survivors', '#/terminal', '#/typing'].includes(location.hash);
  if (IDLE_MS > 0 && !isShutdown.value && !onGameRoute) {
    idleTimer = setTimeout(() => {
      if (!['#/airplane', '#/survivors', '#/terminal', '#/typing'].includes(location.hash)) {
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
  desktopTheme.value === 'wallpaper' ? 'bg-[url("/wallpaper.jpg")] bg-cover bg-center' : ''
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
              <tr><td class="py-[3px] text-gray-700 w-[84px]">内容</td><td>技术文章 {{ notes.length }} 篇 · 游戏 2 款 · 桌宠 1 只</td></tr>
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

    <!-- 桌宠：QQ 企鹅（走在任务栏上沿） -->
    <QQPet />

    <!-- 屏幕保护程序 -->
    <ScreenSaver v-if="saverOn" @exit="onSaverExit" />

    <!-- Taskbar -->
    <Taskbar
      :openWindows="openWindows"
      @activate-window="activateWindow"
      @navigate="navigateTo"
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

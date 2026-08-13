<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  title: string;
  icon?: string;
  isOpen: boolean;
  isActive: boolean;
  defaultMaximized?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'minimize'): void;
  (e: 'maximize'): void;
  (e: 'focus'): void;
}>();

const activeMenu = ref<string | null>(null);
const isMaximized = ref(false);
const isMinimized = ref(false);
const isSystemMenuOpen = ref(false);

// Draggable window state
const windowEl = ref<HTMLElement | null>(null);
const windowPos = ref<{ left: number; top: number } | null>(null);
const isDragging = ref(false);
let dragStartX = 0;
let dragStartY = 0;
let dragOrigLeft = 0;
let dragOrigTop = 0;

watch(() => props.isActive, (active) => {
  if (active && isMinimized.value) {
    isMinimized.value = false;
  }
});

interface MenuItem {
  type?: 'separator';
  label?: string;
  shortcut?: string;
  disabled?: boolean;
  checked?: boolean;
  action?: () => void;
}

const menus: { id: string; label: string; items: MenuItem[] }[] = [
  {
    id: 'file',
    label: '文件(<u>F</u>)',
    items: [
      { label: '新建(<u>N</u>)', shortcut: 'Ctrl+N', disabled: true },
      { label: '打开(<u>O</u>)...', shortcut: 'Ctrl+O', disabled: true },
      { type: 'separator' },
      { label: '保存(<u>S</u>)', shortcut: 'Ctrl+S', disabled: true },
      { label: '另存为(<u>A</u>)...', disabled: true },
      { type: 'separator' },
      { label: '页面设置(<u>U</u>)...', disabled: true },
      { label: '打印(<u>P</u>)...', shortcut: 'Ctrl+P', disabled: true },
      { type: 'separator' },
      { label: '关闭(<u>C</u>)', shortcut: 'Alt+F4', action: () => { closeMenu(); emit('close'); } },
    ]
  },
  {
    id: 'edit',
    label: '编辑(<u>E</u>)',
    items: [
      { label: '撤销(<u>U</u>)', shortcut: 'Ctrl+Z', disabled: true },
      { type: 'separator' },
      { label: '剪切(<u>T</u>)', shortcut: 'Ctrl+X', disabled: true },
      { label: '复制(<u>C</u>)', shortcut: 'Ctrl+C', disabled: true },
      { label: '粘贴(<u>P</u>)', shortcut: 'Ctrl+V', disabled: true },
      { type: 'separator' },
      { label: '全选(<u>A</u>)', shortcut: 'Ctrl+A', disabled: true },
    ]
  },
  {
    id: 'view',
    label: '查看(<u>V</u>)',
    items: [
      { label: '工具栏(<u>T</u>)', disabled: true, checked: true },
      { label: '状态栏(<u>S</u>)', checked: true, action: () => { closeMenu(); } },
      { type: 'separator' },
      { label: '大图标(<u>G</u>)', disabled: true },
      { label: '小图标(<u>M</u>)', disabled: true },
      { label: '列表(<u>L</u>)', disabled: true },
      { label: '详细资料(<u>D</u>)', disabled: true },
      { type: 'separator' },
      { label: '刷新(<u>R</u>)', shortcut: 'F5', action: () => { closeMenu(); window.location.reload(); } },
    ]
  },
  {
    id: 'help',
    label: '帮助(<u>H</u>)',
    items: [
      { label: '帮助主题(<u>H</u>)', disabled: true },
      { type: 'separator' },
      { label: '关于本程序(<u>A</u>)...', action: () => { closeMenu(); alert('YF Blog v2.0\nWindows 98 Edition\n基于 Vue 3 + TypeScript + Vite\n\n© 2024 YF. All rights reserved.'); } },
    ]
  },
];

const systemMenuItems = computed<MenuItem[]>(() => [
  { label: '还原(<u>R</u>)', disabled: !isMaximized.value, action: () => { closeSystemMenu(); isMaximized.value = false; } },
  { label: '移动(<u>M</u>)', disabled: true },
  { label: '大小(<u>S</u>)', disabled: true },
  { label: '最小化(<u>N</u>)', action: () => { closeSystemMenu(); emit('minimize'); } },
  { label: '最大化(<u>X</u>)', disabled: isMaximized.value, action: () => { closeSystemMenu(); isMaximized.value = true; } },
  { type: 'separator' as const },
  { label: '关闭(<u>C</u>)', shortcut: 'Alt+F4', action: () => { closeSystemMenu(); emit('close'); } },
]);

const toggleMenu = (menuId: string) => {
  if (activeMenu.value === menuId) {
    activeMenu.value = null;
  } else {
    activeMenu.value = menuId;
  }
};

const hoverMenu = (menuId: string) => {
  if (activeMenu.value !== null) {
    activeMenu.value = menuId;
  }
};

const closeMenu = () => {
  activeMenu.value = null;
};

const closeSystemMenu = () => {
  isSystemMenuOpen.value = false;
};

const toggleSystemMenu = () => {
  isSystemMenuOpen.value = !isSystemMenuOpen.value;
};

const handleMaximize = () => {
  isMaximized.value = !isMaximized.value;
};

const handleMinimize = () => {
  isMinimized.value = true;
  emit('minimize');
};

const handleClose = () => {
  emit('close');
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.win-menu-bar') && !target.closest('.win-dropdown') && !target.closest('.win-system-menu-trigger')) {
    closeMenu();
    closeSystemMenu();
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (activeMenu.value) closeMenu();
    else if (isSystemMenuOpen.value) closeSystemMenu();
  }
  if (e.altKey && e.key === 'F4') {
    e.preventDefault();
    handleClose();
  }
  if (e.altKey) {
    const keyMap: Record<string, string> = { f: 'file', e: 'edit', v: 'view', h: 'help' };
    const menuId = keyMap[e.key.toLowerCase()];
    if (menuId) {
      e.preventDefault();
      toggleMenu(menuId);
    }
  }
};

const windowStyle = computed(() => {
  if (isMaximized.value) {
    return {
      top: '0',
      left: '0',
      transform: 'none',
      width: '100%',
      maxWidth: '100%',
      height: 'calc(100% - 40px)',
      maxHeight: 'calc(100vh - 40px)',
    };
  }
  if (windowPos.value) {
    return {
      top: windowPos.value.top + 'px',
      left: windowPos.value.left + 'px',
      transform: 'none',
      width: '95%',
      maxWidth: '42rem',
      height: 'auto',
      maxHeight: '80vh',
    };
  }
  return {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    maxWidth: '42rem',
    height: 'auto',
    maxHeight: '80vh',
  };
});

const startDrag = (e: MouseEvent) => {
  if (isMaximized.value) return;
  const el = windowEl.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  windowPos.value = { left: rect.left, top: rect.top };
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  dragOrigLeft = rect.left;
  dragOrigTop = rect.top;
  isDragging.value = true;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
};

const onDrag = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const el = windowEl.value;
  if (!el) return;
  const left = Math.min(
    window.innerWidth - 60,
    Math.max(-(el.offsetWidth - 60), dragOrigLeft + (e.clientX - dragStartX))
  );
  const top = Math.min(
    window.innerHeight - 30,
    Math.max(0, dragOrigTop + (e.clientY - dragStartY))
  );
  windowPos.value = { left, top };
};

const endDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
};

onMounted(() => {
  if (props.defaultMaximized) {
    isMaximized.value = true;
  }
  document.addEventListener('click', handleClickOutside, true);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside, true);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div
    v-if="isOpen && !isMinimized"
    ref="windowEl"
    class="win-window fixed bg-[#c0c0c0] flex flex-col z-20 border-2"
    :class="isActive ? 'border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]' : ''"
    :style="windowStyle"
    @mousedown="emit('focus')"
  >
    <!-- Title Bar -->
    <div
      class="win-titlebar flex items-center select-none shrink-0 h-[26px] px-[2px] gap-[2px]"
      :class="isActive
        ? 'bg-[linear-gradient(90deg,#000080,#1084d0)]'
        : 'bg-[linear-gradient(90deg,#808080,#b5b5b5)]'"
      @mousedown="startDrag"
      @dblclick="handleMaximize"
    >
      <!-- Window Icon (System Menu trigger) -->
      <button
        class="win-system-menu-trigger w-[18px] h-[18px] flex items-center justify-center shrink-0 cursor-pointer bg-transparent border-none p-0"
        @click.stop="toggleSystemMenu"
        @mousedown.stop
      >
        <i v-if="icon" :class="[icon, isActive ? 'text-white text-[11px]' : 'text-[#c0c0c0] text-[11px]']"></i>
      </button>

      <!-- Title -->
      <span
        class="flex-1 text-[11px] font-bold truncate leading-none select-none"
        :class="isActive ? 'text-white' : 'text-[#c0c0c0]'"
      >
        {{ title }}
      </span>

      <!-- Window Controls -->
      <div class="flex gap-[2px] shrink-0" @mousedown.stop @dblclick.stop>
        <!-- Minimize -->
        <button
          @click.stop="handleMinimize"
          class="win-ctrl-btn w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] flex items-end justify-center active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer border-none p-0"
          title="最小化"
        >
          <div class="w-[8px] h-[2px] bg-black mb-[2px]"></div>
        </button>

        <!-- Maximize / Restore -->
        <button
          @click.stop="handleMaximize"
          class="win-ctrl-btn w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] flex items-center justify-center active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer border-none p-0 relative"
          :title="isMaximized ? '还原' : '最大化'"
        >
          <template v-if="isMaximized">
            <!-- Restore icon: two overlapping squares -->
            <div class="relative w-[10px] h-[9px]">
              <div class="absolute top-0 right-0 w-[7px] h-[6px] bg-[#c0c0c0] border-[1.5px] border-t-[#0a0a0a] border-l-[#0a0a0a] border-b-[#ffffff] border-r-[#ffffff] shadow-[inset_0_0_0_0.5px_#808080]"></div>
              <div class="absolute bottom-0 left-0 w-[7px] h-[6px] bg-[#c0c0c0] border-[1.5px] border-t-[#ffffff] border-l-[#ffffff] border-b-[#0a0a0a] border-r-[#0a0a0a] shadow-[inset_0_0_0_0.5px_#808080]"></div>
            </div>
          </template>
          <template v-else>
            <!-- Maximize icon: single square -->
            <div class="w-[8px] h-[8px] bg-[#c0c0c0] border-[1.5px] border-t-[#ffffff] border-l-[#ffffff] border-b-[#0a0a0a] border-r-[#0a0a0a] shadow-[inset_0_0_0_0.5px_#808080]"></div>
          </template>
        </button>

        <!-- Close -->
        <button
          @click.stop="handleClose"
          class="win-ctrl-btn w-[16px] h-[14px] bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] flex items-center justify-center active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer border-none p-0"
          title="关闭"
        >
          <svg viewBox="0 0 6 6" class="w-[6px] h-[6px]">
            <line x1="0.5" y1="0.5" x2="5.5" y2="5.5" stroke="black" stroke-width="1.2"/>
            <line x1="5.5" y1="0.5" x2="0.5" y2="5.5" stroke="black" stroke-width="1.2"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- System Menu Dropdown -->
    <div v-if="isSystemMenuOpen" class="win-dropdown absolute top-[26px] left-[2px] z-50 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] shadow-[inset_-1px_-1px_#808080,inset_1px_1px_#dfdfdf] py-[2px] min-w-[180px] text-[11px] text-black">
      <template v-for="(item, idx) in systemMenuItems" :key="idx">
        <hr v-if="item.type === 'separator'" class="border-t-[#808080] border-b-[#ffffff] mx-[2px] my-[3px]">
        <div
          v-else
          class="win-menu-item px-[18px] py-[4px] flex items-center justify-between cursor-pointer whitespace-nowrap"
          :class="item.disabled ? 'text-[#808080] cursor-default' : 'hover:bg-[#000080] hover:text-white'"
          @click.stop="item.disabled ? null : item.action?.()"
        >
          <span class="text-[11px]" v-html="item.label"></span>
          <span v-if="item.shortcut" class="ml-[24px] text-[11px]">{{ item.shortcut }}</span>
        </div>
      </template>
    </div>

    <!-- Menu Bar -->
    <div class="win-menu-bar flex px-[2px] py-[2px] text-[11px] select-none bg-[#c0c0c0] gap-0 shrink-0">
      <div
        v-for="menu in menus"
        :key="menu.id"
        class="win-menu-header px-[6px] py-[3px] cursor-pointer relative whitespace-nowrap text-black"
        :class="activeMenu === menu.id ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'"
        @click.stop="toggleMenu(menu.id)"
        @mouseenter="hoverMenu(menu.id)"
      >
        <span v-html="menu.label"></span>
        <!-- Dropdown -->
        <div
          v-if="activeMenu === menu.id"
          class="win-dropdown absolute top-full left-0 z-50 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] shadow-[inset_-1px_-1px_#808080,inset_1px_1px_#dfdfdf] py-[2px] min-w-[200px]"
        >
          <template v-for="(item, idx) in menu.items" :key="idx">
            <hr v-if="item.type === 'separator'" class="border-t-[#808080] border-b-[#ffffff] mx-[2px] my-[3px]">
            <div
              v-else
              class="win-menu-item px-[18px] py-[4px] flex items-center cursor-pointer whitespace-nowrap"
              :class="item.disabled ? 'text-[#808080] cursor-default' : 'hover:bg-[#000080] hover:text-white'"
              @click.stop="item.disabled ? null : item.action?.()"
            >
              <!-- Checkmark area -->
              <span class="w-[16px] shrink-0 text-[11px]">
                <span v-if="item.checked">&#x2713;</span>
              </span>
              <!-- Label -->
              <span class="flex-1 text-[11px]" v-html="item.label"></span>
              <!-- Shortcut -->
              <span v-if="item.shortcut" class="ml-[24px] text-[11px]">{{ item.shortcut }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 bg-white shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] m-[4px] p-[4px] overflow-y-auto text-black min-h-0">
      <slot></slot>
    </div>

    <!-- Status Bar -->
    <div class="flex px-[4px] py-[2px] text-[11px] text-black border-t-2 border-t-[#808080] border-b border-b-[#ffffff] bg-[#c0c0c0] shrink-0 select-none gap-[8px]">
      <span class="flex-1">就绪</span>
      <span class="text-[11px]">| 100%</span>
    </div>
  </div>
</template>

<style scoped>
.win-window {
  box-shadow:
    0 0 0 1px #000,
    6px 6px 16px rgba(0, 0, 0, 0.45),
    inset -1px -1px #0a0a0a, inset 1px 1px #ffffff,
    inset -2px -2px #808080, inset 2px 2px #dfdfdf;
}

.win-menu-header u {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.win-menu-item {
  font-family: 'MS Sans Serif', 'Tahoma', 'Microsoft YaHei', sans-serif;
}

.win-ctrl-btn {
  font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
}
</style>

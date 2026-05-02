<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isStartMenuOpen = ref(false);
const currentTime = ref('');
const currentDate = ref('');

const updateClock = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;

  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  currentDate.value = `${y}-${m}-${d}`;
};

let intervalId: ReturnType<typeof setInterval>;

onMounted(() => {
  updateClock();
  intervalId = setInterval(updateClock, 30000);
  document.addEventListener('click', closeStartMenuOutside);
});

onUnmounted(() => {
  clearInterval(intervalId);
  document.removeEventListener('click', closeStartMenuOutside);
});

const toggleStartMenu = (e: Event) => {
  e.stopPropagation();
  isStartMenuOpen.value = !isStartMenuOpen.value;
};

const closeStartMenuOutside = (e: Event) => {
  const startMenu = document.getElementById('start-menu');
  const startBtn = document.getElementById('start-btn');
  if (startMenu && !startMenu.contains(e.target as Node) && startBtn && !startBtn.contains(e.target as Node)) {
    isStartMenuOpen.value = false;
  }
};

const emit = defineEmits<{
  (e: 'activate-window', id: string): void;
  (e: 'navigate', path: string): void;
  (e: 'shutdown'): void;
}>();

defineProps<{
  openWindows: { id: string; title: string; icon: string; isActive: boolean }[];
}>();
</script>

<template>
  <!-- Start Menu -->
  <Transition name="start-menu">
    <div
      v-if="isStartMenuOpen"
      id="start-menu"
      class="absolute bottom-10 left-1 bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] w-52 flex flex-col z-[60] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]"
    >
      <div class="flex">
        <!-- Side banner -->
        <div class="w-8 bg-[#000080] text-[#c0c0c0] flex items-end justify-center pb-2 shrink-0">
          <span class="transform -rotate-90 text-lg font-bold whitespace-nowrap tracking-[4px] mb-6 origin-center" style="font-family: 'Georgia', serif;">
            YF-Blog
          </span>
        </div>
        <!-- Menu items -->
        <div class="flex-1 py-1 text-sm text-black">
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="emit('navigate', '/')">
            <i class="fa fa-desktop w-4 text-center"></i>
            <span>桌面</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="emit('navigate', '/all-notes')">
            <i class="fa fa-folder-open w-4 text-center"></i>
            <span>我的文档</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="emit('navigate', '/categories')">
            <i class="fa fa-cog w-4 text-center"></i>
            <span>控制面板</span>
          </div>
          <hr class="border-t-[#808080] border-b-[#ffffff] my-1.5 mx-1">
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" onclick="window.open('https://github.com', '_blank')">
            <i class="fa fa-globe w-4 text-center"></i>
            <span>Internet 浏览器</span>
          </div>
          <hr class="border-t-[#808080] border-b-[#ffffff] my-1.5 mx-1">
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="emit('shutdown')">
            <i class="fa fa-power-off w-4 text-center"></i>
            <span>关闭系统...</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Taskbar -->
  <footer class="h-10 bg-[#c0c0c0] shadow-[inset_0_1px_0_#ffffff,inset_0_2px_0_#dfdfdf] flex items-center px-0.5 py-0.5 gap-1 z-50 fixed bottom-0 w-full select-none border-t-2 border-t-[#ffffff]">
    <!-- Start Button -->
    <button
      id="start-btn"
      @click="toggleStartMenu"
      class="flex items-center gap-1.5 px-2 py-1 font-bold text-sm win-btn text-black h-[28px] shrink-0"
      :class="isStartMenuOpen ? 'shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080]' : 'shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]'"
    >
      <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" class="w-5 h-5" alt="win">
      开始
    </button>

    <div class="w-[3px] h-[22px] bg-[#808080] border-r border-[#ffffff] shrink-0"></div>

    <!-- Running Windows -->
    <div class="flex-1 flex justify-start gap-1 overflow-hidden px-0.5 min-w-0">
      <div
        v-for="win in openWindows"
        :key="win.id"
        class="px-2 py-1 font-bold text-xs flex items-center gap-1.5 w-[140px] md:w-[170px] shrink min-w-0 cursor-pointer text-black h-[26px]"
        :class="win.isActive
          ? 'shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] bg-[#c0c0c0]'
          : 'shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf]'"
        @click="emit('activate-window', win.id)"
      >
        <i :class="win.icon" class="shrink-0 text-xs"></i>
        <span class="truncate">{{ win.title }}</span>
      </div>
    </div>

    <!-- System Tray -->
    <div class="px-2.5 py-0.5 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] flex items-center gap-2 text-xs h-[26px] shrink-0 bg-[#c0c0c0]">
      <i class="fa fa-volume-up text-[11px]"></i>
      <div class="flex flex-col items-end leading-none">
        <span class="text-[11px]">{{ currentTime }}</span>
        <span class="text-[9px] text-gray-600">{{ currentDate }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.start-menu-enter-active {
  transition: opacity 0.12s ease-out, transform 0.12s ease-out;
}
.start-menu-leave-active {
  transition: opacity 0.08s ease-in, transform 0.08s ease-in;
}
.start-menu-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.start-menu-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>

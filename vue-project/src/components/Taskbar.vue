<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isStartMenuOpen = ref(false);
const currentTime = ref('');

const updateClock = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 
  currentTime.value = `${hours}:${minutes} ${ampm}`;
};

let intervalId: number;

onMounted(() => {
  updateClock();
  intervalId = setInterval(updateClock, 1000);
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
  <div 
    id="start-menu" 
    v-if="isStartMenuOpen"
    class="absolute bottom-10 left-1 bg-silver shadow-win95-outset w-48 flex flex-col z-[60]"
  >
    <div class="flex">
      <div class="w-8 bg-navy text-white flex items-end justify-center pb-2 relative">
        <span class="transform -rotate-90 text-lg font-bold whitespace-nowrap tracking-widest mb-4">RetroOS</span>
      </div>
      <div class="flex-1 py-1 text-sm text-black">
        <div class="hover:bg-navy hover:text-white px-2 py-1 flex items-center gap-2 cursor-pointer" @click="emit('navigate', '/')">
          <i class="fa fa-desktop"></i> 桌面
        </div>
        <div class="hover:bg-navy hover:text-white px-2 py-1 flex items-center gap-2 cursor-pointer" @click="emit('navigate', '/all-notes')">
          <i class="fa fa-folder-open"></i> 文章
        </div>
        <div class="hover:bg-navy hover:text-white px-2 py-1 flex items-center gap-2 cursor-pointer" @click="emit('navigate', '/categories')">
          <i class="fa fa-cog"></i> 分类
        </div>
        <div class="hover:bg-navy hover:text-white px-2 py-1 flex items-center gap-2 cursor-pointer" onclick="window.open('https://github.com', '_blank')">
          <i class="fa fa-globe"></i> Internet
        </div>
        <div class="border-t border-gray-400 border-b border-white my-1"></div>
        <div class="hover:bg-navy hover:text-white px-2 py-1 flex items-center gap-2 cursor-pointer" @click="emit('shutdown')">
          <i class="fa fa-power-off"></i> 关闭系统...
        </div>
      </div>
    </div>
  </div>

  <!-- Taskbar -->
  <footer class="h-10 bg-silver shadow-win95-outset flex items-center px-1 py-1 gap-1 z-50 fixed bottom-0 w-full select-none">
    <button 
      id="start-btn" 
      @click="toggleStartMenu" 
      class="flex items-center gap-1 px-2 py-1 bg-silver shadow-win95-outset active:shadow-win95-inset font-bold text-sm win-btn text-black"
      :class="{ 'shadow-win95-inset': isStartMenuOpen }"
    >
      <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" class="w-5 h-5" alt="win">
      开始
    </button>

    <div class="w-[2px] h-6 bg-gray border-r border-white mx-1"></div>

    <!-- Taskbar Items -->
    <div class="flex-1 flex justify-start gap-1 overflow-hidden px-1">
      <div 
        v-for="win in openWindows" 
        :key="win.id"
        class="px-2 py-1 font-bold text-sm flex items-center gap-2 w-32 md:w-40 shrink min-w-0 cursor-pointer text-black"
        :class="win.isActive ? 'bg-silver shadow-win95-inset bg-gray/20 border border-dotted border-gray-400' : 'bg-silver shadow-win95-outset'"
        @click="emit('activate-window', win.id)"
      >
        <i :class="win.icon" class="shrink-0"></i> 
        <span class="truncate">{{ win.title }}</span>
      </div>
    </div>

    <div class="px-3 py-1 bg-silver shadow-win95-inset flex items-center gap-2 text-xs min-w-[80px] justify-end text-black">
      <span>{{ currentTime }}</span>
    </div>
  </footer>
</template>

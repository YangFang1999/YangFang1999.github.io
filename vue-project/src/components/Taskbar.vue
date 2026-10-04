<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const isStartMenuOpen = ref(false);
const currentTime = ref('');
const todayStr = ref('');
const calendarOpen = ref(false);
const viewYear = ref(0);
const viewMonth = ref(0);   // 0-11

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function fmtFullDate(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${WEEKDAYS[d.getDay()]}`;
}

const updateClock = () => {
  const now = new Date();
  // 只有分钟变化时才更新，避免每秒无谓重渲染
  const t = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  if (t !== currentTime.value) currentTime.value = t;
  const full = fmtFullDate(now);
  if (full !== todayStr.value) todayStr.value = full;
};

// ============ 日历 ============
interface CalendarCell { day: number; inMonth: boolean; isToday: boolean }

const calendarWeeks = computed<CalendarCell[][]>(() => {
  const y = viewYear.value, m = viewMonth.value;
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrev = new Date(y, m, 0).getDate();
  const now = new Date();
  const cells: CalendarCell[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, inMonth: false, isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, isToday: d === now.getDate() && m === now.getMonth() && y === now.getFullYear() });
  }
  let nextLead = 1;
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({ day: nextLead++, inMonth: false, isToday: false });
  }
  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
});

function prevMonth(): void {
  viewMonth.value--;
  if (viewMonth.value < 0) { viewMonth.value = 11; viewYear.value--; }
}

function nextMonth(): void {
  viewMonth.value++;
  if (viewMonth.value > 11) { viewMonth.value = 0; viewYear.value++; }
}

function toggleCalendar(): void {
  if (!calendarOpen.value) {
    const now = new Date();
    viewYear.value = now.getFullYear();
    viewMonth.value = now.getMonth();
  }
  calendarOpen.value = !calendarOpen.value;
}

let intervalId: ReturnType<typeof setInterval> | undefined;

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

const handleMenuNavigate = (path: string) => {
  isStartMenuOpen.value = false;
  emit('navigate', path);
};

const closeStartMenuOutside = (e: Event) => {
  const target = e.target as Node;
  const startMenu = document.getElementById('start-menu');
  const startBtn = document.getElementById('start-btn');
  if (startMenu && !startMenu.contains(target) && startBtn && !startBtn.contains(target)) {
    isStartMenuOpen.value = false;
  }
  // 点击日历/时钟以外区域时收起日历
  const calendar = document.getElementById('taskbar-calendar');
  const clockBtn = document.getElementById('taskbar-clock');
  if (calendarOpen.value && calendar && !calendar.contains(target) && clockBtn && !clockBtn.contains(target)) {
    calendarOpen.value = false;
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
      class="absolute bottom-10 left-1 bg-[#c0c0c0] shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] w-52 flex flex-col z-[60] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] max-h-[calc(100vh-56px)] overflow-y-auto"
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
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/')">
            <i class="fa fa-desktop w-4 text-center"></i>
            <span>桌面</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/all-notes')">
            <i class="fa fa-folder-open w-4 text-center"></i>
            <span>我的文档</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/categories')">
            <i class="fa fa-cog w-4 text-center"></i>
            <span>控制面板</span>
          </div>
          <hr class="border-t-[#808080] border-b-[#ffffff] my-1.5 mx-1">
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/airplane')">
            <i class="fa fa-fighter-jet w-4 text-center"></i>
            <span>飞机大战</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/survivors')">
            <i class="fa fa-shield w-4 text-center"></i>
            <span>桌面保卫战</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/notepad')">
            <i class="fa fa-pencil-square-o w-4 text-center"></i>
            <span>记事本</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/paint')">
            <i class="fa fa-paint-brush w-4 text-center"></i>
            <span>画图</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/calculator')">
            <i class="fa fa-calculator w-4 text-center"></i>
            <span>计算器</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/terminal')">
            <i class="fa fa-terminal w-4 text-center"></i>
            <span>命令提示符</span>
          </div>
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('/typing')">
            <i class="fa fa-keyboard-o w-4 text-center"></i>
            <span>打字练习</span>
          </div>
          <hr class="border-t-[#808080] border-b-[#ffffff] my-1.5 mx-1">
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="handleMenuNavigate('https://github.com')">
            <i class="fa fa-globe w-4 text-center"></i>
            <span>Internet 浏览器</span>
          </div>
          <hr class="border-t-[#808080] border-b-[#ffffff] my-1.5 mx-1">
          <div class="px-3 py-1.5 flex items-center gap-2.5 cursor-pointer hover:bg-[#000080] hover:text-white transition-colors" @click="isStartMenuOpen = false; emit('shutdown')">
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
      <img src="/icons/windows-0.png" class="w-5 h-5" alt="win">
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

    <!-- System Tray：音量 + 分隔线 + 时钟（点击弹日历，悬停看完整日期） -->
    <div class="px-1.5 py-0.5 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a,inset_-2px_-2px_#dfdfdf,inset_2px_2px_#808080] flex items-center h-[26px] shrink-0 bg-[#c0c0c0] gap-1">
      <i class="fa fa-volume-up text-[11px] text-black px-[3px]" title="音量"></i>
      <div class="w-[3px] self-stretch my-[3px] bg-[#808080] border-r border-[#ffffff]"></div>
      <button
        id="taskbar-clock"
        @click.stop="toggleCalendar"
        :title="todayStr"
        class="px-1.5 h-[20px] text-[11px] font-bold text-black cursor-pointer border border-transparent hover:border-dotted hover:border-[#808080] active:border-dotted active:border-[#808080]"
        style="font-variant-numeric: tabular-nums; font-family: 'MS Sans Serif', Tahoma, sans-serif;"
      >
        {{ currentTime }}
      </button>
    </div>

    <!-- 日历弹窗 -->
    <div
      v-if="calendarOpen"
      id="taskbar-calendar"
      class="absolute bottom-10 right-1 z-[60] w-[224px] bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] shadow-[3px_3px_10px_rgba(0,0,0,0.45)] select-none"
      @click.stop
    >
      <div class="h-[24px] bg-[linear-gradient(90deg,#000080,#1084d0)] flex items-center justify-between px-1">
        <button @click="prevMonth" class="w-5 h-[18px] text-white text-[10px] flex items-center justify-center hover:bg-[#000080] cursor-pointer">◀</button>
        <span class="text-white text-[11px] font-bold">{{ viewYear }}年{{ viewMonth + 1 }}月</span>
        <button @click="nextMonth" class="w-5 h-[18px] text-white text-[10px] flex items-center justify-center hover:bg-[#000080] cursor-pointer">▶</button>
      </div>
      <div class="p-1.5">
        <div class="grid grid-cols-7 text-center text-[10px] font-bold text-[#000080] mb-1">
          <span v-for="d in WEEKDAYS" :key="d">{{ d }}</span>
        </div>
        <div class="grid grid-cols-7 text-center text-[11px]">
          <template v-for="(week, wi) in calendarWeeks" :key="wi">
            <span v-for="(cell, ci) in week" :key="wi + '-' + ci" class="py-[2px]">
              <span
                class="inline-block w-[24px] py-[1px] cursor-default"
                :class="cell.isToday
                  ? 'bg-[#000080] text-white font-bold'
                  : cell.inMonth ? 'text-black hover:bg-[#000080] hover:text-white' : 'text-[#999]'"
              >{{ cell.day }}</span>
            </span>
          </template>
        </div>
      </div>
      <div class="px-2 pb-1.5 text-[10px] text-gray-700 border-t border-t-[#808080] pt-1" style="border-top-color:#808080; box-shadow: inset 0 1px 0 #fff;">
        {{ todayStr }}
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

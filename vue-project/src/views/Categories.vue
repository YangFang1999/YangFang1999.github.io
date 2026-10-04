<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';
import { desktopTheme, setTheme, THEMES, type DesktopTheme } from '../settings';

const router = useRouter();

const categories = ref([
  { id: 'java', title: 'Java', icon: 'fa fa-coffee', color: 'text-orange-500' },
  { id: 'spring', title: 'Spring', icon: 'fa fa-leaf', color: 'text-green-500' },
  { id: 'database', title: 'Database', icon: 'fa fa-database', color: 'text-blue-500' },
  { id: 'frontend', title: 'Frontend', icon: 'fa fa-code', color: 'text-pink-500' },
  { id: 'devops', title: 'DevOps', icon: 'fa fa-server', color: 'text-purple-500' },
]);

const navigateTo = (path: string) => {
  if (path.startsWith('http')) {
    window.open(path, '_blank');
  } else {
    router.push(path);
  }
};

function pickTheme(t: DesktopTheme): void {
  setTheme(t);
}

function petGoHome(): void {
  window.dispatchEvent(new CustomEvent('pet-go-home'));
}

function openSysProps(): void {
  window.dispatchEvent(new CustomEvent('open-sysprops'));
}
</script>

<template>
    <Window
      title="控制面板"
      icon="fa fa-cog"
      :isOpen="true"
      :isActive="true"
      @close="router.push('/')"
    >
      <!-- Address Bar -->
      <div class="flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-2">
        <span class="text-xs">地址(D)</span>
        <div class="flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2">
            <i class="fa fa-folder-open text-yellow-400"></i>
            C:\控制面板\分类
        </div>
      </div>

      <div class="grid grid-cols-4 md:grid-cols-6 gap-4">
        <div
          v-for="cat in categories"
          :key="cat.id"
          class="flex flex-col items-center gap-1 cursor-pointer group w-20"
          @click="navigateTo('/all-notes?category=' + cat.id)"
        >
          <div class="w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform" :class="cat.color" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
            <i :class="cat.icon"></i>
          </div>
          <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm">
            {{ cat.title }}
          </span>
        </div>
      </div>

      <!-- 系统设置 -->
      <div class="mt-4 pt-2 border-t border-t-[#808080] border-b border-b-[#ffffff]">
        <div class="text-xs text-gray-700 font-bold mb-2">
          <i class="fa fa-sliders mr-1"></i>系统设置
        </div>
        <div class="flex flex-wrap items-center gap-2 text-[11px]">
          <span class="text-gray-600">显示属性：</span>
          <button
            v-for="(t, id) in THEMES"
            :key="id"
            @click="pickTheme(id as DesktopTheme)"
            class="px-2 py-[3px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-bold"
            :style="{ backgroundColor: desktopTheme === id ? '#a8d8a8' : '#c0c0c0' }"
          >
            <span v-if="t.bg" class="inline-block w-2.5 h-2.5 mr-1 align-middle border border-black" :style="{ background: t.bg }"></span>
            {{ t.name }}
          </button>
          <span class="w-full"></span>
          <button
            @click="petGoHome"
            class="px-2 py-[3px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer"
          >
            <i class="fa fa-home mr-1"></i>桌宠回任务栏
          </button>
          <button
            @click="openSysProps"
            class="px-2 py-[3px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer"
          >
            <i class="fa fa-info-circle mr-1"></i>系统属性
          </button>
        </div>
      </div>

      <div class="mt-3 pt-2 text-xs text-gray-500 border-t border-gray-300">
        {{ categories.length }} 个分类
      </div>
    </Window>
</template>

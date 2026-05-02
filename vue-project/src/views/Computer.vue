<script setup lang="ts">
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';

const router = useRouter();

const navigateTo = (path: string) => {
  if (path.startsWith('http')) {
    window.open(path, '_blank');
  } else {
    router.push(path);
  }
};
</script>

<template>
    <Window
      title="我的电脑"
      icon="fa fa-desktop"
      :isOpen="true"
      :isActive="true"
      @close="router.push('/')"
    >
      <!-- Address Bar -->
      <div class="flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-3">
        <span class="text-xs">地址(D)</span>
        <div class="flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2">
            <i class="fa fa-desktop text-blue-500"></i>
            我的电脑
        </div>
      </div>

      <div class="flex gap-6 flex-wrap">
        <!-- Drive C: My Documents -->
        <div
          class="flex flex-col items-center gap-1 cursor-pointer group w-[88px]"
          @click="navigateTo('/all-notes')"
        >
          <div class="w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform text-gray-500" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
            <i class="fa fa-hdd-o"></i>
          </div>
          <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight">
            本地磁盘 (C:)
          </span>
          <span class="text-[10px] text-gray-500">12 篇文档</span>
        </div>

        <!-- Control Panel -->
        <div
          class="flex flex-col items-center gap-1 cursor-pointer group w-[88px]"
          @click="navigateTo('/categories')"
        >
          <div class="w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
            <i class="fa fa-cog text-pink-500"></i>
          </div>
          <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight">
            控制面板
          </span>
          <span class="text-[10px] text-gray-500">5 个分类</span>
        </div>

        <!-- GitHub Link -->
        <div
          class="flex flex-col items-center gap-1 cursor-pointer group w-[88px]"
          @click="navigateTo('https://github.com')"
        >
          <div class="w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
            <i class="fa fa-globe text-blue-400"></i>
          </div>
          <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight">
            网上邻居
          </span>
          <span class="text-[10px] text-gray-500">GitHub</span>
        </div>
      </div>

      <div class="mt-auto pt-4 text-xs text-gray-500 border-t border-gray-300 mt-6">
        3 个对象
      </div>
    </Window>
</template>

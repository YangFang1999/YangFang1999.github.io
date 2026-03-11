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
      <div class="flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-2">
        <span class="text-xs">地址(D)</span>
        <div class="flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2">
            <i class="fa fa-desktop text-blue-500"></i>
            我的电脑
        </div>
      </div>

      <div class="flex gap-4">
        <!-- Drive C -->
        <div 
          class="flex flex-col items-center gap-1 cursor-pointer group w-20"
          @click="navigateTo('/all-notes')"
        >
          <div class="w-10 h-10 flex justify-center items-center text-4xl group-hover:brightness-110 text-gray-500">
            <i class="fa fa-hdd-o"></i>
          </div>
          <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full">
            (C:)
          </span>
        </div>

        <!-- Control Panel -->
        <div 
          class="flex flex-col items-center gap-1 cursor-pointer group w-20"
          @click="navigateTo('/categories')"
        >
          <div class="w-10 h-10 flex justify-center items-center text-4xl group-hover:brightness-110">
            <i class="fa fa-cog text-pink-500"></i>
          </div>
          <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full">
            控制面板
          </span>
        </div>
      </div>
      
      <div class="mt-auto pt-4 text-xs text-gray-500">
        2 个对象
      </div>
    </Window>
</template>

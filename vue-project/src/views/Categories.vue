<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';

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

      <div class="mt-4 pt-2 text-xs text-gray-500 border-t border-gray-300">
        {{ categories.length }} 个分类
      </div>
    </Window>
</template>

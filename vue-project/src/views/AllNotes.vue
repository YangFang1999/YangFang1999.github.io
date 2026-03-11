<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Window from '../components/Window.vue';
import { notes } from '../data/notes';

const router = useRouter();
const route = useRoute();

const currentCategory = computed(() => route.query.category as string | undefined);

const filteredNotes = computed(() => {
  if (!currentCategory.value) return notes;
  return notes.filter(note => note.category === currentCategory.value);
});

const currentPath = computed(() => {
  if (currentCategory.value) {
    return `C:\\我的文档\\分类\\${currentCategory.value}`;
  }
  return `C:\\我的文档\\文章`;
});

const navigateTo = (path: string) => {
  if (path.startsWith('http')) {
    window.open(path, '_blank');
  } else {
    router.push(path);
  }
};

const goUp = () => {
  if (currentCategory.value) {
    router.push('/categories');
  } else {
    router.push('/computer');
  }
};

</script>

<template>
    <Window 
      title="我的文档" 
      icon="fa fa-folder-open" 
      :isOpen="true"
      :isActive="true"
      @close="router.push('/')"
    >
      <!-- Address Bar -->
      <div class="flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-2">
        <span class="text-xs">地址(D)</span>
        <div class="flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2">
            <i class="fa fa-folder text-yellow-400"></i>
            {{ currentPath }}
        </div>
        <button @click="goUp" class="px-2 py-0.5 bg-silver shadow-win95-outset active:shadow-win95-inset text-xs flex items-center gap-1" title="向上">
            <i class="fa fa-arrow-up"></i> 向上
        </button>
      </div>

      <!-- File List -->
      <div class="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 content-start">
        <div 
          v-for="note in filteredNotes" 
          :key="note.id" 
          class="flex flex-col items-center gap-1 cursor-pointer group w-20"
          @click="navigateTo(note.path)"
        >
          <div class="w-10 h-10 flex justify-center items-center text-4xl text-gray-600 group-hover:brightness-110">
            <i :class="note.icon"></i>
          </div>
          <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white break-words w-full">
            {{ note.title }}
          </span>
        </div>
      </div>
      
      <!-- Status Bar Info (simulated inside window content for now or move to Window component slot) -->
      <div class="mt-auto pt-2 text-xs text-gray-500">
        {{ filteredNotes.length }} 个对象
      </div>
    </Window>
</template>

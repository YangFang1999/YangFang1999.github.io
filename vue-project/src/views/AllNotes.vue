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
    const catName = currentCategory.value;
    return `C:\\我的文档\\${catName}\\`;
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
      <div class="flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-3">
        <span class="text-xs">地址(D)</span>
        <div class="flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2">
            <i class="fa fa-folder text-yellow-400"></i>
            {{ currentPath }}
        </div>
        <button @click="goUp" class="px-2 py-0.5 bg-silver shadow-win95-outset active:shadow-win95-inset text-xs flex items-center gap-1 win-btn" title="向上">
            <i class="fa fa-arrow-up"></i> 向上
        </button>
      </div>

      <!-- File List -->
      <div class="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 content-start">
        <div
          v-for="note in filteredNotes"
          :key="note.id"
          class="flex flex-col items-center gap-1 cursor-pointer group w-[80px]"
          @click="navigateTo(note.path)"
        >
          <div class="w-12 h-12 flex justify-center items-center text-[36px] text-gray-600 group-hover:scale-110 transition-transform" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.15));">
            <i :class="note.icon"></i>
          </div>
          <span class="text-[11px] text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white break-words w-full leading-tight rounded-sm">
            {{ note.title }}
          </span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredNotes.length === 0" class="text-center text-gray-500 py-8">
        <i class="fa fa-folder-open-o text-4xl mb-2 block"></i>
        <p>此分类下暂无文章。</p>
      </div>

      <div class="mt-4 pt-2 text-xs text-gray-500 border-t border-gray-300">
        {{ filteredNotes.length }} 个对象
      </div>
    </Window>
</template>

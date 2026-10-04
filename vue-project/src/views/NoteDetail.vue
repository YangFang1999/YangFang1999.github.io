<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

import Window from '../components/Window.vue';
import { notes } from '../data/notes';

const route = useRoute();
const router = useRouter();

// 每篇文章一个独立 chunk，只在访问对应文章时才下载
const articleLoaders: Record<string, () => Promise<{ default: string }>> = {
  'hello-world': () => import('../data/articles/hello-world'),
  'idea-shortcuts': () => import('../data/articles/idea-shortcuts'),
  'java-collections-framework': () => import('../data/articles/java-collections-framework'),
  'vue-migration': () => import('../data/articles/vue-migration'),
  'spring-boot-guide': () => import('../data/articles/spring-boot-guide'),
  'mysql-basics': () => import('../data/articles/mysql-basics'),
  'git-basics': () => import('../data/articles/git-basics'),
  'docker-intro': () => import('../data/articles/docker-intro'),
  'linux-commands': () => import('../data/articles/linux-commands'),
  'javascript-es6': () => import('../data/articles/javascript-es6'),
  'design-patterns': () => import('../data/articles/design-patterns'),
  'redis-basics': () => import('../data/articles/redis-basics'),
};

const categoryNames: Record<string, string> = {
  java: 'Java',
  spring: 'Spring',
  database: 'Database',
  frontend: 'Frontend',
  devops: 'DevOps',
};

const noteId = computed(() => route.params.id as string);
const note = computed(() => notes.find(n => n.id === noteId.value));

const noteContent = ref('');
const isLoading = ref(true);
const rootEl = ref<HTMLElement | null>(null);

const windowTitle = computed(() => note.value ? note.value.title : '文章未找到');

const currentIndex = computed(() => notes.findIndex(n => n.id === noteId.value));
const prevNote = computed(() => (currentIndex.value > 0 ? notes[currentIndex.value - 1] : null));
const nextNote = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < notes.length - 1 ? notes[currentIndex.value + 1] : null
);

const charCount = computed(() => noteContent.value.replace(/<[^>]*>/g, '').replace(/\s/g, '').length);
const readMinutes = computed(() => Math.max(1, Math.round(charCount.value / 400)));

const scrollToTop = () => {
  const scroller = rootEl.value?.closest('.win-content');
  scroller?.scrollTo({ top: 0 });
};

const loadNote = async () => {
  const current = note.value;
  if (!current || !articleLoaders[current.id]) {
    noteContent.value = '';
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  const mod = await articleLoaders[current.id]();
  noteContent.value = mod.default;
  isLoading.value = false;
  await nextTick();
  if (rootEl.value) {
    Prism.highlightAllUnder(rootEl.value);
  }
  scrollToTop();
};

watch(noteId, loadNote, { immediate: true });

const goNote = (id?: string) => {
  if (id) router.push(`/notes/${id}`);
};
</script>

<template>
  <Window
    :title="windowTitle"
    icon="fa fa-file-text-o"
    isOpen
    isActive
    @close="router.push('/all-notes')"
  >
    <div ref="rootEl">
      <!-- 文章未找到 -->
      <div v-if="!note" class="text-center py-12 px-4 text-sm">
        <p class="text-4xl mb-4">📄</p>
        <h2 class="text-base font-bold text-[#000080] mb-2">文章不存在</h2>
        <p class="text-gray-600 mb-1">没有找到文章「{{ noteId }}」，链接可能已失效。</p>
        <router-link to="/all-notes" class="inline-block mt-3 font-bold text-[#000080] hover:bg-[#000080] hover:text-white px-1">← 返回我的文档</router-link>
      </div>

      <template v-else>
        <!-- 文章信息头 -->
        <header class="bg-[#f0f0f0] shadow-win95-inset p-3 mb-4 flex items-start gap-3">
          <div class="w-10 h-10 bg-white shadow-win95-inset flex items-center justify-center shrink-0">
            <i :class="note.icon" class="text-xl text-[#000080]"></i>
          </div>
          <div class="min-w-0">
            <h2 class="text-base font-bold text-[#000080] leading-snug break-words">{{ note.title }}</h2>
            <div class="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-600 mt-1">
              <span title="发布日期"><i class="fa fa-calendar-o mr-1"></i>{{ note.date }}</span>
              <span v-if="note.category" title="分类"><i class="fa fa-folder-open-o mr-1"></i>{{ categoryNames[note.category] }}</span>
              <span title="不含代码的正文长度" v-if="!isLoading"><i class="fa fa-file-text-o mr-1"></i>约 {{ charCount }} 字 · 预计 {{ readMinutes }} 分钟读完</span>
            </div>
          </div>
        </header>

        <!-- 正文 -->
        <div v-if="isLoading" class="text-gray-500 text-sm py-10 text-center">
          <i class="fa fa-hourglass-half mr-1"></i>正在打开文档...
        </div>
        <article v-else class="note-article" v-html="noteContent"></article>

        <!-- 上一篇 / 下一篇 -->
        <footer v-if="!isLoading" class="mt-10 pt-3 border-t-2 border-t-[#808080]">
          <div class="flex flex-col sm:flex-row gap-2">
            <button
              :disabled="!prevNote"
              @click="goNote(prevNote?.id)"
              class="flex-1 min-w-0 text-left px-3 py-1.5 bg-[#c0c0c0] text-xs text-black shadow-win95-outset active:shadow-win95-inset win-btn cursor-pointer disabled:opacity-50 disabled:cursor-default"
              :title="prevNote ? prevNote.title : '已经是第一篇'"
            >
              <span class="text-[11px] text-gray-700 block">← 上一篇</span>
              <span class="block truncate font-bold">{{ prevNote ? prevNote.title : '没有更多文章' }}</span>
            </button>
            <button
              :disabled="!nextNote"
              @click="goNote(nextNote?.id)"
              class="flex-1 min-w-0 text-right px-3 py-1.5 bg-[#c0c0c0] text-xs text-black shadow-win95-outset active:shadow-win95-inset win-btn cursor-pointer disabled:opacity-50 disabled:cursor-default"
              :title="nextNote ? nextNote.title : '已经是最后一篇'"
            >
              <span class="text-[11px] text-gray-700 block">下一篇 →</span>
              <span class="block truncate font-bold">{{ nextNote ? nextNote.title : '没有更多文章' }}</span>
            </button>
          </div>
          <div class="mt-3 text-center">
            <button
              @click="router.push('/all-notes')"
              class="px-4 py-1 bg-[#c0c0c0] text-xs text-black shadow-win95-outset active:shadow-win95-inset win-btn cursor-pointer"
            >
              <i class="fa fa-arrow-up mr-1"></i>返回我的文档
            </button>
          </div>
        </footer>
      </template>
    </div>
  </Window>
</template>

<style>
.note-article {
  font-family: 'MS Sans Serif', 'Tahoma', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  line-height: 1.75;
  color: #1a1a1a;
  word-break: break-word;
}
.note-article h1 {
  font-size: 1.45em;
  font-weight: bold;
  color: #000080;
  line-height: 1.4;
  margin: 4px 0 14px;
  padding: 0 0 8px;
  border-bottom: 2px solid #000080;
}
.note-article h2 {
  font-size: 1.2em;
  font-weight: bold;
  color: #000080;
  margin: 1.8em 0 0.7em;
  padding: 3px 8px;
  border-left: 4px solid #000080;
  background: #e8ecf3;
}
.note-article h3 {
  font-size: 1.08em;
  font-weight: bold;
  color: #333;
  margin: 1.4em 0 0.5em;
}
.note-article p { margin: 0 0 1em; }
.note-article ul { margin: 0 0 1em; padding-left: 1.8em; list-style-type: disc; }
.note-article ol { margin: 0 0 1em; padding-left: 1.8em; list-style-type: decimal; }
.note-article li { margin-bottom: 0.45em; }
.note-article a {
  color: #000080;
  text-decoration: underline;
}
.note-article a:hover {
  background: #000080;
  color: #ffffff;
  text-decoration: none;
}
.note-article code {
  font-family: 'Courier New', Consolas, monospace;
  font-size: 0.92em;
  background: #ffffff;
  border: 1px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
  padding: 0 4px;
}
.note-article pre {
  overflow-x: auto;
}
.note-article pre code {
  background: transparent;
  border: none;
  padding: 0;
  font-size: 13px;
}
.note-article table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 1em;
  background: #ffffff;
  font-size: 12px;
}
.note-article th {
  background: #dfdfdf;
  border: 1px solid #808080;
  padding: 6px 8px;
  text-align: left;
  font-weight: bold;
  vertical-align: top;
}
.note-article td {
  border: 1px solid #a0a0a0;
  padding: 6px 8px;
  text-align: left;
  vertical-align: top;
}
.note-article tbody tr:nth-child(even) td {
  background: #f6f6f6;
}
.note-article blockquote {
  margin: 0 0 1em;
  padding: 8px 12px;
  background: #f4f4f4;
  border-left: 4px solid #808080;
}
.note-article hr {
  border: none;
  border-top: 1px solid #808080;
  border-bottom: 1px solid #ffffff;
  margin: 1.5em 0;
}
</style>

<script setup lang="ts">
// 「我的文章」：文件夹式两级浏览——根目录 = 各分类文件夹（Win98 黄文件夹），
// 点进分类后文章以文件行平铺（标题.txt + 日期，不带图标），点行打开文章。
// 分类来自 categories.ts 单一来源；控制面板卡片经 ?category= 直达对应文件夹；
// 标题搜索跨文件夹平铺命中。
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Window from '../components/Window.vue';
import { notes } from '../data/notes';
import { CATEGORIES } from '../data/categories';
import { closeWindows } from '../winNav';

const router = useRouter();
const route = useRoute();

const currentCategory = computed(() => route.query.category as string | undefined);
const searchQuery = ref('');

const currentCat = computed(() => CATEGORIES.find(c => c.id === currentCategory.value) ?? null);

const folderNotes = computed(() =>
  currentCat.value ? notes.filter(n => n.category === currentCat.value!.id) : []
);

// 搜索时忽略文件夹层级，平铺展示全库命中的文章
const searchHits = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return [];
  return notes.filter(n => n.title.toLowerCase().includes(q));
});

const rows = computed(() => (searchQuery.value.trim() ? searchHits.value : folderNotes.value));

const currentPath = computed(() =>
  currentCat.value ? `C:\\我的文章\\${currentCat.value.name}\\` : 'C:\\我的文章\\'
);

const shownCount = computed(() => {
  if (searchQuery.value.trim()) return searchHits.value.length;
  return currentCat.value ? folderNotes.value.length : CATEGORIES.length;
});

const countIn = (catId: string): number => notes.filter(n => n.category === catId).length;

const navigateTo = (path: string) => {
  if (path.startsWith('http')) {
    window.open(path, '_blank');
  } else {
    router.push(path);
  }
};

const openFolder = (id: string) => {
  searchQuery.value = '';
  router.push('/all-notes?category=' + id);
};

const goUp = () => {
  // 只在文件夹层级有意义：回到本应用根目录。
  // 根目录不再显示"向上"——出去的途径是 X（退回前一个窗口）或任务栏（时间线回退）。
  if (currentCategory.value) router.push('/all-notes');
};
</script>

<template>
  <Window
    title="我的文章"
    icon="fa fa-folder-open"
    :isOpen="true"
    :isActive="true"
    @close="closeWindows(['docs'])"
  >
    <!-- Address Bar -->
    <div class="flex items-center gap-2 px-2 py-1 border-b border-gray-300 mb-3">
      <button v-if="currentCategory" @click="goUp" class="px-2 py-0.5 bg-silver shadow-win95-outset active:shadow-win95-inset text-xs flex items-center gap-1 win-btn" title="向上">
        <i class="fa fa-level-up"></i> 向上
      </button>
      <span class="text-xs shrink-0">地址(D)</span>
      <div class="flex-1 bg-white shadow-win95-inset flex items-center gap-2 px-2 py-0.5">
        <i :class="currentCat ? 'fa fa-folder-open text-yellow-500' : 'fa fa-folder text-yellow-500'" class="shrink-0"></i>
        <span class="truncate">{{ currentPath }}</span>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="flex items-center gap-2 px-2 py-1 mb-3">
      <span class="text-xs">搜索(S)</span>
      <div class="flex-1 bg-white shadow-win95-inset flex items-center gap-2 px-2 py-0.5">
        <i class="fa fa-search text-gray-500 text-xs"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="按标题搜索文章..."
          class="flex-1 bg-transparent outline-none text-sm text-black placeholder-gray-500 min-w-0"
        />
        <button v-if="searchQuery" @click="searchQuery = ''" class="text-xs text-gray-500 hover:text-black cursor-pointer" title="清除">×</button>
      </div>
    </div>

    <!-- 根视图：分类文件夹（列表行式，行首小文件夹图标） -->
    <div v-if="!currentCat && !searchQuery.trim()" class="file-list">
      <div
        v-for="cat in CATEGORIES"
        :key="cat.id"
        class="group flex items-center gap-2 px-2 h-[28px] text-[13px] text-black cursor-pointer border-b border-b-[#f0f0f0] last:border-b-0 hover:bg-[#000080] hover:text-white"
        :title="`${cat.name}（${countIn(cat.id)} 篇）— 点击进入文件夹`"
        @click="openFolder(cat.id)"
      >
        <i class="fa fa-folder w-4 text-center text-yellow-500 shrink-0"></i>
        <span class="flex-1 truncate">{{ cat.name }}</span>
        <span class="text-[10px] text-gray-500 shrink-0 group-hover:text-[#b8c8e8]">{{ countIn(cat.id) }} 篇</span>
      </div>
    </div>

    <!-- 文件夹内 / 搜索结果：文章文件行（行首小图标，固定行高，列表框固定大小滚动） -->
    <div v-else class="file-list">
      <div
        v-for="n in rows"
        :key="n.id"
        class="group flex items-center gap-2 px-2 h-[28px] text-[13px] text-black cursor-pointer border-b border-b-[#f0f0f0] last:border-b-0 hover:bg-[#000080] hover:text-white"
        :title="`${n.title} — 点击打开文章`"
        @click="navigateTo(n.path)"
      >
        <i :class="n.icon" class="w-4 text-center text-[#5a7ca8] group-hover:text-white shrink-0"></i>
        <span class="flex-1 truncate">{{ n.title }}.txt</span>
        <span class="text-[10px] text-gray-500 shrink-0 group-hover:text-[#b8c8e8]">{{ n.date }}</span>
      </div>
      <div v-if="!rows.length" class="text-center text-gray-500 py-8 text-sm">
        {{ searchQuery.trim() ? '没有找到匹配的文章。' : '此分类下暂无文章。' }}
      </div>
    </div>

    <div class="mt-4 pt-2 text-xs text-gray-500 border-t border-gray-300">
      {{ shownCount }} 个对象
    </div>
  </Window>
</template>

<style scoped>
/* 固定大小的 Win98 列表框：文件数量不改变整体高度，超出一律滚动 */
.file-list {
  height: 360px;
  overflow-y: auto;
  background: #fff;
  border: 2px solid;
  border-color: #808080 #ffffff #ffffff #808080;
  box-shadow: inset 1px 1px #0a0a0a, inset -1px -1px #dfdfdf;
}
.file-list::-webkit-scrollbar { width: 14px; }
.file-list::-webkit-scrollbar-thumb { background: #c0c0c0; border: 2px solid; border-color: #fff #808080 #808080 #fff; }
.file-list::-webkit-scrollbar-track { background: #f4f4f4; }
</style>

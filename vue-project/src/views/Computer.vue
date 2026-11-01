<script setup lang="ts">
// 「我的电脑」：真资源管理器。
// 根视图 = 盘符（C: 文档 / D: GAMEZ / 控制面板 / 网上邻居）；
// C 盘 = 12 篇文章按日期排列（显示体积，点击直接打开文章）；
// D 盘 = 两款游戏 exe。状态栏显示磁盘占用（正文懒加载统计）。
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';
import { notes } from '../data/notes';
import { loadAllArticles, sizeKB } from '../data/articlesIndex';

const router = useRouter();

type View = 'root' | 'c' | 'd';
const view = ref<View>('root');

// 按日期倒序的文章（新文件在上面，像真实文件系统）
const files = computed(() =>
  notes.slice().sort((a, b) => (a.date < b.date ? 1 : -1)).map(n => ({
    id: n.id,
    title: n.title,
    date: n.date,
    icon: n.icon,
    category: n.category ?? '',
  }))
);

const sizesKB = ref<Record<string, number>>({});
const totalKB = ref(0);
const ready = ref(false);
let sizesStarted = false;

// 进入 C 盘才统计体积（懒加载全部正文，只算一次）
function enterC(): void {
  view.value = 'c';
  if (ready.value || sizesStarted) return;
  sizesStarted = true;
  void loadAllArticles().then(all => {
    const map: Record<string, number> = {};
    let total = 0;
    for (const [id, html] of all) {
      const kb = sizeKB(html);
      map[id] = kb;
      total += kb;
    }
    sizesKB.value = map;
    totalKB.value = total;
    ready.value = true;
  });
}

const openPath = (path: string) => {
  if (path.startsWith('http')) window.open(path, '_blank');
  else router.push(path);
};

const addressBar = computed(() => {
  if (view.value === 'c') return 'C:\\文档';
  if (view.value === 'd') return 'D:\\GAMEZ';
  return '我的电脑';
});

const objectCount = computed(() => (view.value === 'c' ? files.value.length : view.value === 'd' ? 2 : 4));

const goUp = () => { view.value = 'root'; };
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
      <button
        v-if="view !== 'root'"
        class="win-btn shadow-win95-outset px-2 py-0.5 text-[11px] text-black cursor-pointer shrink-0"
        title="返回上一级"
        @click="goUp"
      >
        <i class="fa fa-level-up mr-1"></i>向上
      </button>
      <span class="text-xs shrink-0">地址(D)</span>
      <div class="flex-1 bg-white shadow-win95-inset px-2 py-0.5 text-sm flex items-center gap-2 min-w-0">
        <i :class="view === 'root' ? 'fa fa-desktop text-blue-500' : 'fa fa-folder text-yellow-500'" class="shrink-0"></i>
        <span class="truncate">{{ addressBar }}</span>
      </div>
    </div>

    <!-- 根视图：盘符 -->
    <div v-if="view === 'root'" class="flex gap-6 flex-wrap">
      <div class="flex flex-col items-center gap-1 cursor-pointer group w-[88px]" @click="enterC">
        <div class="w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform text-gray-500" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
          <i class="fa fa-hdd-o"></i>
        </div>
        <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight">
          本地磁盘 (C:)
        </span>
        <span class="text-[10px] text-gray-500">{{ notes.length }} 篇文档</span>
      </div>

      <div class="flex flex-col items-center gap-1 cursor-pointer group w-[88px]" @click="view = 'd'">
        <div class="w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform text-gray-500" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
          <i class="fa fa-hdd-o"></i>
        </div>
        <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight">
          GAMEZ (D:)
        </span>
        <span class="text-[10px] text-gray-500">2 个游戏</span>
      </div>

      <div class="flex flex-col items-center gap-1 cursor-pointer group w-[88px]" @click="router.push('/categories')">
        <div class="w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
          <i class="fa fa-cog text-pink-500"></i>
        </div>
        <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight">
          控制面板
        </span>
        <span class="text-[10px] text-gray-500">7 个分类</span>
      </div>

      <div class="flex flex-col items-center gap-1 cursor-pointer group w-[88px]" @click="openPath('https://github.com/YangFang1999')">
        <div class="w-12 h-12 flex justify-center items-center text-[40px] group-hover:scale-110 transition-transform" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
          <i class="fa fa-globe text-blue-400"></i>
        </div>
        <span class="text-xs text-center group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm leading-tight">
          网上邻居
        </span>
        <span class="text-[10px] text-gray-500">GitHub 主页</span>
      </div>
    </div>

    <!-- C 盘：文章 = 文本文档，按日期倒序 -->
    <div v-else-if="view === 'c'" class="flex gap-4 flex-wrap">
      <div
        v-for="f in files"
        :key="f.id"
        class="flex flex-col items-center gap-1 cursor-pointer group w-[104px]"
        :title="`${f.title} — 点击打开文档`"
        @click="openPath(`/notes/${f.id}`)"
      >
        <div class="w-11 h-11 flex justify-center items-center text-[34px] group-hover:scale-110 transition-transform text-[#5a7ca8]" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
          <i :class="f.icon"></i>
        </div>
        <span class="text-[11px] text-center leading-tight break-all group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm">
          {{ f.title }}.txt
        </span>
        <span class="text-[10px] text-gray-500">
          <template v-if="ready">{{ sizesKB[f.id] ?? '?' }} KB</template><template v-else>… KB</template> · {{ f.date }}
        </span>
      </div>
    </div>

    <!-- D 盘：游戏 -->
    <div v-else class="flex gap-6 flex-wrap">
      <div class="flex flex-col items-center gap-1 cursor-pointer group w-[104px]" title="飞机大战.exe" @click="openPath('/airplane')">
        <div class="w-11 h-11 flex justify-center items-center text-[34px] group-hover:scale-110 transition-transform text-yellow-500" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
          <i class="fa fa-fighter-jet"></i>
        </div>
        <span class="text-[11px] text-center leading-tight break-all group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm">
          飞机大战.exe
        </span>
        <span class="text-[10px] text-gray-500">射击游戏</span>
      </div>
      <div class="flex flex-col items-center gap-1 cursor-pointer group w-[104px]" title="桌面保卫战.exe" @click="openPath('/survivors')">
        <div class="w-11 h-11 flex justify-center items-center text-[34px] group-hover:scale-110 transition-transform text-red-400" style="filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));">
          <i class="fa fa-shield"></i>
        </div>
        <span class="text-[11px] text-center leading-tight break-all group-hover:bg-navy group-hover:text-white px-1 border border-transparent group-hover:border-dotted group-hover:border-white w-full rounded-sm">
          桌面保卫战.exe
        </span>
        <span class="text-[10px] text-gray-500">肉鸽塔防</span>
      </div>
    </div>

    <div class="pt-4 text-xs text-gray-500 border-t border-gray-300 mt-6 flex justify-between gap-2">
      <span>{{ objectCount }} 个对象</span>
      <span v-if="view === 'c' && ready">文档占用约 {{ totalKB }} KB</span>
    </div>
  </Window>
</template>

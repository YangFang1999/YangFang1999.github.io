<script setup lang="ts">
import { ref, inject, watch, computed, onMounted, type ComputedRef } from 'vue';
import Window from '../components/Window.vue';
import { notes } from '../data/notes';

const articleCount = notes.length;
const categoryCount = new Set(notes.map(n => n.category).filter(Boolean)).size;
const year = new Date().getFullYear();

const hasVisited = localStorage.getItem('has-visited');
const isWelcomeOpen = ref(!hasVisited);
const isWelcomeMinimized = ref(false);
const isWelcomeActive = ref(!hasVisited);

onMounted(() => {
  localStorage.setItem('has-visited', '1');
});

const activeWindowId = inject<ComputedRef<string | null>>('activeWindowId', computed(() => null));
watch(activeWindowId!, (id) => {
  if (id === 'welcome') {
    focusWindow();
  }
});

const closeWindow = () => {
  isWelcomeOpen.value = false;
};

const minimizeWindow = () => {
  isWelcomeMinimized.value = true;
  isWelcomeActive.value = false;
};

const focusWindow = () => {
  if (isWelcomeMinimized.value) {
    isWelcomeMinimized.value = false;
  }
  isWelcomeActive.value = true;
};
</script>

<template>
  <!-- Welcome Window -->
  <Window
    v-if="isWelcomeOpen"
    title="欢迎来到 YF 的 Blog.exe"
    icon="fa fa-info-circle"
    :isOpen="isWelcomeOpen"
    :isActive="isWelcomeActive"
    @close="closeWindow"
    @minimize="minimizeWindow"
    @focus="focusWindow"
  >
    <div class="flex flex-col items-center text-center gap-3">
      <div class="flex items-center gap-4">
        <img src="/icons/computer_explorer-5.png" class="w-16 h-16" alt="computer">
        <div class="text-left">
          <h1 class="text-xl font-bold text-[#000080]">YF's Blog</h1>
          <p class="text-xs text-gray-600">Version 2.2 · Windows 98 Edition</p>
        </div>
      </div>

      <hr class="w-full border-t-[#808080] border-b-[#ffffff]">

      <div class="text-left w-full text-sm space-y-2">
        <p>👋 欢迎来到我的个人博客！</p>
        <p>这是一个复刻 <strong>Windows 98</strong> 风格的技术博客，记录了我的编程学习笔记和开发经验。</p>
        <p>你可以：</p>
        <ul class="list-disc ml-6 space-y-1">
          <li>点击桌面上的 <strong>"我的文档"</strong> 图标查看所有文章，或按 <strong>Ctrl+K</strong> 全局搜索</li>
          <li>通过 <strong>"控制面板"</strong> 按分类浏览文章</li>
          <li>开始菜单里藏着三款怀旧小游戏：<strong>飞机大战</strong>、<strong>桌面保卫战</strong> 和 <strong>扫雷</strong>，学累了去守一波基地</li>
          <li>桌面上还有一只 <strong>QQ 企鹅</strong> 桌宠跟着你——<strong>右键它</strong>打开菜单，里面藏着全部隐藏玩法（能抛、能骑窗口）</li>
          <li>随时点击左下角 <strong>"开始"</strong> 按钮打开菜单</li>
        </ul>
      </div>

      <hr class="w-full border-t-[#808080] border-b-[#ffffff]">

      <div class="grid grid-cols-3 gap-4 w-full text-xs">
        <div class="text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]">
          <div class="font-bold text-lg text-[#000080]">{{ articleCount }}</div>
          <div class="text-gray-600">技术文章</div>
        </div>
        <div class="text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]">
          <div class="font-bold text-lg text-[#000080]">{{ categoryCount }}</div>
          <div class="text-gray-600">分类方向</div>
        </div>
        <div class="text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]">
          <div class="font-bold text-lg text-[#000080]">∞</div>
          <div class="text-gray-600">持续更新</div>
        </div>
      </div>

      <p class="text-[10px] text-gray-500 mt-2">© {{ year }} YF. All rights reserved. · Powered by Vue 3 + Vite</p>
    </div>
  </Window>
</template>

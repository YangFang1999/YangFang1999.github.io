<script setup lang="ts">
import { ref } from 'vue';
import Window from '../components/Window.vue';

const isWelcomeOpen = ref(true);

const closeWindow = () => {
  isWelcomeOpen.value = false;
};
</script>

<template>
  <!-- Welcome Window -->
  <Window
    v-if="isWelcomeOpen"
    title="欢迎来到 YF 的 Blog.exe"
    icon="fa fa-info-circle"
    :isOpen="isWelcomeOpen"
    :isActive="true"
    @close="closeWindow"
  >
    <div class="flex flex-col items-center text-center gap-3">
      <div class="flex items-center gap-4">
        <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" class="w-16 h-16" alt="computer">
        <div class="text-left">
          <h1 class="text-xl font-bold text-[#000080]">YF's Blog</h1>
          <p class="text-xs text-gray-600">Version 2.0 · Windows 98 Edition</p>
        </div>
      </div>

      <hr class="w-full border-t-[#808080] border-b-[#ffffff]">

      <div class="text-left w-full text-sm space-y-2">
        <p>👋 欢迎来到我的个人博客！</p>
        <p>这是一个复刻 <strong>Windows 98</strong> 风格的技术博客，记录了我的编程学习笔记和开发经验。</p>
        <p>你可以：</p>
        <ul class="list-disc ml-6 space-y-1">
          <li>点击桌面上的 <strong>"我的文档"</strong> 图标查看所有文章</li>
          <li>通过 <strong>"控制面板"</strong> 按分类浏览文章</li>
          <li>点击 <strong>"Internet 浏览器"</strong> 访问 GitHub</li>
          <li>随时点击左下角 <strong>"开始"</strong> 按钮打开菜单</li>
        </ul>
      </div>

      <hr class="w-full border-t-[#808080] border-b-[#ffffff]">

      <div class="grid grid-cols-3 gap-4 w-full text-xs">
        <div class="text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]">
          <div class="font-bold text-lg text-[#000080]">12+</div>
          <div class="text-gray-600">技术文章</div>
        </div>
        <div class="text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]">
          <div class="font-bold text-lg text-[#000080]">6</div>
          <div class="text-gray-600">分类方向</div>
        </div>
        <div class="text-center p-2 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] bg-[#f0f0f0]">
          <div class="font-bold text-lg text-[#000080]">∞</div>
          <div class="text-gray-600">持续更新</div>
        </div>
      </div>

      <p class="text-[10px] text-gray-500 mt-2">© 2024 YF. All rights reserved. · Powered by Vue 3 + Vite</p>
    </div>
  </Window>
</template>

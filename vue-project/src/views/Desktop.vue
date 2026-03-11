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
    <div class="flex flex-col items-center text-center gap-4">
      <img src="https://win98icons.alexmeub.com/icons/png/computer_explorer-5.png" class="w-16 h-16" alt="computer">
      <h1 class="text-xl font-bold">Welcome to YF's Blog</h1>
      <p>这是一个复刻 Windows 98 风格的个人博客。</p>
      <p>你可以点击桌面上的图标开始探索。</p>
      <p class="text-xs text-gray-500 mt-4">© 2024 YF. All rights reserved.</p>
    </div>
  </Window>
</template>

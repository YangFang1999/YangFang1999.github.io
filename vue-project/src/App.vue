<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import DesktopIcon from './components/DesktopIcon.vue';
import Taskbar from './components/Taskbar.vue';
import { notes } from './data/notes';

const router = useRouter();
const route = useRoute();

const openWindows = ref<{ id: string; title: string; icon: string; isActive: boolean }[]>([
  { id: 'welcome', title: '欢迎来到 YF 的 Blog.exe', icon: 'fa fa-info-circle', isActive: true }
]);

// Watch route changes to update taskbar items (simulate window hierarchy)
watch(() => route.path, (newPath) => {
  // Always keep Welcome window if it was open (or user closed it manually, we handle that in closeWindow)
  // But here we are reconstructing the "active taskbar items" based on navigation context
  // To preserve the "Welcome" window if it's still "open" in the background, we need to separate "Taskbar Items" from "Route Context"
  
  // Strategy: 
  // 1. "Welcome" is a special persistent window until closed.
  // 2. Navigation windows (Computer -> Docs -> Note) replace each other or stack?
  //    In a real OS, they are separate windows. In this SPA, we simulate navigation.
  //    So we will show the "Path Hierarchy" in the taskbar to allow going back?
  //    Actually, user asked for "Hierarchy". 
  //    Let's implement: 
  //    - If at /computer: Show "My Computer"
  //    - If at /all-notes: Show "My Computer" (inactive) + "My Documents" (active)
  //    - If at /notes/:id: Show "My Documents" (inactive) + "Note Title" (active)
  
  const newWindows: { id: string; title: string; icon: string; isActive: boolean }[] = [];
  
  // Preserve Welcome window if it exists in current state
  const welcomeWin = openWindows.value.find(w => w.id === 'welcome');
  if (welcomeWin) newWindows.push({ ...welcomeWin, isActive: false });

  if (newPath === '/computer') {
    newWindows.push({ id: 'computer', title: '我的电脑', icon: 'fa fa-desktop', isActive: true });
  } 
  else if (newPath === '/all-notes') {
    newWindows.push({ id: 'computer', title: '我的电脑', icon: 'fa fa-desktop', isActive: false });
    newWindows.push({ id: 'docs', title: '我的文档', icon: 'fa fa-folder-open', isActive: true });
  }
  else if (newPath === '/categories') {
    newWindows.push({ id: 'computer', title: '我的电脑', icon: 'fa fa-desktop', isActive: false });
    newWindows.push({ id: 'categories', title: '分类', icon: 'fa fa-cog', isActive: true });
  }
  else if (newPath.startsWith('/notes/')) {
    const noteId = route.params.id as string;
    const note = notes.find(n => n.id === noteId);
    const title = note ? note.title : 'Note';
    
    newWindows.push({ id: 'docs', title: '我的文档', icon: 'fa fa-folder-open', isActive: false });
    newWindows.push({ id: 'note', title: title, icon: 'fa fa-file-text-o', isActive: true });
  }

  openWindows.value = newWindows;
}, { immediate: true });

const navigateTo = (path: string) => {
  if (path.startsWith('http')) {
    window.open(path, '_blank');
  } else {
    router.push(path);
  }
};

const activateWindow = (id: string) => {
  // If user clicks a taskbar item that represents a parent route, navigate to it
  if (id === 'computer') router.push('/computer');
  if (id === 'docs') router.push('/all-notes');
  // For 'welcome' or current note, just visual activation (but we are SPA, so maybe nothing needed if already there)
  
  // Update visual active state
  openWindows.value.forEach(w => w.isActive = w.id === id);
};

const isShutdown = ref(false);

const handleShutdown = () => {
  isShutdown.value = true;
};

const closeTab = () => {
  window.close();
  // Fallback for browsers that block window.close()
  window.location.href = "about:blank";
};

const showAlert = (message: string) => {
  alert(message);
};

</script>

<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col relative bg-[url('/wallpaper.jpg')] bg-cover bg-center">
    
    <!-- Persistent Desktop Icons -->
    <main class="absolute top-0 left-0 bottom-10 w-full p-4 flex flex-col gap-4 flex-wrap content-start z-0">
      <DesktopIcon label="我的电脑" iconClass="fa fa-desktop" color="text-white" @click="navigateTo('/computer')" />
      <DesktopIcon label="我的文档" iconClass="fa fa-folder-open" color="text-yellow-400" @click="navigateTo('/all-notes')" />
      <DesktopIcon label="控制面板" iconClass="fa fa-cog" color="text-pink-300" @click="navigateTo('/categories')" />
      <DesktopIcon label="Internet 浏览器" iconClass="fa fa-globe" color="text-blue-300" @click="navigateTo('https://github.com')" />
      <DesktopIcon label="记事本" iconClass="fa fa-pencil-square-o" color="text-white" @click="navigateTo('/notes/hello-world')" />
      <DesktopIcon label="回收站" iconClass="fa fa-trash-o" color="text-gray-400" @click="showAlert('回收站是空的。')" />
      <DesktopIcon label="电子邮件" iconClass="fa fa-envelope-o" color="text-white" @click="showAlert('未配置邮件客户端。')" />
    </main>

    <!-- Router View (Windows) -->
    <div class="z-10 w-full h-full pointer-events-none">
      <!-- pointer-events-none allows clicking through to desktop icons when no window is active/hovered, 
           but windows themselves need pointer-events-auto -->
      <router-view v-slot="{ Component }">
        <component :is="Component" class="pointer-events-auto" />
      </router-view>
    </div>

    <!-- Taskbar -->
    <Taskbar 
      :openWindows="openWindows" 
      @activate-window="activateWindow"
      @navigate="navigateTo"
      @shutdown="handleShutdown"
    />

    <!-- Shutdown Screen -->
    <div v-if="isShutdown" class="fixed inset-0 bg-[#008080] z-[100] flex flex-col items-center justify-center gap-6 font-bold font-mono">
      <div class="bg-[#c0c0c0] p-8 shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] text-center border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]">
        <div class="flex items-center gap-4 mb-4">
          <img src="https://win98icons.alexmeub.com/icons/png/windows-0.png" class="w-12 h-12" alt="windows">
          <div>
            <div class="text-xl text-black">Windows 98</div>
            <div class="text-sm text-gray-600">正在关机...</div>
          </div>
        </div>
        <hr class="border-t-[#808080] border-b-[#ffffff] mb-4">
        <div class="text-lg text-black">It is now safe to turn off your computer.</div>
        <div class="text-xs text-gray-600 mt-1">(现在可以安全地关闭浏览器了)</div>
      </div>
      <button @click="closeTab" class="px-6 py-2 bg-[#c0c0c0] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-bold font-sans border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a]">
        关闭页面
      </button>
    </div>
  </div>
</template>

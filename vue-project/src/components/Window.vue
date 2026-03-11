<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  title: string;
  icon?: string;
  isOpen: boolean;
  isActive: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'minimize'): void;
  (e: 'maximize'): void;
  (e: 'focus'): void;
}>();
</script>

<template>
  <div 
    v-if="isOpen"
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-2xl bg-silver shadow-win95-outset p-1 flex flex-col max-h-[80vh]"
    @mousedown="emit('focus')"
  >
    <!-- Title Bar -->
    <div class="bg-navy px-1 py-1 flex justify-between items-center select-none">
      <div class="flex items-center gap-1 text-white font-bold text-sm">
        <i v-if="icon" :class="icon"></i>
        <span>{{ title }}</span>
      </div>
      <div class="flex gap-1">
        <button @click.stop="emit('minimize')" class="w-4 h-4 bg-silver shadow-win95-outset flex items-center justify-center active:shadow-win95-inset text-[10px] font-bold pb-1" title="最小化">_</button>
        <button @click.stop="emit('maximize')" class="w-4 h-4 bg-silver shadow-win95-outset flex items-center justify-center active:shadow-win95-inset text-[10px] font-bold pb-1" title="最大化">□</button>
        <button @click.stop="emit('close')" class="w-4 h-4 bg-silver shadow-win95-outset flex items-center justify-center active:shadow-win95-inset text-[10px] font-bold pb-1" title="关闭">×</button>
      </div>
    </div>

    <!-- Menu Bar -->
    <div class="flex px-1 py-1 text-sm select-none border-b border-gray-300 bg-silver">
      <div class="px-2 py-1 hover:bg-navy hover:text-white cursor-pointer"><span class="underline decoration-1 underline-offset-2">文</span>件(F)</div>
      <div class="px-2 py-1 hover:bg-navy hover:text-white cursor-pointer"><span class="underline decoration-1 underline-offset-2">编</span>辑(E)</div>
      <div class="px-2 py-1 hover:bg-navy hover:text-white cursor-pointer"><span class="underline decoration-1 underline-offset-2">查</span>看(V)</div>
      <div class="px-2 py-1 hover:bg-navy hover:text-white cursor-pointer"><span class="underline decoration-1 underline-offset-2">帮</span>助(H)</div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 bg-white shadow-win95-inset m-1 p-4 overflow-y-auto text-black min-h-0">
      <slot></slot>
    </div>

    <!-- Status Bar -->
    <div class="px-2 py-1 text-xs text-gray-600 border-t border-gray shadow-none flex justify-between bg-silver">
      <span>Ready</span>
      <span>100%</span>
    </div>
  </div>
</template>

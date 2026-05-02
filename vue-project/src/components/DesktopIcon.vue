<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  label: string;
  iconClass?: string;
  iconSrc?: string;
  color?: string;
  onClick?: () => void;
}>();

const isPressed = ref(false);
</script>

<template>
  <div
    class="group flex flex-col items-center gap-1 w-[88px] cursor-pointer select-none"
    @click="onClick"
    @mousedown="isPressed = true"
    @mouseup="isPressed = false"
    @mouseleave="isPressed = false"
  >
    <div
      class="w-12 h-12 text-[40px] flex justify-center items-center transition-transform duration-75"
      :class="[
        color || 'text-white',
        isPressed ? 'scale-90' : 'group-hover:scale-110'
      ]"
      style="filter: drop-shadow(2px 2px 1px rgba(0,0,0,0.6));"
    >
      <i v-if="iconClass" :class="iconClass"></i>
      <img v-if="iconSrc" :src="iconSrc" class="w-full h-full object-contain" />
    </div>
    <span
      class="text-white text-xs px-1 py-0.5 max-w-full break-words text-center leading-tight rounded-sm"
      :class="isPressed ? 'bg-navy border border-dotted border-white' : 'bg-transparent group-hover:bg-navy group-hover:border group-hover:border-dotted group-hover:border-white'"
    >
      {{ label }}
    </span>
  </div>
</template>

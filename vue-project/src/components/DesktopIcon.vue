<script setup lang="ts">
defineProps<{
  label: string;
  iconClass?: string;
  iconSrc?: string; // Optional image source if not using font-awesome
  color?: string;
  onClick?: () => void;
}>();
</script>

<template>
  <div 
    class="group flex flex-col items-center gap-1 w-20 cursor-pointer"
    @click="onClick"
  >
    <div 
      class="w-10 h-10 text-4xl drop-shadow-md flex justify-center items-center"
      :class="color || 'text-white'"
    >
      <i v-if="iconClass" :class="iconClass"></i>
      <img v-if="iconSrc" :src="iconSrc" class="w-full h-full object-contain" />
    </div>
    <span class="text-white text-xs px-1 bg-transparent group-hover:bg-navy border border-transparent group-hover:border-dotted group-hover:border-white desktop-icon text-center">
      {{ label }}
    </span>
  </div>
</template>

<style scoped>
.desktop-icon {
  text-shadow: 1px 1px 0 #000;
}
</style>

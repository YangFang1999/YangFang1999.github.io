<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';

const router = useRouter();

const textContent = ref('');
const fontSize = ref(14);
const saved = ref(true);

const textareaStyle = computed(() => ({
  fontSize: fontSize.value + 'px',
  fontFamily: "'Courier New', 'Consolas', 'SimHei', monospace",
  lineHeight: '1.5',
}));

const charCount = computed(() => textContent.value.length);
const lineCount = computed(() => {
  if (!textContent.value) return 0;
  return textContent.value.split('\n').length;
});

onMounted(() => {
  const saved_content = localStorage.getItem('notepad-content');
  if (saved_content) {
    textContent.value = saved_content;
    saved.value = true;
  }
});

function handleSave() {
  localStorage.setItem('notepad-content', textContent.value);
  saved.value = true;
}

function handleNew() {
  if (textContent.value && !saved.value) {
    if (!confirm('内容尚未保存，确定要新建吗？')) return;
  }
  textContent.value = '';
  localStorage.removeItem('notepad-content');
  saved.value = true;
}

function onInput() {
  saved.value = false;
}
</script>

<template>
  <Window
    title="记事本 - 未命名"
    icon="fa fa-pencil-square-o"
    :isOpen="true"
    :isActive="true"
    @close="router.push('/')"
  >
    <div class="flex flex-col h-full min-h-0 gap-0">
      <!-- Toolbar -->
      <div class="flex items-center gap-[6px] px-[4px] py-[3px] bg-[#c0c0c0] border-b-2 border-[#808080] shrink-0 flex-wrap">
        <span class="text-[11px] font-bold text-black shrink-0">字号:</span>
        <select
          v-model.number="fontSize"
          class="text-[11px] px-[4px] py-[1px] bg-white border-2 border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] outline-none text-black"
          style="font-family: 'MS Sans Serif', 'Microsoft YaHei', sans-serif;"
        >
          <option v-for="s in [10, 12, 14, 16, 18, 20, 24]" :key="s" :value="s">{{ s }}px</option>
        </select>
        <button
          @click="handleNew"
          class="text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer"
          style="font-family: 'MS Sans Serif', 'Microsoft YaHei', sans-serif;"
        >
          新建
        </button>
        <button
          @click="handleSave"
          class="text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer"
          style="font-family: 'MS Sans Serif', 'Microsoft YaHei', sans-serif;"
        >
          保存
        </button>
        <span v-if="!saved" class="text-[10px] text-red-600">● 未保存</span>
        <span v-else class="text-[10px] text-gray-500">已保存</span>
      </div>

      <!-- Textarea -->
      <textarea
        v-model="textContent"
        @input="onInput"
        class="flex-1 w-full resize-none outline-none p-[6px] bg-white text-black min-h-0 border-0"
        :style="textareaStyle"
        placeholder="在此输入..."
        spellcheck="false"
      ></textarea>

      <!-- Status -->
      <div class="flex px-[4px] py-[1px] text-[10px] text-black border-t-2 border-t-[#808080] border-b border-b-[#ffffff] bg-[#c0c0c0] shrink-0 select-none gap-[12px]">
        <span>字符: {{ charCount }}</span>
        <span>行数: {{ lineCount }}</span>
      </div>
    </div>
  </Window>
</template>

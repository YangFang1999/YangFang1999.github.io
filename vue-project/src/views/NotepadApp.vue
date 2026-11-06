<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import Window from '../components/Window.vue';
import { closeWindows } from '../winNav';

const textContent = ref('');
const fontSize = ref(14);
const saved = ref(true);

const KEY_CONTENT = 'notepad-content';
const KEY_DRAFT = 'notepad-draft';
let committed = '';        // 最近一次保存/新建时的内容（saved 标志的基准）
let restoredText: string | null = null;   // 本次恢复的草稿原文（"丢弃"只在其未被继续编辑时直接回滚）
let draftTimer: ReturnType<typeof setTimeout> | undefined;
const draftRestored = ref(false);

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

function onBeforeUnload(e: BeforeUnloadEvent): void {
  if (!saved.value) {
    e.preventDefault();
    e.returnValue = '';
  }
}

onMounted(() => {
  const savedContent = localStorage.getItem(KEY_CONTENT);
  const draft = localStorage.getItem(KEY_DRAFT);
  if (draft !== null && draft !== savedContent) {
    // 有未提交的自动草稿：恢复草稿并标记未保存，由用户决定保存还是丢弃
    textContent.value = draft;
    restoredText = draft;
    draftRestored.value = true;
    committed = savedContent ?? '';
    saved.value = false;
  } else if (savedContent !== null) {
    textContent.value = savedContent;
    committed = savedContent;
    saved.value = true;
  }
  window.addEventListener('beforeunload', onBeforeUnload);
});

onUnmounted(() => {
  // 防抖窗口内未落盘的草稿立刻补写，关窗不丢最后半秒的输入
  if (draftTimer) {
    clearTimeout(draftTimer);
    draftTimer = undefined;
    if (textContent.value !== committed) {
      try {
        if (textContent.value) localStorage.setItem(KEY_DRAFT, textContent.value);
        else localStorage.removeItem(KEY_DRAFT);
      } catch { /* 忽略 */ }
    }
  }
  window.removeEventListener('beforeunload', onBeforeUnload);
});

// 打字即自动草稿（防抖 500ms）：忘了点保存也不会因刷新/误关丢稿
watch(textContent, (v) => {
  if (draftTimer) clearTimeout(draftTimer);
  if (v === committed) return;   // 回到基准值（如新建清空）不标脏、不动草稿
  saved.value = false;
  draftTimer = setTimeout(() => {
    try {
      if (v) localStorage.setItem(KEY_DRAFT, v);
      else localStorage.removeItem(KEY_DRAFT);
    } catch { /* 忽略 */ }
  }, 500);
});

function handleSave() {
  try {
    localStorage.setItem(KEY_CONTENT, textContent.value);
    localStorage.removeItem(KEY_DRAFT);
  } catch { /* 忽略 */ }
  committed = textContent.value;
  saved.value = true;
}

function handleNew() {
  if (textContent.value && !saved.value) {
    if (!confirm('内容尚未保存，确定要新建吗？')) return;
  }
  textContent.value = '';
  try {
    localStorage.removeItem(KEY_CONTENT);
    localStorage.removeItem(KEY_DRAFT);
  } catch { /* 忽略 */ }
  committed = '';
  saved.value = true;
}

function onClose() {
  if (!saved.value && !confirm('内容尚未保存，确定要关闭窗口吗？')) return;
  closeWindows(['notepad']);
}

// 丢弃恢复的草稿：回到最近保存的内容（无则清空）。若用户已在草稿上继续编辑，先确认
function discardDraft(): void {
  if (textContent.value !== restoredText && !confirm('当前内容与草稿不同，确定丢弃吗？')) return;
  try { localStorage.removeItem(KEY_DRAFT); } catch { /* 忽略 */ }
  textContent.value = committed;
  saved.value = true;
  draftRestored.value = false;
}
</script>

<template>
  <Window
    title="记事本 - 未命名"
    icon="fa fa-pencil-square-o"
    :isOpen="true"
    :isActive="true"
    @close="onClose"
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

      <!-- 草稿恢复横幅 -->
      <div v-if="draftRestored" class="mx-[2px] mb-[4px] px-2 py-1 text-[11px] bg-[#e8ecf3] border border-t-[#808080] border-l-[#808080] border-b-[#ffffff] border-r-[#ffffff] flex items-center gap-2 shrink-0">
        <i class="fa fa-info-circle text-[#000080]"></i>
        <span class="flex-1 text-black">已恢复上次未保存的草稿</span>
        <button
          @click="discardDraft"
          class="text-[10px] font-bold px-[8px] py-[1px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer shrink-0"
          title="放弃草稿，回到最近保存的内容"
        >丢弃草稿</button>
        <button
          @click="draftRestored = false"
          class="text-[10px] px-[6px] py-[1px] bg-[#c0c0c0] text-gray-600 border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer shrink-0"
          title="保留草稿，关闭此提示"
        >知道了</button>
      </div>

      <!-- Textarea -->
      <textarea
        v-model="textContent"
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

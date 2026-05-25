<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';

const router = useRouter();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;

type Tool = 'pencil' | 'eraser' | 'line' | 'rect' | 'fill';

const currentTool = ref<Tool>('pencil');
const currentColor = ref('#000000');
let isDrawing = false;
let startX = 0;
let startY = 0;
let canvasSnapshot: ImageData | null = null;

const palette = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080', '#804000', '#004040',
  '#C0C0C0', '#FFFFFF', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF', '#FF8040', '#00FF80',
];

const toolDefs: { id: Tool; label: string; icon: string }[] = [
  { id: 'pencil', label: '铅笔', icon: '✏' },
  { id: 'eraser', label: '橡皮', icon: '◻' },
  { id: 'line', label: '直线', icon: '╲' },
  { id: 'rect', label: '矩形', icon: '▭' },
  { id: 'fill', label: '填充', icon: '🪣' },
];

function resizeCanvas() {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;
  const rect = container.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  if (w <= 0 || h <= 0) return;
  // Save current content
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (tempCtx) tempCtx.drawImage(canvas, 0, 0);

  canvas.width = w;
  canvas.height = h;
  if (ctx) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(tempCanvas, 0, 0);
  }
}

function initCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  if (!ctx) return;
  resizeCanvas();
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  nextTick(() => {
    initCanvas();
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    const container = containerRef.value;
    if (container) resizeObserver.observe(container);
  });
});

onUnmounted(() => {
  if (resizeObserver) resizeObserver.disconnect();
});

// ----- Pointer Events -----

function getPos(e: PointerEvent): { x: number; y: number } {
  const canvas = canvasRef.value!;
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function onPointerDown(e: PointerEvent) {
  if (!ctx) return;
  const { x, y } = getPos(e);
  const canvas = canvasRef.value!;
  canvas.setPointerCapture(e.pointerId);

  if (currentTool.value === 'fill') {
    floodFill(Math.floor(x), Math.floor(y), currentColor.value);
    return;
  }

  isDrawing = true;
  startX = x;
  startY = y;

  if (currentTool.value === 'pencil' || currentTool.value === 'eraser') {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = currentTool.value === 'eraser' ? '#ffffff' : currentColor.value;
    ctx.lineWidth = currentTool.value === 'eraser' ? 16 : 2;
  } else {
    // line / rect: save state for preview
    canvasSnapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
}

function onPointerMove(e: PointerEvent) {
  if (!ctx || !isDrawing) return;
  const { x, y } = getPos(e);

  if (currentTool.value === 'pencil' || currentTool.value === 'eraser') {
    ctx.lineTo(x, y);
    ctx.stroke();
  } else if (currentTool.value === 'line' || currentTool.value === 'rect') {
    if (canvasSnapshot) ctx.putImageData(canvasSnapshot, 0, 0);
    ctx.strokeStyle = currentColor.value;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (currentTool.value === 'line') {
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
    } else {
      ctx.rect(startX, startY, x - startX, y - startY);
    }
    ctx.stroke();
  }
}

function onPointerUp(e: PointerEvent) {
  if (!ctx || !isDrawing) return;
  isDrawing = false;

  if (currentTool.value === 'line' || currentTool.value === 'rect') {
    // Final draw without preview artifacts
    if (canvasSnapshot) ctx.putImageData(canvasSnapshot, 0, 0);
    const { x, y } = getPos(e);
    ctx.strokeStyle = currentColor.value;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (currentTool.value === 'line') {
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
    } else {
      ctx.rect(startX, startY, x - startX, y - startY);
    }
    ctx.stroke();
    canvasSnapshot = null;
  }
}

// ----- Flood Fill -----

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function floodFill(startX: number, startY: number, fillHex: string) {
  if (!ctx) return;
  const canvas = canvasRef.value!;
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const idx = (startY * w + startX) * 4;
  const targetR = data[idx];
  const targetG = data[idx + 1];
  const targetB = data[idx + 2];

  const [fillR, fillG, fillB] = hexToRgb(fillHex);

  if (targetR === fillR && targetG === fillG && targetB === fillB) return;

  const stack: [number, number][] = [[startX, startY]];
  const visited = new Uint8Array(w * h);

  while (stack.length > 0) {
    const [sx, sy] = stack.pop()!;
    if (sx < 0 || sx >= w || sy < 0 || sy >= h) continue;
    const pi = sy * w + sx;
    if (visited[pi]) continue;
    const i = pi * 4;
    if (data[i] !== targetR || data[i + 1] !== targetG || data[i + 2] !== targetB) continue;

    visited[pi] = 1;
    data[i] = fillR;
    data[i + 1] = fillG;
    data[i + 2] = fillB;
    data[i + 3] = 255;

    stack.push([sx + 1, sy], [sx - 1, sy], [sx, sy + 1], [sx, sy - 1]);
  }

  ctx.putImageData(imgData, 0, 0);
}

function clearCanvas() {
  if (!ctx) return;
  const canvas = canvasRef.value!;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
</script>

<template>
  <Window
    title="画图 - 未命名"
    icon="fa fa-paint-brush"
    :isOpen="true"
    :isActive="true"
    @close="router.push('/')"
  >
    <div class="flex flex-col h-full min-h-0 gap-0">
      <!-- Toolbar -->
      <div class="flex items-center gap-[4px] px-[4px] py-[3px] bg-[#c0c0c0] border-b-2 border-[#808080] shrink-0 flex-wrap">
        <span class="text-[11px] font-bold text-black mr-[4px] shrink-0">工具:</span>
        <button
          v-for="t in toolDefs"
          :key="t.id"
          @click="currentTool = t.id"
          class="w-[30px] h-[28px] flex items-center justify-center text-[14px] border-none cursor-pointer shrink-0 bg-[#c0c0c0]"
          :class="currentTool === t.id
            ? 'shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a]'
            : 'shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a]'"
          :title="t.label"
        >
          {{ t.icon }}
        </button>
        <div class="w-[3px] h-[22px] bg-[#808080] border-r border-[#ffffff] shrink-0 mx-[4px]"></div>
        <button
          @click="clearCanvas"
          class="text-[11px] font-bold px-[8px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer shrink-0"
          style="font-family: 'MS Sans Serif', 'Microsoft YaHei', sans-serif;"
        >
          清空
        </button>
      </div>

      <!-- Canvas Area -->
      <div ref="containerRef" class="flex-1 min-h-0 overflow-hidden" style="touch-action: none;">
        <canvas
          ref="canvasRef"
          class="block cursor-crosshair"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
          style="touch-action: none;"
        ></canvas>
      </div>

      <!-- Color Palette -->
      <div class="flex items-center gap-[4px] px-[4px] py-[3px] bg-[#c0c0c0] border-t-2 border-t-[#ffffff] shrink-0 flex-wrap">
        <span class="text-[10px] font-bold text-black mr-[2px] shrink-0">颜色:</span>
        <div class="w-[24px] h-[24px] shrink-0 shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a]" :style="{ backgroundColor: currentColor }"></div>
        <div class="w-[2px] h-[20px] bg-[#808080] shrink-0 mx-[2px]"></div>
        <div class="flex gap-[2px] flex-wrap">
          <button
            v-for="c in palette"
            :key="c"
            @click="currentColor = c"
            class="w-[18px] h-[18px] border-none cursor-pointer shrink-0"
            :class="currentColor === c
              ? 'shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] outline outline-1 outline-black outline-offset-[-1px]'
              : 'shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff]'"
            :style="{ backgroundColor: c }"
          ></button>
        </div>
      </div>
    </div>
  </Window>
</template>

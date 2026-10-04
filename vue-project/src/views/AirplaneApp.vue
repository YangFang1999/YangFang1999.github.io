<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';
import { AirplaneGame } from '../game/engine';
import { G } from '../game/state';

const router = useRouter();
const canvasRef = ref<HTMLCanvasElement | null>(null);

// 游戏本体状态在 game/ 模块里是非响应式的，这里镜像一份供按钮渲染
const bombCount = ref(G.bombCount);
const cheatInvincible = ref(G.cheatInvincible);
const gameState = ref(G.gameState);

let game: AirplaneGame | null = null;
let syncTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  if (!canvasRef.value) return;
  game = new AirplaneGame(canvasRef.value, {
    onStateChange: (s) => { gameState.value = s; },
  });
  game.start();
  syncTimer = setInterval(() => {
    bombCount.value = G.bombCount;
    cheatInvincible.value = G.cheatInvincible;
    gameState.value = G.gameState;
  }, 300);
});

onUnmounted(() => {
  game?.destroy();
  game = null;
  if (syncTimer) clearInterval(syncTimer);
});

const onBomb = () => { game?.useBomb(); bombCount.value = G.bombCount; };
const onInvincible = () => { G.cheatInvincible = !G.cheatInvincible; cheatInvincible.value = G.cheatInvincible; };
const onPause = () => { game?.togglePause(); };
const onPointerMove = (e: PointerEvent) => { game?.handlePointerMove(e); };
const onPointerDown = (e: PointerEvent) => { game?.canvasTap(); game?.handlePointerMove(e); };
</script>

<template>
  <Window
    title="飞机大战"
    icon="fa fa-fighter-jet"
    :isOpen="true"
    :isActive="true"
    :defaultMaximized="true"
    @close="router.push('/')"
  >
    <div class="flex flex-col items-center gap-[4px] w-full min-h-0">
      <canvas
        ref="canvasRef"
        class="shadow-win95-inset outline-none block shrink-0"
        tabindex="0"
        style="image-rendering: auto; touch-action: none;"
        @pointermove="onPointerMove"
        @pointerdown="onPointerDown"
      ></canvas>
      <div class="flex items-center gap-2">
        <button
          @click="onBomb"
          class="text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-sans"
          :style="{ backgroundColor: bombCount > 0 ? '#ffcc88' : '#c0c0c0' }"
        >
          💣 炸弹 (X) x{{ bombCount }}
        </button>
        <button
          @click="onPause"
          class="text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-sans"
          :style="{ backgroundColor: gameState === 'paused' ? '#aaddff' : '#c0c0c0' }"
        >
          {{ gameState === 'paused' ? '▶ 继续 (P)' : '⏸ 暂停 (P)' }}
        </button>
        <button
          @click="onInvincible"
          class="text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-sans"
          :style="{ backgroundColor: cheatInvincible ? '#ff88ff' : '#c0c0c0' }"
        >
          {{ cheatInvincible ? '★ 无敌中 (按 I 关闭)' : '无敌模式 (I)' }}
        </button>
      </div>
    </div>
  </Window>
</template>

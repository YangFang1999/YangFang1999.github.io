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
    fixedSize
    @close="router.push('/')"
  >
    <!-- 画布始终居中；控制台大屏悬浮左侧（不挤占居中），小屏在画布下方横排 -->
    <div class="relative flex flex-col items-center justify-center gap-2 w-full min-h-0">
      <canvas
        ref="canvasRef"
        class="shadow-win95-inset outline-none block shrink-0"
        tabindex="0"
        style="image-rendering: auto; touch-action: none;"
        @pointermove="onPointerMove"
        @pointerdown="onPointerDown"
      ></canvas>

      <div class="gm-console">
        <div class="gm-title">控制台</div>
        <button class="gm-btn" :style="{ backgroundColor: bombCount > 0 ? '#ffd8a8' : '#c0c0c0' }" @click="onBomb">
          <span class="gm-ico">💣</span>
          <span class="gm-label">炸弹 <b :class="bombCount > 0 ? 'text-[#c00000]' : 'text-[#808080]'">×{{ bombCount }}</b></span>
          <span class="gm-key">X</span>
        </button>
        <button class="gm-btn" :style="{ backgroundColor: gameState === 'paused' ? '#b8d8f8' : '#c0c0c0' }" @click="onPause">
          <span class="gm-ico">{{ gameState === 'paused' ? '▶' : '⏸' }}</span>
          <span class="gm-label">{{ gameState === 'paused' ? '继续游戏' : '暂停游戏' }}</span>
          <span class="gm-key">P</span>
        </button>
        <button class="gm-btn" :style="{ backgroundColor: cheatInvincible ? '#f4b8f4' : '#c0c0c0' }" @click="onInvincible">
          <span class="gm-ico">★</span>
          <span class="gm-label">无敌{{ cheatInvincible ? '开' : '关' }}</span>
          <span class="gm-key">I</span>
        </button>
        <div class="gm-hint">
          方向键 / WASD 移动<br>火力全自动<br>把鼠标放画布上即可操控
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
/* 控制台：小屏=画布下方横排；≥1024px=悬浮画布左侧竖排（画布保持窗口居中） */
.gm-console {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: stretch;
  gap: 8px;
  width: 100%;
  margin-top: 2px;
}
.gm-title {
  display: none;
  font-size: 10px;
  font-weight: bold;
  color: #000080;
  padding: 0 2px 3px;
  border-bottom: 1px solid #808080;
}
.gm-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: 'MS Sans Serif', Tahoma, 'Microsoft YaHei', sans-serif;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf;
  transition: filter 0.1s;
}
.gm-btn:hover { filter: brightness(1.06); }
.gm-btn:active { box-shadow: inset -1px -1px #ffffff, inset 1px 1px #0a0a0a; }
.gm-ico { display: none; font-size: 15px; line-height: 1.1; }
.gm-label { font-size: 11px; font-weight: bold; color: #000; line-height: 1.2; white-space: nowrap; }
.gm-key {
  font-size: 9px;
  color: #666;
  line-height: 1.1;
  margin-left: auto;
  padding: 1px 4px;
  background: #ffffff;
  border: 1px solid;
  border-color: #808080 #dfdfdf #dfdfdf #808080;
}
.gm-hint {
  display: none;
  font-size: 9px;
  line-height: 1.7;
  color: #666;
  padding: 6px 2px 0;
  margin-top: 2px;
  border-top: 1px solid #808080;
}
@media (min-width: 1024px) {
  .gm-console {
    position: absolute;
    left: 8px;
    top: 6px;
    width: 118px;
    flex-direction: column;
    justify-content: flex-start;
    gap: 4px;
    margin: 0;
  }
  .gm-title { display: block; }
  .gm-btn { flex-direction: column; align-items: center; gap: 1px; padding: 5px 6px 4px; text-align: center; }
  .gm-ico { display: block; }
  .gm-key { margin-left: 0; }
  .gm-hint { display: block; }
}
</style>

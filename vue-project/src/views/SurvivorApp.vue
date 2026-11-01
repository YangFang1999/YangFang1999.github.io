<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';
import { SurvivorGame } from '../game/survivor/core';
import { G } from '../game/survivor/state';
import type { Choice, Phase } from '../game/survivor/types';

const router = useRouter();
const canvasRef = ref<HTMLCanvasElement | null>(null);

// 游戏状态镜像（供 DOM 升级面板与按钮渲染）
const phase = ref<Phase>(G.phase);
const choices = ref<Choice[]>([]);
const paused = ref(false);
const cheatOpen = ref(false);
const cheatInv = ref(G.cheatInvincible);

let game: SurvivorGame | null = null;
let syncTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  if (!canvasRef.value) return;
  game = new SurvivorGame(canvasRef.value, {
    onPhaseChange: (p) => {
      phase.value = p;
      // 游戏恢复运行时（如暂停中按 P），收起作弊面板避免悬空
      if (p === 'playing') cheatOpen.value = false;
      if (p === 'levelup') choices.value = [...G.choices];
    },
  });
  game.start();
  syncTimer = setInterval(() => {
    phase.value = G.phase;
    paused.value = G.phase === 'paused';
    cheatInv.value = G.cheatInvincible;
    if (G.phase === 'levelup') choices.value = [...G.choices];
  }, 250);
});

onUnmounted(() => {
  game?.destroy();
  game = null;
  if (syncTimer) clearInterval(syncTimer);
});

const onPick = (i: number) => { game?.chooseUpgrade(i); };
const onPause = () => { game?.togglePause(); };
const onCheatOpen = () => {
  if (cheatOpen.value) { cheatOpen.value = false; return; }
  cheatOpen.value = true;
  if (G.phase === 'playing') game?.togglePause();
};
const onCheatClose = () => { cheatOpen.value = false; };
const cheat = (what: 'inv' | 'xp' | 'weapon' | 'passive' | 'heal' | 'clear' | 'time') => {
  if (!game) return;
  switch (what) {
    case 'inv': cheatInv.value = game.cheatToggleInvincible(); return;
    case 'xp': game.cheatLevelUp(); break;
    case 'weapon': game.cheatWeaponsUp(); break;
    case 'passive': game.cheatPassivesUp(); break;
    case 'heal': game.cheatHeal(); break;
    case 'clear': game.cheatClearScreen(); break;
    case 'time': game.cheatTimeSkip(60); break;
  }
};
const onPointerMove = (e: PointerEvent) => { game?.handlePointerMove(e.clientX, e.clientY); };
const onPointerDown = (e: PointerEvent) => {
  if (G.phase === 'menu') { game?.menuClick(e.clientX); return; }
  if (G.phase === 'gameover' || G.phase === 'victory') game?.canvasTap();
  game?.handlePointerMove(e.clientX, e.clientY);
};
</script>

<template>
  <Window
    title="桌面保卫战"
    icon="fa fa-shield"
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
        style="touch-action: none;"
        @pointermove="onPointerMove"
        @pointerdown="onPointerDown"
      ></canvas>

      <div class="gm-console">
        <div class="gm-title">控制台</div>
        <button class="gm-btn" :style="{ backgroundColor: paused ? '#b8d8f8' : '#c0c0c0' }" @click="onPause">
          <span class="gm-ico">{{ paused ? '▶' : '⏸' }}</span>
          <span class="gm-label">{{ paused ? '继续游戏' : '暂停游戏' }}</span>
          <span class="gm-key">P</span>
        </button>
        <button class="gm-btn" :style="{ backgroundColor: cheatInv ? '#f4b8f4' : '#c0c0c0' }" @click="onCheatOpen">
          <span class="gm-ico">⚙</span>
          <span class="gm-label">作弊控制台</span>
          <span class="gm-key">I</span>
        </button>
        <div class="gm-hint">
          移动鼠标操控光标<br>收集文档碎片升级<br>把鼠标放画布上即可游玩
        </div>
      </div>

      <!-- 作弊控制台 -->
      <div
        v-if="cheatOpen"
        class="absolute inset-0 z-20 flex items-center justify-center p-3"
      >
        <div class="w-full max-w-[460px] bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] shadow-[6px_6px_16px_rgba(0,0,0,0.5)]">
          <div class="h-[26px] bg-[linear-gradient(90deg,#800080,#c060c0)] flex items-center px-2">
            <i class="fa fa-magic text-white text-[11px] mr-2"></i>
            <span class="text-white text-[12px] font-bold flex-1">作弊控制台（游戏已暂停）</span>
            <button @click="onCheatClose" class="text-white text-[12px] font-bold px-1 cursor-pointer">✕</button>
          </div>
          <div class="p-3 grid grid-cols-2 gap-2 text-[12px]">
            <button @click="cheat('inv')" class="py-1.5 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#fff] active:border-b-[#fff] cursor-pointer font-bold" :style="{ backgroundColor: cheatInv ? '#ff88ff' : '#c0c0c0' }">
              ★ 无敌模式：{{ cheatInv ? '开' : '关' }}
            </button>
            <button @click="cheat('heal')" class="py-1.5 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#fff] active:border-b-[#fff] cursor-pointer">
              ❤ 回满生命
            </button>
            <button @click="cheat('xp')" class="py-1.5 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#fff] active:border-b-[#fff] cursor-pointer">
              ⬆ 升 1 级 (弹三选一)
            </button>
            <button @click="cheat('weapon')" class="py-1.5 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#fff] active:border-b-[#fff] cursor-pointer">
              🗡 全部武器 +1 级
            </button>
            <button @click="cheat('passive')" class="py-1.5 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#fff] active:border-b-[#fff] cursor-pointer">
              📦 全部被动 +1
            </button>
            <button @click="cheat('clear')" class="py-1.5 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#fff] active:border-b-[#fff] cursor-pointer">
              🗑 回收站清屏
            </button>
            <button @click="cheat('time')" class="py-1.5 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#fff] active:border-b-[#fff] cursor-pointer col-span-2">
              ⏩ 时间快进 1 分钟
            </button>
          </div>
          <div class="px-3 pb-2 text-[10px] text-gray-700">
            提示：I 键快速开关无敌 · 关闭面板后按 P 继续
          </div>
        </div>
      </div>

      <!-- 升级三选一面板 -->
      <div
        v-if="phase === 'levelup'"
        class="absolute inset-0 z-20 flex items-center justify-center p-3"
      >
        <div class="w-full max-w-[560px] bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#0a0a0a] border-b-[#0a0a0a] shadow-[6px_6px_16px_rgba(0,0,0,0.5)]">
          <div class="h-[26px] bg-[linear-gradient(90deg,#000080,#1084d0)] flex items-center px-2">
            <i class="fa fa-arrow-up text-white text-[11px] mr-2"></i>
            <span class="text-white text-[12px] font-bold flex-1">升级！选择一项强化 (按 1/2/3 或点击)</span>
          </div>
          <div class="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              v-for="(c, i) in choices"
              :key="c.kind + String(c.id) + i"
              @click="onPick(i)"
              class="text-left bg-[#c0c0c0] p-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] cursor-pointer"
            >
              <div class="flex items-center gap-2 mb-1">
                <i :class="c.icon" class="text-[#000080] text-base w-5 text-center"></i>
                <span class="text-[12px] font-bold text-black leading-tight">{{ c.name }}</span>
              </div>
              <div class="text-[10px] text-[#000080] font-bold mb-1">{{ c.levelText }}</div>
              <div class="text-[10px] text-gray-800 leading-snug">{{ c.desc }}</div>
            </button>
          </div>
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

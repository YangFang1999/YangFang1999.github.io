<script setup lang="ts">
// 桌宠：QQ 企鹅。任务栏模式会自主漫步；拖到桌面任意处悬浮住下（不再乱走）；
// 双击悬浮的企鹅回家；90 秒无互动打瞌睡。位置与模式 localStorage 持久化。
import { ref, onMounted, onUnmounted } from 'vue';

const QUOTES = [
  '在吗？',
  '滴滴滴～',
  '您有一条新消息',
  '咯咯咯～',
  '上线通知：我上线啦！',
  '系统消息：摸鱼可耻哦',
  '今天也要加油鸭！',
  '我的围巾好看吗？',
  '要不要来局飞机大战？',
  '桌面保卫战守住了吗？',
  '隐身对其可见哦～',
  '别盯着我看啦',
  '2 个太阳了嘛？',
  '越努力，越幸运',
];

const STATE_KEY = 'qq-pet-state';
const SLEEP_AFTER_MS = 90000;

const x = ref(80);
const restBottom = ref(40);   // 静止时贴任务栏(40)或悬浮高度
const lift = ref(0);          // 拖拽过程中的附加高度
const dir = ref(1);
const moving = ref(false);
const jumping = ref(false);
const bounce = ref(false);
const bubble = ref<string | null>(null);
const dragging = ref(false);
const sleeping = ref(false);

const petEl = ref<HTMLElement | null>(null);

let timer: ReturnType<typeof setTimeout> | undefined;
let bubbleTimer: ReturnType<typeof setTimeout> | undefined;
let vw = window.innerWidth;
let lastActive = Date.now();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isFloating = (): boolean => restBottom.value > 70;

function loadState(): void {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
    if (s && typeof s.x === 'number' && typeof s.bottom === 'number') {
      x.value = Math.max(4, Math.min(vw - 52, s.x));
      restBottom.value = Math.max(40, Math.min(window.innerHeight - 120, s.bottom));
    }
  } catch { /* 忽略 */ }
}

function saveState(): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({ x: x.value, bottom: restBottom.value }));
  } catch { /* 忽略 */ }
}

function schedule(ms: number): void {
  timer = setTimeout(tick, ms);
}

function showBubble(): void {
  if (sleeping.value) return;
  bubble.value = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  if (bubbleTimer) clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => { bubble.value = null; }, 2400);
}

function tick(): void {
  if (dragging.value) return;
  // 90 秒无互动 → 打瞌睡（Zzz 气泡常驻，停止一切移动）
  if (!sleeping.value && Date.now() - lastActive > SLEEP_AFTER_MS) {
    sleeping.value = true;
    bubble.value = 'Zzz…';
    if (bubbleTimer) clearTimeout(bubbleTimer);
    schedule(3000);
    return;
  }
  // 悬浮模式 / 睡觉时：原地不动（眨眼照常）
  if (isFloating() || sleeping.value) {
    schedule(2500 + Math.random() * 2500);
    return;
  }
  if (moving.value) {
    moving.value = false;
    if (Math.random() < 0.22) showBubble();
    schedule(1400 + Math.random() * 2600);
    return;
  }
  const r = Math.random();
  if (!reducedMotion && r < 0.55) {
    startWalk();
  } else if (!reducedMotion && r < 0.64) {
    jump();
  } else {
    if (Math.random() < 0.3) showBubble();
    schedule(1600 + Math.random() * 2800);
  }
}

function startWalk(): void {
  moving.value = true;
  if (x.value < vw * 0.18) dir.value = 1;
  else if (x.value > vw * 0.82) dir.value = -1;
  else dir.value = Math.random() < 0.5 ? -1 : 1;
  const dist = 60 + Math.random() * 150;
  const target = Math.max(8, Math.min(vw - 56, x.value + dir.value * dist));
  dir.value = target >= x.value ? 1 : -1;
  const dur = Math.max(900, dist / 0.045);
  x.value = target;
  schedule(dur + 80);
}

function jump(): void {
  jumping.value = true;
  setTimeout(() => { jumping.value = false; schedule(1500 + Math.random() * 2500); }, 620);
}

function react(): void {
  bounce.value = true;
  showBubble();
  setTimeout(() => { bounce.value = false; }, 520);
}

// 回到任务栏（双击悬浮企鹅 / 控制面板按钮）
function goHome(): void {
  restBottom.value = 40;
  lift.value = 0;
  saveState();
  showBubble();
  schedule(1600);
}

// ============ 拖拽 ============
let grabDx = 0;
let grabOffset = 0;
let downX = 0;
let downY = 0;
let downAt = 0;
let moved = false;
let lastClickAt = 0;

function wake(): void {
  lastActive = Date.now();
  if (sleeping.value) {
    sleeping.value = false;
    if (bubble.value === 'Zzz…') bubble.value = null;
  }
}

function onPointerDown(e: PointerEvent): void {
  if (e.button !== 0) return;
  wake();
  dragging.value = true;
  moving.value = false;
  if (timer) clearTimeout(timer);
  const el = petEl.value;
  if (!el) return;
  try { el.setPointerCapture(e.pointerId); } catch { /* 合成事件无活动指针，忽略 */ }
  const rect = el.getBoundingClientRect();
  grabDx = e.clientX - rect.left;
  grabOffset = e.clientY - rect.bottom;
  downX = e.clientX;
  downY = e.clientY;
  downAt = Date.now();
  moved = false;
}

function onPointerMove(e: PointerEvent): void {
  if (!dragging.value || !petEl.value) return;
  // 用按下坐标的距离判定是否拖拽（movementX 在触屏/合成事件上不可靠）
  if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) moved = true;
  x.value = Math.max(4, Math.min(vw - 52, e.clientX - grabDx));
  // 拖拽期间自由跟随指针（仅视口钳制），落下时的位置由 pointerUp 的归位逻辑决定
  const bottomNow = Math.max(0, Math.min(window.innerHeight - 58, window.innerHeight - (e.clientY - grabOffset)));
  lift.value = bottomNow - restBottom.value;
}

function onPointerUp(e: PointerEvent): void {
  if (!dragging.value) return;
  dragging.value = false;
  try { petEl.value?.releasePointerCapture(e.pointerId); } catch { /* 已释放 */ }
  // 松手落点：靠近任务栏 → 回到任务栏模式；其余高度 → 悬浮住下
  const final = restBottom.value + lift.value;
  if (final < 70) {
    restBottom.value = 40;
  } else {
    restBottom.value = Math.min(final, window.innerHeight - 58);
  }
  lift.value = 0;
  const wasFloating = isFloating();
  saveState();
  const quick = Date.now() - downAt < 350 && !moved;
  if (quick) {
    const now = Date.now();
    if (wasFloating && now - lastClickAt < 500) {
      goHome();
      lastClickAt = 0;
      return;
    }
    lastClickAt = now;
    react();
  } else if (wasFloating) {
    showBubble();
  }
  schedule(1400);
}

function onResize(): void {
  vw = window.innerWidth;
  x.value = Math.max(4, Math.min(vw - 52, x.value));
  restBottom.value = Math.max(40, Math.min(window.innerHeight - 58, restBottom.value));
}

function onGoHome(): void {
  wake();
  goHome();
}

onMounted(() => {
  vw = window.innerWidth;
  loadState();
  if (isFloating()) showBubble();
  schedule(1800);
  window.addEventListener('resize', onResize);
  window.addEventListener('pet-go-home', onGoHome);
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
  if (bubbleTimer) clearTimeout(bubbleTimer);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('pet-go-home', onGoHome);
});
</script>

<template>
  <div
    ref="petEl"
    class="qq-pet fixed z-[55] select-none"
    :class="{ moving: moving && !dragging, jumping, bounce, dragging, sleeping }"
    :style="{
      left: x + 'px',
      bottom: (restBottom + lift) + 'px',
      transitionDuration: (moving && !dragging ? 1200 : 260) + 'ms',
    }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <!-- 气泡：Win98 提示框风格 -->
    <div v-if="bubble" class="pet-bubble">{{ bubble }}</div>

    <!-- 阴影 -->
    <div class="pet-shadow" :style="{ opacity: dragging ? 0.15 : 0.3, transform: `scaleX(${dragging ? 0.7 : 1})` }"></div>

    <!-- 企鹅本体：几何 1:1 复刻参考 CSS 实现（坐标系 400x400） -->
    <svg width="50" height="58" viewBox="84 122 200 232" class="pet-body">
      <!-- 脚蹼（z:-1，身后） -->
      <ellipse cx="152.5" cy="330.5" rx="40.5" ry="13.5" fill="#e09d45" />
      <ellipse cx="214.5" cy="330.5" rx="40.5" ry="13.5" fill="#e09d45" />
      <!-- 翅膀（z:-1，身后，大椭圆近垂直伸出） -->
      <ellipse cx="111.5" cy="284.5" rx="40.5" ry="13.5" fill="#000" transform="rotate(-75 111.5 284.5)" />
      <ellipse cx="255.5" cy="284.5" rx="40.5" ry="13.5" fill="#000" transform="rotate(-100 255.5 284.5)" />
      <!-- 头部：圆顶方底穹顶（border-radius 100% 100% 40% 40%） -->
      <path d="M109,210 A75,75 0 0 1 259,210 L259,225 A60,60 0 0 1 199,285 L169,285 A60,60 0 0 1 109,225 Z" fill="#000" />
      <!-- 身体：正圆 + 白肚 -->
      <circle cx="184" cy="268" r="75" fill="#000" />
      <ellipse cx="185" cy="271" rx="55" ry="65" fill="#fff" />
      <!-- 围巾：颈部黑条（scarf::before） -->
      <rect x="109" y="172" width="150" height="20" rx="10" fill="#000" />
      <!-- 围巾：红带（border-top 40px red，底角 23%） -->
      <path d="M109,220 H259 V225.5 A34.5,34.5 0 0 1 224.5,260 H143.5 A34.5,34.5 0 0 1 109,225.5 Z" fill="#ff0000" />
      <!-- 围巾：垂尾（scarf::after） -->
      <path d="M142,211 H178 V245.7 A8.3,8.3 0 0 1 169.7,254 H150.3 A8.3,8.3 0 0 1 142,245.7 Z" fill="#ff0000" />
      <!-- 眼斑：长条白椭圆（21x36） -->
      <ellipse cx="169.5" cy="176" rx="10.5" ry="18" fill="#fff" />
      <ellipse cx="201.5" cy="176" rx="10.5" ry="18" fill="#fff" />
      <!-- 眼睛：左瞳孔（9x14 偏下）+ 右挑眉弧线（border-top 5px rotate -11°） -->
      <g class="eyes">
        <ellipse cx="171.5" cy="181" rx="4.5" ry="7" fill="#000" />
        <path d="M195,184 Q202,175 209,182" stroke="#000" stroke-width="5" fill="none" stroke-linecap="round" transform="rotate(-11 202 180.5)" />
      </g>
      <!-- 嘴：宽扁橘色椭圆（81x27，z:9 最上层） -->
      <ellipse cx="186.5" cy="212.5" rx="40.5" ry="13.5" fill="#e09d45" />
    </svg>
  </div>
</template>

<style scoped>
.qq-pet {
  width: 50px;
  height: 58px;
  cursor: grab;
  transition: left linear, bottom 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
  touch-action: none;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.25));
}
.qq-pet.dragging { cursor: grabbing; }

.pet-body { display: block; image-rendering: auto; }

/* 走路摇摆 */
.qq-pet.moving .pet-body {
  animation: waddle 0.42s ease-in-out infinite;
  transform-origin: 50% 100%;
}
@keyframes waddle {
  0%, 100% { transform: rotate(-5deg) translateY(0); }
  25% { transform: rotate(0deg) translateY(-2px); }
  50% { transform: rotate(5deg) translateY(0); }
  75% { transform: rotate(0deg) translateY(-2px); }
}

/* 跳跃 */
.qq-pet.jumping .pet-body {
  animation: hop 0.6s cubic-bezier(0.28, 0.84, 0.42, 1);
}
@keyframes hop {
  0% { transform: translateY(0) scaleY(1); }
  18% { transform: translateY(2px) scaleY(0.88); }
  55% { transform: translateY(-20px) scaleY(1.06); }
  82% { transform: translateY(1px) scaleY(0.94); }
  100% { transform: translateY(0) scaleY(1); }
}

/* 点击弹跳 */
.qq-pet.bounce .pet-body {
  animation: bnc 0.5s cubic-bezier(0.28, 0.84, 0.42, 1);
}
@keyframes bnc {
  0% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-12px) scale(1.06); }
  60% { transform: translateY(0) scale(0.96); }
  100% { transform: translateY(0) scale(1); }
}

/* 眨眼（缩放瞳孔与挑眉，缩放中心在两眼之间） */
.eyes { animation: blink 4.6s infinite; transform-origin: 186px 181px; transform-box: view-box; }
@keyframes blink {
  0%, 94%, 100% { transform: scaleY(1); }
  96%, 98% { transform: scaleY(0.08); }
}

/* 睡觉：闭眼 + 歪头 */
.qq-pet.sleeping .eyes { animation: none; transform: scaleY(0.12); }
.qq-pet.sleeping .pet-body { transform: rotate(4deg); transform-origin: 50% 100%; }

/* 拖拽时轻微晃动 */
.qq-pet.dragging .pet-body {
  animation: dangle 0.5s ease-in-out infinite;
  transform-origin: 50% 0%;
}
@keyframes dangle {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(4deg); }
}

/* 阴影贴在任务栏上 */
.pet-shadow {
  position: absolute;
  left: 50%;
  bottom: -3px;
  width: 42px;
  height: 6px;
  margin-left: -21px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 50%;
  transition: opacity 0.26s, transform 0.26s;
}

/* Win98 气泡提示 */
.pet-bubble {
  position: absolute;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffe1;
  border: 1px solid #000;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.35);
  color: #000;
  font: 11px "Microsoft YaHei", "MS Sans Serif", sans-serif;
  padding: 4px 8px;
  white-space: nowrap;
  z-index: 2;
  animation: pop 0.18s ease-out;
}
.pet-bubble::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 50%;
  margin-left: -4px;
  border: 4px solid transparent;
  border-top-color: #ffffe1;
}
@keyframes pop {
  from { transform: translateX(-50%) scale(0.7); opacity: 0; }
  to { transform: translateX(-50%) scale(1); opacity: 1; }
}
</style>

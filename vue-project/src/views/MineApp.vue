<script setup lang="ts">
// 扫雷 —— Win98 经典复刻。
// 引擎在 src/game/minesweeper.ts（纯逻辑）。特色：
// - 七段 LED 雷数/计时器、四种表情按钮（普通/按下/失败/胜利墨镜）
// - 经典八色数字、旗→问号→无循环、单击已开数字做和弦（chord）
// - 首点 3×3 保护、失败亮出全部雷并给错旗打叉、胜利自动补旗
// - 三档难度 + 本机最佳纪录（每难度分开，破纪录提示）
// - F2 开局、触屏长按插旗、胜负联动桌宠（minesweeper-end 事件）
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Window from '../components/Window.vue';
import { Minesweeper, DIFFICULTIES, difficultyByKey, type Cell, type Difficulty } from '../game/minesweeper';
import { closeWindows } from '../winNav';

const BEST_KEY = 'minesweeper-best';
interface BestRecord { time: number; date: string }
type BestMap = Partial<Record<Difficulty['key'], BestRecord>>;

function loadBest(): BestMap {
  try {
    const raw = JSON.parse(localStorage.getItem(BEST_KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch { return {}; }
}

const diffKey = ref<Difficulty['key']>('beginner');
const diff = computed(() => difficultyByKey(diffKey.value));
// 窗口宽度随难度走（真实扫雷窗口也是跟着棋盘缩放的）
const winWidthRem = computed(() => (diffKey.value === 'expert' ? 47 : diffKey.value === 'intermediate' ? 28 : 18));
const eng = new Minesweeper(diff.value.w, diff.value.h, diff.value.m);
const cells = ref<Cell[]>([]);
const face = ref<'normal' | 'oh' | 'dead' | 'cool'>('normal');
const elapsedSec = ref(0);
const newRecord = ref(false);
const best = ref<BestMap>(loadBest());

let startAt = 0;
let stopAt = 0;
let timerId: ReturnType<typeof setInterval> | undefined;
let longTimer: ReturnType<typeof setTimeout> | undefined;
let longDone = false;
let pressIdx = -1;
let pressPt: { x: number; y: number } | null = null;
let ctxLockUntil = 0;   // 触屏长按插旗后短暂屏蔽 contextmenu，防止系统再派发导致二次切换
let bannerTimer: ReturnType<typeof setTimeout> | undefined;

function sync(): void {
  cells.value = eng.grid.map(c => ({ ...c }));
  // 引擎字段非响应式，LED 雷数随每次操作同步刷新
  flagsLeft.value = eng.mines - eng.flagCount;
}

const flagsLeft = ref(0);
// 计时器只在 startTimer/stopTimer 之间存活，用普通标志位守门即可。
// 之前这里用 computed 读 eng.started/eng.over——引擎字段非响应式，computed 无依赖可追踪、
// 首次求值后永久缓存，全靠调用时序侥幸正确（AGENTS.md 点名的坑）。
let timerRunning = false;

function tickTimer(): void {
  if (timerRunning) elapsedSec.value = Math.min(999, Math.floor((Date.now() - startAt) / 1000));
}

function startTimer(): void {
  startAt = Date.now();
  stopAt = 0;
  if (timerId) clearInterval(timerId);
  timerRunning = true;
  timerId = setInterval(tickTimer, 250);
  tickTimer();
}

function stopTimer(): void {
  timerRunning = false;
  stopAt = Date.now();
  if (timerId) { clearInterval(timerId); timerId = undefined; }
  elapsedSec.value = Math.min(999, Math.floor((stopAt - startAt) / 1000));
}

function finish(won: boolean): void {
  stopTimer();
  face.value = won ? 'cool' : 'dead';
  if (won) {
    const b = best.value[diffKey.value];
    if (!b || elapsedSec.value < b.time) {
      best.value = {
        ...best.value,
        [diffKey.value]: { time: elapsedSec.value, date: new Date().toLocaleDateString('zh-CN') },
      };
      try { localStorage.setItem(BEST_KEY, JSON.stringify(best.value)); } catch { /* 忽略 */ }
      newRecord.value = true;
      if (bannerTimer) clearTimeout(bannerTimer);
      bannerTimer = setTimeout(() => { newRecord.value = false; }, 5000);
    }
  }
  try { window.dispatchEvent(new CustomEvent('minesweeper-end', { detail: { won } })); } catch { /* 忽略 */ }
}

function newGame(): void {
  eng.w = diff.value.w;
  eng.h = diff.value.h;
  eng.mines = diff.value.m;
  eng.reset();
  sync();
  face.value = 'normal';
  newRecord.value = false;
  elapsedSec.value = 0;
  stopAt = 0;
  if (timerId) { clearInterval(timerId); timerId = undefined; }
  timerRunning = false;
  longDone = false;
  pressIdx = -1;
}

function setDifficulty(key: Difficulty['key']): void {
  if (diffKey.value === key) { newGame(); return; }
  diffKey.value = key;
  newGame();
}

function doOpen(x: number, y: number): void {
  const r = eng.open(x, y);
  sync();
  if (r !== 'noop' && eng.started && !timerId && !eng.over) startTimer();
  if (r === 'boom') finish(false);
  else if (eng.over && eng.won) finish(true);
}

function doFlag(x: number, y: number): void {
  if (eng.over) return;
  eng.cycleFlag(x, y);
  sync();
  if (eng.started && !timerId && !eng.over) startTimer();
}

function coords(i: number): [number, number] {
  return [i % eng.w, Math.floor(i / eng.w)];
}

function cancelPress(): void {
  if (longTimer) { clearTimeout(longTimer); longTimer = undefined; }
  longDone = false;
  pressIdx = -1;
  pressPt = null;
  if (face.value === 'oh') face.value = 'normal';
}

function onCellDown(e: PointerEvent, i: number): void {
  if (eng.over) return;
  if (e.pointerType === 'mouse') {
    if (e.button === 0) { face.value = 'oh'; pressIdx = i; pressPt = { x: e.clientX, y: e.clientY }; }
    return;
  }
  // 触屏：长按插旗，短按翻开；滑动取消
  pressIdx = i;
  pressPt = { x: e.clientX, y: e.clientY };
  longDone = false;
  if (longTimer) clearTimeout(longTimer);
  longTimer = setTimeout(() => {
    longTimer = undefined;
    longDone = true;
    ctxLockUntil = Date.now() + 800;
    const [x, y] = coords(i);
    doFlag(x, y);
  }, 350);
}

function onCellMove(e: PointerEvent): void {
  // 触屏滑动出按键范围：取消本次按压（touch 指针有隐式捕获，pointerup 仍落在原格）
  if (pressIdx < 0 || e.pointerType === 'mouse' || !pressPt) return;
  if (Math.abs(e.clientX - pressPt.x) + Math.abs(e.clientY - pressPt.y) > 12) cancelPress();
}

function onCellUp(e: PointerEvent, i: number): void {
  if (longTimer) { clearTimeout(longTimer); longTimer = undefined; }
  const wasLong = longDone;
  longDone = false;
  const wasPress = pressIdx === i;
  pressIdx = -1;
  pressPt = null;
  if (face.value === 'oh') face.value = 'normal';
  if (!wasPress || eng.over) return;
  const [x, y] = coords(i);
  const c = cells.value[i];
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  if (c.state === 'revealed') {
    const boom = eng.chord(x, y);
    sync();
    if (boom) finish(false);
    else if (eng.over && eng.won) finish(true);
  } else if (!wasLong) {
    doOpen(x, y);
  }
}

function onCtxMenu(i: number): void {
  // 安卓触屏长按插旗后系统会再派发 contextmenu，短暂屏蔽防止二次切换
  if (Date.now() < ctxLockUntil) return;
  const [x, y] = coords(i);
  doFlag(x, y);
}

function onCellLeave(): void {
  // 鼠标拖出格子 / 触屏释放后：复位按压态（touch 隐式捕获下 leave 在释放后才触发，无害）
  cancelPress();
}

// ============ 菜单 ============
const openMenu = ref<'game' | 'help' | null>(null);
const bestDialog = ref(false);

function toggleMenu(m: 'game' | 'help'): void {
  openMenu.value = openMenu.value === m ? null : m;
}
function closeMenus(): void {
  openMenu.value = null;
}
function onAbout(): void {
  closeMenus();
  alert('扫雷 · Windows 98 Edition\n\n左键翻开 / 右键插旗 / 单击数字做和弦\nF2 开局 · 触屏长按插旗\n\n祝你手气好（或者手速快）。');
}
function onDocClick(e: MouseEvent): void {
  const t = e.target as HTMLElement | null;
  if (t?.closest('.ms-menu') || t?.closest('.ms-dropdown')) return;
  closeMenus();
  if (bestDialog.value && !t?.closest('.ms-best') && !t?.closest('[data-best-btn]')) bestDialog.value = false;
}
function onKey(e: KeyboardEvent): void {
  if (e.key === 'F2') { e.preventDefault(); newGame(); }
  if (e.key === 'Escape') { closeMenus(); bestDialog.value = false; }
}

onMounted(() => {
  newGame();
  document.addEventListener('click', onDocClick);
  window.addEventListener('keydown', onKey);
});
onUnmounted(() => {
  document.removeEventListener('click', onDocClick);
  window.removeEventListener('keydown', onKey);
  if (timerId) clearInterval(timerId);
  if (longTimer) clearTimeout(longTimer);
  if (bannerTimer) clearTimeout(bannerTimer);
});

// ============ 七段 LED ============
const SEG_MAP: Record<string, string> = {
  '0': 'ABCDEF', '1': 'BC', '2': 'ABGED', '3': 'ABGCD', '4': 'FGBC',
  '5': 'AFGCD', '6': 'AFGEDC', '7': 'ABC', '8': 'ABCDEFG', '9': 'ABCFGD', '-': 'G', ' ': '',
};
const SEGS: Array<{ k: string; d: string }> = [
  { k: 'A', d: 'M2,1 L11,1 L9.6,2.6 L3.4,2.6 Z' },
  { k: 'B', d: 'M11.4,1.6 L11.4,10.4 L10.2,9.4 L10.2,3 Z' },
  { k: 'C', d: 'M11.4,12.6 L11.4,21.4 L10.2,20 L10.2,13.6 Z' },
  { k: 'D', d: 'M2,22 L11,22 L9.6,20.4 L3.4,20.4 Z' },
  { k: 'E', d: 'M1.6,12.6 L1.6,21.4 L2.8,20 L2.8,13.6 Z' },
  { k: 'F', d: 'M1.6,1.6 L1.6,10.4 L2.8,9.4 L2.8,3 Z' },
  { k: 'G', d: 'M2,11.1 L3.4,12 L9.6,12 L11,11.1 L9.6,10.2 L3.4,10.2 Z' },
];
function ledChars(v: number): string[] {
  const clamped = Math.max(-99, Math.min(999, v));
  const str = clamped < 0 ? '-' + String(-clamped).padStart(2, '0') : String(clamped).padStart(3, '0');
  return str.split('');
}
const ledOn = (seg: string, ch: string): boolean => (SEG_MAP[ch] ?? '').includes(seg);
</script>

<template>
  <Window
    title="扫雷"
    icon="fa fa-bomb"
    :isOpen="true"
    :isActive="true"
    plainMenus
    :widthRem="winWidthRem"
    @close="closeWindows(['mine'])"
  >
    <div class="ms-root">
      <!-- 菜单行 -->
      <div class="ms-menu">
        <div class="ms-menu-item" :class="{ active: openMenu === 'game' }" @click.stop="toggleMenu('game')">
          游戏(G)
          <div v-if="openMenu === 'game'" class="ms-dropdown">
            <div class="ms-dd-item" @click.stop="closeMenus(); newGame()">开局(F2)</div>
            <hr class="ms-dd-sep">
            <div v-for="d in DIFFICULTIES" :key="d.key" class="ms-dd-item" @click.stop="closeMenus(); setDifficulty(d.key)">
              <span class="ms-dd-check">{{ diffKey === d.key ? '✓' : '' }}</span>{{ d.name }}
            </div>
            <hr class="ms-dd-sep">
            <div class="ms-dd-item" data-best-btn @click.stop="closeMenus(); bestDialog = true">最佳纪录...</div>
          </div>
        </div>
        <div class="ms-menu-item" :class="{ active: openMenu === 'help' }" @click.stop="toggleMenu('help')">
          帮助(H)
          <div v-if="openMenu === 'help'" class="ms-dropdown">
            <div class="ms-dd-item" @click.stop="onAbout">关于扫雷...</div>
          </div>
        </div>
      </div>

      <!-- 游戏区:面板与棋盘同宽,整体居中(仿 Win98 紧凑窗体) -->
      <div class="ms-playfield">
        <div class="ms-panel">
        <div class="ms-led"><svg v-for="(ch, i) in ledChars(flagsLeft)" :key="'m' + i" viewBox="0 0 13 23" width="17" height="30">
          <path v-for="s in SEGS" :key="s.k" :d="s.d" :fill="ledOn(s.k, ch) ? '#ff0000' : '#3a0000'" />
        </svg></div>
        <button type="button" class="ms-face" title="开局(F2)" @click="newGame">
          <svg viewBox="0 0 17 17" width="24" height="24">
              <circle cx="8.5" cy="8.5" r="8" fill="#ffff00" stroke="#000" stroke-width="1" />
              <template v-if="face === 'dead'">
                <path d="M4,5 L6.6,7.6 M6.6,5 L4,7.6 M10.4,5 L13,7.6 M13,5 L10.4,7.6" stroke="#000" stroke-width="1.1" />
                <path d="M5,13.4 Q8.5,10.6 12,13.4" stroke="#000" fill="none" stroke-width="1.1" />
              </template>
              <template v-else-if="face === 'cool'">
                <path d="M2.4,5.4 L15,5.4" stroke="#000" stroke-width="1.2" />
                <rect x="3.4" y="5.6" width="4.6" height="3.2" fill="#000" />
                <rect x="9" y="5.6" width="4.6" height="3.2" fill="#000" />
                <path d="M5,12.6 Q8.5,15 12,12.6" stroke="#000" fill="none" stroke-width="1.1" />
              </template>
              <template v-else-if="face === 'oh'">
                <rect x="4.4" y="4.6" width="1.8" height="2.8" fill="#000" />
                <rect x="10.8" y="4.6" width="1.8" height="2.8" fill="#000" />
                <circle cx="8.5" cy="11.8" r="1.9" fill="none" stroke="#000" stroke-width="1.1" />
              </template>
              <template v-else>
                <rect x="4.4" y="4.6" width="1.8" height="2.8" fill="#000" />
                <rect x="10.8" y="4.6" width="1.8" height="2.8" fill="#000" />
                <path d="M4.8,10.8 Q8.5,13.8 12.2,10.8" stroke="#000" fill="none" stroke-width="1.1" />
              </template>
            </svg>
          </button>
        <div class="ms-led"><svg v-for="(ch, i) in ledChars(elapsedSec)" :key="'t' + i" viewBox="0 0 13 23" width="17" height="30">
          <path v-for="s in SEGS" :key="s.k" :d="s.d" :fill="ledOn(s.k, ch) ? '#ff0000' : '#3a0000'" />
        </svg></div>
        </div>

        <div class="ms-board-frame">
          <div class="ms-board" :style="{ gridTemplateColumns: `repeat(${diff.w}, 22px)` }">
            <button
              v-for="(c, i) in cells"
              :key="i"
              type="button"
              class="ms-cell"
              :class="[c.state === 'revealed' ? 'rev' : 'hid', c.exploded ? 'boom' : '', { n1: c.state === 'revealed' && c.adj === 1, n2: c.state === 'revealed' && c.adj === 2, n3: c.state === 'revealed' && c.adj === 3, n4: c.state === 'revealed' && c.adj === 4, n5: c.state === 'revealed' && c.adj === 5, n6: c.state === 'revealed' && c.adj === 6, n7: c.state === 'revealed' && c.adj === 7, n8: c.state === 'revealed' && c.adj === 8 }]"
              @pointerdown="onCellDown($event, i)"
              @pointerup="onCellUp($event, i)"
              @pointermove="onCellMove($event)"
              @pointerleave="onCellLeave"
              @pointercancel="cancelPress"
              @contextmenu.prevent="onCtxMenu(i)"
            >
              <template v-if="c.state === 'revealed' && c.mine">
                <svg viewBox="0 0 16 16" width="18" height="18" class="ms-fig">
                  <line x1="8" y1="1.5" x2="8" y2="14.5" stroke="#000" stroke-width="1.2" />
                  <line x1="1.5" y1="8" x2="14.5" y2="8" stroke="#000" stroke-width="1.2" />
                  <line x1="3.6" y1="3.6" x2="12.4" y2="12.4" stroke="#000" stroke-width="1.2" />
                  <line x1="12.4" y1="3.6" x2="3.6" y2="12.4" stroke="#000" stroke-width="1.2" />
                  <circle cx="8" cy="8" r="4.4" fill="#000" />
                  <rect x="6.4" y="5.2" width="2" height="2" fill="#fff" />
                </svg>
              </template>
              <template v-else-if="c.state === 'flag'">
                <svg viewBox="0 0 16 16" width="18" height="18" class="ms-fig">
                  <path d="M9.8,2.6 L4.6,5.2 L9.8,7.8 Z" fill="#ff0000" />
                  <rect x="8.9" y="2.6" width="1.1" height="8" fill="#000" />
                  <path d="M5.6,10.8 h6.4 l1,2 h-8.4 Z" fill="#000" />
                  <template v-if="c.wrongFlag">
                    <line x1="1.5" y1="1.5" x2="14.5" y2="14.5" stroke="#ff0000" stroke-width="1.8" />
                    <line x1="14.5" y1="1.5" x2="1.5" y2="14.5" stroke="#ff0000" stroke-width="1.8" />
                  </template>
                </svg>
              </template>
              <template v-else-if="c.state === 'question'"><span class="ms-q">?</span></template>
              <template v-else-if="c.state === 'revealed' && c.adj > 0"><span :class="'n' + c.adj">{{ c.adj }}</span></template>
            </button>
          </div>
        </div>
      </div>

      <!-- 状态行 -->
      <div class="ms-status">
        <span>{{ diff.name }} · {{ eng.mines }} 雷</span>
        <span>{{ best[diffKey] ? `本机最佳 ${best[diffKey]!.time} 秒` : '本机暂无纪录' }}</span>
        <span v-if="newRecord" class="ms-record">🏆 新纪录！</span>
      </div>

      <!-- 最佳纪录对话框 -->
      <div v-if="bestDialog" class="ms-best-mask" @click.self="bestDialog = false">
        <div class="ms-best">
          <div class="ms-best-title">
            <i class="fa fa-trophy"></i><span class="flex-1">扫雷 · 本机最佳纪录</span>
            <button type="button" class="ms-best-close" @click="bestDialog = false">✕</button>
          </div>
          <div class="ms-best-body">
            <div v-for="d in DIFFICULTIES" :key="d.key" class="ms-best-row">
              <span>{{ d.name }}（{{ d.w }}×{{ d.h }} · {{ d.m }} 雷）</span>
              <b>{{ best[d.key] ? best[d.key]!.time + ' 秒' : '暂无纪录' }}</b>
              <span class="ms-best-date">{{ best[d.key]?.date ?? '' }}</span>
            </div>
            <p class="ms-best-note">纪录保存在本机浏览器，换设备/浏览器不共享。</p>
          </div>
          <div class="ms-best-foot"><button type="button" class="ms-best-ok" @click="bestDialog = false">确定</button></div>
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.ms-root { padding: 6px 8px 8px; user-select: none; }

/* 菜单行:铺满内容区宽度的银灰条(与其他窗口菜单栏观感一致) */
.ms-menu {
  display: flex; gap: 2px; background: #c0c0c0;
  margin: -6px -8px 6px; padding: 2px;
  font-size: 13px; position: relative; z-index: 5;
}
.ms-menu-item { padding: 2px 8px; cursor: pointer; position: relative; color: #000; }
.ms-menu-item:hover, .ms-menu-item.active { background: #000080; color: #fff; }
.ms-dropdown {
  position: absolute; top: 100%; left: 0; min-width: 150px; z-index: 60;
  background: #c0c0c0; color: #000; padding: 2px;
  border: 2px solid; border-color: #ffffff #0a0a0a #0a0a0a #ffffff;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4);
}
.ms-dd-item { padding: 4px 10px 4px 6px; cursor: pointer; white-space: nowrap; display: flex; align-items: center; }
.ms-dd-item:hover { background: #000080; color: #fff; }
.ms-dd-check { width: 16px; flex-shrink: 0; }
.ms-dd-sep { border: none; border-top: 1px solid #808080; border-bottom: 1px solid #ffffff; margin: 3px 2px; }

/* LED + 笑脸面板(与棋盘同宽) */
.ms-playfield { width: max-content; max-width: 100%; margin: 0 auto; }
.ms-panel {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  width: 100%; padding: 5px 6px; margin-bottom: 9px; background: #c0c0c0;
  border: 2px solid; border-color: #808080 #ffffff #ffffff #808080;
}
.ms-led {
  display: flex; gap: 1px; background: #000; padding: 1px 2px;
  border: 1px solid; border-color: #808080 #ffffff #ffffff #808080;
}
.ms-face {
  width: 34px; height: 34px; padding: 0; display: flex; align-items: center; justify-content: center;
  background: #c0c0c0; border: none; cursor: pointer;
  box-shadow: inset -2px -2px #0a0a0a, inset 2px 2px #ffffff, inset -3px -3px #808080, inset 3px 3px #dfdfdf;
}
.ms-face:active { box-shadow: inset -2px -2px #ffffff, inset 2px 2px #0a0a0a; }

/* 雷区：双凹陷边框 + 1px 深灰网格 */
.ms-board-frame {
  display: inline-block; padding: 3px; background: #c0c0c0; max-width: 100%; overflow-x: auto;
  border: 3px solid; border-color: #808080 #ffffff #ffffff #808080;
  box-shadow: 0 0 0 1px #000;
}
.ms-board { display: grid; gap: 1px; background: #808080; width: max-content; }
.ms-cell {
  width: 22px; height: 22px; padding: 0; border: none; cursor: default;
  display: flex; align-items: center; justify-content: center;
  font: bold 13px 'MS Sans Serif', Tahoma, 'Microsoft YaHei', sans-serif;
  background: #c0c0c0;
  box-shadow: inset -2px -2px #808080, inset 2px 2px #ffffff;
}
.ms-cell.hid:active { box-shadow: inset 1px 1px #808080; }
.ms-cell.rev { box-shadow: inset 1px 1px #808080; }
.ms-cell.boom { background: #ff0000; }
.ms-fig { display: block; }
.ms-q { color: #000; font-weight: bold; }
.n1 { color: #0000ff; } .n2 { color: #008000; } .n3 { color: #ff0000; } .n4 { color: #000080; }
.n5 { color: #800000; } .n6 { color: #008080; } .n7 { color: #000000; } .n8 { color: #808080; }
button.ms-cell { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }

/* 状态行 */
.ms-status {
  display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap;
  margin-top: 8px; font-size: 12px; color: #000;
}
.ms-record { color: #c00000; font-weight: bold; }

/* 纪录对话框 */
.ms-best-mask { position: fixed; inset: 0; z-index: 75; background: rgba(0, 0, 0, 0.25); display: flex; align-items: center; justify-content: center; }
.ms-best {
  width: min(400px, 92vw); background: #c0c0c0;
  border: 2px solid; border-color: #ffffff #0a0a0a #0a0a0a #ffffff;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.45);
  font: 12px 'MS Sans Serif', Tahoma, 'Microsoft YaHei', sans-serif;
}
.ms-best-title {
  height: 26px; display: flex; align-items: center; gap: 6px; padding: 0 3px 0 8px;
  background: linear-gradient(90deg, #000080, #1084d0); color: #fff; font-weight: bold; font-size: 12px;
}
.ms-best-close {
  width: 18px; height: 16px; font-size: 10px; font-weight: bold; line-height: 1;
  background: #c0c0c0; color: #000; border: none; cursor: pointer; flex-shrink: 0;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf;
}
.ms-best-body { margin: 8px; padding: 10px; background: #fff; border: 1px solid; border-color: #808080 #dfdfdf #dfdfdf #808080; }
.ms-best-row { display: flex; align-items: baseline; gap: 8px; padding: 4px 0; }
.ms-best-row span:first-child { flex: 1; }
.ms-best-row b { color: #000080; }
.ms-best-date { color: #666; font-size: 10px; min-width: 64px; text-align: right; }
.ms-best-note { margin: 8px 0 0; font-size: 10px; color: #666; }
.ms-best-foot { display: flex; justify-content: flex-end; padding: 0 8px 8px; }
.ms-best-ok {
  min-width: 72px; padding: 4px 12px; font-size: 12px; font-weight: bold;
  background: #c0c0c0; color: #000; border: none; cursor: pointer; font-family: inherit;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf;
}
.ms-best-ok:active { box-shadow: inset -1px -1px #ffffff, inset 1px 1px #0a0a0a; }
</style>

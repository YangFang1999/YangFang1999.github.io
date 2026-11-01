<script setup lang="ts">
// 桌宠：QQ 企鹅。
// - 任务栏模式自主漫步；拖到桌面任意处悬浮住下（不乱走）；双击悬浮企鹅回家
// - 90 秒无互动打瞌睡；位置/模式/心情/饱食 localStorage 持久化
// - 眼神跟随鼠标，凑近会歪头盯着看
// - 拖拽甩手可抛掷：惯性飞行、撞墙弹地、摔狠了冒星星发晕；飞行中可伸手接住
// - 可以骑在打开的窗口标题栏上：拖到标题栏附近松手即跳上去，窗口拖动时跟随，
//   拖太快会被甩下来，窗口关闭/最小化会掉下来，双击跳下
// - 拖到回收站上会惊慌挣扎，松手一溜烟逃回任务栏
// - 右键弹 Win98 菜单：喂小鱼干/摸摸头/哄睡觉/回任务栏；心情与饱食随时间衰减、
//   离线也会衰减（有保底），影响动作频率与台词语气
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

// ============ 台词库 ============
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
const HAPPY_QUOTES = [
  '嘎嘎嘎～心情超好！',
  '啦啦啦～',
  '今天天气真好呀！',
  '开心得想跳舞！',
  '有你在真好～',
];
const GRUMPY_QUOTES = [
  '哼。',
  '好无聊啊…',
  '都没人理我',
  '不理你了（背过身）',
  '提不起劲…',
];
const HUNGRY_QUOTES = [
  '好饿啊…',
  '有小鱼干吗？',
  '肚子咕咕叫了…',
  '闻到小鱼干的味道了吗？',
];
const FEED_OK_QUOTES = ['真好吃！', '好吃！', '再来一条嘛～', '嗝—'];
const FEED_FULL_QUOTES = ['撑死啦，吃不下啦…'];
const PAT_CD_QUOTES = ['好啦好啦，摸够啦～'];
const RIDE_QUOTES = ['上面风景不错！', '驮着我走呀，真乖～', '这里归我啦', '！报！企鹅号已就位'];
const RIDE_OFF_QUOTES = ['哇啊啊——！', '呀！要掉下去了！'];
const DIZZY_QUOTES = ['晕……', '哎呦……眼冒金星', '你看到几个我…'];
const CATCH_QUOTES = ['接住我了！', '呼——吓死我了'];
const BIN_PANIC_QUOTES = ['不要丢下我！！', '啊啊啊别扔掉我！'];
const BIN_ESCAPE_QUOTES = ['吓死我了…', '好险好险…', '回收站是我一生的噩梦'];
const WAKE_QUOTES = ['唔……醒了醒了', '干嘛呀，人家睡着呢'];

// 情境感知台词：根据当前打开的应用换台词
const APP_QUOTES: Array<[RegExp, string[]]> = [
  [/^\/airplane/, ['需要僚机吗？', '可别被打下来呀！', '人家也会飞哦～']],
  [/^\/survivors/, ['守住基地！我给你助威！', '怪物好多…你小心点']],
  [/^\/terminal/, ['在敲命令吗？懂哦懂哦', 'sudo 给我小鱼干', '黑底白字，真酷']],
  [/^\/paint/, ['画我画我！我超好画的！', '把我画成壁纸好不好？']],
  [/^\/notepad/, ['在写东西？我安静陪你～', '稿子记得保存哦']],
  [/^\/calculator/, ['二加二等于四，我都知道', '算算还剩几条小鱼干？']],
  [/^\/typing/, ['打快点呀，别比我走路还慢', '小拇指又在偷懒了']],
  [/^\/computer/, ['我这台机器配置还不错吧？', 'C 盘又红了？该清理啦']],
  [/^\/all-notes|^\/notes/, ['在看文章？我小声点', '这篇是好文章，信我']],
  [/^\/categories/, ['有什么好玩的新设置吗？']],
];

// ============ 常量 ============
const STATE_KEY = 'qq-pet-state';
const SLEEP_AFTER_MS = 90000;

// 心情系统参数（在线按分钟衰减；离线按小时衰减且有保底，绝不会把企鹅弄死）
const MOOD = {
  feedSatiety: 28,
  feedMood: 6,
  fullBelly: 92,       // 饱食 ≥ 此值拒绝投喂
  patMood: 7,
  patCdMs: 4000,       // 摸头冷却，连摸会被嫌弃
  decaySatietyPerMin: 0.5,   // 在线饱食衰减（约 3.3 小时空 ONLINE 掉光）
  decayMoodCalm: 0.25,       // 在线心情衰减（平静时）
  decayMoodHungry: 0.9,      // 饿肚子时心情掉得更快
  sleepFactor: 0.4,          // 睡觉时衰减减慢
  offlineSatietyPerHour: 7,  // 离线每小时
  offlineMoodPerHour: 9,
};

// 抛掷物理参数（px/s，bottom-up 坐标）
const PHYS = {
  gravity: 2300,
  flingMinSpeed: 520,  // 松手速度超过该值才起飞
  maxSpeed: 2600,
  bounceGround: 0.42,
  bounceWall: 0.5,
  bounceTop: 0.35,
  stopSpeed: 10,       // 地面滚动到该速度以下即停下
  rideShake: 950,      // 窗口拖动速度超过该值把企鹅甩下去
  dizzyImpact: 950,    // 撞击速度超过该值发晕
};

const route = useRoute();

// ============ 基础状态 ============
const x = ref(80);
const restBottom = ref(40);   // 静止时贴任务栏(40)或悬浮高度
const lift = ref(0);          // 拖拽过程中的附加高度
const bottomOverride = ref<number | null>(null); // 飞行/骑窗时的直接高度控制
const dir = ref(1);
const moving = ref(false);
const jumping = ref(false);
const bounce = ref(false);
const bubble = ref<string | null>(null);
const dragging = ref(false);
const sleeping = ref(false);

// 抛掷 / 骑窗 / 发晕
const flying = ref(false);
const rot = ref(0);
const dizzy = ref(false);
const riding = ref(false);
const panicking = ref(false);

// 眼神跟随
const pupil = ref({ x: 0, y: 0 });
const watching = ref(false);
const lean = ref(0);

// 心情 / 饱食
const satiety = ref(80);
const mood = ref(78);

// 菜单 / 动画小元素
const menuOpen = ref(false);
const menuPos = ref({ x: 0, y: 0 });
const fishVisible = ref(false);
const heartList = ref<number[]>([]);

const petEl = ref<HTMLElement | null>(null);

let timer: ReturnType<typeof setTimeout> | undefined;
let bubbleTimer: ReturnType<typeof setTimeout> | undefined;
let dizzyTimer: ReturnType<typeof setTimeout> | undefined;
let fishTimer: ReturnType<typeof setTimeout> | undefined;
let heartTimer: ReturnType<typeof setTimeout> | undefined;
let vitalsTimer: ReturnType<typeof setInterval> | undefined;
let vw = window.innerWidth;
let lastActive = Date.now();
let lastVitalAt = Date.now();
let lastPatAt = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isFloating = (): boolean => restBottom.value > 70;

const moodTier = computed<'great' | 'ok' | 'low'>(() =>
  mood.value >= 75 ? 'great' : mood.value >= 45 ? 'ok' : 'low'
);
const moodLabel = computed(() => {
  if (satiety.value < 25) return '饿肚子';
  if (mood.value >= 75) return '开心';
  if (mood.value >= 45) return '平静';
  return '小情绪';
});
// 企鹅位置很高时气泡改到下方，避免顶出屏幕
const bubbleBelow = computed(() =>
  (bottomOverride.value ?? restBottom.value + lift.value) > window.innerHeight - 170
);
// 身体姿态：飞行旋转 / 被注视时前倾（CSS 动画激活时会自动覆盖内联样式）
const bodyStyle = computed<Record<string, string> | undefined>(() => {
  if (flying.value) return { transform: `rotate(${rot.value.toFixed(1)}deg)` };
  if (watching.value && !moving.value && !dragging.value && !sleeping.value && !riding.value && !panicking.value) {
    return { transform: `rotate(${lean.value.toFixed(2)}deg)` };
  }
  return undefined;
});

// ============ 持久化 ============
function loadState(): void {
  let sat = 80;
  let md = 78;
  let lastSeen = 0;
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || 'null');
    if (s && typeof s.x === 'number' && typeof s.bottom === 'number') {
      x.value = Math.max(4, Math.min(vw - 52, s.x));
      restBottom.value = Math.max(40, Math.min(window.innerHeight - 120, s.bottom));
    }
    if (s && typeof s.satiety === 'number') sat = s.satiety;
    if (s && typeof s.mood === 'number') md = s.mood;
    if (s && typeof s.lastSeen === 'number') lastSeen = s.lastSeen;
  } catch { /* 忽略 */ }
  // 离线衰减（离开越久越饿越闷，但有保底）
  const awayMin = lastSeen > 0 ? (Date.now() - lastSeen) / 60000 : 0;
  if (awayMin > 3) {
    sat = Math.max(5, sat - Math.min(70, awayMin * (MOOD.offlineSatietyPerHour / 60)));
    md = Math.max(10, md - Math.min(70, awayMin * (MOOD.offlineMoodPerHour / 60)));
  }
  satiety.value = sat;
  mood.value = md;
  lastVitalAt = Date.now();
}

function saveState(): void {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify({
      x: x.value,
      bottom: restBottom.value,
      satiety: Math.round(satiety.value),
      mood: Math.round(mood.value),
      lastSeen: Date.now(),
    }));
  } catch { /* 忽略 */ }
}

// 心情/饱食随时间衰减：本轮回 20s 一次；间隔超过 2 分钟视为"离开"，按离线速率算
function updateVitals(): void {
  const now = Date.now();
  const dtMin = (now - lastVitalAt) / 60000;
  lastVitalAt = now;
  if (dtMin <= 0) return;
  if (dtMin > 2) {
    satiety.value = Math.max(5, satiety.value - Math.min(70, dtMin * (MOOD.offlineSatietyPerHour / 60)));
    mood.value = Math.max(10, mood.value - Math.min(70, dtMin * (MOOD.offlineMoodPerHour / 60)));
  } else {
    const f = sleeping.value ? MOOD.sleepFactor : 1;
    satiety.value = Math.max(0, satiety.value - MOOD.decaySatietyPerMin * dtMin * f);
    mood.value = Math.max(0, mood.value - (satiety.value < 25 ? MOOD.decayMoodHungry : MOOD.decayMoodCalm) * dtMin * f);
  }
  saveState();
}

// ============ 气泡 ============
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function say(text: string): void {
  bubble.value = text;
  if (bubbleTimer) clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => { bubble.value = null; }, 2400);
}

function showBubble(): void {
  if (sleeping.value) return;
  // 情境优先：当前应用有专属台词就大概率说它
  const ctx = APP_QUOTES.find(([re]) => re.test(route.path));
  if (ctx && Math.random() < 0.6) { say(pick(ctx[1])); return; }
  if (satiety.value < 25 && Math.random() < 0.5) { say(pick(HUNGRY_QUOTES)); return; }
  const tier = moodTier.value;
  if (tier === 'great' && Math.random() < 0.35) { say(pick(HAPPY_QUOTES)); return; }
  if (tier === 'low' && Math.random() < 0.4) { say(pick(GRUMPY_QUOTES)); return; }
  say(pick(QUOTES));
}

function schedule(ms: number): void {
  timer = setTimeout(tick, ms);
}

// ============ 行为 AI（受心情影响） ============
function tick(): void {
  if (dragging.value || flying.value) { schedule(1200); return; }
  if (riding.value) {
    if (Math.random() < 0.22) { if (Math.random() < 0.5) say(pick(RIDE_QUOTES)); else showBubble(); }
    schedule(2600 + Math.random() * 2600);
    return;
  }
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
  if (menuOpen.value) {
    if (Math.random() < 0.25) showBubble();
    schedule(1800);
    return;
  }
  // 饿肚子的桌面提醒
  if (satiety.value < 25 && Math.random() < 0.18) {
    say(pick(HUNGRY_QUOTES));
    schedule(2400 + Math.random() * 2000);
    return;
  }
  // 心情决定活泼程度：开心爱蹦跶，小情绪就趴着发呆
  const tier = moodTier.value;
  const walkP = tier === 'great' ? 0.6 : tier === 'low' ? 0.35 : 0.55;
  const jumpP = tier === 'great' ? 0.16 : tier === 'low' ? 0.02 : 0.09;
  const r = Math.random();
  if (!reducedMotion && r < walkP) {
    startWalk();
  } else if (!reducedMotion && r < walkP + jumpP) {
    jump();
  } else {
    if (Math.random() < (tier === 'great' ? 0.4 : 0.3)) showBubble();
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

// 回到任务栏（双击悬浮企鹅 / 控制面板按钮 / 右键菜单）
function goHome(): void {
  if (riding.value) { hopOffRide(); return; }
  bottomOverride.value = null;
  restBottom.value = 40;
  lift.value = 0;
  saveState();
  showBubble();
  schedule(1600);
}

// ============ 抛掷物理 ============
const fling = { left: 0, bottom: 0, vx: 0, vy: 0, rot: 0, impact: 0 };
let flingRAF = 0;
let flingLast = 0;

function startFling(vx: number, vyUp: number): void {
  if (riding.value) detachRide();
  panicking.value = false;
  menuOpen.value = false;
  moving.value = false;
  if (reducedMotion) {
    restBottom.value = 40;
    lift.value = 0;
    saveState();
    schedule(1200);
    return;
  }
  fling.vx = Math.max(-PHYS.maxSpeed, Math.min(PHYS.maxSpeed, vx));
  fling.vy = Math.max(-PHYS.maxSpeed, Math.min(PHYS.maxSpeed, vyUp));
  fling.left = x.value;
  fling.bottom = restBottom.value + lift.value;
  fling.rot = 0;
  fling.impact = 0;
  flying.value = true;
  bottomOverride.value = fling.bottom;
  flingLast = performance.now();
  cancelAnimationFrame(flingRAF);
  flingRAF = requestAnimationFrame(flingFrame);
}

function flingFrame(now: number): void {
  const dt = Math.min(0.033, (now - flingLast) / 1000);
  flingLast = now;
  if (!stepFling(dt)) flingRAF = requestAnimationFrame(flingFrame);
}

// 单步物理，返回 true 表示已落地停下
function stepFling(dt: number): boolean {
  fling.vx *= Math.max(0, 1 - 0.10 * dt);
  fling.vy -= PHYS.gravity * dt;
  fling.left += fling.vx * dt;
  fling.bottom += fling.vy * dt;
  fling.rot += fling.vx * 0.10 * dt;
  // 撞墙
  if (fling.left < 4) {
    fling.left = 4;
    fling.impact = Math.max(fling.impact, Math.abs(fling.vx));
    fling.vx = Math.abs(fling.vx) * PHYS.bounceWall;
  } else if (fling.left > vw - 54) {
    fling.left = vw - 54;
    fling.impact = Math.max(fling.impact, Math.abs(fling.vx));
    fling.vx = -Math.abs(fling.vx) * PHYS.bounceWall;
  }
  // 顶到屏幕上沿
  const ceil = window.innerHeight - 58;
  if (fling.bottom > ceil) {
    fling.bottom = ceil;
    fling.vy = -Math.abs(fling.vy) * PHYS.bounceTop;
  }
  // 落到任务栏上（bottom 40）
  if (fling.bottom <= 40) {
    fling.bottom = 40;
    const imp = Math.abs(fling.vy);
    fling.impact = Math.max(fling.impact, imp);
    if (imp > 70) {
      fling.vy = imp * PHYS.bounceGround;
      fling.vx *= 0.72;
    } else {
      fling.vy = 0;
      fling.vx *= Math.max(0, 1 - 6 * dt);
      if (Math.abs(fling.vx) < PHYS.stopSpeed) {
        settleFling();
        return true;
      }
    }
  }
  x.value = Math.round(fling.left);
  bottomOverride.value = fling.bottom;
  rot.value = fling.rot;
  return false;
}

function settleFling(): void {
  flying.value = false;
  rot.value = 0;
  bottomOverride.value = null;
  x.value = Math.round(Math.max(4, Math.min(vw - 54, fling.left)));
  restBottom.value = fling.bottom <= 70 ? 40 : Math.min(fling.bottom, window.innerHeight - 58);
  lift.value = 0;
  if (fling.impact > PHYS.dizzyImpact) {
    dizzy.value = true;
    mood.value = Math.max(0, mood.value - 2);
    say(pick(DIZZY_QUOTES));
    if (dizzyTimer) clearTimeout(dizzyTimer);
    dizzyTimer = setTimeout(() => { dizzy.value = false; }, 1800);
  } else if (Math.random() < 0.4) {
    showBubble();
  }
  saveState();
  schedule(1400);
}

// 飞行中一把接住
function catchFling(): void {
  cancelAnimationFrame(flingRAF);
  flying.value = false;
  rot.value = 0;
  bottomOverride.value = null;
  x.value = Math.round(Math.max(4, Math.min(vw - 54, fling.left)));
  restBottom.value = Math.max(40, Math.min(window.innerHeight - 58, fling.bottom));
  lift.value = 0;
  if (Math.random() < 0.6) say(pick(CATCH_QUOTES));
}

// ============ 骑窗口 ============
let rideEl: HTMLElement | null = null;
let rideRAF = 0;
let rideLast = 0;
let rideRel = 0;
let prevRect: DOMRect | null = null;
let hintWin: HTMLElement | null = null;

function findRideCandidate(feetY: number, centerX: number): HTMLElement | null {
  let best: HTMLElement | null = null;
  let bestDiff = 34;
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('.win-window'))) {
    const r = el.getBoundingClientRect();
    if (r.width < 80 || r.height < 60) continue;
    const diff = Math.abs(feetY - r.top);
    if (diff < bestDiff && centerX > r.left - 14 && centerX < r.right + 14) {
      best = el;
      bestDiff = diff;
    }
  }
  return best;
}

function startRide(el: HTMLElement): void {
  const r = el.getBoundingClientRect();
  if (r.width < 80) return;
  riding.value = true;
  rideEl = el;
  rideRel = Math.max(2, Math.min(Math.max(2, r.width - 56), x.value - r.left));
  prevRect = r;
  rideLast = performance.now();
  x.value = Math.round(Math.max(4, Math.min(vw - 54, r.left + rideRel)));
  bottomOverride.value = window.innerHeight - r.top;
  moving.value = false;
  say(pick(RIDE_QUOTES));
  cancelAnimationFrame(rideRAF);
  rideRAF = requestAnimationFrame(rideFrame);
}

function rideFrame(now: number): void {
  if (!riding.value || !rideEl) return;
  const dt = Math.min(0.05, (now - rideLast) / 1000);
  rideLast = now;
  const r = rideEl.getBoundingClientRect();
  // 窗口被关闭/最小化 → 掉下去
  if (!rideEl.isConnected || r.width < 10) {
    detachRide();
    startFling(0, -60);
    return;
  }
  const vxw = prevRect && dt >= 0.004 ? (r.left - prevRect.left) / dt : 0;
  const vywDown = prevRect && dt >= 0.004 ? (r.top - prevRect.top) / dt : 0;
  prevRect = r;
  // 拖窗口太猛 → 甩出去（继承窗口速度）
  if (Math.hypot(vxw, vywDown) > PHYS.rideShake) {
    const vx = vxw;
    const vyUp = -vywDown + 160;
    detachRide();
    startFling(vx, vyUp);
    say(pick(RIDE_OFF_QUOTES));
    return;
  }
  rideRel = Math.max(2, Math.min(Math.max(2, r.width - 56), rideRel));
  x.value = Math.round(Math.max(4, Math.min(vw - 54, r.left + rideRel)));
  bottomOverride.value = window.innerHeight - r.top;
  rideRAF = requestAnimationFrame(rideFrame);
}

function detachRide(): void {
  const b = bottomOverride.value;
  riding.value = false;
  rideEl = null;
  prevRect = null;
  bottomOverride.value = null;
  cancelAnimationFrame(rideRAF);
  if (b != null) restBottom.value = Math.max(40, Math.min(window.innerHeight - 58, b));
  lift.value = 0;
}

function hopOffRide(): void {
  detachRide();
  startFling((Math.random() < 0.5 ? -1 : 1) * 160, 320);
}

function clearRideHint(): void {
  if (hintWin) {
    const tb = hintWin.querySelector<HTMLElement>('.win-titlebar');
    if (tb) tb.style.outline = '';
    hintWin = null;
  }
}

// ============ 回收站彩蛋 ============
let binHot = false;

function setBinHot(on: boolean, bin: HTMLElement | null): void {
  if (on === binHot) return;
  binHot = on;
  if (!bin) return;
  bin.style.filter = on
    ? 'brightness(1.25) saturate(1.6) drop-shadow(0 0 6px rgba(255,40,40,.85))'
    : '';
}

function escapeHome(): void {
  panicking.value = false;
  const bin = document.querySelector<HTMLElement>('[data-icon="bin"]');
  setBinHot(false, bin);
  if (bin) {
    try {
      bin.animate(
        [{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(0)' }],
        { duration: 280 }
      );
    } catch { /* 老浏览器无 WAAPI，忽略 */ }
  }
  moving.value = true;
  dir.value = -1;
  restBottom.value = 40;
  lift.value = 0;
  bottomOverride.value = null;
  x.value = 8;
  say(pick(BIN_ESCAPE_QUOTES));
  mood.value = Math.max(0, mood.value - 3);
  saveState();
  schedule(1800);
}

// ============ 心情交互（右键菜单） ============
function spawnHearts(n: number): void {
  heartList.value = Array.from({ length: n }, (_, i) => i);
  if (heartTimer) clearTimeout(heartTimer);
  heartTimer = setTimeout(() => { heartList.value = []; }, 1000);
}

function doFeed(): void {
  closeMenu();
  wake();
  if (eatingLock()) return;
  if (satiety.value >= MOOD.fullBelly) {
    say(pick(FEED_FULL_QUOTES));
    react();
    return;
  }
  fishVisible.value = true;
  if (fishTimer) clearTimeout(fishTimer);
  fishTimer = setTimeout(() => {
    fishVisible.value = false;
    satiety.value = Math.min(100, satiety.value + MOOD.feedSatiety);
    mood.value = Math.min(100, mood.value + MOOD.feedMood);
    say(pick(FEED_OK_QUOTES));
    if (mood.value >= 75) spawnHearts(1);
    saveState();
  }, 950);
}

// 吃鱼期间不重复投喂
function eatingLock(): boolean {
  if (fishVisible.value) return true;
  return false;
}

function doPat(): void {
  closeMenu();
  wake();
  const now = Date.now();
  if (now - lastPatAt < MOOD.patCdMs) {
    say(pick(PAT_CD_QUOTES));
    mood.value = Math.min(100, mood.value + 1);
    saveState();
    return;
  }
  lastPatAt = now;
  mood.value = Math.min(100, mood.value + MOOD.patMood);
  spawnHearts(3);
  react();
  saveState();
}

function doSleep(): void {
  closeMenu();
  if (sleeping.value) {
    sleeping.value = false;
    if (bubble.value === 'Zzz…') bubble.value = null;
    say(pick(WAKE_QUOTES));
    schedule(1500);
  } else {
    if (timer) clearTimeout(timer);
    moving.value = false;
    sleeping.value = true;
    bubble.value = 'Zzz…';
    schedule(3000);
  }
  saveState();
}

function doGoHome(): void {
  closeMenu();
  wake();
  goHome();
}

function closeMenu(): void {
  menuOpen.value = false;
}

function openMenuAt(clientX: number, clientY: number): void {
  const el = petEl.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  // 菜单锚定在企鹅容器内（容器带 filter，fixed 子元素会失效，因此用 absolute 偏移）；
  // 贴近屏幕右/下边缘时翻到企鹅另一侧，避免溢出
  const offX = vw - 176 - rect.left < -10
    ? -172
    : Math.max(-10, Math.min(clientX - rect.left, vw - 176 - rect.left));
  const offY = window.innerHeight - 216 - rect.top < -6
    ? -214
    : Math.max(-6, Math.min(clientY - rect.top, window.innerHeight - 216 - rect.top));
  menuPos.value = { x: offX, y: offY };
  menuOpen.value = true;
}

function onPetContext(e: MouseEvent): void {
  e.preventDefault();
  e.stopPropagation();
  if (flying.value) return;
  openMenuAt(e.clientX, e.clientY);
}

// ============ 拖拽（含速度采样、回收站、骑窗提示） ============
let grabDx = 0;
let grabOffset = 0;
let downX = 0;
let downY = 0;
let downAt = 0;
let moved = false;
let lastClickAt = 0;
let longPressTimer: ReturnType<typeof setTimeout> | undefined;
let longPressFired = false;
const velBuf: Array<{ t: number; x: number; y: number }> = [];

function clearLongPress(): void {
  if (longPressTimer) clearTimeout(longPressTimer);
  longPressTimer = undefined;
}

function wake(): void {
  lastActive = Date.now();
  if (sleeping.value) {
    sleeping.value = false;
    if (bubble.value === 'Zzz…') bubble.value = null;
  }
}

function onPointerDown(e: PointerEvent): void {
  if (e.button !== 0) return;
  if (flying.value) catchFling();
  wake();
  dragging.value = true;
  panicking.value = false;
  moving.value = false;
  if (timer) clearTimeout(timer);
  menuOpen.value = false;
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
  velBuf.length = 0;
  velBuf.push({ t: performance.now(), x: e.clientX, y: e.clientY });
  // 触屏没有右键：按住 550ms 不动 → 弹出桌宠菜单
  longPressFired = false;
  clearLongPress();
  longPressTimer = setTimeout(() => {
    if (!dragging.value || moved || flying.value) return;
    longPressFired = true;
    openMenuAt(e.clientX, e.clientY);
  }, 550);
}

function onPointerMove(e: PointerEvent): void {
  if (!dragging.value || !petEl.value) return;
  // 用按下坐标的距离判定是否拖拽（movementX 在触屏/合成事件上不可靠）
  if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 6) {
    if (!moved) clearLongPress();       // 一旦判定为拖拽，取消长按菜单
    if (!moved && riding.value) detachRide();  // 从窗口上拎起来
    if (!moved) menuOpen.value = false;
    moved = true;
  }
  x.value = Math.max(4, Math.min(vw - 52, e.clientX - grabDx));
  // 拖拽期间自由跟随指针（仅视口钳制），落下时的位置由 pointerUp 的归位逻辑决定
  const bottomNow = Math.max(0, Math.min(window.innerHeight - 58, window.innerHeight - (e.clientY - grabOffset)));
  lift.value = bottomNow - restBottom.value;
  velBuf.push({ t: performance.now(), x: e.clientX, y: e.clientY });
  if (velBuf.length > 8) velBuf.shift();
  if (moved) updateDragAffordances(bottomNow);
}

function updateDragAffordances(bottomNow: number): void {
  const cx = x.value + 25;
  const cy = window.innerHeight - bottomNow - 29;
  // 回收站：悬停其上 → 惊慌
  const bin = document.querySelector<HTMLElement>('[data-icon="bin"]');
  const br = bin ? bin.getBoundingClientRect() : null;
  const over = !!(bin && br && cx > br.left - 8 && cx < br.right + 8 && cy > br.top - 10 && cy < br.bottom + 16);
  setBinHot(over, bin);
  if (over && !panicking.value) {
    panicking.value = true;
    say(pick(BIN_PANIC_QUOTES));
  } else if (!over && panicking.value) {
    panicking.value = false;
  }
  // 骑窗提示：脚下接近某标题栏 → 高亮
  if (!over) {
    const cand = findRideCandidate(window.innerHeight - bottomNow, cx);
    if (cand !== hintWin) {
      clearRideHint();
      if (cand) {
        const tb = cand.querySelector<HTMLElement>('.win-titlebar');
        if (tb) tb.style.outline = '2px dashed rgba(255,60,60,.9)';
        hintWin = cand;
      }
    }
  } else {
    clearRideHint();
  }
}

function dragVelocity(): { x: number; y: number } {
  if (velBuf.length < 2) return { x: 0, y: 0 };
  const last = velBuf[velBuf.length - 1];
  let first = velBuf[0];
  for (const s of velBuf) {
    if (last.t - s.t >= 60) first = s;
    else break;
  }
  const dt = (last.t - first.t) / 1000;
  if (dt < 0.016) return { x: 0, y: 0 };
  return { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt };
}

function onPointerUp(e: PointerEvent): void {
  if (!dragging.value) return;
  dragging.value = false;
  clearLongPress();
  try { petEl.value?.releasePointerCapture(e.pointerId); } catch { /* 已释放 */ }
  clearRideHint();
  setBinHot(false, document.querySelector<HTMLElement>('[data-icon="bin"]'));
  const final = restBottom.value + lift.value;

  // 1) 抛掷：松手速度够快就飞出去
  const v = dragVelocity();
  if (!reducedMotion && Math.hypot(v.x, v.y) > PHYS.flingMinSpeed) {
    startFling(v.x, -v.y);
    return;
  }
  // 2) 悬在回收站上松手 → 吓跑回任务栏
  if (panicking.value) {
    escapeHome();
    return;
  }
  // 3) 脚落在窗口标题栏附近 → 跳上去骑着
  const rideTarget = findRideCandidate(window.innerHeight - final, x.value + 25);
  if (rideTarget) {
    startRide(rideTarget);
    return;
  }

  // 4) 原有归位 / 双击 / 单击逻辑
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
    // 长按菜单刚弹开的手指抬起不算点击
    if (longPressFired) {
      longPressFired = false;
    } else if (riding.value && now - lastClickAt < 500) {
      hopOffRide();
      lastClickAt = 0;
      return;
    } else if (wasFloating && now - lastClickAt < 500) {
      goHome();
      lastClickAt = 0;
      return;
    } else {
      lastClickAt = now;
      react();
    }
  } else if (wasFloating) {
    showBubble();
  }
  schedule(1400);
}

// ============ 眼神跟随鼠标（rAF 节流：高频 mousemove 不再每事件做布局读取） ============
let mouseRaf = 0;
let lastMouseEvt: MouseEvent | null = null;

function onMouseMove(e: MouseEvent): void {
  if (reducedMotion) return;
  lastMouseEvt = e;
  if (mouseRaf) return;
  mouseRaf = requestAnimationFrame(() => {
    mouseRaf = 0;
    if (lastMouseEvt) processMouseMove(lastMouseEvt);
  });
}

function processMouseMove(e: MouseEvent): void {
  const el = petEl.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const ex = r.left + r.width / 2;
  const ey = r.top + r.height * 0.3;
  const dx = e.clientX - ex;
  const dy = e.clientY - ey;
  const dist = Math.hypot(dx, dy);
  const mag = Math.min(3.6, dist / 50);
  const nx = dist > 1 ? dx / dist : 0;
  const ny = dist > 1 ? dy / dist : 0;
  pupil.value = { x: +(nx * mag).toFixed(2), y: +(ny * mag * 0.8).toFixed(2) };
  watching.value = dist < 140 && !moving.value && !flying.value && !sleeping.value;
  lean.value = watching.value ? Math.max(-6, Math.min(6, dx * 0.05)) : 0;
}

// ============ 其他 ============
function onResize(): void {
  vw = window.innerWidth;
  x.value = Math.max(4, Math.min(vw - 52, x.value));
  restBottom.value = Math.max(40, Math.min(window.innerHeight - 58, restBottom.value));
  // 视口变化后菜单位置不再可靠，直接收起（与 Win98 行为一致）
  menuOpen.value = false;
}

function onDocPointerDown(e: PointerEvent): void {
  if (menuOpen.value && !(e.target as Element | null)?.closest?.('.pet-menu')) {
    menuOpen.value = false;
  }
}

function onDocKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') closeMenu();
}

function onVisChange(): void {
  if (!document.hidden) {
    updateVitals();
  }
}

function onSaveExit(): void {
  updateVitals();
  saveState();
}

function onGoHome(): void {
  wake();
  if (flying.value) return;
  goHome();
}

onMounted(() => {
  vw = window.innerWidth;
  loadState();
  if (isFloating()) showBubble();
  schedule(1800);
  vitalsTimer = setInterval(updateVitals, 20000);
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('pet-go-home', onGoHome);
  window.addEventListener('beforeunload', onSaveExit);
  document.addEventListener('visibilitychange', onVisChange);
  document.addEventListener('pointerdown', onDocPointerDown, true);
  document.addEventListener('keydown', onDocKeydown);
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
  if (bubbleTimer) clearTimeout(bubbleTimer);
  if (dizzyTimer) clearTimeout(dizzyTimer);
  if (fishTimer) clearTimeout(fishTimer);
  if (heartTimer) clearTimeout(heartTimer);
  if (vitalsTimer) clearInterval(vitalsTimer);
  clearLongPress();
  cancelAnimationFrame(flingRAF);
  cancelAnimationFrame(rideRAF);
  cancelAnimationFrame(mouseRaf);
  clearRideHint();
  window.removeEventListener('resize', onResize);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('pet-go-home', onGoHome);
  window.removeEventListener('beforeunload', onSaveExit);
  document.removeEventListener('visibilitychange', onVisChange);
  document.removeEventListener('pointerdown', onDocPointerDown, true);
  document.removeEventListener('keydown', onDocKeydown);
});
</script>

<template>
  <div
    ref="petEl"
    class="qq-pet fixed z-[55] select-none"
    :class="{ moving: moving && !dragging, jumping, bounce, dragging, sleeping, flying, riding, dizzy, panicking, eating: fishVisible }"
    :style="{
      left: x + 'px',
      bottom: (bottomOverride ?? (restBottom + lift)) + 'px',
      transitionDuration: (flying || riding) ? '0ms' : ((moving && !dragging ? 1200 : 260) + 'ms'),
    }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @contextmenu="onPetContext"
  >
    <!-- 气泡：Win98 提示框风格 -->
    <div v-if="bubble" class="pet-bubble" :class="{ 'bubble-below': bubbleBelow }">{{ bubble }}</div>

    <!-- 发晕星星 -->
    <template v-if="dizzy">
      <span class="pet-star" style="left:-6px;top:-6px;">✦</span>
      <span class="pet-star" style="left:20px;top:-13px;animation-delay:.18s;">✦</span>
      <span class="pet-star" style="left:42px;top:-4px;animation-delay:.36s;">✦</span>
    </template>

    <!-- 摸头爱心 -->
    <span
      v-for="h in heartList"
      :key="h"
      class="pet-heart"
      :style="{ left: (h * 16 - 8) + 'px', animationDelay: (h * 0.12) + 's' }"
    >♥</span>

    <!-- 阴影 -->
    <div class="pet-shadow" :style="{ opacity: flying ? 0 : (dragging ? 0.15 : 0.3), transform: `scaleX(${dragging ? 0.7 : 1})` }"></div>

    <!-- 企鹅本体：几何 1:1 复刻参考 CSS 实现（坐标系 400x400） -->
    <svg width="50" height="58" viewBox="84 122 200 232" class="pet-body" :style="bodyStyle">
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
      <!-- 围巾：红带（border-top 40px red，底角 23%） -->
      <path d="M109,220 H259 V225.5 A34.5,34.5 0 0 1 224.5,260 H143.5 A34.5,34.5 0 0 1 109,225.5 Z" fill="#ff0000" />
      <!-- 围巾：垂尾（scarf::after），垂直挂在围巾左端、搭在肚子上 -->
      <path d="M137,225 H165 V287 A9,9 0 0 1 156,296 H146 A9,9 0 0 1 137,287 Z" fill="#ff0000" />
      <!-- 眼斑：长条白椭圆（21x36） -->
      <ellipse cx="169.5" cy="176" rx="10.5" ry="18" fill="#fff" />
      <ellipse cx="201.5" cy="176" rx="10.5" ry="18" fill="#fff" />
      <!-- 眼睛：左瞳孔（9x14 偏下）+ 右挑眉弧线（border-top 5px rotate -11°）；pupils 组负责眼神跟随 -->
      <g class="eyes">
        <g class="pupils" :style="{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }">
          <ellipse cx="171.5" cy="181" rx="4.5" ry="7" fill="#000" />
          <path d="M195,184 Q202,175 209,182" stroke="#000" stroke-width="5" fill="none" stroke-linecap="round" transform="rotate(-11 202 180.5)" />
        </g>
      </g>
      <!-- 嘴：宽扁橘色椭圆（81x27，z:9 最上层），吃鱼时开合 -->
      <ellipse class="pet-beak" cx="186.5" cy="212.5" rx="40.5" ry="13.5" fill="#e09d45" />
    </svg>

    <!-- 吃鱼：小鱼滑到嘴边被吃掉 -->
    <svg v-if="fishVisible" class="pet-fish" viewBox="0 0 40 24" width="24" height="14" aria-hidden="true">
      <path d="M30,12 L39,4 L39,20 Z" fill="#d18a2c" />
      <ellipse cx="16" cy="12" rx="14" ry="7.5" fill="#e8a33d" />
      <circle cx="10" cy="9.5" r="1.7" fill="#3a2a10" />
    </svg>

    <!-- 桌宠右键菜单（Win98 风格） -->
    <div
      v-if="menuOpen"
      class="pet-menu"
      :style="{ left: menuPos.x + 'px', top: menuPos.y + 'px' }"
      @pointerdown.stop
      @click.stop
      @contextmenu.prevent.stop
    >
      <div class="pet-menu-head">QQ 桌宠 · {{ moodLabel }}</div>
      <div class="pet-menu-stat">
        <span class="pet-menu-stat-label"><i class="fa fa-heart"></i>心情</span>
        <div class="pet-bar"><div class="pet-bar-fill" :style="{ width: mood + '%' }"></div></div>
        <b class="pet-menu-val">{{ Math.round(mood) }}</b>
      </div>
      <div class="pet-menu-stat">
        <span class="pet-menu-stat-label"><i class="fa fa-cutlery"></i>饱食</span>
        <div class="pet-bar"><div class="pet-bar-fill" :style="{ width: satiety + '%' }"></div></div>
        <b class="pet-menu-val">{{ Math.round(satiety) }}</b>
      </div>
      <hr class="pet-menu-sep">
      <div class="pet-menu-item" @click="doFeed"><i class="fa fa-cutlery"></i>喂小鱼干</div>
      <div class="pet-menu-item" @click="doPat"><i class="fa fa-thumbs-o-up"></i>摸摸头</div>
      <div class="pet-menu-item" @click="doSleep"><i class="fa fa-bed"></i>{{ sleeping ? '叫醒' : '哄睡觉' }}</div>
      <div v-if="isFloating()" class="pet-menu-item" @click="doGoHome"><i class="fa fa-home"></i>回任务栏</div>
    </div>
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
/* 眼神跟随（平滑追踪光标） */
.pupils { transition: transform 0.18s ease-out; }

/* 骑窗口：轻轻上下浮动 */
.qq-pet.riding .pet-body { animation: rideBob 1.8s ease-in-out infinite; }
@keyframes rideBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

/* 抛掷飞行：关掉走路/跳跃动画，旋转交给内联样式 */
.qq-pet.flying .pet-body { animation: none; }

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

/* 悬在回收站上：惊慌挣扎 */
.qq-pet.panicking .pet-body {
  animation: tremble 0.12s linear infinite;
}
@keyframes tremble {
  0%, 100% { transform: translateX(-1.5px) rotate(-3deg); }
  50% { transform: translateX(1.5px) rotate(3deg); }
}

/* 吃鱼：嘴巴开合 */
.qq-pet.eating .pet-beak {
  animation: chomp 0.3s ease-in-out 3;
  transform-box: fill-box;
  transform-origin: center;
}
@keyframes chomp {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.5); }
}

/* 小鱼滑到嘴边被吃掉 */
.pet-fish {
  position: absolute;
  right: -16px;
  bottom: 36px;
  animation: fishIn 0.95s ease-in forwards;
  z-index: 3;
}
@keyframes fishIn {
  0% { transform: translate(26px, 10px) rotate(-20deg); opacity: 0; }
  15% { opacity: 1; }
  55% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  80% { transform: translate(2px, -2px) scale(0.75); opacity: 0.95; }
  100% { transform: translate(3px, -3px) scale(0.2); opacity: 0; }
}

/* 摸头爱心上浮 */
.pet-heart {
  position: absolute;
  top: -2px;
  color: #ff5a6e;
  font-size: 13px;
  line-height: 1;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);
  animation: heartUp 0.9s ease-out forwards;
  opacity: 0;
  z-index: 3;
}
@keyframes heartUp {
  0% { opacity: 0; transform: translateY(2px) scale(0.6); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-30px) scale(1.15); }
}

/* 发晕星星绕头 */
.pet-star {
  position: absolute;
  color: #ffd34d;
  font-size: 12px;
  line-height: 1;
  text-shadow: 0 0 3px rgba(168, 110, 0, 0.9);
  animation: starSpin 1.1s linear infinite;
  z-index: 3;
}
@keyframes starSpin {
  0% { transform: rotate(0deg) translateY(0); opacity: 1; }
  50% { transform: rotate(180deg) translateY(-4px); opacity: 0.6; }
  100% { transform: rotate(360deg) translateY(0); opacity: 1; }
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
/* 位置太高时气泡翻到下方 */
.pet-bubble.bubble-below { bottom: auto; top: 64px; }
.pet-bubble.bubble-below::after {
  bottom: auto;
  top: -5px;
  border-top-color: transparent;
  border-bottom-color: #ffffe1;
}
@keyframes pop {
  from { transform: translateX(-50%) scale(0.7); opacity: 0; }
  to { transform: translateX(-50%) scale(1); opacity: 1; }
}

/* 桌宠右键菜单（Win98 风格；容器带 filter 所以用 absolute 锚定在企鹅容器内） */
.pet-menu {
  position: absolute;
  z-index: 90;
  min-width: 162px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #0a0a0a #0a0a0a #ffffff;
  box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.4);
  padding: 3px;
  font: 11px "Microsoft YaHei", "MS Sans Serif", sans-serif;
  color: #000;
  text-align: left;
  cursor: default;
}
.pet-menu-head {
  font-weight: bold;
  color: #000080;
  padding: 2px 6px 4px;
  white-space: nowrap;
}
.pet-menu-stat {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 6px 3px;
  white-space: nowrap;
}
.pet-menu-stat-label { width: 44px; }
.pet-menu-stat-label i { margin-right: 3px; }
.pet-bar {
  flex: 1;
  height: 9px;
  background: #fff;
  border: 1px solid #878787;
  box-shadow: inset 1px 1px #808080;
}
.pet-bar-fill {
  height: 100%;
  background: #000080;
  transition: width 0.35s;
}
.pet-menu-val { width: 20px; text-align: right; }
.pet-menu-sep {
  border: none;
  border-top: 1px solid #808080;
  border-bottom: 1px solid #ffffff;
  margin: 3px 2px;
}
.pet-menu-item {
  padding: 4px 8px;
  cursor: pointer;
  white-space: nowrap;
}
.pet-menu-item:hover { background: #000080; color: #fff; }
.pet-menu-item i { width: 14px; margin-right: 4px; text-align: center; }

@media (prefers-reduced-motion: reduce) {
  .pupils { transition: none; }
}
</style>

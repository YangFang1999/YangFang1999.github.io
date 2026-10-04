<script setup lang="ts">
// 3D 管道屏保：晶格随机生长 + 透视旋转。任意输入退出。
import { onMounted, onUnmounted, ref } from 'vue';

const emit = defineEmits<{ (e: 'exit'): void }>();

const canvasEl = ref<HTMLCanvasElement | null>(null);
const hintVisible = ref(true);

interface Seg { ax: number; ay: number; az: number; bx: number; by: number; bz: number; color: string; }
interface Pipe { x: number; y: number; z: number; dx: number; dy: number; dz: number; color: string; }
type Dir = [number, number, number];
const DIRS: Dir[] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

const canvas = document.createElement('canvas');
let ctx: CanvasRenderingContext2D | null = null;
let rafId = 0;
let last = 0;
let stepAcc = 0;
let ay = 0.6;
const segments: Seg[] = [];
const occupied = new Set<string>();
const BOUND = 9;

function key(x: number, y: number, z: number): string { return `${x},${y},${z}`; }

function randomColor(): string {
  return `hsl(${Math.floor(Math.random() * 360)}, 72%, 58%)`;
}

function spawnPipe(): Pipe {
  let x = 0, y = 0, z = 0, tries = 0;
  do {
    x = Math.floor(Math.random() * (BOUND * 2 + 1)) - BOUND;
    y = Math.floor(Math.random() * (BOUND * 2 + 1)) - BOUND;
    z = Math.floor(Math.random() * 11) - 5;
  } while (occupied.has(key(x, y, z)) && ++tries < 60);
  const dirs: Dir[] = DIRS;
  const d = dirs[Math.floor(Math.random() * dirs.length)];
  const p: Pipe = { x, y, z, dx: d[0], dy: d[1], dz: d[2], color: randomColor() };
  occupied.add(key(x, y, z));
  return p;
}

let pipes: Pipe[] = [];

function stepPipes(): void {
  for (const p of pipes) {
    // 70% 沿原方向，否则随机转向（不允许掉头）
    if (Math.random() > 0.7) {
      const dirs = DIRS.filter(d => !(d[0] === -p.dx && d[1] === -p.dy && d[2] === -p.dz));
      const d = dirs[Math.floor(Math.random() * dirs.length)];
      p.dx = d[0]; p.dy = d[1]; p.dz = d[2];
    }
    const nx = p.x + p.dx, ny = p.y + p.dy, nz = p.z + p.dz;
    const blocked =
      Math.abs(nx) > BOUND || Math.abs(ny) > BOUND || Math.abs(nz) > 5 ||
      occupied.has(key(nx, ny, nz));
    if (blocked) {
      // 找一条活路，找不到就重出生
      const dirs = DIRS.filter(d => !(d[0] === -p.dx && d[1] === -p.dy && d[2] === -p.dz));
      let found = false;
      for (const d of dirs.sort(() => Math.random() - 0.5)) {
        const tx = p.x + d[0], ty = p.y + d[1], tz = p.z + d[2];
        if (Math.abs(tx) <= BOUND && Math.abs(ty) <= BOUND && Math.abs(tz) <= 5 && !occupied.has(key(tx, ty, tz))) {
          p.dx = d[0]; p.dy = d[1]; p.dz = d[2];
          found = true;
          break;
        }
      }
      if (!found) {
        const np = spawnPipe();
        p.x = np.x; p.y = np.y; p.z = np.z; p.dx = np.dx; p.dy = np.dy; p.dz = np.dz; p.color = np.color;
        continue;
      }
    }
    const nx2 = p.x + p.dx, ny2 = p.y + p.dy, nz2 = p.z + p.dz;
    occupied.add(key(nx2, ny2, nz2));
    segments.push({ ax: p.x * 10, ay: p.y * 10, az: p.z * 10, bx: nx2 * 10, by: ny2 * 10, bz: nz2 * 10, color: p.color });
    if (segments.length > 1500) segments.shift();
    p.x = nx2; p.y = ny2; p.z = nz2;
  }
}

function project(x: number, y: number, z: number, w: number, h: number): { sx: number; sy: number; scale: number } {
  // 绕 Y 轴慢旋转 + 固定 X 倾角，透视投影
  const cosY = Math.cos(ay), sinY = Math.sin(ay);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;
  const ax = 0.42;
  const cosX = Math.cos(ax), sinX = Math.sin(ax);
  const y1 = y * cosX - z1 * sinX;
  const z2 = y * sinX + z1 * cosX;
  const fov = 420;
  const scale = fov / (fov + z2 + 160);
  return { sx: w / 2 + x1 * scale * 9, sy: h / 2 - y1 * scale * 9, scale };
}

function render(): void {
  if (!ctx) return;
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = 'round';
  for (const s of segments) {
    const a = project(s.ax, s.ay, s.az, w, h);
    const b = project(s.bx, s.by, s.bz, w, h);
    const lw = Math.max(1.5, 7 * ((a.scale + b.scale) / 2));
    // 暗边
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.lineWidth = lw + 2;
    ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
    // 主体（深度淡出）
    const depth = Math.max(0.25, Math.min(1, (a.scale + b.scale) / 2));
    ctx.globalAlpha = depth;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = lw;
    ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
    ctx.globalAlpha = 1;
  }
  // 接头圆点
  for (const p of pipes) {
    const a = project(p.x * 10, p.y * 10, p.z * 10, w, h);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(a.sx, a.sy, Math.max(2, 3.4 * a.scale), 0, Math.PI * 2); ctx.fill();
  }
}

function loop(now: number): void {
  if (!last) last = now;
  const dms = Math.min(50, now - last);
  last = now;
  ay += 0.00006 * dms;
  stepAcc += dms;
  while (stepAcc > 45) { stepAcc -= 45; stepPipes(); }
  render();
  rafId = requestAnimationFrame(loop);
}

function onResize(): void {
  const el = canvasEl.value;
  if (!el) return;
  el.width = window.innerWidth;
  el.height = window.innerHeight;
}

function exit(): void {
  emit('exit');
}

const onKey = (e: KeyboardEvent) => { e.preventDefault(); exit(); };

onMounted(() => {
  const el = canvasEl.value!;
  ctx = el.getContext('2d')!;
  onResize();
  for (let i = 0; i < 6; i++) pipes.push(spawnPipe());
  // 先长出一段管道再渲染首帧，避免显示瞬间全黑
  for (let i = 0; i < 30; i++) stepPipes();
  render();
  window.addEventListener('resize', onResize);
  window.addEventListener('pointermove', exit, { once: true });
  window.addEventListener('pointerdown', exit);
  window.addEventListener('keydown', onKey);
  window.addEventListener('wheel', exit, { passive: true });
  rafId = requestAnimationFrame(loop);
  // 8 秒后淡出操作提示
  setTimeout(() => { hintVisible.value = false; }, 8000);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('pointermove', exit);
  window.removeEventListener('pointerdown', exit);
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('wheel', exit);
});
</script>

<template>
  <div class="fixed inset-0 z-[200] bg-black">
    <canvas ref="canvasEl" class="block w-full h-full"></canvas>
    <div
      v-if="hintVisible"
      class="absolute bottom-6 left-0 right-0 text-center text-[#4a9eff] text-sm tracking-[3px] font-mono animate-pulse"
    >
      移动鼠标退出屏幕保护程序
    </div>
  </div>
</template>

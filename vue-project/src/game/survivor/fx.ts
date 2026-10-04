// 桌面保卫战 — 特效：伤害数字 / 粒子
import { G } from './state';

export function spawnDmg(x: number, y: number, val: number, color = '#ffffff'): void {
  if (G.dmgs.length > 80) G.dmgs.shift();
  G.dmgs.push({ x, y, val: Math.round(val), life: 32, maxLife: 32, color });
}

export function spawnParticles(x: number, y: number, count: number, color: string, speed = 2.4): void {
  const cap = 300;
  // 低端设备守护：帧率不足时自动削减粒子量
  if (G.fps > 0 && G.fps < 35) count = Math.max(3, Math.round(count * 0.5));
  for (let i = 0; i < count && G.particles.length < cap; i++) {
    const a = (Math.PI * 2 / count) * i + Math.random() * 0.5;
    const s = speed * (0.4 + Math.random() * 0.8);
    G.particles.push({
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 14 + Math.random() * 12,
      maxLife: 26,
      color,
      r: 1.2 + Math.random() * 2.2,
    });
  }
}

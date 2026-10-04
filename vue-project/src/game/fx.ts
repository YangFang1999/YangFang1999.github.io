// 特效生成：粒子爆炸 + 得分飘字（entities 与 boss 共用，避免循环依赖）。
import { G } from './state';
import type { ScorePopup } from './types';

export function spawnExplosion(x: number, y: number, count: number, color: string, large = false): void {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4;
    const speed = 1 + Math.random() * 3;
    G.particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 20 + Math.random() * 18,
      maxLife: 38,
      color,
      radius: 1.5 + Math.random() * 3,
    });
  }
  for (let i = 0; i < Math.floor(count * 0.6); i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 1.5;
    G.particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 10 + Math.random() * 12,
      maxLife: 22,
      color: '#ffffff',
      radius: 2 + Math.random() * 4,
    });
  }
  if (large) {
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 / 20) * i;
      G.particles.push({
        x, y,
        vx: Math.cos(angle) * 5,
        vy: Math.sin(angle) * 5,
        life: 12,
        maxLife: 12,
        color,
        radius: 2,
      });
    }
  }
}

export function spawnScorePopup(x: number, y: number, text: string, color: string, fontSize = 13): void {
  const popup: ScorePopup = { x, y, text, life: 40, maxLife: 40, color, fontSize };
  G.scorePopups.push(popup);
}

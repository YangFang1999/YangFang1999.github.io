// 实体绘制：预渲染精灵 + 少量动态元素（火焰闪烁、护盾环、血条、粒子）。
import { G } from './state';
import { drawSprite, getSprites } from './sprites';
import type { Enemy, PowerUp } from './types';

export function drawPlayer(ctx: CanvasRenderingContext2D): void {
  const p = G.player;
  // 无敌闪烁
  if (p.invincible > 0 && Math.floor(p.invincible / 4) % 2 === 0) return;

  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  const spr = getSprites();

  drawSprite(ctx, spr.playerShip, cx, cy);

  // 尾焰（随机长度，动态）
  const flicker = Math.random() * 5 + 2;
  const exhaust = ctx.createLinearGradient(0, 12, 0, 14 + flicker);
  exhaust.addColorStop(0, '#ff4400');
  exhaust.addColorStop(0.5, '#ff8833');
  exhaust.addColorStop(1, '#ffcc66');
  ctx.fillStyle = exhaust;
  ctx.beginPath();
  ctx.moveTo(cx - 5, cy + 12);
  ctx.lineTo(cx, cy + 14 + flicker);
  ctx.lineTo(cx + 5, cy + 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffaa';
  ctx.beginPath();
  ctx.moveTo(cx - 2, cy + 13);
  ctx.lineTo(cx, cy + 13 + flicker * 0.5);
  ctx.lineTo(cx + 2, cy + 13);
  ctx.closePath();
  ctx.fill();

  if (G.shieldTimer > 0) {
    const shieldAlpha = 0.5 + Math.sin(G.frameCount * 0.2) * 0.3;
    ctx.strokeStyle = `rgba(255, 215, 0, ${shieldAlpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(255, 255, 150, ${shieldAlpha * 0.5})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (G.cheatInvincible) {
    ctx.strokeStyle = `rgba(255, 0, 255, ${0.6 + Math.sin(G.frameCount * 0.15) * 0.4})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.stroke();
  }
}

export function drawBullets(ctx: CanvasRenderingContext2D): void {
  const spr = getSprites();
  for (const b of G.bullets) {
    if (b.isPlayer) {
      drawSprite(ctx, spr.playerBullet, b.cx, b.cy);
    } else {
      const s = b.w > 5 ? spr.enemyBulletBig : spr.enemyBulletSmall;
      drawSprite(ctx, s, b.cx, b.cy);
    }
  }
}

export function drawEnemies(ctx: CanvasRenderingContext2D): void {
  const spr = getSprites();
  const bossEnemies: Enemy[] = [];
  for (const e of G.enemies) {
    if (e.type === 'boss') { bossEnemies.push(e); continue; }
    drawRegularEnemy(ctx, spr, e);
  }
  // Boss 画在最上层
  for (const e of bossEnemies) drawBossEntity(ctx, spr, e);
}

function entryScale(e: Enemy, full: number): number {
  return Math.min(1, 1 - e.entryTimer / full + 0.1);
}

function drawRegularEnemy(ctx: CanvasRenderingContext2D, spr: ReturnType<typeof getSprites>, e: Enemy): void {
  if (e.y + e.h < 0) return;   // 完全在屏幕上方时不绘制（血条也不会悬空）
  const scale = entryScale(e, 15);
  switch (e.type) {
    case 'small': drawSprite(ctx, spr.small, e.cx, e.cy, scale); break;
    case 'medium': drawSprite(ctx, spr.medium, e.cx, e.cy, scale); break;
    case 'large': drawSprite(ctx, spr.large, e.cx, e.cy, scale); break;
    case 'elite': drawSprite(ctx, spr.elite, e.cx, e.cy, scale); break;
    case 'boss': break;
  }

  if (e.hp >= e.maxHp) return;

  // 受伤显示：小机型用 ×N 文字，其余用血条
  if (e.type === 'small') {
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('×' + e.hp, e.cx, e.cy + 14);
    return;
  }

  const barH = e.type === 'large' ? 4 : 3;
  const barY = e.type === 'large' ? e.y - 8 : e.y - 6;
  const barW = e.w - 4;
  const barX = e.type === 'elite' ? e.cx - barW / 2 : e.x + 2;
  ctx.fillStyle = '#222';
  ctx.fillRect(barX, barY, barW, barH);
  if (e.type === 'medium') {
    ctx.fillStyle = e.hp > 2 ? '#ffaa00' : '#ff4400';
  } else if (e.type === 'large') {
    ctx.fillStyle = '#cc44ff';
  } else {
    const ratio = e.hp / e.maxHp;
    ctx.fillStyle = ratio > 0.5 ? '#44cc44' : ratio > 0.25 ? '#cccc44' : '#cc4444';
  }
  ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
  if (e.type === 'elite') {
    ctx.strokeStyle = '#ff9aa5';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX - 1, barY - 1, barW + 2, barH + 2);
  }
}

function drawBossEntity(ctx: CanvasRenderingContext2D, spr: ReturnType<typeof getSprites>, e: Enemy): void {
  if (e.y + e.h < 0) return;   // 完全在屏幕上方时不绘制
  const level = e.bossLevel || 1;

  // 直线激光：蓄力（闪烁虚线）/ 发射（纵向光束）
  if (e.laserState === 1 || e.laserState === 2) {
    const lx = e.laserX ?? 0;
    if (e.laserState === 1) {
      const a = 0.25 + 0.45 * Math.abs(Math.sin(G.frameCount * 0.35));
      ctx.strokeStyle = `rgba(255, 70, 70, ${a})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([7, 7]);
      ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, G.canvasH); ctx.stroke();
      ctx.setLineDash([]);
    } else {
      const g = ctx.createLinearGradient(lx - 16, 0, lx + 16, 0);
      g.addColorStop(0, 'rgba(255, 60, 60, 0)');
      g.addColorStop(0.5, 'rgba(255, 130, 130, 0.9)');
      g.addColorStop(1, 'rgba(255, 60, 60, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(lx - 16, 0, 32, G.canvasH);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(lx - 3, 0, 6, G.canvasH);
    }
  }

  const scale = entryScale(e, 30);
  const enraged = level >= 5 || e.phase === 3;
  drawSprite(ctx, enraged ? spr.bossEnraged : spr.boss, e.cx, e.cy, scale);

  // 核心瞳孔脉动
  const pulse = 0.6 + 0.4 * Math.sin(G.frameCount * 0.1);
  ctx.fillStyle = `rgba(255, 255, ${enraged ? 150 : 200}, ${pulse})`;
  ctx.beginPath();
  ctx.arc(e.cx, e.cy, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // 轨道环指示
  ctx.strokeStyle = `rgba(255, ${enraged ? 40 : 100}, ${enraged ? 40 : 80}, ${0.3 + 0.15 * Math.sin(G.frameCount * 0.08)})`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.arc(e.cx, e.cy, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // HP 条
  const barW = e.w;
  const barH = 7;
  const barX = e.x;
  const barY = e.y - 18;
  ctx.fillStyle = '#222';
  ctx.fillRect(barX, barY, barW, barH);
  const hpRatio = e.hp / e.maxHp;
  ctx.fillStyle = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#cccc44' : '#cc4444';
  ctx.fillRect(barX, barY, barW * hpRatio, barH);
  ctx.strokeStyle = '#ff6644';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(barX, barY, barW, barH);

  ctx.fillStyle = '#ff6644';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  const levelTag = level >= 5 ? `Lv.${level} ★` : `Lv.${level}`;
  const phaseTag = e.phase === 3 ? ' ☠狂暴' : e.phase === 2 ? ' ⚠二阶段' : '';
  ctx.fillText(`BOSS ${levelTag}${phaseTag}`, e.cx, barY - 5);
}

const POWERUP_STYLE: Record<PowerUp['type'], { color: string; icon: string }> = {
  doubleFire: { color: '#4488ff', icon: '火' },
  shield: { color: '#ffaa00', icon: '盾' },
  speed: { color: '#44cc44', icon: '速' },
  heal: { color: '#ff4444', icon: '心' },
};

export function drawPowerUps(ctx: CanvasRenderingContext2D): void {
  for (const pu of G.powerUps) {
    const { color, icon } = POWERUP_STYLE[pu.type];
    const cx = pu.cx, cy = pu.cy, r = pu.w / 2;
    const sparkAlpha = 0.4 + 0.3 * Math.sin(G.frameCount * 0.15 + pu.sparkTimer);

    ctx.globalAlpha = sparkAlpha * 0.6;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = color;
    ctx.font = 'bold 9px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, cx, cy + 1);
    ctx.textBaseline = 'alphabetic';
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D): void {
  for (const p of G.particles) {
    const alpha = p.life / p.maxLife;
    if (p.color.startsWith('#')) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
    } else {
      ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.3, p.radius * alpha), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export function drawPopups(ctx: CanvasRenderingContext2D): void {
  for (const sp of G.scorePopups) {
    const alpha = sp.life / sp.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = sp.color;
    ctx.font = `bold ${sp.fontSize}px "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(sp.text, sp.x, sp.y);
    ctx.globalAlpha = 1;
  }
}

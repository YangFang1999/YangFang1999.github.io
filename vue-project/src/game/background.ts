// 背景层：三层星空、星云、行星、流星。
// 星云与行星各自烘焙为离屏精灵，每帧只 drawImage。
import { METEOR } from './config';
import { G } from './state';
import { getSprites, makeSprite, drawSprite, type Sprite } from './sprites';
import { rand } from './utils';
import type { Nebula, Planet, Star } from './types';

interface NebulaBody extends Nebula { spr: Sprite }
interface PlanetBody extends Planet { spr: Sprite }

let nebulaSprites: NebulaBody[] = [];
let planetSprites: PlanetBody[] = [];
let meteorSpawnTimer = 0;

function makeStars(count: number, speedMin: number, speedRand: number,
  rMin: number, rRand: number, aMin: number, aRand: number): Star[] {
  const arr: Star[] = [];
  for (let i = 0; i < count; i++) {
    arr.push({
      x: Math.random() * G.canvasW,
      y: Math.random() * G.canvasH,
      speed: speedMin + Math.random() * speedRand,
      radius: rMin + Math.random() * rRand,
      alpha: aMin + Math.random() * aRand,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.01 + Math.random() * 0.06,
    });
  }
  return arr;
}

function bakeNebula(n: Nebula): Sprite {
  const size = n.r * 2 + 4;
  return makeSprite(size, size, size / 2, size / 2, (c) => {
    const g = c.createRadialGradient(0, 0, 0, 0, 0, n.r);
    g.addColorStop(0, `${n.color}, ${n.alpha * 1.2})`);
    g.addColorStop(0.4, `${n.color}, ${n.alpha * 0.7})`);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(0, 0, n.r, 0, Math.PI * 2); c.fill();
  });
}

function bakePlanet(p: Planet): Sprite {
  const w = p.r * 2.9 + 4;
  const h = p.r * 2 + 8;
  return makeSprite(w, h, w / 2, h / 2, (c) => {
    if (p.ring) {
      c.strokeStyle = p.ringColor;
      c.lineWidth = Math.max(2, p.r * 0.16);
      c.beginPath();
      c.ellipse(0, 0, p.r * 1.45, p.r * 0.38, -0.35, 0, Math.PI * 2);
      c.stroke();
    }
    const g = c.createRadialGradient(-p.r * 0.35, -p.r * 0.35, p.r * 0.1, 0, 0, p.r);
    g.addColorStop(0, p.body);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(0, 0, p.r, 0, Math.PI * 2); c.fill();
  });
}

export function initBackground(): void {
  G.starsFar = makeStars(80, 0.15, 0.3, 0.4, 0.6, 0.2, 0.35);
  G.starsMid = makeStars(50, 0.4, 0.8, 0.7, 1.0, 0.4, 0.4);
  G.starsNear = makeStars(30, 1.0, 2.0, 1.0, 2.0, 0.55, 0.45);

  const nebulaColors = [
    { color: 'rgba(96, 40, 160', alpha: 0.12 },
    { color: 'rgba(40, 70, 190', alpha: 0.10 },
    { color: 'rgba(160, 40, 110', alpha: 0.09 },
    { color: 'rgba(30, 110, 150', alpha: 0.10 },
    { color: 'rgba(70, 30, 130', alpha: 0.11 },
    { color: 'rgba(180, 60, 60', alpha: 0.07 },
  ];
  nebulaSprites = nebulaColors.map((nc) => {
    const n: Nebula = {
      x: Math.random() * G.canvasW,
      y: Math.random() * G.canvasH,
      r: 70 + Math.random() * 130,
      color: nc.color,
      alpha: nc.alpha,
      vx: 0.02 + Math.random() * 0.04,
      vy: 0.03 + Math.random() * 0.06,
    };
    return { ...n, spr: bakeNebula(n) };
  });
  G.nebulas = nebulaSprites;

  const defs: Array<[number, number, number, boolean, string, string, number, number]> = [
    [0.78, 0.16, 46, true, 'rgba(150, 175, 235, 0.16)', 'rgba(180, 200, 255, 0.20)', -0.02, 0.04],
    [0.14, 0.58, 20, false, 'rgba(220, 155, 125, 0.12)', '', -0.05, 0.03],
    [0.5, 0.32, 12, false, 'rgba(120, 200, 180, 0.10)', '', -0.03, 0.06],
  ];
  planetSprites = defs.map(([fx, fy, r, ring, body, ringColor, vx, vy]) => {
    const p: Planet = { x: G.canvasW * fx, y: G.canvasH * fy, r, ring, body, ringColor, vx, vy };
    return { ...p, spr: bakePlanet(p) };
  });
  G.planets = planetSprites;
}

function spawnMeteor(): void {
  const life = rand(METEOR.lifeMin, METEOR.lifeMin + METEOR.lifeRand);
  G.meteors.push({
    x: Math.random() * G.canvasW,
    y: -10,
    vx: rand(-1.5, 1.5),
    vy: rand(3, 8),
    length: rand(20, 60),
    alpha: rand(0.6, 1.0),
    radius: rand(1, 2.5),
    life,
    maxLife: METEOR.maxLife,
  });
}

export function updateBackground(dt: number): void {
  for (const layer of [G.starsFar, G.starsMid, G.starsNear]) {
    for (const s of layer) {
      s.y += s.speed * dt;
      if (s.y > G.canvasH + 2) { s.y = -2; s.x = Math.random() * G.canvasW; }
    }
  }

  for (const n of nebulaSprites) {
    n.x += n.vx * dt;
    n.y += n.vy * dt;
    if (n.x < -n.r) n.x = G.canvasW + n.r;
    if (n.x > G.canvasW + n.r) n.x = -n.r;
    if (n.y < -n.r) n.y = G.canvasH + n.r;
    if (n.y > G.canvasH + n.r) n.y = -n.r;
  }
  G.nebulas = nebulaSprites;

  for (const p of planetSprites) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.x < -p.r * 2) p.x = G.canvasW + p.r * 2;
    if (p.x > G.canvasW + p.r * 2) p.x = -p.r * 2;
    if (p.y < -p.r * 2) p.y = G.canvasH + p.r * 2;
    if (p.y > G.canvasH + p.r * 2) p.y = -p.r * 2;
  }
  G.planets = planetSprites;

  meteorSpawnTimer += dt;
  if (meteorSpawnTimer > rand(METEOR.spawnMin, METEOR.spawnMin + METEOR.spawnRand)) {
    meteorSpawnTimer = 0;
    spawnMeteor();
  }

  for (const m of G.meteors) {
    m.x += m.vx * dt;
    m.y += m.vy * dt;
    m.life -= dt;
  }
  G.meteors = G.meteors.filter(m =>
    m.life > 0 && m.y < G.canvasH + 50 && m.y > -50 && m.x > -50 && m.x < G.canvasW + 50);
}

export function drawBackground(ctx: CanvasRenderingContext2D): void {
  const spr = getSprites();

  const grad = ctx.createLinearGradient(0, 0, 0, G.canvasH);
  grad.addColorStop(0, '#020210');
  grad.addColorStop(0.3, '#080825');
  grad.addColorStop(0.6, '#0c0c30');
  grad.addColorStop(0.85, '#0a0a22');
  grad.addColorStop(1, '#040418');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, G.canvasW, G.canvasH);

  for (const n of nebulaSprites) drawSprite(ctx, n.spr, n.x, n.y);
  for (const p of planetSprites) drawSprite(ctx, p.spr, p.x, p.y);

  const t = G.frameCount;
  for (const s of G.starsFar) {
    const twinkle = s.alpha * (0.7 + 0.3 * Math.sin(t * s.twinkleSpeed + s.twinklePhase));
    ctx.globalAlpha = twinkle;
    drawSprite(ctx, spr.starFar, s.x, s.y, (s.radius * 2) / 7);
  }
  for (const s of G.starsMid) {
    const twinkle = s.alpha * (0.65 + 0.35 * Math.sin(t * s.twinkleSpeed + s.twinklePhase));
    ctx.globalAlpha = twinkle;
    drawSprite(ctx, spr.starMid, s.x, s.y, (s.radius * 2) / 7);
    // 亮星十字闪烁（数量少，动态绘制）
    if (s.alpha > 0.7 && Math.sin(t * s.twinkleSpeed * 2 + s.twinklePhase) > 0.7) {
      ctx.strokeStyle = `rgba(200, 220, 255, ${twinkle * 0.6})`;
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      ctx.moveTo(s.x - s.radius * 3, s.y);
      ctx.lineTo(s.x + s.radius * 3, s.y);
      ctx.moveTo(s.x, s.y - s.radius * 3);
      ctx.lineTo(s.x, s.y + s.radius * 3);
      ctx.stroke();
    }
  }
  for (const s of G.starsNear) {
    const twinkle = s.alpha * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinklePhase));
    if (s.radius > 1.2) {
      ctx.globalAlpha = twinkle * 0.8;
      drawSprite(ctx, spr.starGlow, s.x, s.y, (s.radius * 3 * 2) / 12);
    }
    ctx.globalAlpha = twinkle;
    drawSprite(ctx, spr.starNear, s.x, s.y, (s.radius * 2) / 7);
  }
  ctx.globalAlpha = 1;
}

export function drawMeteors(ctx: CanvasRenderingContext2D): void {
  for (const m of G.meteors) {
    const alpha = m.alpha * (m.life / m.maxLife);
    const endX = m.x - m.vx * m.length * 0.3;
    const endY = m.y - m.vy * m.length * 0.3;

    const trail = ctx.createLinearGradient(endX, endY, m.x, m.y);
    trail.addColorStop(0, 'rgba(255, 255, 255, 0)');
    trail.addColorStop(0.6, `rgba(255, 255, 255, ${alpha * 0.3})`);
    trail.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);
    ctx.strokeStyle = trail;
    ctx.lineWidth = m.radius;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(m.x, m.y);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(m.x, m.y, m.radius * 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

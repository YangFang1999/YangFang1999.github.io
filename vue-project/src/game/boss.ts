// Boss：移动 + 三阶段攻击。
// 阶段 1（hp > 50%）：旋转轨道弹幕（高等级加反向内环 + 瞄准弹，延续原设计）
// 阶段 2（hp ≤ 50%）：瞄准扇形齐射 + 侧翼弹墙，切换瞬间放一圈宣告弹
// 阶段 3（hp ≤ 25%）：狂暴——移速/攻速提升、配色变红，间歇性全向爆发
import { BOSS } from './config';
import { spawnExplosion, spawnScorePopup } from './fx';
import { G } from './state';
import type { Enemy } from './types';

// 下一个 Boss 降临所需的累计击杀数（里程碑之外每 250 杀一只）
export function getNextBossKillThreshold(): number {
  if (G.currentBossLevel < BOSS.killMilestones.length) {
    return BOSS.killMilestones[G.currentBossLevel];
  }
  const last = BOSS.killMilestones[BOSS.killMilestones.length - 1];
  const extra = G.currentBossLevel - BOSS.killMilestones.length + 1;
  return last + extra * BOSS.extraStep;
}

export function spawnBoss(): void {
  const level = G.currentBossLevel + 1;
  G.currentBossLevel = level;
  G.bossSpawned = true;

  const w = 100, h = 70;
  const x = G.canvasW / 2 - w / 2;
  const y = -h - 10;

  const enemy: Enemy = {
    x, y, w, h,
    cx: x + w / 2, cy: y + h / 2,
    hp: BOSS.hpBase + level * BOSS.hpPerLevel,
    maxHp: BOSS.hpBase + level * BOSS.hpPerLevel,
    type: 'boss',
    score: BOSS.scoreBase + level * BOSS.scorePerLevel,
    speed: BOSS.speedBase + level * BOSS.speedPerLevel,
    shootTimer: 0,
    shootInterval: Math.max(BOSS.shootMin, BOSS.shootBase - level * BOSS.shootPerLevel),
    movePattern: 'fall',
    movePhase: Math.random() * Math.PI * 2,
    moveAmp: 0,
    startX: x,
    startY: y,
    dirX: 1,
    entryTimer: 30,
    orbitAngle: 0,
    bossLevel: level,
    moveDirX: 0.6,
    moveDirY: 0.6,
    moveChangeTimer: 80,
    phase: 1,
    volleyToggle: 0,
    burstCounter: 0,
  };
  G.enemies.push(enemy);

  G.shakeTimer = Math.max(G.shakeTimer, 15);
  spawnScorePopup(G.canvasW / 2, 100, `⚠ BOSS Lv.${level} 降临!`, '#ff6644', 16);
}

export function bossPhase(e: Enemy): 1 | 2 | 3 {
  const ratio = e.hp / e.maxHp;
  if (ratio <= BOSS.phase3Threshold) return 3;
  if (ratio <= BOSS.phase2Threshold) return 2;
  return 1;
}

export function updateBossEntity(e: Enemy, dt: number): void {
  const prevPhase = e.phase ?? 1;
  const phase = bossPhase(e);
  if (phase !== prevPhase) {
    e.phase = phase;
    onPhaseChange(e, phase as 2 | 3);
  }
  updateBossMovement(e, dt, phase);
  updateBossAttack(e, dt, phase);
  e.cx = e.x + e.w / 2;
  e.cy = e.y + e.h / 2;
}

function onPhaseChange(e: Enemy, phase: 2 | 3): void {
  G.shakeTimer = Math.max(G.shakeTimer, 20);
  // 宣告弹环：清一小段输出窗口，给玩家留反应空间
  const count = BOSS.announceRingCount;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i;
    G.bullets.push({
      x: e.cx - 3, y: e.cy - 3, w: 6, h: 6, cx: e.cx, cy: e.cy,
      vx: Math.cos(angle) * BOSS.announceRingSpeed,
      vy: Math.sin(angle) * BOSS.announceRingSpeed,
      isPlayer: false,
    });
  }
  spawnScorePopup(e.cx, e.cy - 40, phase === 3 ? '☠ 狂暴化!' : '⚠ 阶段 2!', '#ff4444', 15);
  spawnExplosion(e.cx, e.cy, 20, '#ff6644');
}

function updateBossMovement(e: Enemy, dt: number, phase: 1 | 2 | 3): void {
  const level = e.bossLevel || 1;
  let bossSpeed = BOSS.moveSpeedBase + level * BOSS.moveSpeedPerLevel;
  if (phase === 3) bossSpeed *= BOSS.enrageMoveMult;

  if (typeof e.moveDirX === 'undefined') e.moveDirX = 0.6;
  if (typeof e.moveDirY === 'undefined') e.moveDirY = 0.6;
  if (typeof e.moveChangeTimer === 'undefined') e.moveChangeTimer = 80;

  const driftX = Math.sin(G.frameCount * 0.015 + (e.movePhase || 0)) * bossSpeed * 0.8;
  const driftY = Math.cos(G.frameCount * 0.012 + (e.movePhase || 0) * 1.3) * bossSpeed * 0.5;

  e.x += e.moveDirX! * bossSpeed * dt + driftX * dt;
  e.y += e.moveDirY! * bossSpeed * 0.4 * dt + driftY * dt;

  if (e.x < 0) { e.x = 0; e.moveDirX = Math.abs(e.moveDirX!); }
  if (e.x > G.canvasW - e.w) { e.x = G.canvasW - e.w; e.moveDirX = -Math.abs(e.moveDirX!); }
  if (e.y < 0) { e.y = 0; e.moveDirY = Math.abs(e.moveDirY!); }
  if (e.y > G.canvasH * BOSS.roamMaxYRatio) {
    e.y = G.canvasH * BOSS.roamMaxYRatio;
    e.moveDirY = -Math.abs(e.moveDirY!);
  }

  e.moveChangeTimer!--;
  if (e.moveChangeTimer! <= 0) {
    e.moveChangeTimer = BOSS.moveChangeMin + Math.random() * BOSS.moveChangeRand;
    e.moveDirX = (Math.random() - 0.5) * 2;
    e.moveDirY = (Math.random() - 0.5) * 2;
  }
}

function pushBullet(x: number, y: number, w: number, h: number, vx: number, vy: number): void {
  G.bullets.push({ x, y, w, h, cx: x + w / 2, cy: y + h / 2, vx, vy, isPlayer: false });
}

function updateBossAttack(e: Enemy, dt: number, phase: 1 | 2 | 3): void {
  if (e.entryTimer > 0) return;

  const level = e.bossLevel || 1;

  let interval: number;
  if (phase === 1) {
    interval = Math.max(BOSS.shootMin, BOSS.shootBase - level * BOSS.shootPerLevel);
  } else if (phase === 2) {
    interval = Math.max(BOSS.phase2ShootMin, BOSS.phase2ShootBase - level * BOSS.phase2ShootPerLevel);
  } else {
    const base = Math.max(BOSS.phase2ShootMin, BOSS.phase2ShootBase - level * BOSS.phase2ShootPerLevel);
    interval = Math.max(BOSS.phase2ShootMin, base * BOSS.enrageIntervalMult);
  }

  e.shootTimer += dt;
  if (e.shootTimer < interval) return;
  e.shootTimer = 0;
  e.burstCounter = (e.burstCounter || 0) + 1;

  if (phase === 1) {
    attackOrbit(e, level);
    if (level >= BOSS.innerMinLevel) attackInnerRing(e, level);
    if (level >= BOSS.aimedMinLevel) attackAimed(e);
  } else if (phase === 2) {
    e.volleyToggle = ((e.volleyToggle || 0) + 1) % 2;
    if (e.volleyToggle === 0) {
      attackAimedFan(e);
    } else {
      attackSideWalls(e);
    }
    attackAimed(e);
  } else {
    e.volleyToggle = ((e.volleyToggle || 0) + 1) % 2;
    if (e.volleyToggle === 0) attackOrbit(e, level);
    else attackAimedFan(e);
    attackAimed(e);
    // 每 N 轮来一次全向爆发
    if (e.burstCounter % BOSS.enrageBurstEvery === 0) {
      attackEnrageBurst(e);
    }
  }
}

// 阶段 1 主弹幕：旋转轨道环
function attackOrbit(e: Enemy, level: number): void {
  const bulletCount = BOSS.orbitBulletsBase + Math.floor(level / 2);
  const base = e.orbitAngle || 0;
  const speed = BOSS.orbitSpeedBase + level * BOSS.orbitSpeedPerLevel;
  for (let i = 0; i < bulletCount; i++) {
    const angle = base + (Math.PI * 2 / bulletCount) * i;
    pushBullet(e.cx - 3, e.cy - 3, 5, 5, Math.cos(angle) * speed, Math.sin(angle) * speed);
  }
  e.orbitAngle = base + BOSS.orbitAdvanceBase + level * BOSS.orbitAdvancePerLevel;
}

// 高等级：反向旋转内环
function attackInnerRing(e: Enemy, level: number): void {
  const bulletCount = Math.floor((BOSS.orbitBulletsBase + Math.floor(level / 2)) * 0.7);
  const base = e.orbitAngle || 0;
  const speed = BOSS.innerSpeedBase + level * BOSS.innerSpeedPerLevel;
  for (let i = 0; i < bulletCount; i++) {
    const angle = -base + (Math.PI * 2 / bulletCount) * i;
    pushBullet(e.cx - 2, e.cy - 2, 4, 4, Math.cos(angle) * speed, Math.sin(angle) * speed);
  }
}

// 朝玩家的小角度齐射
function attackAimed(e: Enemy): void {
  const dx = (G.player.x + G.player.w / 2) - e.cx;
  const dy = (G.player.y + G.player.h / 2) - e.cy;
  for (let a = -0.15; a <= 0.15; a += 0.15) {
    const aimAngle = Math.atan2(dy, dx) + a;
    pushBullet(e.cx - 3, e.cy - 3, 6, 6, Math.cos(aimAngle) * BOSS.aimedSpeed, Math.sin(aimAngle) * BOSS.aimedSpeed);
  }
}

// 阶段 2：宽扇形瞄准齐射
function attackAimedFan(e: Enemy): void {
  const dx = (G.player.x + G.player.w / 2) - e.cx;
  const dy = (G.player.y + G.player.h / 2) - e.cy;
  const aim = Math.atan2(dy, dx);
  const n = BOSS.fanCount;
  for (let i = 0; i < n; i++) {
    const a = aim + (i / (n - 1) - 0.5) * BOSS.fanSpread;
    pushBullet(e.cx - 3, e.cy - 3, 6, 6, Math.cos(a) * BOSS.fanSpeed, Math.sin(a) * BOSS.fanSpeed);
  }
}

// 阶段 2：左右两侧向下的弹墙
function attackSideWalls(e: Enemy): void {
  const n = BOSS.wallCount;
  for (let i = 0; i < n; i++) {
    const x = e.cx - 46 + (92 / (n - 1)) * i;
    pushBullet(x - 2, e.cy + 10, 4, 4, 0, BOSS.wallVy);
  }
}

// 阶段 3：全向密集爆发
function attackEnrageBurst(e: Enemy): void {
  const count = BOSS.enrageBurstCount;
  const offset = Math.random() * Math.PI * 2;
  for (let i = 0; i < count; i++) {
    const angle = offset + (Math.PI * 2 / count) * i;
    pushBullet(e.cx - 2, e.cy - 2, 4, 4, Math.cos(angle) * BOSS.enrageBurstSpeed, Math.sin(angle) * BOSS.enrageBurstSpeed);
  }
  spawnScorePopup(e.cx, e.cy + 30, '⚠ BURST!', '#ff8800', 12);
}

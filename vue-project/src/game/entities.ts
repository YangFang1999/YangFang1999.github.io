// 普通敌机 / 道具 / 粒子 / 碰撞。Boss 的移动与攻击见 boss.ts。
import {
  BOMB, COMBO, ENEMY_SHOOT, ENEMY_STATS, FIRE, FORMATION, LIFE, PERM, POWERUP,
} from './config';
import { updateBossEntity } from './boss';
import { spawnExplosion, spawnScorePopup } from './fx';
import { G, getDifficulty } from './state';
import { clamp, rand } from './utils';
import type { Enemy, EnemyType, Entity, MovePattern, PowerUpType } from './types';

// ============ 生成 ============

export function spawnEnemy(
  type: EnemyType,
  opts?: { x?: number; y?: number; pattern?: MovePattern },
): void {
  const diff = getDifficulty();
  const stats = ENEMY_STATS[type as Exclude<EnemyType, 'boss'>];
  const { w, h, hp, score: scoreVal } = stats;
  const speed = (stats.speedBase + Math.random() * stats.speedRand) * diff;

  let shootInterval = 0;
  if (type === 'medium') {
    const s = ENEMY_SHOOT.medium;
    shootInterval = Math.max(s.min, s.base - diff * s.perDiff);
  } else if (type === 'large') {
    const s = ENEMY_SHOOT.large;
    shootInterval = Math.max(s.min, s.base - diff * s.perDiff);
  } else if (type === 'elite') {
    const s = ENEMY_SHOOT.elite;
    shootInterval = Math.max(s.min, s.base - diff * s.perDiff);
  }

  let movePattern: MovePattern;
  const r = Math.random();
  if (opts?.pattern) {
    movePattern = opts.pattern;
  } else if (type === 'elite') {
    if (r < 0.5) movePattern = 'sway';
    else if (r < 0.8) movePattern = 'horizontal';
    else movePattern = 'zigzag';
  } else if (type === 'small') {
    if (r < 0.35) movePattern = 'fall';
    else if (r < 0.6) movePattern = 'horizontal';
    else if (r < 0.85) movePattern = 'zigzag';
    else movePattern = 'circle';
  } else {
    if (r < 0.3) movePattern = 'sway';
    else if (r < 0.55) movePattern = 'horizontal';
    else if (r < 0.8) movePattern = 'zigzag';
    else movePattern = 'circle';
  }

  const x = opts?.x ?? Math.random() * (G.canvasW - w);
  const startY = opts?.y ?? (movePattern === 'circle' ? 100 + Math.random() * 250 : -h);
  const moveAmp = movePattern === 'zigzag' ? 30 + Math.random() * 40
    : movePattern === 'circle' ? 40 + Math.random() * 40
    : type === 'large' ? 60
    : type === 'medium' ? 30
    : type === 'elite' ? 55
    : 0;

  const enemy: Enemy = {
    x, y: startY, w, h,
    cx: x + w / 2, cy: startY + h / 2,
    hp, maxHp: hp,
    type, score: scoreVal, speed,
    shootTimer: shootInterval > 0 ? Math.random() * shootInterval : 0,
    shootInterval,
    movePattern,
    movePhase: Math.random() * Math.PI * 2,
    moveAmp,
    startX: x,
    startY,
    dirX: Math.random() > 0.5 ? 1 : -1,
    entryTimer: 15,
  };
  G.enemies.push(enemy);
}

// V 字编队：一次 4-8 架小型机成队俯冲，割草快感的主要来源
export function spawnFormation(): void {
  const { min, max, spacingX, spacingY } = FORMATION;
  const count = min + Math.floor(Math.random() * (max - min + 1));
  // 窄画布上按宽度自适应压缩横距，避免编队被边界 clamp 挤成一列
  const spacing = Math.min(spacingX, (G.canvasW - 100) / count);
  const half = Math.floor(count / 2);
  const centerX = rand(50 + half * spacing, G.canvasW - 50 - half * spacing - 26);
  for (let i = 0; i < count; i++) {
    const wing = Math.ceil(i / 2);                       // 0,1,1,2,2,3,3
    const side = i === 0 ? 0 : (i % 2 === 1 ? -1 : 1);   // 领机在中间
    const x = centerX + side * wing * spacing;
    const y = -26 - wing * spacingY;
    spawnEnemy('small', {
      x: clamp(x, 0, G.canvasW - 26),
      y,
      pattern: 'fall',
    });
  }
}

export function spawnPowerUp(x: number, y: number): void {
  if (Math.random() > POWERUP.dropRate) return;
  const types: PowerUpType[] = ['doubleFire', 'shield', 'speed', 'heal'];
  const type = types[Math.floor(Math.random() * types.length)];
  G.powerUps.push({
    x: x - 10, y, w: 20, h: 20,
    cx: x, cy: y + 10,
    type,
    vy: POWERUP.vy,
    sparkTimer: 0,
  });
}

// ============ 更新 ============

export function updateBullets(dt: number): void {
  for (const b of G.bullets) {
    if (b.arm && b.arm > 0) b.arm -= dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.cx = b.x + b.w / 2;
    b.cy = b.y + b.h / 2;
  }
  G.bullets = G.bullets.filter(b =>
    b.y > -20 && b.y < G.canvasH + 20 && b.x > -20 && b.x < G.canvasW + 20);
}

export function updateEnemies(dt: number): void {
  for (const e of G.enemies) {
    if (e.entryTimer > 0) e.entryTimer -= dt;

    if (e.type === 'boss') {
      updateBossEntity(e, dt);
      // 直线激光：锁定玩家横坐标 → 蓄力闪烁 → 纵向光束（有 i-frames，可躲）
      if (e.laserState === undefined) { e.laserState = 0; e.laserTimer = 420; }
      if (e.laserState === 0) {
        e.laserTimer = (e.laserTimer ?? 420) - dt;
        if ((e.laserTimer ?? 0) <= 0 && e.entryTimer <= 0) {
          e.laserState = 1;
          e.laserTimer = 55;
          e.laserX = G.player.x + G.player.w / 2;
        }
      } else if (e.laserState === 1) {
        e.laserTimer = (e.laserTimer ?? 55) - dt;
        if ((e.laserTimer ?? 0) <= 0) { e.laserState = 2; e.laserTimer = 42; }
      } else {
        e.laserTimer = (e.laserTimer ?? 42) - dt;
        if (G.player.invincible <= 0 && !G.cheatInvincible && G.shieldTimer <= 0 &&
            Math.abs(G.player.x + G.player.w / 2 - (e.laserX ?? -999)) < 22) {
          playerHit();
        }
        if ((e.laserTimer ?? 0) <= 0) { e.laserState = 0; e.laserTimer = 420 + Math.random() * 160; }
      }
      continue;
    }

    // 还没完全进入屏幕的敌人加速进场（精英机等慢速机不再半截悬在顶端）
    const boost = e.y < 0 ? 2.5 : 1;

    switch (e.movePattern) {
      case 'fall':
        e.y += boost * e.speed * dt;
        break;
      case 'sway':
        e.x = e.startX + Math.sin(e.movePhase + G.frameCount * 0.03) * e.moveAmp;
        e.y += boost * e.speed * dt;
        break;
      case 'horizontal':
        e.x += boost * e.speed * e.dirX * 0.8 * dt;
        e.y += boost * e.speed * 0.15 * dt;
        if (e.x < -e.w || e.x > G.canvasW + e.w) e.dirX *= -1;
        break;
      case 'zigzag':
        e.x += Math.sin(G.frameCount * 0.06 + e.movePhase) * boost * e.speed * 1.5 * dt;
        e.y += boost * e.speed * 0.7 * dt;
        if (e.x < 0) e.x = 0;
        if (e.x > G.canvasW - e.w) e.x = G.canvasW - e.w;
        break;
      case 'circle': {
        // 盘旋约 7 秒后脱队俯冲离场，避免永久滞留堆场
        e.orbitTime = (e.orbitTime ?? 0) + dt;
        if (e.orbitTime > 420) {
          e.movePattern = 'fall';
          e.speed *= 1.4;
        } else {
          e.x = e.startX + Math.cos(e.movePhase + G.frameCount * 0.02) * e.moveAmp;
          e.y = e.startY + Math.sin(e.movePhase + G.frameCount * 0.025) * e.moveAmp * 0.6;
        }
        break;
      }
    }
    e.cx = e.x + e.w / 2;
    e.cy = e.y + e.h / 2;

    if (e.shootInterval > 0 && e.entryTimer <= 0) {
      e.shootTimer += dt;
      if (e.shootTimer >= e.shootInterval) {
        e.shootTimer = 0;
        if (e.type === 'large' || e.type === 'elite') {
          for (let a = -0.3; a <= 0.3; a += 0.3) {
            G.bullets.push({ x: e.cx - 3, y: e.cy, w: 6, h: 6, cx: e.cx, cy: e.cy, vx: a * 2.2, vy: 2.5, isPlayer: false });
          }
        } else if (e.type === 'medium') {
          const dx = (G.player.x + G.player.w / 2) - e.cx;
          const dy = (G.player.y + G.player.h / 2) - e.cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          G.bullets.push({ x: e.cx - 2, y: e.cy, w: 4, h: 4, cx: e.cx, cy: e.cy, vx: (dx / dist) * 2, vy: (dy / dist) * 2, isPlayer: false });
        }
      }
    }
  }

  G.enemies = G.enemies.filter(e => {
    if (e.type === 'boss' && e.hp > 0) return true;
    if (e.hp <= 0) return false;
    if (e.y > G.canvasH + 80) return false;
    if (e.movePattern === 'horizontal' && (e.x < -80 || e.x > G.canvasW + 80)) return false;
    return true;
  });
}

export function updatePowerUps(dt: number): void {
  for (const pu of G.powerUps) {
    pu.y += pu.vy * dt;
    pu.cy = pu.y + pu.h / 2;
    pu.sparkTimer += dt;
  }
  G.powerUps = G.powerUps.filter(p => p.y < G.canvasH + 30);
}

export function updateParticles(dt: number): void {
  const drag = Math.pow(0.98, dt);
  for (const p of G.particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= drag;
    p.vy *= drag;
    p.life -= dt;
  }
  G.particles = G.particles.filter(p => p.life > 0);
}

export function updatePopups(dt: number): void {
  for (const sp of G.scorePopups) {
    sp.y -= 1.2 * dt;
    sp.life -= dt;
  }
  G.scorePopups = G.scorePopups.filter(sp => sp.life > 0);
}

// ============ 击杀 ============

export function killEnemy(e: Enemy): void {
  G.score += e.score;

  // 精英机坠毁：释放一圈弹幕（带出生保护，不贴脸秒杀）
  if (e.type === 'elite') {
    for (let i = 0; i < 14; i++) {
      const a = (Math.PI * 2 / 14) * i + Math.random() * 0.2;
      G.bullets.push({
        x: e.cx - 3, y: e.cy - 3, w: 6, h: 6, cx: e.cx, cy: e.cy,
        vx: Math.cos(a) * 2, vy: Math.sin(a) * 2, isPlayer: false, arm: 22,
      });
    }
    spawnScorePopup(e.cx, e.cy - 18, '精英机坠落!', '#ff8844', 12);
  }

  G.comboCount++;
  G.comboTimer = COMBO.window;
  G.comboDisplayTimer = COMBO.display;
  if (G.comboCount > G.maxCombo) G.maxCombo = G.comboCount;

  if (G.comboCount >= COMBO.minBonus) {
    const bonus = Math.floor(e.score * (G.comboCount * COMBO.bonusRate));
    G.score += bonus;
    const comboMsg = G.comboCount >= 10 ? 'PERFECT!' : G.comboCount >= 7 ? 'GREAT!' : 'NICE!';
    spawnScorePopup(e.cx, e.cy - 10, `${comboMsg} +${bonus}`, '#ffdd44', 11);
  }

  G.permKills++;
  G.bulletDamage = Math.min(PERM.maxDamage, 1 + Math.floor(G.permKills / PERM.damagePerKills));

  if (G.score >= G.nextLifeScore) {
    G.player.lives = Math.min(G.player.lives + 1, LIFE.max);
    G.nextLifeScore += Math.round(G.nextLifeScore * (LIFE.growth - 1));
    spawnScorePopup(G.player.x + G.player.w / 2, G.player.y, '+1 ♥', '#ff4466', 16);
  }

  const isBoss = e.type === 'boss';
  spawnExplosion(e.cx, e.cy, isBoss ? 30 : 18, isBoss ? '#ff6644' : '#ffaa22', isBoss);
  spawnScorePopup(e.cx, e.cy, `+${e.score}`,
    isBoss ? '#ff4444' : e.type === 'elite' ? '#ff8844' : '#ffffff',
    isBoss ? 20 : e.type === 'elite' ? 15 : 13);

  if (!isBoss) {
    spawnPowerUp(e.cx, e.cy);
  } else {
    G.bossSpawned = false;
    G.shakeTimer = 30;
    G.player.lives = Math.min(G.player.lives + 1, LIFE.max);
    G.bombCount = Math.min(BOMB.max, G.bombCount + 1);
    spawnScorePopup(e.cx, e.cy - 20, 'BOSS击败! +1♥ +1💣', '#ff4466', 16);
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        if (G.gameState === 'playing') {
          spawnExplosion(
            e.cx + (Math.random() - 0.5) * 100,
            e.cy + (Math.random() - 0.5) * 60,
            15, '#ffaa22',
          );
        }
      }, i * 100);
    }
  }
}

// ============ 碰撞 ============

export function collidePlayerBullets(): void {
  for (const b of G.bullets) {
    if (!b.isPlayer) continue;
    for (const e of G.enemies) {
      if (e.entryTimer > 0) continue;
      if (aabbHit(b, e)) {
        b.y = -999;
        e.hp -= G.bulletDamage;
        spawnExplosion(b.cx, b.cy, 5, '#ffcc44');
        if (e.hp <= 0) killEnemy(e);
        break;
      }
    }
  }
  G.bullets = G.bullets.filter(b => b.y !== -999);
}

function playerHit(): void {
  G.player.lives--;
  G.player.invincible = 90;
  // 双倍火力/加速等道具状态不因受击打断（护盾期间本就不会被命中）
  G.comboCount = 0;
  G.comboTimer = 0;
  spawnExplosion(G.player.x + G.player.w / 2, G.player.y + G.player.h / 2, 14, '#ff6644');
  G.shakeTimer = 12;
  if (G.player.lives <= 0) {
    setGameOver();
  }
}

function setGameOver(): void {
  G.gameState = 'gameover';
  if (G.score > G.highScore) {
    G.highScore = G.score;
    localStorage.setItem('airplane-highscore', String(G.highScore));
  }
}

export function playerBox(): Entity {
  const p = G.player;
  return { x: p.x + 6, y: p.y + 4, w: p.w - 12, h: p.h - 10, cx: 0, cy: 0 };
}

export function collideEnemyAttacks(): void {
  if (G.cheatInvincible || G.player.invincible > 0 || G.shieldTimer > 0) return;

  for (const b of G.bullets) {
    if (b.isPlayer) continue;
    if (b.arm && b.arm > 0) continue;   // 出生保护期内的弹幕不造成伤害
    if (aabbHit(b, playerBox())) {
      b.y = -999;
      playerHit();
      break;
    }
  }
  G.bullets = G.bullets.filter(b => b.y !== -999);

  if (G.cheatInvincible || G.player.invincible > 0 || G.shieldTimer > 0) return;
  for (const e of G.enemies) {
    if (e.entryTimer > 0) continue;
    if (aabbHit(playerBox(), e)) {
      playerHit();
      break;
    }
  }
}

export function collidePowerUps(): void {
  const p = G.player;
  const box: Entity = { x: p.x, y: p.y, w: p.w, h: p.h, cx: 0, cy: 0 };
  for (const pu of G.powerUps) {
    if (aabbHit(box, pu)) {
      pu.y = -999;
      switch (pu.type) {
        case 'doubleFire': {
          // 叠加：已激活时再吃 → 火力等级提升（两层 = 五连发）
          if (G.doubleFireTimer > 0) G.doubleFireLevel = Math.min(2, G.doubleFireLevel + 1);
          else G.doubleFireLevel = 1;
          G.doubleFireTimer = POWERUP.doubleFire;
          spawnScorePopup(pu.cx, pu.cy, G.doubleFireLevel >= 2 ? '五连火力!' : '双倍火力!', '#4488ff', 12);
          break;
        }
        case 'shield':
          G.shieldTimer = POWERUP.shield;
          spawnScorePopup(pu.cx, pu.cy, '无敌护盾!', '#ffaa00', 12);
          break;
        case 'speed':
          G.speedTimer = POWERUP.speed;
          spawnScorePopup(pu.cx, pu.cy, '加速!', '#44cc44', 12);
          break;
        case 'heal':
          p.lives = Math.min(p.lives + 1, LIFE.max);
          spawnScorePopup(pu.cx, pu.cy, '+1 ♥', '#ff4444', 14);
          break;
      }
      spawnExplosion(pu.cx, pu.cy, 8, colorForPowerUp(pu.type));
    }
  }
  G.powerUps = G.powerUps.filter(pu => pu.y !== -999);
}

function aabbHit(a: Entity, b: Entity): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function colorForPowerUp(type: PowerUpType): string {
  switch (type) {
    case 'doubleFire': return '#4488ff';
    case 'shield': return '#ffaa00';
    case 'speed': return '#44cc44';
    case 'heal': return '#ff4444';
  }
}

// 玩家自动开火（cd 随永久击杀数缩短）
export function playerAutoFire(dt: number): void {
  G.playerShootTimer += dt;
  const baseCd = Math.max(FIRE.minCd, FIRE.baseCd - Math.floor(G.permKills / FIRE.cdPerKills));
  const cd = G.doubleFireTimer > 0 ? Math.max(FIRE.doubleMinCd, baseCd - FIRE.doubleBonus) : baseCd;
  if (G.playerShootTimer >= cd) {
    G.playerShootTimer = 0;
    const bx = G.player.x + G.player.w / 2;
    const by = G.player.y;
    G.bullets.push({ x: bx - 2, y: by, w: 4, h: 8, cx: bx, cy: by + 4, vx: 0, vy: FIRE.bulletVy, isPlayer: true });
    if (G.doubleFireTimer > 0) {
      // 一层 = 三连发；叠加两层 = 五连发（外层弹道略散）
      G.bullets.push({ x: bx - 12, y: by + 4, w: 4, h: 8, cx: bx - 10, cy: by + 8, vx: -FIRE.sideVx, vy: FIRE.sideVy, isPlayer: true });
      G.bullets.push({ x: bx + 8, y: by + 4, w: 4, h: 8, cx: bx + 10, cy: by + 8, vx: FIRE.sideVx, vy: FIRE.sideVy, isPlayer: true });
      if (G.doubleFireLevel >= 2) {
        G.bullets.push({ x: bx - 19, y: by + 8, w: 4, h: 8, cx: bx - 17, cy: by + 12, vx: -1.5, vy: FIRE.sideVy + 0.7, isPlayer: true });
        G.bullets.push({ x: bx + 15, y: by + 8, w: 4, h: 8, cx: bx + 17, cy: by + 12, vx: 1.5, vy: FIRE.sideVy + 0.7, isPlayer: true });
      }
    }
  }
}

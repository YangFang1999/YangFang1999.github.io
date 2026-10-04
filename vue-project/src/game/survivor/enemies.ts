// 桌面保卫战 — 敌人：波次生成 / AI / 接触伤害 / 掉落
import {
  BOSS_SHOOT, BOSS_TIMES, CONTACT, DROPS, ELITE_TIMES, ENEMY, ENEMY_CAP, FINAL_AT, WAVES, hpScale,
} from './config';
import { spawnDmg, spawnParticles } from './fx';
import { G, saveBest } from './state';
import { rand } from '../utils';
import type { Enemy, EnemyKind } from './types';

const KIND_COLOR: Record<EnemyKind, string> = {
  virus: '#ff6b6b',
  worm: '#7ddf6a',
  popup: '#ffd34d',
  rogue: '#c88cff',
  clippy: '#f5f5ff',
  bsod: '#7fbfff',
};

function spawnAt(kind: EnemyKind, x: number, y: number, bossLevel?: number): void {
  const def = ENEMY[kind];
  const minutes = G.time / 60;
  // Boss 只按出场序号成长，不吃时间缩放（否则五分钟的 Boss 根本打不动）
  const hp = bossLevel
    ? Math.round(def.hp * (1 + (bossLevel - 1) * 0.7))
    : Math.round(def.hp * hpScale(minutes));
  const e: Enemy = {
    kind,
    x, y, cx: x, cy: y,
    r: def.r,
    hp, maxHp: hp,
    speed: def.speed,
    dmg: def.dmg,
    xp: def.xp,
    kvx: 0, kvy: 0,
    atkCd: 0, orbCd: 0, flash: 0,
    timer: rand(0, 120),
    phase: 0,
    dashVx: 0, dashVy: 0,
    bossLevel,
    shootCd: kind === 'bsod' ? BOSS_SHOOT.interval : 0,
    minionCd: kind === 'bsod' ? BOSS_SHOOT.minionEvery : 0,
  };
  G.enemies.push(e);
}

function edgePos(): { x: number; y: number } {
  // 从画布四边外侧随机出生
  const m = 30;
  const side = Math.floor(Math.random() * 4);
  if (side === 0) return { x: rand(0, G.w), y: -m };
  if (side === 1) return { x: G.w + m, y: rand(0, G.h) };
  if (side === 2) return { x: rand(0, G.w), y: G.h + m };
  return { x: -m, y: rand(0, G.h) };
}

function pickKind(minute: number): EnemyKind {
  const rule = WAVES[Math.min(minute, 14)];
  let total = 0;
  for (const k of rule.weights) total += k.w;
  let r = Math.random() * total;
  for (const k of rule.weights) {
    r -= k.w;
    if (r <= 0) return k.kind as EnemyKind;
  }
  return 'virus';
}

export function updateSpawning(dt: number): void {
  G.spawnTimer -= dt;
  const minute = Math.floor(G.time / 60);
  const rule = WAVES[Math.min(minute, 14)];

  if (G.spawnTimer <= 0 && G.enemies.length < ENEMY_CAP) {
    G.spawnTimer = rule.interval;
    const batch = Math.floor(rand(rule.batch[0], rule.batch[1] + 1));
    for (let i = 0; i < batch && G.enemies.length < ENEMY_CAP; i++) {
      const pos = edgePos();
      spawnAt(pickKind(minute), pos.x, pos.y);
    }
  }

  // 精英：大眼夹
  if (G.nextEliteIdx < ELITE_TIMES.length && G.time >= ELITE_TIMES[G.nextEliteIdx]) {
    G.nextEliteIdx++;
    const pos = edgePos();
    spawnAt('clippy', pos.x, pos.y);
    pushBanner('📎 大眼夹 逼近！', '#f5f5ff');
  }

  // Boss：蓝屏死神
  if (G.nextBossIdx < BOSS_TIMES.length && G.time >= BOSS_TIMES[G.nextBossIdx]) {
    G.nextBossIdx++;
    G.bossActive = true;
    const pos = edgePos();
    spawnAt('bsod', pos.x, pos.y, G.nextBossIdx);
    pushBanner(`⚠ 蓝屏死神 Lv.${G.nextBossIdx} 降临！`, '#7fbfff');
    G.shake = Math.max(G.shake, 10);
  }
}

export function updateEnemies(dt: number): void {
  const p = G.player;

  for (const e of G.enemies) {
    e.timer += dt;
    if (e.flash > 0) e.flash -= dt;

    // 击退衰减
    e.x += e.kvx * dt;
    e.y += e.kvy * dt;
    e.kvx *= Math.pow(0.85, dt);
    e.kvy *= Math.pow(0.85, dt);

    const dx = p.x - e.cx, dy = p.y - e.cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = dx / dist, ny = dy / dist;

    switch (e.kind) {
      case 'virus': {
        // 直追 + 轻微抖动
        const jit = Math.sin(e.timer * 0.11) * 0.4;
        e.x += (nx + -ny * jit) * e.speed * dt;
        e.y += (ny + nx * jit) * e.speed * dt;
        break;
      }
      case 'worm': {
        // 强烈蛇行
        const weave = Math.sin(e.timer * 0.09) * 0.9;
        e.x += (nx + -ny * weave) * e.speed * dt;
        e.y += (ny + nx * weave) * e.speed * dt;
        break;
      }
      case 'popup':
      case 'rogue': {
        e.x += nx * e.speed * dt;
        e.y += ny * e.speed * dt;
        break;
      }
      case 'clippy': {
        // 蓄力突进：游走 → 停顿 → 冲刺
        if (e.phase === 0) {
          e.x += nx * e.speed * 0.6 * dt;
          e.y += ny * e.speed * 0.6 * dt;
          if (e.timer > 120 && dist < 220) { e.phase = 1; e.timer = 0; }
        } else if (e.phase === 1) {
          if (e.timer > 26) {
            e.phase = 2; e.timer = 0;
            e.dashVx = nx * 4.6; e.dashVy = ny * 4.6;
          }
        } else {
          e.x += e.dashVx * dt;
          e.y += e.dashVy * dt;
          if (e.timer > 22) { e.phase = 0; e.timer = 0; }
        }
        break;
      }
      case 'bsod': {
        e.x += nx * e.speed * dt;
        e.y += ny * e.speed * dt;
        // 环形错误弹幕
        e.shootCd = (e.shootCd ?? 0) - dt;
        if (e.shootCd <= 0) {
          e.shootCd = BOSS_SHOOT.interval * (e.bossLevel === 3 ? 0.75 : 1);
          const n = BOSS_SHOOT.ringCount + (e.bossLevel === 3 ? 4 : 0);
          const base = rand(0, Math.PI * 2);
          for (let i = 0; i < n; i++) {
            const a = base + (Math.PI * 2 / n) * i;
            G.ebullets.push({
              x: e.cx, y: e.cy,
              vx: Math.cos(a) * BOSS_SHOOT.speed, vy: Math.sin(a) * BOSS_SHOOT.speed,
              r: BOSS_SHOOT.r, dmg: BOSS_SHOOT.dmg, life: 600,
            });
          }
        }
        // 召唤小病毒
        e.minionCd = (e.minionCd ?? 0) - dt;
        if (e.minionCd <= 0 && G.enemies.length < ENEMY_CAP - 6) {
          e.minionCd = BOSS_SHOOT.minionEvery;
          for (let i = 0; i < BOSS_SHOOT.minionBatch; i++) {
            spawnAt('virus', e.cx + rand(-40, 40), e.cy + rand(-40, 40));
          }
        }
        break;
      }
    }

    // 边界
    e.x = Math.max(-40, Math.min(G.w + 40, e.x));
    e.y = Math.max(-40, Math.min(G.h + 40, e.y));
    e.cx = e.x;
    e.cy = e.y;

    // 接触伤害（无敌作弊 / 全局无敌帧内跳过；已死亡的敌人不再造成伤害）
    if (e.atkCd > 0) e.atkCd -= dt;
    const pdx = e.cx - p.x, pdy = e.cy - p.y;
    const rr = e.r + CONTACT.playerR;
    if (e.hp > 0 && pdx * pdx + pdy * pdy <= rr * rr && e.atkCd <= 0 && G.player.iFrames <= 0 && !G.cheatInvincible) {
      e.atkCd = CONTACT.atkCd;
      hitPlayer(e.dmg, e.cx, e.cy);
    }
  }

  // 死亡清理 + 掉落
  const dead = G.enemies.filter(e => e.hp <= 0);
  if (dead.length) {
    for (const e of dead) onEnemyKilled(e);
    G.enemies = G.enemies.filter(e => e.hp > 0);
  }
}

function onEnemyKilled(e: Enemy): void {
  G.kills++;
  spawnParticles(e.cx, e.cy, e.kind === 'bsod' ? 30 : 8, KIND_COLOR[e.kind], 2.4);

  // 经验宝石
  G.gems.push({ x: e.cx, y: e.cy, value: e.xp, homing: false, t: rand(0, Math.PI * 2) });

  // Boss / 精英
  if (e.kind === 'bsod') {
    G.bossActive = false;
    G.shake = 22;
    G.pickups.push({ x: e.cx, y: e.cy, kind: 'heal', t: 0 });
    G.pickups.push({ x: e.cx + 24, y: e.cy, kind: 'bomb', t: 0 });
    if (e.bossLevel === 3) {
      // 最终 Boss 被击败 → 胜利（由主循环检测 bossActive=false && time>=FINAL_AT）
    }
  } else if (e.kind === 'clippy') {
    G.pickups.push({ x: e.cx, y: e.cy, kind: Math.random() < 0.5 ? 'magnet' : 'heal', t: 0 });
  } else {
    const r = Math.random();
    if (r < DROPS.bomb) G.pickups.push({ x: e.cx, y: e.cy, kind: 'bomb', t: 0 });
    else if (r < DROPS.bomb + DROPS.magnet) G.pickups.push({ x: e.cx, y: e.cy, kind: 'magnet', t: 0 });
    else if (r < DROPS.bomb + DROPS.magnet + DROPS.heal) G.pickups.push({ x: e.cx, y: e.cy, kind: 'heal', t: 0 });
  }
}

export function hitPlayer(dmg: number, _sx?: number, _sy?: number): void {
  if (G.cheatInvincible || G.player.iFrames > 0) return;
  G.player.iFrames = 36;
  G.player.hp -= dmg;
  spawnDmg(G.player.x, G.player.y - 14, dmg, '#ff6666');
  G.shake = Math.max(G.shake, 8);
  spawnParticles(G.player.x, G.player.y, 10, '#ff5555', 2.6);
  if (G.player.hp <= 0) {
    G.player.hp = 0;
    gameOver();
  }
}

function gameOver(): void {
  G.phase = 'gameover';
  if (G.time > G.best.time || (G.time === G.best.time && G.kills > G.best.kills)) {
    G.best = { time: G.time, kills: G.kills };
    saveBest();
  }
}

export function checkVictory(): void {
  if (G.phase === 'playing' && G.time >= FINAL_AT && !G.bossActive && G.nextBossIdx >= BOSS_TIMES.length) {
    G.phase = 'victory';
    if (G.time > G.best.time || (G.time === G.best.time && G.kills > G.best.kills)) {
      G.best = { time: G.time, kills: G.kills };
      saveBest();
    }
  }
}

export { KIND_COLOR };

export function pushBanner(text: string, color: string): void {
  if (G.banners.length >= 3) G.banners.shift();
  G.banners.push({ text, life: 150, maxLife: 150, color });
}

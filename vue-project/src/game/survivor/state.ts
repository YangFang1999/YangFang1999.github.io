// 桌面保卫战 — 全局状态与派生数值
import {
  ENEMY_CAP, PASSIVE_EFFECT, PLAYER, XP_CURVE, META_KEY,
} from './config';
import type {
  Beam, Choice, DmgNum, Enemy, EnemyBullet, Gem, Particle, PassiveId, Phase, Pickup, PlayerBullet, WeaponInst,
} from './types';

export interface SurvivorState {
  w: number; h: number; dpr: number;

  phase: Phase;
  time: number;             // 存活秒数
  kills: number;
  level: number;
  xp: number;

  player: { x: number; y: number; hp: number; iFrames: number };
  weapons: WeaponInst[];
  passives: Record<PassiveId, number>;
  choices: Choice[];

  enemies: Enemy[];
  bullets: PlayerBullet[];
  ebullets: EnemyBullet[];
  gems: Gem[];
  pickups: Pickup[];
  beams: Beam[];
  dmgs: DmgNum[];
  particles: Particle[];

  orbAngle: number;

  spawnTimer: number;
  nextBossIdx: number;      // BOSS_TIMES 游标
  nextEliteIdx: number;
  bossActive: boolean;

  shake: number;

  keys: Set<string>;
  pointer: { active: boolean; x: number; y: number };

  best: { time: number; kills: number };

  // 作弊 / UI 辅助
  cheatInvincible: boolean;
  menuPage: number;         // 菜单页：0 主页 1 怪物图鉴 2 武器被动
  banners: Array<{ text: string; life: number; maxLife: number; color: string }>;

  // 性能
  fps: number;
}

function loadBest(): { time: number; kills: number } {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (typeof p.time === 'number' && typeof p.kills === 'number') return p;
    }
  } catch { /* 忽略损坏的存档 */ }
  return { time: 0, kills: 0 };
}

export const G: SurvivorState = {
  w: 800, h: 560, dpr: 1,

  phase: 'menu',
  time: 0,
  kills: 0,
  level: 1,
  xp: 0,

  player: { x: 400, y: 280, hp: 100, iFrames: 0 },
  weapons: [],
  passives: { cpu: 0, ram: 0, wheel: 0, ups: 0, magnet: 0 },
  choices: [],

  enemies: [],
  bullets: [],
  ebullets: [],
  gems: [],
  pickups: [],
  beams: [],
  dmgs: [],
  particles: [],

  orbAngle: 0,

  spawnTimer: 0,
  nextBossIdx: 0,
  nextEliteIdx: 0,
  bossActive: false,

  shake: 0,

  keys: new Set<string>(),
  pointer: { active: false, x: 0, y: 0 },

  best: loadBest(),

  cheatInvincible: false,
  menuPage: 0,
  banners: [],

  fps: 60,
};

export function saveBest(): void {
  try {
    localStorage.setItem(META_KEY, JSON.stringify(G.best));
  } catch { /* 存储不可用时静默 */ }
}

export function xpNext(level: number): number {
  return Math.floor(
    XP_CURVE.base
    + (level - 1) * XP_CURVE.linear
    + Math.pow(level - 1, XP_CURVE.pow),
  );
}

export function maxHp(): number {
  return PLAYER.maxHp + G.passives.ups * PASSIVE_EFFECT.hpPerLvl;
}

export function dmgMult(): number {
  return 1 + G.passives.cpu * PASSIVE_EFFECT.dmgPerLvl;
}

export function cdMult(): number {
  return Math.max(0.6, 1 - G.passives.ram * PASSIVE_EFFECT.cdPerLvl);
}

export function moveSpeed(): number {
  return PLAYER.speed * (1 + G.passives.wheel * PASSIVE_EFFECT.speedPerLvl);
}

export function pickupRadius(): number {
  return PLAYER.pickupRadius * (1 + G.passives.magnet * PASSIVE_EFFECT.pickupPerLvl);
}

export function resetGame(): void {
  G.phase = 'playing';
  G.time = 0;
  G.kills = 0;
  G.level = 1;
  G.xp = 0;
  G.player = { x: G.w / 2, y: G.h / 2, hp: maxHp(), iFrames: 0 };
  G.weapons = [{ id: 'orbit', level: 1, evo: false, cd: 0, tick: 0 }];
  G.passives = { cpu: 0, ram: 0, wheel: 0, ups: 0, magnet: 0 };
  G.choices = [];
  G.enemies = [];
  G.bullets = [];
  G.ebullets = [];
  G.gems = [];
  G.pickups = [];
  G.beams = [];
  G.dmgs = [];
  G.particles = [];
  G.banners = [];
  G.orbAngle = 0;
  G.spawnTimer = 0;
  G.nextBossIdx = 0;
  G.nextEliteIdx = 0;
  G.bossActive = false;
  G.shake = 0;
  G.cheatInvincible = false;
  G.pointer.active = false;
}

export { ENEMY_CAP };

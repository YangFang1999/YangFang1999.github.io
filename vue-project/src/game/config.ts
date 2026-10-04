// 所有可调平衡数值集中在这里，改难度/手感只动这个文件。
// 时间单位统一为「帧」（以 60fps 为基准），引擎会按 delta-time 换算。
import type { EnemyType } from './types';

export const CANVAS = {
  minW: 300,
  maxW: 480,
  minH: 450,
  maxH: 720,
  aspect: 2 / 3,          // 宽高比 w:h
  vMargin: 140,           // 画布高度预留（窗口标题栏 + 按钮）
  widthRatio: 0.4,        // 桌面端按视口宽度的比例
};

export const PLAYER = {
  w: 30, h: 36,
  speed: 4,
  lives: 2,
  maxLives: 10,
  invincibleFrames: 90,   // 中弹后无敌 1.5s
};

export const FIRE = {
  baseCd: 15,             // 基础射击间隔
  cdPerKills: 6,          // 每击杀 N 次减 1 帧冷却
  minCd: 9,
  doubleBonus: 3,         // 双倍火力额外减冷却
  doubleMinCd: 7,
  bulletVy: -9.5,
  sideVy: -9,
  sideVx: 0.8,
};

export const PERM = {
  damagePerKills: 25,     // 每击杀 N 次 +1 伤害（成长放缓，让怪扛得住）
  maxDamage: 8,
  speedPerKills: 4,       // 每击杀 N 次 +0.5 移速
  speedStep: 0.5,
  maxSpeedBonus: 3.0,
};

export const DIFFICULTY = {
  base: 0.75,
  perScore: 1 / 45000,    // 编队+连杀经济下约 3-4 分钟高强度游玩升满
  max: 2.2,
};

// 判定框贴合机身外形（精英机原 76×54 比画出的机身还宽，擦弹也判中）
export const ENEMY_STATS: Record<
  Exclude<EnemyType, 'boss'>,
  { w: number; h: number; hp: number; speedBase: number; speedRand: number; score: number }
> = {
  small:  { w: 26, h: 26, hp: 1,  speedBase: 1.5, speedRand: 1.2, score: 100 },
  medium: { w: 36, h: 36, hp: 6,  speedBase: 0.8, speedRand: 0.8, score: 300 },
  large:  { w: 50, h: 50, hp: 9,  speedBase: 0.45, speedRand: 0.4, score: 500 },
  elite:  { w: 68, h: 48, hp: 14, speedBase: 0.6, speedRand: 0,   score: 1000 },
};

// 射击间隔（帧）按难度收缩
export const ENEMY_SHOOT = {
  medium: { base: 160, perDiff: 20, min: 90 },
  large:  { base: 120, perDiff: 15, min: 70 },
  elite:  { base: 100, perDiff: 10, min: 60 },
};

export const SPAWN = {
  baseRate: 55,
  perDiff: 22,
  minRate: 12,
  maxOnScreen: 34,        // 场上敌机上限（密度阀门）
  gateMedium: 120, pMedium: 0.36,
  gateLarge: 400,  pLarge: 0.18,
  gateElite: 600,  pElite: 0.10,
};

// 编队：每 N 个出生节奏来一次 V 字队列（刷怪密度的主要来源）
export const FORMATION = {
  everyNthSpawn: 4,
  chance: 0.8,
  min: 4,
  max: 8,
  spacingX: 34,
  spacingY: 24,
};

export const POWERUP = {
  dropRate: 0.10,
  doubleFire: 600,        // 10s
  shield: 480,            // 8s
  speed: 600,             // 10s
  speedMult: 1.6,
  vy: 1.5,
};

export const LIFE = {
  perScore: 1000,
  growth: 1.8,            // 下一架奖励生命所需分数按 1.8 倍几何增长
  max: 10,
};

export const BOMB = {
  start: 3,
  max: 5,
  damage: 40,
};

export const COMBO = {
  window: 80,
  display: 90,
  minBonus: 5,            // 连杀 ≥5 才有加成
  bonusRate: 0.1,         // 加成 = 分数 × 连杀数 × rate
};

export const BOSS = {
  killMilestones: [30, 80, 150, 250, 380, 550, 780, 1080],
  extraStep: 250,
  hpBase: 100,
  hpPerLevel: 60,
  scoreBase: 3000,
  scorePerLevel: 1000,
  speedBase: 0.4,
  speedPerLevel: 0.1,
  shootBase: 70,
  shootPerLevel: 5,
  shootMin: 30,
  // 移动
  moveSpeedBase: 0.6,
  moveSpeedPerLevel: 0.12,
  roamMaxYRatio: 0.55,
  moveChangeMin: 60,
  moveChangeRand: 100,
  // 阶段 1：轨道环
  orbitBulletsBase: 6,
  orbitBulletsPerLevel: 2,   // bulletCount = 6 + floor(level / 2)
  orbitSpeedBase: 1.5,
  orbitSpeedPerLevel: 0.2,
  innerMinLevel: 3,
  innerSpeedBase: 1.0,
  innerSpeedPerLevel: 0.15,
  aimedMinLevel: 4,
  aimedSpeed: 2.5,
  orbitAdvanceBase: 0.15,
  orbitAdvancePerLevel: 0.02,
  // 阶段 2（血量 ≤50%）：瞄准扇形 + 侧翼弹墙
  phase2Threshold: 0.5,
  phase2ShootBase: 55,
  phase2ShootPerLevel: 4,
  phase2ShootMin: 20,
  fanCount: 7,
  fanSpread: 0.5,
  fanSpeed: 2.6,
  wallCount: 8,
  wallVy: 2.2,
  // 阶段 3（血量 ≤25%）：狂暴
  phase3Threshold: 0.25,
  enrageIntervalMult: 0.7,
  enrageMoveMult: 1.35,
  enrageBurstCount: 24,
  enrageBurstSpeed: 1.8,
  enrageBurstEvery: 3,       // 每 N 轮齐射放一次全向爆发
  announceRingCount: 16,
  announceRingSpeed: 1.6,
};

export const METEOR = {
  spawnMin: 180,
  spawnRand: 300,
  lifeMin: 60,
  lifeRand: 60,
  maxLife: 120,
};

// delta-time 上限（帧）：切后台回来时防止大步长穿模
export const MAX_DT = 2;

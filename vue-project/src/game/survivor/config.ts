// 桌面保卫战 — 全部平衡数值。时间单位为帧（60fps 基准），引擎按 delta-time 换算。
export const ARENA = {
  maxW: 960,
  maxH: 680,
  minW: 320,
  minH: 420,
  vMargin: 150,           // 窗口标题栏 + 按钮预留
  widthRatio: 0.92,
};

export const PLAYER = {
  r: 8,                   // 碰撞半径
  speed: 2.7,
  maxHp: 100,
  iFrames: 36,            // 受击后全局无敌帧
  pickupRadius: 30,       // 拾取吸附半径
  gemSpeed: 6.5,
};

export const XP_CURVE = {
  base: 6,
  linear: 4,              // 每级 +4
  pow: 1.45,              // (level-1)^pow 项
};

export const PASSIVES: Record<string, { name: string; icon: string; max: number; desc: string }> = {
  cpu:    { name: 'CPU 超频',   icon: 'fa fa-microchip',   max: 3, desc: '伤害 +15%/级' },
  ram:    { name: '内存优化',   icon: 'fa fa-memory',      max: 3, desc: '武器冷却 -8%/级' },
  wheel:  { name: '滚轮狂飙',   icon: 'fa fa-mouse-pointer', max: 3, desc: '移动速度 +10%/级' },
  ups:    { name: 'UPS 电源',   icon: 'fa fa-plug',        max: 3, desc: '最大生命 +20/级（拾取时回复）' },
  magnet: { name: '磁盘磁铁',   icon: 'fa fa-magnet',      max: 3, desc: '拾取范围 +35%/级' },
};

export const PASSIVE_EFFECT = {
  dmgPerLvl: 0.15,
  cdPerLvl: 0.08,
  speedPerLvl: 0.10,
  hpPerLvl: 20,
  pickupPerLvl: 0.35,
};

// ============ 武器 ============

export interface OrbitLevel { count: number; dmg: number; radius: number; orbCd: number; spin: number }
export interface BlockerLevel { cd: number; count: number; dmg: number; speed: number; pierce: number }
export interface ScanLevel { cd: number; dmg: number; hw: number }
export interface AuraLevel { radius: number; dmg: number; tick: number; slow: number }

export interface WeaponDef {
  name: string;
  evoName: string;
  icon: string;           // 升级面板用 FA 图标
  max: number;
  orbit?: OrbitLevel[];
  evoOrbit?: OrbitLevel;
  blocker?: BlockerLevel[];
  evoBlocker?: BlockerLevel;
  scan?: ScanLevel[];
  evoScan?: ScanLevel;
  aura?: AuraLevel[];
  evoAura?: AuraLevel;
  brief: string;          // 升级面板描述
  evoBrief: string;
}

export const WEAPONS: Record<string, WeaponDef> = {
  orbit: {
    name: '环绕指针', evoName: '四叶旋风', icon: 'fa fa-hand-pointer-o', max: 5,
    brief: '光标绕你旋转，撞击敌人',
    evoBrief: '8 枚巨型光标旋风，伤害大幅提升',
    orbit: [
      { count: 3, dmg: 12, radius: 44, orbCd: 28, spin: 0.045 },
      { count: 4, dmg: 14, radius: 46, orbCd: 26, spin: 0.045 },
      { count: 4, dmg: 17, radius: 50, orbCd: 24, spin: 0.05 },
      { count: 5, dmg: 21, radius: 52, orbCd: 22, spin: 0.05 },
      { count: 6, dmg: 26, radius: 56, orbCd: 20, spin: 0.055 },
    ],
    evoOrbit: { count: 8, dmg: 34, radius: 66, orbCd: 16, spin: 0.062 },
  },
  blocker: {
    name: '弹窗拦截', evoName: '拦截风暴', icon: 'fa fa-times-rectangle', max: 5,
    brief: '自动射出拦截弹攻击最近的敌人',
    evoBrief: '高频率拦截弹幕，无限穿透',
    blocker: [
      { cd: 66, count: 1, dmg: 12, speed: 6,   pierce: 1 },
      { cd: 60, count: 2, dmg: 14, speed: 6,   pierce: 1 },
      { cd: 54, count: 2, dmg: 17, speed: 6.5, pierce: 2 },
      { cd: 48, count: 3, dmg: 20, speed: 6.5, pierce: 2 },
      { cd: 42, count: 4, dmg: 24, speed: 7,   pierce: 3 },
    ],
    evoBlocker: { cd: 32, count: 6, dmg: 30, speed: 7.5, pierce: 99 },
  },
  scan: {
    name: '杀毒扫描', evoName: '全盘格式化', icon: 'fa fa-barcode', max: 5,
    brief: '周期性十字扫描线，伤害线上所有敌人',
    evoBrief: '更粗更疼的全盘格式化扫描',
    scan: [
      { cd: 150, dmg: 16, hw: 15 },
      { cd: 132, dmg: 22, hw: 19 },
      { cd: 116, dmg: 28, hw: 23 },
      { cd: 102, dmg: 36, hw: 27 },
      { cd: 90,  dmg: 46, hw: 32 },
    ],
    evoScan: { cd: 76, dmg: 64, hw: 44 },
  },
  aura: {
    name: '磁盘整理', evoName: '整理风暴', icon: 'fa fa-th-large', max: 5,
    brief: '身边持续展开整理区块，灼烧靠近的敌人',
    evoBrief: '超大范围风暴，并使敌人减速',
    aura: [
      { radius: 55,  dmg: 5,  tick: 30, slow: 1 },
      { radius: 66,  dmg: 7,  tick: 28, slow: 1 },
      { radius: 76,  dmg: 9,  tick: 26, slow: 1 },
      { radius: 86,  dmg: 11, tick: 24, slow: 1 },
      { radius: 96,  dmg: 14, tick: 22, slow: 1 },
    ],
    evoAura: { radius: 124, dmg: 20, tick: 18, slow: 0.65 },
  },
};

// ============ 敌人 ============

export const ENEMY: Record<string, {
  hp: number; speed: number; r: number; dmg: number; xp: number;
}> = {
  virus:  { hp: 10,  speed: 1.2,  r: 9,  dmg: 8,  xp: 1 },
  worm:   { hp: 16,  speed: 1.5,  r: 10, dmg: 10, xp: 2 },
  popup:  { hp: 40,  speed: 0.65, r: 13, dmg: 12, xp: 4 },
  rogue:  { hp: 90,  speed: 0.5,  r: 16, dmg: 16, xp: 8 },
  clippy: { hp: 260, speed: 1.1,  r: 14, dmg: 18, xp: 25 },
  bsod:   { hp: 1100, speed: 0.9,  r: 30, dmg: 25, xp: 100 },
};

// 随游戏时间成长（分钟）
export function hpScale(minutes: number): number {
  return 1 + minutes * 0.5;
}

// ============ 波次表（按分钟） ============

export interface WaveRule {
  interval: number;       // 出生间隔（帧）
  batch: [number, number];
  weights: Array<{ kind: string; w: number }>;
}

export const WAVES: Record<number, WaveRule> = {
  0:  { interval: 44, batch: [2, 3], weights: [{ kind: 'virus', w: 1 }] },
  1:  { interval: 38, batch: [2, 4], weights: [{ kind: 'virus', w: 3 }, { kind: 'worm', w: 1 }] },
  2:  { interval: 35, batch: [2, 4], weights: [{ kind: 'virus', w: 3 }, { kind: 'worm', w: 1.5 }, { kind: 'popup', w: 0.8 }] },
  3:  { interval: 32, batch: [3, 4], weights: [{ kind: 'virus', w: 3 }, { kind: 'worm', w: 1.5 }, { kind: 'popup', w: 1.2 }] },
  4:  { interval: 29, batch: [3, 5], weights: [{ kind: 'virus', w: 3 }, { kind: 'worm', w: 2 }, { kind: 'popup', w: 1.5 }, { kind: 'rogue', w: 0.5 }] },
  5:  { interval: 27, batch: [3, 5], weights: [{ kind: 'virus', w: 2.5 }, { kind: 'worm', w: 2 }, { kind: 'popup', w: 1.6 }, { kind: 'rogue', w: 0.7 }] },
  6:  { interval: 26, batch: [3, 5], weights: [{ kind: 'virus', w: 2 }, { kind: 'worm', w: 2.2 }, { kind: 'popup', w: 1.8 }, { kind: 'rogue', w: 0.9 }] },
  7:  { interval: 24, batch: [4, 5], weights: [{ kind: 'virus', w: 2 }, { kind: 'worm', w: 2.4 }, { kind: 'popup', w: 2 }, { kind: 'rogue', w: 1.1 }] },
  8:  { interval: 22, batch: [4, 6], weights: [{ kind: 'virus', w: 1.8 }, { kind: 'worm', w: 2.4 }, { kind: 'popup', w: 2.2 }, { kind: 'rogue', w: 1.3 }] },
  9:  { interval: 21, batch: [4, 6], weights: [{ kind: 'virus', w: 1.6 }, { kind: 'worm', w: 2.6 }, { kind: 'popup', w: 2.4 }, { kind: 'rogue', w: 1.5 }] },
  10: { interval: 20, batch: [4, 6], weights: [{ kind: 'virus', w: 1.5 }, { kind: 'worm', w: 2.6 }, { kind: 'popup', w: 2.4 }, { kind: 'rogue', w: 1.6 }] },
  11: { interval: 19, batch: [5, 7], weights: [{ kind: 'virus', w: 1.4 }, { kind: 'worm', w: 2.6 }, { kind: 'popup', w: 2.6 }, { kind: 'rogue', w: 1.8 }] },
  12: { interval: 18, batch: [5, 7], weights: [{ kind: 'virus', w: 1.2 }, { kind: 'worm', w: 2.8 }, { kind: 'popup', w: 2.8 }, { kind: 'rogue', w: 2 }] },
  13: { interval: 17, batch: [5, 8], weights: [{ kind: 'virus', w: 1 }, { kind: 'worm', w: 3 }, { kind: 'popup', w: 3 }, { kind: 'rogue', w: 2.2 }] },
  14: { interval: 16, batch: [5, 8], weights: [{ kind: 'virus', w: 1 }, { kind: 'worm', w: 3 }, { kind: 'popup', w: 3.2 }, { kind: 'rogue', w: 2.4 }] },
};

// Boss / 精英事件（秒）——首 Boss 提前到 4:00，节奏更紧凑
export const BOSS_TIMES = [240, 540, 900];
export const ELITE_TIMES = [100, 240, 380, 520, 660, 780];
export const FINAL_AT = 900;
export const ENEMY_CAP = 130;

export const BOSS_SHOOT = {
  interval: 150,
  ringCount: 10,
  speed: 2.2,
  r: 6,
  dmg: 12,
  minionEvery: 300,
  minionBatch: 4,
};

export const CONTACT = {
  playerR: 8,
  atkCd: 45,              // 每个敌人的接触攻击冷却
  iFrames: 36,            // 全局受击无敌帧
};

export const DROPS = {
  heal: 0.02,             // 咖啡
  magnet: 0.012,          // 磁盘吸铁
  bomb: 0.006,            // 回收站清空
};

export const META_KEY = 'survivor-best';
export const MAX_DT = 2;

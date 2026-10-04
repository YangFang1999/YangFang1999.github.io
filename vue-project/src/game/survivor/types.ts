// 桌面保卫战 — 类型定义
export type Phase = 'menu' | 'playing' | 'levelup' | 'paused' | 'gameover' | 'victory';
export type EnemyKind = 'virus' | 'worm' | 'popup' | 'rogue' | 'clippy' | 'bsod';
export type WeaponId = 'orbit' | 'blocker' | 'scan' | 'aura';
export type PassiveId = 'cpu' | 'ram' | 'wheel' | 'ups' | 'magnet';
export type PickupKind = 'heal' | 'magnet' | 'bomb';

export interface Enemy {
  kind: EnemyKind;
  x: number; y: number; cx: number; cy: number;
  r: number;
  hp: number; maxHp: number;
  speed: number;
  dmg: number;
  xp: number;
  // 击退
  kvx: number; kvy: number;
  // 攻击冷却（接触伤害）/ 被环绕指针命中的冷却 / 受击闪白
  atkCd: number; orbCd: number; flash: number;
  // 行为计时器
  timer: number;
  phase: number;          // clippy: 0 游走 1 蓄力 2 突进
  dashVx: number; dashVy: number;
  // Boss
  bossLevel?: number;
  shootCd?: number;
  minionCd?: number;
}

export interface EnemyBullet {
  x: number; y: number; vx: number; vy: number;
  r: number; dmg: number; life: number;
}

export interface PlayerBullet {
  x: number; y: number; vx: number; vy: number;
  dmg: number; pierce: number; life: number;
}

export interface Gem {
  x: number; y: number; value: number;
  homing: boolean;
  t: number;            // 漂浮动画相位
}

export interface Pickup {
  x: number; y: number; kind: PickupKind;
  t: number;
}

export interface Beam {
  horizontal: boolean;  // 横扫 or 竖扫
  pos: number;          // 所在坐标（y 或 x）
  hw: number;           // 半宽
  life: number; maxLife: number;
}

export interface DmgNum {
  x: number; y: number; val: number;
  life: number; maxLife: number;
  color: string;
}

export interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  color: string; r: number;
}

export interface WeaponInst {
  id: WeaponId;
  level: number;        // 1-5
  evo: boolean;
  cd: number;           // 剩余冷却（帧）
  tick: number;         // aura 等持续型用
}

export type ChoiceKind = 'weapon' | 'weaponUp' | 'evolve' | 'passive' | 'heal';

export interface Choice {
  kind: ChoiceKind;
  id: WeaponId | PassiveId | 'heal';
  name: string;
  desc: string;
  icon: string;         // FA 图标类
  levelText: string;    // 「新武器!」「Lv.3」「进化!」等
}

export interface Banner {
  text: string;
  life: number;
  maxLife: number;
  color: string;
}

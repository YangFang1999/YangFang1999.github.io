export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';
export type EnemyType = 'small' | 'medium' | 'large' | 'elite' | 'boss';
export type PowerUpType = 'doubleFire' | 'shield' | 'speed' | 'heal';
export type MovePattern = 'fall' | 'sway' | 'horizontal' | 'circle' | 'zigzag';

export interface Entity {
  x: number; y: number; w: number; h: number;
  cx: number; cy: number;
}

export interface Bullet extends Entity {
  vx: number; vy: number;
  isPlayer: boolean;
}

export interface Enemy extends Entity {
  hp: number; maxHp: number;
  type: EnemyType;
  score: number;
  speed: number;
  shootTimer: number;
  shootInterval: number;
  movePattern: MovePattern;
  movePhase: number;
  moveAmp: number;
  startX: number;
  startY: number;
  dirX: number;
  entryTimer: number;
  // Boss-specific
  orbitAngle?: number;
  bossLevel?: number;
  moveDirX?: number;
  moveDirY?: number;
  moveChangeTimer?: number;
  phase?: number;
  volleyToggle?: number;
  burstCounter?: number;
  // 盘旋敌机滞留计时（帧）
  orbitTime?: number;
}

export interface PowerUp extends Entity {
  type: PowerUpType;
  vy: number;
  sparkTimer: number;
}

export interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  color: string; radius: number;
}

export interface Star {
  x: number; y: number; speed: number; radius: number;
  alpha: number; twinklePhase: number; twinkleSpeed: number;
}

export interface Nebula {
  x: number; y: number; r: number;
  color: string; alpha: number;
  vx: number; vy: number;
}

export interface ScorePopup {
  x: number; y: number; text: string;
  life: number; maxLife: number;
  color: string; fontSize: number;
}

export interface Meteor {
  x: number; y: number; vx: number; vy: number;
  length: number; alpha: number; radius: number;
  life: number; maxLife: number;
}

export interface Planet {
  x: number; y: number; r: number;
  ring: boolean;
  body: string;
  ringColor: string;
  vx: number; vy: number;
}

export interface Player {
  x: number; y: number; w: number; h: number;
  speed: number; lives: number; invincible: number;
}

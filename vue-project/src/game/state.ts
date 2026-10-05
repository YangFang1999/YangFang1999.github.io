// 全局可变游戏状态（单例，同一时刻只运行一局）。
import { BOMB, DIFFICULTY, LIFE, PLAYER } from './config';
import type {
  Bullet, Enemy, GameState, Meteor, Nebula, Particle, Planet, Player, PowerUp, ScorePopup, Star,
} from './types';

export interface GameVars {
  // 画布
  canvasW: number;
  canvasH: number;
  dpr: number;

  gameState: GameState;
  score: number;
  highScore: number;

  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  particles: Particle[];
  scorePopups: ScorePopup[];

  // 背景
  starsFar: Star[];
  starsMid: Star[];
  starsNear: Star[];
  nebulas: Nebula[];
  meteors: Meteor[];
  planets: Planet[];

  // 计时器（帧单位，dt 递减）
  enemySpawnTimer: number;
  spawnCounter: number;
  playerShootTimer: number;
  doubleFireTimer: number;
  doubleFireLevel: number;   // 1=三连发 2=五连发（吃两个双倍火力叠加）
  shieldTimer: number;
  speedTimer: number;
  shakeTimer: number;
  titleBlink: number;

  // 动画时间轴（帧单位累加的浮点数）
  frameCount: number;

  // UI 开关（由引擎与 Vue 同步）
  cheatInvincible: boolean;
  bombCount: number;

  // 输入
  keys: Set<string>;
  pointerActive: boolean;
  pointerX: number;
  pointerY: number;
  pointerLastFrame: number;

  // 局内进度
  permKills: number;
  nextLifeScore: number;
  bulletDamage: number;

  // 连杀
  comboCount: number;
  comboTimer: number;
  maxCombo: number;
  comboDisplayTimer: number;

  // Boss
  bossSpawned: boolean;
  currentBossLevel: number;

  // 调试
  fps: number;
}

export const G: GameVars = {
  canvasW: 400,
  canvasH: 600,
  dpr: 1,

  gameState: 'menu',
  score: 0,
  highScore: parseInt(localStorage.getItem('airplane-highscore') || '0', 10),

  player: { x: 200, y: 520, w: 30, h: 36, speed: 3, lives: 2, invincible: 0 },
  bullets: [],
  enemies: [],
  powerUps: [],
  particles: [],
  scorePopups: [],

  starsFar: [],
  starsMid: [],
  starsNear: [],
  nebulas: [],
  meteors: [],
  planets: [],

  enemySpawnTimer: 0,
  spawnCounter: 0,
  playerShootTimer: 0,
  doubleFireTimer: 0,
  doubleFireLevel: 1,
  shieldTimer: 0,
  speedTimer: 0,
  shakeTimer: 0,
  titleBlink: 0,

  frameCount: 0,

  cheatInvincible: false,
  bombCount: 3,

  keys: new Set<string>(),
  pointerActive: false,
  pointerX: 0,
  pointerY: 0,
  pointerLastFrame: -999,

  permKills: 0,
  nextLifeScore: 1000,
  bulletDamage: 1,

  comboCount: 0,
  comboTimer: 0,
  maxCombo: 0,
  comboDisplayTimer: 0,

  bossSpawned: false,
  currentBossLevel: 0,

  fps: 60,
};

export function getDifficulty(): number {
  const { base, perScore, max } = DIFFICULTY;
  return Math.min(max, base + G.score * perScore);
}

export function resetGame() {
  G.player = {
    x: G.canvasW / 2 - PLAYER.w / 2,
    y: G.canvasH - 80,
    w: PLAYER.w,
    h: PLAYER.h,
    speed: PLAYER.speed,
    lives: PLAYER.lives,
    invincible: 0,
  };
  G.bullets = [];
  G.enemies = [];
  G.powerUps = [];
  G.particles = [];
  G.scorePopups = [];
  G.meteors = [];
  G.score = 0;
  G.enemySpawnTimer = 0;
  G.spawnCounter = 0;
  G.playerShootTimer = 0;
  G.doubleFireTimer = 0;
  G.doubleFireLevel = 1;
  G.shieldTimer = 0;
  G.speedTimer = 0;
  G.shakeTimer = 0;
  G.bombCount = BOMB.start;
  G.pointerActive = false;
  G.pointerLastFrame = -999;
  G.permKills = 0;
  G.nextLifeScore = LIFE.perScore;
  G.bulletDamage = 1;
  G.comboCount = 0;
  G.comboTimer = 0;
  G.maxCombo = 0;
  G.comboDisplayTimer = 0;
  G.bossSpawned = false;
  G.currentBossLevel = 0;
}

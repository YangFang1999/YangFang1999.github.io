<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';

const router = useRouter();
const canvasRef = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let animFrameId = 0;

let CANVAS_W = 400;
let CANVAS_H = 600;

type GameState = 'menu' | 'playing' | 'paused' | 'gameover';
type EnemyType = 'small' | 'medium' | 'large' | 'elite' | 'boss';
type PowerUpType = 'doubleFire' | 'shield' | 'speed' | 'heal';

interface Entity {
  x: number; y: number; w: number; h: number;
  cx: number; cy: number;
}

interface Bullet extends Entity {
  vx: number; vy: number;
  isPlayer: boolean;
}

type MovePattern = 'fall' | 'sway' | 'horizontal' | 'circle' | 'zigzag';

interface Enemy extends Entity {
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
}

interface PowerUp extends Entity {
  type: PowerUpType;
  vy: number;
  sparkTimer: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  color: string; radius: number;
}

interface Star {
  x: number; y: number; speed: number; radius: number;
  alpha: number; twinklePhase: number; twinkleSpeed: number;
}

interface Nebula {
  x: number; y: number; r: number;
  color: string; alpha: number;
  vx: number; vy: number;
}

interface ScorePopup {
  x: number; y: number; text: string;
  life: number; maxLife: number;
  color: string; fontSize: number;
}

interface Meteor {
  x: number; y: number; vx: number; vy: number;
  length: number; alpha: number; radius: number;
  life: number; maxLife: number;
}

interface Planet {
  x: number; y: number; r: number;
  ring: boolean;
  body: string;
  ringColor: string;
  vx: number; vy: number;
}

let player: { x: number; y: number; w: number; h: number; speed: number; lives: number; invincible: number };
let bullets: Bullet[] = [];
let enemies: Enemy[] = [];
let powerUps: PowerUp[] = [];
let particles: Particle[] = [];
let scorePopups: ScorePopup[] = [];

// Background layers
let starsFar: Star[] = [];
let starsMid: Star[] = [];
let starsNear: Star[] = [];
let nebulas: Nebula[] = [];
let meteors: Meteor[] = [];
let planets: Planet[] = [];

let gameState: GameState = 'menu';
let score = 0;
let highScore = parseInt(localStorage.getItem('airplane-highscore') || '0', 10);
let enemySpawnTimer = 0;
let playerShootTimer = 0;
let doubleFireTimer = 0;
let shieldTimer = 0;
let speedTimer = 0;
let frameCount = 0;
let shakeTimer = 0;
let titleBlink = 0;
const cheatInvincible = ref(false);
const bombCount = ref(3);

const keys = new Set<string>();

// Pointer (mouse / touch) control
let pointerActive = false;
let pointerX = 0;
let pointerY = 0;
let pointerLastFrame = -999;

let permKills = 0;
let nextLifeScore = 1000;
let bulletDamage = 1;

// Combo system
let comboCount = 0;
let comboTimer = 0;
let maxCombo = 0;
let comboDisplayTimer = 0;

// Boss system (kill-milestone based)
let bossSpawned = false;
let currentBossLevel = 0;
const BOSS_KILL_MILESTONES = [30, 80, 150, 250, 380, 550, 780, 1080];

function resetGame() {
  player = { x: CANVAS_W / 2 - 15, y: CANVAS_H - 80, w: 30, h: 36, speed: 3, lives: 2, invincible: 0 };
  bullets = [];
  enemies = [];
  powerUps = [];
  particles = [];
  scorePopups = [];
  meteors = [];
  score = 0;
  enemySpawnTimer = 0;
  playerShootTimer = 0;
  doubleFireTimer = 0;
  shieldTimer = 0;
  speedTimer = 0;
  frameCount = 0;
  shakeTimer = 0;
  bombCount.value = 3;
  pointerActive = false;
  pointerLastFrame = -999;
  permKills = 0;
  nextLifeScore = 1000;
  bulletDamage = 1;
  comboCount = 0;
  comboTimer = 0;
  maxCombo = 0;
  comboDisplayTimer = 0;
  bossSpawned = false;
  currentBossLevel = 0;
}

function getDifficulty(): number {
  return Math.min(2.0, 0.6 + score / 800);
}

function initStars() {
  starsFar = [];
  starsMid = [];
  starsNear = [];
  nebulas = [];

  for (let i = 0; i < 80; i++) {
    starsFar.push({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      speed: 0.15 + Math.random() * 0.3,
      radius: 0.4 + Math.random() * 0.6,
      alpha: 0.2 + Math.random() * 0.35,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.01 + Math.random() * 0.03,
    });
  }

  for (let i = 0; i < 50; i++) {
    starsMid.push({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      speed: 0.4 + Math.random() * 0.8,
      radius: 0.7 + Math.random() * 1.0,
      alpha: 0.4 + Math.random() * 0.4,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.05,
    });
  }

  for (let i = 0; i < 30; i++) {
    starsNear.push({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      speed: 1.0 + Math.random() * 2.0,
      radius: 1.0 + Math.random() * 2.0,
      alpha: 0.55 + Math.random() * 0.45,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.03 + Math.random() * 0.07,
    });
  }

  const nebulaColors = [
    { color: 'rgba(96, 40, 160', alpha: 0.12 },
    { color: 'rgba(40, 70, 190', alpha: 0.10 },
    { color: 'rgba(160, 40, 110', alpha: 0.09 },
    { color: 'rgba(30, 110, 150', alpha: 0.10 },
    { color: 'rgba(70, 30, 130', alpha: 0.11 },
    { color: 'rgba(180, 60, 60', alpha: 0.07 },
  ];
  for (let i = 0; i < nebulaColors.length; i++) {
    nebulas.push({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      r: 70 + Math.random() * 130,
      color: nebulaColors[i].color,
      alpha: nebulaColors[i].alpha,
      vx: 0.02 + Math.random() * 0.04,
      vy: 0.03 + Math.random() * 0.06,
    });
  }

  // Distant planets
  planets = [
    { x: CANVAS_W * 0.78, y: CANVAS_H * 0.16, r: 46, ring: true, body: 'rgba(150, 175, 235, 0.16)', ringColor: 'rgba(180, 200, 255, 0.20)', vx: -0.02, vy: 0.04 },
    { x: CANVAS_W * 0.14, y: CANVAS_H * 0.58, r: 20, ring: false, body: 'rgba(220, 155, 125, 0.12)', ringColor: '', vx: -0.05, vy: 0.03 },
    { x: CANVAS_W * 0.5, y: CANVAS_H * 0.32, r: 12, ring: false, body: 'rgba(120, 200, 180, 0.10)', ringColor: '', vx: -0.03, vy: 0.06 },
  ];
}

function spawnMeteor() {
  meteors.push({
    x: Math.random() * CANVAS_W,
    y: -10,
    vx: (Math.random() - 0.5) * 3,
    vy: 3 + Math.random() * 5,
    length: 20 + Math.random() * 40,
    alpha: 0.6 + Math.random() * 0.4,
    radius: 1 + Math.random() * 1.5,
    life: 60 + Math.random() * 60,
    maxLife: 120,
  });
}

let meteorSpawnTimer = 0;

function getNextBossKillThreshold(): number {
  if (currentBossLevel < BOSS_KILL_MILESTONES.length) {
    return BOSS_KILL_MILESTONES[currentBossLevel];
  }
  // Beyond defined milestones: every 250 kills
  const last = BOSS_KILL_MILESTONES[BOSS_KILL_MILESTONES.length - 1];
  const extra = currentBossLevel - BOSS_KILL_MILESTONES.length + 1;
  return last + extra * 250;
}

function spawnBoss() {
  const level = currentBossLevel + 1;
  currentBossLevel = level;
  bossSpawned = true;

  const w = 100, h = 70;
  const x = CANVAS_W / 2 - w / 2;
  const y = -h - 10;

  const enemy: Enemy = {
    x, y, w, h,
    cx: x + w / 2, cy: y + h / 2,
    hp: 50 + level * 30,
    maxHp: 50 + level * 30,
    type: 'boss',
    score: 3000 + level * 1000,
    speed: 0.4 + level * 0.1,
    shootTimer: 0,
    shootInterval: Math.max(30, 70 - level * 5),
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
  };

  enemies.push(enemy);
}

function spawnEnemy(type: EnemyType) {
  const diff = getDifficulty();
  let w: number, h: number, hp: number, speed: number, scoreVal: number;
  const shootInterval = type === 'medium' ? Math.max(90, 160 - diff * 20) : (type === 'large' ? Math.max(70, 120 - diff * 15) : (type === 'elite' ? Math.max(60, 100 - diff * 10) : 0));

  switch (type) {
    case 'small': w = 26; h = 26; hp = 1; speed = (1.2 + Math.random() * 1.2) * diff; scoreVal = 100; break;
    case 'medium': w = 36; h = 36; hp = 3; speed = (0.6 + Math.random() * 0.8) * diff; scoreVal = 300; break;
    case 'large': w = 50; h = 50; hp = 5; speed = (0.3 + Math.random() * 0.4) * diff; scoreVal = 500; break;
    case 'elite': w = 76; h = 54; hp = 10; speed = 0.45 * diff; scoreVal = 1000; break;
    default: w = 26; h = 26; hp = 1; speed = 1.2 * diff; scoreVal = 100;
  }

  let movePattern: MovePattern;
  if (type === 'elite') {
    const r = Math.random();
    if (r < 0.5) movePattern = 'sway';
    else if (r < 0.8) movePattern = 'horizontal';
    else movePattern = 'zigzag';
  } else if (type === 'small') {
    const r = Math.random();
    if (r < 0.35) movePattern = 'fall';
    else if (r < 0.6) movePattern = 'horizontal';
    else if (r < 0.85) movePattern = 'zigzag';
    else movePattern = 'circle';
  } else {
    const r = Math.random();
    if (r < 0.3) movePattern = 'sway';
    else if (r < 0.55) movePattern = 'horizontal';
    else if (r < 0.8) movePattern = 'zigzag';
    else movePattern = 'circle';
  }

  const x = Math.random() * (CANVAS_W - w);
  const startX = x;
  const startY: number = movePattern === 'circle' ? 100 + Math.random() * 250 : -h;

  const enemy: Enemy = {
    x, y: startY, w, h,
    cx: x + w / 2, cy: startY + h / 2,
    hp, maxHp: hp,
    type, score: scoreVal, speed,
    shootTimer: (type === 'large' || type === 'medium' || type === 'elite') ? Math.random() * shootInterval : 0,
    shootInterval,
    movePattern,
    movePhase: Math.random() * Math.PI * 2,
    moveAmp: movePattern === 'zigzag' ? 30 + Math.random() * 40 : (movePattern === 'circle' ? 40 + Math.random() * 40 : (type === 'large' ? 60 : (type === 'medium' ? 30 : (type === 'elite' ? 55 : 0)))),
    startX,
    startY,
    dirX: Math.random() > 0.5 ? 1 : -1,
    entryTimer: 15,
  };

  enemies.push(enemy);
}

function spawnPowerUp(x: number, y: number) {
  if (Math.random() > 0.08) return;
  const types: PowerUpType[] = ['doubleFire', 'shield', 'speed', 'heal'];
  const type = types[Math.floor(Math.random() * types.length)];
  powerUps.push({
    x: x - 10, y, w: 20, h: 20,
    cx: x, cy: y + 10,
    type,
    vy: 1.5,
    sparkTimer: 0,
  });
}

function spawnExplosion(x: number, y: number, count: number, color: string, large = false) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.4;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 20 + Math.random() * 18,
      maxLife: 38,
      color,
      radius: 1.5 + Math.random() * 3,
    });
  }

  for (let i = 0; i < Math.floor(count * 0.6); i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 1.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 10 + Math.random() * 12,
      maxLife: 22,
      color: '#ffffff',
      radius: 2 + Math.random() * 4,
    });
  }

  if (large) {
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 / 20) * i;
      particles.push({
        x, y,
        vx: Math.cos(angle) * 5,
        vy: Math.sin(angle) * 5,
        life: 12,
        maxLife: 12,
        color: color,
        radius: 2,
      });
    }
  }
}

function spawnScorePopup(x: number, y: number, text: string, color: string, fontSize = 13) {
  scorePopups.push({
    x, y,
    text,
    life: 40,
    maxLife: 40,
    color,
    fontSize,
  });
}

function aabb(a: Entity, b: Entity): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ============ Drawing Functions ============

function drawPlanets() {
  if (!ctx) return;
  for (const p of planets) {
    if (p.ring) {
      ctx.strokeStyle = p.ringColor;
      ctx.lineWidth = Math.max(2, p.r * 0.16);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r * 1.45, p.r * 0.38, -0.35, 0, Math.PI * 2);
      ctx.stroke();
    }
    const g = ctx.createRadialGradient(p.x - p.r * 0.35, p.y - p.r * 0.35, p.r * 0.1, p.x, p.y, p.r);
    g.addColorStop(0, p.body);
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBackground() {
  if (!ctx) return;

  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, '#020210');
  grad.addColorStop(0.3, '#080825');
  grad.addColorStop(0.6, '#0c0c30');
  grad.addColorStop(0.85, '#0a0a22');
  grad.addColorStop(1, '#040418');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  for (const n of nebulas) {
    const ng = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
    ng.addColorStop(0, `${n.color}, ${n.alpha * 1.2})`);
    ng.addColorStop(0.4, `${n.color}, ${n.alpha * 0.7})`);
    ng.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = ng;
    ctx.fillRect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
  }

  drawPlanets();

  for (const s of starsFar) {
    const twinkle = s.alpha * (0.7 + 0.3 * Math.sin(frameCount * s.twinkleSpeed + s.twinklePhase));
    ctx.fillStyle = `rgba(180, 190, 255, ${twinkle})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const s of starsMid) {
    const twinkle = s.alpha * (0.65 + 0.35 * Math.sin(frameCount * s.twinkleSpeed + s.twinklePhase));
    ctx.fillStyle = `rgba(200, 210, 255, ${twinkle})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();

    if (s.alpha > 0.7 && Math.sin(frameCount * s.twinkleSpeed * 2 + s.twinklePhase) > 0.7) {
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

  for (const s of starsNear) {
    const twinkle = s.alpha * (0.6 + 0.4 * Math.sin(frameCount * s.twinkleSpeed + s.twinklePhase));
    ctx.fillStyle = `rgba(220, 230, 255, ${twinkle})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();

    if (s.radius > 1.2) {
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 3);
      glow.addColorStop(0, `rgba(180, 200, 255, ${twinkle * 0.4})`);
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawMeteors() {
  if (!ctx) return;
  for (const m of meteors) {
    const alpha = m.alpha * (m.life / m.maxLife);
    const endX = m.x - m.vx * m.length * 0.3;
    const endY = m.y - m.vy * m.length * 0.3;

    const trailGrad = ctx.createLinearGradient(endX, endY, m.x, m.y);
    trailGrad.addColorStop(0, `rgba(255, 255, 255, 0)`);
    trailGrad.addColorStop(0.6, `rgba(255, 255, 255, ${alpha * 0.3})`);
    trailGrad.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);
    ctx.strokeStyle = trailGrad;
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

function drawPlayer() {
  if (!ctx) return;
  if (player.invincible > 0 && Math.floor(player.invincible / 4) % 2 === 0) return;

  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;
  ctx.save();
  ctx.translate(cx, cy);

  const engineGlow = ctx.createRadialGradient(0, 14, 2, 0, 16, 10);
  engineGlow.addColorStop(0, 'rgba(255, 150, 50, 0.7)');
  engineGlow.addColorStop(1, 'rgba(255, 50, 20, 0)');
  ctx.fillStyle = engineGlow;
  ctx.beginPath();
  ctx.arc(0, 14, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4488ff';
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(-10, 14);
  ctx.lineTo(-6, 10);
  ctx.lineTo(6, 10);
  ctx.lineTo(10, 14);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#66aaff';
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(-3, 6);
  ctx.lineTo(3, 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#5588bb';
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(-16, 8);
  ctx.lineTo(-7, 8);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(7, 0);
  ctx.lineTo(16, 8);
  ctx.lineTo(7, 8);
  ctx.closePath();
  ctx.fill();

  const cockpitGrad = ctx.createRadialGradient(0, -5, 1, 0, -4, 5);
  cockpitGrad.addColorStop(0, '#ffffff');
  cockpitGrad.addColorStop(0.5, '#aaddff');
  cockpitGrad.addColorStop(1, '#4488cc');
  ctx.fillStyle = cockpitGrad;
  ctx.beginPath();
  ctx.arc(0, -4, 5, 0, Math.PI * 2);
  ctx.fill();

  const flicker = Math.random() * 5 + 2;
  const exhaustGrad = ctx.createLinearGradient(0, 12, 0, 14 + flicker);
  exhaustGrad.addColorStop(0, '#ff4400');
  exhaustGrad.addColorStop(0.5, '#ff8833');
  exhaustGrad.addColorStop(1, '#ffcc66');
  ctx.fillStyle = exhaustGrad;
  ctx.beginPath();
  ctx.moveTo(-5, 12);
  ctx.lineTo(0, 14 + flicker);
  ctx.lineTo(5, 12);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffaa';
  ctx.beginPath();
  ctx.moveTo(-2, 13);
  ctx.lineTo(0, 13 + flicker * 0.5);
  ctx.lineTo(2, 13);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  if (shieldTimer > 0) {
    const shieldAlpha = 0.5 + Math.sin(frameCount * 0.2) * 0.3;
    ctx.strokeStyle = `rgba(255, 215, 0, ${shieldAlpha})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(255, 255, 150, ${shieldAlpha * 0.5})`;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (cheatInvincible.value) {
    ctx.strokeStyle = `rgba(255, 0, 255, ${0.6 + Math.sin(frameCount * 0.15) * 0.4})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawSmallEnemy(e: Enemy) {
  if (!ctx) return;
  const cx = e.cx, cy = e.cy;
  const entryScale = Math.min(1, 1 - e.entryTimer / 15 + 0.1);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(entryScale, entryScale);

  ctx.fillStyle = '#ff3344';
  ctx.beginPath();
  ctx.moveTo(0, 12);
  ctx.lineTo(-12, -10);
  ctx.lineTo(12, -10);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ff6677';
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(-6, -7);
  ctx.lineTo(6, -7);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ff8899';
  ctx.beginPath();
  ctx.arc(0, -3, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffccdd';
  ctx.beginPath();
  ctx.arc(1, -4, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cc1122';
  ctx.beginPath();
  ctx.moveTo(-10, -4);
  ctx.lineTo(-15, 3);
  ctx.lineTo(-6, 1);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(10, -4);
  ctx.lineTo(15, 3);
  ctx.lineTo(6, 1);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#881122';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.restore();

  if (e.hp < e.maxHp) {
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('×' + e.hp, cx, cy + 14);
  }
}

function drawMediumEnemy(e: Enemy) {
  if (!ctx) return;
  const cx = e.cx, cy = e.cy, r = 16;
  const entryScale = Math.min(1, 1 - e.entryTimer / 15 + 0.1);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(entryScale, entryScale);

  ctx.fillStyle = '#ff7722';
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r, 0);
  ctx.lineTo(0, r);
  ctx.lineTo(-r, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ff9944';
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.lineTo(r * 0.5, 0);
  ctx.lineTo(0, r * 0.5);
  ctx.lineTo(-r * 0.5, 0);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#cc5500';
  ctx.beginPath();
  ctx.moveTo(-8, -8);
  ctx.lineTo(-17, 2);
  ctx.lineTo(-8, 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(8, -8);
  ctx.lineTo(17, 2);
  ctx.lineTo(8, 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  ctx.strokeStyle = '#993300';
  ctx.lineWidth = 1.5;

  if (e.hp < e.maxHp) {
    const barW = e.w - 4;
    const barH = 3;
    const barX = e.x + 2;
    const barY = e.y - 6;
    ctx.fillStyle = '#222';
    ctx.fillRect(barX, barY, barW, barH);
    const hpColor = e.hp > 2 ? '#ffaa00' : '#ff4400';
    ctx.fillStyle = hpColor;
    ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
  }
}

function drawLargeEnemy(e: Enemy) {
  if (!ctx) return;
  const cx = e.cx, cy = e.cy, r = 22;
  const entryScale = Math.min(1, 1 - e.entryTimer / 15 + 0.1);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(entryScale, entryScale);

  ctx.fillStyle = '#8844cc';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (Math.PI / 3) * i;
    const px = r * Math.cos(a), py = r * Math.sin(a);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#6622aa';
  ctx.beginPath();
  ctx.moveTo(-14, -6);
  ctx.lineTo(14, -6);
  ctx.lineTo(6, 6);
  ctx.lineTo(-6, 6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#aa66ee';
  ctx.beginPath();
  ctx.moveTo(-8, -12);
  ctx.lineTo(8, -12);
  ctx.lineTo(4, -6);
  ctx.lineTo(-4, -6);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ff66ff';
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();
  const coreGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, 7);
  coreGrad.addColorStop(0, '#ffffff');
  coreGrad.addColorStop(0.4, '#ffccff');
  coreGrad.addColorStop(1, '#ff66ff');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#440088';
  ctx.fillRect(-19, -2, 6, 4);
  ctx.fillRect(13, -2, 6, 4);

  ctx.restore();

  ctx.strokeStyle = '#330066';
  ctx.lineWidth = 2;

  if (e.hp < e.maxHp) {
    const barW = e.w - 4;
    const barH = 4;
    const barX = e.x + 2;
    const barY = e.y - 8;
    ctx.fillStyle = '#222';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#cc44ff';
    ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
  }
}

function drawEliteEnemy(e: Enemy) {
  if (!ctx) return;
  const cx = e.cx, cy = e.cy;
  const entryScale = Math.min(1, 1 - e.entryTimer / 15 + 0.1);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(entryScale, entryScale);

  // Body
  ctx.fillStyle = '#cc2233';
  ctx.beginPath();
  ctx.moveTo(-33, 22);
  ctx.lineTo(-13, -22);
  ctx.lineTo(13, -22);
  ctx.lineTo(33, 22);
  ctx.closePath();
  ctx.fill();

  // Highlight
  ctx.fillStyle = '#ee4455';
  ctx.beginPath();
  ctx.moveTo(-6, -18);
  ctx.lineTo(6, -18);
  ctx.lineTo(16, 8);
  ctx.lineTo(-16, 8);
  ctx.closePath();
  ctx.fill();

  // Wings
  ctx.fillStyle = '#881122';
  ctx.beginPath();
  ctx.moveTo(-16, 4);
  ctx.lineTo(-35, 14);
  ctx.lineTo(-16, 18);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(16, 4);
  ctx.lineTo(35, 14);
  ctx.lineTo(16, 18);
  ctx.closePath();
  ctx.fill();

  // Core
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(0, -3, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(0, -3, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // HP bar
  if (e.hp < e.maxHp) {
    const barW = e.w;
    const barH = 5;
    const barX = e.x;
    const barY = e.y - 11;
    ctx.fillStyle = '#222';
    ctx.fillRect(barX, barY, barW, barH);
    const hpRatio = e.hp / e.maxHp;
    const hpColor = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#cccc44' : '#cc4444';
    ctx.fillStyle = hpColor;
    ctx.fillRect(barX, barY, barW * hpRatio, barH);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);
  }
}

function drawBoss(e: Enemy) {
  if (!ctx) return;
  const cx = e.cx, cy = e.cy;
  const entryScale = Math.min(1, 1 - e.entryTimer / 30 + 0.1);
  const level = e.bossLevel || 1;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(entryScale, entryScale);

  // Engine aura (large)
  const auraGlow = ctx.createRadialGradient(0, 30, 10, 0, 30, 50);
  auraGlow.addColorStop(0, level >= 5 ? 'rgba(255, 60, 20, 0.5)' : 'rgba(200, 80, 40, 0.4)');
  auraGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = auraGlow;
  ctx.beginPath();
  ctx.arc(0, 30, 50, 0, Math.PI * 2);
  ctx.fill();

  // Main hull - dark angular shape
  const hullColor = level >= 5 ? '#331144' : '#1a2244';
  ctx.fillStyle = hullColor;
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.lineTo(-14, -18);
  ctx.lineTo(-36, -6);
  ctx.lineTo(-40, 14);
  ctx.lineTo(-24, 30);
  ctx.lineTo(0, 22);
  ctx.lineTo(24, 30);
  ctx.lineTo(40, 14);
  ctx.lineTo(36, -6);
  ctx.lineTo(14, -18);
  ctx.closePath();
  ctx.fill();

  // Armor plates
  const armorColor = level >= 5 ? '#442266' : '#223366';
  ctx.fillStyle = armorColor;
  ctx.beginPath();
  ctx.moveTo(-10, -24);
  ctx.lineTo(-24, -4);
  ctx.lineTo(-30, 10);
  ctx.lineTo(-18, 20);
  ctx.lineTo(0, 16);
  ctx.lineTo(18, 20);
  ctx.lineTo(30, 10);
  ctx.lineTo(24, -4);
  ctx.lineTo(10, -24);
  ctx.closePath();
  ctx.fill();

  // Center ridge
  ctx.fillStyle = level >= 5 ? '#553388' : '#334488';
  ctx.beginPath();
  ctx.moveTo(0, -26);
  ctx.lineTo(-6, -10);
  ctx.lineTo(-12, 8);
  ctx.lineTo(0, 14);
  ctx.lineTo(12, 8);
  ctx.lineTo(6, -10);
  ctx.closePath();
  ctx.fill();

  // Wing cannons (left)
  ctx.fillStyle = '#111133';
  ctx.beginPath();
  ctx.moveTo(-36, -6);
  ctx.lineTo(-46, -10);
  ctx.lineTo(-44, 0);
  ctx.lineTo(-34, 4);
  ctx.closePath();
  ctx.fill();

  // Wing cannons (right)
  ctx.beginPath();
  ctx.moveTo(36, -6);
  ctx.lineTo(46, -10);
  ctx.lineTo(44, 0);
  ctx.lineTo(34, 4);
  ctx.closePath();
  ctx.fill();

  // Cannon muzzles
  ctx.fillStyle = '#ff6622';
  ctx.fillRect(-47, -10, 5, 3);
  ctx.fillRect(42, -10, 5, 3);

  // Central eye/core
  const eyeGlow = ctx.createRadialGradient(0, 0, 3, 0, 0, 14);
  const eyeColor = level >= 5 ? 'rgba(255, 40, 40' : 'rgba(255, 80, 60';
  eyeGlow.addColorStop(0, '#ffffff');
  eyeGlow.addColorStop(0.2, `${eyeColor}, 0.9)`);
  eyeGlow.addColorStop(0.6, `${eyeColor}, 0.4)`);
  eyeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = eyeGlow;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();

  // Core pupil
  const pulse = 0.6 + 0.4 * Math.sin(frameCount * 0.1);
  ctx.fillStyle = `rgba(255, 255, ${level >= 5 ? 150 : 200}, ${pulse})`;
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  // Orbital ring indicator
  ctx.strokeStyle = `rgba(255, ${level >= 5 ? 40 : 100}, ${level >= 5 ? 40 : 80}, ${0.3 + 0.15 * Math.sin(frameCount * 0.08)})`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();

  // Boss HP bar (prominent)
  const barW = e.w;
  const barH = 7;
  const barX = e.x;
  const barY = e.y - 18;
  ctx.fillStyle = '#222';
  ctx.fillRect(barX, barY, barW, barH);
  const hpRatio = e.hp / e.maxHp;
  const hpColor = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#cccc44' : '#cc4444';
  ctx.fillStyle = hpColor;
  ctx.fillRect(barX, barY, barW * hpRatio, barH);
  ctx.strokeStyle = '#ff6644';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(barX, barY, barW, barH);

  // Boss name and level
  ctx.fillStyle = '#ff6644';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  const levelTag = level >= 5 ? 'Lv.' + level + ' ★' : 'Lv.' + level;
  ctx.fillText(`BOSS ${levelTag}`, e.cx, barY - 5);
}

function drawEnemy(e: Enemy) {
  switch (e.type) {
    case 'small': drawSmallEnemy(e); break;
    case 'medium': drawMediumEnemy(e); break;
    case 'large': drawLargeEnemy(e); break;
    case 'elite': drawEliteEnemy(e); break;
    case 'boss': drawBoss(e); break;
  }
}

function drawPowerUp(pu: PowerUp) {
  if (!ctx) return;
  const cx = pu.cx, cy = pu.cy, r = pu.w / 2;
  let color: string, icon: string;
  switch (pu.type) {
    case 'doubleFire': color = '#4488ff'; icon = '火'; break;
    case 'shield': color = '#ffaa00'; icon = '盾'; break;
    case 'speed': color = '#44cc44'; icon = '速'; break;
    case 'heal': color = '#ff4444'; icon = '心'; break;
  }

  const sparkAlpha = 0.4 + 0.3 * Math.sin(frameCount * 0.15 + pu.sparkTimer);

  const glowGrad = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.3);
  glowGrad.addColorStop(0, `${color.replace(')', `, ${sparkAlpha * 0.6})`).replace('rgb', 'rgba')}`);
  glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = color;
  ctx.font = 'bold 9px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, cx, cy + 1);
}

function drawHUD() {
  if (!ctx) return;

  const topGrad = ctx.createLinearGradient(0, 0, 0, 70);
  topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, CANVAS_W, 70);

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.font = 'bold 20px "MS Sans Serif", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`${score}`, 11, 29);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${score}`, 10, 28);

  ctx.fillStyle = '#aaaacc';
  ctx.font = 'bold 11px "MS Sans Serif", sans-serif';
  ctx.fillText(`最高 ${highScore}`, 10, 44);

  ctx.fillStyle = '#44ccff';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.fillText(`⚔${bulletDamage} 🔥${Math.floor(permKills / 3)} ⚡${Math.floor(permKills / 5)}`, 10, 60);

  // Boss spawn indicator
  if (!bossSpawned) {
    const nextKills = getNextBossKillThreshold();
    ctx.fillStyle = '#ff6644';
    ctx.font = 'bold 10px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`👾BOSS ${permKills}/${nextKills}`, CANVAS_W - 8, 28);
  } else {
    ctx.fillStyle = '#ff2222';
    ctx.font = 'bold 10px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('⚠ BOSS!', CANVAS_W - 8, 28);
  }

  const diff = getDifficulty();
  ctx.fillStyle = diff > 1.5 ? '#ff6644' : diff > 1.0 ? '#ffaa44' : '#44cc44';
  ctx.font = 'bold 10px monospace';
  ctx.fillText(`Lv.${Math.floor(diff * 10)}`, CANVAS_W - 8, 48);

  ctx.fillStyle = '#ff4466';
  ctx.font = 'bold 15px sans-serif';
  let livesStr = '';
  for (let i = 0; i < player.lives; i++) livesStr += '♥ ';
  ctx.fillText(livesStr.trim(), CANVAS_W - 8, 64);

  ctx.fillStyle = '#ffcc44';
  ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
  ctx.fillText(`💣 x${bombCount.value}`, CANVAS_W - 8, 80);

  if (comboDisplayTimer > 0 && comboCount >= 3) {
    const comboAlpha = Math.min(1, comboDisplayTimer / 20);
    const comboScale = 1 + Math.min(0.5, (comboCount - 3) * 0.05);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.globalAlpha = comboAlpha;
    ctx.translate(CANVAS_W / 2, 55);
    ctx.scale(comboScale, comboScale);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = `bold ${14 + Math.min(comboCount, 15)}px "Microsoft YaHei", sans-serif`;
    ctx.fillText(`${comboCount} COMBO!`, 1, 1);

    const comboColor = comboCount >= 10 ? '#ff4444' : comboCount >= 7 ? '#ffaa44' : comboCount >= 5 ? '#ffdd44' : '#ffffff';
    ctx.fillStyle = comboColor;
    ctx.fillText(`${comboCount} COMBO!`, 0, 0);

    ctx.restore();
  }

  const bottomGrad = ctx.createLinearGradient(0, CANVAS_H - 30, 0, CANVAS_H);
  bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, CANVAS_H - 30, CANVAS_W, 30);

  if (doubleFireTimer > 0) {
    ctx.fillStyle = '#4488ff';
    ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`🔥双倍 ${Math.ceil(doubleFireTimer / 60)}s`, 8, CANVAS_H - 6);
  }
  if (shieldTimer > 0) {
    ctx.fillStyle = '#ffaa00';
    ctx.textAlign = 'center';
    ctx.fillText(`🛡无敌 ${Math.ceil(shieldTimer / 60)}s`, CANVAS_W / 2, CANVAS_H - 6);
  }
  if (speedTimer > 0) {
    ctx.fillStyle = '#44cc44';
    ctx.textAlign = 'right';
    ctx.fillText(`⚡加速 ${Math.ceil(speedTimer / 60)}s`, CANVAS_W - 8, CANVAS_H - 6);
  }

  if (cheatInvincible.value) {
    ctx.fillStyle = '#ff00ff';
    ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ 无敌模式 ★', CANVAS_W / 2, 22);
  }

  if (player.lives <= 1 && player.invincible <= 0 && shieldTimer <= 0 && gameState === 'playing') {
    const warningAlpha = 0.06 + 0.03 * Math.sin(frameCount * 0.1);
    const edgeGrad = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.4, CANVAS_W / 2, CANVAS_H / 2, CANVAS_W * 0.8);
    edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    edgeGrad.addColorStop(1, `rgba(255, 0, 0, ${warningAlpha})`);
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
}

function drawMenu() {
  if (!ctx) return;

  ctx.fillStyle = 'rgba(0,0,0,0.78)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let i = 0; i < CANVAS_H; i += 3) {
    ctx.fillRect(0, i, CANVAS_W, 1);
  }

  titleBlink += 0.05;

  const titleGlow = ctx.createRadialGradient(CANVAS_W / 2, 42, 10, CANVAS_W / 2, 45, 120);
  titleGlow.addColorStop(0, 'rgba(255, 220, 50, 0.2)');
  titleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = titleGlow;
  ctx.fillRect(0, 0, CANVAS_W, 120);

  ctx.fillStyle = '#ffdd44';
  ctx.font = 'bold 30px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('飞 机 大 战', CANVAS_W / 2, 55);

  ctx.fillStyle = '#ffaa44';
  ctx.font = 'bold 10px "Microsoft YaHei", sans-serif';
  ctx.fillText('SPACE SHOOTER', CANVAS_W / 2, 72);

  ctx.fillStyle = '#4488ff';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— 你的战机 ——', CANVAS_W / 2, 98);

  ctx.save();
  ctx.translate(CANVAS_W / 2, 123);
  ctx.fillStyle = '#4488ff';
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(-9, 11);
  ctx.lineTo(-5, 9);
  ctx.lineTo(5, 9);
  ctx.lineTo(9, 11);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5588bb';
  ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-13, 6); ctx.lineTo(-7, 6); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(13, 6); ctx.lineTo(7, 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#aaddff';
  ctx.beginPath(); ctx.arc(0, -3, 4, 0, Math.PI * 2); ctx.fill();
  const fl = Math.random() * 4;
  ctx.fillStyle = '#ff6633';
  ctx.beginPath(); ctx.moveTo(-3, 11); ctx.lineTo(0, 11 + fl); ctx.lineTo(3, 11); ctx.closePath(); ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#cccccc';
  ctx.font = '13px "Microsoft YaHei", sans-serif';
  ctx.fillText('↑↓←→ / WASD / 鼠标 移动 · 自动射击', CANVAS_W / 2, 156);
  ctx.fillText('X 炸弹 · P 暂停 · I 无敌 · 连杀召唤BOSS', CANVAS_W / 2, 176);

  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 196);
  ctx.lineTo(CANVAS_W - 30, 196);
  ctx.stroke();

  ctx.fillStyle = '#ff8844';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— 敌机图鉴 ——', CANVAS_W / 2, 218);

  function drawMiniEnemy(cx: number, cy: number, type: string, label: string, detail: string) {
    ctx!.save();
    ctx!.translate(cx, cy);
    if (type === 'small') {
      ctx!.fillStyle = '#ff3344';
      ctx!.beginPath(); ctx!.moveTo(0, 10); ctx!.lineTo(-9, -7); ctx!.lineTo(9, -7); ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#ff8899'; ctx!.beginPath(); ctx!.arc(0, -2, 3, 0, Math.PI * 2); ctx!.fill();
      ctx!.strokeStyle = '#881122'; ctx!.lineWidth = 1; ctx!.stroke();
    } else if (type === 'medium') {
      const r = 12;
      ctx!.fillStyle = '#ff7722';
      ctx!.beginPath(); ctx!.moveTo(0, -r); ctx!.lineTo(r, 0); ctx!.lineTo(0, r); ctx!.lineTo(-r, 0); ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#fff'; ctx!.beginPath(); ctx!.arc(0, 0, 4, 0, Math.PI * 2); ctx!.fill();
      ctx!.fillStyle = '#f00'; ctx!.beginPath(); ctx!.arc(0, 0, 2, 0, Math.PI * 2); ctx!.fill();
      ctx!.strokeStyle = '#993300'; ctx!.lineWidth = 1; ctx!.stroke();
    } else if (type === 'large') {
      const r = 14;
      ctx!.fillStyle = '#8844cc';
      ctx!.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 6 + (Math.PI / 3) * i;
        const px = r * Math.cos(a), py = r * Math.sin(a);
        i === 0 ? ctx!.moveTo(px, py) : ctx!.lineTo(px, py);
      }
      ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#ff66ff'; ctx!.beginPath(); ctx!.arc(0, 0, 5, 0, Math.PI * 2); ctx!.fill();
      ctx!.strokeStyle = '#330066'; ctx!.lineWidth = 1.5; ctx!.stroke();
    } else if (type === 'elite') {
      ctx!.fillStyle = '#cc2233';
      ctx!.beginPath(); ctx!.moveTo(-18, 12); ctx!.lineTo(-8, -10); ctx!.lineTo(8, -10); ctx!.lineTo(18, 12); ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#881122';
      ctx!.beginPath(); ctx!.moveTo(-10, 2); ctx!.lineTo(-20, 8); ctx!.lineTo(-10, 10); ctx!.closePath(); ctx!.fill();
      ctx!.beginPath(); ctx!.moveTo(10, 2); ctx!.lineTo(20, 8); ctx!.lineTo(10, 10); ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#f44'; ctx!.beginPath(); ctx!.arc(0, -2, 5, 0, Math.PI * 2); ctx!.fill();
      ctx!.fillStyle = '#ff0'; ctx!.beginPath(); ctx!.arc(0, -2, 2, 0, Math.PI * 2); ctx!.fill();
      ctx!.strokeStyle = '#600'; ctx!.lineWidth = 1.5; ctx!.stroke();
    } else if (type === 'boss') {
      ctx!.fillStyle = '#1a2244';
      ctx!.beginPath(); ctx!.moveTo(0, -16); ctx!.lineTo(-7, -9); ctx!.lineTo(-18, -3); ctx!.lineTo(-20, 7); ctx!.lineTo(-12, 14); ctx!.lineTo(0, 11); ctx!.lineTo(12, 14); ctx!.lineTo(20, 7); ctx!.lineTo(18, -3); ctx!.lineTo(7, -9); ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#334488';
      ctx!.beginPath(); ctx!.moveTo(0, -13); ctx!.lineTo(-5, -5); ctx!.lineTo(-9, 4); ctx!.lineTo(0, 7); ctx!.lineTo(9, 4); ctx!.lineTo(5, -5); ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#f00'; ctx!.beginPath(); ctx!.arc(0, 0, 5, 0, Math.PI * 2); ctx!.fill();
      ctx!.fillStyle = '#ff0'; ctx!.beginPath(); ctx!.arc(0, 0, 2, 0, Math.PI * 2); ctx!.fill();
      ctx!.strokeStyle = '#4466aa'; ctx!.lineWidth = 1; ctx!.stroke();
    }
    ctx!.restore();

    ctx!.fillStyle = '#ffffff';
    ctx!.font = 'bold 12px "Microsoft YaHei", sans-serif';
    ctx!.textAlign = 'center';
    ctx!.fillText(label, cx, cy + 24);
    ctx!.fillStyle = '#999999';
    ctx!.font = '11px "Microsoft YaHei", sans-serif';
    ctx!.fillText(detail, cx, cy + 39);
  }

  const yBase = 228;
  drawMiniEnemy(55, yBase, 'small', '侦察机', '1HP·100分');
  drawMiniEnemy(145, yBase, 'medium', '战斗机', '3HP·追踪弹');
  drawMiniEnemy(245, yBase, 'large', '重装机', '5HP·扇形弹');
  drawMiniEnemy(345, yBase, 'elite', '精英机', '10HP·1000分');

  ctx.strokeStyle = '#444';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, 295);
  ctx.lineTo(CANVAS_W - 30, 295);
  ctx.stroke();

  ctx.fillStyle = '#44cc44';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— BOSS 系统 ——', CANVAS_W / 2, 318);

  ctx.fillStyle = '#ff6644';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.fillText('击杀数达标后 BOSS 降临 · 击败前不会离开', CANVAS_W / 2, 336);

  ctx.fillStyle = '#ff8844';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.fillText('轨道弹幕 · 等级越高越强 · 同一时刻仅一只', CANVAS_W / 2, 352);

  // High score + start prompt
  ctx.fillStyle = '#aaaacc';
  ctx.font = '13px "Microsoft YaHei", sans-serif';
  ctx.fillText(`最高分: ${highScore}  |  连杀纪录: ${maxCombo}`, CANVAS_W / 2, 390);

  if (Math.sin(titleBlink) > 0) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.fillText('按 Enter 开始游戏', CANVAS_W / 2, 435);
  }
}

function drawPause() {
  if (!ctx) return;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let i = 0; i < CANVAS_H; i += 3) {
    ctx.fillRect(0, i, CANVAS_W, 1);
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('已 暂 停', CANVAS_W / 2, CANVAS_H / 2 - 10);
  ctx.font = '14px "Microsoft YaHei", sans-serif';
  ctx.fillText('按 P 继续', CANVAS_W / 2, CANVAS_H / 2 + 30);
}

function drawGameOver() {
  if (!ctx) return;
  ctx.fillStyle = 'rgba(0,0,0,0.78)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  titleBlink += 0.05;

  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 28px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('游 戏 结 束', CANVAS_W / 2, 200);

  ctx.fillStyle = '#ffffff';
  ctx.font = '24px monospace';
  ctx.fillText(`得分: ${score}`, CANVAS_W / 2, 255);

  if (score > highScore) {
    const glowAlpha = 0.6 + 0.3 * Math.sin(titleBlink);
    ctx.fillStyle = `rgba(255, 220, 50, ${glowAlpha})`;
    ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.fillText('🏆 新最高分！', CANVAS_W / 2, 290);
  }

  ctx.fillStyle = '#cccccc';
  ctx.font = '13px "Microsoft YaHei", sans-serif';
  ctx.fillText(`最大连杀: ${maxCombo}  |  伤害等级: ${bulletDamage}  |  BOSS: Lv.${currentBossLevel}`, CANVAS_W / 2, 325);

  if (Math.sin(titleBlink) > 0) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.fillText('按 Enter 重新开始', CANVAS_W / 2, 385);
  }
}

// ============ Game Loop ============

function update() {
  if (!ctx) return;

  updateBackground();

  if (gameState !== 'playing') return;

  frameCount++;

  if (shakeTimer > 0) shakeTimer--;

  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer <= 0) comboCount = 0;
  }
  if (comboDisplayTimer > 0) comboDisplayTimer--;

  // Input: player movement
  const permSpeedBonus = Math.min(2.5, Math.floor(permKills / 5) * 0.4);
  const spd = (player.speed + permSpeedBonus) * (speedTimer > 0 ? 1.6 : 1);
  const usingPointer = pointerActive && (frameCount - pointerLastFrame) < 60;
  if (usingPointer) {
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h / 2;
    // 目标点在指针上方偏移，避免手指/鼠标遮挡战机
    const dx = pointerX - cx;
    const dy = (pointerY - 50) - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 3) {
      const step = Math.min(dist, spd * 1.6);
      player.x += (dx / dist) * step;
      player.y += (dy / dist) * step;
    }
  } else {
    if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) player.x -= spd;
    if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) player.x += spd;
    if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) player.y -= spd;
    if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) player.y += spd;
  }
  player.x = Math.max(0, Math.min(CANVAS_W - player.w, player.x));
  player.y = Math.max(0, Math.min(CANVAS_H - player.h, player.y));

  if (player.invincible > 0) player.invincible--;

  if (doubleFireTimer > 0) doubleFireTimer--;
  if (shieldTimer > 0) shieldTimer--;
  if (speedTimer > 0) speedTimer--;

  // Auto-shoot
  playerShootTimer++;
  const baseCd = Math.max(10, 18 - Math.floor(permKills / 3));
  const shootCd = doubleFireTimer > 0 ? Math.max(6, baseCd - 3) : baseCd;
  if (playerShootTimer >= shootCd) {
    playerShootTimer = 0;
    const bx = player.x + player.w / 2;
    const by = player.y;
    bullets.push({ x: bx - 2, y: by, w: 4, h: 8, cx: bx, cy: by + 4, vx: 0, vy: -8, isPlayer: true });
    if (doubleFireTimer > 0) {
      bullets.push({ x: bx - 12, y: by + 4, w: 4, h: 8, cx: bx - 10, cy: by + 8, vx: -0.6, vy: -7.5, isPlayer: true });
      bullets.push({ x: bx + 8, y: by + 4, w: 4, h: 8, cx: bx + 10, cy: by + 8, vx: 0.6, vy: -7.5, isPlayer: true });
    }
  }

  // Spawn enemies (only when boss is not active)
  enemySpawnTimer++;
  if (!bossSpawned) {
    const diff = getDifficulty();
    const baseRate = 180 - diff * 60;
    const spawnRate = Math.max(45, Math.floor(baseRate));
    if (enemySpawnTimer >= spawnRate) {
      enemySpawnTimer = 0;
      const r = Math.random();
      if (score >= 800 && r < 0.08) spawnEnemy('elite');
      else if (score >= 500 && r < 0.2) spawnEnemy('large');
      else if (score >= 200 && r < 0.38) spawnEnemy('medium');
      else spawnEnemy('small');
    }

    // Boss spawn check (kill-milestone based)
    const threshold = getNextBossKillThreshold();
    if (permKills >= threshold && !bossSpawned) {
      spawnBoss();
    }
  }

  // Update bullets
  for (const b of bullets) {
    b.x += b.vx;
    b.y += b.vy;
    b.cx = b.x + b.w / 2;
    b.cy = b.y + b.h / 2;
  }
  bullets = bullets.filter(b => b.y > -20 && b.y < CANVAS_H + 20 && b.x > -20 && b.x < CANVAS_W + 20);

  // Update enemies
  for (const e of enemies) {
    if (e.entryTimer > 0) e.entryTimer--;

    if (e.type === 'boss') {
      // Boss: roam the map, won't leave
      updateBossMovement(e);
      updateBossAttack(e);
    } else {
      // Regular enemies
      switch (e.movePattern) {
        case 'fall':
          e.y += e.speed;
          break;
        case 'sway':
          e.x = e.startX + Math.sin(e.movePhase + frameCount * 0.03) * e.moveAmp;
          e.y += e.speed;
          break;
        case 'horizontal':
          e.x += e.speed * e.dirX * 0.8;
          e.y += e.speed * 0.15;
          if (e.x < -e.w || e.x > CANVAS_W + e.w) e.dirX *= -1;
          break;
        case 'zigzag':
          e.x += Math.sin(frameCount * 0.06 + e.movePhase) * e.speed * 1.5;
          e.y += e.speed * 0.7;
          if (e.x < 0) e.x = 0;
          if (e.x > CANVAS_W - e.w) e.x = CANVAS_W - e.w;
          break;
        case 'circle':
          e.x = e.startX + Math.cos(e.movePhase + frameCount * 0.02) * e.moveAmp;
          e.y = e.startY + Math.sin(e.movePhase + frameCount * 0.025) * e.moveAmp * 0.6;
          break;
        default:
          e.y += e.speed;
      }
      e.cx = e.x + e.w / 2;
      e.cy = e.y + e.h / 2;

      // Enemy shoot
      if (e.shootInterval > 0 && e.entryTimer <= 0) {
        e.shootTimer++;
        if (e.shootTimer >= e.shootInterval) {
          e.shootTimer = 0;
          if (e.type === 'large' || e.type === 'elite') {
            for (let a = -0.3; a <= 0.3; a += 0.3) {
              bullets.push({ x: e.cx - 3, y: e.cy, w: 6, h: 6, cx: e.cx, cy: e.cy, vx: a * 2.2, vy: 2.5, isPlayer: false });
            }
          } else if (e.type === 'medium') {
            const dx = (player.x + player.w / 2) - e.cx;
            const dy = (player.y + player.h / 2) - e.cy;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            bullets.push({ x: e.cx - 2, y: e.cy, w: 4, h: 4, cx: e.cx, cy: e.cy, vx: (dx / dist) * 2, vy: (dy / dist) * 2, isPlayer: false });
          }
        }
      }
    }
  }

  // Remove off-screen and dead regular enemies (bosses stay)
  enemies = enemies.filter(e => {
    if (e.type === 'boss' && e.hp > 0) return true;
    if (e.hp <= 0) return false;
    if (e.y > CANVAS_H + 80) return false;
    if (e.movePattern === 'horizontal' && (e.x < -80 || e.x > CANVAS_W + 80)) return false;
    return true;
  });

  // Update power-ups
  for (const pu of powerUps) {
    pu.y += pu.vy;
    pu.cy = pu.y + pu.h / 2;
    pu.sparkTimer++;
  }
  powerUps = powerUps.filter(p => p.y < CANVAS_H + 30);

  // Update particles
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.98;
    p.vy *= 0.98;
    p.life--;
  }
  particles = particles.filter(p => p.life > 0);

  // Update score popups
  for (const sp of scorePopups) {
    sp.y -= 1.2;
    sp.life--;
  }
  scorePopups = scorePopups.filter(sp => sp.life > 0);

  // Collision: player bullets vs enemies
  for (const b of bullets) {
    if (!b.isPlayer) continue;
    for (const e of enemies) {
      if (e.entryTimer > 0) continue;
      if (aabb(b, e)) {
        b.y = -999;
        e.hp -= bulletDamage;
        spawnExplosion(b.cx, b.cy, 5, '#ffcc44');

        if (e.hp <= 0) {
          killEnemy(e);
        }
        break;
      }
    }
  }
  bullets = bullets.filter(b => b.y !== -999);

  // Collision: enemy bullets vs player
  if (!cheatInvincible.value && player.invincible <= 0 && shieldTimer <= 0) {
    for (const b of bullets) {
      if (b.isPlayer) continue;
      const playerBox = { x: player.x + 6, y: player.y + 4, w: player.w - 12, h: player.h - 10 };
      if (aabb(b, playerBox as Entity)) {
        b.y = -999;
        player.lives--;
        player.invincible = 90;
        shieldTimer = 0;
        doubleFireTimer = 0;
        speedTimer = 0;
        comboCount = 0;
        comboTimer = 0;
        spawnExplosion(player.x + player.w / 2, player.y + player.h / 2, 14, '#ff6644');
        shakeTimer = 12;
        if (player.lives <= 0) {
          gameState = 'gameover';
          if (score > highScore) {
            highScore = score;
            localStorage.setItem('airplane-highscore', String(highScore));
          }
        }
        break;
      }
    }
    bullets = bullets.filter(b => b.y !== -999);

    if (!cheatInvincible.value && player.invincible <= 0 && shieldTimer <= 0) {
      const pBox = { x: player.x + 6, y: player.y + 4, w: player.w - 12, h: player.h - 10 } as Entity;
      for (const e of enemies) {
        if (e.entryTimer > 0) continue;
        if (aabb(pBox, e)) {
          player.lives--;
          player.invincible = 90;
          shieldTimer = 0;
          doubleFireTimer = 0;
          speedTimer = 0;
          comboCount = 0;
          comboTimer = 0;
          spawnExplosion(player.x + player.w / 2, player.y + player.h / 2, 14, '#ff6644');
          shakeTimer = 12;
          if (player.lives <= 0) {
            gameState = 'gameover';
            if (score > highScore) {
              highScore = score;
              localStorage.setItem('airplane-highscore', String(highScore));
            }
          }
          break;
        }
      }
    }
  }

  // Collision: player vs power-ups
  const pBox = { x: player.x, y: player.y, w: player.w, h: player.h } as Entity;
  for (const pu of powerUps) {
    if (aabb(pBox, pu)) {
      pu.y = -999;
      switch (pu.type) {
        case 'doubleFire':
          doubleFireTimer = 600;
          spawnScorePopup(pu.cx, pu.cy, '双倍火力!', '#4488ff', 12);
          break;
        case 'shield':
          shieldTimer = 480;
          spawnScorePopup(pu.cx, pu.cy, '无敌护盾!', '#ffaa00', 12);
          break;
        case 'speed':
          speedTimer = 600;
          spawnScorePopup(pu.cx, pu.cy, '加速!', '#44cc44', 12);
          break;
        case 'heal':
          player.lives = Math.min(player.lives + 1, 10);
          spawnScorePopup(pu.cx, pu.cy, '+1 ♥', '#ff4444', 14);
          break;
      }
      spawnExplosion(pu.cx, pu.cy, 8, colorForPowerUp(pu.type));
    }
  }
  powerUps = powerUps.filter(p => p.y !== -999);
}

function updateBossMovement(e: Enemy) {
  const level = e.bossLevel || 1;
  const bossSpeed = 0.6 + level * 0.12;

  // Boss roams within map bounds
  if (typeof e.moveDirX === 'undefined') e.moveDirX = 0.6;
  if (typeof e.moveDirY === 'undefined') e.moveDirY = 0.6;
  if (typeof e.moveChangeTimer === 'undefined') e.moveChangeTimer = 80;

  // Smooth sinusoidal drift
  const driftX = Math.sin(frameCount * 0.015 + (e.movePhase || 0)) * bossSpeed * 0.8;
  const driftY = Math.cos(frameCount * 0.012 + (e.movePhase || 0) * 1.3) * bossSpeed * 0.5;

  e.x += e.moveDirX! * bossSpeed + driftX;
  e.y += e.moveDirY! * bossSpeed * 0.4 + driftY;

  // Bounce off edges
  if (e.x < 0) { e.x = 0; e.moveDirX = Math.abs(e.moveDirX!); }
  if (e.x > CANVAS_W - e.w) { e.x = CANVAS_W - e.w; e.moveDirX = -Math.abs(e.moveDirX!); }
  if (e.y < 0) { e.y = 0; e.moveDirY = Math.abs(e.moveDirY!); }
  if (e.y > CANVAS_H * 0.55) { e.y = CANVAS_H * 0.55; e.moveDirY = -Math.abs(e.moveDirY!); }

  // Change direction periodically
  e.moveChangeTimer!--;
  if (e.moveChangeTimer! <= 0) {
    e.moveChangeTimer = 60 + Math.random() * 100;
    e.moveDirX = (Math.random() - 0.5) * 2;
    e.moveDirY = (Math.random() - 0.5) * 2;
  }

  e.cx = e.x + e.w / 2;
  e.cy = e.y + e.h / 2;
}

function updateBossAttack(e: Enemy) {
  if (e.entryTimer > 0) return;

  const level = e.bossLevel || 1;
  const shootInterval = Math.max(25, 65 - level * 5);
  const bulletCount = 6 + Math.floor(level / 2);

  e.shootTimer++;
  if (e.shootTimer >= shootInterval) {
    e.shootTimer = 0;

    // Orbital attack: bullets fire in a circle, rotating
    const orbitBase = (e.orbitAngle || 0);
    for (let i = 0; i < bulletCount; i++) {
      const angle = orbitBase + (Math.PI * 2 / bulletCount) * i;
      const speed = 1.5 + level * 0.2;
      bullets.push({
        x: e.cx - 3, y: e.cy - 3,
        w: 5, h: 5,
        cx: e.cx, cy: e.cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        isPlayer: false,
      });
    }

    // Higher level: second ring with opposite rotation
    if (level >= 3) {
      const innerCount = Math.floor(bulletCount * 0.7);
      for (let i = 0; i < innerCount; i++) {
        const angle = -orbitBase + (Math.PI * 2 / innerCount) * i;
        const speed = 1.0 + level * 0.15;
        bullets.push({
          x: e.cx - 2, y: e.cy - 2,
          w: 4, h: 4,
          cx: e.cx, cy: e.cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          isPlayer: false,
        });
      }
    }

    // Higher level: aimed shots toward player
    if (level >= 4) {
      const dx = (player.x + player.w / 2) - e.cx;
      const dy = (player.y + player.h / 2) - e.cy;
      for (let a = -0.15; a <= 0.15; a += 0.15) {
        const aimAngle = Math.atan2(dy, dx) + a;
        bullets.push({
          x: e.cx - 3, y: e.cy - 3,
          w: 6, h: 6,
          cx: e.cx, cy: e.cy,
          vx: Math.cos(aimAngle) * 2.5,
          vy: Math.sin(aimAngle) * 2.5,
          isPlayer: false,
        });
      }
    }

    // Advance orbit angle for spiral effect
    e.orbitAngle = (e.orbitAngle || 0) + 0.15 + level * 0.02;
  }
}

function colorForPowerUp(type: PowerUpType): string {
  switch (type) {
    case 'doubleFire': return '#4488ff';
    case 'shield': return '#ffaa00';
    case 'speed': return '#44cc44';
    case 'heal': return '#ff4444';
  }
}

function killEnemy(e: Enemy) {
  score += e.score;

  comboCount++;
  comboTimer = 60;
  comboDisplayTimer = 60;
  if (comboCount > maxCombo) maxCombo = comboCount;

  if (comboCount >= 5) {
    const bonus = Math.floor(e.score * (comboCount * 0.1));
    score += bonus;
    const comboMsg = comboCount >= 10 ? 'PERFECT!' : comboCount >= 7 ? 'GREAT!' : 'NICE!';
    spawnScorePopup(e.cx, e.cy - 10, `${comboMsg} +${bonus}`, '#ffdd44', 11);
  }

  permKills++;
  bulletDamage = Math.min(5, 1 + Math.floor(permKills / 10));

  if (score >= nextLifeScore) {
    player.lives = Math.min(player.lives + 1, 10);
    nextLifeScore += 1000;
    spawnScorePopup(player.x + player.w / 2, player.y, '+1 ♥', '#ff4466', 16);
  }

  const isBossLarge = e.type === 'boss';
  spawnExplosion(e.cx, e.cy, isBossLarge ? 30 : 18, e.type === 'boss' ? '#ff6644' : '#ffaa22', isBossLarge);
  spawnScorePopup(e.cx, e.cy, `+${e.score}`, e.type === 'boss' ? '#ff4444' : (e.type === 'elite' ? '#ff8844' : '#ffffff'),
    e.type === 'boss' ? 20 : (e.type === 'elite' ? 15 : 13));

  if (e.type !== 'boss') {
    spawnPowerUp(e.cx, e.cy);
  }

  if (e.type === 'boss') {
    bossSpawned = false;
    shakeTimer = 30;
    // Boss kill bonus: heal + refill a bomb
    player.lives = Math.min(player.lives + 1, 10);
    bombCount.value = Math.min(5, bombCount.value + 1);
    spawnScorePopup(e.cx, e.cy - 20, 'BOSS击败! +1♥ +1💣', '#ff4466', 16);
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        if (gameState === 'playing') {
          spawnExplosion(
            e.cx + (Math.random() - 0.5) * 100,
            e.cy + (Math.random() - 0.5) * 60,
            15, '#ffaa22'
          );
        }
      }, i * 100);
    }
  }
}

function useBomb() {
  if (gameState !== 'playing' || bombCount.value <= 0) return;
  bombCount.value--;

  // 清除所有敌机子弹
  bullets = bullets.filter(b => b.isPlayer);

  // 全屏冲击波特效
  shakeTimer = 25;
  spawnExplosion(CANVAS_W / 2, CANVAS_H / 2, 40, '#ffffff', true);
  spawnScorePopup(CANVAS_W / 2, CANVAS_H / 2 - 20, '💣 全屏冲击!', '#ffffff', 18);

  // 对所有敌人造成大量伤害
  for (const e of [...enemies]) {
    if (e.entryTimer > 0) continue;
    e.hp -= 40;
    spawnExplosion(e.cx, e.cy, 6, '#88ddff');
    if (e.hp <= 0) killEnemy(e);
  }
}

function updateBackground() {
  for (const s of starsFar) {
    s.y += s.speed;
    if (s.y > CANVAS_H + 2) { s.y = -2; s.x = Math.random() * CANVAS_W; }
  }
  for (const s of starsMid) {
    s.y += s.speed;
    if (s.y > CANVAS_H + 2) { s.y = -2; s.x = Math.random() * CANVAS_W; }
  }
  for (const s of starsNear) {
    s.y += s.speed;
    if (s.y > CANVAS_H + 2) { s.y = -2; s.x = Math.random() * CANVAS_W; }
  }

  for (const n of nebulas) {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < -n.r) n.x = CANVAS_W + n.r;
    if (n.x > CANVAS_W + n.r) n.x = -n.r;
    if (n.y < -n.r) n.y = CANVAS_H + n.r;
    if (n.y > CANVAS_H + n.r) n.y = -n.r;
  }

  for (const p of planets) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -p.r * 2) p.x = CANVAS_W + p.r * 2;
    if (p.x > CANVAS_W + p.r * 2) p.x = -p.r * 2;
    if (p.y < -p.r * 2) p.y = CANVAS_H + p.r * 2;
    if (p.y > CANVAS_H + p.r * 2) p.y = -p.r * 2;
  }

  meteorSpawnTimer++;
  if (meteorSpawnTimer > 180 + Math.random() * 300) {
    meteorSpawnTimer = 0;
    spawnMeteor();
  }

  for (const m of meteors) {
    m.x += m.vx;
    m.y += m.vy;
    m.life--;
  }
  meteors = meteors.filter(m => m.life > 0 && m.y < CANVAS_H + 50 && m.y > -50 && m.x > -50 && m.x < CANVAS_W + 50);
}

function render() {
  if (!ctx) return;

  let sx = 0, sy = 0;
  if (shakeTimer > 0) {
    sx = (Math.random() - 0.5) * 7 * (shakeTimer / 30);
    sy = (Math.random() - 0.5) * 7 * (shakeTimer / 30);
  }

  ctx.save();
  ctx.translate(sx, sy);

  drawBackground();

  if (gameState === 'menu') {
    drawMeteors();
    drawMenu();
    ctx.restore();
    return;
  }

  drawMeteors();

  for (const pu of powerUps) drawPowerUp(pu);

  // Enemy bullets
  for (const b of bullets) {
    if (b.isPlayer) continue;
    const glowAlpha = 0.3;
    ctx.fillStyle = `rgba(255, 80, 80, ${glowAlpha})`;
    ctx.beginPath();
    ctx.arc(b.cx, b.cy, b.w > 5 ? 6 : 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(b.cx, b.cy, b.w > 5 ? 4 : 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffaaaa';
    ctx.beginPath();
    ctx.arc(b.cx, b.cy, b.w > 5 ? 2 : 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Enemies (draw boss last so it's on top)
  const bossEnemies = enemies.filter(e => e.type === 'boss');
  const regularEnemies = enemies.filter(e => e.type !== 'boss');
  for (const e of regularEnemies) drawEnemy(e);

  // Player bullets
  for (const b of bullets) {
    if (!b.isPlayer) continue;
    const glowGrad = ctx.createRadialGradient(b.cx, b.cy, 1, b.cx, b.cy, 6);
    glowGrad.addColorStop(0, 'rgba(255, 255, 200, 0.7)');
    glowGrad.addColorStop(0.5, 'rgba(255, 220, 100, 0.3)');
    glowGrad.addColorStop(1, 'rgba(255, 150, 50, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(b.cx, b.cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffdd44';
    ctx.beginPath();
    ctx.arc(b.cx, b.cy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(b.cx, b.cy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Boss (drawn on top for prominence)
  for (const e of bossEnemies) drawEnemy(e);

  if (gameState === 'playing' || gameState === 'paused') {
    drawPlayer();
  }

  // Particles
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    if (p.color.startsWith('#')) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
    } else {
      ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(0.3, p.radius * alpha), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Score popups
  for (const sp of scorePopups) {
    const alpha = sp.life / sp.maxLife;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = sp.color;
    ctx.font = `bold ${sp.fontSize}px "Microsoft YaHei", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(sp.text, sp.x, sp.y);
    ctx.globalAlpha = 1;
  }

  if (gameState === 'playing' || gameState === 'paused') {
    drawHUD();
  }

  ctx.restore();

  if (gameState === 'paused') drawPause();
  if (gameState === 'gameover') drawGameOver();
}

function gameLoop() {
  update();
  render();
  animFrameId = requestAnimationFrame(gameLoop);
}

// ============ Input Handling ============

function handleKeyDown(e: KeyboardEvent) {
  keys.add(e.key);

  if (e.key === 'Enter') {
    if (gameState === 'menu') {
      resetGame();
      gameState = 'playing';
      spawnEnemy('small');
      spawnEnemy('small');
      spawnEnemy('small');
    }
    else if (gameState === 'gameover') { resetGame(); gameState = 'playing'; }
  }
  if (e.key === 'p' || e.key === 'P') {
    if (gameState === 'playing') gameState = 'paused';
    else if (gameState === 'paused') gameState = 'playing';
  }
  if (e.key === 'I' || e.key === 'i') {
    cheatInvincible.value = !cheatInvincible.value;
  }
  if (e.key === 'x' || e.key === 'X' || e.key === 'b' || e.key === 'B') {
    useBomb();
  }
  if (e.key === ' ') {
    e.preventDefault();
  }

  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
}

function handleKeyUp(e: KeyboardEvent) {
  keys.delete(e.key);
}

function handlePointerMove(e: PointerEvent) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = CANVAS_W / rect.width;
  const scaleY = CANVAS_H / rect.height;
  pointerX = (e.clientX - rect.left) * scaleX;
  pointerY = (e.clientY - rect.top) * scaleY;
  pointerLastFrame = frameCount;
  pointerActive = true;
}

// ============ Resize Handling ============

function handleResize() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const availH = Math.min(720, Math.max(450, vh - 140));
  const availW = Math.min(480, Math.max(300, vw * 0.4));

  let w: number, h: number;
  if (availW / availH > 2 / 3) {
    h = availH;
    w = Math.floor(h * (2 / 3));
  } else {
    w = availW;
    h = Math.floor(w * (3 / 2));
  }

  w = Math.floor(Math.max(300, Math.min(480, w)));
  h = Math.floor(Math.max(450, Math.min(720, h)));

  CANVAS_W = w;
  CANVAS_H = h;

  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  initStars();
}

// ============ Lifecycle ============

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  if (!ctx) return;

  handleResize();
  initStars();
  resetGame();

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('resize', handleResize);

  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animFrameId);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <Window
    title="飞机大战"
    icon="fa fa-fighter-jet"
    :isOpen="true"
    :isActive="true"
    :defaultMaximized="true"
    @close="router.push('/')"
  >
    <div class="flex flex-col items-center gap-[4px] w-full min-h-0">
      <canvas
        ref="canvasRef"
        class="shadow-win95-inset outline-none block shrink-0"
        tabindex="0"
        style="image-rendering: auto; max-width: 100%; height: auto; touch-action: none;"
        @pointermove="handlePointerMove"
        @pointerdown="handlePointerMove"
      ></canvas>
      <div class="flex items-center gap-2">
        <button
          @click="useBomb"
          class="text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-sans"
          :style="{ backgroundColor: bombCount > 0 ? '#ffcc88' : '#c0c0c0' }"
        >
          💣 炸弹 (X) x{{ bombCount }}
        </button>
        <button
          @click="cheatInvincible = !cheatInvincible"
          class="text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-sans"
          :style="{ backgroundColor: cheatInvincible ? '#ff88ff' : '#c0c0c0' }"
        >
          {{ cheatInvincible ? '★ 无敌中 (按 I 关闭)' : '无敌模式 (I)' }}
        </button>
      </div>
    </div>
  </Window>
</template>

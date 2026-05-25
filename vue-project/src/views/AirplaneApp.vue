<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';

const router = useRouter();
const canvasRef = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let animFrameId = 0;

const CANVAS_W = 400;
const CANVAS_H = 600;

type GameState = 'menu' | 'playing' | 'paused' | 'gameover';
type EnemyType = 'small' | 'medium' | 'large' | 'boss';
type PowerUpType = 'doubleFire' | 'shield' | 'speed' | 'heal';

interface Entity {
  x: number; y: number; w: number; h: number;
  cx: number; cy: number;
}

interface Bullet extends Entity {
  vx: number; vy: number;
  isPlayer: boolean;
}

type MovePattern = 'fall' | 'sway' | 'horizontal' | 'circle';

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
}

interface PowerUp extends Entity {
  type: PowerUpType;
  vy: number;
}

interface Particle {
  x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number;
  color: string; radius: number;
}

interface Star {
  x: number; y: number; speed: number; radius: number; alpha: number;
}

let player: { x: number; y: number; w: number; h: number; speed: number; lives: number; invincible: number };
let bullets: Bullet[] = [];
let enemies: Enemy[] = [];
let powerUps: PowerUp[] = [];
let particles: Particle[] = [];
let stars: Star[] = [];

let gameState: GameState = 'menu';
let score = 0;
let highScore = parseInt(localStorage.getItem('airplane-highscore') || '0', 10);
let bossTriggerScore = 1000;
let bossActive = false;
let enemySpawnTimer = 0;
let playerShootTimer = 0;
let doubleFireTimer = 0;
let shieldTimer = 0;
let speedTimer = 0;
let frameCount = 0;
let shakeTimer = 0;
let titleBlink = 0;
const cheatInvincible = ref(false);

const keys = new Set<string>();

let permKills = 0;
let nextLifeScore = 1000;
let bulletDamage = 1;

function resetGame() {
  player = { x: CANVAS_W / 2 - 15, y: CANVAS_H - 80, w: 30, h: 36, speed: 3, lives: 2, invincible: 0 };
  bullets = [];
  enemies = [];
  powerUps = [];
  particles = [];
  score = 0;
  bossTriggerScore = 1000;
  bossActive = false;
  enemySpawnTimer = 0;
  playerShootTimer = 0;
  doubleFireTimer = 0;
  shieldTimer = 0;
  speedTimer = 0;
  frameCount = 0;
  shakeTimer = 0;
  permKills = 0;
  nextLifeScore = 1000;
  bulletDamage = 1;
}

function getDifficulty(): number {
  return Math.min(2.0, 0.6 + score / 800);
}

function initStars() {
  stars = [];
  for (let i = 0; i < 100; i++) {
    const layer = Math.random();
    stars.push({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      speed: 0.2 + layer * 1.5,
      radius: layer < 0.7 ? 0.5 + Math.random() : 1 + Math.random() * 1.5,
      alpha: 0.3 + layer * 0.7,
    });
  }
}

function spawnEnemy(type: EnemyType) {
  const diff = getDifficulty();
  let w: number, h: number, hp: number, speed: number, scoreVal: number;
  const shootInterval = type === 'medium' ? Math.max(90, 160 - diff * 20) : (type === 'large' ? Math.max(70, 120 - diff * 15) : 0);

  switch (type) {
    case 'small': w = 26; h = 26; hp = 1; speed = (1.2 + Math.random() * 1.2) * diff; scoreVal = 100; break;
    case 'medium': w = 36; h = 36; hp = 3; speed = (0.6 + Math.random() * 0.8) * diff; scoreVal = 300; break;
    case 'large': w = 50; h = 50; hp = 5; speed = (0.3 + Math.random() * 0.4) * diff; scoreVal = 500; break;
    case 'boss': w = 80; h = 56; hp = 25; speed = 0.6 * diff; scoreVal = 2000; break;
    default: w = 26; h = 26; hp = 1; speed = 1.2 * diff; scoreVal = 100;
  }

  // Random movement pattern
  let movePattern: MovePattern;
  if (type === 'boss') {
    movePattern = 'sway';
  } else if (type === 'small') {
    const r = Math.random();
    if (r < 0.5) movePattern = 'fall';
    else if (r < 0.85) movePattern = 'horizontal';
    else movePattern = 'circle';
  } else {
    const r = Math.random();
    if (r < 0.4) movePattern = 'sway';
    else if (r < 0.75) movePattern = 'horizontal';
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
    shootTimer: type === 'large' || type === 'medium' ? Math.random() * shootInterval : 0,
    shootInterval,
    movePattern,
    movePhase: Math.random() * Math.PI * 2,
    moveAmp: movePattern === 'circle' ? 40 + Math.random() * 40 : (type === 'large' ? 60 : (type === 'medium' ? 30 : 0)),
    startX,
    startY,
    dirX: Math.random() > 0.5 ? 1 : -1,
  };

  if (type === 'boss') {
    enemy.x = 20 + Math.random() * (CANVAS_W - w - 40);
    enemy.y = 10;
    enemy.startX = enemy.x;
    bossActive = true;
  }

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
  });
}

function spawnExplosion(x: number, y: number, count: number, color: string) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 20 + Math.random() * 15,
      maxLife: 35,
      color,
      radius: 1.5 + Math.random() * 2.5,
    });
  }
}

function aabb(a: Entity, b: Entity): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

// ----- Drawing Functions -----

function drawPlayer() {
  if (!ctx) return;
  if (player.invincible > 0 && Math.floor(player.invincible / 4) % 2 === 0) return;

  const cx = player.x + player.w / 2;
  const cy = player.y + player.h / 2;
  ctx.save();
  ctx.translate(cx, cy);

  // Body
  ctx.fillStyle = '#4488ff';
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.lineTo(-10, 14);
  ctx.lineTo(-6, 10);
  ctx.lineTo(6, 10);
  ctx.lineTo(10, 14);
  ctx.closePath();
  ctx.fill();

  // Wing left
  ctx.fillStyle = '#7799bb';
  ctx.beginPath();
  ctx.moveTo(-7, 0);
  ctx.lineTo(-15, 8);
  ctx.lineTo(-7, 8);
  ctx.closePath();
  ctx.fill();

  // Wing right
  ctx.beginPath();
  ctx.moveTo(7, 0);
  ctx.lineTo(15, 8);
  ctx.lineTo(7, 8);
  ctx.closePath();
  ctx.fill();

  // Cockpit
  ctx.fillStyle = '#aaddff';
  ctx.beginPath();
  ctx.arc(0, -4, 5, 0, Math.PI * 2);
  ctx.fill();

  // Engine exhaust
  const flicker = Math.random() * 4;
  ctx.fillStyle = '#ff6633';
  ctx.beginPath();
  ctx.moveTo(-4, 14);
  ctx.lineTo(0, 14 + flicker);
  ctx.lineTo(4, 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#ffaa44';
  ctx.beginPath();
  ctx.moveTo(-2, 14);
  ctx.lineTo(0, 14 + flicker * 0.6);
  ctx.lineTo(2, 14);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // Shield glow
  if (shieldTimer > 0) {
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(frameCount * 0.2) * 0.3})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Cheat glow
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
  // Main body - red triangle (pointing down)
  ctx.fillStyle = '#ff3344';
  ctx.beginPath();
  ctx.moveTo(cx, cy + 12);
  ctx.lineTo(cx - 12, cy - 10);
  ctx.lineTo(cx + 12, cy - 10);
  ctx.closePath();
  ctx.fill();
  // Cockpit
  ctx.fillStyle = '#ff8899';
  ctx.beginPath();
  ctx.arc(cx, cy - 3, 4, 0, Math.PI * 2);
  ctx.fill();
  // Wings
  ctx.fillStyle = '#cc1122';
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 4);
  ctx.lineTo(cx - 14, cy + 3);
  ctx.lineTo(cx - 6, cy + 1);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 10, cy - 4);
  ctx.lineTo(cx + 14, cy + 3);
  ctx.lineTo(cx + 6, cy + 1);
  ctx.closePath();
  ctx.fill();
  // Outline
  ctx.strokeStyle = '#881122';
  ctx.lineWidth = 1;
  ctx.stroke();
  // HP indicator
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
  // Body - orange diamond
  ctx.fillStyle = '#ff7722';
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  ctx.fill();
  // Wings
  ctx.fillStyle = '#cc5500';
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 8);
  ctx.lineTo(cx - 17, cy + 2);
  ctx.lineTo(cx - 8, cy + 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 8, cy - 8);
  ctx.lineTo(cx + 17, cy + 2);
  ctx.lineTo(cx + 8, cy + 2);
  ctx.closePath();
  ctx.fill();
  // Core eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ff0000';
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
  // Outline
  ctx.strokeStyle = '#993300';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  // HP bar
  if (e.hp < e.maxHp) {
    const barW = e.w - 4;
    const barH = 3;
    const barX = e.x + 2;
    const barY = e.y - 6;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
  }
}

function drawLargeEnemy(e: Enemy) {
  if (!ctx) return;
  const cx = e.cx, cy = e.cy, r = 22;
  // Main hull - purple hexagon
  ctx.fillStyle = '#8844cc';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (Math.PI / 3) * i;
    const px = cx + r * Math.cos(a);
    const py = cy + r * Math.sin(a);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  // Armor plates
  ctx.fillStyle = '#6622aa';
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - 6);
  ctx.lineTo(cx + 14, cy - 6);
  ctx.lineTo(cx + 6, cy + 6);
  ctx.lineTo(cx - 6, cy + 6);
  ctx.closePath();
  ctx.fill();
  // Glowing core
  ctx.fillStyle = '#ff66ff';
  ctx.beginPath();
  ctx.arc(cx, cy, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 3, 0, Math.PI * 2);
  ctx.fill();
  // Cannons
  ctx.fillStyle = '#440088';
  ctx.fillRect(cx - 18, cy - 2, 6, 4);
  ctx.fillRect(cx + 12, cy - 2, 6, 4);
  // Outline
  ctx.strokeStyle = '#330066';
  ctx.lineWidth = 2;
  ctx.stroke();
  // HP bar
  if (e.hp < e.maxHp) {
    const barW = e.w - 4;
    const barH = 4;
    const barX = e.x + 2;
    const barY = e.y - 8;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#cc44ff';
    ctx.fillRect(barX, barY, barW * (e.hp / e.maxHp), barH);
  }
}

function drawBoss(e: Enemy) {
  if (!ctx) return;
  const cx = e.cx, cy = e.cy;
  // Main hull
  ctx.fillStyle = '#cc2233';
  ctx.beginPath();
  ctx.moveTo(cx - 35, cy + 24);
  ctx.lineTo(cx - 14, cy - 24);
  ctx.lineTo(cx + 14, cy - 24);
  ctx.lineTo(cx + 35, cy + 24);
  ctx.closePath();
  ctx.fill();
  // Wing L
  ctx.fillStyle = '#881122';
  ctx.beginPath();
  ctx.moveTo(cx - 18, cy + 4);
  ctx.lineTo(cx - 38, cy + 14);
  ctx.lineTo(cx - 18, cy + 20);
  ctx.closePath();
  ctx.fill();
  // Wing R
  ctx.beginPath();
  ctx.moveTo(cx + 18, cy + 4);
  ctx.lineTo(cx + 38, cy + 14);
  ctx.lineTo(cx + 18, cy + 20);
  ctx.closePath();
  ctx.fill();
  // Center core
  ctx.fillStyle = '#ff4444';
  ctx.beginPath();
  ctx.arc(cx, cy - 4, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(cx, cy - 4, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#660000';
  ctx.lineWidth = 2;

  // Draw boss HP bar
  const barW = e.w;
  const barH = 6;
  const barX = e.x;
  const barY = e.y - 12;
  ctx.fillStyle = '#333';
  ctx.fillRect(barX, barY, barW, barH);
  const hpRatio = e.hp / e.maxHp;
  const hpColor = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#cccc44' : '#cc4444';
  ctx.fillStyle = hpColor;
  ctx.fillRect(barX, barY, barW * hpRatio, barH);
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);
}

function drawEnemy(e: Enemy) {
  switch (e.type) {
    case 'small': drawSmallEnemy(e); break;
    case 'medium': drawMediumEnemy(e); break;
    case 'large': drawLargeEnemy(e); break;
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

  // Score
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px "MS Sans Serif", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`${score}`, 10, 28);

  // High score
  ctx.fillStyle = '#aaaacc';
  ctx.font = 'bold 11px "MS Sans Serif", sans-serif';
  ctx.fillText(`最高: ${highScore}`, 10, 44);

  // Permanent upgrade level
  ctx.fillStyle = '#44ccff';
  ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
  ctx.fillText(`伤害${bulletDamage} 火速${Math.floor(permKills / 3)} 加速${Math.floor(permKills / 5)}`, 10, 60);

  // Lives
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ff4466';
  ctx.font = 'bold 16px sans-serif';
  let livesStr = '';
  for (let i = 0; i < player.lives; i++) livesStr += '♥ ';
  ctx.fillText(livesStr.trim(), CANVAS_W - 10, 28);

  // Power-up indicators at bottom
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

  // Cheat indicator
  if (cheatInvincible.value) {
    ctx.fillStyle = '#ff00ff';
    ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ 无敌模式 ★', CANVAS_W / 2, 22);
  }
}

function drawMenu() {
  if (!ctx) return;
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  titleBlink += 0.05;

  // Title
  ctx.fillStyle = '#ffdd44';
  ctx.font = 'bold 30px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('飞 机 大 战', CANVAS_W / 2, 55);

  // Player guide
  ctx.fillStyle = '#4488ff';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— 你的战机 ——', CANVAS_W / 2, 90);

  // Draw player plane
  ctx.save();
  ctx.translate(CANVAS_W / 2, 115);
  ctx.fillStyle = '#4488ff';
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(-9, 11);
  ctx.lineTo(-5, 9);
  ctx.lineTo(5, 9);
  ctx.lineTo(9, 11);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7799bb';
  ctx.beginPath(); ctx.moveTo(-7, 0); ctx.lineTo(-13, 6); ctx.lineTo(-7, 6); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(13, 6); ctx.lineTo(7, 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#aaddff';
  ctx.beginPath(); ctx.arc(0, -3, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ff6633';
  ctx.beginPath(); ctx.moveTo(-3, 11); ctx.lineTo(0, 14); ctx.lineTo(3, 11); ctx.closePath(); ctx.fill();
  ctx.restore();

  // Controls
  ctx.fillStyle = '#cccccc';
  ctx.font = '13px "Microsoft YaHei", sans-serif';
  ctx.fillText('↑↓←→ 或 WASD 移动 · 空格 射击', CANVAS_W / 2, 148);
  ctx.fillText('P 暂停 · 难度随分数逐渐提升', CANVAS_W / 2, 168);

  // Divider
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, 188);
  ctx.lineTo(CANVAS_W - 20, 188);
  ctx.stroke();

  // Enemy guide title
  ctx.fillStyle = '#ff8844';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— 敌机图鉴 ——', CANVAS_W / 2, 210);

  // Draw each enemy type with label
  function drawMiniEnemy(cx: number, cy: number, type: string, label: string, detail: string) {
    ctx!.save();
    ctx!.translate(cx, cy);
    if (type === 'small') {
      ctx!.fillStyle = '#ff3344';
      ctx!.beginPath();
      ctx!.moveTo(0, 10); ctx!.lineTo(-9, -7); ctx!.lineTo(9, -7); ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#ff8899'; ctx!.beginPath(); ctx!.arc(0, -2, 3, 0, Math.PI * 2); ctx!.fill();
      ctx!.strokeStyle = '#881122'; ctx!.lineWidth = 1; ctx!.stroke();
    } else if (type === 'medium') {
      const r = 12;
      ctx!.fillStyle = '#ff7722';
      ctx!.beginPath();
      ctx!.moveTo(0, -r); ctx!.lineTo(r, 0); ctx!.lineTo(0, r); ctx!.lineTo(-r, 0); ctx!.closePath(); ctx!.fill();
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
    } else if (type === 'boss') {
      ctx!.fillStyle = '#cc2233';
      ctx!.beginPath();
      ctx!.moveTo(-18, 12); ctx!.lineTo(-8, -10); ctx!.lineTo(8, -10); ctx!.lineTo(18, 12); ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#881122';
      ctx!.beginPath(); ctx!.moveTo(-10, 2); ctx!.lineTo(-20, 8); ctx!.lineTo(-10, 10); ctx!.closePath(); ctx!.fill();
      ctx!.beginPath(); ctx!.moveTo(10, 2); ctx!.lineTo(20, 8); ctx!.lineTo(10, 10); ctx!.closePath(); ctx!.fill();
      ctx!.fillStyle = '#f44'; ctx!.beginPath(); ctx!.arc(0, -2, 5, 0, Math.PI * 2); ctx!.fill();
      ctx!.fillStyle = '#ff0'; ctx!.beginPath(); ctx!.arc(0, -2, 2, 0, Math.PI * 2); ctx!.fill();
      ctx!.strokeStyle = '#600'; ctx!.lineWidth = 1.5; ctx!.stroke();
    }
    ctx!.restore();

    // Label
    ctx!.fillStyle = '#ffffff';
    ctx!.font = 'bold 12px "Microsoft YaHei", sans-serif';
    ctx!.textAlign = 'center';
    ctx!.fillText(label, cx, cy + 24);
    ctx!.fillStyle = '#999999';
    ctx!.font = '11px "Microsoft YaHei", sans-serif';
    ctx!.fillText(detail, cx, cy + 39);
  }

  const yBase = 220;
  drawMiniEnemy(55, yBase, 'small', '侦察机', '1HP·100分');
  drawMiniEnemy(145, yBase, 'medium', '战斗机', '3HP·会追踪弹');
  drawMiniEnemy(245, yBase, 'large', '重装机', '5HP·扇形弹');
  drawMiniEnemy(345, yBase, 'boss', 'BOSS', '25HP·每1000分');

  // Power-up guide
  ctx.strokeStyle = '#555555';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(20, 285);
  ctx.lineTo(CANVAS_W - 20, 285);
  ctx.stroke();

  ctx.fillStyle = '#44cc44';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— 道具说明 ——', CANVAS_W / 2, 308);

  function drawMiniPowerUp(cx: number, cy: number, color: string, icon: string, desc: string) {
    ctx!.fillStyle = color;
    ctx!.beginPath(); ctx!.arc(cx, cy - 8, 8, 0, Math.PI * 2); ctx!.fill();
    ctx!.fillStyle = '#fff';
    ctx!.beginPath(); ctx!.arc(cx, cy - 8, 4, 0, Math.PI * 2); ctx!.fill();
    ctx!.fillStyle = color;
    ctx!.font = 'bold 10px "Microsoft YaHei", sans-serif';
    ctx!.textAlign = 'center';
    ctx!.fillText(icon, cx, cy - 5);
    ctx!.fillStyle = '#ccc';
    ctx!.font = '11px "Microsoft YaHei", sans-serif';
    ctx!.fillText(desc, cx, cy + 8);
  }

  drawMiniPowerUp(60, 338, '#4488ff', '火', '双倍火力');
  drawMiniPowerUp(160, 338, '#ffaa00', '盾', '无敌护盾');
  drawMiniPowerUp(260, 338, '#44cc44', '速', '速度提升');
  drawMiniPowerUp(350, 338, '#ff4444', '心', '回复1命');

  // High score + start prompt
  ctx.fillStyle = '#aaaacc';
  ctx.font = '13px "Microsoft YaHei", sans-serif';
  ctx.fillText(`最高分: ${highScore}`, CANVAS_W / 2, 385);

  if (Math.sin(titleBlink) > 0) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.fillText('按 Enter 开始游戏', CANVAS_W / 2, 420);
  }
}

function drawPause() {
  if (!ctx) return;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('已 暂 停', CANVAS_W / 2, CANVAS_H / 2 - 10);
  ctx.font = '14px "Microsoft YaHei", sans-serif';
  ctx.fillText('按 P 继续', CANVAS_W / 2, CANVAS_H / 2 + 30);
}

function drawGameOver() {
  if (!ctx) return;
  ctx.fillStyle = 'rgba(0,0,0,0.75)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 28px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('游 戏 结 束', CANVAS_W / 2, 220);
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px monospace';
  ctx.fillText(`得分: ${score}`, CANVAS_W / 2, 280);

  if (score > highScore) {
    ctx.fillStyle = '#ffdd44';
    ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
    ctx.fillText('🏆 新最高分！', CANVAS_W / 2, 310);
  }

  titleBlink += 0.05;
  if (Math.sin(titleBlink) > 0) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
    ctx.fillText('按 Enter 重新开始', CANVAS_W / 2, 370);
  }
}

// ----- Game Loop -----

function update() {
  if (!ctx) return;

  // Update stars
  for (const s of stars) {
    s.y += s.speed;
    if (s.y > CANVAS_H) { s.y = 0; s.x = Math.random() * CANVAS_W; }
  }

  if (gameState !== 'playing') return;

  frameCount++;

  // Screen shake decay
  if (shakeTimer > 0) shakeTimer--;

  // Input: player movement — permanent speed from kills
  const permSpeedBonus = Math.min(2.5, Math.floor(permKills / 5) * 0.4);
  const spd = (player.speed + permSpeedBonus) * (speedTimer > 0 ? 1.6 : 1);
  if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) player.x -= spd;
  if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) player.x += spd;
  if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) player.y -= spd;
  if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) player.y += spd;
  player.x = Math.max(0, Math.min(CANVAS_W - player.w, player.x));
  player.y = Math.max(0, Math.min(CANVAS_H - player.h, player.y));

  // Player invincibility countdown
  if (player.invincible > 0) player.invincible--;

  // Power-up timers
  if (doubleFireTimer > 0) doubleFireTimer--;
  if (shieldTimer > 0) shieldTimer--;
  if (speedTimer > 0) speedTimer--;

  // Auto-shoot — permanent fire rate from kills
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

  // Spawn enemies — gradual difficulty
  enemySpawnTimer++;
  if (!bossActive) {
    const diff = getDifficulty();
    const baseRate = 180 - diff * 60; // ~156 at start, ~60 at max diff
    const spawnRate = Math.max(50, Math.floor(baseRate));
    if (enemySpawnTimer >= spawnRate) {
      enemySpawnTimer = 0;
      const r = Math.random();
      if (score >= 600 && r < 0.12) spawnEnemy('large');
      else if (score >= 250 && r < 0.3) spawnEnemy('medium');
      else spawnEnemy('small');
    }

    // Boss trigger — every 1500 points, minimum gap after boss kill
    if (score >= bossTriggerScore && !bossActive) {
      spawnEnemy('boss');
      bossTriggerScore = Math.max(bossTriggerScore + 1500, score + 800);
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
    if (e.shootInterval > 0) {
      e.shootTimer++;
      if (e.shootTimer >= e.shootInterval) {
        e.shootTimer = 0;
        if (e.type === 'large') {
          // 3-way spread
          for (let a = -0.25; a <= 0.25; a += 0.25) {
            bullets.push({ x: e.cx - 3, y: e.cy, w: 6, h: 6, cx: e.cx, cy: e.cy, vx: a * 2, vy: 2.5, isPlayer: false });
          }
        } else if (e.type === 'medium') {
          // Aimed shot
          const dx = (player.x + player.w / 2) - e.cx;
          const dy = (player.y + player.h / 2) - e.cy;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          bullets.push({ x: e.cx - 2, y: e.cy, w: 4, h: 4, cx: e.cx, cy: e.cy, vx: (dx / dist) * 2, vy: (dy / dist) * 2, isPlayer: false });
        } else if (e.type === 'boss') {
          // 3-way spread
          for (let a = -0.4; a <= 0.4; a += 0.4) {
            bullets.push({ x: e.cx - 4, y: e.cy, w: 8, h: 8, cx: e.cx, cy: e.cy, vx: Math.sin(a) * 2.5, vy: 2.2, isPlayer: false });
          }
        }
      }
    }
  }

  // Remove off-screen and dead enemies
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
  }
  powerUps = powerUps.filter(p => p.y < CANVAS_H + 30);

  // Update particles
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
  }
  particles = particles.filter(p => p.life > 0);

  // Collision: player bullets vs enemies
  for (const b of bullets) {
    if (!b.isPlayer) continue;
    for (const e of enemies) {
      if (aabb(b, e)) {
        b.y = -999; // mark for removal
        e.hp -= bulletDamage;
        spawnExplosion(b.cx, b.cy, 4, '#ffcc44');
        if (e.hp <= 0) {
          score += e.score;
          permKills++;
          // Bullet damage upgrade: every 5 kills
          bulletDamage = Math.min(5, 1 + Math.floor(permKills / 10));
          // Bonus life every 500 score
          if (score >= nextLifeScore) {
            player.lives = Math.min(player.lives + 1, 4);
            nextLifeScore += 1000;
          }
          spawnExplosion(e.cx, e.cy, 15, e.type === 'boss' ? '#ff6644' : '#ffaa22');
          spawnPowerUp(e.cx, e.cy);
          if (e.type === 'boss') {
            bossActive = false;
            shakeTimer = 20;
          }
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
        player.invincible = 90; // 1.5 sec at 60fps
        shieldTimer = 0;
        doubleFireTimer = 0;
        speedTimer = 0;
        spawnExplosion(player.x + player.w / 2, player.y + player.h / 2, 10, '#ff6644');
        shakeTimer = 10;
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

    // Collision: enemies vs player
    if (!cheatInvincible.value && player.invincible <= 0 && shieldTimer <= 0) {
      const pBox = { x: player.x + 6, y: player.y + 4, w: player.w - 12, h: player.h - 10 } as Entity;
      for (const e of enemies) {
        if (aabb(pBox, e)) {
          player.lives--;
          player.invincible = 90;
          shieldTimer = 0;
          doubleFireTimer = 0;
          speedTimer = 0;
          spawnExplosion(player.x + player.w / 2, player.y + player.h / 2, 10, '#ff6644');
          shakeTimer = 10;
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
      pu.y = -999; // mark for removal
      switch (pu.type) {
        case 'doubleFire': doubleFireTimer = 600; break; // 10 sec
        case 'shield': shieldTimer = 480; break; // 8 sec
        case 'speed': speedTimer = 600; break;
        case 'heal': player.lives = Math.min(player.lives + 1, 3); break;
      }
    }
  }
  powerUps = powerUps.filter(p => p.y !== -999);

  // Check if boss scrolled off
  for (const e of enemies) {
    if (e.type === 'boss' && e.y > CANVAS_H + 100) {
      bossActive = false;
    }
  }
}

function render() {
  if (!ctx) return;

  // Screen shake
  let sx = 0, sy = 0;
  if (shakeTimer > 0) {
    sx = (Math.random() - 0.5) * 6 * (shakeTimer / 20);
    sy = (Math.random() - 0.5) * 6 * (shakeTimer / 20);
  }

  ctx.save();
  ctx.translate(sx, sy);

  // Dark starfield background
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  for (const s of stars) {
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (gameState === 'menu') {
    drawMenu();
    ctx.restore();
    return;
  }

  // Power-ups
  for (const pu of powerUps) drawPowerUp(pu);

  // Bullets
  for (const b of bullets) {
    ctx.fillStyle = b.isPlayer ? '#ffdd44' : '#ff4444';
    ctx.beginPath();
    ctx.arc(b.cx, b.cy, b.isPlayer ? 3 : (b.w > 5 ? 4 : 2.5), 0, Math.PI * 2);
    ctx.fill();
  }

  // Enemies
  for (const e of enemies) drawEnemy(e);

  // Player
  if (gameState === 'playing' || gameState === 'paused') {
    drawPlayer();
  }

  // Particles
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
    if (p.color.startsWith('#')) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // HUD
  if (gameState === 'playing' || gameState === 'paused') {
    drawHUD();
  }

  ctx.restore();

  // Overlays (not affected by shake)
  if (gameState === 'paused') drawPause();
  if (gameState === 'gameover') drawGameOver();
}

function gameLoop() {
  update();
  render();
  animFrameId = requestAnimationFrame(gameLoop);
}

// ----- Input Handling -----

function handleKeyDown(e: KeyboardEvent) {
  keys.add(e.key);

  if (e.key === 'Enter') {
    if (gameState === 'menu') {
      resetGame();
      gameState = 'playing';
      // Spawn initial enemies for immediate action
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
  if (e.key === ' ') {
    e.preventDefault();
  }

  // Prevent arrow keys from scrolling page
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
}

function handleKeyUp(e: KeyboardEvent) {
  keys.delete(e.key);
}

// ----- Lifecycle -----

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  if (!ctx) return;

  initStars();
  resetGame();

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  gameLoop();
});

onUnmounted(() => {
  cancelAnimationFrame(animFrameId);
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});
</script>

<template>
  <Window
    title="飞机大战"
    icon="fa fa-fighter-jet"
    :isOpen="true"
    :isActive="true"
    @close="router.push('/')"
  >
    <div class="flex flex-col items-center gap-[4px]">
      <canvas
        ref="canvasRef"
        :width="400"
        :height="600"
        class="shadow-win95-inset outline-none block"
        tabindex="0"
        style="image-rendering: auto;"
      ></canvas>
      <button
        @click="cheatInvincible = !cheatInvincible"
        class="text-[11px] font-bold px-[10px] py-[2px] bg-[#c0c0c0] text-black border-none shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a] cursor-pointer font-sans"
        :style="{ backgroundColor: cheatInvincible ? '#ff88ff' : '#c0c0c0' }"
      >
        {{ cheatInvincible ? '★ 无敌中 (按 I 关闭)' : '无敌模式 (I)' }}
      </button>
    </div>
  </Window>
</template>

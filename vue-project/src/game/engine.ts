// 游戏引擎：delta-time 主循环、HiDPI 画布、输入（键盘/指针/失焦）、
// 生成节奏与碰撞调度。数值平衡见 config.ts。
import {
  BOMB, CANVAS, FORMATION, MAX_DT, PERM, POWERUP, SPAWN,
} from './config';
import { drawBackground, drawMeteors, initBackground, updateBackground } from './background';
import { getNextBossKillThreshold, spawnBoss } from './boss';
import {
  collideEnemyAttacks, collidePlayerBullets, collidePowerUps, killEnemy,
  playerAutoFire, spawnEnemy, spawnFormation, updateBullets, updateEnemies,
  updateParticles, updatePopups, updatePowerUps,
} from './entities';
import { spawnExplosion, spawnScorePopup } from './fx';
import { drawGameOver, drawHUD, drawMenu, drawPause, invalidateOverlays } from './hud';
import { drawBullets, drawEnemies, drawParticles, drawPlayer, drawPopups, drawPowerUps } from './render';
import { G, getDifficulty, resetGame } from './state';
import type { GameState } from './types';

export interface GameHooks {
  onStateChange?: (state: GameState) => void;
}

export class AirplaneGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rafId = 0;
  private lastTime: number | null = null;
  private running = false;
  private fpsAccum = 0;
  private fpsFrames = 0;

  // 事件句柄（解绑用）
  private onKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);
  private onKeyUp = (e: KeyboardEvent) => { G.keys.delete(e.key); };
  private onBlur = () => this.handleBlur();
  private onVisibility = () => { if (document.hidden) this.handleBlur(); };
  private onResize = () => this.handleResize();

  constructor(canvas: HTMLCanvasElement, private hooks?: GameHooks) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    this.ctx = ctx;
  }

  start(): void {
    this.handleResize();
    initBackground();
    resetGame();

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.onBlur);
    document.addEventListener('visibilitychange', this.onVisibility);
    window.addEventListener('resize', this.onResize);

    this.running = true;
    this.lastTime = null;
    this.rafId = requestAnimationFrame(this.tick);
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.onBlur);
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('resize', this.onResize);
  }

  // 供 Vue 按钮调用
  togglePause(): void {
    if (G.gameState === 'playing') this.setState('paused');
    else if (G.gameState === 'paused') this.setState('playing');
  }

  useBomb(): void {
    if (G.gameState !== 'playing' || G.bombCount <= 0) return;
    G.bombCount--;

    // 清除所有敌机子弹
    G.bullets = G.bullets.filter(b => b.isPlayer);

    // 全屏冲击波特效
    G.shakeTimer = 25;
    spawnExplosion(G.canvasW / 2, G.canvasH / 2, 40, '#ffffff', true);
    spawnScorePopup(G.canvasW / 2, G.canvasH / 2 - 20, '💣 全屏冲击!', '#ffffff', 18);

    // 对所有敌人造成大量伤害
    for (const e of [...G.enemies]) {
      if (e.entryTimer > 0) continue;
      e.hp -= BOMB.damage;
      if (e.hp <= 0) killEnemy(e);
    }
  }

  private setState(s: GameState): void {
    if (G.gameState === s) return;
    G.gameState = s;
    this.hooks?.onStateChange?.(s);
  }

  // ============ 输入 ============

  private handleKeyDown(e: KeyboardEvent): void {
    G.keys.add(e.key);

    if (e.key === 'Enter') {
      if (G.gameState === 'menu' || G.gameState === 'gameover') this.startGame();
    }
    if (e.key === 'p' || e.key === 'P') {
      this.togglePause();
    }
    if (e.key === 'I' || e.key === 'i') {
      G.cheatInvincible = !G.cheatInvincible;
    }
    if (e.key === 'x' || e.key === 'X' || e.key === 'b' || e.key === 'B') {
      this.useBomb();
    }
    if (e.key === ' ' || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  }

  // 点击/触摸画布：菜单或结束时开始，游戏中无操作
  canvasTap(): void {
    if (G.gameState === 'menu' || G.gameState === 'gameover') this.startGame();
  }

  handlePointerMove(e: PointerEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    G.pointerX = (e.clientX - rect.left) * (G.canvasW / rect.width);
    G.pointerY = (e.clientY - rect.top) * (G.canvasH / rect.height);
    G.pointerLastFrame = G.frameCount;
    G.pointerActive = true;
  }

  // 失焦/切页：丢掉按住的键并自动暂停，避免回来时飞机漂移或已阵亡
  private handleBlur(): void {
    G.keys.clear();
    if (G.gameState === 'playing') this.setState('paused');
  }

  private startGame(): void {
    resetGame();
    this.setState('playing');
    spawnEnemy('small');
    spawnEnemy('small');
    spawnEnemy('small');
  }

  // ============ 画布尺寸（HiDPI） ============

  private handleResize(): void {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const availH = Math.min(CANVAS.maxH, Math.max(CANVAS.minH, vh - CANVAS.vMargin));
    const availW = Math.min(CANVAS.maxW, Math.max(CANVAS.minW, vw * CANVAS.widthRatio));

    let w: number, h: number;
    if (availW / availH > CANVAS.aspect) {
      h = availH;
      w = Math.floor(h * CANVAS.aspect);
    } else {
      w = availW;
      h = Math.floor(w / CANVAS.aspect);
    }

    w = Math.floor(Math.max(CANVAS.minW, Math.min(CANVAS.maxW, w)));
    h = Math.floor(Math.max(CANVAS.minH, Math.min(CANVAS.maxH, h)));

    // HiDPI：物理像素放大 dpr 倍，逻辑坐标系不变
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const sizeChanged = w !== G.canvasW || h !== G.canvasH;
    G.canvasW = w;
    G.canvasH = h;

    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';

    // CSS 尺寸只缩小不放大，避免小屏溢出
    const cssW = Math.min(w, vw - 16);
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = Math.floor(cssW / CANVAS.aspect) + 'px';

    G.dpr = dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    initBackground();
    if (sizeChanged) invalidateOverlays();
  }

  // ============ 主循环（delta-time） ============

  private tick = (now: number): void => {
    if (!this.running) return;

    let dt: number;
    if (this.lastTime === null) {
      dt = 1;
    } else {
      dt = ((now - this.lastTime) / (1000 / 60));
      dt = Math.max(0.25, Math.min(MAX_DT, dt));
    }
    this.lastTime = now;

    // FPS 统计（约每 0.5s 更新）
    this.fpsAccum += dt;
    this.fpsFrames++;
    if (this.fpsAccum >= 30) {
      G.fps = Math.round((this.fpsFrames * 60) / this.fpsAccum);
      this.fpsAccum = 0;
      this.fpsFrames = 0;
    }

    this.update(dt);
    this.render();

    this.rafId = requestAnimationFrame(this.tick);
  };

  private update(dt: number): void {
    updateBackground(dt);
    if (G.gameState !== 'playing') return;

    G.frameCount += dt;

    if (G.shakeTimer > 0) G.shakeTimer -= dt;

    if (G.comboTimer > 0) {
      G.comboTimer -= dt;
      if (G.comboTimer <= 0) G.comboCount = 0;
    }
    if (G.comboDisplayTimer > 0) G.comboDisplayTimer -= dt;

    this.updatePlayer(dt);

    if (G.player.invincible > 0) G.player.invincible -= dt;
    if (G.doubleFireTimer > 0) G.doubleFireTimer -= dt;
    if (G.shieldTimer > 0) G.shieldTimer -= dt;
    if (G.speedTimer > 0) G.speedTimer -= dt;

    playerAutoFire(dt);
    this.updateSpawning(dt);

    updateBullets(dt);
    updateEnemies(dt);
    updatePowerUps(dt);
    updateParticles(dt);
    updatePopups(dt);

    collidePlayerBullets();
    collideEnemyAttacks();
    collidePowerUps();
  }

  private updatePlayer(dt: number): void {
    const permSpeedBonus = Math.min(PERM.maxSpeedBonus, Math.floor(G.permKills / PERM.speedPerKills) * PERM.speedStep);
    const spd = (G.player.speed + permSpeedBonus) * (G.speedTimer > 0 ? POWERUP.speedMult : 1);
    const usingPointer = G.pointerActive && (G.frameCount - G.pointerLastFrame) < 60;
    if (usingPointer) {
      const cx = G.player.x + G.player.w / 2;
      const cy = G.player.y + G.player.h / 2;
      // 目标点在指针上方偏移，避免手指/鼠标遮挡战机
      const dx = G.pointerX - cx;
      const dy = (G.pointerY - 50) - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 3) {
        const step = Math.min(dist, spd * 1.6 * dt);
        G.player.x += (dx / dist) * step;
        G.player.y += (dy / dist) * step;
      }
    } else {
      const k = G.keys;
      if (k.has('ArrowLeft') || k.has('a') || k.has('A')) G.player.x -= spd * dt;
      if (k.has('ArrowRight') || k.has('d') || k.has('D')) G.player.x += spd * dt;
      if (k.has('ArrowUp') || k.has('w') || k.has('W')) G.player.y -= spd * dt;
      if (k.has('ArrowDown') || k.has('s') || k.has('S')) G.player.y += spd * dt;
    }
    G.player.x = Math.max(0, Math.min(G.canvasW - G.player.w, G.player.x));
    G.player.y = Math.max(0, Math.min(G.canvasH - G.player.h, G.player.y));
  }

  private updateSpawning(dt: number): void {
    G.enemySpawnTimer += dt;
    if (G.bossSpawned) return;

    const diff = getDifficulty();
    const spawnRate = Math.max(SPAWN.minRate, SPAWN.baseRate - diff * SPAWN.perDiff);
    if (G.enemySpawnTimer >= spawnRate) {
      G.enemySpawnTimer = 0;
      if (G.enemies.length >= SPAWN.maxOnScreen) return;   // 密度阀门：满了先不刷
      G.spawnCounter++;
      // 每 N 个节奏随机来一次 V 字编队，维持割草密度
      if (G.spawnCounter % FORMATION.everyNthSpawn === 0 && Math.random() < FORMATION.chance) {
        spawnFormation();
        return;
      }
      const r = Math.random();
      if (G.score >= SPAWN.gateElite && r < SPAWN.pElite) spawnEnemy('elite');
      else if (G.score >= SPAWN.gateLarge && r < SPAWN.pLarge) spawnEnemy('large');
      else if (G.score >= SPAWN.gateMedium && r < SPAWN.pMedium) spawnEnemy('medium');
      else spawnEnemy('small');
    }

    if (G.permKills >= getNextBossKillThreshold()) {
      spawnBoss();
    }
  }

  // ============ 渲染 ============

  private render(): void {
    const ctx = this.ctx;

    let sx = 0, sy = 0;
    if (G.shakeTimer > 0) {
      const k = Math.max(0, G.shakeTimer / 30);
      sx = (Math.random() - 0.5) * 7 * k;
      sy = (Math.random() - 0.5) * 7 * k;
    }

    ctx.save();
    ctx.translate(sx, sy);

    drawBackground(ctx);

    if (G.gameState === 'menu') {
      drawMeteors(ctx);
      drawMenu(ctx);
      ctx.restore();
      return;
    }

    drawMeteors(ctx);
    drawPowerUps(ctx);
    drawBullets(ctx);
    drawEnemies(ctx);

    if (G.gameState === 'playing' || G.gameState === 'paused') {
      drawPlayer(ctx);
    }

    drawParticles(ctx);
    drawPopups(ctx);

    if (G.gameState === 'playing' || G.gameState === 'paused') {
      drawHUD(ctx);
    }

    ctx.restore();

    if (G.gameState === 'paused') drawPause(ctx);
    if (G.gameState === 'gameover') drawGameOver(ctx);
  }
}

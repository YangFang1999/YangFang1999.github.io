// 桌面保卫战 — 核心引擎：主循环 / 升级三选一 / 拾取 / 输入
import {
  ARENA, MAX_DT, PASSIVES, PLAYER, WEAPONS,
} from './config';
import { checkVictory, hitPlayer, updateEnemies, updateSpawning } from './enemies';
import { spawnDmg, spawnParticles } from './fx';
import { bakeBackground, drawWorld, drawMenu, drawEnd } from './render';
import { G, maxHp, moveSpeed, pickupRadius, resetGame, xpNext } from './state';
import { updateWeapons } from './weapons';
import { clamp } from '../utils';
import type { Choice, PassiveId, Phase, WeaponId } from './types';

export interface SurvivorHooks {
  onPhaseChange?: (p: Phase) => void;
}

export class SurvivorGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rafId = 0;
  private lastTime: number | null = null;
  private running = false;
  private fpsAccum = 0;
  private fpsFrames = 0;

  private onKeyDown = (e: KeyboardEvent) => this.handleKeyDown(e);
  private onKeyUp = (e: KeyboardEvent) => { G.keys.delete(e.key); };
  private onBlur = () => this.handleBlur();
  private onVisibility = () => { if (document.hidden) this.handleBlur(); };
  private onResize = () => this.handleResize();

  constructor(canvas: HTMLCanvasElement, private hooks?: SurvivorHooks) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    this.ctx = ctx;
  }

  start(): void {
    this.handleResize();

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

  togglePause(): void {
    if (G.phase === 'playing') this.setState('paused');
    else if (G.phase === 'paused') this.setState('playing');
  }

  // ============ 作弊（仅本机 localStorage 游戏，图一乐） ============

  cheatToggleInvincible(): boolean {
    G.cheatInvincible = !G.cheatInvincible;
    return G.cheatInvincible;
  }

  cheatLevelUp(): void {
    if (G.phase !== 'playing' && G.phase !== 'paused') return;
    G.xp += xpNext(G.level);
  }

  cheatWeaponsUp(): void {
    if (G.phase !== 'playing' && G.phase !== 'paused') return;
    for (const w of G.weapons) {
      if (!w.evo && w.level >= WEAPONS[w.id].max) w.evo = true;
      else w.level = Math.min(WEAPONS[w.id].max, w.level + 1);
    }
  }

  cheatPassivesUp(): void {
    if (G.phase !== 'playing' && G.phase !== 'paused') return;
    for (const id of Object.keys(PASSIVES) as PassiveId[]) {
      G.passives[id] = Math.min(PASSIVES[id].max, G.passives[id] + 1);
    }
    G.player.hp = Math.min(maxHp(), G.player.hp + 20);
  }

  cheatHeal(): void {
    G.player.hp = maxHp();
  }

  cheatClearScreen(): void {
    this.clearScreen();
  }

  cheatTimeSkip(seconds: number): void {
    G.time += seconds;
  }

  // 回收站清场（道具与作弊共用）
  private clearScreen(): void {
    G.shake = 20;
    for (const e of [...G.enemies]) {
      if (e.kind === 'bsod') continue;
      e.hp = 0;
      spawnParticles(e.cx, e.cy, 6, '#b9c4c9');
    }
    G.enemies = G.enemies.filter(e => e.hp > 0);
    G.ebullets = [];
  }

  // 升级三选一（由 DOM 面板调用）
  chooseUpgrade(index: number): void {
    if (G.phase !== 'levelup') return;
    const choice = G.choices[index];
    if (choice) this.applyChoice(choice);
    G.choices = [];
    this.setState('playing');
    // 经验溢出则继续弹升级面板（由下一帧 checkLevelUp 驱动）
  }

  // 菜单点击：左 1/3 上一页，右 1/3 下一页，中间开始
  menuClick(clientX: number): void {
    const rect = this.canvas.getBoundingClientRect();
    const rel = (clientX - rect.left) / rect.width;
    if (rel < 0.33) G.menuPage = Math.max(0, G.menuPage - 1);
    else if (rel > 0.67) G.menuPage = Math.min(2, G.menuPage + 1);
    else this.startGame();
  }

  canvasTap(): void {
    if (G.phase === 'menu' || G.phase === 'gameover' || G.phase === 'victory') this.startGame();
  }

  handlePointerMove(x: number, y: number): void {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    G.pointer.x = (x - rect.left) * (G.w / rect.width);
    G.pointer.y = (y - rect.top) * (G.h / rect.height);
    G.pointer.active = true;
  }

  private setState(s: Phase): void {
    if (G.phase === s) return;
    G.phase = s;
    this.hooks?.onPhaseChange?.(s);
  }

  private handleKeyDown(e: KeyboardEvent): void {
    G.keys.add(e.key);
    if (e.key === 'Enter') {
      if (G.phase === 'menu' || G.phase === 'gameover' || G.phase === 'victory') this.startGame();
    }
    if (e.key === 'p' || e.key === 'P') this.togglePause();
    // 作弊：I 无敌
    if (e.key === 'I' || e.key === 'i') {
      G.cheatInvincible = !G.cheatInvincible;
    }
    // 菜单翻页
    if (G.phase === 'menu') {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') G.menuPage = Math.max(0, G.menuPage - 1);
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') G.menuPage = Math.min(2, G.menuPage + 1);
    }
    // 升级面板快捷键
    if (G.phase === 'levelup' && ['1', '2', '3'].includes(e.key)) {
      this.chooseUpgrade(Number(e.key) - 1);
    }
    if (e.key === ' ' || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
  }

  private handleBlur(): void {
    G.keys.clear();
    if (G.phase === 'playing') this.setState('paused');
  }

  private startGame(): void {
    resetGame();
    this.setState('playing');
  }

  // ============ 画布尺寸（HiDPI） ============

  private handleResize(): void {
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const availH = Math.min(ARENA.maxH, Math.max(ARENA.minH, vh - ARENA.vMargin));
    const availW = Math.min(ARENA.maxW, Math.max(ARENA.minW, vw * ARENA.widthRatio));

    const w = Math.floor(availW);
    const h = Math.floor(availH);
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    G.w = w;
    G.h = h;
    G.dpr = dpr;

    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    const cssW = Math.min(w, vw - 16);
    this.canvas.style.width = cssW + 'px';
    this.canvas.style.height = Math.floor(cssW * (h / w)) + 'px';

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bakeBackground(this.ctx, w, h);
  }

  // ============ 升级三选一 ============

  private enterLevelUp(): void {
    G.choices = this.genChoices();
    this.setState('levelup');
  }

  private genChoices(): Choice[] {
    const pool: Choice[] = [];
    const owned = new Map<WeaponId, number>();
    for (const w of G.weapons) owned.set(w.id, w.evo ? 99 : w.level);

    // 未拥有的武器
    const ownedCount = G.weapons.length;
    for (const id of Object.keys(WEAPONS) as WeaponId[]) {
      if (!owned.has(id) && ownedCount < 4) {
        const def = WEAPONS[id];
        pool.push({ kind: 'weapon', id, name: def.name, desc: def.brief, icon: def.icon, levelText: '新武器!' });
      }
    }
    // 已有武器升级 / 进化
    for (const inst of G.weapons) {
      const def = WEAPONS[inst.id];
      if (inst.evo) continue;
      if (inst.level < def.max) {
        pool.push({
          kind: 'weaponUp', id: inst.id, name: def.name,
          desc: def.brief, icon: def.icon, levelText: `Lv.${inst.level} → ${inst.level + 1}`,
        });
      } else {
        pool.push({
          kind: 'evolve', id: inst.id, name: def.evoName,
          desc: def.evoBrief, icon: def.icon, levelText: '进化!',
        });
      }
    }
    // 被动
    for (const id of Object.keys(PASSIVES) as PassiveId[]) {
      const p = PASSIVES[id];
      const lv = G.passives[id];
      if (lv < p.max) {
        pool.push({ kind: 'passive', id, name: p.name, desc: p.desc, icon: p.icon, levelText: `Lv.${lv} → ${lv + 1}` });
      }
    }
    if (pool.length === 0) {
      return [{ kind: 'heal', id: 'heal', name: '系统还原', desc: '回复 50 点生命', icon: 'fa fa-heart', levelText: '补给' }];
    }
    // 随机取 3 个不重复
    const picks: Choice[] = [];
    const copy = [...pool];
    while (picks.length < 3 && copy.length) {
      picks.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
    }
    return picks;
  }

  private applyChoice(c: Choice): void {
    if (c.kind === 'weapon') {
      G.weapons.push({ id: c.id as WeaponId, level: 1, evo: false, cd: 0, tick: 0 });
    } else if (c.kind === 'weaponUp') {
      const inst = G.weapons.find(w => w.id === c.id);
      if (inst) inst.level = Math.min(WEAPONS[inst.id].max, inst.level + 1);
    } else if (c.kind === 'evolve') {
      const inst = G.weapons.find(w => w.id === c.id);
      if (inst) inst.evo = true;
      G.shake = 10;
    } else if (c.kind === 'passive') {
      G.passives[c.id as PassiveId]++;
      if (c.id === 'ups') {
        // 上限提升的同时回复 20
        G.player.hp = Math.min(maxHp(), G.player.hp + 20);
      }
    } else if (c.kind === 'heal') {
      G.player.hp = Math.min(maxHp(), G.player.hp + 50);
    }
  }

  // ============ 主循环 ============

  private tick = (now: number): void => {
    if (!this.running) return;
    let dt: number;
    if (this.lastTime === null) {
      dt = 1;
    } else {
      dt = (now - this.lastTime) / (1000 / 60);
      dt = clamp(dt, 0.25, MAX_DT);
    }
    this.lastTime = now;

    // FPS 统计（约每 0.5s 更新一次）
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
    if (G.phase !== 'playing') return;

    G.time += dt / 60;
    if (G.shake > 0) G.shake -= dt;

    this.updatePlayer(dt);
    updateSpawning(dt);
    updateWeapons(dt);
    updateEnemies(dt);
    this.updateBulletsE(dt);
    this.updateGems(dt);
    this.updatePickups(dt);
    this.updateFx(dt);
    this.checkLevelUp();
    checkVictory();
  }

  // 每帧独立检查升级（经验来源不止宝石）
  private checkLevelUp(): void {
    while (G.xp >= xpNext(G.level)) {
      G.xp -= xpNext(G.level);
      G.level++;
      this.enterLevelUp();
      break;
    }
  }

  private updatePlayer(dt: number): void {
    const p = G.player;
    if (p.iFrames > 0) p.iFrames -= dt;

    const spd = moveSpeed();
    const k = G.keys;
    let mx = 0, my = 0;
    if (k.has('ArrowLeft') || k.has('a') || k.has('A')) mx -= 1;
    if (k.has('ArrowRight') || k.has('d') || k.has('D')) mx += 1;
    if (k.has('ArrowUp') || k.has('w') || k.has('W')) my -= 1;
    if (k.has('ArrowDown') || k.has('s') || k.has('S')) my += 1;

    if (mx !== 0 || my !== 0) {
      const len = Math.sqrt(mx * mx + my * my);
      p.x += (mx / len) * spd * dt;
      p.y += (my / len) * spd * dt;
      G.pointer.active = false;
    } else if (G.pointer.active) {
      // 指针跟随
      const dx = G.pointer.x - p.x, dy = G.pointer.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 4) {
        const step = Math.min(dist, spd * 1.4 * dt);
        p.x += (dx / dist) * step;
        p.y += (dy / dist) * step;
      }
    }
    p.x = clamp(p.x, 10, G.w - 10);
    p.y = clamp(p.y, 10, G.h - 10);
  }

  private updateBulletsE(dt: number): void {
    // 敌方错误弹幕
    for (const b of G.ebullets) {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.life -= dt;
      const dx = b.x - G.player.x, dy = b.y - G.player.y;
      const rr = b.r + 8;
      if (dx * dx + dy * dy <= rr * rr && G.player.iFrames <= 0) {
        b.life = 0;
        hitPlayer(b.dmg, b.x, b.y);
      }
    }
    G.ebullets = G.ebullets.filter(b => b.life > 0 && b.x > -30 && b.x < G.w + 30 && b.y > -30 && b.y < G.h + 30);

    // 扫描线视觉衰减
    for (const bm of G.beams) bm.life -= dt;
    G.beams = G.beams.filter(b => b.life > 0);
  }

  private updateGems(dt: number): void {
    // 宝石上限 250：超出时把最老的合并进次老的，控制绘制与遍历成本
    while (G.gems.length > 250) {
      G.gems[1].value += G.gems[0].value;
      G.gems.shift();
    }
    const pr = pickupRadius();
    const p = G.player;
    for (const g of G.gems) {
      g.t += dt * 0.1;
      const dx = p.x - g.x, dy = p.y - g.y;
      const d2 = dx * dx + dy * dy;
      if (g.homing || d2 <= pr * pr) {
        g.homing = true;
        const d = Math.sqrt(d2) || 1;
        const sp = PLAYER.gemSpeed;
        g.x += (dx / d) * sp * dt;
        g.y += (dy / d) * sp * dt;
        if (d < 10) {
          G.xp += g.value;
          g.value = -1; // 标记移除
        }
      }
    }
    G.gems = G.gems.filter(g => g.value >= 0);
  }

  private updatePickups(dt: number): void {
    const p = G.player;
    const pr = pickupRadius() + 14;
    for (const pu of G.pickups) {
      pu.t += dt * 0.1;
      const dx = p.x - pu.x, dy = p.y - pu.y;
      const d2 = dx * dx + dy * dy;
      if (d2 <= pr * pr) {
        pu.t = -1;
        if (pu.kind === 'heal') {
          G.player.hp = Math.min(maxHp(), G.player.hp + 30);
          spawnDmg(p.x, p.y - 14, 0, '#7dff8a');
          G.dmgs[G.dmgs.length - 1].val = 30;
        } else if (pu.kind === 'magnet') {
          for (const g of G.gems) g.homing = true;
        } else {
          // 回收站：清空普通敌人
          this.clearScreen();
        }
      }
    }
    G.pickups = G.pickups.filter(pu => pu.t >= 0);
  }

  private updateFx(dt: number): void {
    for (const d of G.dmgs) { d.y -= 0.55 * dt; d.life -= dt; }
    G.dmgs = G.dmgs.filter(d => d.life > 0);
    for (const b of G.banners) b.life -= dt;
    G.banners = G.banners.filter(b => b.life > 0);
    for (const pt of G.particles) {
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
    }
    G.particles = G.particles.filter(pt => pt.life > 0);
  }

  // ============ 渲染 ============

  private render(): void {
    drawWorld(this.ctx);
    if (G.phase === 'menu') drawMenu(this.ctx);
    if (G.phase === 'gameover' || G.phase === 'victory') drawEnd(this.ctx, G.phase === 'victory');
  }
}

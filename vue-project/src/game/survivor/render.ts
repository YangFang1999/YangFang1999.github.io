// 桌面保卫战 — 渲染：桌面背景烘焙 / 世界 / HUD / 菜单 / 结算
import { PASSIVES, WEAPONS } from './config';
import { G, maxHp, xpNext } from './state';
import { getSprites } from './sprites';
import { orbPositions } from './weapons';
import type { PassiveId, WeaponId } from './types';

// ============ 背景烘焙（桌面 + 图标） ============

let bgCanvas: HTMLCanvasElement | null = null;
let bgW = 0;
let bgH = 0;

export function bakeBackground(_ctx: CanvasRenderingContext2D, w: number, h: number): void {
  if (bgCanvas && bgW === w && bgH === h) return;
  bgW = w;
  bgH = h;
  bgCanvas = document.createElement('canvas');
  bgCanvas.width = w;
  bgCanvas.height = h;
  const c = bgCanvas.getContext('2d')!;

  // 经典青色桌面
  c.fillStyle = '#008080';
  c.fillRect(0, 0, w, h);

  // 散落的桌面图标（低透明度，作装饰不干扰战斗）
  c.globalAlpha = 0.34;
  const icons = [
    { fx: 0.08, fy: 0.12, draw: drawMonitor, label: '我的电脑' },
    { fx: 0.08, fy: 0.34, draw: drawFolder, label: '我的文档' },
    { fx: 0.08, fy: 0.56, draw: drawGlobe, label: 'Internet' },
    { fx: 0.08, fy: 0.78, draw: drawBin, label: '回收站' },
    { fx: 0.88, fy: 0.16, draw: drawFolder, label: '游戏' },
    { fx: 0.88, fy: 0.4, draw: drawMonitor, label: '设置' },
    { fx: 0.88, fy: 0.64, draw: drawGlobe, label: '网上邻居' },
    { fx: 0.88, fy: 0.86, draw: drawBin, label: ' tmp ' },
  ];
  for (const ic of icons) {
    const x = w * ic.fx;
    const y = h * ic.fy;
    ic.draw(c, x, y);
    c.fillStyle = '#ffffff';
    c.font = '10px "Microsoft YaHei", sans-serif';
    c.textAlign = 'center';
    c.shadowColor = '#000';
    c.shadowOffsetX = 1;
    c.shadowOffsetY = 1;
    c.fillText(ic.label, x, y + 26);
    c.shadowColor = 'transparent';
  }
  c.globalAlpha = 1;

  // 底部任务栏影子
  c.fillStyle = 'rgba(0,0,0,0.28)';
  c.fillRect(0, h - 6, w, 6);
}

function drawMonitor(c: CanvasRenderingContext2D, x: number, y: number): void {
  c.fillStyle = '#c0c0c0';
  c.fillRect(x - 9, y - 10, 18, 13);
  c.fillStyle = '#1084d0';
  c.fillRect(x - 6.5, y - 7.5, 13, 8);
  c.fillStyle = '#c0c0c0';
  c.fillRect(x - 5, y + 3, 10, 4);
}

function drawFolder(c: CanvasRenderingContext2D, x: number, y: number): void {
  c.fillStyle = '#f0c33c';
  c.fillRect(x - 9, y - 6, 18, 12);
  c.beginPath();
  c.moveTo(x - 9, y - 6);
  c.lineTo(x - 4, y - 6);
  c.lineTo(x - 2, y - 9);
  c.lineTo(x - 9, y - 9);
  c.closePath();
  c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.35)';
  c.lineWidth = 0.8;
  c.strokeRect(x - 9, y - 6, 18, 12);
}

function drawGlobe(c: CanvasRenderingContext2D, x: number, y: number): void {
  c.fillStyle = '#3a7bd5';
  c.beginPath(); c.arc(x, y, 8, 0, Math.PI * 2); c.fill();
  c.strokeStyle = '#d8e8ff';
  c.lineWidth = 0.9;
  c.beginPath(); c.ellipse(x, y, 3.5, 8, 0, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.moveTo(x - 8, y); c.lineTo(x + 8, y); c.stroke();
}

function drawBin(c: CanvasRenderingContext2D, x: number, y: number): void {
  c.fillStyle = '#b9c4c9';
  c.fillRect(x - 6, y - 5, 12, 12);
  c.fillStyle = '#7d8a90';
  c.fillRect(x - 7, y - 8, 14, 3);
  c.strokeStyle = '#5a666c';
  c.lineWidth = 0.8;
  for (let i = -3; i <= 3; i += 2.4) {
    c.beginPath(); c.moveTo(x + i, y - 3); c.lineTo(x + i, y + 6); c.stroke();
  }
}

// ============ 世界 ============

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function drawWorld(ctx: CanvasRenderingContext2D): void {
  const spr = getSprites();

  if (bgCanvas) {
    ctx.drawImage(bgCanvas, 0, 0, bgW, bgH);
  } else {
    ctx.fillStyle = '#008080';
    ctx.fillRect(0, 0, G.w, G.h);
  }

  ctx.save();
  if (G.shake > 0) {
    ctx.translate((Math.random() - 0.5) * Math.min(10, G.shake), (Math.random() - 0.5) * Math.min(10, G.shake));
  }

  // 磁盘整理光环
  const aura = G.weapons.find(w => w.id === 'aura');
  if (aura) {
    const def = WEAPONS.aura;
    const lv = aura.evo ? def.evoAura! : def.aura![aura.level - 1];
    const pulse = 0.16 + 0.06 * Math.sin(G.time * 6);
    ctx.save();
    ctx.beginPath();
    ctx.arc(G.player.x, G.player.y, lv.radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = `rgba(120, 255, 150, ${pulse})`;
    ctx.fillRect(G.player.x - lv.radius, G.player.y - lv.radius, lv.radius * 2, lv.radius * 2);
    ctx.strokeStyle = `rgba(160, 255, 180, ${pulse + 0.12})`;
    ctx.lineWidth = 1;
    const step = 14;
    for (let gx = G.player.x - lv.radius; gx <= G.player.x + lv.radius; gx += step) {
      ctx.beginPath(); ctx.moveTo(gx, G.player.y - lv.radius); ctx.lineTo(gx, G.player.y + lv.radius); ctx.stroke();
    }
    for (let gy = G.player.y - lv.radius; gy <= G.player.y + lv.radius; gy += step) {
      ctx.beginPath(); ctx.moveTo(G.player.x - lv.radius, gy); ctx.lineTo(G.player.x + lv.radius, gy); ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = `rgba(160, 255, 180, 0.5)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(G.player.x, G.player.y, lv.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 宝石（合并的大宝石体积更大，反馈更爽）
  for (const g of G.gems) {
    const bob = Math.sin(g.t) * 1.6;
    const scale = 1 + Math.min(0.9, g.value / 24);
    const w = 10 * scale, h = 13 * scale;
    ctx.drawImage(spr.gem.canvas, g.x - w / 2, g.y - h / 2 + bob, w, h);
  }

  // 道具
  for (const pu of G.pickups) {
    const bob = Math.sin(pu.t) * 2;
    const s = pu.kind === 'heal' ? spr.heal : pu.kind === 'magnet' ? spr.magnet : spr.bomb;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(pu.x, pu.y + bob, 12 + Math.sin(pu.t * 2) * 1.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.drawImage(s.canvas, pu.x - 9, pu.y - 9 + bob, 18, 18);
  }

  // 扫描线
  for (const b of G.beams) {
    const a = (b.life / b.maxLife) * 0.75;
    ctx.fillStyle = `rgba(255, 222, 90, ${a * 0.35})`;
    if (b.horizontal) {
      ctx.fillRect(0, b.pos - b.hw, G.w, b.hw * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.6})`;
      ctx.fillRect(0, b.pos - 1.5, G.w, 3);
    } else {
      ctx.fillRect(b.pos - b.hw, 0, b.hw * 2, G.h);
      ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.6})`;
      ctx.fillRect(b.pos - 1.5, 0, 3, G.h);
    }
  }

  // 敌人
  for (const e of G.enemies) {
    const s = spr[e.kind];
    ctx.drawImage(s.canvas, e.cx - s.ax, e.cy - s.ay, s.w, s.h);
    if (e.flash > 0) {
      ctx.globalAlpha = 0.55;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(e.cx, e.cy, e.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    // 精英/Boss 血条
    if ((e.kind === 'clippy' || e.kind === 'bsod') && e.hp < e.maxHp) {
      const bw = e.kind === 'bsod' ? 60 : 34;
      const bx = e.cx - bw / 2;
      const by = e.cy - e.r - 9;
      ctx.fillStyle = '#222';
      ctx.fillRect(bx, by, bw, 4);
      const ratio = Math.max(0, e.hp / e.maxHp);
      ctx.fillStyle = ratio > 0.4 ? '#4dcc4d' : '#cc4444';
      ctx.fillRect(bx, by, bw * ratio, 4);
    }
  }

  // 敌方弹幕
  for (const b of G.ebullets) {
    ctx.drawImage(spr.errBullet.canvas, b.x - 6.5, b.y - 6.5, 13, 13);
  }

  // 拦截弹
  for (const b of G.bullets) {
    ctx.drawImage(spr.blockerBullet.canvas, b.x - 7, b.y - 7, 14, 14);
  }

  // 玩家（光标）
  const blink = G.player.iFrames > 0 && Math.floor(G.player.iFrames / 4) % 2 === 0;
  if (!blink) {
    ctx.drawImage(spr.cursor.canvas, G.player.x - spr.cursor.ax, G.player.y - spr.cursor.ay, spr.cursor.w, spr.cursor.h);
  }

  // 环绕指针
  const orbit = G.weapons.find(w => w.id === 'orbit');
  if (orbit) {
    const positions = orbPositions(orbit);
    const step = (Math.PI * 2) / (orbit.evo ? WEAPONS.orbit.evoOrbit!.count : WEAPONS.orbit.orbit![orbit.level - 1].count);
    positions.forEach((o, i) => {
      const rot = G.orbAngle + step * i + Math.PI / 2;
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.rotate(rot);
      const s = orbit.evo ? 1.5 : 1;
      ctx.drawImage(spr.orbCursor.canvas, -9 * s, -2 * s, 18 * s, 22 * s);
      ctx.restore();
    });
  }

  // 粒子
  for (const pt of G.particles) {
    const a = pt.life / pt.maxLife;
    ctx.globalAlpha = a;
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, Math.max(0.4, pt.r * a), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 低血量警示（红边呼吸）
  const hpRatio = G.player.hp / maxHp();
  if (hpRatio < 0.3 && (G.phase === 'playing' || G.phase === 'paused')) {
    const a = (0.12 + 0.08 * Math.sin(G.time * 5)) * (1 - hpRatio / 0.3);
    const g = ctx.createRadialGradient(G.w / 2, G.h / 2, Math.min(G.w, G.h) * 0.32, G.w / 2, G.h / 2, Math.max(G.w, G.h) * 0.72);
    g.addColorStop(0, 'rgba(255,0,0,0)');
    g.addColorStop(1, `rgba(255,0,0,${a})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, G.w, G.h);
  }

  // 伤害数字
  ctx.textAlign = 'center';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  for (const d of G.dmgs) {
    const a = d.life / d.maxLife;
    ctx.globalAlpha = a;
    ctx.fillStyle = '#000';
    ctx.fillText(String(d.val), d.x + 1, d.y + 1);
    ctx.fillStyle = d.color;
    ctx.fillText(String(d.val), d.x, d.y);
    ctx.globalAlpha = 1;
  }

  ctx.restore();

  drawHud(ctx);

  if (G.phase === 'paused' || G.phase === 'levelup') {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, G.w, G.h);
    if (G.phase === 'paused') {
      drawPauseWithBuffs(ctx);
    }
  }
}

// 暂停画面 + 装备总览
function drawPauseWithBuffs(ctx: CanvasRenderingContext2D): void {
  const W = G.w, H = G.h;
  const cx = W / 2;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px "Microsoft YaHei", sans-serif';
  ctx.fillText('已 暂 停', cx, H * 0.16);
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  ctx.fillStyle = '#bbb';
  ctx.fillText(`存活 ${fmtTime(G.time)} · 击杀 ${G.kills} · 等级 Lv.${G.level}`, cx, H * 0.16 + 22);

  // 武器
  const left = Math.max(60, W * 0.14);
  let y = H * 0.28;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffd34d';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('武器', left, y);
  y += 20;
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  for (const w of G.weapons) {
    const def = WEAPONS[w.id];
    const name = w.evo ? `${def.evoName} ★进化` : `${def.name} Lv.${w.level}`;
    ctx.fillStyle = w.evo ? '#ffd700' : '#ffffff';
    ctx.fillText(`▸ ${name}`, left, y);
    y += 18;
  }

  // 被动
  y += 8;
  ctx.fillStyle = '#7ee787';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('被动', left, y);
  y += 20;
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  for (const id of Object.keys(PASSIVES) as PassiveId[]) {
    const p = PASSIVES[id];
    ctx.fillStyle = G.passives[id] > 0 ? '#ffffff' : '#777';
    ctx.fillText(`▸ ${p.name} Lv.${G.passives[id]}/${p.max}`, left, y);
    y += 18;
  }

  // 右列：派生属性
  const right = Math.min(W - 60, W * 0.86);
  let ry = H * 0.28;
  ctx.textAlign = 'right';
  ctx.fillStyle = '#7ec3ff';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('属性', right, ry);
  ry += 20;
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  const lines: Array<[string, string]> = [
    ['伤害', `×${(1 + G.passives.cpu * 0.15).toFixed(2)}`],
    ['冷却', `×${(1 - G.passives.ram * 0.08).toFixed(2)}`],
    ['移速', `×${(1 + G.passives.wheel * 0.1).toFixed(2)}`],
    ['最大生命', `${maxHp()}`],
    ['拾取范围', `×${(1 + G.passives.magnet * 0.35).toFixed(2)}`],
    ['经验', `${Math.floor(G.xp)}/${xpNext(G.level)}`],
  ];
  for (const [k, v] of lines) {
    ctx.fillStyle = '#999';
    ctx.fillText(k, right - 46, ry);
    ctx.fillStyle = '#fff';
    ctx.fillText(v, right, ry);
    ry += 18;
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#bbb';
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  ctx.fillText('按 P 或点击「继续」按钮返回游戏', cx, H * 0.9);
}

function drawHud(ctx: CanvasRenderingContext2D): void {
  const W = G.w;

  // XP 条（顶部通栏）
  const need = xpNext(G.level);
  const xr = Math.min(1, G.xp / need);
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, W, 14);
  ctx.fillStyle = '#1084d0';
  ctx.fillRect(0, 0, W * xr, 14);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(0, 12, W, 2);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 9px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`Lv.${G.level}`, 6, 10.5);

  // 生命条
  const hpRatio = Math.max(0, G.player.hp / maxHp());
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(6, 20, 120, 10);
  ctx.fillStyle = hpRatio > 0.4 ? '#3dcc3d' : '#e04c4c';
  ctx.fillRect(7, 21, 118 * hpRatio, 8);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 8px sans-serif';
  ctx.fillText(`${Math.ceil(G.player.hp)}/${maxHp()}`, 10, 28);

  // 计时（顶部中央）
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(W / 2 - 32, 20, 64, 16);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(fmtTime(G.time), W / 2, 31.5);

  // 击杀（右上）
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(W - 76, 20, 70, 16);
  ctx.fillStyle = '#ffd34d';
  ctx.font = 'bold 10px "Microsoft YaHei", sans-serif';
  ctx.fillText(`💀 ${G.kills}`, W - 10, 31.5);

  // Boss 血条
  if (G.bossActive) {
    const boss = G.enemies.find(e => e.kind === 'bsod');
    if (boss) {
      const bw = Math.min(320, W - 60);
      const bx = (W - bw) / 2;
      const by = 42;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(bx - 1, by - 1, bw + 2, 10);
      ctx.fillStyle = '#222';
      ctx.fillRect(bx, by, bw, 8);
      const ratio = Math.max(0, boss.hp / boss.maxHp);
      ctx.fillStyle = '#4d7bff';
      ctx.fillRect(bx, by, bw * ratio, 8);
      ctx.strokeStyle = '#c0c0c0';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx - 1, by - 1, bw + 2, 10);
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 9px "Microsoft YaHei", sans-serif';
      ctx.fillText(`蓝屏死神 Lv.${boss.bossLevel}`, W / 2, by + 18);
    }
  }

  // 无敌作弊指示
  if (G.cheatInvincible) {
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(255, 0, 255, ${0.65 + 0.35 * Math.sin(G.time * 8)})`;
    ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
    ctx.fillText('★ 无敌模式 ★', W / 2, 58);
  }

  // 登场横幅（暂停/升级面板打开时隐藏，避免与文字重叠）
  if (G.phase === 'playing') {
    ctx.textAlign = 'center';
    G.banners.forEach((b, i) => {
      const a = Math.min(1, b.life / (b.maxLife * 0.4));
      ctx.globalAlpha = a;
      ctx.fillStyle = '#000';
      ctx.font = 'bold 15px "Microsoft YaHei", sans-serif';
      ctx.fillText(b.text, W / 2 + 1, 82 + i * 22 + 1);
      ctx.fillStyle = b.color;
      ctx.fillText(b.text, W / 2, 82 + i * 22);
      ctx.globalAlpha = 1;
    });
  }

  // 武器栏（左下）
  let wx = 6;
  for (const inst of G.weapons) {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(wx, G.h - 26, 22, 22);
    ctx.strokeStyle = inst.evo ? '#ffd700' : '#8a8a8a';
    ctx.lineWidth = inst.evo ? 2 : 1;
    ctx.strokeRect(wx, G.h - 26, 22, 22);
    // 简易武器图形
    ctx.fillStyle = inst.evo ? '#ffd700' : '#cfe8ff';
    const cx = wx + 11, cy = G.h - 15;
    if (inst.id === 'orbit') {
      ctx.beginPath(); ctx.arc(cx, cy, 5.5, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill();
    } else if (inst.id === 'blocker') {
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#2a6fd6';
      ctx.fillRect(cx - 1, cy - 4, 2, 8);
    } else if (inst.id === 'scan') {
      ctx.fillRect(cx - 6, cy - 1, 12, 2);
      ctx.fillRect(cx - 1, cy - 6, 2, 12);
    } else {
      for (let gx = 0; gx < 3; gx++) {
        for (let gy = 0; gy < 3; gy++) {
          ctx.fillRect(cx - 6 + gx * 4.5, cy - 6 + gy * 4.5, 3.4, 3.4);
        }
      }
    }
    // 等级点
    ctx.fillStyle = '#fff';
    for (let l = 0; l < inst.level; l++) {
      ctx.fillRect(wx + 2 + l * 3.4, G.h - 7, 2.4, 2.4);
    }
    if (inst.evo) {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 8px sans-serif';
      ctx.fillText('★', wx + 15, G.h - 6.5);
    }
    wx += 26;
  }
}

// ============ 菜单 / 结算 ============

export function drawMenu(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(0, 0, G.w, G.h);

  if (G.menuPage === 1) drawMenuEnemies(ctx);
  else if (G.menuPage === 2) drawMenuWeapons(ctx);
  else drawMenuMain(ctx);

  // 翻页提示（三页通用）
  ctx.textAlign = 'center';
  ctx.fillStyle = '#888';
  ctx.font = '11px "Microsoft YaHei", sans-serif';
  const labels = ['图鉴 ▶', '◀ 主页 ▶', '◀ 主页'];
  ctx.fillText(labels[G.menuPage], G.w / 2, G.h - 12);
  ctx.textAlign = 'left';
  ctx.fillText('◀', 12, G.h / 2);
  ctx.textAlign = 'right';
  if (G.menuPage < 2) ctx.fillText('▶', G.w - 12, G.h / 2);
  ctx.textAlign = 'center';
}

function drawMenuMain(ctx: CanvasRenderingContext2D): void {
  const spr = getSprites();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffd34d';
  ctx.font = 'bold 30px "Microsoft YaHei", sans-serif';
  ctx.fillText('桌 面 保 卫 战', G.w / 2, G.h * 0.2);
  ctx.fillStyle = '#9adcff';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.fillText('DESKTOP DEFENSE · 幸存者肉鸽', G.w / 2, G.h * 0.2 + 22);

  const bob = Math.sin(Date.now() / 300) * 2;
  ctx.drawImage(spr.cursor.canvas, G.w / 2 - 11, G.h * 0.28 + bob, 22, 30);

  ctx.fillStyle = '#cccccc';
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  ctx.fillText('WASD / 方向键 / 拖动 移动光标 · 武器全自动', G.w / 2, G.h * 0.42);
  ctx.fillText('收集文档碎片升级 · 三选一构筑你的流派', G.w / 2, G.h * 0.42 + 20);
  ctx.fillText('活到 15:00 并击败最终蓝屏死神！', G.w / 2, G.h * 0.42 + 40);

  ctx.fillStyle = '#aaaacc';
  ctx.fillText(`最佳纪录: ${fmtTime(G.best.time)} · ${G.best.kills} 击杀`, G.w / 2, G.h * 0.58);

  if (Math.sin(Date.now() / 260) > 0) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 17px "Microsoft YaHei", sans-serif';
    ctx.fillText('按 Enter 或点击画面开始', G.w / 2, G.h * 0.7);
  }
}

// 第 2 页：怪物图鉴
function drawMenuEnemies(ctx: CanvasRenderingContext2D): void {
  const spr = getSprites();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ff8a8a';
  ctx.font = 'bold 20px "Microsoft YaHei", sans-serif';
  ctx.fillText('怪 物 图 鉴', G.w / 2, G.h * 0.1);

  const entries: Array<{ s: import('./sprites').Sprite; name: string; desc: string; color: string }> = [
    { s: spr.virus, name: '病毒', desc: '数量最多的炮灰，贴身啃咬', color: '#ff6b6b' },
    { s: spr.worm, name: '蠕虫', desc: '蛇形高速突进，别站桩', color: '#7ddf6a' },
    { s: spr.popup, name: '弹窗广告', desc: '慢速肉盾，血厚难缠', color: '#ffd34d' },
    { s: spr.rogue, name: '流氓软件', desc: '重装单位，接触伤害高', color: '#c88cff' },
    { s: spr.clippy, name: '大眼夹（精英）', desc: '蓄力冲刺，掉落补给', color: '#f5f5ff' },
    { s: spr.bsod, name: '蓝屏死神（Boss）', desc: '4/9/15 分钟降临，弹幕+召唤', color: '#7fbfff' },
  ];

  const colW = G.w / 2;
  entries.forEach((e, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = colW / 2 + col * colW;
    const y = G.h * 0.18 + row * (G.h * 0.26);
    const scale = e.s === spr.bsod ? 0.72 : 1.05;
    ctx.drawImage(e.s.canvas, x - (e.s.w * scale) / 2, y - (e.s.h * scale) / 2 - 4, e.s.w * scale, e.s.h * scale);
    ctx.fillStyle = e.color;
    ctx.font = 'bold 13px "Microsoft YaHei", sans-serif';
    ctx.fillText(e.name, x, y + 28);
    ctx.fillStyle = '#bbbbbb';
    ctx.font = '10px "Microsoft YaHei", sans-serif';
    // 描述自动换行（两行）
    wrapText(ctx, e.desc, x, y + 44, colW - 30, 13);
  });
}

// 第 3 页：武器与被动
function drawMenuWeapons(ctx: CanvasRenderingContext2D): void {
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9adcff';
  ctx.font = 'bold 20px "Microsoft YaHei", sans-serif';
  ctx.fillText('武 器 & 被 动', G.w / 2, G.h * 0.09);

  const weapons: Array<[string, string, string]> = [
    ['环绕指针', '四叶旋风', '光标环绕撞击，进化后 8 枚旋风'],
    ['弹窗拦截', '拦截风暴', '自动索敌弹，进化后无限穿透'],
    ['杀毒扫描', '全盘格式化', '十字扫描线，范围清屏伤害'],
    ['磁盘整理', '整理风暴', '灼烧光环，进化后减速敌人'],
  ];
  let y = G.h * 0.15;
  weapons.forEach(([name, evo, desc], i) => {
    const x = G.w / 2 + (i % 2 === 0 ? -1 : 1) * (G.w * 0.24);
    const yy = y + Math.floor(i / 2) * (G.h * 0.17);
    ctx.fillStyle = '#cfe8ff';
    ctx.font = 'bold 13px "Microsoft YaHei", sans-serif';
    ctx.fillText(`${name} → ${evo}`, x, yy);
    ctx.fillStyle = '#999';
    ctx.font = '10px "Microsoft YaHei", sans-serif';
    wrapText(ctx, desc, x, yy + 16, G.w * 0.42, 13);
  });

  y = G.h * 0.56;
  ctx.fillStyle = '#7ee787';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— 被动（每级三档）——', G.w / 2, y);
  y += 24;
  const passives: Array<[string, string]> = [
    ['CPU 超频', '伤害 +15%/级'],
    ['内存优化', '冷却 -8%/级'],
    ['滚轮狂飙', '移速 +10%/级'],
    ['UPS 电源', '生命上限 +20/级'],
    ['磁盘磁铁', '拾取范围 +35%/级'],
  ];
  ctx.font = '11px "Microsoft YaHei", sans-serif';
  passives.forEach(([n, d], i) => {
    const col = i % 2;
    const x = G.w / 2 + (col === 0 ? -1 : 1) * (G.w * 0.22);
    const yy = y + Math.floor(i / 2) * 30;
    ctx.fillStyle = '#7ee787';
    ctx.fillText(`${n} · ${d}`, x, yy);
  });

  ctx.fillStyle = '#888';
  ctx.font = '10px "Microsoft YaHei", sans-serif';
  ctx.fillText('道具：咖啡回血 · 磁盘磁铁吸宝石 · 回收站清屏', G.w / 2, G.h - 34);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number): void {
  let line = '';
  let yy = y;
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxW) {
      ctx.fillText(line, x, yy);
      line = ch;
      yy += lineH;
    } else {
      line += ch;
    }
  }
  ctx.fillText(line, x, yy);
}

export function drawEnd(ctx: CanvasRenderingContext2D, victory: boolean): void {
  ctx.fillStyle = 'rgba(0,0,0,0.76)';
  ctx.fillRect(0, 0, G.w, G.h);

  ctx.textAlign = 'center';
  ctx.fillStyle = victory ? '#7dff8a' : '#ff5c5c';
  ctx.font = 'bold 30px "Microsoft YaHei", sans-serif';
  ctx.fillText(victory ? '桌面保卫成功！' : '光标 已 阵 亡', G.w / 2, G.h * 0.32);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`存活 ${fmtTime(G.time)}  ·  击杀 ${G.kills}  ·  等级 Lv.${G.level}`, G.w / 2, G.h * 0.32 + 46);

  const isBest = G.time >= G.best.time && G.kills >= G.best.kills;
  if (isBest) {
    ctx.fillStyle = `rgba(255,220,50,${0.7 + 0.3 * Math.sin(Date.now() / 200)})`;
    ctx.font = 'bold 15px "Microsoft YaHei", sans-serif';
    ctx.fillText('🏆 新纪录！', G.w / 2, G.h * 0.32 + 76);
  }

  ctx.fillStyle = '#cccccc';
  ctx.font = '12px "Microsoft YaHei", sans-serif';
  const owned = G.weapons.map(w => {
    const def = WEAPONS[w.id as WeaponId];
    return w.evo ? `${def.evoName}★` : `${def.name} Lv.${w.level}`;
  }).join(' · ');
  wrapText(ctx, owned, G.w / 2, G.h * 0.32 + 106, G.w - 40, 16);

  if (Math.sin(Date.now() / 260) > 0) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
    ctx.fillText('按 Enter 或点击画面再来一局', G.w / 2, G.h * 0.32 + 150);
  }
}

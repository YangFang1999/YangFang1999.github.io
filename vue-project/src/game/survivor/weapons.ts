// 桌面保卫战 — 武器系统：4 种武器 × 5 级 + 进化 + 被动加成
import { WEAPONS } from './config';
import { spawnDmg } from './fx';
import { cdMult, dmgMult, G } from './state';
import { clamp, rand } from '../utils';
import type { Enemy, WeaponInst } from './types';

// 对敌人造成伤害（击退方向 = 攻击来源方向）
export function damageEnemy(e: Enemy, dmg: number, srcX: number, srcY: number, color: string): void {
  if (e.hp <= 0) return; // 已死亡的敌人跳过（防止尸体重复结算）
  e.hp -= dmg;
  e.flash = 6;
  const dx = e.cx - srcX, dy = e.cy - srcY;
  const d = Math.sqrt(dx * dx + dy * dy) || 1;
  const kb = e.kind === 'bsod' ? 0.4 : e.kind === 'clippy' || e.kind === 'rogue' ? 1 : 2.2;
  e.kvx += (dx / d) * kb;
  e.kvy += (dy / d) * kb;
  spawnDmg(e.cx + rand(-6, 6), e.cy - e.r - 4, dmg, color);
  if (e.hp <= 0) {
    killEnemy(e);
  }
}

export function killEnemy(e: Enemy): void {
  // 标记死亡，主循环统一清理并结算掉落
  e.hp = 0;
  e.flash = -999;
}

// 环绕指针的当前轨道位置（渲染与碰撞共用）
export function orbPositions(inst: WeaponInst): Array<{ x: number; y: number }> {
  const def = WEAPONS.orbit;
  const lv = inst.evo ? def.evoOrbit! : def.orbit![inst.level - 1];
  const out: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < lv.count; i++) {
    const a = G.orbAngle + (Math.PI * 2 / lv.count) * i;
    out.push({
      x: G.player.x + Math.cos(a) * lv.radius,
      y: G.player.y + Math.sin(a) * lv.radius,
    });
  }
  return out;
}

function nearestEnemy(x: number, y: number): Enemy | null {
  let best: Enemy | null = null;
  let bestD = Infinity;
  for (const e of G.enemies) {
    if (e.hp <= 0) continue;
    // 只索敌已进入画面的敌人，避免拦截弹朝屏幕外放空枪
    if (e.cx < -5 || e.cx > G.w + 5 || e.cy < -5 || e.cy > G.h + 5) continue;
    const dx = e.cx - x, dy = e.cy - y;
    const d = dx * dx + dy * dy;
    if (d < bestD) { bestD = d; best = e; }
  }
  return best;
}

function fireBlocker(inst: WeaponInst): void {
  const def = WEAPONS.blocker;
  const lv = inst.evo ? def.evoBlocker! : def.blocker![inst.level - 1];
  for (let i = 0; i < lv.count; i++) {
    const target = nearestEnemy(G.player.x, G.player.y);
    if (!target) return;
    const a = Math.atan2(target.cy - G.player.y, target.cx - G.player.x) + (i > 0 ? rand(-0.35, 0.35) : 0);
    G.bullets.push({
      x: G.player.x, y: G.player.y,
      vx: Math.cos(a) * lv.speed, vy: Math.sin(a) * lv.speed,
      dmg: lv.dmg * dmgMult(), pierce: lv.pierce, life: 120,
    });
  }
}

function fireScan(inst: WeaponInst): void {
  const def = WEAPONS.scan;
  const lv = inst.evo ? def.evoScan! : def.scan![inst.level - 1];
  const dmg = lv.dmg * dmgMult();
  const hw = lv.hw;
  // 横线（玩家所在 y）+ 竖线（玩家所在 x）
  for (const e of G.enemies) {
    if (Math.abs(e.cy - G.player.y) <= hw + e.r) {
      damageEnemy(e, dmg, e.cx, G.player.y, '#ffd34d');
      if (inst.evo) { e.speed *= 0.999; } // 进化版微减速（叠乘自然收敛）
    }
    if (Math.abs(e.cx - G.player.x) <= hw + e.r) {
      damageEnemy(e, dmg, G.player.x, e.cy, '#ffd34d');
    }
  }
  G.beams.push(
    { horizontal: true, pos: G.player.y, hw, life: 20, maxLife: 20 },
    { horizontal: false, pos: G.player.x, hw, life: 20, maxLife: 20 },
  );
  G.shake = Math.max(G.shake, 4);
}

function fireAura(inst: WeaponInst): void {
  const def = WEAPONS.aura;
  const lv = inst.evo ? def.evoAura! : def.aura![inst.level - 1];
  const dmg = lv.dmg * dmgMult();
  const r2 = lv.radius * lv.radius;
  for (const e of G.enemies) {
    const dx = e.cx - G.player.x, dy = e.cy - G.player.y;
    if (dx * dx + dy * dy <= r2 + e.r * e.r) {
      damageEnemy(e, dmg, G.player.x, G.player.y, '#8fffa0');
      if (lv.slow < 1) { e.speed = Math.max(0.15, e.speed * 0.995); }
    }
  }
}

function weaponLevel(inst: WeaponInst): { cd: number } {
  const def = WEAPONS[inst.id];
  if (inst.id === 'blocker') {
    const lv = inst.evo ? def.evoBlocker! : def.blocker![inst.level - 1];
    return { cd: lv.cd };
  }
  if (inst.id === 'scan') {
    const lv = inst.evo ? def.evoScan! : def.scan![inst.level - 1];
    return { cd: lv.cd };
  }
  if (inst.id === 'aura') {
    const lv = inst.evo ? def.evoAura! : def.aura![inst.level - 1];
    return { cd: lv.tick };
  }
  return { cd: 0 };
}

export function updateWeapons(dt: number): void {
  const cm = cdMult();

  for (const inst of G.weapons) {
    if (inst.id === 'orbit') {
      const def = WEAPONS.orbit;
      const lv = inst.evo ? def.evoOrbit! : def.orbit![inst.level - 1];
      G.orbAngle += lv.spin * dt;
      const positions = orbPositions(inst);
      const orbR = inst.evo ? 11 : 8;
      for (const e of G.enemies) {
        if (e.orbCd > 0) { e.orbCd -= dt; continue; }
        for (const o of positions) {
          const dx = e.cx - o.x, dy = e.cy - o.y;
          if (dx * dx + dy * dy <= (orbR + e.r) * (orbR + e.r)) {
            damageEnemy(e, lv.dmg * dmgMult(), o.x, o.y, '#ffffff');
            e.orbCd = lv.orbCd;
            break;
          }
        }
      }
      continue;
    }

    inst.cd -= dt;
    if (inst.cd > 0) continue;
    const base = weaponLevel(inst).cd;
    inst.cd = base * cm;

    if (inst.id === 'blocker') fireBlocker(inst);
    else if (inst.id === 'scan') fireScan(inst);
    else if (inst.id === 'aura') fireAura(inst);
  }

  // 玩家拦截弹（追踪最近敌人）
  for (const b of G.bullets) {
    const target = nearestEnemy(b.x, b.y);
    if (target) {
      const a = Math.atan2(target.cy - b.y, target.cx - b.x);
      // 缓慢转向
      const cur = Math.atan2(b.vy, b.vx);
      let diff = a - cur;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      const na = cur + clamp(diff, -0.09 * dt, 0.09 * dt);
      const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      b.vx = Math.cos(na) * sp;
      b.vy = Math.sin(na) * sp;
    }
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    for (const e of G.enemies) {
      const dx = e.cx - b.x, dy = e.cy - b.y;
      const rr = e.r + 5;
      if (dx * dx + dy * dy <= rr * rr) {
        damageEnemy(e, b.dmg, b.x - b.vx, b.y - b.vy, '#7ec3ff');
        b.pierce--;
        if (b.pierce <= 0) { b.life = 0; break; }
      }
    }
  }
  G.bullets = G.bullets.filter(b =>
    b.life > 0 && b.x > -30 && b.x < G.w + 30 && b.y > -30 && b.y < G.h + 30);
}

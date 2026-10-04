// 预渲染精灵：把每帧重复创建的渐变/路径一次性烘焙到离屏 canvas，
// 运行时只做 drawImage，避免大量 GC 与路径构建开销。
// 精灵按 2x 烘焙，在 devicePixelRatio ≤ 2 的屏幕上保持锐利。

export interface Sprite {
  canvas: HTMLCanvasElement;
  w: number;   // 逻辑尺寸
  h: number;
  ax: number;  // 锚点：实体中心在精灵内的逻辑坐标
  ay: number;
}

const SS = 2; // bake scale

export function makeSprite(
  w: number, h: number, ax: number, ay: number,
  draw: (c: CanvasRenderingContext2D) => void,
): Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(w * SS);
  canvas.height = Math.ceil(h * SS);
  const c = canvas.getContext('2d')!;
  c.scale(SS, SS);
  c.translate(ax, ay);
  draw(c);
  return { canvas, w, h, ax, ay };
}

export function drawSprite(
  ctx: CanvasRenderingContext2D, spr: Sprite, cx: number, cy: number, scale = 1,
): void {
  if (scale === 1) {
    ctx.drawImage(spr.canvas, cx - spr.ax, cy - spr.ay, spr.w, spr.h);
  } else {
    ctx.drawImage(spr.canvas, cx - spr.ax * scale, cy - spr.ay * scale, spr.w * scale, spr.h * scale);
  }
}

// ============ 子弹 ============

function bakePlayerBullet(): Sprite {
  return makeSprite(16, 16, 8, 8, (c) => {
    const g = c.createRadialGradient(0, 0, 1, 0, 0, 6);
    g.addColorStop(0, 'rgba(255, 255, 200, 0.7)');
    g.addColorStop(0.5, 'rgba(255, 220, 100, 0.3)');
    g.addColorStop(1, 'rgba(255, 150, 50, 0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(0, 0, 6, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffdd44';
    c.beginPath(); c.arc(0, 0, 3, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(0, 0, 1.5, 0, Math.PI * 2); c.fill();
  });
}

function bakeEnemyBullet(rGlow: number, rBall: number, rCore: number): Sprite {
  const size = Math.ceil(rGlow * 2 + 2);
  return makeSprite(size, size, size / 2, size / 2, (c) => {
    c.fillStyle = 'rgba(255, 80, 80, 0.3)';
    c.beginPath(); c.arc(0, 0, rGlow, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ff4444';
    c.beginPath(); c.arc(0, 0, rBall, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffaaaa';
    c.beginPath(); c.arc(0, 0, rCore, 0, Math.PI * 2); c.fill();
  });
}

// ============ 星点 ============

function bakeStarDot(rgb: string): Sprite {
  return makeSprite(8, 8, 4, 4, (c) => {
    c.fillStyle = rgb;
    c.beginPath(); c.arc(0, 0, 3.5, 0, Math.PI * 2); c.fill();
  });
}

function bakeStarGlow(): Sprite {
  return makeSprite(12, 12, 6, 6, (c) => {
    const g = c.createRadialGradient(0, 0, 0, 0, 0, 6);
    g.addColorStop(0, 'rgba(180, 200, 255, 0.5)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(0, 0, 6, 0, Math.PI * 2); c.fill();
  });
}

// ============ 玩家战机（静态部分；尾焰动态绘制） ============

function bakePlayerShip(): Sprite {
  return makeSprite(36, 46, 18, 19, (c) => {
    const engineGlow = c.createRadialGradient(0, 14, 2, 0, 16, 10);
    engineGlow.addColorStop(0, 'rgba(255, 150, 50, 0.7)');
    engineGlow.addColorStop(1, 'rgba(255, 50, 20, 0)');
    c.fillStyle = engineGlow;
    c.beginPath(); c.arc(0, 14, 10, 0, Math.PI * 2); c.fill();

    c.fillStyle = '#4488ff';
    c.beginPath();
    c.moveTo(0, -18); c.lineTo(-10, 14); c.lineTo(-6, 10);
    c.lineTo(6, 10); c.lineTo(10, 14);
    c.closePath(); c.fill();

    c.fillStyle = '#66aaff';
    c.beginPath();
    c.moveTo(0, -16); c.lineTo(-3, 6); c.lineTo(3, 6);
    c.closePath(); c.fill();

    c.fillStyle = '#5588bb';
    c.beginPath(); c.moveTo(-7, 0); c.lineTo(-16, 8); c.lineTo(-7, 8); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(7, 0); c.lineTo(16, 8); c.lineTo(7, 8); c.closePath(); c.fill();

    const cockpit = c.createRadialGradient(0, -5, 1, 0, -4, 5);
    cockpit.addColorStop(0, '#ffffff');
    cockpit.addColorStop(0.5, '#aaddff');
    cockpit.addColorStop(1, '#4488cc');
    c.fillStyle = cockpit;
    c.beginPath(); c.arc(0, -4, 5, 0, Math.PI * 2); c.fill();
  });
}

// ============ 敌机 ============

function bakeSmallEnemy(): Sprite {
  return makeSprite(34, 26, 17, 13, (c) => {
    c.fillStyle = '#ff3344';
    c.beginPath();
    c.moveTo(0, 12); c.lineTo(-12, -10); c.lineTo(12, -10);
    c.closePath(); c.fill();

    c.fillStyle = '#ff6677';
    c.beginPath();
    c.moveTo(0, 2); c.lineTo(-6, -7); c.lineTo(6, -7);
    c.closePath(); c.fill();

    c.fillStyle = '#ff8899';
    c.beginPath(); c.arc(0, -3, 4, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffccdd';
    c.beginPath(); c.arc(1, -4, 1.5, 0, Math.PI * 2); c.fill();

    c.fillStyle = '#cc1122';
    c.beginPath(); c.moveTo(-10, -4); c.lineTo(-15, 3); c.lineTo(-6, 1); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(10, -4); c.lineTo(15, 3); c.lineTo(6, 1); c.closePath(); c.fill();

    c.strokeStyle = '#881122';
    c.lineWidth = 1;
    c.beginPath(); c.moveTo(0, 12); c.lineTo(-12, -10); c.lineTo(12, -10); c.closePath(); c.stroke();
  });
}

function bakeMediumEnemy(): Sprite {
  return makeSprite(38, 36, 19, 18, (c) => {
    const r = 16;
    c.fillStyle = '#ff7722';
    c.beginPath();
    c.moveTo(0, -r); c.lineTo(r, 0); c.lineTo(0, r); c.lineTo(-r, 0);
    c.closePath(); c.fill();

    c.fillStyle = '#ff9944';
    c.beginPath();
    c.moveTo(0, -r); c.lineTo(r * 0.5, 0); c.lineTo(0, r * 0.5); c.lineTo(-r * 0.5, 0);
    c.closePath(); c.fill();

    c.fillStyle = '#cc5500';
    c.beginPath(); c.moveTo(-8, -8); c.lineTo(-17, 2); c.lineTo(-8, 2); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(8, -8); c.lineTo(17, 2); c.lineTo(8, 2); c.closePath(); c.fill();

    c.fillStyle = '#ffffff';
    c.beginPath(); c.arc(0, 0, 6, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ff0000';
    c.beginPath(); c.arc(0, 0, 3, 0, Math.PI * 2); c.fill();

    c.strokeStyle = '#993300';
    c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(0, -r); c.lineTo(r, 0); c.lineTo(0, r); c.lineTo(-r, 0); c.closePath(); c.stroke();
  });
}

function bakeLargeEnemy(): Sprite {
  return makeSprite(44, 48, 22, 24, (c) => {
    const r = 22;
    c.fillStyle = '#8844cc';
    c.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (Math.PI / 3) * i;
      const px = r * Math.cos(a), py = r * Math.sin(a);
      i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
    }
    c.closePath(); c.fill();

    c.fillStyle = '#6622aa';
    c.beginPath();
    c.moveTo(-14, -6); c.lineTo(14, -6); c.lineTo(6, 6); c.lineTo(-6, 6);
    c.closePath(); c.fill();

    c.fillStyle = '#aa66ee';
    c.beginPath();
    c.moveTo(-8, -12); c.lineTo(8, -12); c.lineTo(4, -6); c.lineTo(-4, -6);
    c.closePath(); c.fill();

    c.fillStyle = '#ff66ff';
    c.beginPath(); c.arc(0, 0, 7, 0, Math.PI * 2); c.fill();
    const core = c.createRadialGradient(0, 0, 1, 0, 0, 7);
    core.addColorStop(0, '#ffffff');
    core.addColorStop(0.4, '#ffccff');
    core.addColorStop(1, '#ff66ff');
    c.fillStyle = core;
    c.beginPath(); c.arc(0, 0, 7, 0, Math.PI * 2); c.fill();

    c.fillStyle = '#440088';
    c.fillRect(-19, -2, 6, 4);
    c.fillRect(13, -2, 6, 4);

    c.strokeStyle = '#330066';
    c.lineWidth = 2;
    c.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 6 + (Math.PI / 3) * i;
      const px = r * Math.cos(a), py = r * Math.sin(a);
      i === 0 ? c.moveTo(px, py) : c.lineTo(px, py);
    }
    c.closePath(); c.stroke();
  });
}

function bakeEliteEnemy(): Sprite {
  return makeSprite(74, 48, 37, 24, (c) => {
    c.fillStyle = '#cc2233';
    c.beginPath();
    c.moveTo(-33, 22); c.lineTo(-13, -22); c.lineTo(13, -22); c.lineTo(33, 22);
    c.closePath(); c.fill();

    c.fillStyle = '#ee4455';
    c.beginPath();
    c.moveTo(-6, -18); c.lineTo(6, -18); c.lineTo(16, 8); c.lineTo(-16, 8);
    c.closePath(); c.fill();

    c.fillStyle = '#881122';
    c.beginPath(); c.moveTo(-16, 4); c.lineTo(-35, 14); c.lineTo(-16, 18); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(16, 4); c.lineTo(35, 14); c.lineTo(16, 18); c.closePath(); c.fill();

    c.fillStyle = '#ff4444';
    c.beginPath(); c.arc(0, -3, 7, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffff00';
    c.beginPath(); c.arc(0, -3, 2.5, 0, Math.PI * 2); c.fill();
  });
}

// Boss 有两个配色：普通 / 狂暴（lv≥5 或阶段 3 也用狂暴配色）
function bakeBoss(enraged: boolean): Sprite {
  return makeSprite(100, 116, 50, 32, (c) => {
    // 引擎光晕
    const aura = c.createRadialGradient(0, 30, 10, 0, 30, 50);
    aura.addColorStop(0, enraged ? 'rgba(255, 60, 20, 0.5)' : 'rgba(200, 80, 40, 0.4)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    c.fillStyle = aura;
    c.beginPath(); c.arc(0, 30, 50, 0, Math.PI * 2); c.fill();

    // 主舰体
    c.fillStyle = enraged ? '#331144' : '#1a2244';
    c.beginPath();
    c.moveTo(0, -32); c.lineTo(-14, -18); c.lineTo(-36, -6); c.lineTo(-40, 14);
    c.lineTo(-24, 30); c.lineTo(0, 22); c.lineTo(24, 30); c.lineTo(40, 14);
    c.lineTo(36, -6); c.lineTo(14, -18);
    c.closePath(); c.fill();

    // 装甲板
    c.fillStyle = enraged ? '#442266' : '#223366';
    c.beginPath();
    c.moveTo(-10, -24); c.lineTo(-24, -4); c.lineTo(-30, 10); c.lineTo(-18, 20);
    c.lineTo(0, 16); c.lineTo(18, 20); c.lineTo(30, 10); c.lineTo(24, -4); c.lineTo(10, -24);
    c.closePath(); c.fill();

    // 中央脊线
    c.fillStyle = enraged ? '#553388' : '#334488';
    c.beginPath();
    c.moveTo(0, -26); c.lineTo(-6, -10); c.lineTo(-12, 8); c.lineTo(0, 14);
    c.lineTo(12, 8); c.lineTo(6, -10);
    c.closePath(); c.fill();

    // 侧翼炮
    c.fillStyle = '#111133';
    c.beginPath();
    c.moveTo(-36, -6); c.lineTo(-46, -10); c.lineTo(-44, 0); c.lineTo(-34, 4);
    c.closePath(); c.fill();
    c.beginPath();
    c.moveTo(36, -6); c.lineTo(46, -10); c.lineTo(44, 0); c.lineTo(34, 4);
    c.closePath(); c.fill();

    c.fillStyle = '#ff6622';
    c.fillRect(-47, -10, 5, 3);
    c.fillRect(42, -10, 5, 3);

    // 中央之眼（瞳孔动态绘制）
    const eye = c.createRadialGradient(0, 0, 3, 0, 0, 14);
    const eyeColor = enraged ? 'rgba(255, 40, 40' : 'rgba(255, 80, 60';
    eye.addColorStop(0, '#ffffff');
    eye.addColorStop(0.2, `${eyeColor}, 0.9)`);
    eye.addColorStop(0.6, `${eyeColor}, 0.4)`);
    eye.addColorStop(1, 'rgba(0, 0, 0, 0)');
    c.fillStyle = eye;
    c.beginPath(); c.arc(0, 0, 14, 0, Math.PI * 2); c.fill();
  });
}

// ============ 精灵缓存 ============

export interface SpriteBank {
  playerBullet: Sprite;
  enemyBulletBig: Sprite;
  enemyBulletSmall: Sprite;
  starFar: Sprite;
  starMid: Sprite;
  starNear: Sprite;
  starGlow: Sprite;
  playerShip: Sprite;
  small: Sprite;
  medium: Sprite;
  large: Sprite;
  elite: Sprite;
  boss: Sprite;
  bossEnraged: Sprite;
}

let bank: SpriteBank | null = null;

export function getSprites(): SpriteBank {
  if (!bank) {
    bank = {
      playerBullet: bakePlayerBullet(),
      enemyBulletBig: bakeEnemyBullet(6, 4, 2),
      enemyBulletSmall: bakeEnemyBullet(4, 2.5, 1),
      starFar: bakeStarDot('rgb(180, 190, 255)'),
      starMid: bakeStarDot('rgb(200, 210, 255)'),
      starNear: bakeStarDot('rgb(220, 230, 255)'),
      starGlow: bakeStarGlow(),
      playerShip: bakePlayerShip(),
      small: bakeSmallEnemy(),
      medium: bakeMediumEnemy(),
      large: bakeLargeEnemy(),
      elite: bakeEliteEnemy(),
      boss: bakeBoss(false),
      bossEnraged: bakeBoss(true),
    };
  }
  return bank;
}

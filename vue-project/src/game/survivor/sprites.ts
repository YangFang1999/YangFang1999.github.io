// 桌面保卫战 — 预渲染精灵（2x 烘焙）
import { makeSprite, type Sprite } from '../sprites';

export type { Sprite };

export interface SurvivorSprites {
  cursor: Sprite;        // 玩家（白色箭头光标，朝上）
  orbCursor: Sprite;     // 环绕指针（小号，蓝色）
  blockerBullet: Sprite; // 拦截弹（小盾牌/X）
  gem: Sprite;           // XP 文档碎片
  heal: Sprite;          // 咖啡
  magnet: Sprite;        // 磁盘磁铁
  bomb: Sprite;          // 回收站
  virus: Sprite;
  worm: Sprite;
  popup: Sprite;
  rogue: Sprite;
  clippy: Sprite;
  bsod: Sprite;
  errBullet: Sprite;     // Boss 弹幕（错误对话框）
}

function bakeCursor(): Sprite {
  // 经典白色箭头，尖朝上，锚点在尖端
  return makeSprite(22, 30, 11, 2, (c) => {
    c.lineWidth = 1.5;
    c.strokeStyle = '#111';
    c.fillStyle = '#ffffff';
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(7.5, 19);
    c.lineTo(3, 17);
    c.lineTo(1.5, 22.5);
    c.lineTo(-1.5, 21.5);
    c.lineTo(0, 16);
    c.lineTo(-4.5, 17.5);
    c.closePath();
    c.fill();
    c.stroke();
  });
}

function bakeOrbCursor(): Sprite {
  return makeSprite(18, 22, 9, 2, (c) => {
    c.lineWidth = 1.2;
    c.strokeStyle = '#0a3a8a';
    c.fillStyle = '#69b7ff';
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(6, 15);
    c.lineTo(2.4, 13.6);
    c.lineTo(1.2, 18);
    c.lineTo(-1.2, 17.2);
    c.lineTo(0, 13);
    c.lineTo(-3.6, 14);
    c.closePath();
    c.fill();
    c.stroke();
  });
}

function bakeBlocker(): Sprite {
  return makeSprite(14, 14, 7, 7, (c) => {
    c.fillStyle = '#2a6fd6';
    c.beginPath(); c.arc(0, 0, 6, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#fff';
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(-2.6, -2.6); c.lineTo(2.6, 2.6);
    c.moveTo(2.6, -2.6); c.lineTo(-2.6, 2.6);
    c.stroke();
  });
}

function bakeGem(): Sprite {
  return makeSprite(10, 13, 5, 6.5, (c) => {
    c.fillStyle = '#5ad0ff';
    c.fillRect(-3, -5.5, 6, 11);
    c.fillStyle = '#c9f1ff';
    c.fillRect(-1.6, -4, 3.2, 3);
    c.strokeStyle = 'rgba(255,255,255,0.85)';
    c.lineWidth = 0.8;
    c.strokeRect(-3, -5.5, 6, 11);
  });
}

function bakeHeal(): Sprite {
  return makeSprite(18, 18, 9, 9, (c) => {
    // 咖啡杯
    c.fillStyle = '#f5f0e6';
    c.fillRect(-5, -5, 10, 10);
    c.strokeStyle = '#4a3020';
    c.lineWidth = 1.2;
    c.strokeRect(-5, -5, 10, 10);
    c.beginPath();
    c.arc(6.5, 0, 3, -Math.PI / 2, Math.PI / 2);
    c.stroke();
    c.fillStyle = '#8a5a2a';
    c.fillRect(-4, -4, 8, 2.5);
    // 热气
    c.strokeStyle = 'rgba(255,255,255,0.7)';
    c.beginPath();
    c.moveTo(-2, -8); c.quadraticCurveTo(0, -10, -1, -12);
    c.stroke();
  });
}

function bakeMagnet(): Sprite {
  return makeSprite(18, 18, 9, 9, (c) => {
    c.strokeStyle = '#d43a3a';
    c.lineWidth = 4.5;
    c.beginPath();
    c.arc(0, 1, 5.5, Math.PI, 0);
    c.stroke();
    c.fillStyle = '#888';
    c.fillRect(-7.75, 1, 4.5, 5);
    c.fillRect(3.25, 1, 4.5, 5);
  });
}

function bakeBomb(): Sprite {
  return makeSprite(18, 18, 9, 9, (c) => {
    // 回收站
    c.fillStyle = '#b9c4c9';
    c.beginPath();
    c.moveTo(-5, -4); c.lineTo(5, -4); c.lineTo(4, 7); c.lineTo(-4, 7);
    c.closePath(); c.fill();
    c.fillStyle = '#7d8a90';
    c.fillRect(-5.8, -6.5, 11.6, 2.4);
    c.strokeStyle = '#5a666c';
    c.lineWidth = 0.9;
    for (let i = -3; i <= 3; i += 2) {
      c.beginPath(); c.moveTo(i, -3); c.lineTo(i, 6); c.stroke();
    }
  });
}

function bakeVirus(): Sprite {
  return makeSprite(24, 24, 12, 12, (c) => {
    // 红色带刺病毒球 + 凶眼
    c.fillStyle = '#d92b2b';
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i;
      const sx = Math.cos(a) * 8.5, sy = Math.sin(a) * 8.5;
      c.beginPath();
      c.arc(sx, sy, 2.6, 0, Math.PI * 2);
      c.fill();
    }
    c.beginPath(); c.arc(0, 0, 8, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#ffdcdc';
    c.beginPath(); c.arc(-2.8, -1, 2.4, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(2.8, -1, 2.4, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#000';
    c.beginPath(); c.arc(-2.8, -0.6, 1.1, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(2.8, -0.6, 1.1, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#7a1010';
    c.lineWidth = 1.4;
    c.beginPath(); c.arc(0, 2.6, 3.2, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke();
  });
}

function bakeWorm(): Sprite {
  return makeSprite(28, 14, 14, 7, (c) => {
    c.fillStyle = '#4fae3d';
    for (let i = 2; i >= 0; i--) {
      c.beginPath();
      c.arc(i * 8 - 8, i === 1 ? -1.5 : 0, 5 - i * 0.6, 0, Math.PI * 2);
      c.fill();
    }
    c.fillStyle = '#a8e69a';
    c.beginPath(); c.arc(8, 0, 5, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#000';
    c.beginPath(); c.arc(9.6, -1.6, 1, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(9.6, 1.6, 1, 0, Math.PI * 2); c.fill();
  });
}

function bakePopup(): Sprite {
  // 迷你弹窗：灰窗体 + 蓝标题条 + 红叉 + 感叹号
  return makeSprite(30, 26, 15, 13, (c) => {
    c.fillStyle = '#c8c8c8';
    c.fillRect(-13, -11, 26, 22);
    c.strokeStyle = '#0a0a0a';
    c.lineWidth = 1;
    c.strokeRect(-13, -11, 26, 22);
    c.fillStyle = '#000080';
    c.fillRect(-13, -11, 26, 5.5);
    c.fillStyle = '#d22';
    c.fillRect(8.5, -10.5, 4, 4.5);
    c.fillStyle = '#fff';
    c.font = 'bold 5px sans-serif';
    c.textAlign = 'center';
    c.fillText('×', 10.5, -6.4);
    c.fillStyle = '#e8b90c';
    c.beginPath();
    c.moveTo(0, -3); c.lineTo(3.4, 3.4); c.lineTo(-3.4, 3.4);
    c.closePath(); c.fill();
    c.fillStyle = '#000';
    c.fillRect(-0.6, -1.6, 1.3, 2.8);
    c.fillRect(-0.6, 1.8, 1.3, 1.1);
  });
}

function bakeRogue(): Sprite {
  // 流氓软件：带进度条的窗口
  return makeSprite(38, 32, 19, 16, (c) => {
    c.fillStyle = '#c0c0c0';
    c.fillRect(-17, -14, 34, 28);
    c.strokeStyle = '#0a0a0a';
    c.lineWidth = 1.2;
    c.strokeRect(-17, -14, 34, 28);
    c.fillStyle = '#1084d0';
    c.fillRect(-17, -14, 34, 6);
    c.fillStyle = '#fff';
    c.font = 'bold 4.5px sans-serif';
    c.textAlign = 'left';
    c.fillText('免费下载', -15, -9.6);
    c.fillStyle = '#fff';
    c.fillRect(-14, -4, 28, 6);
    c.fillStyle = '#2db02d';
    c.fillRect(-13, -3, 18, 4);
    c.fillStyle = '#333';
    c.font = '4.5px sans-serif';
    c.textAlign = 'center';
    c.fillText('即将完成...', 0, 8.5);
  });
}

function bakeClippy(): Sprite {
  // 大眼夹：曲别针 + 大眼睛（精英）
  return makeSprite(32, 36, 16, 18, (c) => {
    c.strokeStyle = '#c9c9d6';
    c.lineWidth = 3.4;
    c.lineJoin = 'round';
    c.beginPath();
    c.moveTo(-5, 12);
    c.lineTo(-5, -8);
    c.quadraticCurveTo(-5, -14, 0, -14);
    c.quadraticCurveTo(5, -14, 5, -8);
    c.lineTo(5, 8);
    c.quadraticCurveTo(5, 12, 1.5, 12);
    c.quadraticCurveTo(-2, 12, -2, 8);
    c.stroke();
    // 大眼睛
    c.fillStyle = '#fff';
    c.beginPath(); c.ellipse(0, -1, 7, 6, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = '#666';
    c.lineWidth = 1;
    c.stroke();
    c.fillStyle = '#fff';
    c.beginPath(); c.arc(-2.4, -2.2, 2.4, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(2.6, -2.2, 2.4, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#1a4a9a';
    c.beginPath(); c.arc(-1.8, -1.4, 1.5, 0, Math.PI * 2); c.fill();
    c.beginPath(); c.arc(3.2, -1.4, 1.5, 0, Math.PI * 2); c.fill();
    // 眉毛（坏笑）
    c.strokeStyle = '#333';
    c.lineWidth = 1.4;
    c.beginPath(); c.moveTo(-4.5, -5.4); c.lineTo(-0.5, -6.6); c.stroke();
    c.beginPath(); c.moveTo(0.8, -6.6); c.lineTo(4.8, -5.4); c.stroke();
  });
}

function bakeBsod(): Sprite {
  // 蓝屏死神 Boss
  return makeSprite(72, 56, 36, 28, (c) => {
    c.fillStyle = '#000082';
    c.fillRect(-34, -26, 68, 52);
    c.strokeStyle = '#c0c0c0';
    c.lineWidth = 1.6;
    c.strokeRect(-34, -26, 68, 52);
    c.fillStyle = '#c0c0c0';
    c.fillRect(-34, -26, 68, 5);
    c.fillStyle = '#000';
    c.font = 'bold 4.5px sans-serif';
    c.textAlign = 'left';
    c.fillText('System Error', -31, -22.2);
    c.fillStyle = '#fff';
    c.font = 'bold 15px monospace';
    c.fillText(':(', -12, 2);
    c.font = '5px sans-serif';
    c.fillText('桌面遇到了问题，需要重启。', -28, 12);
    c.fillText('错误代码: CURSOR_DEAD', -28, 19);
    c.fillStyle = '#7fbfff';
    c.fillRect(-28, 20.5, 24, 1.2);
  });
}

function bakeErrBullet(): Sprite {
  return makeSprite(13, 13, 6.5, 6.5, (c) => {
    c.fillStyle = '#fff';
    c.fillRect(-5.5, -5.5, 11, 11);
    c.strokeStyle = '#c00';
    c.lineWidth = 1.4;
    c.strokeRect(-5.5, -5.5, 11, 11);
    c.fillStyle = '#c00';
    c.font = 'bold 8px sans-serif';
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText('!', 0, 0.5);
    c.textBaseline = 'alphabetic';
  });
}

let bank: SurvivorSprites | null = null;

export function getSprites(): SurvivorSprites {
  if (!bank) {
    bank = {
      cursor: bakeCursor(),
      orbCursor: bakeOrbCursor(),
      blockerBullet: bakeBlocker(),
      gem: bakeGem(),
      heal: bakeHeal(),
      magnet: bakeMagnet(),
      bomb: bakeBomb(),
      virus: bakeVirus(),
      worm: bakeWorm(),
      popup: bakePopup(),
      rogue: bakeRogue(),
      clippy: bakeClippy(),
      bsod: bakeBsod(),
      errBullet: bakeErrBullet(),
    };
  }
  return bank;
}

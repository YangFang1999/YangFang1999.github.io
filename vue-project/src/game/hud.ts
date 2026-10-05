// HUD 与全屏界面（菜单/暂停/结束）。
// 菜单布局按画布尺寸比例排布（修复小画布下敌机图鉴被裁切的问题），
// 暗色遮罩 + 扫描线预渲染，避免每帧几百次 fillRect。
import { getDifficulty } from './state';
import { G } from './state';
import { drawSprite, getSprites } from './sprites';
import { getNextBossKillThreshold } from './boss';

let menuOverlay: HTMLCanvasElement | null = null;
let pauseOverlay: HTMLCanvasElement | null = null;

function bakeOverlay(alpha: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = G.canvasW;
  c.height = G.canvasH;
  const g = c.getContext('2d')!;
  g.fillStyle = `rgba(0,0,0,${alpha})`;
  g.fillRect(0, 0, G.canvasW, G.canvasH);
  g.fillStyle = 'rgba(255,255,255,0.02)';
  for (let i = 0; i < G.canvasH; i += 3) {
    g.fillRect(0, i, G.canvasW, 1);
  }
  return c;
}

export function invalidateOverlays(): void {
  menuOverlay = null;
  pauseOverlay = null;
}

function getMenuOverlay(): HTMLCanvasElement {
  if (!menuOverlay) menuOverlay = bakeOverlay(0.78);
  return menuOverlay;
}

export function drawMenu(ctx: CanvasRenderingContext2D): void {
  const W = G.canvasW, H = G.canvasH;
  ctx.drawImage(getMenuOverlay(), 0, 0);

  G.titleBlink += 0.05;

  const titleGlow = ctx.createRadialGradient(W / 2, H * 0.12, 10, W / 2, H * 0.13, 120);
  titleGlow.addColorStop(0, 'rgba(255, 220, 50, 0.2)');
  titleGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = titleGlow;
  ctx.fillRect(0, 0, W, H * 0.27);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffdd44';
  ctx.font = 'bold 30px "Microsoft YaHei", sans-serif';
  ctx.fillText('飞 机 大 战', W / 2, H * 0.122);

  ctx.fillStyle = '#ffaa44';
  ctx.font = 'bold 10px "Microsoft YaHei", sans-serif';
  ctx.fillText('SPACE SHOOTER', W / 2, H * 0.16);

  ctx.fillStyle = '#4488ff';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— 你的战机 ——', W / 2, H * 0.218);

  // 战机 + 尾焰
  ctx.save();
  ctx.translate(W / 2, H * 0.273);
  const spr = getSprites();
  drawSprite(ctx, spr.playerShip, 0, 0, 0.9);
  const fl = Math.random() * 4;
  ctx.fillStyle = '#ff6633';
  ctx.beginPath();
  ctx.moveTo(-3, 16); ctx.lineTo(0, 16 + fl); ctx.lineTo(3, 16);
  ctx.closePath(); ctx.fill();
  ctx.restore();

  ctx.fillStyle = '#cccccc';
  ctx.font = '13px "Microsoft YaHei", sans-serif';
  ctx.fillText('↑↓←→ / WASD / 鼠标 移动 · 自动射击', W / 2, H * 0.347);
  ctx.fillText('X 炸弹 · P 暂停 · I 无敌 · 连杀召唤BOSS', W / 2, H * 0.347 + 20);

  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(30, H * 0.436);
  ctx.lineTo(W - 30, H * 0.436);
  ctx.stroke();

  ctx.fillStyle = '#ff8844';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— 敌机图鉴 ——', W / 2, H * 0.484);

  const mini = drawMiniEnemyFactory(ctx);
  const yBase = H * 0.506;
  mini(W * 0.1375, yBase, spr.small, '侦察机', '1HP·100分');
  mini(W * 0.3625, yBase, spr.medium, '战斗机', '6HP·追踪弹');
  mini(W * 0.6125, yBase, spr.large, '重装机', '9HP·扇形弹');
  mini(W * 0.8625, yBase, spr.elite, '精英机', '14HP·1000分');

  ctx.strokeStyle = '#444';
  ctx.beginPath();
  ctx.moveTo(30, H * 0.655);
  ctx.lineTo(W - 30, H * 0.655);
  ctx.stroke();

  ctx.fillStyle = '#44cc44';
  ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
  ctx.fillText('—— BOSS 系统 ——', W / 2, H * 0.707);

  ctx.fillStyle = '#ff6644';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.fillText('击杀数达标后 BOSS 降临 · 击败前不会离开', W / 2, H * 0.707 + 18);
  ctx.fillStyle = '#ff8844';
  ctx.fillText('三阶段弹幕 · 血量越低越狂暴', W / 2, H * 0.707 + 34);

  ctx.fillStyle = '#aaaacc';
  ctx.font = '13px "Microsoft YaHei", sans-serif';
  ctx.fillText(`最高分: ${G.highScore}  |  连杀纪录: ${G.maxCombo}`, W / 2, H * 0.867);

  if (Math.sin(G.titleBlink) > 0) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.fillText('按 Enter 或点击画面开始', W / 2, H - 15);
  }
}

function drawMiniEnemyFactory(ctx: CanvasRenderingContext2D) {
  return (cx: number, cy: number, sprite: ReturnType<typeof getSprites>['small'], label: string, detail: string) => {
    drawSprite(ctx, sprite, cx, cy, 0.72);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, cy + 24);
    ctx.fillStyle = '#999999';
    ctx.font = '11px "Microsoft YaHei", sans-serif';
    ctx.fillText(detail, cx, cy + 39);
  };
}

export function drawPause(ctx: CanvasRenderingContext2D): void {
  if (!pauseOverlay) pauseOverlay = bakeOverlay(0.6);
  ctx.drawImage(pauseOverlay, 0, 0);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('已 暂 停', G.canvasW / 2, G.canvasH / 2 - 10);
  ctx.font = '14px "Microsoft YaHei", sans-serif';
  ctx.fillText('按 P 或点击「暂停」按钮继续', G.canvasW / 2, G.canvasH / 2 + 30);
}

export function drawGameOver(ctx: CanvasRenderingContext2D): void {
  ctx.drawImage(getMenuOverlay(), 0, 0);

  G.titleBlink += 0.05;

  ctx.fillStyle = '#ff4444';
  ctx.font = 'bold 28px "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('游 戏 结 束', G.canvasW / 2, G.canvasH * 0.44);

  ctx.fillStyle = '#ffffff';
  ctx.font = '24px monospace';
  ctx.fillText(`得分: ${G.score}`, G.canvasW / 2, G.canvasH * 0.44 + 55);

  if (G.score >= G.highScore && G.score > 0) {
    const glowAlpha = 0.6 + 0.3 * Math.sin(G.titleBlink);
    ctx.fillStyle = `rgba(255, 220, 50, ${glowAlpha})`;
    ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.fillText('🏆 新最高分！', G.canvasW / 2, G.canvasH * 0.44 + 90);
  }

  ctx.fillStyle = '#cccccc';
  ctx.font = '13px "Microsoft YaHei", sans-serif';
  ctx.fillText(
    `最大连杀: ${G.maxCombo}  |  伤害等级: ${G.bulletDamage}  |  BOSS: Lv.${G.currentBossLevel}`,
    G.canvasW / 2, G.canvasH * 0.44 + 125,
  );

  if (Math.sin(G.titleBlink) > 0) {
    ctx.fillStyle = '#ffff00';
    ctx.font = 'bold 18px "Microsoft YaHei", sans-serif';
    ctx.fillText('按 Enter 或点击画面重新开始', G.canvasW / 2, G.canvasH * 0.44 + 175);
  }
}

export function drawHUD(ctx: CanvasRenderingContext2D): void {
  const W = G.canvasW, H = G.canvasH;

  const topGrad = ctx.createLinearGradient(0, 0, 0, 70);
  topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
  topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, W, 70);

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.font = 'bold 20px "MS Sans Serif", monospace';
  ctx.fillText(`${G.score}`, 11, 29);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(`${G.score}`, 10, 28);

  ctx.fillStyle = '#aaaacc';
  ctx.font = 'bold 11px "MS Sans Serif", sans-serif';
  ctx.fillText(`最高 ${G.highScore}`, 10, 44);

  ctx.fillStyle = '#44ccff';
  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  ctx.fillText(`⚔${G.bulletDamage} 🔥${Math.floor(G.permKills / 3)} ⚡${Math.floor(G.permKills / 5)}`, 10, 60);

  // Boss 进度 / 警告
  ctx.textAlign = 'right';
  if (!G.bossSpawned) {
    const nextKills = getNextBossKillThreshold();
    ctx.fillStyle = '#ff6644';
    ctx.font = 'bold 10px "Microsoft YaHei", sans-serif';
    ctx.fillText(`👾BOSS ${G.permKills}/${nextKills}`, W - 8, 28);
  } else {
    ctx.fillStyle = '#ff2222';
    ctx.font = 'bold 10px "Microsoft YaHei", sans-serif';
    ctx.fillText('⚠ BOSS!', W - 8, 28);
  }

  const diff = getDifficulty();
  ctx.fillStyle = diff > 1.5 ? '#ff6644' : diff > 1.0 ? '#ffaa44' : '#44cc44';
  ctx.font = 'bold 10px monospace';
  ctx.fillText(`Lv.${Math.floor(diff * 10)}`, W - 8, 48);

  ctx.fillStyle = '#ff4466';
  ctx.font = 'bold 15px sans-serif';
  let livesStr = '';
  for (let i = 0; i < G.player.lives; i++) livesStr += '♥ ';
  ctx.fillText(livesStr.trim(), W - 8, 64);

  ctx.fillStyle = '#ffcc44';
  ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
  ctx.fillText(`💣 x${G.bombCount}`, W - 8, 80);

  if (G.comboDisplayTimer > 0 && G.comboCount >= 3) {
    const comboAlpha = Math.min(1, G.comboDisplayTimer / 20);
    const comboScale = 1 + Math.min(0.5, (G.comboCount - 3) * 0.05);
    ctx.save();
    ctx.textAlign = 'center';
    ctx.globalAlpha = comboAlpha;
    ctx.translate(W / 2, 55);
    ctx.scale(comboScale, comboScale);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.font = `bold ${14 + Math.min(G.comboCount, 15)}px "Microsoft YaHei", sans-serif`;
    ctx.fillText(`${G.comboCount} COMBO!`, 1, 1);

    ctx.fillStyle = G.comboCount >= 10 ? '#ff4444' : G.comboCount >= 7 ? '#ffaa44' : G.comboCount >= 5 ? '#ffdd44' : '#ffffff';
    ctx.fillText(`${G.comboCount} COMBO!`, 0, 0);

    ctx.restore();
  }

  const bottomGrad = ctx.createLinearGradient(0, H - 30, 0, H);
  bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, H - 30, W, 30);

  ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
  if (G.doubleFireTimer > 0) {
    ctx.fillStyle = '#4488ff';
    ctx.textAlign = 'left';
    ctx.fillText(`🔥双倍${G.doubleFireLevel >= 2 ? '×2' : ''} ${Math.ceil(G.doubleFireTimer / 60)}s`, 8, H - 6);
  }
  if (G.shieldTimer > 0) {
    ctx.fillStyle = '#ffaa00';
    ctx.textAlign = 'center';
    ctx.fillText(`🛡无敌 ${Math.ceil(G.shieldTimer / 60)}s`, W / 2, H - 6);
  }
  if (G.speedTimer > 0) {
    ctx.fillStyle = '#44cc44';
    ctx.textAlign = 'right';
    ctx.fillText(`⚡加速 ${Math.ceil(G.speedTimer / 60)}s`, W - 8, H - 6);
  }

  if (G.cheatInvincible) {
    ctx.fillStyle = '#ff00ff';
    ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★ 无敌模式 ★', W / 2, 22);
  }

  if (G.player.lives <= 1 && G.player.invincible <= 0 && G.shieldTimer <= 0 && G.gameState === 'playing') {
    const warningAlpha = 0.06 + 0.03 * Math.sin(G.frameCount * 0.1);
    const edgeGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.4, W / 2, H / 2, W * 0.8);
    edgeGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    edgeGrad.addColorStop(1, `rgba(255, 0, 0, ${warningAlpha})`);
    ctx.fillStyle = edgeGrad;
    ctx.fillRect(0, 0, W, H);
  }
}

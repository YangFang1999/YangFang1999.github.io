// 蓝屏死机兜底：任何未捕获错误 / 未知路由时展示 Win98 风格 BSOD。
// 用原生 DOM 实现（不依赖 Vue），保证 Vue 自身崩溃时也能显示。

let shown = false;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function showBsod(detail: string): void {
  if (shown) return;
  shown = true;
  const el = document.createElement('div');
  el.style.cssText =
    'position:fixed;inset:0;z-index:9999;background:#0000aa;color:#fff;' +
    'font:14px/1.9 "Courier New",monospace;padding:9vh 8vw;cursor:pointer;user-select:none;';
  el.innerHTML =
    '<div style="max-width:720px;margin:0 auto;text-align:center;">' +
    '<p style="background:#aaa;color:#0000aa;display:inline-block;padding:0 10px;font-weight:bold;">Desktop Defense</p>' +
    '<p style="text-align:left;margin-top:34px;">系统遇到了一个问题，已被强制停下，以免损坏你的心情。</p>' +
    '<p style="text-align:left;">' + escapeHtml(detail).slice(0, 300) + '</p>' +
    '<p style="text-align:left;margin-top:26px;">* 点击屏幕任意位置，重启你的博客。</p>' +
    '<p style="text-align:left;">* 如果重启后仍然出现，请喝一杯咖啡再试。</p>' +
    '<p style="text-align:left;margin-top:30px;">错误代码：CURSOR_NEEDS_REST</p>' +
    '</div>';
  el.addEventListener('click', () => {
    // 先回到桌面路由再重载，避免坏链接反复触发蓝屏
    if (location.hash && location.hash !== '#/') location.hash = '#/';
    location.reload();
  });
  document.body.appendChild(el);
}

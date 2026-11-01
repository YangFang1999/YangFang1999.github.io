// giscus OAuth 回包捕获 —— 必须在 router 模块之前执行（main.ts 里第一个 import）。
// 原因：giscus 登录后带 ?giscus=<会话> 重定向回站点根路径（它的 origin 参数是
// "去 query 去 hash 的页面 URL"），而 vue-router 的 hash history 在 createRouter()
// 时就快照了 location——若先启动 router 再改地址，router 会用旧快照把 URL 拉回 '#/'。
// 所以顺序必须是：先捕获会话 + replaceState 回原文页 → 再让 router 快照到正确路由。
;(function captureGiscusSession(): void {
  try {
    const p = new URLSearchParams(location.search);
    const s = p.get('giscus');
    if (!s) return;
    localStorage.setItem('giscus-session', JSON.stringify(s));
    p.delete('giscus');
    const qs = p.toString();
    let ret = '';
    try {
      ret = localStorage.getItem('giscus-return') || '';
      localStorage.removeItem('giscus-return');
    } catch { /* 忽略 */ }
    try { sessionStorage.setItem('giscus-just-logged-in', '1'); } catch { /* 忽略 */ }
    history.replaceState(undefined, document.title, location.pathname + (qs ? '?' + qs : '') + (ret || location.hash || '#/'));
    try {
      if (window.opener) {
        // 登录弹窗：通知母页重注入 widget（带上会话），然后自关
        window.opener.dispatchEvent(new Event('giscus-session-ready'));
        window.close();
      }
    } catch { /* 忽略 */ }
  } catch { /* 忽略 */ }
})();

export {};

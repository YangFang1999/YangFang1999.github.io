// 窗口导航工具：关窗协议（App.vue 时间线式任务栏配套）。
// 视图层点 X：通知 App.vue 从任务栏注册表移除这些窗口；
// 落点由 App.vue 决定——退回打开顺序里它之前最近的窗口，没有则回桌面。
// 注意：全程不使用 history.back（会与 push 返回类导航形成乒乓环，踩过）。
export function closeWindows(ids: string[]): void {
  window.dispatchEvent(new CustomEvent('win-close', { detail: { ids } }));
}

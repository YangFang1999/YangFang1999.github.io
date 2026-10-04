import { createRouter, createWebHashHistory } from 'vue-router';
import { notes } from '../data/notes';

const routes = [
  { path: '/', component: () => import('../views/Desktop.vue') },
  { path: '/computer', component: () => import('../views/Computer.vue') },
  { path: '/all-notes', component: () => import('../views/AllNotes.vue') },
  { path: '/categories', component: () => import('../views/Categories.vue') },
  { path: '/notes/:id', component: () => import('../views/NoteDetail.vue') },
  { path: '/airplane', component: () => import('../views/AirplaneApp.vue') },
  { path: '/survivors', component: () => import('../views/SurvivorApp.vue') },
  { path: '/notepad', component: () => import('../views/NotepadApp.vue') },
  { path: '/paint', component: () => import('../views/PaintApp.vue') },
  { path: '/calculator', component: () => import('../views/CalculatorApp.vue') },
  { path: '/terminal', component: () => import('../views/TerminalApp.vue') },
  { path: '/typing', component: () => import('../views/TypingApp.vue') },
  // 未知路由 → 蓝屏提示后回到桌面
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHashHistory(), // Use Hash mode for easier GitHub Pages deployment
  routes,
});

const routeTitles: Record<string, string> = {
  '/': '桌面',
  '/computer': '我的电脑',
  '/all-notes': '我的文档',
  '/categories': '控制面板',
  '/airplane': '飞机大战',
  '/survivors': '桌面保卫战',
  '/notepad': '记事本',
  '/paint': '画图',
  '/calculator': '计算器',
  '/terminal': '命令提示符',
  '/typing': '打字练习',
};

router.afterEach((to) => {
  const noteId = to.params.id as string | undefined;
  const section = (noteId ? notes.find(n => n.id === noteId)?.title : undefined)
    ?? routeTitles[to.path]
    ?? (to.path.startsWith('/notes/') ? '文章' : '桌面');
  document.title = `${section} - YF's Blog`;

  // 被兜底路由重定向 → 蓝屏提示
  const redirected = to.redirectedFrom as unknown as { matched?: Array<{ path: string }>; fullPath?: string } | undefined;
  if (redirected?.matched?.[0]?.path === '/:pathMatch(.*)*') {
    import('../bsod').then(({ showBsod }) => {
      showBsod('找不到路径 #' + (redirected.fullPath ?? ''));
    });
  }
});

export default router;

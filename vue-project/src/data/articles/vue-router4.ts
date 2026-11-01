// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `
      <h1>Vue Router 4 完全指南：hash 模式、导航守卫与动态路由</h1>

      <p>你正在看的这个博客就是一个活例子：Win98 桌面用 hash 路由模拟多窗口，未知路由触发蓝屏彩蛋，文章页用动态参数传 id。这篇把 Vue Router 4 最核心的<strong>模式选择、动态路由、嵌套路由、导航守卫、路由元信息</strong>一次讲清，全部例子都能在真实项目里落地。</p>

      <h2>1. 两种模式：hash 与 history，怎么选？</h2>
      <pre><code class="language-js">import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),   // 形如 https://site.com/#/notes/abc
  // history: createWebHistory(),    // 形如 https://site.com/notes/abc
  routes,
});</code></pre>
      <table>
          <thead><tr><th></th><th>hash 模式</th><th>history 模式</th></tr></thead>
          <tbody>
              <tr><td>URL 形态</td><td>带 <code>#</code>，不美观</td><td>干净、可读性好</td></tr>
              <tr><td>服务器配置</td><td><strong>零配置</strong>（# 后不发给服务器）</td><td>必须配置回退：所有路径返回 index.html</td></tr>
              <tr><td>SEO</td><td>较弱（早期爬虫忽略 hash）</td><td>较好</td></tr>
              <tr><td>适用场景</td><td>GitHub Pages / 静态托管 / 内网工具</td><td>可自由配置 Nginx 的正式站点</td></tr>
          </tbody>
      </table>
      <blockquote>本博客部署在 GitHub Pages 上：Pages <strong>没有自定义回退规则</strong>，history 模式下刷新 <code>/notes/abc</code> 会直接 404。所以选 hash 模式——这不是妥协，是静态托管的正确工程决策。</blockquote>

      <h2>2. 动态路由：一个组件吃下所有参数</h2>
      <pre><code class="language-js">const routes = [
  { path: '/notes/:id', component: NoteDetail },   // :id 动态段
];</code></pre>
      <p>组件里拿到参数有两种姿势。<strong>直接依赖 <code>route.params</code> 要小心</strong>：同组件路由间跳转（<code>/notes/a → /notes/b</code>）组件会复用，生命周期钩子不会重跑：</p>
      <pre><code class="language-ts">import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';

const route = useRoute();
const noteId = computed(() => route.params.id as string);

// 姿势一：computed 派生，模板响应 id 变化
// 姿势二：监听参数变化重新加载
watch(noteId, loadNote, { immediate: true });   // 本博客的文章页就是这么写的</code></pre>
      <p>更优雅的是<strong>把 params 映射成 props</strong>，组件与路由彻底解耦：</p>
      <pre><code class="language-js">{ path: '/notes/:id', component: NoteDetail, props: true }
// 组件内：defineProps&lt;{ id: string }&gt;()</code></pre>

      <h2>3. 嵌套路由：界面里的"窗口中的窗口"</h2>
      <pre><code class="language-js">const routes = [
  {
    path: '/computer',
    component: Computer,
    children: [
      { path: 'notes', component: AllNotes },   // /computer/notes
      { path: 'settings', component: Settings }, // /computer/settings
    ],
  },
];</code></pre>
      <p>子路由渲染在父组件的 <code>&lt;RouterView /&gt;</code> 出口里。Win98 桌面这类"多窗口 + 每窗口自己的导航状态"的 UI，用嵌套路由表达非常自然。注意 <code>children</code> 里的 path <strong>不以 / 开头</strong>（以 / 开头会被当作根路径拼接）。</p>

      <h2>4. 导航守卫：一次跳转的完整旅程</h2>
      <p>从 <code>router.push('/a')</code> 到页面切换完成，守卫按以下顺序执行：</p>
      <pre><code class="language-plaintext">beforeRouteLeave(组件)        → 离开页确认（如"未保存"提示）
beforeEach(全局)              → 鉴权、登录态检查
beforeRouteUpdate(组件)       → 复用组件参数变化
beforeEnter(路由独享)         → 单条路由配置
beforeResolve(全局)           → 异步组件与守卫全部就绪
afterEach(全局)               → 埋点、改标题（无 next 参数）
──────────────────────────────
确认导航 → 渲染 → beforeRouteEnter 的 next 回调（拿到实例）</code></pre>
      <p>最常见的登录态检查：</p>
      <pre><code class="language-js">router.beforeEach((to) =&gt; {
  // 直接返回 false 取消导航；返回路由对象等于重定向
  if (to.meta.requiresAuth &amp;&amp; !isLoggedIn()) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }
  // 放开就什么都不返回（Vue Router 4 不再需要 next()）
});</code></pre>
      <blockquote>Vue Router 4 的守卫<strong>不需要 next()</strong> 了：返回 false 取消、返回路由对象重定向、返回 true/undefined 放行。忘了这个变化是老手迁移最常见的报错来源。</blockquote>

      <h2>5. 路由元信息 meta 与未知路由兜底</h2>
      <p><code>meta</code> 是挂在路由配置上的自定义数据，配合类型扩展还能获得完整的 TS 提示：</p>
      <pre><code class="language-ts">import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    title?: string;          // document.title 用
    requiresAuth?: boolean;
  }
}

const routes = [
  { path: '/notes/:id', component: NoteDetail, meta: { title: '文章' } },
  { path: '/:pathMatch(.*)*', redirect: '/' },   // 404 兜底
];</code></pre>
      <p><code>/:pathMatch(.*)*</code> 是 Vue Router 4 的通配写法。本博客更进一步：afterEach 里检测到"被重定向过"就弹出蓝屏死机彩蛋，把错误处理做成了主题的一部分。</p>
      <pre><code class="language-js">router.afterEach((to, from) =&gt; {
  document.title = to.meta.title ? to.meta.title + ' - YF Blog' : 'YF Blog';
  if (from.matched.length === 0 &amp;&amp; to.path === '/') {
    showBsod('试图访问不存在的窗口');   // 未知路径 → 蓝屏彩蛋
  }
});</code></pre>

      <h2>6. 滚动行为与动态注册路由</h2>
      <pre><code class="language-js">const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 浏览器前进后退记住位置，普通跳转回顶部
    return savedPosition || { top: 0 };
  },
});

// 权限菜单场景：登录后按角色动态挂路由
router.addRoute('parent', { path: '/admin', component: Admin });</code></pre>
      <p><code>scrollBehavior</code> 对单页应用的阅读体验影响巨大——文章页跳转不回顶是一件非常败感的事。</p>

      <h2>7. 组合式 API 与常见坑</h2>
      <ul>
          <li><strong>useRoute 永远是同一个响应式对象</strong>：解构它会丢响应式，要么用 <code>computed</code>，要么 <code>const { id } = toRefs(route)</code>。</li>
          <li><strong>push 同一路由报错</strong>：重复导航会被拒绝（带 NavigationFailure），可以 <code>router.push().catch(() =&gt; {})</code> 或干脆忽略——这不是错误。</li>
          <li><strong>query 与 params</strong>：params 只能配合动态段或 name 跳转，且刷新即丢（除非写进 path）；持久化参数用 query。</li>
          <li><strong>守卫里改状态要防死循环</strong>：beforeEach 里重定向到当前路径会无限循环，重定向前先判 <code>to.path === target</code>。</li>
      </ul>
      <p>把"模式选择看部署环境、params 变化要 watch、守卫不再需要 next、meta 驱动页面行为"这四条带走，Vue Router 4 的 90% 场景你都能从容应对。</p>
`;

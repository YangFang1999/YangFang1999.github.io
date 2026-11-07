// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Vue Router 4 完全指南：hash 模式、导航守卫与动态路由</h1>

	      <p>你正在看的这个博客就是一个活例子：Win98 桌面用 hash 路由模拟多窗口，未知路由触发蓝屏彩蛋，文章页用动态参数传 id。这篇把 Vue Router 4 最核心的<strong>模式选择、动态路由、嵌套路由、导航守卫、路由元信息</strong>一次讲清，全部例子都能在真实项目里落地。</p>

	      <h2>1. 两种模式：hash 与 history，怎么选？</h2>
	      <pre><code class="language-js">import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),   // 形如 https://site.com/#/notes/abc
  // history: createWebHistory(),    // 形如 https://site.com/notes/abc
  routes,
});</code></pre>
	      <table>
	          <tr>
	              <th></th>
	              <th>hash 模式</th>
	              <th>history 模式</th>
	          </tr>
	          <tr><td>URL 形态</td><td>带 <code>#</code>，不美观</td><td>干净、可读性好</td></tr>
	          <tr><td>服务器配置</td><td><strong>零配置</strong>（# 后不发给服务器）</td><td>必须配置回退：所有路径返回 index.html</td></tr>
	          <tr><td>SEO</td><td>较弱（早期爬虫忽略 hash）</td><td>较好</td></tr>
	          <tr><td>适用场景</td><td>GitHub Pages / 静态托管 / 内网工具</td><td>可自由配置 Nginx 的正式站点</td></tr>
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
const noteId = computed(() =&gt; route.params.id as string);

// 姿势一：computed 派生，模板响应 id 变化
// 姿势二：监听参数变化重新加载
watch(noteId, loadNote, { immediate: true });   // 本博客的文章页就是这么写的</code></pre>
	      <p>更优雅的是<strong>把 params 映射成 props</strong>，组件与路由彻底解耦：</p>
	      <pre><code class="language-js">{ path: '/notes/:id', component: NoteDetail, props: true }
// 组件内：defineProps&lt;{ id: string }&gt;()</code></pre>
	      <p>可选参数用 <code>:id?</code>，多段参数用 <code>/file-:id(.*)</code> 这类自定义正则；同一路由想匹配多种参数形态时，<strong>声明多条同 name 的路由并在 path 上做枚举</strong>（<code>/:type(a|b|c)</code>）比在组件里写一堆 if 干净得多。</p>

	      <h2>3. 路由懒加载：首屏只加载首屏</h2>
	      <p>把组件从"顶部静态 import"改成"动态 import 函数"，Vite/Rollup 会自动把它切成独立 chunk，进入该路由时才下载——本博客 22 篇文章的正文就是靠这个机制按需加载的，首屏 JS 从全量变成了几分之一：</p>
	      <pre><code class="language-js">const routes = [
  // ❌ 静态引入：全部打进主包
  // { path: '/computer', component: Computer },

  // ✓ 懒加载：访问才加载，天然代码分割
  { path: '/computer', component: () =&gt; import('../views/Computer.vue') },
  { path: '/notes/:id', component: () =&gt; import('../views/NoteDetail.vue') },
];</code></pre>
	      <p>两个实践要点：<strong>路由级懒加载是性价比最高的优化</strong>（不用改任何业务代码）；再配合 webpackChunkName 等价物给 chunk 命名，构建产物一眼可读。加载失败（网络抖动导致 chunk 404）时给 router.onError 挂一个"重载页面"兜底，能救回不少用户。</p>

	      <h2>4. 嵌套路由：界面里的"窗口中的窗口"</h2>
	      <pre><code class="language-js">const routes = [
  {
    path: '/computer',
    component: Computer,
    children: [
      { path: 'notes', component: AllNotes },   // /computer/notes
      { path: 'settings', component: Settings }, // /computer/settings
      { path: '', component: Overview },         // 默认子路由 /computer
    ],
  },
];</code></pre>
	      <p>子路由渲染在父组件的 <code>&lt;RouterView /&gt;</code> 出口里。Win98 桌面这类"多窗口 + 每窗口自己的导航状态"的 UI，用嵌套路由表达非常自然。注意三点：<code>children</code> 里的 path <strong>不以 / 开头</strong>（以 / 开头会被当作根路径拼接）；<code>path: ''</code> 是默认子路由；不渲染任何子内容时父路由里可以不写出口，父子组件纯通过 <code>&lt;slot&gt;</code> 协作也行。</p>

	      <h2>5. 编程式导航：一张表分清四个 API</h2>
	      <table>
	          <tr>
	              <th>API</th>
	              <th>行为</th>
	              <th>典型场景</th>
	          </tr>
	          <tr><td>router.push(location)</td><td>压入新历史记录</td><td>点击跳转（默认选择）</td></tr>
	          <tr><td>router.replace(location)</td><td>替换当前记录（不留后退痕迹）</td><td>登录后跳转、修正参数</td></tr>
	          <tr><td>router.go(n) / back() / forward()</td><td>在历史栈上移动</td><td>返回上一页（注意"可能无上一页"）</td></tr>
	          <tr><td>&lt;RouterLink to="..."&gt;</td><td>渲染成 a 标签的 push</td><td>模板中的导航（保留右键新开、SEO）</td></tr>
	      </table>
	      <p>query 与 params 的取舍也在这里定：</p>
	      <table>
	          <tr>
	              <th></th>
	              <th>params（/notes/:id）</th>
	              <th>query（?keyword=vue）</th>
	          </tr>
	          <tr><td>是否参与路径</td><td>是，语义化、SEO 友好</td><td>否，追加在 ? 后</td></tr>
	          <tr><td>刷新后</td><td>保留（写在 path 里）</td><td>保留</td></tr>
	          <tr><td>必须配合</td><td>动态段或 name</td><td>任意路由</td></tr>
	          <tr><td>适合</td><td>资源标识：文章 id、用户 id</td><td>筛选项、搜索词、页码这类"可选状态"</td></tr>
	      </table>
	      <p>经验法则：<strong>没有它页面就没意义的信息用 params（文章 id），只影响展示的可选信息用 query（搜索关键词）</strong>。query 变化不会触发组件重建，同样靠 watch route.query 处理。</p>

	      <h2>6. 导航守卫：一次跳转的完整旅程</h2>
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
	      <p>守卫里要拿 Pinia 的用户态时注意作用域：守卫跑在组件树之外，需要把 pinia 实例传进 <code>useUserStore(pinia)</code>——细节在 <a href="#/notes/pinia-intro">Pinia 指南</a>第 7 节。另外"离开前确认"场景（表单未保存）放在组件内的 <code>onBeforeRouteLeave</code>，配合 window 的 beforeunload 才是完整方案。</p>

	      <h2>7. 路由元信息 meta 与未知路由兜底</h2>
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

	      <h2>8. 滚动行为、keep-alive 与动态注册</h2>
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
	      <p><code>scrollBehavior</code> 对单页应用的阅读体验影响巨大——文章页跳转不回顶是一件非常败感的事。返回 <code>{ el: to.hash }</code> 还能原生支持锚点跳转。</p>
	      <p>列表页 → 详情页 → 返回列表时想保留滚动位置和筛选状态，两件套：<strong>被缓存的列表页包在 <code>&lt;KeepAlive&gt;</code> 里</strong>（配合 include 按组件名缓存），同时把筛选条件写进 query——刷新也能还原：</p>
	      <pre><code class="language-markup">&lt;RouterView v-slot="{ Component }"&gt;
  &lt;KeepAlive include="NoteList"&gt;
    &lt;component :is="Component" /&gt;
  &lt;/KeepAlive&gt;
&lt;/RouterView&gt;</code></pre>
	      <p>注意 KeepAlive 的 include 匹配的是<strong>组件名</strong>——<code>&lt;script setup&gt;</code> 组件默认是文件名，可用 <code>defineOptions({ name: 'NoteList' })</code> 显式声明。</p>

	      <h2>9. 组合式 API 与常见坑</h2>
	      <ul>
	          <li><strong>useRoute 永远是同一个响应式对象</strong>：解构它会丢响应式，要么用 <code>computed</code>，要么 <code>const { id } = toRefs(route)</code>。</li>
	          <li><strong>push 同一路由报错</strong>：重复导航会被拒绝（带 NavigationFailure），可以 <code>router.push().catch(() =&gt; {})</code> 或干脆忽略——这不是错误。</li>
	          <li><strong>守卫里改状态要防死循环</strong>：beforeEach 里重定向到当前路径会无限循环，重定向前先判 <code>to.path === target</code>。</li>
	          <li><strong>别用 history.back() 做业务导航</strong>：SPA 的历史栈里混着外部跳转和被拦截的导航，"返回"语义应当由你的导航函数显式 <code>push/replace</code> 到确定的目标——本博客的窗口回退逻辑因此重做过，history.back 埋的雷远比它省的事多。</li>
	      </ul>
	      <p>把"模式选择看部署环境、params 变化要 watch、守卫不再需要 next、meta 驱动页面行为"这四条带走，Vue Router 4 的 90% 场景你都能从容应对。</p>`;

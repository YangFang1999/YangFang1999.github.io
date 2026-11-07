// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Vue Router 4 完全指南：hash 模式、导航守卫与动态路由</h1>

	      <p>你正在看的这个博客就是一个活例子：Win98 桌面用 hash 路由模拟多窗口，未知路由触发蓝屏彩蛋，文章页用动态参数传 id。这篇把 Vue Router 4 从"模式选择"到"匹配语法""导航守卫""动态注册"完整讲一遍，全部例子都能在真实项目里落地。</p>

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
	          <tr><td>部署载体</td><td>GitHub Pages / 静态托管 / 任意环境</td><td>可自由配置 Nginx 的正式站点</td></tr>
	      </table>
	      <p>hash 模式的原理值得知道：<code>#</code> 后面的部分<strong>浏览器根本不会发给服务器</strong>，路由切换只是改了 hash 并监听 hashchange——所以"刷新 404"这类 history 模式的经典问题在 hash 模式下天然不存在。history 模式则用 <code>history.pushState</code> 改地址栏（不发请求），但用户<strong>直接访问/刷新</strong>某个深层路径时，请求会真的发到服务器，没有配置回退就 404。Nginx 的标准回退配置：</p>
	      <pre><code class="language-bash">location / {
    try_files $uri $uri/ /index.html;   # 先找真实文件，找不到就返回 index.html
}</code></pre>
	      <blockquote>本博客部署在 GitHub Pages 上：Pages <strong>没有自定义回退规则</strong>，history 模式下刷新 <code>/notes/abc</code> 会直接 404。所以选 hash 模式——这不是妥协，是静态托管的正确工程决策。</blockquote>

	      <h2>2. 动态路由与匹配语法：一个组件吃下所有参数</h2>
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
// 组件内：defineProps&lt;{ id: string }&gt;()
// props 还能是函数（自定义映射）或对象（静态传参）</code></pre>
	      <p>匹配语法比想象中强大，常用形态一览：</p>
	      <pre><code class="language-js">const routes = [
  '/users/:id',              // 必选参数
  '/users/:id?',             // 可选参数（/users 和 /users/123 都匹配）
  '/file-:id(.*)',           // 自定义正则：匹配 file- 开头的任意后缀
  '/:type(a|b|c)',           // 参数枚举：只匹配 a/b/c 三种值
  '/tags/:tag+',             // 可重复参数：/tags/vue、/tags/vue/ts（一或多段）
  '/path/:pathMatch(.*)*',   // 任意路径（404 兜底就是它）
];</code></pre>
	      <p><code>params</code> 与 <code>query</code> 的取舍在这里定：</p>
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

	      <h2>3. 路由懒加载：首屏只加载首屏</h2>
	      <p>把组件从"顶部静态 import"改成"动态 import 函数"，Vite/Rollup 会自动把它切成独立 chunk，进入该路由时才下载——本博客 22 篇文章的正文就是靠这个机制按需加载的，首屏 JS 从全量变成了几分之一：</p>
	      <pre><code class="language-js">const routes = [
  // ❌ 静态引入：全部打进主包
  // { path: '/computer', component: Computer },

  // ✓ 懒加载：访问才加载，天然代码分割
  { path: '/computer', component: () =&gt; import('../views/Computer.vue') },
  { path: '/notes/:id', component: () =&gt; import('../views/NoteDetail.vue') },
];</code></pre>
	      <p>两个实践要点：<strong>路由级懒加载是性价比最高的优化</strong>（不用改任何业务代码）；懒加载 chunk 加载失败（网络抖动导致 404）时，给 router.onError 挂一个"重载页面"兜底，能救回不少用户：</p>
	      <pre><code class="language-js">router.onError((error) =&gt; {
    // chunk 加载失败（发版后旧 chunk 404 是高发场景）→ 强刷一次
    if (/Failed to fetch dynamically imported module/.test(error.message)) {
        window.location = window.location.href;   // 相当于刷新
    }
});</code></pre>

	      <h2>4. 嵌套路由与命名视图</h2>
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
	      <p>子路由渲染在父组件的 <code>&lt;RouterView /&gt;</code> 出口里。Win98 桌面这类"多窗口 + 每窗口自己的导航状态"的 UI，用嵌套路由表达非常自然。注意三点：<code>children</code> 里的 path <strong>不以 / 开头</strong>（以 / 开头会被当作根路径拼接）；<code>path: ''</code> 是默认子路由；子路由还能继续嵌套 children，多层 <code>&lt;RouterView&gt;</code> 一层层往下递归。</p>
	      <p>同一层想同时渲染多个视图（比如侧边栏 + 主区各有各的组件）用<strong>命名视图</strong>：</p>
	      <pre><code class="language-js">{
    path: '/dashboard',
    components: {                    // 注意是复数 components
        default: MainPanel,          // &lt;RouterView /&gt;
        sidebar: SidePanel,          // &lt;RouterView name="sidebar" /&gt;
    },
}</code></pre>
	      <p>别名与重定向的三种常用写法也顺带收齐：</p>
	      <pre><code class="language-js">{ path: '/n', alias: '/note', component: NoteList }        // alias：两个地址渲染同一组件
{ path: '/home', redirect: '/' }                            // 字符串重定向
{ path: '/users/:id', redirect: to =&gt; '/profile/' + to.params.id }  // 函数重定向
{ path: '/old', redirect: { name: 'new-route' } }           // 对象重定向</code></pre>

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
	      <p>push 的目标可以是对象形式，把跳转的全部信息表达清楚：</p>
	      <pre><code class="language-js">router.push({ name: 'note', params: { id: 42 } });          // 用 name + params
router.push({ path: '/notes/42' });                          // 用 path
router.push({ path: '/all-notes', query: { category: 'vue', page: 2 } });
router.push({ path: '/login', query: { redirect: route.fullPath } });  // 带回跳地址</code></pre>

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
	      <p>最完整的登录拦截 + 回跳示例（生产直接可用）：</p>
	      <pre><code class="language-js">router.beforeEach((to) =&gt; {
  const isLoggedIn = !!localStorage.getItem('token');

  // 去登录页但已登录 → 直接进首页，别停在登录页
  if (to.name === 'login' &amp;&amp; isLoggedIn) return '/';

  // 需要登录但没登录 → 去登录页并带上"从哪来"
  if (to.meta.requiresAuth &amp;&amp; !isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
});

// 登录成功后回跳：
function afterLoginSuccess() {
  const redirect = route.query.redirect?.toString() ?? '/';
  router.replace(redirect);      // replace：登录页不该留在历史里
}</code></pre>
	      <blockquote>Vue Router 4 的守卫<strong>不需要 next()</strong> 了：返回 false 取消、返回路由对象重定向、返回 true/undefined 放行。忘了这个变化是老手迁移最常见的报错来源。</blockquote>
	      <p>守卫里要拿 Pinia 的用户态时注意作用域：守卫跑在组件树之外，需要把 pinia 实例传进 <code>useUserStore(pinia)</code>——细节在 <a href="#/notes/pinia-intro">Pinia 指南</a>第 9 节。"离开前确认"场景（表单未保存）放在组件内的 <code>onBeforeRouteLeave</code>，配合 window 的 beforeunload 才是完整方案：</p>
	      <pre><code class="language-js">import { onBeforeRouteLeave } from 'vue-router';

onBeforeRouteLeave((to, from) =&gt; {
  if (formDirty.value &amp;&amp; !window.confirm('修改未保存，确定离开？')) {
    return false;        // 取消导航
  }
});</code></pre>

	      <h2>7. 导航失败与重复点击</h2>
	      <p>点击"当前已经在的页面"、或守卫里 redirect 走了重复路径时，push 返回的不是异常而是一个 <strong>NavigationFailure</strong>：</p>
	      <pre><code class="language-js">const failure = await router.push('/same-path');
if (failure) {
  // failure.type: 4=aborted(守卫取消) 8=duplicated(重复导航) 16=cancelled(被新导航覆盖)
  if (failure.type === 4) console.log('被守卫拦下了');
}
// 大多数场景直接忽略重复导航即可：
router.push('/same-path').catch(() =&gt; {});</code></pre>
	      <p>还有两个相关行为要知道：<strong>重复参数变化</strong>（比如 query 里翻页从 2 到 3，路径不变）不会触发组件重建，靠 watch query 处理；<strong>导航被更新的导航覆盖</strong>（用户快速连点）时旧导航自动取消，回调不会执行——这是好事，防止过期请求乱入。</p>

	      <h2>8. 路由元信息 meta 与未知路由兜底</h2>
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
	      <p><code>/:pathMatch(.*)*</code> 是 Vue Router 4 的通配写法。本博客更进一步：afterEach 里检测到"被重定向过"就弹出蓝屏死机彩蛋，把错误处理做成了主题的一部分：</p>
	      <pre><code class="language-js">router.afterEach((to) =&gt; {
  const noteId = to.params.id as string | undefined;
  document.title = (noteId &amp;&amp; findNoteTitle(noteId) ?? to.meta.title ?? '桌面') + ' - YF\'s Blog';
});</code></pre>

	      <h2>9. 滚动行为、过渡与 KeepAlive</h2>
	      <pre><code class="language-js">const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 浏览器前进后退记住位置，普通跳转回顶部，锚点直达元素
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return savedPosition || { top: 0 };
  },
});</code></pre>
	      <p><code>scrollBehavior</code> 对单页应用的阅读体验影响巨大——文章页跳转不回顶是一件非常败感的事。列表页 → 详情页 → 返回列表时想保留滚动位置和筛选状态，两件套：<strong>被缓存的列表页包在 <code>&lt;KeepAlive&gt;</code> 里</strong>（配合 include 按组件名缓存），同时把筛选条件写进 query——刷新也能还原：</p>
	      <pre><code class="language-markup">&lt;RouterView v-slot="{ Component }"&gt;
  &lt;Transition name="page" mode="out-in"&gt;   &lt;!-- 路由过渡动画：mode 避免新旧同时存在 --&gt;
    &lt;KeepAlive include="NoteList"&gt;
      &lt;component :is="Component" /&gt;
    &lt;/KeepAlive&gt;
  &lt;/Transition&gt;
&lt;/RouterView&gt;</code></pre>
	      <p>注意 KeepAlive 的 include 匹配的是<strong>组件名</strong>——<code>&lt;script setup&gt;</code> 组件默认是文件名，可用 <code>defineOptions({ name: 'NoteList' })</code> 显式声明。路由过渡的 <code>mode="out-in"</code> 几乎必加：否则新旧页面会在切换瞬间同时存在，布局抖动。</p>

	      <h2>10. 动态注册路由：权限菜单实战</h2>
	      <p>后台管理系统的经典需求：不同角色看到不同菜单，路由按登录后拿到的权限动态挂载：</p>
	      <pre><code class="language-js">// 前端维护"全量路由表"，后端只下发"角色能访问的菜单名列表"
const allRoutes = {
  dashboard: { path: '/dashboard', component: () =&gt; import('@/views/Dashboard.vue') },
  users:     { path: '/users', component: () =&gt; import('@/views/Users.vue') },
  settings:  { path: '/settings', component: () =&gt; import('@/views/Settings.vue') },
};

export async function setupDynamicRoutes(router, pinia) {
  const user = useUserStore(pinia);
  const menuNames = await user.fetchMenus();        // ['dashboard', 'users']

  menuNames.forEach(name =&gt; {
    if (allRoutes[name]) router.addRoute(allRoutes[name]);
  });
  // 兜底 404 必须最后加，否则会拦截掉尚未注册的合法路由
  router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/' });
}</code></pre>
	      <p>三个要点：<strong>① addRoute 无返回值判断"是否已存在"，重复 add 会告警</strong>，登出/切换角色时要 <code>router.removeRoute(name)</code> 先清理；<strong>② 404 通配必须最后注册</strong>；<strong>③ 动态挂载发生在登录后</strong>，刷新页面时要在 app 挂载前重新执行一遍（通常放在 main.ts 的 await router.isReady() 流程里），否则刷新后路由表是空的。</p>

	      <h2>11. 组合式 API 与常见坑</h2>
	      <ul>
	          <li><strong>useRoute 永远是同一个响应式对象</strong>：解构它会丢响应式，要么用 <code>computed</code>，要么 <code>const { id } = toRefs(route)</code>。</li>
	          <li><strong>数据获取的两个时机</strong>：导航后获取（组件 created/mounted 里请求 + loading 态，最常用）vs 导航前获取（beforeRouteEnter/守卫里请求，期间用户停在旧页面，体验像传统多页站）。默认选前者，别让用户"点了一下没反应"。</li>
	          <li><strong>守卫里改状态要防死循环</strong>：beforeEach 里重定向到当前路径会无限循环，重定向前先判 <code>to.path === target</code>。</li>
	          <li><strong>别用 history.back() 做业务导航</strong>：SPA 的历史栈里混着外部跳转和被拦截的导航，"返回"语义应当由你的导航函数显式 <code>push/replace</code> 到确定的目标——本博客的窗口回退逻辑因此重做过，history.back 埋的雷远比它省的事多。</li>
	      </ul>
	      <p>把"模式选择看部署环境、params 变化要 watch、守卫不再需要 next、meta 驱动页面行为、404 最后注册"这五条带走，Vue Router 4 的 90% 场景你都能从容应对。</p>`;
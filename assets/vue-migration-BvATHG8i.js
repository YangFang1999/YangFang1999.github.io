const t=`	      <h1>网站重构实战：从静态 HTML 到 Vue 3 + TypeScript 的现代化改造</h1>

	      <p>这个网站最初是用纯 HTML + CSS 搭建的静态页面——每个页面一个 .html 文件，公共头部和底部靠复制粘贴维护，交互全靠原生 JavaScript。当文章越来越多、功能越来越复杂后，<strong>静态站点的维护成本呈指数级上升</strong>。本文将完整记录我如何把这个网站重构为 Vue 3 + TypeScript + Vite 的现代化项目：从"为什么要重构"到"怎么设计迁移路线"，再到"一路上踩过的坑"，希望对同样想升级技术栈的你有所启发。</p>

	      <h2>1. 为什么要重构？—— 静态站点的痛点</h2>
	      <p>先说说原来纯静态方案的具体问题，这些应该是很多个人网站的"通病"：</p>
	      <ul>
	          <li><strong>无法复用公共部分：</strong>导航栏、侧边栏、页脚每个页面都复制一份。改一个导航链接要手动改几十个 .html 文件。后来用 SSI（Server Side Includes）缓解了一些，但本地开发无法预览。</li>
	          <li><strong>JavaScript 散落各处：</strong>每个页面的 <code>&lt;script&gt;</code> 标签里写一段逻辑，全局变量满天飞，事件绑定混乱。随着交互增多（窗口系统、任务栏、文件管理器），代码越来越难以维护。</li>
	          <li><strong>CSS 全局污染：</strong>虽然是 Windows 98 风格的小站点，但样式文件越来越大后，改一个按钮样式可能影响其他页面的布局。</li>
	          <li><strong>没有构建流程：</strong>想用 ES6 语法得手动考虑浏览器兼容性，想压缩代码得手动跑工具，图片和字体没有统一管理。</li>
	          <li><strong>状态无处安放：</strong>"窗口开没开""当前显示哪篇文章"这类跨页面的共享状态，全靠 DOM 类名和隐藏元素硬记——逻辑一复杂就变成查表游戏。</li>
	      </ul>
	      <p>重构的目标很明确：<strong>组件化、可维护、可扩展，同时保留 Windows 98 的怀旧风格。</strong>注意最后半句——重构不等于重画，视觉规格（配色、边框、阴影）原样保留，只换引擎不换壳。</p>

	      <h2>2. 技术选型：为什么是 Vue 3 + Vite + TypeScript？</h2>
	      <table>
	          <tr>
	              <th>技术</th>
	              <th>选择理由</th>
	              <th>对比</th>
	          </tr>
	          <tr>
	              <td><strong>Vue 3</strong></td>
	              <td>学习曲线平缓，中文文档完善，Composition API 让逻辑复用更优雅</td>
	              <td>React: JSX 和 hooks 上手成本更高；Svelte: 生态还不够成熟</td>
	          </tr>
	          <tr>
	              <td><strong>Vite</strong></td>
	              <td>开发服务器秒启动，HMR 极快，天然支持 TypeScript</td>
	              <td>Webpack: 配置繁琐，大型项目冷启动慢（Vite 利用浏览器原生 ES Module）</td>
	          </tr>
	          <tr>
	              <td><strong>TypeScript</strong></td>
	              <td>类型安全，重构时有信心，IDE 智能提示更准确</td>
	              <td>纯 JS: 大型项目重构时容易遗漏，类型错误要到运行时才发现</td>
	          </tr>
	          <tr>
	              <td><strong>TailwindCSS</strong></td>
	              <td>原子化 CSS，不用想类名，写样式快</td>
	              <td>传统 CSS: 需要维护大量自定义类名和文件</td>
	          </tr>
	      </table>
	      <p>选型的一条个人心法：<strong>为"网站"选框架，不是为"简历"选框架</strong>。这个站的核心交互是"窗口/任务栏/文件列表"这类状态密集型 UI，Vue 的响应式 + 模板对这类需求表达力最强；如果是纯内容展示站，其实上不上框架都值得掂量。</p>

	      <h2>3. 迁移路线设计：渐进式而不是大爆炸</h2>
	      <p>重写最怕"新站没写完、老站还挂着、两边都对不上"。我用的路线是<strong>绞杀者模式（Strangler Pattern）</strong>——新框架像藤蔓一样逐步包住旧系统，而不是推倒重来：</p>
	      <ol>
	          <li><strong>第一步：搭壳。</strong>Vite 建项目，路由先只放一个"桌面页"，老页面通过 <code>&lt;iframe&gt;</code> 或直接链接兜底——新站立刻可以部署，哪怕是空壳。</li>
	          <li><strong>第二步：搬运"读"路径。</strong>文章列表、详情这类纯展示页面优先迁移（风险最低，效果最直观），数据层先原样搬成 TS 常量。</li>
	          <li><strong>第三步：搬运"写"路径。</strong>窗口系统、任务栏、拖拽这些状态密集的交互最后迁——它们依赖前两步建好的组件与数据层。</li>
	          <li><strong>第四步：删旧代码。</strong>确认旧 HTML 没有入口引用后整体删除，DNS 只指向新站。</li>
	      </ol>
	      <p>这条路线最大的好处是<strong>随时可停</strong>：每一步结束都是一个可部署的完整状态，不像大爆炸式重写——中途放弃就什么都没有。</p>

	      <h2>4. 项目结构设计</h2>
	      <p>重构后的目录结构遵循 Vue 3 单文件组件的惯例，同时根据"Windows 98 桌面模拟器"的特殊需求做了定制：</p>
	      <pre><code class="language-bash">vue-project/
├── src/
│   ├── main.ts              # 入口：创建 app、注册路由、挂载
│   ├── App.vue               # 根组件：桌面背景 + 全局布局
│   ├── router/
│   │   └── index.ts          # vue-router 路由配置
│   ├── views/                # 页面级组件（每个"窗口"对应一个 view）
│   │   ├── Desktop.vue       # 桌面主页
│   │   ├── Computer.vue      # "我的电脑"——分类浏览
│   │   ├── AllNotes.vue      # "我的文章"——文章列表
│   │   ├── Categories.vue    # 文章分类页
│   │   └── NoteDetail.vue    # 文章详情页
│   ├── components/           # 可复用的 UI 组件
│   │   ├── Window.vue        # 通用窗口容器（标题栏 + 内容区）
│   │   ├── Taskbar.vue       # 任务栏
│   │   └── FindDialog.vue    # 查找对话框
│   ├── data/                 # 站点数据（文章元数据 + 正文）
│   ├── game/                 # 游戏引擎（纯逻辑，与视图分离）
│   └── styles/               # 全局样式与 Win98 设计 token
├── public/                   # 不参与构建的静态资源
├── index.html                # 唯一 HTML 入口
└── vite.config.ts</code></pre>
	      <p>两个分层决策值得说明：<strong>views 与 components 的分界</strong>是"是否对应一条路由"——窗口内容组件放 views，通用壳子放 components；<strong>data 与组件分离</strong>——文章元数据/正文集中放在 data 目录，组件只负责渲染（配合 Vite 动态 import 做成按 chunk 懒加载，详见 <a href="#/notes/vue-router4">路由懒加载一节</a>）。</p>

	      <h2>5. 路由设计：桌面隐喻的 URL 化</h2>
	      <p>整个站点是一个"虚拟操作系统"，路由表就是它的窗口清单：</p>
	      <pre><code class="language-js">const routes = [
  { path: '/', name: 'Desktop', component: Desktop },
  { path: '/computer', name: 'Computer', component: Computer },
  { path: '/all-notes', name: 'AllNotes', component: AllNotes },
  { path: '/notes/:id', name: 'NoteDetail', component: NoteDetail },
];</code></pre>
	      <ul>
	          <li><strong>桌面是根路径：</strong><code>/</code> 对应 Desktop.vue，这是用户进入网站看到的第一个画面——就像 Windows 开机后的桌面。</li>
	          <li><strong>文章详情用动态路由：</strong><code>/notes/:id</code> 通过 URL 参数定位到具体文章，方便分享链接（比如发给朋友一篇教程，URL 直接就是那篇文章）。</li>
	          <li><strong>分类筛选用 query 参数：</strong><code>/all-notes?category=java</code> 使用 query 而非路径参数，因为分类是筛选条件而不是资源定位——语义上更准确。</li>
	          <li><strong>未知路由要有兜底：</strong><code>/:pathMatch(.*)*</code> 捕获所有不存在的路径，本站把它做成了蓝屏彩蛋（见 <a href="#/notes/vue-router4">Router 4 指南</a>的 meta 一节）。</li>
	      </ul>

	      <h2>6. 全局 API 的迁移：Vue 2 → Vue 3 对照表</h2>
	      <p>如果你也在迁移一个 Vue 2 项目，这张表是最高频的翻译工作：</p>
	      <table>
	          <tr>
	              <th>Vue 2 写法</th>
	              <th>Vue 3 写法</th>
	              <th>备注</th>
	          </tr>
	          <tr><td><code>new Vue({...}).$mount('#app')</code></td><td><code>createApp(App).mount('#app')</code></td><td>app 实例取代全局 Vue，多实例互不污染</td></tr>
	          <tr><td><code>Vue.use(plugin)</code></td><td><code>app.use(plugin)</code></td><td>插件注册到实例</td></tr>
	          <tr><td><code>Vue.prototype.$http</code></td><td><code>app.config.globalProperties.$http</code></td><td>更好的选择是 provide/inject 或 Composable</td></tr>
	          <tr><td><code>Vue.component('x', X)</code></td><td>组件内 import 即用</td><td>全局组件几乎不需要了</td></tr>
	          <tr><td>过滤器 <code>{{ x | fmt }}</code></td><td><strong>已移除</strong></td><td>用计算属性或方法替代</td></tr>
	          <tr><td>事件总线 <code>new Vue()</code> 当 emitter</td><td><strong>不再推荐</strong></td><td>用 mitt 库，或 provide/inject</td></tr>
	          <tr><td><code>$children</code> / <code>$refs</code> 遍历</td><td><strong>$children 已移除</strong></td><td>ref + defineExpose 点对点访问</td></tr>
	          <tr><td>函数式组件 <code>functional: true</code></td><td>纯函数组件即可</td><td>写法变化</td></tr>
	          <tr><td><code>v-for</code> 上的 <code>key</code> 可省</td><td>必须写 key</td><td>diff 语义更严格</td></tr>
	          <tr><td><code>$set / $delete</code></td><td>直接赋值/删除即可</td><td>Proxy 响应式天然支持</td></tr>
	      </table>
	      <p>其中"过滤器移除"和"事件总线不推荐"两个变化最容易被忽略：过滤器的活儿全部归计算属性；跨组件事件用 mitt 时要记得<strong>组件卸载时 off 掉监听</strong>，不然监听器越积越多。</p>

	      <h2>7. 数据管理：简单的集中式数据源</h2>
	      <p>目前项目规模不大，没有引入 Pinia。所有文章数据集中定义在 <code>data/notes.ts</code> 中：</p>
	      <pre><code class="language-ts">export interface Note {
  id: string;
  title: string;
  date: string;
  icon: string;
  path: string;
  category?: string;
}

export const notes: Note[] = [
  { id: 'hello-world', title: 'Hello World', date: '2023-10-01',
    icon: 'fa fa-paper-plane', path: '/notes/hello-world', category: 'java' },
  // ... 更多文章
];</code></pre>
	      <p><strong>设计考量：</strong></p>
	      <ul>
	          <li><strong>当前方案：</strong>文章元数据在 notes.ts（列表展示用），正文按 id 拆成独立文件 + 动态 import 懒加载（详情页用）。纯静态数据 + 无后端，整个站可以直接部署到 GitHub Pages。</li>
	          <li><strong>什么时候升级：</strong>当跨组件共享的"可变状态"出现时（比如购物车、登录态），集中常量就不够了——那是 <a href="#/notes/pinia-intro">Pinia</a> 的领域。本站后来加入评论、桌宠状态时也仍然刻意保持"常量数据 + 组件内状态"的简单分层。</li>
	          <li><strong>判断标准：</strong>数据只读 → 常量文件就够；数据会被多处修改 → 状态管理。</li>
	      </ul>

	      <h2>8. Windows 98 风格实现</h2>
	      <p>保留怀旧风格是这次重构的重要目标。具体实现方式：</p>
	      <ul>
	          <li><strong>配色方案：</strong>经典 Win98 配色——银色按钮 <code>#C0C0C0</code>、海军蓝标题栏 <code>#000080</code>、灰色窗口背景 <code>#C0C0C0</code>、凹陷/凸起边框模拟 3D 效果。这些值在 Tailwind 里注册成自定义 token（silver/navy/win_black），全站只用这组颜色，保证"味儿正"。</li>
	          <li><strong>CSS 阴影技巧：</strong>使用 <code>box-shadow: inset 1px 1px #fff, inset -1px -1px #808080</code> 实现 Win98 经典的凹陷效果，<code>1px 1px #fff, -1px -1px #808080</code> 实现凸起效果——立体感全靠双色内阴影，不用渐变不用圆角。</li>
	          <li><strong>像素字体：</strong>使用系统默认的 sans-serif 字体，搭配 <code>font-smooth: never</code> 模拟低分辨率下的像素感（酌情使用）。</li>
	          <li><strong>响应式布局：</strong>虽然是桌面风格，但用 Flexbox 和 Grid 做了响应式适配，移动端也能正常使用（图标变小、网格列数自适应）。</li>
	      </ul>

	      <h2>9. 部署：GitHub Pages + 构建配置</h2>
	      <p>重构后的部署流程：</p>
	      <ol>
	          <li>本地执行 <code>npm run build</code>，Vite 将项目打包为静态文件到 <code>dist/</code> 目录。</li>
	          <li>通过部署工具把 <code>dist/</code> 推到 gh-pages 分支，GitHub Pages 直接托管。</li>
	      </ol>
	      <p>三个必查的配置坑：</p>
	      <ul>
	          <li><strong>base 路径：</strong><code>vite.config.ts</code> 中 <code>base</code> 要与部署路径一致（部署到仓库子路径时是 <code>/{仓库名}/</code>，部署到用户站根路径则是 <code>'/'</code>），否则资源 404。</li>
	          <li><strong>hash 路由：</strong>GitHub Pages 没有自定义回退规则，history 路由刷新深层路径必 404——用 <code>createWebHashHistory()</code> 一步到位。</li>
	          <li><strong>缓存策略：</strong>Vite 构建产物带内容 hash（app-3f9c2.js），文件名变了浏览器自然拉新的；但 index.html 本身要避免被强缓存——Pages 默认行为可以接受，自建 Nginx 时要显式配置。</li>
	      </ul>

	      <h2>10. 迁移避坑清单：我踩过的坑你别再踩</h2>
	      <p>重构不是一帆风顺的，这些坑每一颗都是真金白银的调试时间换来的：</p>
	      <ul>
	          <li><strong>别一次性重写，走"绞杀者"路线：</strong>先让 Vue 应用接管路由壳子，老页面作为组件逐页搬进来。大爆炸式重写的结果通常是"新站没写完，老站还挂着，两边数据都对不上"（路线见第 3 节）。</li>
	          <li><strong>v-html 渲染富文本要先想好 XSS：</strong>文章正文用 <code>v-html</code> 渲染，如果内容来源含用户输入（比如评论），必须消毒。本站正文是自己写的 HTML 字符串，风险可控；但这个决定要显式做出来，而不是忘了。</li>
	          <li><strong>Teleport 会改变组件"根"的行为：</strong>文章窗口用 <code>&lt;Teleport to="body"&gt;</code> 挂到 body 后组件变多根，外层容器的事件透传会失效——根元素自己补 <code>pointer-events-auto</code>，否则整个窗口点击穿透（这个 bug 排查了一晚上）。</li>
	          <li><strong>hash 路由下别用裸路径链接：</strong><code>href="/notes/xxx"</code> 会触发整页刷新回到桌面，站内链接一律 <code>href="#/notes/xxx"</code> 或 RouterLink；更进一步，原生片段跳转会触发 popstate 干扰路由守卫，统一走 router.push。</li>
	          <li><strong>构建检查 = 类型检查：</strong>本项目的验证手段是 <code>npm run build</code>（vue-tsc + vite build），没有 lint 和测试框架。改完必 build，类型错误挡在部署前——小项目这样够用，别为了仪式感堆工具链。</li>
	          <li><strong>引擎字段别放进响应式：</strong>游戏循环里的位置、速度这类每帧变化的值放进 ref 会疯狂触发更新——引擎保持纯 JS 对象，只在关键状态上做 ref 镜像（<a href="#/notes/vue-reactivity">响应式篇</a>的调度机制解释了为什么）。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>从静态 HTML 到 Vue 3 的迁移，本质上是一次<strong>"从手工作坊到工业化生产"</strong>的升级。组件化让你不用再复制粘贴 HTML，TypeScript 让你在重构时有底气，Vite 让开发体验从"等待"变成"即时"。如果你的个人网站也到了维护瓶颈期，强烈建议走一遍这个流程——<strong>边做边学，是最好的学习方式。</strong></p>
	      <p>启动开发服务器只需一行命令：</p>
	      <pre><code class="language-bash">cd vue-project
npm install    # 首次运行需安装依赖
npm run dev    # 启动开发服务器，浏览器自动打开 http://localhost:5173</code></pre>
	      <p>重构用到的核心知识在这个站里都有系列文章：<a href="#/notes/vue-reactivity">响应式系统</a>、<a href="#/notes/vue-composition">组合式 API</a>、<a href="#/notes/vue-router4">Vue Router 4</a>、<a href="#/notes/pinia-intro">Pinia</a>——本站本身就是这些文章的活例子。</p>`;export{t as default};

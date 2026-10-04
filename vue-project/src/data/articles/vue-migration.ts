// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>网站重构实战：从静态 HTML 到 Vue 3 + TypeScript 的现代化改造</h1>

	      <p>这个网站最初是用纯 HTML + CSS 搭建的静态页面——每个页面一个 .html 文件，公共头部和底部靠复制粘贴维护，交互全靠原生 JavaScript。当文章越来越多、功能越来越复杂后，<strong>静态站点的维护成本呈指数级上升</strong>。本文将完整记录我如何把这个网站重构为 Vue 3 + TypeScript + Vite 的现代化项目，希望对同样想升级技术栈的你有所启发。</p>

	      <h2>1. 为什么要重构？—— 静态站点的痛点</h2>
	      <p>先说说原来纯静态方案的具体问题，这些应该是很多个人网站的"通病"：</p>
	      <ul>
	          <li><strong>无法复用公共部分：</strong>导航栏、侧边栏、页脚每个页面都复制一份。改一个导航链接要手动改几十个 .html 文件。后来用 SSI（Server Side Includes）缓解了一些，但本地开发无法预览。</li>
	          <li><strong>JavaScript 散落各处：</strong>每个页面的 <code>&lt;script&gt;</code> 标签里写一段逻辑，全局变量满天飞，事件绑定混乱。随着交互增多（窗口系统、任务栏、文件管理器），代码越来越难以维护。</li>
	          <li><strong>CSS 全局污染：</strong>虽然是 Windows 98 风格的小站点，但样式文件越来越大后，改一个按钮样式可能影响其他页面的布局。</li>
	          <li><strong>没有构建流程：</strong>想用 ES6 语法得手动考虑浏览器兼容性，想压缩代码得手动跑工具，图片和字体没有统一管理。</li>
	      </ul>
	      <p>重构的目标很明确：<strong>组件化、可维护、可扩展，同时保留 Windows 98 的怀旧风格。</strong></p>

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

	      <h2>3. 项目结构设计</h2>
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
│   │   ├── AllNotes.vue      # "我的文档"——文章列表
│   │   ├── Categories.vue    # 文章分类页
│   │   └── NoteDetail.vue    # 文章详情页
│   ├── components/           # 可复用的 UI 组件
│   │   ├── Window.vue        # 通用窗口容器（标题栏 + 内容区）
│   │   ├── Taskbar.vue       # 底部任务栏（开始菜单 + 时钟）
│   │   └── DesktopIcon.vue   # 桌面图标
│   ├── data/
│   │   └── notes.ts          # 文章数据（标题、日期、分类、路径）
│   └── style.css             # 全局样式 + Windows 98 风格
├── index.html                # Vite 入口 HTML
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
└── package.json</code></pre>

	      <h2>4. 核心组件设计：Window.vue —— 一切皆窗口</h2>
	      <p>Windows 98 桌面模拟器的核心概念是<strong>"一切皆窗口"</strong>——文章列表是窗口，文章详情是窗口，设置是窗口，每个功能都运行在自己的窗口中。因此，<code>Window.vue</code> 是整个项目最重要的组件：</p>
	      <pre><code class="language-java">&lt;!-- Window.vue 的简化设计 --&gt;
&lt;script setup lang="ts"&gt;
defineProps&lt;{
  title: string;          // 窗口标题
  icon: string;           // 标题栏图标 class
  isOpen: boolean;        // 是否显示
  isActive: boolean;      // 是否当前活动窗口（影响标题栏颜色）
}&gt;();

const emit = defineEmits&lt;{
  close: [];
  minimize: [];
}&gt;();
&lt;/script&gt;</code></pre>
	      <p><strong>设计思路：</strong></p>
	      <ul>
	          <li><strong>Props 驱动：</strong>窗口的状态（标题、图标、是否打开、是否活动）全部通过 props 传入，组件自身不管理业务状态。这保证了 Window 组件的<strong>纯展示性</strong>——任何功能只要套上 Window，就有了 Windows 98 的窗口外观。</li>
	          <li><strong>事件上报：</strong>关闭和最小化操作通过 emit 通知父组件，由父组件（Desktop.vue）统一管理窗口的开关状态。</li>
	          <li><strong>插槽（Slot）：</strong>窗口内容区使用 <code>&lt;slot /&gt;</code>，这样每个页面可以自由填充内容——文章详情、列表、设置页等。</li>
	      </ul>

	      <h2>5. 路由设计：模拟操作系统的导航体验</h2>
	      <p>虽然是 SPA（单页应用），但为了模拟 Windows 的导航体验，路由设计做了一些"反常规"的选择：</p>
	      <pre><code class="language-java">const routes = [
  { path: '/', name: 'Desktop', component: Desktop },
  { path: '/computer', name: 'Computer', component: Computer },
  { path: '/categories', name: 'Categories', component: Categories },
  { path: '/all-notes', name: 'AllNotes', component: AllNotes },
  { path: '/notes/:id', name: 'NoteDetail', component: NoteDetail },
];</code></pre>
	      <ul>
	          <li><strong>桌面是根路径：</strong><code>/</code> 对应 Desktop.vue，这是用户进入网站看到的第一个画面——就像 Windows 开机后的桌面。</li>
	          <li><strong>文章详情用动态路由：</strong><code>/notes/:id</code> 通过 URL 参数定位到具体文章，方便分享链接（比如发给朋友一篇教程，URL 直接就是那篇文章）。</li>
	          <li><strong>分类筛选用 query 参数：</strong><code>/all-notes?category=java</code> 使用 query 而非路径参数，因为分类是筛选条件而不是资源定位——语义上更准确。</li>
	      </ul>

	      <h2>6. 数据管理：简单的集中式数据源</h2>
	      <p>目前项目规模不大，没有引入 Pinia 或 Vuex。所有文章数据集中定义在 <code>data/notes.ts</code> 中：</p>
	      <pre><code class="language-java">export interface Note {
  id: string;
  title: string;
  date: string;
  icon: string;
  path: string;
  category?: string;  // 可选分类：java | frontend | spring | database | devops
}

export const notes: Note[] = [
  { id: 'hello-world', title: 'Hello World', date: '2023-10-01',
    icon: 'fa fa-file-text-o', path: '/notes/hello-world', category: 'java' },
  // ... 更多文章
];</code></pre>
	      <p><strong>设计考量：</strong></p>
	      <ul>
	          <li><strong>当前方案：</strong>文章内容和元数据分开存储——元数据在 notes.ts（用于列表展示），HTML 内容直接在 NoteDetail.vue 中硬编码（用于详情页）。这样做的好处是简单直接，不需要数据库。</li>
	          <li><strong>未来演进方向：</strong>当文章数量超过 20 篇，考虑用 Markdown 文件存储文章内容，通过 Vite 的 <code>import.meta.glob</code> 动态加载。再往后可以考虑 Headless CMS。</li>
	      </ul>

	      <h2>7. Windows 98 风格实现</h2>
	      <p>保留怀旧风格是这次重构的重要目标。具体实现方式：</p>
	      <ul>
	          <li><strong>配色方案：</strong>经典 Win98 配色——银色按钮 <code>#C0C0C0</code>、海军蓝标题栏 <code>#000080</code>、灰色窗口背景 <code>#C0C0C0</code>、凹陷/凸起边框模拟 3D 效果。</li>
	          <li><strong>CSS 阴影技巧：</strong>使用 <code>box-shadow: inset 1px 1px #fff, inset -1px -1px #808080</code> 实现 Win98 经典的凹陷效果，<code>1px 1px #fff, -1px -1px #808080</code> 实现凸起效果。</li>
	          <li><strong>像素字体：</strong>使用系统默认的 sans-serif 字体，搭配 <code>font-smooth: never</code> 模拟低分辨率下的像素感（酌情使用）。</li>
	          <li><strong>响应式布局：</strong>虽然是桌面风格，但用 Flexbox 和 Grid 做了响应式适配，移动端也能正常使用（图标变小、网格列数自适应）。</li>
	      </ul>

	      <h2>8. 部署：GitHub Pages + GitHub Actions</h2>
	      <p>重构后的部署流程：</p>
	      <ol>
	          <li>本地执行 <code>npm run build</code>，Vite 将项目打包为静态文件到 <code>dist/</code> 目录。</li>
	          <li>通过 GitHub Actions，每次 push 到 main 分支自动触发构建和部署。</li>
	          <li>GitHub Pages 直接托管 <code>dist/</code> 目录的内容，绑定自定义域名后通过 HTTPS 访问。</li>
	      </ol>
	      <p>关键配置：<code>vite.config.ts</code> 中需要设置 <code>base: '/static-website/'</code>（或你的仓库名），否则 GitHub Pages 部署后路径会出错。</p>

	      <h2>9. 重构的得失与经验总结</h2>
	      <p><strong>做得好的地方：</strong></p>
	      <ul>
	          <li>组件拆分合理——Window、Taskbar、DesktopIcon 三个核心组件的边界清晰，新增功能页面只需写 View + 路由，无需改组件。</li>
	          <li>TypeScript 在定义 Note 接口和 props 类型时避免了大量低级错误。</li>
	          <li>保留了 Windows 98 风格的核心视觉特征，重构后外观和之前基本一致。</li>
	      </ul>
	      <p><strong>可以改进的地方：</strong></p>
	      <ul>
	          <li>文章内容是硬编码的 HTML 字符串——更新文章需要改 Vue 文件并重新部署，不够方便。后续应该迁移到 Markdown 或 CMS。</li>
	          <li>目前没有状态管理库——当窗口管理逻辑复杂到一定程度，需要引入 Pinia。</li>
	          <li>缺少单元测试——核心组件（Window、Taskbar）应该有基础的渲染测试。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>从静态 HTML 到 Vue 3 的迁移，本质上是一次<strong>"从手工作坊到工业化生产"</strong>的升级。组件化让你不用再复制粘贴 HTML，TypeScript 让你在重构时有底气，Vite 让开发体验从"等待"变成"即时"。如果你的个人网站也到了维护瓶颈期，强烈建议走一遍这个流程——<strong>边做边学，是最好的学习方式。</strong></p>
	      <p>启动开发服务器只需一行命令：</p>
	      <pre><code class="language-bash">cd vue-project
npm install    # 首次运行需安装依赖
npm run dev    # 启动开发服务器，浏览器自动打开 http://localhost:5173</code></pre>`;

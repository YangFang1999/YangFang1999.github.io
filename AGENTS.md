# AGENTS.md — Win98 风格个人博客

Windows 98 桌面复刻的个人技术博客。仓库根目录 = 本目录，`vue-project/` 是全部源码；部署在 GitHub Pages 用户站（`YangFang1999/YangFang1999.github.io`，base `/`，hash 路由 `createWebHashHistory`）。UI 语言为中文。

## 命令（都在 vue-project/ 下）

```bash
npm run build     # vue-tsc && vite build —— 这是唯一的类型检查，改完必须跑
npm run dev       # localhost:5173
npm run preview   # localhost:4173，直接从磁盘读 dist/，rebuild 后刷新页面即生效
```

没有 lint、没有测试框架。验证 = build 通过 + 浏览器实测。无 lint 规则，代码风格跟 Surrounding 代码走（分号/单引号/中文注释）。

## 架构边界

- **桌面隐喻**：一条路由 = 一个"窗口"。`App.vue` 的 `openWindows`（watch route.path）是任务栏窗口注册表，加新路由必须同步更新它和 `activateWindow`。
- `components/Window.vue` 是所有窗口的壳。根元素内置 `pointer-events-auto`——**勿删**：Teleport 让视图变多根组件后，App.vue 路由层的透传会失效，删了整个窗口点击穿透。props：`fixedSize`（禁还原，游戏用）、`plainMenus`（应用自带菜单行时隐藏默认假菜单栏）。
- **文章体系**：正文 = `src/data/articles/<id>.ts` 导出 HTML 字符串；元数据 = `notes.ts`；共享索引 = `articlesIndex.ts`（懒加载缓存、字数/体积、全文搜索，FindDialog/Computer/终端共用）。加文章：article + notes.ts + articlesIndex loader 三处。**分类显示名映射在 articlesIndex / NoteDetail / Categories 三处重复（终端 CAT_ORDER 是第四处），加分类要改齐。**
- **加新文章/分类的完整清单已固化为 skill `blog-add-article`**（用 Skill 工具调 `/blog-add-article`；文件在 `C:\Users\YF\.agents\skills\blog-add-article\SKILL.md`）——按"素材→id 决策→正文规范→三处接线→全站联动面盘点（自动/手动）→验证→部署"推演的全流程，含 Word 稿转换、hash 站内链接、giscus 评论按 `notes/<id>` 映射（id 永不改）、分类四处同步、**Readme 五处触点（含文章列表表格行 + 更新日志条目，每篇必查）**。加文章前先读它。
- HTML 字符串里：代码块的 `<` 转义 `&lt;`，模板字符串内的反引号和 `${}` 也要转义。
- 游戏引擎放 `src/game/`（纯逻辑/非响应式字段）；引擎字段不是响应式的，LED/计数类 UI 必须在操作后把值**拷贝进 ref**（computed 读引擎字段不会重算，扫雷踩过）。
- `src/giscusCapture.ts` 必须保持 main.ts 里 **import 在 router 之前**（giscus OAuth 回跳要赶在 vue-router 快照 location 之前重写地址，顺序错了登录回跳会退回桌面）。

## 新应用接入清单（8 处，缺一则任务栏/菜单不齐）

router（路由 + routeTitles）、App.vue（icons + openWindows watch + activateWindow + 系统属性"游戏 N 款"）、Taskbar 开始菜单、Computer.vue（D 盘 exe + objectCount + "N 个游戏"）、TerminalApp 的 APPS、QQPet 的 APP_QUOTES、Readme.md（应用表格 + 更新日志）。

## 硬约束

- **严禁任何声音/音效**（用户明确要求）。
- 图标只用 **Font Awesome 4.7**（FA5 图标如 fa-vuejs/fa-boxes 不渲染；新图标先 grep `node_modules/font-awesome/css/font-awesome.css` 确认）。
- Tailwind 自定义 token：颜色 `silver`/`navy`/`win_black`，阴影 `shadow-win95-outset/inset`；Win98 立体感用这组，勿用现代圆角阴影。
- **用户自己写的文字逐字使用，不得润色**（踩过：AI 味文案会被打回）。
- 线上故障优先怀疑浏览器本机残留（localStorage/坏 Cookie/端口混用），其次才是代码；`localhost:5173`(dev) 和 `:4173`(preview) 是两个独立 origin，登录态互不相通。

## 访客本机数据（localStorage，清测试痕迹要清全）

qq-pet-state、pet-hint-shown、has-visited、visit-count、icon-layout、desktop-theme、notepad-content、typing-best、terminal-history、terminal-color、screensaver-ms、minesweeper-best、giscus-session、giscus-return。

## 文档

`Readme.md`（仓库根）= 应用列表 + 更新日志，改了功能要同步；`vue-project/README.md` 是脚手架模板，可忽略。主 `index.html` 里有 og/twitter 分享 meta，og:image 用绝对 URL。

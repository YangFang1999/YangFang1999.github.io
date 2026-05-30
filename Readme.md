# YF's Blog — Windows 98 风格个人技术博客

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.4-4FC08D?logo=vue.js&logoColor=white" alt="Vue 3">
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5.1-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

## 📖 简介

欢迎来到我的个人技术博客！这是一个**完全复刻 Windows 98 操作界面**的 SPA 应用，你将在一个怀旧的桌面环境中浏览技术文章、写笔记、画画，甚至可以玩一局飞机大战。

博客内容聚焦 **Java 后端开发**，涵盖 Java 基础、Spring Boot、数据库、DevOps、前端等方向，记录了我从零开始学习编程的完整历程。

> 🔗 **在线体验**：`https://你的用户名.github.io`

## ✨ 特色功能

### 🖥️ Windows 98 桌面模拟

- **桌面图标** — 我的电脑、我的文档、控制面板、Internet 浏览器等经典图标
- **开始菜单** — 左下角经典的 Win98 开始按钮，带有动画弹出菜单，侧边有 YF-Blog 竖排文字
- **任务栏** — 正在运行的窗口以任务栏按钮展示，支持点击切换激活
- **系统托盘** — 实时时钟显示（含日期），音量图标
- **关机画面** — 经典的 "It is now safe to turn off your computer" 关机界面

### 📝 技术博客

- **12+ 篇深度文章** — 从 Java Hello World 到 Spring Boot、Docker，每篇都是千字长文
- **5 大分类** — Java · Spring · Database · Frontend · DevOps
- **代码高亮** — 使用 Prism.js，支持 Java、Bash、SQL 语法高亮
- **Windows 资源管理器风格浏览** — 地址栏、文件图标、向上导航按钮

### 🎮 内置应用程序

| 应用 | 说明 |
|------|------|
| 📁 **我的电脑** | 文件资源管理器视图，显示本地磁盘 (C:)、控制面板和网上邻居 |
| 📂 **我的文档** | 文章列表，支持按分类筛选，显示文件数量和地址栏路径 |
| ⚙️ **控制面板** | 5 大分类浏览入口，点击进入对应分类的文章列表 |
| 🌐 **Internet 浏览器** | 快捷跳转至 GitHub |
| 📝 **记事本** | 功能完整的文本编辑器！支持字号切换 (10-24px)、新建/保存，内容自动持久化到 localStorage，显示字符数和行数 |
| ✈️ **飞机大战** | 完整的竖版飞行射击游戏！多种敌机、Boss 战、道具系统、永久升级、最高分排行榜 |
| 🎨 **画图** | 绘图程序，支持铅笔、橡皮、直线、矩形、油漆桶填充，20 色调色板，画布自适应窗口大小 |
| 🔢 **计算器** | 功能齐全的计算器，支持四则运算、开方、百分比、正负切换，支持键盘输入和鼠标点击 |
| 🗑️ **回收站** | 经典 Win98 彩蛋 —— 点击提示 "回收站是空的" |

### 🎯 飞机大战游戏详情

- **4 种敌机类型**：侦察机 (1HP) · 战斗机 (3HP, 追踪弹) · 重装机 (5HP, 扇形弹) · Boss (25HP)
- **多种移动模式**：下坠、正弦摇摆、水平折返、画圈盘旋
- **4 种道具**：双倍火力 🔥 · 无敌护盾 🛡 · 速度提升 ⚡ · 回复生命 ❤
- **永久升级系统**：击杀敌人累积，自动提升子弹伤害 (最高 Lv5) 和射速
- **Boss 战**：每 1000 分触发，屏幕震动特效
- **粒子爆炸特效**、星空滚动背景
- **无敌模式彩蛋**：按 `I` 键或点击按钮开启
- **最高分** localStorage 持久化存储

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **Vue 3** | 前端框架，Composition API + `<script setup>` 语法 |
| **TypeScript** | 类型安全，接口定义 (Note, Enemy, Bullet 等) |
| **Vite 5** | 构建工具，开发服务器秒启动，HMR 极速热更新 |
| **Vue Router 4** | Hash 模式路由，完美适配 GitHub Pages |
| **TailwindCSS 3** | 原子化 CSS，自定义 Win98 配色和阴影 |
| **Prism.js** | 代码块语法高亮 (Java / Bash / SQL) |
| **Font Awesome 4.7** | 图标库 |
| **GitHub Actions** | CI/CD，push 自动构建部署 |
| **GitHub Pages** | 静态网站托管，免费 HTTPS |

## 📂 项目结构

```
vue-project/
├── src/
│   ├── main.ts                 # 应用入口，注册 router 并挂载
│   ├── App.vue                 # 根组件：桌面壁纸 + 图标 + 窗口管理 + 关机逻辑
│   ├── style.css               # 全局样式：Win98 滚动条 + Prism.js 主题 + 3D 阴影
│   ├── router/
│   │   └── index.ts            # 路由配置 (Hash 模式，9 条路由)
│   ├── views/                  # 页面级组件（每个"窗口"对应一个 View）
│   │   ├── Desktop.vue         # 桌面主页 + 首次访问欢迎窗口 (带统计数据)
│   │   ├── Computer.vue        # "我的电脑" — 磁盘/控制面板/网上邻居
│   │   ├── AllNotes.vue        # "我的文档" — 文章列表 + 分类筛选 (query 参数)
│   │   ├── Categories.vue      # "控制面板" — 5 大分类入口
│   │   ├── NoteDetail.vue      # 文章详情页 (12 篇完整文章，~2300 行)
│   │   ├── AirplaneApp.vue     # ✈️ 飞机大战 (Canvas 2D 游戏，~1200 行)
│   │   ├── NotepadApp.vue      # 📝 记事本 (localStorage 持久化)
│   │   ├── PaintApp.vue        # 🎨 画图 (Canvas + 油漆桶填充算法)
│   │   └── CalculatorApp.vue   # 🔢 计算器 (键盘 + 鼠标双输入)
│   ├── components/             # 可复用组件
│   │   ├── Window.vue          # 通用窗口容器：菜单栏 + 系统菜单 + 最小/最大/关闭
│   │   ├── Taskbar.vue         # 底部任务栏 + 开始菜单 (带动画) + 系统托盘时钟
│   │   └── DesktopIcon.vue     # 桌面图标：按下缩放效果 + 选中高亮
│   └── data/
│       └── notes.ts            # 文章元数据 (Note 接口定义 + 12 篇文章列表)
├── index.html                  # Vite 入口 HTML (CDN 加载 Font Awesome)
├── vite.config.ts              # Vite 配置：vendor 代码分割，ES2015 目标
├── tailwind.config.js          # Win98 主题色 + 凸起/凹陷阴影预设
└── package.json
```

## 🚀 本地开发

### 环境要求

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/你的用户名/你的用户名.github.io.git
cd 你的用户名.github.io/vue-project

# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 📦 部署

### 自动部署（推荐）

项目已配置 GitHub Actions，推送代码到 `main` 分支自动触发构建部署：

1. **构建** → 安装 Node.js 20，`npm install` + `npm run build`
2. **部署** → 将 `vue-project/dist/` 推送到 `gh-pages` 分支
3. **上线** → GitHub Pages 自动更新，30 秒内生效

工作流文件：`.github/workflows/deploy.yml`

### 手动部署

```bash
cd vue-project
npm install && npm run build

# 使用 gh-pages 一键部署
npx gh-pages -d dist
```

> ⚠️ **注意**：如果部署到 `https://用户名.github.io/仓库名/` 而非根域名，需修改 `vite.config.ts` 中的 `base` 为 `'/仓库名/'`。

## 🎨 Windows 98 设计还原

本项目高度还原了 Windows 98 的经典视觉风格：

- **经典配色** — 银色 `#C0C0C0`、海军蓝 `#000080`、青色桌面 `#008080`
- **3D 立体边框** — 双层 `box-shadow` 模拟 Win98 凸起/凹陷效果，按钮按下时反转
- **像素级滚动条** — 纯 CSS 还原 Win95/98 风格滚动条，含箭头按钮 SVG
- **菜单栏** — 文件/编辑/查看/帮助下拉菜单，支持 `Alt+F/E/V/H` 键盘快捷键
- **窗口控件** — 最小化/最大化/关闭按钮，最大化时切换为还原图标（双矩形叠加）
- **系统菜单** — 点击窗口左上角图标弹出，含还原/移动/大小/最小化/最大化/关闭
- **响应式适配** — 桌面图标和窗口在移动端自动缩放，网格列数自适应

## 📝 文章列表

| 文章 | 分类 | 日期 |
|------|------|------|
| Hello World — Java 入门与 JVM 运行原理 | Java | 2023-10-01 |
| IDEA Shortcuts — IntelliJ IDEA 高效开发指南 | Java | 2023-11-01 |
| Java Collections — 集合框架深度解析 | Java | 2023-11-15 |
| 设计模式入门 | Java | 2024-05-15 |
| Spring Boot Guide — 从零搭建 RESTful API | Spring | 2024-03-20 |
| MySQL Basics — 数据库基础入门 | Database | 2024-03-22 |
| Redis 基础入门 | Database | 2024-05-28 |
| Vue Migration — 静态 HTML 到 Vue 3 重构实战 | Frontend | 2024-03-15 |
| JavaScript ES6+ 新特性 | Frontend | 2024-05-01 |
| Git 常用命令 | DevOps | 2024-04-05 |
| Docker 入门指南 | DevOps | 2024-04-12 |
| Linux 基础命令 | DevOps | 2024-04-20 |

## 🗓️ 更新日志

### v2.0 (2024-05)

- ✈️ 新增**飞机大战**游戏 —— 完整射击游戏，4 种敌机、Boss 战、道具、永久升级
- 🎨 新增**画图**程序 —— 铅笔/橡皮/直线/矩形/油漆桶填充，20 色调色板
- 🔢 新增**计算器**应用 —— 支持键盘输入和鼠标点击
- 📝 新增**记事本**应用 —— 支持保存到 localStorage，字号可调
- ⚡ 优化首次加载速度 —— vendor 代码分割，ES2015 目标构建
- 🎨 DeepSeek AI 辅助美化界面细节
- 📝 丰富文章内容，增加深度技术细节

### v1.0 (2024-03)

- 🎉 从静态 HTML **全面升级**为 Vue 3 + TypeScript + Vite 架构
- 🖥️ 实现完整 Windows 98 桌面模拟系统
- 📂 实现"我的电脑"/"我的文档"资源管理器风格导航
- 📱 响应式设计，适配桌面端和移动端
- 🔄 配置 GitHub Actions 自动部署流水线

## 📄 License

MIT © 2024 YF

---

<p align="center">
  <i>It is now safe to turn off your computer.</i> 💾
</p>

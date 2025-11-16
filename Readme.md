# Java 新手成长记 - 个人技术博客

## 简介

这是一个记录我从 0 到 1 学习 Java 历程的个人技术博客。博客专注于分享 Java 基础语法、开发工具使用、框架学习笔记以及学习心得，内容以纯文字为主，简洁清晰，适合 Java 新手一起交流学习。

## 网站特点

- **纯文字内容**：无多余图片，专注知识分享，加载速度快
- **清晰分类**：笔记按「Java 基础」「开发工具」「数据库」等主题分类，方便查找
- **响应式设计**：适配桌面端和移动端，阅读体验良好
- **静态部署**：基于 GitHub Pages 部署，无需服务器，维护成本低

## 部署方式（GitHub Pages）

### 1. 准备工作

- 拥有 GitHub 账号
- 安装 Git（可选，也可直接在 GitHub 网页端操作）

### 2. 步骤

#### （1）创建 GitHub 仓库

- 登录 GitHub，点击右上角「+」→「New repository」
- 仓库名称填写：`你的用户名.github.io`（例如 `zhangsan.github.io`，必须严格遵循这个格式，否则无法正常访问）
- 勾选「Initialize this repository with a README」，点击「Create repository」

#### （2）上传网站文件

- 仓库创建后，点击「Add file」→「Upload files」
- 上传网站所有文件：
  - 根目录文件：`index.html`（首页）、`all-notes.html`（所有笔记列表页）
  - 笔记文件夹：`notes`（内含所有笔记详情页，如 `hello-world.html`、`idea-shortcuts.html` 等）
- 上传完成后，点击「Commit changes」保存

#### （3）配置 GitHub Pages

- 进入仓库设置：点击仓库顶部「Settings」
- 下拉找到「GitHub Pages」选项
- 在「Source」下拉框中，选择「main」分支（若你的默认分支是 `master` 则选 `master`），然后点击「Save」
- 等待片刻，页面会显示「Your site is published at https:// 你的用户名.github.io」，表示部署成功

### 3. 访问网站

- 直接访问地址：`https://你的用户名.github.io`（例如 `https://zhangsan.github.io`）
- 若后续更新内容，只需重新上传修改后的文件并提交，GitHub Pages 会自动更新
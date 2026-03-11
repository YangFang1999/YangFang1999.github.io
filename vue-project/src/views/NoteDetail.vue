<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css'; 
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

import Window from '../components/Window.vue';

const route = useRoute();
const router = useRouter();
const noteId = route.params.id as string;

const noteTitle = ref('Note Detail');
const noteContent = ref('<p>Loading...</p>');

const loadNoteContent = () => {
  if (noteId === 'hello-world') {
    noteTitle.value = 'Hello World';
    noteContent.value = `
      <h1>Java 入门：Hello World 详解与环境配置</h1>
      
      <p>大家好！这是我的第一篇 Java 学习笔记。作为一个不折不扣的新手，我想把我从零开始的每一步都记录下来。今天，我们从最经典的 "Hello, World!" 程序开始。</p>
      
      <h2>1. 什么是 Java？</h2>
      <p>Java 是一门面向对象的编程语言，不仅吸收了 C++ 语言的各种优点，还摒弃了 C++ 里难以理解的多继承、指针等概念。Java 具有简单性、面向对象、分布式、健壮性、安全性、平台独立与可移植性、多线程、动态性等特点。</p>

      <h2>2. 准备工作：安装 JDK</h2>
      <p>要运行 Java 程序，首先得有 Java 开发环境，也就是 JDK (Java Development Kit)。</p>
      <ul>
          <li><strong>JDK (Java Development Kit)</strong>: Java 开发工具包，包含 JRE 和开发工具（如 javac, java, javadoc 等）。</li>
          <li><strong>JRE (Java Runtime Environment)</strong>: Java 运行环境，包含 JVM 和核心类库。</li>
          <li><strong>JVM (Java Virtual Machine)</strong>: Java 虚拟机，是运行 Java 字节码的虚拟计算机。</li>
      </ul>
      <p><strong>下载 JDK</strong>：推荐从 Oracle 官网下载。注意，现在主流的是 Java 17 或 21（LTS 版本）。</p>

      <h2>3. 配置环境变量 (Windows)</h2>
      <p>这是最关键也最容易出错的一步。配置环境变量是为了在任何目录下都能使用 java 命令。</p>
      <ol>
          <li>右键点击 "此电脑" -> "属性" -> "高级系统设置" -> "环境变量"。</li>
          <li>新建系统变量 <code>JAVA_HOME</code>，值为 JDK 安装路径（例如 <code>C:\\Program Files\\Java\\jdk-17</code>）。</li>
          <li>编辑 <code>Path</code> 变量，添加 <code>%JAVA_HOME%\\bin</code>。</li>
      </ol>
      <p>验证：打开 CMD 输入 <code>java -version</code>，如果显示版本号则配置成功。</p>

      <h2>4. 编写第一个程序</h2>
      <p>我们可以使用记事本编写代码，也可以使用 IDE。这里我们先看代码结构：</p>
      
      <pre><code class="language-java">public class HelloWorld {
    public static void main(String[] args) {
        // 这是我的第一个 Java 程序
        System.out.println("Hello, World!");
    }
}</code></pre>

      <h3>代码解析：</h3>
      <ul>
          <li><code>public class HelloWorld</code>: 定义了一个名为 HelloWorld 的公开类。<strong>注意：文件名必须与类名完全一致（包括大小写）。</strong></li>
          <li><code>public static void main(String[] args)</code>: 这是程序的入口点。JVM 从这里开始执行。</li>
          <li><code>System.out.println</code>: 这是输出语句，用于在控制台打印文本。</li>
      </ul>

      <h2>5. 编译与运行</h2>
      <ol>
          <li><strong>编译</strong>: 在命令行输入 <code>javac HelloWorld.java</code>。如果没有报错，会生成 <code>HelloWorld.class</code> 字节码文件。</li>
          <li><strong>运行</strong>: 输入 <code>java HelloWorld</code>。</li>
      </ol>
      <p>控制台输出：<code>Hello, World!</code></p>
    `;
  } else if (noteId === 'idea-shortcuts') {
    noteTitle.value = 'IDEA Shortcuts';
    noteContent.value = `
      <h1>IntelliJ IDEA 高效开发快捷键指南</h1>
      
      <p>IntelliJ IDEA 被认为是目前最好的 Java 开发工具。熟练使用快捷键，可以让你的编码速度和效率大大提升，真正实现“键指如飞”。</p>
      
      <h2>1. 核心编辑操作 (Must Know)</h2>
      <ul>
          <li><code>Ctrl + Space</code>：基础代码补全（类、方法、变量）。</li>
          <li><code>Ctrl + Shift + Space</code>：智能代码补全（根据预期类型过滤）。</li>
          <li><code>Ctrl + D</code>：复制当前行或选中的代码块到下一行。</li>
          <li><code>Ctrl + Y</code>：删除当前行。</li>
          <li><code>Alt + Enter</code>：显示意图动作和快速修复（自动导包、异常处理等）。</li>
          <li><code>Ctrl + Alt + L</code>：格式化代码。</li>
      </ul>

      <h2>2. 快速导航与搜索</h2>
      <ul>
          <li><code>Double Shift</code>：搜索任何地方（类、文件、符号、操作）。</li>
          <li><code>Ctrl + N</code>：搜索类。</li>
          <li><code>Ctrl + Shift + N</code>：搜索文件。</li>
          <li><code>Ctrl + B</code> 或 <code>Ctrl + Click</code>：跳转到定义。</li>
          <li><code>Ctrl + Alt + B</code>：跳转到实现类。</li>
          <li><code>Alt + F7</code>：查找用法（Find Usages）。</li>
      </ul>

      <h2>3. 重构神器</h2>
      <ul>
          <li><code>Shift + F6</code>：重命名（安全重命名，自动更新所有引用）。</li>
          <li><code>Ctrl + Alt + V</code>：提取变量（自动声明变量类型）。</li>
          <li><code>Ctrl + Alt + M</code>：提取方法。</li>
          <li><code>Ctrl + Alt + O</code>：优化导入（去除无用的 import）。</li>
      </ul>

      <h2>4. 调试技巧</h2>
      <ul>
          <li><code>Shift + F9</code>：调试运行。</li>
          <li><code>F8</code>：Step Over (单步跳过)。</li>
          <li><code>F7</code>：Step Into (单步进入)。</li>
          <li><code>Shift + F8</code>：Step Out (单步跳出)。</li>
          <li><code>Alt + F8</code>：Evaluate Expression (计算表达式的值)。</li>
      </ul>

      <h2>5. Live Templates (代码模板)</h2>
      <ul>
          <li>输入 <code>psvm</code> + Tab：生成 <code>public static void main(String[] args)</code>。</li>
          <li>输入 <code>sout</code> + Tab：生成 <code>System.out.println()</code>。</li>
          <li>输入 <code>fori</code> + Tab：生成 <code>for</code> 循环。</li>
      </ul>
    `;
  } else if (noteId === 'java-collections-framework') {
    noteTitle.value = 'Java Collections';
    noteContent.value = `
      <h1>Java 集合框架详解</h1>
      
      <p>集合框架提供了丰富的数据结构和算法，掌握各种集合的特点和使用场景对于编写高效的 Java 程序至关重要。</p>
      
      <h2>1. 层次结构</h2>
      <ul>
          <li><strong>Collection</strong>: List (有序重复), Set (无序不重复)</li>
          <li><strong>Map</strong>: Key-Value 键值对</li>
      </ul>
      
      <h2>2. 常用实现类</h2>
      <ul>
          <li><strong>ArrayList</strong>: 动态数组，查询快，增删慢。</li>
          <li><strong>LinkedList</strong>: 双向链表，增删快，查询慢。</li>
          <li><strong>HashSet</strong>: 哈希表，无序，去重。</li>
          <li><strong>HashMap</strong>: 哈希表，Key-Value，无序。</li>
      </ul>
      
      <h2>3. 遍历方式</h2>
      <pre><code class="language-java">// for-each
for (String item : list) { ... }

// Lambda
list.forEach(item -> System.out.println(item));</code></pre>
    `;
  } else if (noteId === 'vue-migration') {
    noteTitle.value = 'Vue Migration';
    noteContent.value = `
      <h1>网站重构：从静态 HTML 到 Vue 3</h1>
      
      <p>本网站最初由纯 HTML/CSS 构建，为了获得更好的开发体验和组件复用性，我们将其重构为 Vue 3 项目。</p>
      
      <h2>1. 技术栈升级</h2>
      <ul>
          <li><strong>框架</strong>: Vue 3 (Composition API)</li>
          <li><strong>构建工具</strong>: Vite</li>
          <li><strong>语言</strong>: TypeScript</li>
          <li><strong>样式</strong>: TailwindCSS + 自定义 CSS (Windows 98 风格)</li>
      </ul>
      
      <h2>2. 核心组件</h2>
      <p>我们将重复的 UI 元素提取为独立组件：</p>
      <ul>
          <li><code>Window.vue</code>: 通用窗口容器，支持最小化/关闭。</li>
          <li><code>Taskbar.vue</code>: 底部任务栏，集成开始菜单和时钟。</li>
          <li><code>DesktopIcon.vue</code>: 桌面图标组件。</li>
      </ul>
      
      <h2>3. 路由管理</h2>
      <p>使用 <code>vue-router</code> 实现单页应用 (SPA) 的页面切换，模拟操作系统的窗口导航体验。</p>
      
      <pre><code class="language-bash"># 启动开发服务器
npm run dev</code></pre>
    `;
  } else if (noteId === 'spring-boot-guide') {
    noteTitle.value = 'Spring Boot Guide';
    noteContent.value = `
      <h1>Spring Boot 快速入门指南</h1>
      <p>Spring Boot 简化了基于 Spring 的应用开发，你只需 "run" 就能创建一个独立的、生产级别的 Spring 应用。</p>
      
      <h2>1. 核心特性</h2>
      <ul>
        <li><strong>独立运行</strong>: 内嵌 Tomcat/Jetty，无需部署 WAR 文件。</li>
        <li><strong>简化配置</strong>: 提供 "Starter" 依赖，自动配置 Spring。</li>
        <li><strong>生产就绪</strong>: 提供指标、健康检查等功能。</li>
      </ul>

      <h2>2. 创建 REST API</h2>
      <pre><code class="language-java">@RestController
@RequestMapping("/api")
public class HelloController {
    
    @GetMapping("/hello")
    public String sayHello() {
        return "Hello, Spring Boot!";
    }
}</code></pre>
    `;
  } else if (noteId === 'mysql-basics') {
    noteTitle.value = 'MySQL Basics';
    noteContent.value = `
      <h1>MySQL 基础命令速查</h1>
      <p>常用的 MySQL 数据库操作命令。</p>
      
      <h2>1. 数据库操作</h2>
      <pre><code class="language-sql">CREATE DATABASE mydb;
USE mydb;
DROP DATABASE mydb;</code></pre>

      <h2>2. 表操作</h2>
      <pre><code class="language-sql">CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100)
);</code></pre>

      <h2>3. 数据增删改查 (CRUD)</h2>
      <pre><code class="language-sql">-- Insert
INSERT INTO users (username, email) VALUES ('john', 'john@example.com');

-- Select
SELECT * FROM users WHERE id = 1;

-- Update
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- Delete
DELETE FROM users WHERE id = 1;</code></pre>
    `;
  } else {
    noteTitle.value = noteId;
    noteContent.value = `<p>Content for ${noteId} not migrated yet.</p>`;
  }
};

onMounted(() => {
  loadNoteContent();
  setTimeout(() => Prism.highlightAll(), 100);
});

</script>

<template>
    <Window 
      :title="noteTitle" 
      icon="fa fa-file-text-o" 
      isOpen
      isActive
      @close="router.push('/all-notes')"
    >
      <div class="notepad-content font-sans" v-html="noteContent"></div>
    </Window>
</template>

<style>
.notepad-content {
    font-family: 'Courier New', Courier, monospace;
    line-height: 1.5;
}
.notepad-content h1 { font-size: 1.5em; font-weight: bold; margin-bottom: 1em; }
.notepad-content h2 { font-size: 1.2em; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; }
.notepad-content h3 { font-size: 1.1em; font-weight: bold; margin-top: 1em; margin-bottom: 0.5em; }
.notepad-content p { margin-bottom: 1em; }
.notepad-content ul, .notepad-content ol { margin-left: 2em; margin-bottom: 1em; list-style-type: disc; }
.notepad-content li { margin-bottom: 0.5em; }
.notepad-content code { background: #eee; padding: 0 4px; }
.notepad-content pre { background: #f5f5f5; border: 1px solid #ccc; padding: 10px; margin-bottom: 1em; overflow-x: auto; }
</style>

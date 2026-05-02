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
  } else if (noteId === 'git-basics') {
    noteTitle.value = 'Git 常用命令';
    noteContent.value = `
      <h1>Git 常用命令速查手册</h1>
      <p>Git 是目前最流行的分布式版本控制系统。无论是个人项目还是团队协作，掌握 Git 都是程序员的必备技能。</p>

      <h2>1. 基础配置</h2>
      <pre><code class="language-bash"># 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 查看配置
git config --list</code></pre>

      <h2>2. 仓库操作</h2>
      <pre><code class="language-bash"># 初始化新仓库
git init

# 克隆远程仓库
git clone https://github.com/user/repo.git

# 查看仓库状态
git status

# 查看提交历史
git log --oneline --graph --all</code></pre>

      <h2>3. 暂存与提交</h2>
      <pre><code class="language-bash"># 添加文件到暂存区
git add filename.txt
git add .                    # 添加所有文件

# 提交
git commit -m "commit message"

# 合并 add 和 commit（已跟踪文件）
git commit -am "commit message"</code></pre>

      <h2>4. 分支管理</h2>
      <pre><code class="language-bash"># 查看分支
git branch

# 创建分支
git branch feature-login

# 切换分支
git checkout feature-login
# 或使用新命令
git switch feature-login

# 创建并切换
git checkout -b feature-payment

# 合并分支
git merge feature-login

# 删除分支
git branch -d feature-login</code></pre>

      <h2>5. 远程操作</h2>
      <pre><code class="language-bash"># 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 推送
git push origin main

# 拉取
git pull origin main

# 查看远程仓库
git remote -v</code></pre>

      <h2>6. 撤销与回退</h2>
      <pre><code class="language-bash"># 撤销工作区修改
git checkout -- filename.txt

# 撤销暂存区
git reset HEAD filename.txt

# 回退到某个版本
git reset --hard HEAD~1

# 新建提交来撤销
git revert HEAD</code></pre>
    `;
  } else if (noteId === 'docker-intro') {
    noteTitle.value = 'Docker 入门指南';
    noteContent.value = `
      <h1>Docker 容器化入门指南</h1>
      <p>Docker 是一个开源的容器化平台，让你可以将应用程序及其依赖打包到一个轻量级、可移植的容器中，实现"一次构建，到处运行"。</p>

      <h2>1. 核心概念</h2>
      <ul>
        <li><strong>镜像 (Image)</strong>: 一个只读的模板，包含运行应用的代码、运行时、库和配置。</li>
        <li><strong>容器 (Container)</strong>: 镜像的运行实例，可以启动、停止、移动和删除。</li>
        <li><strong>Dockerfile</strong>: 用来构建镜像的文本文件，包含一系列指令。</li>
        <li><strong>仓库 (Registry)</strong>: 存放镜像的地方，如 Docker Hub。</li>
      </ul>

      <h2>2. 常用命令</h2>
      <pre><code class="language-bash"># 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 查看本地镜像
docker images

# 拉取镜像
docker pull nginx:latest

# 运行容器
docker run -d -p 8080:80 --name my-nginx nginx

# 停止/启动/重启容器
docker stop my-nginx
docker start my-nginx
docker restart my-nginx

# 删除容器
docker rm my-nginx

# 删除镜像
docker rmi nginx:latest</code></pre>

      <h2>3. 编写 Dockerfile</h2>
      <pre><code class="language-bash"># 基于 Node.js 的应用
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]</code></pre>

      <h2>4. Docker Compose</h2>
      <p>用于定义和运行多容器 Docker 应用。</p>
      <pre><code class="language-bash"># docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123</code></pre>
    `;
  } else if (noteId === 'linux-commands') {
    noteTitle.value = 'Linux 基础命令';
    noteContent.value = `
      <h1>Linux 基础命令速查</h1>
      <p>Linux 是服务器端最常用的操作系统。掌握基本的 Linux 命令是后端开发和运维的基础。</p>

      <h2>1. 文件和目录操作</h2>
      <pre><code class="language-bash"># 列出文件
ls -la

# 切换目录
cd /path/to/dir
cd ..         # 上级目录
cd ~          # 回到主目录

# 创建目录
mkdir my-project

# 创建文件
touch README.md

# 复制
cp source.txt dest.txt
cp -r dir1 dir2      # 复制目录

# 移动/重命名
mv old.txt new.txt

# 删除
rm file.txt
rm -rf directory/     # 递归强制删除</code></pre>

      <h2>2. 文件查看</h2>
      <pre><code class="language-bash"># 查看文件内容
cat file.txt

# 分页查看
less file.txt

# 查看前/后 N 行
head -n 10 file.txt
tail -n 10 file.txt

# 实时查看日志
tail -f app.log</code></pre>

      <h2>3. 权限管理</h2>
      <pre><code class="language-bash"># 查看权限
ls -l filename

# 修改权限 (r=4, w=2, x=1)
chmod 755 script.sh     # rwx r-x r-x
chmod +x script.sh      # 添加执行权限

# 修改所有者
chown user:group filename</code></pre>

      <h2>4. 进程管理</h2>
      <pre><code class="language-bash"># 查看进程
ps aux
ps aux | grep java

# 实时进程信息
top
htop

# 结束进程
kill -9 PID
pkill -f process-name</code></pre>

      <h2>5. 系统信息</h2>
      <pre><code class="language-bash"># 磁盘空间
df -h

# 目录大小
du -sh /path/

# 内存使用
free -h

# 查看内核版本
uname -a</code></pre>

      <h2>6. 网络操作</h2>
      <pre><code class="language-bash"># 测试连通性
ping baidu.com

# 查看端口占用
netstat -tlnp
ss -tlnp

# 下载文件
wget https://example.com/file.tar.gz
curl -O https://example.com/file.tar.gz</code></pre>
    `;
  } else if (noteId === 'javascript-es6') {
    noteTitle.value = 'JavaScript ES6+ 新特性';
    noteContent.value = `
      <h1>JavaScript ES6+ 常用新特性总结</h1>
      <p>ES6 (ECMAScript 2015) 及其后续版本为 JavaScript 带来了大量新特性，极大地提升了开发体验。本文总结最常用的特性。</p>

      <h2>1. let 和 const</h2>
      <pre><code class="language-java">// let: 块级作用域变量
for (let i = 0; i < 5; i++) { ... }

// const: 常量，不可重新赋值
const PI = 3.14159;
const arr = [1, 2, 3];
arr.push(4);  // 可以修改内容</code></pre>

      <h2>2. 箭头函数</h2>
      <pre><code class="language-java">// 传统函数
function add(a, b) {
    return a + b;
}

// 箭头函数
const add = (a, b) => a + b;
const greet = name => \`Hello, \${name}\`;

// 不绑定自己的 this
const obj = {
    name: 'JS',
    sayHi: () => console.log(this.name) // undefined
};</code></pre>

      <h2>3. 模板字符串</h2>
      <pre><code class="language-java">const name = 'World';
const msg = \`Hello, \${name}!\`;

// 多行字符串
const html = \`
    <div>
        <p>Line 1</p>
        <p>Line 2</p>
    </div>
\`;</code></pre>

      <h2>4. 解构赋值</h2>
      <pre><code class="language-java">// 数组解构
const [a, b, c] = [1, 2, 3];
const [first, ...rest] = [1, 2, 3, 4];  // first=1, rest=[2,3,4]

// 对象解构
const { name, age } = { name: 'John', age: 30 };
const { name: userName } = { name: 'John' };  // 重命名</code></pre>

      <h2>5. 扩展运算符</h2>
      <pre><code class="language-java">// 合并数组
const arr = [1, 2, ...otherArr, 5];

// 复制对象
const newObj = { ...oldObj, newProp: 'value' };

// 函数参数
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}</code></pre>

      <h2>6. Promise 与 Async/Await</h2>
      <pre><code class="language-java">// Promise
fetch('/api/data')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));

// Async/Await (ES2017)
async function getData() {
    try {
        const res = await fetch('/api/data');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}</code></pre>
    `;
  } else if (noteId === 'design-patterns') {
    noteTitle.value = '设计模式入门';
    noteContent.value = `
      <h1>设计模式入门：常用模式速览</h1>
      <p>设计模式是软件开发中经过验证的、可复用的解决方案。GoF (Gang of Four) 总结了 23 种经典设计模式，本文介绍最常用的几种。</p>

      <h2>1. 单例模式 (Singleton)</h2>
      <p>确保一个类只有一个实例，并提供全局访问点。</p>
      <pre><code class="language-java">public class Singleton {
    private static Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}</code></pre>

      <h2>2. 工厂模式 (Factory)</h2>
      <p>定义一个创建对象的接口，由子类决定实例化哪个类。</p>
      <pre><code class="language-java">interface Animal { void speak(); }

class Dog implements Animal {
    public void speak() { System.out.println("Woof!"); }
}

class Cat implements Animal {
    public void speak() { System.out.println("Meow!"); }
}

class AnimalFactory {
    public Animal createAnimal(String type) {
        return switch (type) {
            case "dog" -> new Dog();
            case "cat" -> new Cat();
            default -> throw new IllegalArgumentException();
        };
    }
}</code></pre>

      <h2>3. 建造者模式 (Builder)</h2>
      <pre><code class="language-java">public class User {
    private String name;
    private int age;
    private String email;

    public static class Builder {
        private String name;
        private int age;
        private String email;

        public Builder name(String name) {
            this.name = name; return this; }
        public Builder age(int age) {
            this.age = age; return this; }
        public Builder email(String email) {
            this.email = email; return this; }
        public User build() { return new User(this); }
    }

    private User(Builder b) {
        this.name = b.name;
        this.age = b.age;
        this.email = b.email;
    }
}

// 使用
User user = new User.Builder()
    .name("张三")
    .age(25)
    .email("zhangsan@example.com")
    .build();</code></pre>

      <h2>4. 观察者模式 (Observer)</h2>
      <p>定义一对多依赖关系，当对象状态改变时，所有依赖者自动收到通知。</p>
      <pre><code class="language-java">// Spring 事件机制就是经典的观察者模式
@Component
public class OrderListener {
    @EventListener
    public void handleOrder(OrderEvent event) {
        // 发送通知、记录日志等
    }
}</code></pre>
    `;
  } else if (noteId === 'redis-basics') {
    noteTitle.value = 'Redis 基础入门';
    noteContent.value = `
      <h1>Redis 缓存数据库基础入门</h1>
      <p>Redis (Remote Dictionary Server) 是一个开源的、基于内存的键值存储数据库。它支持多种数据结构，常用作缓存、消息队列和会话管理。</p>

      <h2>1. 核心特性</h2>
      <ul>
        <li><strong>基于内存</strong>: 读写速度极快，适合作为缓存。</li>
        <li><strong>丰富的数据类型</strong>: String, Hash, List, Set, Sorted Set。</li>
        <li><strong>持久化</strong>: RDB 快照和 AOF 日志两种方式。</li>
        <li><strong>支持事务</strong>: 命令原子执行。</li>
        <li><strong>发布/订阅</strong>: 消息系统。</li>
      </ul>

      <h2>2. 基本数据类型操作</h2>
      <pre><code class="language-bash"># String
SET key "value"
GET key
SETEX token 3600 "abc123"    # 带过期时间 (秒)

# Hash
HSET user:1 name "张三" age "25"
HGET user:1 name
HGETALL user:1

# List
LPUSH queue "task1" "task2"
RPOP queue
LRANGE queue 0 -1           # 查看全部

# Set
SADD tags "java" "redis"
SISMEMBER tags "java"

# Sorted Set
ZADD leaderboard 100 "player1" 200 "player2"
ZRANGE leaderboard 0 -1 REV</code></pre>

      <h2>3. Spring Boot 集成</h2>
      <pre><code class="language-java">// 依赖
// spring-boot-starter-data-redis

@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
        return template;
    }
}

@Service
public class CacheService {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    public void set(String key, Object value, long timeout) {
        redisTemplate.opsForValue().set(key, value, timeout, TimeUnit.SECONDS);
    }

    public Object get(String key) {
        return redisTemplate.opsForValue().get(key);
    }
}</code></pre>

      <h2>4. 缓存策略</h2>
      <ul>
        <li><strong>Cache Aside</strong>: 先查缓存，缓存没有则查数据库，并回填缓存。</li>
        <li><strong>Read Through</strong>: 缓存层代理数据读取。</li>
        <li><strong>Write Through</strong>: 同步更新缓存和数据库。</li>
        <li><strong>Write Behind</strong>: 先更新缓存，异步更新数据库。</li>
      </ul>

      <h2>5. 常见问题</h2>
      <ul>
        <li><strong>缓存穿透</strong>: 查询不存在的数据 → 缓存空值或布隆过滤器。</li>
        <li><strong>缓存击穿</strong>: 热点 Key 过期 → 互斥锁或永不过期。</li>
        <li><strong>缓存雪崩</strong>: 大量 Key 同时过期 → 随机化过期时间。</li>
      </ul>
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

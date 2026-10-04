// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>JavaScript ES6+ 常用新特性：从回调地狱到优雅的 Async/Await</h1>

	      <p>ES6（ECMAScript 2015）是 JavaScript 历史上最大的一次更新，此后的 ES7-ES14 每年一个版本，持续带来新特性。这些新特性不仅让代码更简洁，更重要的是<strong>改变了我们组织代码的方式</strong>。本文按"日常使用频率"组织，从每天都在用的 let/const 到彻底改变异步编程的 async/await，逐一讲解。</p>

	      <h2>1. let 和 const：告别 var 的种种问题</h2>
	      <p>var 有三个"反直觉"的问题：变量提升（hoisting）、没有块级作用域、可以重复声明。let 和 const 彻底解决了这些问题：</p>
	      <pre><code class="language-java">// var 的问题一：变量提升
console.log(x);   // undefined（var 声明被提升，但赋值没有）
var x = 5;

console.log(y);   // ReferenceError（let 不存在提升导致的意外）
let y = 5;

// var 的问题二：没有块级作用域
for (var i = 0; i < 3; i++) { }
console.log(i);   // 3（i 泄露到循环外了！）

for (let j = 0; j < 3; j++) { }
console.log(j);   // ReferenceError（j 只在 for 块内有效）

// var 的问题三：在 setTimeout 循环中的经典 bug
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);  // 输出 3, 3, 3（共享同一个 i）
}
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);  // 输出 0, 1, 2（每次迭代是新的 i）
}

// const：声明常量
const PI = 3.14159;
PI = 3;           // TypeError: Assignment to constant variable
const arr = [1, 2, 3];
arr.push(4);      // 可以！const 保护的是引用，不是内容
arr = [5, 6];     // TypeError（不能重新赋值）</code></pre>
	      <p><strong>使用原则：</strong>默认用 const，需要重新赋值时改用 let。<strong>永远不要再使用 var。</strong></p>

	      <h2>2. 箭头函数：更短、更清晰的函数写法</h2>
	      <p>箭头函数不仅仅是"更短的 function"，它最大的区别是<strong>不绑定自己的 this</strong>——它从定义时的外层作用域继承 this。</p>
	      <pre><code class="language-java">// 语法简写
const add = (a, b) => a + b;                // 单行表达式自动 return
const greet = name => "Hello, " + name;      // 单个参数可省略括号
const sayHi = () => console.log("Hi");       // 无参数需要空括号
const getObj = () => ({ name: "Alice" });    // 返回对象字面量需要加括号

// 关键区别：this 绑定
class Counter {
    constructor() {
        this.count = 0;
        // 传统函数：this 丢失
        setTimeout(function() {
            console.log(this.count);  // undefined（this 指向 window/global）
        }, 100);
        // 箭头函数：this 正确继承
        setTimeout(() => {
            console.log(this.count);  // 0（this 指向 Counter 实例）
        }, 100);
    }
}

// 什么时候不能用箭头函数？
// 1. 对象方法（需要 this 指向调用者时）
const obj = {
    name: "Alice",
    sayHi: () => console.log(this.name)  // undefined，this 指向外层
};
// 应改为：
const obj2 = {
    name: "Alice",
    sayHi() { console.log(this.name); }  // "Alice"
};

// 2. 需要 arguments 对象时（箭头函数没有 arguments）</code></pre>

	      <h2>3. 模板字符串：终于可以优雅地拼接字符串了</h2>
	      <p>ES6 引入了<strong>模板字符串（Template Literals）</strong>，使用反引号（backtick）包围，支持变量插值和多行文本。语法是使用反引号代替单引号或双引号，用 <code>\${变量名}</code> 嵌入表达式：</p>
	      <pre><code class="language-java">// 之前：字符串拼接，可读性极差
const msg = "Hello, " + name + "! You have " + count + " messages.";

// 使用模板字符串（反引号 + \${} 语法）
// 写法: 用反引号包围字符串，\${变量名} 直接嵌入变量

// 多行字符串——不需要 \n 了！
const cardHtml = "<div class='card'>
" +
    "    <h2>" + title + "</h2>
" +
    "    <p>" + content + "</p>
" +
    "</div>";

// 支持任意表达式
// 写法: 反引号内可以使用任意 JavaScript 表达式

// 标签模板（Tagged Templates）——高级用法
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) =>
        result + str + (values[i] ? "<mark>" + values[i] + "</mark>" : ""), "");
}
// 调用方式: highlight(模板字符串)
// 效果: 自动将插入的变量用 <mark> 标签包裹</code></pre>

	      <h2>4. 解构赋值：从对象和数组中提取值的优雅方式</h2>
	      <pre><code class="language-java">// 对象解构
const { name, age, city = "Beijing" } = user;
// 等价于：
// const name = user.name;
// const age = user.age;
// const city = user.city ?? "Beijing";  // 默认值

const { name: userName } = user;         // 重命名
const { address: { street } } = user;    // 嵌套解构

// 函数参数解构（React 组件中非常常见）
function UserCard({ name, age, avatar }) {
    console.log(name, age, avatar);
}

// 数组解构
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first=1, second=2, rest=[3, 4, 5]

// 交换变量（不需要临时变量了！）
let a = 1, b = 2;
[a, b] = [b, a];   // a=2, b=1

// 忽略某些元素
const [, , third] = [1, 2, 3, 4];  // third=3</code></pre>

	      <h2>5. 扩展运算符与剩余参数：... 的两种身份</h2>
	      <pre><code class="language-java">// 扩展运算符：把数组/对象"展开"
const arr1 = [1, 2, 3];
const arr2 = [0, ...arr1, 4, 5];         // [0, 1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3, b: 99 };   // { a: 1, b: 99, c: 3 }（后面的覆盖前面的）

// 浅拷贝
const copyArr = [...arr];
const copyObj = { ...obj };

// 合并
const merged = { ...defaultConfig, ...userConfig };

// 剩余参数：收集剩余参数到数组
function sum(first, ...others) {
    return first + others.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4, 5);  // 15</code></pre>

	      <h2>6. Promise 与 Async/Await：异步编程的进化史</h2>
	      <p>这是现代 JavaScript 最重要的概念之一。先回顾一下异步编程的进化：</p>
	      <pre><code class="language-java">// 第一阶段：回调地狱（Callback Hell）
getUser(id, function(user) {
    getOrders(user.id, function(orders) {
        getOrderDetail(orders[0].id, function(detail) {
            console.log(detail);  // 缩进越来越深，错误处理困难...
        });
    });
});

// 第二阶段：Promise 链
getUser(id)
    .then(user => getOrders(user.id))
    .then(orders => getOrderDetail(orders[0].id))
    .then(detail => console.log(detail))
    .catch(err => console.error(err));  // 统一错误处理

// 第三阶段：Async/Await（语法糖，本质仍是 Promise）
async function showOrderDetail(userId) {
    try {
        const user = await getUser(userId);
        const orders = await getOrders(user.id);
        const detail = await getOrderDetail(orders[0].id);
        console.log(detail);
    } catch (err) {
        console.error(err);
    }
}
// async 函数自动返回 Promise，await 等待 Promise 完成并取出值</code></pre>

	      <p><strong>关键理解：</strong>async/await 不是替代 Promise，而是 Promise 的语法糖。它让异步代码<strong>看起来像同步代码</strong>，极大提升了可读性。但它们依然是异步非阻塞的——await 不会阻塞主线程。</p>

	      <h2>7. 其他实用新特性速览</h2>
	      <pre><code class="language-java">// 可选链（Optional Chaining, ES2020）——避免 Cannot read property of undefined
const street = user?.address?.street ?? "Unknown";
// 等价于：
// const street = user && user.address ? user.address.street : "Unknown";

// 空值合并运算符（Nullish Coalescing, ES2020）
const name = input ?? "Default";      // 只有 null/undefined 才取默认值
// 注意：|| 会把空字符串和 0 也当作 falsy，?? 不会

// 对象方法简写
const obj = {
    name: "Alice",
    sayHi() { /* ... */ }   // 不需要 function 关键字
};

// 属性名表达式
const key = "email";
const obj2 = { [key]: "alice@example.com" };  // { email: "alice@example.com" }

// Array 新方法
[1, 2, 3].includes(2);            // true（比 indexOf !== -1 更语义化）
[1, 2, 3].flatMap(x => [x, x*2]); // [1, 2, 2, 4, 3, 6]
[1, [2, [3]]].flat(2);            // [1, 2, 3]（扁平化指定层数）</code></pre>

	      <h2>小结</h2>
	      <p>ES6+ 的新特性远不止这些，但以上 6 类是最常用、最能提升开发效率的。<strong>如果你只能记住三点：永远用 const/let 而非 var、用箭头函数处理回调（注意 this）、用 async/await 写异步代码。</strong>掌握这些，你的 JavaScript 代码会从一个时代跨入另一个时代。</p>`;

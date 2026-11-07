// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>JavaScript ES6+ 常用新特性：从回调地狱到优雅的 Async/Await</h1>

	      <p>ES6（ECMAScript 2015）是 JavaScript 历史上最大的一次更新，此后的 ES7-ES14 每年一个版本，持续带来新特性。这些新特性不仅让代码更简洁，更重要的是<strong>改变了我们组织代码的方式</strong>。本文按"日常使用频率"组织，从每天都在用的 let/const 到彻底改变异步编程的 async/await，逐一讲解。</p>

	      <h2>1. let 和 const：告别 var 的种种问题</h2>
	      <p>var 有三个"反直觉"的问题：变量提升（hoisting）、没有块级作用域、可以重复声明。let 和 const 彻底解决了这些问题：</p>
	      <pre><code class="language-js">// var 的问题一：变量提升
console.log(x);   // undefined（var 声明被提升，但赋值没有）
var x = 5;

console.log(y);   // ReferenceError（let 的"暂时性死区"：声明前不可用）
let y = 5;

// var 的问题二：没有块级作用域
for (var i = 0; i &lt; 3; i++) { }
console.log(i);   // 3（i 泄露到循环外了！）

for (let j = 0; j &lt; 3; j++) { }
console.log(j);   // ReferenceError（j 只在 for 块内有效）

// var 的问题三：在 setTimeout 循环中的经典 bug
for (var i = 0; i &lt; 3; i++) {
    setTimeout(() =&gt; console.log(i), 100);  // 输出 3, 3, 3（共享同一个 i）
}
for (let i = 0; i &lt; 3; i++) {
    setTimeout(() =&gt; console.log(i), 100);  // 输出 0, 1, 2（每次迭代是新的 i）
}

// const：声明常量
const PI = 3.14159;
PI = 3;           // TypeError: Assignment to constant variable
const arr = [1, 2, 3];
arr.push(4);      // 可以！const 保护的是引用，不是内容
arr = [5, 6];     // TypeError（不能重新赋值）</code></pre>
	      <p><strong>使用原则：</strong>默认用 const，需要重新赋值时改用 let。<strong>永远不要再使用 var。</strong>那个 setTimeout 输出 3,3,3 的例子值得背下来——面试常考，而它正是"每次迭代 let 都创建一个新绑定"这一底层行为的直观体现。</p>

	      <h2>2. 箭头函数：更短、更清晰的函数写法</h2>
	      <p>箭头函数不仅仅是"更短的 function"，它最大的区别是<strong>不绑定自己的 this</strong>——它从定义时的外层作用域继承 this。</p>
	      <pre><code class="language-js">// 语法简写
const add = (a, b) =&gt; a + b;                // 单行表达式自动 return
const greet = name =&gt; "Hello, " + name;      // 单个参数可省略括号
const sayHi = () =&gt; console.log("Hi");       // 无参数需要空括号
const getObj = () =&gt; ({ name: "Alice" });    // 返回对象字面量需要加括号

// 关键区别：this 绑定
class Counter {
    constructor() {
        this.count = 0;
        // 传统函数：this 丢失
        setTimeout(function() {
            console.log(this.count);  // undefined（this 指向 window/global）
        }, 100);
        // 箭头函数：this 正确继承
        setTimeout(() =&gt; {
            console.log(this.count);  // 0（this 指向 Counter 实例）
        }, 100);
    }
}

// 什么时候不能用箭头函数？
// 1. 对象方法（需要 this 指向调用者时）
const obj = {
    name: "Alice",
    sayHi: () =&gt; console.log(this.name)  // undefined，this 指向外层
};
// 应改为：
const obj2 = {
    name: "Alice",
    sayHi() { console.log(this.name); }  // "Alice"
};

// 2. 需要 arguments 对象时（箭头函数没有 arguments）
// 3. 作为构造函数时（箭头函数没有 [[Construct]]，new 会直接报错）</code></pre>

	      <h2>3. 模板字符串：终于可以优雅地拼接字符串了</h2>
	      <p>ES6 引入了<strong>模板字符串（Template Literals）</strong>，用反引号（backtick）包围，支持变量插值和多行文本：</p>
	      <pre><code class="language-js">// 之前：字符串拼接，可读性极差
const msg1 = "Hello, " + name + "! You have " + count + " messages.";

// 现在：\${} 里可以放任意表达式
const msg2 = \`Hello, \${name}! You have \${count} messages.\`;

// 多行字符串——换行直接写，不需要 \n 和 + 拼接
const card = \`
  &lt;div class="card"&gt;
    &lt;h2&gt;\${title}&lt;/h2&gt;
    &lt;p&gt;\${content}&lt;/p&gt;
  &lt;/div&gt;\`;

// 常见实战：三目 + 插值组合
const label = \`\${active ? '●' : '○'} \${count} 条未读\`;</code></pre>
	      <p>还有个高级玩法<strong>标签模板</strong>——函数名直接跟在反引号前，字符串片段和插值分开传入。styled-components 就是这么实现的：</p>
	      <pre><code class="language-js">function highlight(strings, ...values) {
    return strings.reduce((result, str, i) =&gt;
        result + str + (values[i] ? "&lt;mark&gt;" + values[i] + "&lt;/mark&gt;" : ""), "");
}
// highlight\`搜索词是 \${query}\`  →  "搜索词是 &lt;mark&gt;vue&lt;/mark&gt;"</code></pre>

	      <h2>4. 解构赋值：从对象和数组中提取值的优雅方式</h2>
	      <pre><code class="language-js">// 对象解构
const { name, age, city = "Beijing" } = user;
// 等价于：
// const name = user.name;
// const age = user.age;
// const city = user.city ?? "Beijing";  // 默认值（字段不存在才生效）

const { name: userName } = user;         // 重命名
const { address: { street } } = user;    // 嵌套解构（注意：street 是普通变量，address 不被声明）

// 函数参数解构（Vue/React 组件的 props、配置项都长这样）
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
const [, , third] = [1, 2, 3, 4];  // third=3

// 函数默认参数 + 解构组合：调用方可以只传想改的配置
function request(url, { method = 'GET', timeout = 5000, headers = {} } = {}) {
    /* ... */
}
request('/api/list');                       // 全默认
request('/api/list', { timeout: 8000 });    // 只覆盖一个</code></pre>
	      <p>解构的两条实用心法：<strong>默认值只在 undefined 时生效</strong>（null 不会触发，别和 ?? 的语义弄混）；解构后跟的逗号省略是"跳位"取值的惯用法。</p>

	      <h2>5. 扩展运算符与剩余参数：... 的两种身份</h2>
	      <pre><code class="language-js">// 扩展运算符：把数组/对象"展开"
const arr1 = [1, 2, 3];
const arr2 = [0, ...arr1, 4, 5];         // [0, 1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3, b: 99 };   // { a: 1, b: 99, c: 3 }（后面的覆盖前面的）

// 浅拷贝——注意"浅"！
const copyArr = [...arr];
const copyObj = { ...obj };
copyObj.nested.a = 9;   // 原对象的 nested.a 也变成 9（嵌套层仍是同一引用）

// 合并配置（后面的覆盖前面的，默认值写前面）
const merged = { ...defaultConfig, ...userConfig };

// 剩余参数：收集剩余参数到数组
function sum(first, ...others) {
    return first + others.reduce((a, b) =&gt; a + b, 0);
}
sum(1, 2, 3, 4, 5);  // 15</code></pre>
	      <p><strong>浅拷贝是高频事故点</strong>：需要深拷贝时用 <code>structuredClone(obj)</code>（现代浏览器原生支持），或 <code>JSON.parse(JSON.stringify(obj))</code>（丢失函数/undefined/Date，慎用）。</p>

	      <h2>6. Promise 与 Async/Await：异步编程的进化史</h2>
	      <p>这是现代 JavaScript 最重要的概念之一。先回顾一下异步编程的进化：</p>
	      <pre><code class="language-js">// 第一阶段：回调地狱（Callback Hell）
getUser(id, function(user) {
    getOrders(user.id, function(orders) {
        getOrderDetail(orders[0].id, function(detail) {
            console.log(detail);  // 缩进越来越深，错误处理困难...
        });
    });
});

// 第二阶段：Promise 链
getUser(id)
    .then(user =&gt; getOrders(user.id))
    .then(orders =&gt; getOrderDetail(orders[0].id))
    .then(detail =&gt; console.log(detail))
    .catch(err =&gt; console.error(err));  // 统一错误处理

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
	      <p>实战里最容易写错的是<strong>串行与并行</strong>。没有依赖关系的请求，await 逐个写就是白白翻倍耗时：</p>
	      <pre><code class="language-js">// ❌ 串行：300ms + 400ms = 700ms（第二个请求干等第一个）
const user = await getUser(id);
const notices = await getNotices(id);

// ✓ 并行：耗时取最慢的那个 = 400ms
const [user, notices] = await Promise.all([getUser(id), getNotices(id)]);

// Promise.all 一损俱损（任何一个 reject 整体失败）；
// Promise.allSettled 全部跑完再处理，返回每项的 status：
const results = await Promise.allSettled([a(), b()]);
const ok = results.filter(r =&gt; r.status === 'fulfilled').map(r =&gt; r.value);</code></pre>

	      <h2>7. 其他实用新特性速览</h2>
	      <pre><code class="language-js">// 可选链（Optional Chaining, ES2020）——避免 Cannot read property of undefined
const street = user?.address?.street ?? "Unknown";
// user?.method?.() 还能安全调用可能不存在的方法

// 空值合并运算符（Nullish Coalescing, ES2020）
const name = input ?? "Default";      // 只有 null/undefined 才取默认值
// 注意：|| 会把空字符串和 0 也当作 falsy，?? 不会
// 典型翻车：count || 10 在 count 为 0 时错误地变成 10

// 对象方法简写与属性名表达式
const key = "email";
const obj = {
    name: "Alice",
    sayHi() { /* ... */ },              // 不需要 function 关键字
    [key]: "alice@example.com",         // 计算属性名
};

// Array 新方法
[1, 2, 3].includes(2);            // true（比 indexOf !== -1 更语义化）
[1, 2, 3].flatMap(x =&gt; [x, x*2]); // [1, 2, 2, 4, 3, 6]
[1, [2, [3]]].flat(2);            // [1, 2, 3]（扁平化指定层数）

// Map / Set（ES6 新增数据结构）
const map = new Map();                 // 任意类型做键（对象做键时比 Object 强得多）
map.set(user, { lastVisit: Date.now() });
const set = new Set([1, 2, 2, 3]);     // 去重一步到位
const unique = [...new Set(arr)];      // 数组去重的现代写法

// for...of 与 for...in 的本质区别
for (const v of [10, 20]) {}   // 遍历"值"（数组/字符串/Map/Set 等可迭代对象）
for (const k in { a: 1 }) {}   // 遍历"键名"（还会把原型链上的可枚举属性一并遍历，慎用）</code></pre>

	      <h2>小结</h2>
	      <p>ES6+ 的新特性远不止这些，但以上 7 类是最常用、最能提升开发效率的。带走三句话：<strong>① 永远用 const/let 而非 var；② 箭头函数管好 this，对象方法别用它；③ 异步代码用 async/await，无依赖的请求用 Promise.all 并行</strong>。再配上 <code>??</code> 与 <code>?.</code> 这对现代操作符，你的 JavaScript 就能从"能跑"跨入"优雅"。</p>
	      <p>这些特性在前端框架里无处不在：<a href="#/notes/vue-reactivity">Vue 3 的响应式</a>依赖 Proxy、<a href="#/notes/vue-composition">组合式 API</a> 的 Composable 本质就是解构 + 闭包的函数——把语言基础打牢，框架的"魔法"都会变成"显然"。</p>`;

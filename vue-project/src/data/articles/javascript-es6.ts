// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>JavaScript ES6+ 常用新特性：从回调地狱到优雅的 Async/Await</h1>

	      <p>ES6（ECMAScript 2015）是 JavaScript 历史上最大的一次更新，此后的 ES7-ES14 每年一个版本，持续带来新特性。这些新特性不仅让代码更简洁，更重要的是<strong>改变了我们组织代码的方式</strong>。本文按"日常使用频率"组织：从 let/const 到 async/await，再到迭代器、生成器、模块系统这些"进阶但必懂"的部分，每节都给能落地的代码和原理说明。</p>

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
	      <p>两个值得吃透的原理点：</p>
	      <ul>
	          <li><strong>暂时性死区（TDZ）</strong>：let/const 其实也有"提升"——引擎在编译阶段就知道块里有这个声明，但在执行到声明语句之前访问它会报 ReferenceError。从"块开始"到"声明执行"之间的地带就叫 TDZ。所以更准确的说法是：var 提升"声明+初始化"（值为 undefined），let 提升"声明"但不初始化（访问即报错）。</li>
	          <li><strong>循环里的 let</strong>：每次迭代引擎都会创建一个<strong>新的</strong> i 绑定（上一轮的值被复制进来），闭包捕获的是各自的 i——这就是输出 0,1,2 的原因，也是当年"用 IIFE 包一层"的官方替代方案。</li>
	      </ul>
	      <p><strong>使用原则：</strong>默认用 const，需要重新赋值时改用 let。<strong>永远不要再使用 var。</strong>那个 setTimeout 输出 3,3,3 的例子值得背下来——面试常考，而它正是上述底层行为的直观体现。</p>

	      <h2>2. 箭头函数：更短、更清晰的函数写法</h2>
	      <p>箭头函数不仅仅是"更短的 function"，它最大的区别是<strong>不绑定自己的 this</strong>——它从定义时的外层作用域继承 this（词法作用域，静态确定，与调用方式无关）。</p>
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
// 3. 作为构造函数时（箭头函数没有 [[Construct]]，new 会直接报错）
// 4. 作为原型方法 / 事件处理函数需要 this 指向当前元素时</code></pre>
	      <p>顺带记住 this 的完整判定顺序，箭头函数只是其中一环：<strong>new 调用 &gt; 显式绑定（call/apply/bind）&gt; 隐式绑定（obj.fn()）&gt; 默认绑定（独立调用指向 undefined/global）</strong>；箭头函数不吃这套规则，直接看定义处外层。</p>

	      <h2>3. 模板字符串：终于可以优雅地拼接字符串了</h2>
	      <p>ES6 引入了<strong>模板字符串（Template Literals）</strong>，用反引号（backtick）包围，支持变量插值和多行文本：</p>
	      <pre><code class="language-js">// 之前：字符串拼接，可读性极差
const msg1 = "Hello, " + name + "! You have " + count + " messages.";

// 现在：\${} 里可以放任意表达式
const msg2 = \`Hello, \${name}! You have \${count} messages.\`;

// 多行字符串——换行直接写，不需要 \\n 和 + 拼接
const card = \`
  &lt;div class="card"&gt;
    &lt;h2&gt;\${title}&lt;/h2&gt;
    &lt;p&gt;\${content}&lt;/p&gt;
  &lt;/div&gt;\`;

// 常见实战：三目 + 插值组合
const label = \`\${active ? '●' : '○'} \${count} 条未读\`;</code></pre>
	      <p>还有个高级玩法<strong>标签模板</strong>——函数名直接跟在反引号前，字符串片段和插值分开传入。styled-components、GraphQL 客户端都是这么实现的：</p>
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
	      <p>解构的两条实用心法：<strong>默认值只在 undefined 时生效</strong>（null 不会触发，别和 ?? 的语义弄混）；解构后跟的逗号省略是"跳位"取值的惯用法。另外解构配合正则和字符串也很好用：</p>
	      <pre><code class="language-js">const [full, yy, mm, dd] = '2026-11-07'.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
// full='2026-11-07', yy='2026', mm='11', dd='07'</code></pre>

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
	      <p><strong>浅拷贝是高频事故点</strong>，深拷贝的正确打开方式按优先级排：</p>
	      <pre><code class="language-js">// 1. 首选：原生结构化克隆（现代浏览器/Node 17+，支持循环引用、Date、Map/Set）
const deep1 = structuredClone(obj);

// 2. JSON 大法（丢函数/undefined/Date 变字符串/Symbol，还有循环引用直接炸）
const deep2 = JSON.parse(JSON.stringify(obj));

// 3. 手写递归（面试常考的最小版）
function deepClone(target, map = new WeakMap()) {
    if (target === null || typeof target !== 'object') return target;
    if (map.has(target)) return map.get(target);          // 处理循环引用
    const result = Array.isArray(target) ? [] : {};
    map.set(target, result);
    for (const key of Object.keys(target)) {
        result[key] = deepClone(target[key], map);
    }
    return result;
}</code></pre>

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
	      <h3>6.1 Promise 的底层：状态机 + 微任务</h3>
	      <p>Promise 本质是一个<strong>只有三种状态的状态机</strong>：pending → fulfilled（成功）或 pending → rejected（失败），<strong>状态一旦改变不可再变</strong>。then 注册的回调不是立刻执行，而是进入<strong>微任务队列</strong>——这就是"同步代码全部执行完之后才执行 then"的原因：</p>
	      <pre><code class="language-js">console.log('1');
Promise.resolve().then(() =&gt; console.log('3'));
console.log('2');
// 输出：1, 2, 3（微任务排在所有同步代码之后）

setTimeout(() =&gt; console.log('macro'), 0);
Promise.resolve().then(() =&gt; console.log('micro'));
// 输出：micro → macro（每一轮：先清空全部微任务，再取一个宏任务）</code></pre>
	      <p>事件循环的完整节奏：<strong>执行一段同步代码 → 清空整个微任务队列 → 浏览器渲染机会 → 取一个宏任务（setTimeout 等）→ 再清微任务……循环往复</strong>。理解这个，"为什么 setTimeout(fn, 0) 不是立即执行""为什么 Promise 比 setTimeout 先"这类问题都有了统一答案。手写一个迷你 Promise 验证理解（面试高频）：</p>
	      <pre><code class="language-js">class MyPromise {
    #state = 'pending';
    #value;
    #callbacks = [];
    constructor(executor) {
        const resolve = (v) =&gt; {
            if (this.#state !== 'pending') return;   // 状态不可逆
            this.#state = 'fulfilled'; this.#value = v;
            this.#callbacks.forEach(cb =&gt; queueMicrotask(cb));
        };
        const reject = (r) =&gt; {
            if (this.#state !== 'pending') return;
            this.#state = 'rejected'; this.#value = r;
            this.#callbacks.forEach(cb =&gt; queueMicrotask(cb));
        };
        try { executor(resolve, reject); } catch (e) { reject(e); }
    }
    then(onOk, onErr) {
        const run = () =&gt; {
            try {
                if (this.#state === 'fulfilled') onOk?.(this.#value);
                if (this.#state === 'rejected') onErr?.(this.#value);
            } catch (e) { console.error('unhandled in then', e); }
        };
        this.#state === 'pending' ? this.#callbacks.push(run) : queueMicrotask(run);
        return this;   // 简化版不做链式透传，真实实现要返回新 Promise
    }
}</code></pre>
	      <h3>6.2 串行与并行：最常见的性能错误</h3>
	      <pre><code class="language-js">// ❌ 串行：300ms + 400ms = 700ms（第二个请求干等第一个）
const user = await getUser(id);
const notices = await getNotices(id);

// ✓ 并行：耗时取最慢的那个 = 400ms
const [user, notices] = await Promise.all([getUser(id), getNotices(id)]);

// Promise.all 一损俱损（任何一个 reject 整体失败）；
// Promise.allSettled 全部跑完再处理，返回每项的 status：
const results = await Promise.allSettled([a(), b()]);
const ok = results.filter(r =&gt; r.status === 'fulfilled').map(r =&gt; r.value);

// Promise.race：取最先完成的（常用于超时控制）
const withTimeout = (p, ms) =&gt; Promise.race([
    p,
    new Promise((_, rej) =&gt; setTimeout(() =&gt; rej(new Error('timeout')), ms)),
]);</code></pre>
	      <p>async/await 的错误处理还有一个优雅模式——"go 风格"辅助函数，避免每个 await 都包 try-catch：</p>
	      <pre><code class="language-js">function to(promise) {
    return promise.then(v =&gt; [null, v]).catch(e =&gt; [e, null]);
}
const [err, user] = await to(getUser(id));
if (err) return showError(err);</code></pre>

	      <h2>7. 迭代器与生成器：for...of 的引擎</h2>
	      <p><code>for...of</code> 能遍历数组、字符串、Map、Set，靠的是<strong>迭代器协议</strong>：只要对象有 <code>[Symbol.iterator]</code> 方法返回一个带 <code>next()</code> 的对象（next 返回 { value, done }），它就是可迭代的：</p>
	      <pre><code class="language-js">// 手动实现一个可迭代对象：前 n 个斐波那契数
const fib = {
    [Symbol.iterator](n = 10) {
        let a = 0, b = 1, i = 0;
        return {
            next: () =&gt; i++ &lt; n
                ? { value: a, done: false }
                : { value: undefined, done: true },
        };
    },
};
for (const x of fib) console.log(x);   // 0 1 1 2 3 5 8 13 21 34

// 注意区别：for...of 遍历"值"，for...in 遍历"键名"且会带上原型链（慎用）</code></pre>
	      <p><strong>生成器（Generator）</strong>是"能暂停的函数"——function* 声明、yield 让出、next() 恢复。写迭代器从此不用手工维护状态机：</p>
	      <pre><code class="language-js">function* fibGen(n = 10) {
    let a = 0, b = 1;
    for (let i = 0; i &lt; n; i++) { yield a; [a, b] = [b, a + b]; }
}
for (const x of fibGen()) console.log(x);

// 无限序列 + 惰性求值：只有被消费时才计算下一步
function* idGen() { let id = 1; while (true) yield id++; }
const ids = idGen();
ids.next().value;   // 1
ids.next().value;   // 2（不用操心"生成到哪了"，状态在生成器内部）</code></pre>
	      <p>生成器还有一个"派生"用法值得知道： redux-saga 用 yield 表达副作用声明来实现可测试的异步流程；代码里遇到 <code>function*</code> 大概率是这类场景。<code>yield*</code> 则能委托给另一个生成器，适合组合。</p>

	      <h2>8. 其他实用新特性速览</h2>
	      <pre><code class="language-js">// 可选链（Optional Chaining, ES2020）——避免 Cannot read property of undefined
const street = user?.address?.street ?? "Unknown";
// user?.method?.() 还能安全调用可能不存在的方法
// arr?.[0] 对数组取值也适用

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

// Array 方法分组记忆（是否会改原数组）
// ✗ 不改原数组：map / filter / find / findIndex / some / every / flat / flatMap / slice / concat
// ✓ 改原数组：  push / pop / shift / unshift / splice / sort / reverse / fill / copyWithin
// ⚠ sort 默认按字符串比较！数字排序必须传比较器：
[10, 2, 33].sort();                       // [10, 2, 33]（字符串序）
[10, 2, 33].sort((a, b) =&gt; a - b);        // [2, 10, 33]（数值序）

// Map / Set（ES6 新增数据结构）
const map = new Map();                 // 任意类型做键（对象做键时比 Object 强得多）
map.set(user, { lastVisit: Date.now() });
const set = new Set([1, 2, 2, 3]);     // 去重一步到位
const unique = [...new Set(arr)];      // 数组去重的现代写法

// Symbol：唯一标识符，主要用途是"给对象加不冲突的键"和定义协议（如 Symbol.iterator）
const CACHE = Symbol('cache');
obj[CACHE] = {};                       // 不会被 for...in 枚举，不会与普通属性撞名</code></pre>

	      <h2>9. 模块系统：import / export 与它取代的 CommonJS</h2>
	      <pre><code class="language-js">// 命名导出（可以有多个，导入时用同名解构）
export function formatPrice(cents) { /* ... */ }
export const MAX_RETRY = 3;
import { formatPrice, MAX_RETRY } from './utils.js';

// 默认导出（每个模块最多一个，导入时随意命名）
export default class HttpClient { /* ... */ }
import HttpClient from './http.js';    // 名字随你取

// 混合与整体导入
import HttpClient, { MAX_RETRY } from './http.js';
import * as utils from './utils.js';

// 动态导入：返回 Promise，天然代码分割点（路由懒加载的底层机制）
const mod = await import('./heavy-chart.js');</code></pre>
	      <table>
	          <tr>
	              <th></th>
	              <th>ESM（import/export）</th>
	              <th>CommonJS（require）</th>
	          </tr>
	          <tr><td>加载时机</td><td>编译时静态分析，可做 Tree-shaking</td><td>运行时动态加载</td></tr>
	          <tr><td>导出值</td><td><strong>实时绑定</strong>（导出方改了，导入方能看到）</td><td>值的拷贝</td></tr>
	          <tr><td>顶层 await</td><td>支持</td><td>不支持</td></tr>
	          <tr><td>使用环境</td><td>浏览器标准 + Node（现代项目）</td><td>Node 传统生态</td></tr>
	      </table>
	      <p>"实时绑定"是个容易忽略的差异：ESM 导出的是"名字到变量位置的引用"，<strong>模块内部后续修改导出的 let 变量，导入方下次读到的是新值</strong>；CommonJS 则是导出那一刻的对象快照。</p>

	      <h2>10. Proxy 与 Reflect：元编程入门</h2>
	      <p>ES6 的 Proxy 能拦截对象的所有基础操作（读写、删除、函数调用、in、new……），是 <a href="#/notes/vue-reactivity">Vue 3 响应式</a>的底座。这里给个能感受威力的例子——一行代码的"属性访问日志"：</p>
	      <pre><code class="language-js">function withLog(target) {
    return new Proxy(target, {
        get(t, key) { console.log('read', key); return Reflect.get(t, key); },
        set(t, key, v) { console.log('write', key, '=', v); return Reflect.set(t, key, v); },
    });
}
const state = withLog({ a: 1 });
state.a;        // 控制台：read a
state.a = 99;   // 控制台：write a = 99</code></pre>
	      <p>Reflect 不是新功能，而是"把对象的默认行为规范化成函数"——每个 trap 都有同名的 Reflect 方法，调用它等价于默认行为。规范写法是"先做自己的逻辑，最后用 Reflect 转发默认行为"，保证不破坏语言语义。</p>

	      <h2>小结</h2>
	      <p>ES6+ 的特性体系可以收成一张记忆网：<strong>语法层</strong>（let/const、箭头函数、解构、展开、模板串）解决"写得爽"；<strong>异步层</strong>（Promise 状态机与微任务、async/await、Promise.all 系）解决"异步像同步"；<strong>协议层</strong>（迭代器/生成器、Symbol、Proxy/Reflect）解决"语言可扩展"；<strong>模块层</strong>（ESM）解决"代码可组织"。带走三句话：<strong>① 永远用 const/let 而非 var；② 无依赖的请求用 Promise.all 并行，await 逐个写是隐形性能税；③ for...of 之上的一切（展开、解构、Map/Set）都建立在迭代器协议上</strong>。</p>
	      <p>这些特性在前端框架里无处不在：<a href="#/notes/vue-reactivity">Vue 3 的响应式</a>依赖 Proxy、<a href="#/notes/vue-composition">组合式 API</a> 的 Composable 本质就是解构 + 闭包的函数——把语言基础打牢，框架的"魔法"都会变成"显然"。</p>`;

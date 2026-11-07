// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Vue 3 响应式系统详解：从 defineProperty 到 Proxy</h1>

	      <p>响应式是 Vue 的立身之本，也是面试高频考点。Vue 3 用 <code>Proxy</code> 重写了整个响应式系统，这不仅仅是一次 API 升级，更是一次架构层面的降维打击。这篇我们把手伸到引擎盖下面：为什么换 Proxy、依赖收集怎么运转、ref 与 reactive 的实现差别、批量更新与 nextTick、以及手写一个 40 行的迷你响应式系统验证理解。</p>

	      <h2>1. 响应式到底要解决什么问题</h2>
	      <p>框架没有响应式之前，"数据变了让视图跟着变"是手工作业：</p>
	      <pre><code class="language-js">// jQuery 时代：每个数据变更点都要手动同步 DOM
let count = 0;
function increase() {
  count++;
  document.querySelector('#count').textContent = count;   // 手动同步
}
// 漏掉一行同步代码 = 界面与数据不一致的 bug</code></pre>
	      <p>响应式的目标是把"同步"这一步自动化：<strong>声明"视图用了哪些数据"，之后数据的任何变化自动触发视图更新</strong>。实现路径只有两条：要么在数据变化时能收到通知（劫持/代理），要么把"谁用了哪些数据"记录下来按需重算。Vue 把两条路都走了——Proxy 负责拦截变化，依赖表负责通知到人。</p>

	      <h2>2. 先看现象：Vue 2 响应式的三宗罪</h2>
	      <p>Vue 2 基于 <code>Object.defineProperty</code>，它只能在<strong>初始化时</strong>递归遍历 data 的每个属性并逐一劫持。这带来三个历史遗留问题：</p>
	      <table>
	          <tr>
	              <th>问题</th>
	              <th>示例</th>
	              <th>当年的补救</th>
	          </tr>
	          <tr><td>新增/删除属性无感</td><td><code>obj.newKey = 1</code> 不会触发更新</td><td><code>Vue.set / Vue.delete</code></td></tr>
	          <tr><td>数组索引与 length 失控</td><td><code>arr[0] = x</code>、<code>arr.length = 0</code></td><td>重写 7 个变异方法（push/splice…）</td></tr>
	          <tr><td>初始化性能差</td><td>data 越大，首次劫持越慢</td><td>无解，只能建议拆组件</td></tr>
	      </table>
	      <blockquote>这三宗罪的根源是同一个：<strong>defineProperty 只能劫持"已知存在的属性"，而不是对象本身</strong>。想要感知"结构变化"，只能靠 API 层打补丁。</blockquote>

	      <h2>3. Proxy：一次拦截，全部接管</h2>
	      <p><code>Proxy</code> 代理的是<strong>整个对象</strong>，未来新增的属性天然被拦截。Vue 3 的 <code>reactive()</code> 本质上就是返回一个带 handler 的 Proxy：</p>
	      <pre><code class="language-js">function reactive(target) {
  return new Proxy(target, {
    // 拦截读取：顺手做依赖收集
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      track(target, key);            // ← 记下"谁在用我"
      // 惰性深层代理：嵌套对象被访问到时才转 Proxy
      return typeof res === 'object' &amp;&amp; res !== null
        ? reactive(res)
        : res;
    },
    // 拦截写入：触发更新
    set(target, key, value, receiver) {
      const oldVal = target[key];
      const res = Reflect.set(target, key, value, receiver);
      if (oldVal !== value) {
        trigger(target, key);        // ← 通知"用过我的都更新"
      }
      return res;
    },
    // 新增删除属性、数组索引、length 全部走 set/deleteProperty trap，天然覆盖
    deleteProperty(target, key) {
      const hadKey = key in target;
      const res = Reflect.deleteProperty(target, key);
      if (hadKey) trigger(target, key);
      return res;
    },
  });
}</code></pre>
	      <p>注意两个细节：<strong>① 惰性代理</strong>——Vue 3 不再初始化时递归全量转换，嵌套对象要等到 get 被访问时才包 Proxy，大对象的首屏开销大幅下降；<strong>② Reflect</strong>——通过 receiver 转发默认行为，保证 getter 内部的 <code>this</code> 仍指向代理对象，否则继承链上的依赖收集会断。</p>
	      <p>代价也说清楚：<strong>Proxy 无法被 polyfill</strong>——它是语言级能力，没有"降级实现"能模拟全部 13 种 trap。这就是 Vue 3 彻底放弃 IE11 的直接原因。做旧系统兼容选型时，这条是硬约束。</p>

	      <h2>4. 依赖收集与派发更新：track 与 trigger</h2>
	      <p>响应式的核心命题是：<strong>谁在用这个属性，属性变了就通知谁</strong>。Vue 用三级结构存这层关系：</p>
	      <pre><code class="language-plaintext">targetMap（WeakMap）
 └── target 对象 → depsMap（Map）
        └── 属性 key → dep（Set&lt;effect&gt;）
               └── 副作用函数们（渲染函数 / watch 回调 / computed 取值器）</code></pre>
	      <pre><code class="language-js">// WeakMap&lt;target, Map&lt;key, Set&lt;effect&gt;&gt;&gt;
let targetMap = new WeakMap();
let activeEffect = null;

function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) targetMap.set(target, (depsMap = new Map()));
  let dep = depsMap.get(key);
  if (!dep) depsMap.set(key, (dep = new Set()));
  if (activeEffect) dep.add(activeEffect);   // 当前正在运行的副作用
}

function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const effects = depsMap.get(key);
  effects &amp;&amp; effects.forEach(fn =&gt; fn());    // 重跑所有依赖它的副作用
}</code></pre>
	      <p>这里的"副作用（effect）"是个泛化概念：组件的渲染函数、<code>watchEffect</code> 的回调、<code>computed</code> 的取值器，本质上都是"读取响应式数据并产生效果"的函数。渲染函数执行时读到 <code>state.count</code>，track 就把渲染 effect 记到 count 名下；count 一变，trigger 重跑渲染，视图更新。</p>
	      <p>为什么用 <code>WeakMap</code>？因为它的键是弱引用——组件销毁后，只要 target 不再被引用，整个依赖表会被垃圾回收自动带走，不需要手动清理。如果换成普通 Map，每个被代理过的对象都会被依赖表强引用着，销毁的组件也会泄漏。</p>
	      <h3>4.1 依赖清理：分支切换留下的过期依赖</h3>
	      <p>还有一个隐藏问题。看这个 effect：</p>
	      <pre><code class="language-js">watchEffect(() =&gt; {
  const val = state.ok ? state.a : state.b;   // 分支二选一
});</code></pre>
	      <p>第一次执行时 <code>ok</code> 为真，收集到 <code>ok</code> 和 <code>a</code> 两个依赖。之后 <code>b</code> 变了会触发它重跑吗？不应该——但它还没依赖 <code>b</code>，没问题。反过来：如果先 <code>ok = false</code>（这次收集了 ok 和 b），再改 <code>a</code>——<code>a</code> 名下还挂着这个 effect，会白白重跑一次。真实 Vue 的解法是<strong>每次 effect 执行前先清空自己上一次的依赖记录</strong>（每个 effect 记着"我上次被记在哪些 dep 里"，重跑前逐个把自己摘掉再重新收集）。这个细节决定了"条件渲染 + 条件内数据"组合下的精确性，也是手写响应式最容易漏的一步。</p>

	      <h2>5. 手写迷你响应式：40 行跑通全流程</h2>
	      <p>把上面几节拼起来（先不做依赖清理），一个能跑的最小系统就成型了：</p>
	      <pre><code class="language-js">let activeEffect = null;

function effect(fn) {
  activeEffect = fn;        // ① 标记"当前正在跑的副作用"
  fn();                     // ② 执行 → 内部读到响应式数据 → 触发 get → track
  activeEffect = null;      // ③ 跑完摘掉标记
}

function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key);
      const res = Reflect.get(target, key, receiver);
      return (res !== null &amp;&amp; typeof res === 'object') ? reactive(res) : res;
    },
    set(target, key, value, receiver) {
      const changed = target[key] !== value;
      Reflect.set(target, key, value, receiver);
      if (changed) trigger(target, key);
      return true;
    },
  });
}

// ── 验证 ──────────────────────────────
const state = reactive({ count: 0, msg: 'hi' });

effect(() =&gt; {
  console.log('渲染：count =', state.count);   // 依赖 count，不依赖 msg
});
state.count++;   // → 打印"渲染：count = 1"
state.count++;   // → 打印"渲染：count = 2"
state.msg = 'yo';// → 无输出（msg 不是这个 effect 的依赖）</code></pre>
	      <p>真实 Vue 比这多了几层工程化包装：computed 的<strong>脏检查缓存</strong>、trigger 时的<strong>去重批处理</strong>（一次事件循环内多次赋值只更新一次视图，见第 7 节）、嵌套 effect 的<strong>栈管理</strong>、分支切换的<strong>依赖清理</strong>——但数据流的骨架就是这 40 行。</p>

	      <h2>6. ref 与 reactive：为什么需要两个 API？</h2>
	      <p><code>Proxy</code> 只能代理<strong>对象</strong>，对 <code>let count = 0</code> 这种原始值无能为力（JS 没有任何办法拦截"变量赋值"——它连对象都不是，哪来的 trap）。Vue 的解法是包装：<code>ref</code> 把值装进一个带 <code>.value</code> 的对象里，对这个对象的 value 属性做 getter/setter 劫持（这里用的还是 class + get/set，甚至不需要 Proxy）：</p>
	      <pre><code class="language-js">// RefImpl 的极简还原
class RefImpl {
  _value;
  dep = new Set();
  constructor(value) {
    this._value = value;
  }
  get value() {
    if (activeEffect) this.dep.add(activeEffect);   // .value 读取时收集
    return this._value;
  }
  set value(newVal) {
    if (newVal === this._value) return;
    this._value = newVal;
    this.dep.forEach(fn =&gt; fn());                    // .value 写入时触发
  }
}
function ref(value) { return new RefImpl(value); }</code></pre>
	      <p>两个 API 的分工因此清晰了：<strong>ref 负责"一个值"（原始值、单个对象、DOM 引用），reactive 负责"一整块对象"的代理</strong>。</p>
	      <ul>
	          <li><strong>reactive</strong>：适合对象/数组/Map/Set，模板里书写自然；<strong>局限</strong>——不能整体替换（<code>state = {...}</code> 会脱离代理），解构会丢失响应式。</li>
	          <li><strong>ref</strong>：什么都能装（对象会内部转 reactive，即 <code>ref({}).value</code> 是个 Proxy）；<strong>代价</strong>——脚本里要写 <code>.value</code>，模板中自动解包（顶层 ref 才解包，数组/Map 里不会）。</li>
	      </ul>
	      <p>社区共识：<strong>组合式函数与单一状态用 ref，聚合型本地状态用 reactive</strong>，拿不准就全用 ref，一致性比风格更重要（选型细节在<a href="#/notes/vue-composition">组合式 API 实战</a>第 3 节有完整对比表）。</p>
	      <p>类型判断工具按需取用：<code>isRef(v)</code> / <code>isReactive(v)</code> / <code>isProxy(v)</code>；想拿 Proxy 背后的原始对象用 <code>toRaw(obj)</code>——偶尔要把数据交给不认识 Proxy 的第三方库（某些图表/地图 SDK 会因为代理对象判断类型失败）时是救命稻草；反向操作是 <code>markRaw(obj)</code>，把这个对象标记为"永远不要代理"。</p>

	      <h2>7. 异步批量更新：为什么连改三次只渲染一次</h2>
	      <pre><code class="language-js">state.a = 1;
state.b = 2;
state.c = 3;   // 三次赋值，视图只更新一次——怎么做到的？</code></pre>
	      <p>关键在 <strong>trigger 不直接执行 effect，而是把它们扔进一个微任务队列去重后统一执行</strong>：</p>
	      <pre><code class="language-js">const queue = new Set();        // Set 天然去重：同一个 effect 排一次
let flushing = false;

function queueJob(effect) {
  queue.add(effect);
  if (!flushing) {
    flushing = true;
    Promise.resolve().then(flushJobs);   // 微任务时机：同步代码全部跑完之后
  }
}

function flushJobs() {
  queue.forEach(fn =&gt; fn());
  queue.clear();
  flushing = false;
}</code></pre>
	      <p>同步代码块执行完（三次赋值都已入队），微任务里统一刷队列——每个 effect 只跑一次，这就是"批量更新"的全部秘密。而 <code>nextTick</code> 正是挂在这条队列后面：</p>
	      <pre><code class="language-js">state.count++;
nextTick(() =&gt; {
  // 此时 DOM 已按新数据更新完毕
  console.log(document.querySelector('#count').textContent);
});</code></pre>
	      <p>这也是经典面试题"nextTick 的原理"的标准答案：<strong>Vue 的更新调度和 nextTick 用的是同一个微任务队列，nextTick 的回调排在 flushJobs 之后，所以执行时 DOM 必然已更新</strong>。需要"改完数据立刻量 DOM 尺寸"之类的场景就靠它。</p>

	      <h2>8. computed：缓存、脏检查与副作用禁区</h2>
	      <p><code>computed</code> 是带缓存的特殊 effect：第一次取值时执行并把依赖记下来；之后只有依赖变更才把自身标记为"脏（dirty）"，<strong>再次被读取时才重算</strong>。两次读取之间哪怕依赖改了三次，也只重算一次——这是它和 <code>methods</code> 的本质区别：</p>
	      <pre><code class="language-js">const double = computed(() =&gt; state.count * 2);
double.value;  // 计算，缓存
state.count++; // 只标记脏，不计算
state.count++; // 还是只标记脏
double.value;  // 此时才真正重算一次</code></pre>
	      <blockquote>铁律：<strong>getter 里不要写副作用</strong>（改状态、发请求、操作 DOM）。computed 的重算时机由缓存策略决定，副作用放在里面等于把业务挂在一个不可预测的时间点上。有副作用请用 <code>watchEffect</code>。</blockquote>

	      <h2>9. watch 与 watchEffect：显式依赖 vs 自动收集</h2>
	      <pre><code class="language-js">// watch：声明依赖，回调拿到新旧值，默认惰性
watch(() =&gt; state.count, (n, o) =&gt; {
  if (n &gt; 10) console.log('超限', o, '-&gt;', n);
}, { immediate: false, deep: false });

// watchEffect：立即执行一次，回调里用到谁就追踪谁
const stop = watchEffect(() =&gt; {
  document.title = \`当前 \${state.count} 条\`;   // 依赖 count 被自动收集
});
stop(); // 组件卸载时自动停止，手动场景可提前停</code></pre>
	      <table>
	          <tr>
	              <th></th>
	              <th>watch</th>
	              <th>watchEffect</th>
	          </tr>
	          <tr><td>依赖</td><td>显式写在参数里</td><td>回调运行时自动收集</td></tr>
	          <tr><td>首次执行</td><td>默认惰性（immediate 可开）</td><td>立即执行一次</td></tr>
	          <tr><td>新旧值</td><td>有</td><td>无</td></tr>
	          <tr><td>适合</td><td>按条件请求、对比变化</td><td>多来源联动一个副作用</td></tr>
	      </table>
	      <p>选择经验：<strong>需要新旧值、需要明确触发条件、异步请求</strong>用 watch；<strong>多个来源联动一个副作用</strong>用 watchEffect 更简洁。两者回调默认在组件更新<strong>之前</strong>执行，传 <code>flush: 'post'</code> 可改为更新后（此时才能拿到更新后的 DOM）。watch 还有个 <code>once: true</code>（3.4+）只触发一次的选项。</p>
	      <p>Vue 3.5 又补了最后一块拼图——<code>onWatcherCleanup</code>：注册"这次监听被重新触发前"要执行的清理，比 onCleanup 回调更直观：</p>
	      <pre><code class="language-ts">watchEffect(async () =&gt; {
  const controller = new AbortController();
  onWatcherCleanup(() =&gt; controller.abort());   // 依赖一变，先掐掉旧请求
  const res = await fetch('/api/search?q=' + kw.value, { signal: controller.signal });
});</code></pre>

	      <h2>10. 数组与集合代理的边角细节</h2>
	      <p>Vue 对数组/集合做了额外的"方法重写"，知道这些能解释一些灵异现象：</p>
	      <ul>
	          <li><strong>indexOf / includes 失灵？</strong>——如果传入的是<strong>原始对象</strong>而数组里存的是<strong>代理</strong>（或反过来），两者不相等。Vue 内部会重写这些方法做双向查找兜底，但跨"代理/原始"边界传对象依然要小心，统一从同一来源取引用最稳。</li>
	          <li><strong>for...in 遍历</strong>会触发 <code>ownKeys</code> trap 的依赖收集——增删 key 会正确触发更新，这是 Vue 2 做不到的。</li>
	          <li><strong>大列表性能</strong>：深层代理对每层对象都建 Proxy，纯展示的超大静态列表可以用 <code>shallowRef</code>（只在整体替换时触发）+ 手动 <code>triggerRef</code>，代理开销近乎归零：</li>
	      </ul>
	      <pre><code class="language-js">// shallowRef：只有 .value 整体替换才触发，内部属性不追踪
const rows = shallowRef(bigList);
rows.value = [...bigList];     // ✓ 触发（引用变了）
rows.value[0].done = true;     // ✗ 不触发——大列表/图表数据的高性能选择
triggerRef(rows);              // 必要时手动逼一次更新

// effectScope：批量停掉一组副作用（独立于组件生命周期）
const scope = effectScope();
scope.run(() =&gt; {
  watch(a, cb1);
  watchEffect(cb2);
});
scope.stop();   // 一次全停，Composable 库的标配</code></pre>

	      <h2>11. 实战中的坑与最佳实践</h2>
	      <ul>
	          <li><strong>解构丢失响应式</strong>：<code>const { count } = state</code> 拿到的是快照。用 <code>toRefs(state)</code> 再解构，或始终 <code>state.count</code>。</li>
	          <li><strong>reactive 整体替换</strong>：<code>state = newState</code> 让旧 Proxy 失联。要么逐字段赋值，要么改用 ref 包对象（<code>state.value = newState</code> 合法）。</li>
	          <li><strong>数组与集合</strong>：<code>ref([])</code> 里装对象会被深层代理，直接 <code>list.value.push</code> 即可，不再需要 Vue2 的变异方法补丁。</li>
	          <li><strong>非响应式场景用 markRaw</strong>：第三方类实例（地图、图表）被代理反而出问题，<code>markRaw(instance)</code> 明确豁免。</li>
	          <li><strong>别滥用 deep watch</strong>：大对象深层监听会遍历所有属性，能收敛成具体字段就不要 <code>deep: true</code>。</li>
	          <li><strong>更新顺序</strong>：组件更新是"父先于子"，子组件的 watch(post) 晚于父的渲染；调试更新顺序问题时记得这条链路。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>把整套模型串成一句话：<strong>Proxy 在 get 里 track（谁在用我）、在 set 里 trigger（用过我的都更新），trigger 不直接跑而是微任务队列去重后批量执行，nextTick 与它共享队列；ref 用 class + get/set 包装解决原始值；computed 用脏标记做缓存</strong>。配上手写的 40 行迷你实现，这五句话每句都有代码撑腰——面试被问到任何一层，都能从机制讲到实现。</p>
	      <p>响应式之上的一层是"逻辑怎么组织"：<a href="#/notes/vue-composition">组合式 API 与 Composables</a>。全局状态落在 <a href="#/notes/pinia-intro">Pinia</a>——它自己就是用这套响应式系统搭建的，ref/computed 语义完全一致。</p>`;

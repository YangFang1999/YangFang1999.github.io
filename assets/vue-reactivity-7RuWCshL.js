const e=`
      <h1>Vue 3 响应式系统详解：从 defineProperty 到 Proxy</h1>

      <p>响应式是 Vue 的立身之本，也是面试高频考点。Vue 3 用 <code>Proxy</code> 重写了整个响应式系统，这不仅仅是一次 API 升级，更是一次架构层面的降维打击。这篇我们把手伸到引擎盖下面，把<strong>依赖收集、派发更新、ref 与 reactive 的分工</strong>一次讲透。</p>

      <h2>1. 先看现象：Vue 2 响应式的三宗罪</h2>
      <p>Vue 2 基于 <code>Object.defineProperty</code>，它只能在<strong>初始化时</strong>递归遍历 data 的每个属性并逐一劫持。这带来三个历史遗留问题：</p>
      <table>
          <thead><tr><th>问题</th><th>示例</th><th>当年的补救</th></tr></thead>
          <tbody>
              <tr><td>新增/删除属性无感</td><td><code>obj.newKey = 1</code> 不会触发更新</td><td><code>Vue.set / Vue.delete</code></td></tr>
              <tr><td>数组索引与 length 失控</td><td><code>arr[0] = x</code>、<code>arr.length = 0</code></td><td>重写 7 个变异方法（push/splice…）</td></tr>
              <tr><td>初始化性能差</td><td>data 越大，首次劫持越慢</td><td>无解，只能建议拆组件</td></tr>
          </tbody>
      </table>
      <blockquote>这三宗罪的根源是同一个：<strong>defineProperty 只能劫持"已知存在的属性"，而不是对象本身</strong>。想要感知"结构变化"，只能靠 API 层打补丁。</blockquote>

      <h2>2. Proxy：一次拦截，全部接管</h2>
      <p><code>Proxy</code> 代理的是<strong>整个对象</strong>，未来新增的属性天然被拦截。Vue 3 的 <code>reactive()</code> 本质上就是返回一个带 handler 的 Proxy：</p>
      <pre><code class="language-js">function reactive(target) {
  return new Proxy(target, {
    // 拦截读取：顺手做依赖收集
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      track(target, key);            // ← 记下"谁在用我"
      // 惰性深层代理：嵌套对象被访问到时才转 Proxy
      return typeof res === 'object' && res !== null
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

      <h2>3. 依赖收集与派发更新：track 与 trigger</h2>
      <p>响应式的核心命题是：<strong>谁在用这个属性，属性变了就通知谁</strong>。Vue 用三级结构存这层关系：</p>
      <pre><code class="language-js">// WeakMap&lt;target, Map&lt;key, Set&lt;effect&gt;&gt;&gt;
let targetMap = new WeakMap();

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
  effects && effects.forEach(fn => fn());    // 重跑所有依赖它的副作用
}</code></pre>
      <p>这里的"副作用（effect）"是个泛化概念：组件的渲染函数、<code>watchEffect</code> 的回调、<code>computed</code> 的取值器，本质上都是"读取响应式数据并产生效果"的函数。渲染函数执行时读到 <code>state.count</code>，track 就把渲染 effect 记到 count 名下；count 一变，trigger 重跑渲染，视图更新。</p>
      <p>为什么用 <code>WeakMap</code>？因为它的键是弱引用——组件销毁后，只要 target 不再被引用，整个依赖表会被垃圾回收自动带走，不需要手动清理。</p>

      <h2>4. ref 与 reactive：为什么需要两个 API？</h2>
      <p><code>Proxy</code> 只能代理<strong>对象</strong>，对 <code>let count = 0</code> 这种原始值无能为力（JS 没有任何办法拦截"变量赋值"）。Vue 的解法是包装：<code>ref</code> 把值装进一个带 <code>.value</code> 的对象里，劫持这个对象的 value 属性。</p>
      <pre><code class="language-js">const count = ref(0);        // RefImpl { _value: 0 }
const state = reactive({ count: 0 });  // Proxy

count.value++;               // 需要显式 .value
state.count++;               // 直接改属性</code></pre>
      <ul>
          <li><strong>reactive</strong>：适合对象/数组/Map/Set，模板里书写自然；<strong>局限</strong>——不能整体替换（<code>state = {...}</code> 会脱离代理），解构会丢失响应式。</li>
          <li><strong>ref</strong>：什么都能装（包括 DOM 元素、组合式函数的返回值）；<strong>代价</strong>——脚本里要写 <code>.value</code>，模板中自动解包（顶层 ref 才解包，数组/Map 里不会）。</li>
      </ul>
      <p>社区共识：<strong>组合式函数与单一状态用 ref，聚合型本地状态用 reactive</strong>，拿不准就全用 ref，一致性比风格更重要。</p>

      <h2>5. computed：缓存、脏检查与副作用禁区</h2>
      <p><code>computed</code> 是带缓存的特殊 effect：第一次取值时执行并把依赖记下来；之后只有依赖变更才把自身标记为"脏（dirty）"，<strong>再次被读取时才重算</strong>。两次读取之间哪怕依赖改了三次，也只重算一次——这是它和 <code>methods</code> 的本质区别。</p>
      <pre><code class="language-js">const double = computed(() => state.count * 2);
double.value;  // 计算，缓存
state.count++; // 只标记脏，不计算
double.value;  // 此时才真正重算</code></pre>
      <blockquote>铁律：<strong>getter 里不要写副作用</strong>（改状态、发请求、操作 DOM）。computed 的重算时机由缓存策略决定，副作用放在里面等于把业务挂在一个不可预测的时间点上。有副作用请用 <code>watchEffect</code>。</blockquote>

      <h2>6. watch 与 watchEffect：显式依赖 vs 自动收集</h2>
      <pre><code class="language-js">// watch：声明依赖，回调拿到新旧值，默认惰性
watch(() => state.count, (n, o) => {
  if (n > 10) console.log('超限', o, '->', n);
}, { immediate: false, deep: false });

// watchEffect：立即执行一次，回调里用到谁就追踪谁
const stop = watchEffect(() => {
  document.title = \`当前 \${state.count} 条\`;   // 依赖 count 被自动收集
});
stop(); // 组件卸载时自动停止，手动场景可提前停</code></pre>
      <p>选择经验：<strong>需要新旧值、需要明确触发条件、异步请求</strong>用 watch；<strong>多个来源联动一个副作用</strong>（比如同时改 title 和 localStorage）用 watchEffect 更简洁。两者回调默认在组件更新<strong>之前</strong>执行，传 <code>flush: 'post'</code> 可改为更新后（此时才能拿到更新后的 DOM）。</p>

      <h2>7. 实战中的坑与最佳实践</h2>
      <ul>
          <li><strong>解构丢失响应式</strong>：<code>const { count } = state</code> 拿到的是快照。用 <code>toRefs(state)</code> 再解构，或始终 <code>state.count</code>。</li>
          <li><strong>reactive 整体替换</strong>：<code>state = newState</code> 让旧 Proxy 失联。要么逐字段赋值，要么改用 ref 包对象（<code>state.value = newState</code> 合法）。</li>
          <li><strong>数组与集合</strong>：<code>ref([])</code> 里装对象会被深层代理，直接 <code>list.value.push</code> 即可，不再需要 Vue2 的变异方法补丁。</li>
          <li><strong>非响应式场景用 markRaw</strong>：第三方类实例（地图、图表）被代理反而出问题，<code>markRaw(instance)</code> 明确豁免。</li>
          <li><strong>别滥用 deep watch</strong>：大对象深层监听会遍历所有属性，能收敛成具体字段就不要 <code>deep: true</code>。</li>
      </ul>
      <p>把这套模型记牢——<strong>track 在 get、trigger 在 set、WeakMap 存依赖、ref 解决原始值、computed 带脏检查</strong>——你就能解释 Vue 3 响应式的绝大多数"为什么"，写组合式函数时也会更有底气。</p>
`;export{e as default};

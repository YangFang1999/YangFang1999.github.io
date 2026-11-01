const t=`
      <h1>Pinia 状态管理入门：为什么它取代了 Vuex</h1>

      <p>组件内部状态用 ref，跨组件共享怎么办？Vuex 曾是唯一答案，但它的 mutation/action 双层结构、字符串常量、TS 支持孱弱一直被诟病。Pinia（Vue 官方钦定继任者）用一套更符合直觉的模型解决了这一切——而且它已经在本文博客这样的真实项目里跑起来了。</p>

      <h2>1. Vuex 4 的四个痛点，Pinia 怎么解</h2>
      <table>
          <thead><tr><th>Vuex 痛点</th><th>Pinia 的回答</th></tr></thead>
          <tbody>
              <tr><td>改状态必须走 mutation，样板代码多</td><td><strong>移除 mutation</strong>，action 与组件里直接改皆可</td></tr>
              <tr><td>modules 嵌套、命名空间繁琐</td><td><strong>扁平的多个 store</strong>，天然按业务拆分</td></tr>
              <tr><td>TypeScript 推导残缺</td><td>从 <code>defineStore</code> 起<strong>全程类型推导</strong></td></tr>
              <tr><td>字符串魔法值（commit('xxx')）</td><td>函数就是函数，IDE 直接跳转</td></tr>
          </tbody>
      </table>
      <p>安装与注册只要三行：</p>
      <pre><code class="language-js">import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(createPinia()).mount('#app');</code></pre>

      <h2>2. Option Store：从 Vuex 平滑迁移的写法</h2>
      <pre><code class="language-ts">import { defineStore } from 'pinia';

export const usePetStore = defineStore('pet', {
  // state 必须是函数：保证每次实例化拿到独立副本
  state: () =&gt; ({
    mood: 78,
    satiety: 80,
    fedCount: 0,
  }),
  getters: {
    // 把 state 当 this 用，返回值自动缓存（依赖不变不重算）
    isHappy(state) {
      return state.mood &gt;= 75;
    },
    // getter 里引用其他 getter：直接 this，需要显式标注返回类型
    summary(): string {
      return this.isHappy ? '开心' : '一般般';
    },
  },
  actions: {
    feed() {
      if (this.satiety &gt;= 92) return false;   // action 里可以完全同步
      this.satiety = Math.min(100, this.satiety + 28);
      this.mood = Math.min(100, this.mood + 6);
      this.fedCount++;
      return true;
    },
    async syncFromServer() {
      const res = await fetch('/api/pet');
      this.$patch(await res.json());          // 异步也毫无心理负担
    },
  },
});</code></pre>
      <blockquote>与 Vuex 最大的区别：<strong>没有 mutation 这一层</strong>。状态变更的"可追溯性"交给了 DevTools 的 timeline 与 <code>$patch</code>/<code>$subscribe</code>，而不是靠人肉拆分函数。</blockquote>

      <h2>3. Setup Store：和组合式 API 完全同构</h2>
      <pre><code class="language-ts">export const useCounterStore = defineStore('counter', () =&gt; {
  const count = ref(0);                              // = state
  const double = computed(() =&gt; count.value * 2);    // = getter
  function increment() { count.value++; }            // = action

  return { count, double, increment };               // 返回的全部是公开成员
});</code></pre>
      <p>两种写法等价，官方结论：<strong>Option 对从 Vuex 迁移者更亲切，Setup 对组合式玩家更顺手</strong>。选一种坚持用即可；Setup Store 里不能再用 this，全靠返回值。</p>

      <h2>4. 使用：解构的坑与 storeToRefs</h2>
      <pre><code class="language-vue">&lt;script setup&gt;
import { storeToRefs } from 'pinia';
import { usePetStore } from '@/stores/pet';

const store = usePetStore();

// ❌ 错误：直接解构 = 拿到快照，响应式断裂
// const { mood } = store;

// ✅ state/getter 用 storeToRefs，action 直接取（函数不丢响应式）
const { mood, satiety, isHappy } = storeToRefs(store);
const { feed } = store;
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="feed()"&gt;喂食 {{ satiety }}&lt;/button&gt;
  &lt;p&gt;心情：{{ mood }} — {{ isHappy ? '开心' : '一般般' }}&lt;/p&gt;
&lt;/template&gt;</code></pre>
      <p>这条和 reactive 解构丢响应式是同一族问题：<strong>Pinia 的 store 本质是个 reactive 对象</strong>，记住 <code>storeToRefs</code> 这一个 API 就够。</p>

      <h2>5. 进阶：$patch、$subscribe 与 $onAction</h2>
      <pre><code class="language-ts">// $patch：一次批量变更只触发一次依赖更新（比多次赋值高效）
store.$patch({ mood: 100, satiety: 100 });
store.$patch((state) =&gt; {           // 函数式 patch，适合数组操作
  state.fedCount += 1;
});

// $subscribe：监听任意 state 变化（做持久化的标准姿势）
store.$subscribe((mutation, state) =&gt; {
  localStorage.setItem('pet', JSON.stringify(state));
}, { detached: true });             // detached：组件卸载后仍监听

// $onAction：监听 action 调用（埋点、日志、时间旅行）
store.$onAction(({ name, args, after, onError }) =&gt; {
  const start = Date.now();
  after(() =&gt; console.log(name, '耗时', Date.now() - start, 'ms'));
  onError((err) =&gt; console.error(name, '失败', err));
});</code></pre>

      <h2>6. 组件外使用 store：一个必须注意的作用域问题</h2>
      <p>在路由守卫、组合式函数外层调用 <code>usePetStore()</code> 时，组件实例不存在，Pinia 不知道用哪个实例：</p>
      <pre><code class="language-ts">// router/guard.ts —— 顶层直接调用会报错！
// ❌ const store = usePetStore();

export function setupGuard(router, pinia) {
  router.beforeEach((to) =&gt; {
    const store = usePetStore(pinia);   // ✅ 显式传入 pinia 实例
    if (to.meta.needsPet &amp;&amp; store.satiety === 0) return '/feed';
  });
}</code></pre>
      <p>规律：<strong>在 <code>setup()</code> 或 <code>&lt;script setup&gt;</code> 内直接调用即可；出了组件作用域，把 <code>pinia</code> 实例作为参数传进去</strong>。</p>

      <h2>7. 持久化与工程实践</h2>
      <ul>
          <li><strong>持久化</strong>：官方生态 <code>pinia-plugin-persistedstate</code> 一行配置写入 localStorage；也可以像上面 $subscribe 那样手搓，本博客的桌宠心情、主题、图标布局都是手搓 localStorage 持久化。</li>
          <li><strong>store 拆分粒度</strong>：按业务域拆（pet / user / cart），一个 store 一个文件，<strong>拒绝一个巨型 root store</strong>。</li>
          <li><strong>别把一切塞进 Pinia</strong>：组件私有的 UI 状态（弹窗开关、表单草稿）留在组件里；跨组件、跨路由共享的才有资格进 store。</li>
          <li><strong>重置</strong>：Option Store 可用 <code>store.$reset()</code> 回到初始值（Setup Store 没有内置 $reset，需要自己实现一个 reset action）。</li>
          <li><strong>DevTools</strong>：Pinia 天然接入 Vue DevTools，action 可回放、state 可编辑，调试体验远超 Vue2 时代。</li>
      </ul>
      <p>总结一句：<strong>Pinia 把"改状态"这件事从仪式感里解放出来，把类型和 DevTools 的体验拉满</strong>。新项目直接上 Pinia，老项目 Vuex 迁移也只需要按 store 逐个翻译——尤其 mutation 那层，直接合并进 action 就完事了。</p>
`;export{t as default};

// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Pinia 状态管理入门：为什么它取代了 Vuex</h1>

	      <p>组件内部状态用 ref，跨组件共享怎么办？Vuex 曾是唯一答案，但它的 mutation/action 双层结构、字符串常量、TS 支持孱弱一直被诟病。Pinia（Vue 官方钦定继任者）用一套更符合直觉的模型解决了这一切——而且它已经在本文博客这样的真实项目里跑起来了。这篇从"为什么需要状态管理"讲到"怎么把一个 store 写得像样"，把日常用得到的 API 和踩过的坑一次配齐。</p>

	      <h2>1. 为什么需要状态管理：props 的搬运工困境</h2>
	      <p>先别急着学 API，想清楚问题是什么。假设当前登录用户的信息（昵称、头像、角色权限）被顶栏、侧边菜单、文章页、设置页同时需要。不用任何状态库，你会怎么传？</p>
	      <pre><code class="language-plaintext">App（持有 user）
 ├── TopNav        ← props: user
 │    └── UserMenu ← props: user（只是搬运）
 ├── Sidebar       ← props: user
 │    └── CategoryTree ← props: user（还是搬运，它根本不用 user）
 │         └── ...
 └── Notes         ← props: user
      └── NoteDetail ← props: user（第 5 层了）</code></pre>
	      <p>这就是 <strong>props drilling（属性逐层下钻）</strong>：中间每一层组件都被迫声明自己根本不关心的 props，纯粹为了"帮下面捎个话"。改一次 user 的结构，五层组件全要动；新来一个深层组件要用 user，就得把整条链路都补上这个参数。更糟的是<strong>反向更新</strong>——深层组件要改 user，就得层层 $emit 往上抛事件，链路更长。</p>
	      <p>状态管理的本质就一句话：<strong>把"被多个不相邻组件共享的状态"从组件树里搬出来，放进一个全局单例的响应式仓库，谁要用谁直接取</strong>。理解了这个，Pinia 的所有 API 都只是这个思想的落地细节。</p>

	      <h2>2. Vuex 4 的四个痛点，Pinia 怎么解</h2>
	      <table>
	          <tr>
	              <th>Vuex 痛点</th>
	              <th>Pinia 的回答</th>
	          </tr>
	          <tr><td>改状态必须走 mutation，样板代码多</td><td><strong>移除 mutation</strong>，action 与组件里直接改皆可</td></tr>
	          <tr><td>modules 嵌套、命名空间繁琐</td><td><strong>扁平的多个 store</strong>，天然按业务拆分</td></tr>
	          <tr><td>TypeScript 推导残缺</td><td>从 <code>defineStore</code> 起<strong>全程类型推导</strong></td></tr>
	          <tr><td>字符串魔法值（commit('xxx')）</td><td>函数就是函数，IDE 直接跳转</td></tr>
	      </table>
	      <p>其中"移除 mutation"最值得展开：Vuex 设计 mutation 层的初衷是让 DevTools 能记录每次状态变更。但实践证明<strong>action 本身就能被记录</strong>，mutation 只剩下"每个变更多写一个函数"的成本。Pinia 把这层砍掉后，代码量和心智负担同时减半，DevTools 的 timeline 依然完整。另外两个现代红利：<strong>Pinia 不要求嵌套 modules</strong>——每个 store 是平级独立单元，跨 store 引用就是函数调用；<strong>代码分割天然友好</strong>——没用到的 store 不会进首屏 bundle。</p>
	      <p>安装与注册只要三行：</p>
	      <pre><code class="language-js">import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).use(createPinia()).mount('#app');</code></pre>

	      <h2>3. Option Store：从 Vuex 平滑迁移的写法</h2>
	      <pre><code class="language-ts">import { defineStore } from 'pinia';

export const usePetStore = defineStore('pet', {
  // state 必须是函数：保证每次实例化拿到独立副本（和组件 data 同理）
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

	      <h2>4. Setup Store：和组合式 API 完全同构</h2>
	      <pre><code class="language-ts">export const useCounterStore = defineStore('counter', () =&gt; {
  const count = ref(0);                              // = state
  const double = computed(() =&gt; count.value * 2);    // = getter
  function increment() { count.value++; }            // = action

  return { count, double, increment };               // 返回的全部是公开成员
});</code></pre>
	      <p>两种写法等价，官方结论：<strong>Option 对从 Vuex 迁移者更亲切，Setup 对组合式玩家更顺手</strong>。三个对照记忆点：<code>ref</code> 就是 state、<code>computed</code> 就是 getter、普通函数就是 action——<strong>会写组合式组件就会写 Setup Store，零新概念</strong>。本站项目统一用 Setup 风格，与 <a href="#/notes/vue-composition">组合式 API</a> 的心智完全连续。</p>
	      <p>Setup Store 唯一的缺口是 <code>$reset()</code>：Option 写法会根据 state 函数重建初始值，Setup 写法 Pinia 不知道"初始值"是什么，需要自己补一个 reset action。攒一套通用模板即可：</p>
	      <pre><code class="language-ts">const initialState = () =&gt; ({
  items: [] as CartItem[],
  coupon: null as string | null,
});

export const useCartStore = defineStore('cart', () =&gt; {
  const state = ref(initialState());

  function reset() {
    state.value = initialState();   // 整体换成新对象，引用干净、无残留
  }

  return { state, reset };
});</code></pre>
	      <p>注意 reset 的写法是<strong>整体替换引用</strong>而不是逐字段赋值——漏掉一个字段的清理，就是"退出登录后还能看到上一个人的购物车"这种经典事故。</p>

	      <h2>5. 完整实战：从零写一个购物车 Store</h2>
	      <p>光看 API 印象不深，把一个真实业务从零走一遍。需求：商品列表页加购、购物车页展示明细与总价、使用优惠券、结算（异步请求）、本地持久化刷新不丢。</p>
	      <h3>5.1 类型与 store 定义</h3>
	      <pre><code class="language-ts">// stores/cart.ts
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

export interface CartItem {
  skuId: number;
  title: string;
  price: number;    // 单价（分，避免浮点误差）
  qty: number;
}

export const useCartStore = defineStore('cart', () =&gt; {
  // ── state ──────────────────────────────
  const items = ref&lt;CartItem[]&gt;(JSON.parse(localStorage.getItem('cart') ?? '[]'));
  const coupon = ref&lt;{ code: string; off: number } | null&gt;(null);

  // ── 持久化：state 变化自动落盘 ──────────
  watch(items, (val) =&gt; localStorage.setItem('cart', JSON.stringify(val)), { deep: true });

  // ── getters：全部由 state 派生，不存副本 ──
  const count = computed(() =&gt; items.value.reduce((s, i) =&gt; s + i.qty, 0));
  const rawTotal = computed(() =&gt; items.value.reduce((s, i) =&gt; s + i.price * i.qty, 0));
  const payable = computed(() =&gt;
    coupon.value ? Math.max(0, rawTotal.value - coupon.value.off) : rawTotal.value
  );
  const findBySku = (skuId: number) =&gt; items.value.find(i =&gt; i.skuId === skuId);

  // ── actions ────────────────────────────
  function add(sku: Omit&lt;CartItem, 'qty'&gt;, qty = 1) {
    const exist = findBySku(sku.skuId);
    if (exist) exist.qty += qty;          // 已有则叠加数量，不重复加行
    else items.value.push({ ...sku, qty });
  }

  function remove(skuId: number) {
    items.value = items.value.filter(i =&gt; i.skuId !== skuId);
  }

  function setQty(skuId: number, qty: number) {
    if (qty &lt;= 0) return remove(skuId);   // 减到 0 视为移除
    const item = findBySku(skuId);
    if (item) item.qty = qty;
  }

  function applyCoupon(code: string, off: number) {
    coupon.value = { code, off };
  }

  async function checkout() {
    if (items.value.length === 0) throw new Error('购物车是空的');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: items.value.map(({ skuId, qty }) =&gt; ({ skuId, qty })),
        coupon: coupon.value?.code ?? null,
      }),
    });
    if (!res.ok) throw new Error('下单失败：' + res.status);
    // 下单成功清空购物车（重置引用，见第 4 节）
    items.value = [];
    coupon.value = null;
    return (await res.json()) as { orderId: number };
  }

  return { items, coupon, count, rawTotal, payable, findBySku, add, remove, setQty, applyCoupon, checkout };
});</code></pre>
	      <h3>5.2 组件里的使用</h3>
	      <pre><code class="language-markup">&lt;!-- ProductList.vue：商品行上的"加入购物车" --&gt;
&lt;script setup lang="ts"&gt;
import { useCartStore } from '@/stores/cart';

const cart = useCartStore();
&lt;/script&gt;

&lt;template&gt;
  &lt;button @click="cart.add({ skuId: 1001, title: '机械键盘', price: 29900 })"&gt;
    加入购物车
  &lt;/button&gt;
&lt;/template&gt;</code></pre>
	      <pre><code class="language-markup">&lt;!-- CartDrawer.vue：购物车抽屉 --&gt;
&lt;script setup lang="ts"&gt;
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/stores/cart';

const cart = useCartStore();
const { items, count, rawTotal, payable, coupon } = storeToRefs(cart);  // state/getter 解构要包一层
const { setQty, remove, checkout } = cart;                              // action 直接解构
&lt;/script&gt;

&lt;template&gt;
  &lt;div v-if="items.length === 0"&gt;购物车空空如也&lt;/div&gt;
  &lt;ul v-else&gt;
    &lt;li v-for="i in items" :key="i.skuId"&gt;
      {{ i.title }} ×
      &lt;button @click="setQty(i.skuId, i.qty - 1)"&gt;-&lt;/button&gt;
      {{ i.qty }}
      &lt;button @click="setQty(i.skuId, i.qty + 1)"&gt;+&lt;/button&gt;
      小计：{{ (i.price * i.qty / 100).toFixed(2) }} 元
      &lt;button @click="remove(i.skuId)"&gt;删除&lt;/button&gt;
    &lt;/li&gt;
  &lt;/ul&gt;
  &lt;p&gt;共 {{ count }} 件，合计 {{ (rawTotal / 100).toFixed(2) }} 元&lt;/p&gt;
  &lt;p v-if="coupon"&gt;已用优惠券，应付 {{ (payable / 100).toFixed(2) }} 元&lt;/p&gt;
  &lt;button @click="checkout()"&gt;去结算&lt;/button&gt;
&lt;/template&gt;</code></pre>
	      <p>这个例子刻意展示了几个值得学走的习惯：<strong>金额用"分"存整数</strong>（浮点没法精确表达 0.1）；<strong>getter 全部由 state 派生</strong>（总价绝不另存一份，否则必然出现两边对不上的 bug）；<strong>持久化 watch 放在 store 内部</strong>而不是散落在组件里；<strong>action 里做参数兜底</strong>（qty ≤ 0 降级为移除）。</p>

	      <h2>6. 使用细节：解构的坑与 storeToRefs</h2>
	      <pre><code class="language-markup">&lt;script setup&gt;
import { storeToRefs } from 'pinia';
import { usePetStore } from '@/stores/pet';

const store = usePetStore();

// ❌ 错误：直接解构 = 拿到快照，响应式断裂
// const { mood } = store;

// ✅ state/getter 用 storeToRefs，action 直接取（函数不丢响应式）
const { mood, satiety, isHappy } = storeToRefs(store);
const { feed } = store;
&lt;/script&gt;</code></pre>
	      <p>这条和 reactive 解构丢响应式是同一族问题：<strong>Pinia 的 store 本质是个 reactive 对象</strong>，记住 <code>storeToRefs</code> 这一个 API 就够。反过来的方向——<strong>监听 store 里的某个值</strong>——用 <code>watch(() =&gt; store.mood, ...)</code> 的 getter 写法，别把整个 store 丢给 watch（任何字段变化都会触发）。</p>

	      <h2>7. 进阶 API：$patch、$subscribe 与 $onAction</h2>
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
	      <p>getters 还有一个进阶用法——<strong>带参数的 getter</strong>（返回一个函数）。注意代价：返回函数后 Vue 无法缓存结果，每次渲染都会重新执行，适合低频、参数化的查询：</p>
	      <pre><code class="language-ts">getters: {
  getItemById: (state) =&gt; {
    return (id: number) =&gt; state.items.find(i =&gt; i.id === id);
  },
},</code></pre>

	      <h2>8. store 互相组合：复用而不是复制</h2>
	      <p>store 之间可以直接引用（在另一个 store 的 action/getter 里调用别的 useXxxStore），这是 Pinia 鼓励的复用方式：</p>
	      <pre><code class="language-ts">export const useOrderStore = defineStore('order', () =&gt; {
  async function submitOrder() {
    const cart = useCartStore();            // ✓ 在 action 执行时取
    if (cart.items.length === 0) return;
    const user = useUserStore();            // ✓ 按需取
    const res = await api.post('/orders', {
      uid: user.id,
      items: cart.items.value.map(({ skuId, qty }) =&gt; ({ skuId, qty })),
    });
    cart.reset();                           // 下单成功清购物车
    return res;
  }
  return { submitOrder };
});</code></pre>
	      <p>注意调用时机：<code>useXxxStore()</code> 必须在 computed / action <strong>执行时</strong>调用，而不是模块顶层——和下一节的组件外使用是同一条作用域规则。跨 store 也要有节制：<strong>A 需要 B 的数据没问题，A 和 B 互相依赖就要警惕循环</strong>，通常说明拆分粒度不对，该合并成一个 store。</p>

	      <h2>9. 组件外使用 store：一个必须注意的作用域问题</h2>
	      <p>在路由守卫、axios 拦截器这类组件树之外的地方调用 <code>usePetStore()</code> 时，组件实例不存在，Pinia 不知道用哪个实例：</p>
	      <pre><code class="language-ts">// router/guard.ts —— 顶层直接调用会报错！
// ❌ const store = usePetStore();

export function setupGuard(router, pinia) {
  router.beforeEach((to) =&gt; {
    const store = usePetStore(pinia);   // ✅ 显式传入 pinia 实例
    if (to.meta.needsPet &amp;&amp; store.satiety === 0) return '/feed';
  });
}

// axios 拦截器同理：模块导出一个 setup 函数，在 main.ts 里把 pinia 传进来
export function setupInterceptors(pinia) {
  api.interceptors.request.use((config) =&gt; {
    config.headers.Authorization = 'Bearer ' + useUserStore(pinia).token;
    return config;
  });
}</code></pre>
	      <p>规律：<strong>在 <code>setup()</code> 或 <code>&lt;script setup&gt;</code> 内直接调用即可；出了组件作用域，把 <code>pinia</code> 实例作为参数传进去</strong>。最常见的踩雷位置是路由守卫和 axios 拦截器——都发生在组件树之外（守卫与路由的配合详见 <a href="#/notes/vue-router4">Vue Router 4 指南</a>）。</p>

	      <h2>10. 插件机制：给所有 store 统一加能力</h2>
	      <p>想给<strong>每一个</strong> store 都加持久化、日志或数据同步，不需要逐个 store 写——用插件。插件就是一个接收 store 上下文的函数，在 <code>createPinia()</code> 时统一注册：</p>
	      <pre><code class="language-ts">// plugins/piniaLogger.ts —— 一个极简插件：所有 store 的 action 打日志
export function piniaLogger({ store }) {
  store.$onAction(({ name, after, onError }) =&gt; {
    const time = Date.now();
    after(() =&gt; console.log(\`[pinia] \${store.$id}.\${name} 完成，耗时 \${Date.now() - time}ms\`));
    onError((err) =&gt; console.error(\`[pinia] \${store.$id}.\${name} 失败\`, err));
  });
}

// main.ts
const pinia = createPinia();
pinia.use(piniaLogger);
pinia.use(createPersistedState());   // 官方持久化插件也是同样的机制

createApp(App).use(pinia);</code></pre>
	      <p>官方生态的 <code>pinia-plugin-persistedstate</code> 就是一个插件：给任意 store 加 <code>persist: true</code> 选项即自动读写 localStorage。自己手搓的话用 <code>$subscribe</code>（第 7 节）也完全可行——本博客的桌宠心情、主题、图标布局都是手搓 localStorage 持久化。注意 <code>persist</code> 的 <code>paths</code> 参数只存必要字段，别把大数组也序列化进去。</p>

	      <h2>11. 什么该进 store，什么不该</h2>
	      <p>状态管理最常见的反模式是"什么都往 Pinia 里塞"。用这张分层表决策：</p>
	      <table>
	          <tr>
	              <th>状态类型</th>
	              <th>例子</th>
	              <th>放哪</th>
	          </tr>
	          <tr><td>组件私有 UI 态</td><td>弹窗开关、输入草稿、hover 态</td><td>组件内 ref</td></tr>
	          <tr><td>父子/少数组件共享</td><td>表单联动、列表选中项</td><td>props / provide-inject</td></tr>
	          <tr><td>实例级复用逻辑</td><td>useMouse、useDebouncedRef</td><td>Composable（<a href="#/notes/vue-composition">见组合式 API 实战</a>）</td></tr>
	          <tr><td><strong>跨组件、跨路由的全局态</strong></td><td>当前用户、购物车、主题</td><td><strong>Pinia</strong></td></tr>
	          <tr><td>服务端数据缓存</td><td>列表、详情（需重取/失效策略）</td><td>VueUse useFetch / TanStack Query（Pinia 只放"必须全局共享"的部分）</td></tr>
	      </table>
	      <p>一个实用的判断问句：<strong>"这个状态刷新页面后还需要吗？两个互不相干的页面会同时关心它吗？"</strong>两个都答是，才进 Pinia。</p>

	      <h2>12. DevTools 调试与工程实践清单</h2>
	      <p>Vue DevTools 的 Pinia 面板是它体验最好的部分之一，值得专门会用：</p>
	      <ul>
	          <li><strong>Inspector → Pinia</strong>：实时查看每个 store 的 state/getter 当前值，<strong>可以直接在面板里改值</strong>——调边界情况不用改代码；</li>
	          <li><strong>Timeline</strong>：每次 action 调用都有记录，点开看前后 state diff，"谁把它改坏的"一目了然；</li>
	          <li><strong>手动触发 action</strong>：面板里可以直接调用 action 传参数，配合后端未就绪的联调场景。</li>
	      </ul>
	      <p>工程实践汇总（每条都是踩过的）：</p>
	      <ul>
	          <li><strong>store 拆分粒度</strong>：按业务域拆（pet / user / cart），一个 store 一个文件放 <code>stores/</code> 目录，<strong>拒绝一个巨型 root store</strong>。判断标准：两块状态的变更时机不同，就该拆开。</li>
	          <li><strong>命名约定</strong>：id 用 kebab-case（'user'、'cart'）、函数名 <code>useXxxStore</code>，getter 名用名词（total/payable），action 名用动词（add/checkout/reset）。</li>
	          <li><strong>别把一切塞进 Pinia</strong>：组件私有的 UI 状态（弹窗开关、表单草稿）留在组件里；跨组件、跨路由共享的才有资格进 store。</li>
	          <li><strong>重置</strong>：Option Store 可用 <code>store.$reset()</code> 回到初始值（Setup Store 用第 4 节的手写方案）。退出登录清空用户态时记得把所有相关 store 一并 reset。</li>
	          <li><strong>大数组别整存整取</strong>：千条以上的列表数据放 store 前先想想分页/虚拟滚动，无脑全量塞 state 会拖垮每个读它的组件。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>把全篇收束成一段话：<strong>Pinia 解决的是"不相邻组件共享状态"的问题——props drilling 是病，store 是药</strong>。Option 与 Setup 两种写法等价选一坚持；解构 state/getter 用 storeToRefs；store 组合在 action 执行时调用；组件树外要传 pinia 实例；持久化交给 watch/$subscribe 或插件；状态分层决策记一句"刷新后还要 + 多页面共享才进 store"。把购物车那节完整抄一遍跑通，Pinia 就算真正上手了——剩下的差别只是你业务的 state 长什么样。</p>
	      <p>Vuex 迁移也只需要按 store 逐个翻译——mutation 那层直接合并进 action 就完事了。配合 <a href="#/notes/vue-router4">Vue Router 4 指南</a>的守卫用法和 <a href="#/notes/vue-composition">组合式 API</a> 的 Composable 分工，Vue 3 状态管理的完整拼图就齐了。</p>`;

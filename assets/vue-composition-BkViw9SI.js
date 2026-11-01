const e=`
      <h1>组合式 API 实战：从 Options API 到可复用 Composables</h1>

      <p>如果说 Proxy 解决的是"响应式怎么实现"，那组合式 API（Composition API）解决的就是<strong>"逻辑怎么组织与复用"</strong>。它不是语法糖，而是 Vue 对"一个功能散落在 data、methods、watch、生命周期四个角落"这一痼疾的正面回答。这篇我们按"痛点 → 语法 → 手写 Composable → 迁移策略"的顺序讲透。</p>

      <h2>1. 一个组件的熵增：Options API 的痛点</h2>
      <p>以一个常见的"搜索 + 防抖 + 分页"组件为例，Options API 的代码长这样：</p>
      <pre><code class="language-js">export default {
  data() {
    return { keyword: '', page: 1, list: [], loading: false, timer: null };
  },
  methods: {
    search() { /* 拉数据 */ },
    debounceSearch() { /* 防抖逻辑 */ },
  },
  watch: {
    keyword: 'debounceSearch',
    page: 'search',
  },
  mounted() { this.search(); },
  unmounted() { clearTimeout(this.timer); },
}</code></pre>
      <p>功能是对的，但<strong>"搜索"这一个业务被撕成了五段</strong>：数据在 data、行为在 methods、触发在 watch、初始化在 mounted、清理在 unmounted。组件一旦过三百行，改动任何一处都要上下反复横跳——这就是所谓的"碎片化"。</p>

      <h2>2. setup 与 script setup：逻辑按功能聚合</h2>
      <p>组合式 API 的思路反过来：<strong>同一个功能的 data、方法、watch、生命周期写在同一个地方</strong>。</p>
      <pre><code class="language-markup">&lt;script setup&gt;
import { ref, watch, onMounted, onUnmounted } from 'vue';

const keyword = ref('');
const page = ref(1);
const list = ref([]);
const loading = ref(false);

async function search() {
  loading.value = true;
  try {
    const res = await fetch('/api/list?q=' + keyword.value + '&amp;p=' + page.value);
    list.value = await res.json();
  } finally {
    loading.value = false;
  }
}

let timer = null;
watch(keyword, () => {
  clearTimeout(timer);
  timer = setTimeout(search, 300);
});
watch(page, search);
onMounted(search);
onUnmounted(() => clearTimeout(timer));
&lt;/script&gt;</code></pre>
      <p><code>&lt;script setup&gt;</code> 是 setup 函数的编译期语法糖：顶层声明的变量与函数<strong>自动暴露给模板</strong>，无需 return；组件导入即注册，也不用再写 components 选项。</p>

      <h2>3. 逻辑复用三部曲：Mixin → 高阶组件 → Composable</h2>
      <table>
          <thead><tr><th>方案</th><th>优点</th><th>致命伤</th></tr></thead>
          <tbody>
              <tr><td>Mixin</td><td>书写简单</td><td>来源不可见、命名冲突、隐式耦合</td></tr>
              <tr><td>高阶组件 / slot 复用</td><td>复用渲染逻辑</td><td>嵌套地狱、props 不透明</td></tr>
              <tr><td><strong>Composable</strong></td><td>来源清晰、可传参、天然 TS 推导</td><td>需要理解响应式作用域（可学）</td></tr>
          </tbody>
      </table>
      <p>Composable 的约定很简单：<strong>以 use 开头的函数，内部使用组合式 API，返回 ref 或函数</strong>。调用方用解构拿到状态，来源一目了然。</p>

      <h2>4. 手写 useDebounceRef：理解副作用清理</h2>
      <p>把上面的防抖搜索抽成通用能力：</p>
      <pre><code class="language-ts">import { customRef, onUnmounted } from 'vue';

export function useDebouncedRef(initial: string, delay = 300) {
  let value = initial;
  let timer: ReturnType&lt;typeof setTimeout&gt; | undefined;

  // customRef：自定义"收集依赖"与"触发更新"的时机
  return customRef((track, trigger) => ({
    get() {
      track();                       // 声明依赖
      return value;
    },
    set(newValue: string) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        value = newValue;
        trigger();                   // 才真正触发更新
      }, delay);
    },
  }));
}

// 组件里两行顶过去三十行：
// const keyword = useDebouncedRef('', 300);</code></pre>
      <p>注意 <code>onUnmounted</code> 的位置：Composable 内部注册的生命周期钩子<strong>自动绑定到调用它的组件实例</strong>。如果在组件外（比如全局单例）调用，就要改用与实例无关的 <code>onScopeDispose</code>，否则钩子注册会直接报错。</p>

      <h2>5. 参数响应式化：toValue 与 unref</h2>
      <p>成熟的 Composable 应该<strong>既能接收值也能接收 ref/getter</strong>，让调用方决定是否动态：</p>
      <pre><code class="language-ts">import { toValue, watchEffect, type MaybeRefOrGetter } from 'vue';

export function useTitle(newTitle: MaybeRefOrGetter&lt;string&gt;) {
  watchEffect(() => {
    // toValue：ref 就取 .value，getter 就调用，普通值原样返回
    document.title = 'Blog - ' + toValue(newTitle);
  });
}

useTitle('首页');                    // 静态
useTitle(() => route.meta.title);   // 动态跟随路由</code></pre>
      <p><code>unref</code> 是 <code>toValue</code> 的子集（只处理 ref 不处理 getter）。约定：<strong>入参类型写成 <code>MaybeRefOrGetter&lt;T&gt;</code></strong>，对调用方最友好。</p>

      <h2>6. 编译宏与类型：defineProps / defineEmits / defineExpose</h2>
      <pre><code class="language-markup">&lt;script setup lang="ts"&gt;
const props = defineProps&lt;{ userId: number; compact?: boolean }&gt;();
const emit = defineEmits&lt;{ (e: 'select', id: number): void }&gt;();

const listEl = ref&lt;HTMLElement | null&gt;(null);
// script setup 默认对外封闭，父组件拿实例时需要显式暴露
defineExpose({ scrollToTop: () => listEl.value?.scrollTo({ top: 0 }) });
&lt;/script&gt;</code></pre>
      <p>三个宏都是<strong>编译期</strong>存在的，无需 import，类型直接内联声明——这是 Vue 3 + TS 体验远超 Vue 2 的关键一环。</p>

      <h2>7. 迁移建议与注意事项</h2>
      <ul>
          <li><strong>不必全量重写</strong>：Options 与组合式可以共存于一个项目，新组件用新写法， touched 的老组件顺手迁移。</li>
          <li><strong>警惕"为了组合式而组合式"</strong>：只用一次的逻辑抽成 use 函数是过度设计，出现第二处复用时再抽不迟。</li>
          <li><strong>watch 的清理</strong>：异步回调里 setState 前先检查 <code>isUnmounted</code> 或用 <code>onCleanup</code> 回调，防止路由切换后的过期请求回写。</li>
          <li><strong>响应式丢失三件套</strong>：解构 reactive、整体替换、传参时没保持 ref——遇到"数据改了视图不动"，优先排查这三个。</li>
      </ul>
      <p>一句话总结：<strong>Options API 把代码按"类型"分桶，组合式 API 把代码按"功能"分块</strong>。理解了这个出发点，你就知道什么时候该用它、以及 Composable 的边界在哪里。</p>
`;export{e as default};

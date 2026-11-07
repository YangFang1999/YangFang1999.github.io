// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>组合式 API 实战：从 Options API 到可复用 Composables</h1>

	      <p>如果说 <a href="#/notes/vue-reactivity">Proxy 响应式系统</a>解决的是"数据变了视图怎么知道"，那组合式 API（Composition API）解决的就是<strong>"逻辑怎么组织与复用"</strong>。它不是语法糖，而是 Vue 对"一个功能散落在 data、methods、watch、生命周期四个角落"这一痼疾的正面回答。这篇按"痛点 → 语法 → 手写 Composable → 迁移策略"的顺序讲透，每一步都给能落地的代码。</p>

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
	      <p>功能是对的，但<strong>"搜索"这一个业务被撕成了五段</strong>：数据在 data、行为在 methods、触发在 watch、初始化在 mounted、清理在 unmounted。组件一旦过三百行，改动任何一处都要上下反复横跳——这就是所谓的"碎片化"。更要命的是逻辑复用：Mixin 能把一段逻辑塞进多个组件，但<strong>组件里根本看不出哪些 data 来自哪个 Mixin</strong>，命名冲突和数据来源不明是 Vue 2 时代最常见的"祖传屎山"来源。</p>
	      <p>组合式 API 的两个核心主张，正对着这两个痛点：</p>
	      <ul>
	          <li><strong>按功能组织</strong>：同一个功能的 state、方法、watch、生命周期写在同一个地方，读代码是顺着业务读的；</li>
	          <li><strong>按函数复用</strong>：逻辑抽成普通函数（Composable），import 进来、调用、解构返回值——来源、参数、返回类型全部显式，TS 推导天然友好。</li>
	      </ul>

	      <h2>2. setup 与 script setup：逻辑按功能聚合</h2>
	      <p>把上面的搜索组件改成 <code>&lt;script setup&gt;</code>：</p>
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
	      <p><code>&lt;script setup&gt;</code> 是 setup 函数的编译期语法糖：顶层声明的变量与函数<strong>自动暴露给模板</strong>，无需 return；组件导入即注册，也不用再写 components 选项。它还有两个隐藏好处：<strong>运行开销更小</strong>（编译成更扁平的代码，不用每实例创建 setup 闭包上下文）和<strong>对 TS 更友好</strong>（顶层就是普通的模块作用域）。</p>

	      <h2>3. ref 还是 reactive？选型其实很简单</h2>
	      <p>新人最容易纠结的问题。先看两者的真实差异：</p>
	      <table>
	          <tr>
	              <th></th>
	              <th>ref</th>
	              <th>reactive</th>
	          </tr>
	          <tr><td>包装对象</td><td>任意类型（基础类型必须用 ref）</td><td>仅对象 / 数组 / Map / Set</td></tr>
	          <tr><td>取值</td><td>代码里要 <code>.value</code>（模板里不用）</td><td>直接访问属性</td></tr>
	          <tr><td>整体替换</td><td><code>state.value = newObj</code> ✓ 仍响应</td><td><code>state = newObj</code> ✗ 引用断了（let 声明则干脆失去响应）</td></tr>
	          <tr><td>解构</td><td>ref 本身就是引用，解构后仍响应</td><td>解构出的基础类型<strong>立即丢失响应式</strong></td></tr>
	      </table>
	      <p>实战结论（也是官方风格指南的方向）：<strong>默认全用 ref，reactive 只用于"一组固定字段聚合成对象"的局部场景</strong>。理由：</p>
	      <ul>
	          <li>ref 能统一心智——所有状态都是 <code>.value</code>，不用记"这个是 ref 那个是 reactive"；</li>
	          <li>接口请求覆盖数据是最高频操作，<code>list.value = res.data</code> 一行搞定，reactive 整体替换就是事故现场；</li>
	          <li>reactive 的解构坑（第 8 节）远比 ref 的 <code>.value</code> 烦人。</li>
	      </ul>

	      <h2>4. watch vs watchEffect：别再用错</h2>
	      <table>
	          <tr>
	              <th></th>
	              <th>watch（显式指定源）</th>
	              <th>watchEffect（自动收集）</th>
	          </tr>
	          <tr><td>依赖来源</td><td>写死在参数里</td><td>回调里用到什么就跟踪什么</td></tr>
	          <tr><td>执行时机</td><td>默认惰性：变化后才执行</td><td><strong>创建时立即执行一次</strong></td></tr>
	          <tr><td>拿到旧值</td><td>✓（newVal, oldVal）</td><td>拿不到旧值</td></tr>
	          <tr><td>适合</td><td>根据某值变化做副作用、需要对比新旧值</td><td>"依赖和副作用强绑定"的场景：同步 title、localStorage 读写</td></tr>
	      </table>
	      <pre><code class="language-ts">// watch：一个源变化 → 请求列表，还能拿到旧值做取消
watch([page, keyword], ([newPage, newKeyword], [oldPage]) =&gt; {
  fetchList(newPage, newKeyword);
});

// watchEffect：函数里用到 route.params.id，依赖自动跟踪
watchEffect(() =&gt; {
  document.title = '文章 ' + route.params.id;
});</code></pre>
	      <p>一个重要的细节：<strong>watch 的源写成 <code>() =&gt; state.xxx</code> 的 getter 形式</strong>，比直接传 reactive 对象更精准——直接传对象时，对象内<strong>任何</strong>属性变化都会触发，且拿不到精确的旧值。</p>

	      <h2>5. 逻辑复用三部曲：Mixin → 高阶组件 → Composable</h2>
	      <table>
	          <tr>
	              <th>方案</th>
	              <th>优点</th>
	              <th>致命伤</th>
	          </tr>
	          <tr><td>Mixin</td><td>书写简单</td><td>来源不可见、命名冲突、隐式耦合</td></tr>
	          <tr><td>高阶组件 / slot 复用</td><td>复用渲染逻辑</td><td>嵌套地狱、props 不透明</td></tr>
	          <tr><td><strong>Composable</strong></td><td>来源清晰、可传参、天然 TS 推导</td><td>需要理解响应式作用域（可学）</td></tr>
	      </table>
	      <p>Composable 的约定很简单：<strong>以 use 开头的函数，内部使用组合式 API，返回 ref 或函数</strong>。调用方用解构拿到状态，来源一目了然。</p>
	      <p>一个最典型的例子——鼠标位置跟踪，这段代码几乎每一页项目都值得有一份：</p>
	      <pre><code class="language-ts">import { ref, onMounted, onUnmounted } from 'vue';

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  const update = (e: MouseEvent) =&gt; { x.value = e.clientX; y.value = e.clientY; };
  onMounted(() =&gt; window.addEventListener('mousemove', update));
  onUnmounted(() =&gt; window.removeEventListener('mousemove', update));

  return { x, y };
}

// 组件里一行接入，事件监听的挂载与销毁全自动：
// const { x, y } = useMouse();</code></pre>
	      <p>注意 <code>onUnmounted</code> 的位置：Composable 内部注册的生命周期钩子<strong>自动绑定到调用它的组件实例</strong>。如果在组件外（比如全局单例模块）调用，就要改用与实例无关的 <code>onScopeDispose</code>，否则钩子注册会直接报错。</p>

	      <h2>6. 手写 useDebounceRef：理解 customRef</h2>
	      <p>把防抖输入框抽成通用能力，顺便看懂 Vue 响应式的两个底层动作——track（收集依赖）与 trigger（触发更新）：</p>
	      <pre><code class="language-ts">import { customRef } from 'vue';

export function useDebouncedRef(initial: string, delay = 300) {
  let value = initial;
  let timer: ReturnType&lt;typeof setTimeout&gt; | undefined;

  // customRef：自定义"收集依赖"与"触发更新"的时机
  return customRef((track, trigger) =&gt; ({
    get() {
      track();                       // 声明依赖
      return value;
    },
    set(newValue: string) {
      clearTimeout(timer);
      timer = setTimeout(() =&gt; {
        value = newValue;
        trigger();                   // 才真正触发更新
      }, delay);
    },
  }));
}

// 组件里两行顶过去三十行：
// const keyword = useDebouncedRef('', 300);</code></pre>

	      <h2>7. 参数响应式化：toValue 与 unref</h2>
	      <p>成熟的 Composable 应该<strong>既能接收值也能接收 ref/getter</strong>，让调用方决定是否动态：</p>
	      <pre><code class="language-ts">import { toValue, watchEffect, type MaybeRefOrGetter } from 'vue';

export function useTitle(newTitle: MaybeRefOrGetter&lt;string&gt;) {
  watchEffect(() =&gt; {
    // toValue：ref 就取 .value，getter 就调用，普通值原样返回
    document.title = 'Blog - ' + toValue(newTitle);
  });
}

useTitle('首页');                    // 静态
useTitle(() =&gt; route.meta.title);   // 动态跟随路由</code></pre>
	      <p><code>unref</code> 是 <code>toValue</code> 的子集（只处理 ref 不处理 getter）。约定：<strong>入参类型写成 <code>MaybeRefOrGetter&lt;T&gt;</code></strong>，对调用方最友好。</p>

	      <h2>8. 响应式丢失：三大事故现场</h2>
	      <p>"数据明明改了，视图就是不动"——90% 是下面三种姿势之一：</p>
	      <ol>
	          <li><strong>解构 reactive 对象</strong>：<code>const { name } = reactive(state)</code> 之后改 <code>name</code>，视图不动。解构的瞬间取到的是普通值，和 state 断开了。修复：用 <code>toRefs(state)</code> 先转成一批 ref 再解构，或干脆全程 ref。</li>
	          <li><strong>reactive 整体替换</strong>：<code>state = { ...newData }</code>（let 声明）或对 <code>const</code> 对象的属性赋值给新对象时响应断链。接口返回后覆盖数据请用 <code>Object.assign(state, newData)</code> 或改用 ref。</li>
	          <li><strong>props 对象解构</strong>：Vue 3.4 及以前，<code>const { msg } = defineProps&lt;{ msg: string }&gt;()</code> 会丢响应（3.5 起编译器已自动处理，但老项目要注意）。</li>
	      </ol>
	      <p>快速自查口诀：<strong>"响应式是跟着引用走的"</strong>——任何一步操作让变量指向了普通值，那条线就断了。</p>

	      <h2>9. 编译宏与类型：defineProps / defineEmits / defineExpose</h2>
	      <pre><code class="language-markup">&lt;script setup lang="ts"&gt;
const props = defineProps&lt;{ userId: number; compact?: boolean }&gt;();
const emit = defineEmits&lt;{ (e: 'select', id: number): void }&gt;();

const listEl = ref&lt;HTMLElement | null&gt;(null);
// script setup 默认对外封闭，父组件拿实例时需要显式暴露
defineExpose({ scrollToTop: () =&gt; listEl.value?.scrollTo({ top: 0 }) });
&lt;/script&gt;</code></pre>
	      <p>三个宏都是<strong>编译期</strong>存在的，无需 import，类型直接内联声明——这是 Vue 3 + TS 体验远超 Vue 2 的关键一环。另外别忘了跨层级传值的组合：<code>provide</code> / <code>inject</code>，配合 <code>InjectionKey</code> 泛型能拿到完整类型提示，适合"主题、当前用户、i18n"这类全局注入，别拿它当 props 的偷懒通道（会破坏数据流向的可追溯性）。</p>

	      <h2>10. 迁移建议与注意事项</h2>
	      <ul>
	          <li><strong>不必全量重写</strong>：Options 与组合式可以共存于一个项目，新组件用新写法，touched 的老组件顺手迁移。Options 组件里也能调用 Composable（放在 setup() 里）。</li>
	          <li><strong>警惕"为了组合式而组合式"</strong>：只用一次的逻辑抽成 use 函数是过度设计，出现第二处复用时再抽不迟。</li>
	          <li><strong>watch 的清理</strong>：异步回调里写状态前先检查 <code>isUnmounted</code> 或用 <code>onCleanup</code> 回调，防止路由切换后的过期请求回写——这和 <a href="#/notes/vue-router4">路由</a>切换场景组合起来是高频 bug。</li>
	          <li><strong>全局状态别硬塞 Composable</strong>：跨组件共享的"单例状态"该交给 <a href="#/notes/pinia-intro">Pinia</a>，Composable 管的是"每次调用一份"的实例级逻辑，两者分工要清楚。</li>
	      </ul>
	      <p>一句话总结：<strong>Options API 把代码按"类型"分桶，组合式 API 把代码按"功能"分块</strong>。理解了这个出发点，你就知道什么时候该用它、以及 Composable 的边界在哪里。</p>`;

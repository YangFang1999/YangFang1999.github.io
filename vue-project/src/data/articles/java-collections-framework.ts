// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Java 集合框架深度解析：从 ArrayList 到 HashMap 底层原理</h1>

	      <p>如果说 <a href="#/notes/hello-world">Java 基础语法</a>是骨架，那集合框架就是血肉。实际开发中，你几乎不可能不跟集合打交道——从接口返回的 List 到缓存用的 Map，从去重用的 Set 到消息队列用的 Queue，<strong>选对集合类型，代码效率和可读性能提升一个档次；选错了，可能直接导致线上 OOM。</strong>今天我们从使用场景出发，把常用的集合类型和使用技巧一次讲清楚。</p>

	      <h2>1. 集合框架全景图</h2>
	      <p>Java 集合框架分为两大体系：</p>
	      <table>
	          <tr>
	              <th>体系</th>
	              <th>顶层接口</th>
	              <th>核心特点</th>
	              <th>常用子接口</th>
	          </tr>
	          <tr>
	              <td><strong>Collection</strong></td>
	              <td>Collection&lt;E&gt;</td>
	              <td>单列数据集合</td>
	              <td>List（有序可重复）、Set（无序不重复）、Queue（队列）</td>
	          </tr>
	          <tr>
	              <td><strong>Map</strong></td>
	              <td>Map&lt;K, V&gt;</td>
	              <td>键值对数据集合</td>
	              <td>HashMap、TreeMap、LinkedHashMap、ConcurrentHashMap</td>
	          </tr>
	      </table>
	      <p><strong>选型的核心决策树：</strong>需要键值对 → Map；只需要存值 → Collection；需要有序 + 可重复 → List；需要去重 → Set；需要先进先出 → Queue。两条家族线在"数组 / 链表 / 红黑树"三种底层结构上反复交叉——记住结构就记住了所有性能特征。</p>

	      <h2>2. List 家族：有序可重复的集合</h2>
	      <h3>ArrayList —— 你最常用的列表</h3>
	      <p><strong>底层数据结构：</strong>Object[] 动态数组。</p>
	      <p><strong>核心特性：</strong></p>
	      <ul>
	          <li><strong>查询快（O(1)）：</strong>底层是数组，按索引访问直接定位内存地址。</li>
	          <li><strong>增删慢（O(n)）：</strong>在中间插入或删除元素时，需要把后面的所有元素整体移动。</li>
	          <li><strong>扩容机制：</strong>默认容量 10（首次 add 时才真正分配），每次扩容为原来的 1.5 倍（10 → 15 → 22 → 33...）。频繁扩容会涉及数组复制，影响性能。</li>
	      </ul>
	      <pre><code class="language-java">// 最佳实践：如果能预估大小，在构造时指定初始容量
List&lt;String&gt; list = new ArrayList&lt;&gt;(100);  // 避免频繁扩容

// 常用操作
list.add("Java");
list.add(0, "Python");          // 在索引 0 插入
String item = list.get(0);      // 按索引获取
list.remove(0);                  // 按索引删除
list.contains("Java");           // 判断是否包含（O(n)，需要遍历）

// 一个容易踩的坑：Arrays.asList 返回的是"定长视图"
List&lt;String&gt; fixed = Arrays.asList("A", "B");
fixed.add("C");                  // ✗ 抛 UnsupportedOperationException！
// 需要可变列表请包一层：
List&lt;String&gt; mutable = new ArrayList&lt;&gt;(Arrays.asList("A", "B"));</code></pre>

	      <h3>LinkedList —— 链表实现的列表</h3>
	      <p><strong>底层数据结构：</strong>双向链表。</p>
	      <p><strong>核心特性：</strong></p>
	      <ul>
	          <li><strong>增删快（O(1)）：</strong>只需修改前后节点的指针。</li>
	          <li><strong>查询慢（O(n)）：</strong>需要从头或尾遍历到目标位置。</li>
	          <li><strong>额外实现了 Deque 接口：</strong>可以当队列或栈使用。<code>addFirst()</code>、<code>addLast()</code>、<code>pollFirst()</code>、<code>pollLast()</code>。</li>
	      </ul>
	      <p><strong>什么时候用 LinkedList？</strong>频繁在头部或中间插入/删除、且很少按索引随机访问时。实际开发中 ArrayList 用得更多，因为大多数场景是"追加 + 遍历"。甚至有性能测试表明：即使头插场景，ArrayList 的连续内存对 CPU 缓存更友好，差距也常小于预期——<strong>选 LinkedList 前先测一测，别靠直觉</strong>。纯队列/栈场景，首选 <code>ArrayDeque</code>（数组实现的双端队列，比 LinkedList 快）。</p>

	      <h3>ArrayList vs LinkedList 对比总结</h3>
	      <table>
	          <tr>
	              <th>对比维度</th>
	              <th>ArrayList</th>
	              <th>LinkedList</th>
	          </tr>
	          <tr><td>底层结构</td><td>动态数组 Object[]</td><td>双向链表 Node</td></tr>
	          <tr><td>随机访问</td><td>O(1) 快</td><td>O(n) 慢</td></tr>
	          <tr><td>头/尾插入</td><td>尾部 O(1)，头部 O(n)</td><td>头尾均 O(1)</td></tr>
	          <tr><td>中间插入</td><td>O(n) 需移动元素</td><td>O(n) 需要定位 + O(1) 修改指针</td></tr>
	          <tr><td>内存占用</td><td>连续内存，仅存数据</td><td>每个节点需额外存前驱/后继指针</td></tr>
	          <tr><td>适用场景</td><td>日常开发首选，查询多</td><td>频繁头部操作，或需要队列/栈功能</td></tr>
	      </table>

	      <h2>3. Set 家族：无序不重复的集合</h2>
	      <h3>HashSet —— 最常用的去重集合</h3>
	      <p><strong>底层：</strong>基于 HashMap 实现（元素存为 HashMap 的 Key，Value 是一个固定的 Object 占位符）。</p>
	      <p><strong>核心特性：</strong>无序、不允许重复、允许一个 null、增删查都是 O(1)。</p>
	      <p><strong>去重原理：</strong>HashSet 依赖 <code>hashCode()</code> 和 <code>equals()</code> 方法。先比较 hash 值，hash 相同再用 equals 判断。所以<strong>存入 HashSet 的对象必须正确重写 hashCode() 和 equals()</strong>。</p>
	      <pre><code class="language-java">Set&lt;String&gt; set = new HashSet&lt;&gt;();
set.add("Java");
set.add("Java");   // 重复，添加失败，返回 false
set.contains("Java");  // true

// 常用操作：去重
List&lt;String&gt; list = Arrays.asList("A", "B", "A", "C", "B");
Set&lt;String&gt; uniqueSet = new HashSet&lt;&gt;(list);  // 结果：["A", "B", "C"]（顺序不定）</code></pre>
	      <p><strong>equals 与 hashCode 的契约</strong>（面试必考，踩坑必见）：两者必须一致——<code>equals</code> 相等的两个对象，<code>hashCode</code> 必须相等；反过来不要求。只重写 equals 不重写 hashCode 的后果：两个"相等"的对象被放进 HashMap 后可能各占一个桶，<code>contains</code> 明明看着相等却返回 false。用 IDE 生成或 Lombok <code>@EqualsAndHashCode</code>，别手写漏字段。</p>

	      <h3>TreeSet 与 LinkedHashSet</h3>
	      <p><strong>TreeSet</strong> 底层是红黑树（TreeMap），元素按<strong>自然顺序</strong>或指定的 Comparator 排序，增删查都是 O(log n)。适合"去重 + 排序"，比如"所有不重复的用户积分排名"。</p>
	      <p><strong>LinkedHashSet</strong> 是 HashSet + 双向链表维护插入顺序。<strong>遍历时按插入顺序输出</strong>，但查找仍然是 O(1)。</p>

	      <h2>4. Map 家族：键值对的王者</h2>
	      <h3>HashMap —— 面试必问，开发必用</h3>
	      <p><strong>底层数据结构（Java 8+）：</strong>数组 + 链表 + 红黑树。</p>
	      <ul>
	          <li>默认容量 16，负载因子 0.75（当元素数量达到容量的 75% 时触发扩容）。</li>
	          <li>扩容为原来的 2 倍，扩容时需要 rehash（重新分配每个元素），开销较大。</li>
	          <li><strong>JDK 8 的重大优化：</strong>当链表长度超过 8 且数组长度达到 64 时，链表转为红黑树（查找从 O(n) 变成 O(log n)），解决了哈希碰撞严重时退化为链表的性能问题；节点减到 6 时退化回链表。</li>
	          <li><strong>线程不安全：</strong>多线程环境请用 ConcurrentHashMap（JDK 7 并发扩容还可能成环死循环）。</li>
	      </ul>
	      <p><strong>为什么容量必须是 2 的幂？</strong>定位桶下标用的是 <code>(n - 1) &amp; hash</code>——n 为 2 的幂时 n-1 的二进制是全 1（如 16-1=1111），与运算等价于取模但<strong>比取模快得多</strong>；同时扩容翻倍后，元素要么留在原下标、要么挪到"原下标 + 旧容量"，rehash 不需要重算 hash，一把位运算搞定。</p>
	      <pre><code class="language-java">Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();

// 常用操作
map.put("apple", 3);
map.put("banana", 5);
map.get("apple");                // 3
map.getOrDefault("orange", 0);   // key 不存在时返回默认值 0
map.containsKey("apple");        // true

// Java 8 三件套：compute / merge —— 消灭"先 get 再 put"的样板代码
map.merge("apple", 1, Integer::sum);          // 计数器一行搞定
map.computeIfAbsent("config", k -&gt; loadConfig(k));  // 不存在才计算（懒加载）

// 遍历 Map 的三种方式
// 1. 遍历 entrySet（推荐，一次获取 key 和 value）
for (Map.Entry&lt;String, Integer&gt; entry : map.entrySet()) {
    System.out.println(entry.getKey() + " -&gt; " + entry.getValue());
}

// 2. Java 8 Lambda（最简洁）
map.forEach((k, v) -&gt; System.out.println(k + " -&gt; " + v));

// 3. 只遍历 key 或 value
for (String key : map.keySet()) { /* ... */ }
for (Integer val : map.values()) { /* ... */ }</code></pre>

	      <h3>TreeMap 与 LinkedHashMap</h3>
	      <p><strong>TreeMap</strong> 底层红黑树，Key 按自然顺序或 Comparator 排序。如果 Key 是自定义对象，必须实现 Comparable 或传入 Comparator。适合"按 key 范围查询"（<code>subMap</code>/<code>headMap</code>）的场景。</p>
	      <p><strong>LinkedHashMap</strong> 继承自 HashMap，额外维护一个双向链表记录顺序。特别适合实现 LRU 缓存（构造函数里设 accessOrder=true，按访问顺序排序，重写 <code>removeEldestEntry</code> 返回 true 即可）：</p>
	      <pre><code class="language-java">Map&lt;String, byte[]&gt; lru = new LinkedHashMap&lt;&gt;(16, 0.75f, true) {
    protected boolean removeEldestEntry(Map.Entry&lt;String, byte[]&gt; eldest) {
        return size() &gt; 1000;   // 超过 1000 条自动淘汰最久未访问的
    }
};</code></pre>

	      <h2>5. 遍历集合的正确姿势</h2>
	      <pre><code class="language-java">// 1. for-each（最常用，底层是迭代器）
for (String item : list) {
    System.out.println(item);
}

// 2. Java 8 Stream + Lambda（推荐用于过滤、转换等操作）
list.stream()
    .filter(s -&gt; s.length() &gt; 3)
    .map(String::toUpperCase)
    .forEach(System.out::println);

// 3. 普通 for 循环（需要索引时使用）
for (int i = 0; i &lt; list.size(); i++) {
    System.out.println(i + ": " + list.get(i));
}

// 4. Iterator（需要在遍历中安全删除元素时使用）
Iterator&lt;String&gt; it = list.iterator();
while (it.hasNext()) {
    if (it.next().length() &lt; 3) {
        it.remove();  // 安全删除！不要用 list.remove()
    }
}

// 5. Java 8 removeIf（最简洁的删除方式）
list.removeIf(s -&gt; s.length() &lt; 3);</code></pre>
	      <p><strong>常见错误：</strong>在 for-each 循环里直接调用 <code>list.remove()</code> 会抛出 <code>ConcurrentModificationException</code>——这是 <strong>fail-fast 机制</strong>：迭代器创建时记下 expectedModCount，遍历中检测到结构变更数不一致就立刻失败（宁可报错也不带着脏状态继续跑）。必须用迭代器的 <code>remove()</code> 或 <code>removeIf()</code>。并发场景下 fail-fast 不保证触发，别把它当安全机制用，只是"尽力早炸"。</p>
	      <p>Stream 再补一个高频实战——<strong>分组统计</strong>（等价于 SQL 的 GROUP BY，配合 <a href="#/notes/mysql-basics">MySQL</a> 查回来的列表做二次加工特别好使）：</p>
	      <pre><code class="language-java">// 按分类分组：Map&lt;分类, List&lt;文章&gt;&gt;
Map&lt;String, List&lt;Article&gt;&gt; byCategory =
    articles.stream().collect(Collectors.groupingBy(Article::getCategory));

// 按分类计数：Map&lt;分类, Long&gt;
Map&lt;String, Long&gt; counts =
    articles.stream().collect(Collectors.groupingBy(Article::getCategory, Collectors.counting()));

// 分组后取每组第一条（按日期倒序）
Map&lt;String, Optional&lt;Article&gt;&gt; latest =
    articles.stream().collect(Collectors.groupingBy(
        Article::getCategory,
        Collectors.maxBy(Comparator.comparing(Article::getDate))));</code></pre>

	      <h2>6. 线程安全的集合</h2>
	      <ul>
	          <li><strong>ConcurrentHashMap：</strong>分段锁（JDK 7）→ CAS + synchronized 锁单个桶头节点（JDK 8），并发读写性能远超 Hashtable 和 Collections.synchronizedMap。另外它<strong>不允许 null 键值</strong>（并发下 get 返回 null 无法区分"没有"和"值就是 null"）。</li>
	          <li><strong>CopyOnWriteArrayList：</strong>写时复制，适合"读多写少"的场景（监听器列表、配置快照）。每次写操作都会复制整个数组，所以写操作很昂贵。</li>
	          <li><strong>Collections.synchronizedXxx()：</strong>给集合套一层同步包装，所有方法加 synchronized，性能较差，不如用 JUC 包下的并发集合。</li>
	          <li><strong>BlockingQueue 家族：</strong>生产者-消费者模型的标准答案（<code>ArrayBlockingQueue</code> 有界、<code>LinkedBlockingQueue</code> 默认无界慎用），线程池内部就是用它交接任务的。</li>
	      </ul>

	      <h2>7. 集合选型速查表</h2>
	      <table>
	          <tr>
	              <th>你的需求</th>
	              <th>推荐集合</th>
	              <th>备选</th>
	          </tr>
	          <tr><td>日常列表，查询多，追加多</td><td>ArrayList</td><td>-</td></tr>
	          <tr><td>频繁头部插入删除</td><td>LinkedList</td><td>ArrayDeque</td></tr>
	          <tr><td>去重，不关心顺序</td><td>HashSet</td><td>-</td></tr>
	          <tr><td>去重 + 排序</td><td>TreeSet</td><td>-</td></tr>
	          <tr><td>去重 + 保持插入顺序</td><td>LinkedHashSet</td><td>-</td></tr>
	          <tr><td>键值对，不关心顺序</td><td>HashMap</td><td>-</td></tr>
	          <tr><td>键值对 + 按 Key 排序 / 范围查询</td><td>TreeMap</td><td>-</td></tr>
	          <tr><td>键值对 + 保持插入顺序</td><td>LinkedHashMap</td><td>-</td></tr>
	          <tr><td>多线程 Map</td><td>ConcurrentHashMap</td><td>-</td></tr>
	          <tr><td>多线程读多写少的 List</td><td>CopyOnWriteArrayList</td><td>-</td></tr>
	          <tr><td>生产者-消费者队列</td><td>ArrayBlockingQueue</td><td>LinkedBlockingQueue</td></tr>
	      </table>

	      <h2>小结</h2>
	      <p>集合框架是 Java 最常用的 API，掌握好它有三个层次：第一层是会 CRUD 操作；第二层是理解底层数据结构，能根据场景正确选型；第三层是理解扩容机制、fail-fast、线程安全问题，能写出高性能代码。<strong>大部分开发者停留在第一层，你至少要到第二层——选对集合，很多性能问题根本不会出现。</strong>这套数据结构知识也是跨语言通用的：Redis 的五大数据结构（见 <a href="#/notes/redis-basics">Redis 实战</a>）本质上就是同一批结构的工程化封装。</p>`;

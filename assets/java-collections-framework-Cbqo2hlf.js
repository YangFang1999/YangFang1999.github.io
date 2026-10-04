const t=`	      <h1>Java 集合框架深度解析：从 ArrayList 到 HashMap 底层原理</h1>

	      <p>如果说 Java 基础语法是骨架，那集合框架就是血肉。实际开发中，你几乎不可能不跟集合打交道——从接口返回的 List 到缓存用的 Map，从去重用的 Set 到消息队列用的 Queue，<strong>选对集合类型，代码效率和可读性能提升一个档次；选错了，可能直接导致线上 OOM。</strong>今天我们从使用场景出发，把常用的集合类型和使用技巧一次讲清楚。</p>

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
	      <p><strong>选型的核心决策树：</strong>需要键值对 → Map；只需要存值 → Collection；需要有序 + 可重复 → List；需要去重 → Set；需要先进先出 → Queue。</p>

	      <h2>2. List 家族：有序可重复的集合</h2>
	      <h3>ArrayList —— 你最常用的列表</h3>
	      <p><strong>底层数据结构：</strong>Object[] 动态数组。</p>
	      <p><strong>核心特性：</strong></p>
	      <ul>
	          <li><strong>查询快（O(1)）：</strong>底层是数组，按索引访问直接定位内存地址。</li>
	          <li><strong>增删慢（O(n)）：</strong>在中间插入或删除元素时，需要把后面的所有元素整体移动。</li>
	          <li><strong>扩容机制：</strong>默认容量 10，每次扩容为原来的 1.5 倍（10 → 15 → 22 → 33...）。频繁扩容会涉及数组复制，影响性能。</li>
	      </ul>
	      <pre><code class="language-java">// 最佳实践：如果能预估大小，在构造时指定初始容量
List&lt;String&gt; list = new ArrayList&lt;&gt;(100);  // 避免频繁扩容

// 常用操作
list.add("Java");
list.add(0, "Python");          // 在索引 0 插入
String item = list.get(0);      // 按索引获取
list.remove(0);                  // 按索引删除
list.contains("Java");           // 判断是否包含（O(n)，需要遍历）</code></pre>

	      <h3>LinkedList —— 链表实现的列表</h3>
	      <p><strong>底层数据结构：</strong>双向链表。</p>
	      <p><strong>核心特性：</strong></p>
	      <ul>
	          <li><strong>增删快（O(1)）：</strong>只需修改前后节点的指针。</li>
	          <li><strong>查询慢（O(n)）：</strong>需要从头或尾遍历到目标位置。</li>
	          <li><strong>额外实现了 Deque 接口：</strong>可以当队列或栈使用。<code>addFirst()</code>、<code>addLast()</code>、<code>pollFirst()</code>、<code>pollLast()</code>。</li>
	      </ul>
	      <p><strong>什么时候用 LinkedList？</strong>频繁在头部或中间插入/删除、且很少按索引随机访问时。实际开发中 ArrayList 用得更多，因为大多数场景是"追加 + 遍历"。</p>

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

	      <h3>TreeSet —— 需要排序的去重集合</h3>
	      <p><strong>底层：</strong>红黑树（TreeMap）。元素按<strong>自然顺序</strong>或指定的 Comparator 排序。增删查都是 O(log n)。</p>
	      <p><strong>适用场景：</strong>需要去重 + 排序时使用，比如"所有不重复的用户积分排名"。</p>

	      <h3>LinkedHashSet —— 保持插入顺序的去重集合</h3>
	      <p><strong>底层：</strong>HashSet + 双向链表维护插入顺序。<strong>遍历时按插入顺序输出</strong>，但查找仍然是 O(1)。</p>

	      <h2>4. Map 家族：键值对的王者</h2>
	      <h3>HashMap —— 面试必问，开发必用</h3>
	      <p><strong>底层数据结构（Java 8+）：</strong>数组 + 链表 + 红黑树。</p>
	      <ul>
	          <li>默认容量 16，负载因子 0.75（当元素数量达到容量的 75% 时触发扩容）。</li>
	          <li>扩容为原来的 2 倍，扩容时需要 rehash（重新计算每个元素的位置），开销较大。</li>
	          <li><strong>JDK 8 的重大优化：</strong>当链表长度超过 8 且数组长度达到 64 时，链表转为红黑树（查找从 O(n) 变成 O(log n)），解决了哈希碰撞严重时退化为链表的性能问题。</li>
	          <li><strong>线程不安全：</strong>多线程环境请用 ConcurrentHashMap。</li>
	      </ul>
	      <pre><code class="language-java">Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();

// 常用操作
map.put("apple", 3);
map.put("banana", 5);
map.get("apple");                // 3
map.getOrDefault("orange", 0);   // key 不存在时返回默认值 0
map.containsKey("apple");        // true

// 遍历 Map 的三种方式
// 1. 遍历 entrySet（推荐，一次获取 key 和 value）
for (Map.Entry&lt;String, Integer&gt; entry : map.entrySet()) {
    System.out.println(entry.getKey() + " -> " + entry.getValue());
}

// 2. Java 8 Lambda（最简洁）
map.forEach((k, v) -> System.out.println(k + " -> " + v));

// 3. 只遍历 key 或 value
for (String key : map.keySet()) { ... }
for (Integer val : map.values()) { ... }</code></pre>

	      <h3>TreeMap —— 按 Key 排序的 Map</h3>
	      <p><strong>底层：</strong>红黑树。Key 按自然顺序或 Comparator 排序。如果 Key 是自定义对象，必须实现 Comparable 或传入 Comparator。</p>

	      <h3>LinkedHashMap —— 保持插入顺序的 Map</h3>
	      <p>继承自 HashMap，额外维护一个双向链表记录插入顺序。特别适合实现 LRU 缓存（构造函数里设 accessOrder=true，按访问顺序排序）。</p>

	      <h2>5. 遍历集合的正确姿势</h2>
	      <pre><code class="language-java">// 1. for-each（最常用，底层是迭代器）
for (String item : list) {
    System.out.println(item);
}

// 2. Java 8 Stream + Lambda（推荐用于过滤、转换等操作）
list.stream()
    .filter(s -> s.length() > 3)
    .map(String::toUpperCase)
    .forEach(System.out::println);

// 3. 普通 for 循环（需要索引时使用）
for (int i = 0; i < list.size(); i++) {
    System.out.println(i + ": " + list.get(i));
}

// 4. Iterator（需要在遍历中安全删除元素时使用）
Iterator&lt;String&gt; it = list.iterator();
while (it.hasNext()) {
    if (it.next().length() < 3) {
        it.remove();  // 安全删除！不要用 list.remove()
    }
}

// 5. Java 8 removeIf（最简洁的删除方式）
list.removeIf(s -> s.length() < 3);</code></pre>

	      <p><strong>常见错误：</strong>在 for-each 循环里直接调用 <code>list.remove()</code> 会抛出 <code>ConcurrentModificationException</code>。必须用迭代器的 <code>remove()</code> 方法或 <code>removeIf()</code>。</p>

	      <h2>6. 线程安全的集合</h2>
	      <ul>
	          <li><strong>ConcurrentHashMap：</strong>分段锁（JDK 7）→ CAS + synchronized（JDK 8），并发读写性能远超 Hashtable 和 Collections.synchronizedMap。</li>
	          <li><strong>CopyOnWriteArrayList：</strong>写时复制，适合"读多写少"的场景。每次写操作都会复制整个数组，所以写操作很昂贵。</li>
	          <li><strong>Collections.synchronizedXxx()：</strong>给集合套一层同步包装，所有方法加 synchronized，性能较差，不如用 JUC 包下的并发集合。</li>
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
	          <tr><td>键值对 + 按 Key 排序</td><td>TreeMap</td><td>-</td></tr>
	          <tr><td>键值对 + 保持插入顺序</td><td>LinkedHashMap</td><td>-</td></tr>
	          <tr><td>多线程并发</td><td>ConcurrentHashMap</td><td>CopyOnWriteArrayList</td></tr>
	      </table>

	      <h2>小结</h2>
	      <p>集合框架是 Java 最常用的 API，掌握好它有三个层次：第一层是会 CRUD 操作；第二层是理解底层数据结构，能根据场景正确选型；第三层是理解扩容机制、线程安全问题，能写出高性能代码。<strong>大部分开发者停留在第一层，你至少要到第二层——选对集合，很多性能问题根本不会出现。</strong></p>`;export{t as default};

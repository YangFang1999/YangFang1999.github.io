// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>MySQL 索引详解：从 B+ 树到索引下推</h1>

	      <p>在<a href="#/notes/mysql-basics">上一篇 MySQL 基础</a>里我们只知道"索引能让查询变快，像书的目录"。但目录是怎么组织起来的？为什么偏偏是 B+ 树，而不是哈希表、红黑树？为什么有时候明明建了索引却没走？回表、覆盖索引、索引下推这些高频词到底在说什么？这篇一次讲透。</p>

	      <h2>1. 从一次慢查询说起</h2>
	      <p>一张 2000 万行的 user 表，执行：</p>
	      <pre><code class="language-sql">SELECT * FROM user WHERE name = '张三';</code></pre>
	      <p>name 列上没有索引时，InnoDB 能做的只有<strong>全表扫描</strong>：从主键 B+ 树的第一个叶子页开始，沿着链表一页页往后扫，逐行比较 name。2000 万行意味着几万次磁盘页读取（哪怕有 Buffer Pool 缓存，首次冷查询也很伤）。而建了索引之后，同样的查询通常只需 <strong>3~4 次</strong>页读取就能锁定目标——树高了 3~4 层而已。这个巨大的差距，就来自索引的数据结构。</p>

	      <h2>2. 候选数据结构逐个淘汰</h2>
	      <p>数据库查索引，本质是在磁盘上做查找。把候选者挨个过一遍，就知道为什么最后胜出的是 B+ 树：</p>
	      <table>
	          <tr>
	              <th>结构</th>
	              <th>等值查询</th>
	              <th>致命问题</th>
	          </tr>
	          <tr><td>哈希表</td><td>O(1)，极快</td><td>完全不支持范围查询和排序（哈希后无序），也不支持最左前缀；只适合等值场景</td></tr>
	          <tr><td>二叉搜索树</td><td>O(log n)</td><td>有序插入会退化成链表；即使平衡，树高也是 log₂n——2000 万行约 24 层，一层就是一次磁盘 IO</td></tr>
	          <tr><td>红黑树</td><td>O(log n)</td><td>本质仍是二叉树，扇出只有 2，树太深，磁盘 IO 次数不可接受</td></tr>
	          <tr><td>B 树</td><td>树矮胖，扇出大</td><td>每个节点都存数据 → 单页放不了几个键 → 扇出变小、树变高；范围查询要中序回溯</td></tr>
	          <tr><td><strong>B+ 树</strong></td><td>树矮胖 + 叶子链表</td><td>（胜出）非叶子节点只存键不存数据，扇出极大；叶子节点存全部数据且串成双向链表，范围查询顺着链表扫即可</td></tr>
	      </table>
	      <p>核心矛盾只有一个：<strong>磁盘 IO 按页（16KB）读写，每读一页就是一次 IO 成本</strong>。所以数据结构的目标不是"比较次数最少"，而是"<strong>树高最矮</strong>"——树高几层，一次查询就有几次 IO。这就是"把二叉树改造成千万叉树"的思路：B+ 树。</p>

	      <h2>3. B+ 树长什么样</h2>
	      <pre><code class="language-plaintext">                  [ P1 | 10 | P2 | 35 | P3 ]                 ← 根节点
                 /              |               \\
        [3 | 7 | 10]         [21 | 28 | 35]        [40 | 52 | 68]   ← 内部节点
        /   |   \\             /   |   \\              /   |   \\
  [1,2,3]⇄[4,5,7]⇄[8,9,10] [12,21,25]⇄[28,30,35] [40,45,52]⇄[55,60,68]  ← 叶子节点
                                                        （整行数据，双向链表）</code></pre>
	      <p>三个要点：</p>
	      <ul>
	          <li><strong>非叶子节点只存键 + 页指针，不存数据</strong>。一页 16KB 全部用来放"路标"，所以扇出（每个节点的分支数）可以非常大。</li>
	          <li><strong>数据全部在叶子节点</strong>，叶子页内按键有序、页间用双向链表串联。<code>WHERE id BETWEEN 100 AND 200</code> 这类范围查询：先定位到 100，再顺链表右扫，不用回到上层。</li>
	          <li><strong>树高通常只有 2~4 层</strong>。估算一下：假设主键 BIGINT（8 字节）+ 页指针 6 字节，一个非叶子条目约 14 字节，16KB 页能放约 <strong>1170</strong> 个路标；叶子页假设每行 1KB 能放 16 行。那么三层树能容纳 <strong>1170 × 1170 × 16 ≈ 2100 万行</strong>——也就是说，2000 万行的单表，主键查询理论上只做 3 次页 IO。这也解释了为什么很多团队把"单表 2000 万行"当成分表的参考线：再往上树要长到 4 层，所有查询都多一次 IO。</li>
	      </ul>

	      <h2>4. 索引是"引擎层"的东西：InnoDB、MyISAM 各不相同</h2>
	      <p>一个容易被忽略的事实：<strong>MySQL 的 server 层根本不实现索引，索引的数据结构完全由存储引擎决定</strong>。同样的建表语句换成不同引擎，索引的存储方式、能用的数据结构都不一样。所以"MySQL 的索引是怎么实现的"这个问题，严格说必须先回答"哪个引擎"：</p>
	      <table>
	          <tr>
	              <th>引擎</th>
	              <th>索引结构</th>
	              <th>组织方式</th>
	          </tr>
	          <tr><td><strong>InnoDB</strong>（默认）</td><td>B+ 树（另支持全文索引）</td><td><strong>聚簇索引</strong>：主键索引的叶子节点就是完整行数据，"索引即数据"</td></tr>
	          <tr><td><strong>MyISAM</strong></td><td>B+ 树</td><td><strong>非聚簇</strong>：索引文件（.MYI）与数据文件（.MYD）分离，所有索引的叶子节点存的都是行的物理地址</td></tr>
	          <tr><td><strong>MEMORY</strong></td><td>默认 <strong>哈希索引</strong>（可指定 BTree）</td><td>数据在内存，哈希等值查询 O(1)，但重启丢数据，很少用于生产</td></tr>
	      </table>
	      <h3>InnoDB：主键索引就是数据本身</h3>
	      <p>InnoDB 的表本身就是一颗按主键组织的 B+ 树——这就是<strong>聚簇索引（主键索引）</strong>：叶子节点存的不是"指向数据的指针"，而是<strong>整行数据</strong>。这也意味着"按主键访问"和"访问数据"是同一次操作，主键查询是最快的路径。</p>
	      <p>而二级索引（自己在普通列上建的索引）是另一颗 B+ 树，它的叶子节点<strong>不存整行，只存索引列的值 + 主键值</strong>。这就引出两个关键概念：</p>
	      <ul>
	          <li>二级索引查到主键值后，还要回到主键树再查一次完整行——这就是<strong>回表</strong>（下一节细说）。</li>
	          <li>二级索引的叶子都存主键，所以<strong>主键越长，所有二级索引跟着越胖</strong>。自增 BIGINT 主键的另一个好处就在这。</li>
	      </ul>
	      <h3>MyISAM：索引是索引，数据是数据</h3>
	      <p>MyISAM 的主键索引和二级索引在结构上没有区别，叶子节点统一存<strong>数据文件的物理地址</strong>，查到地址后去 .MYD 文件里取行。它没有"聚簇"概念，也不存在"二级索引额外存主键"的开销。但代价是：主键变更、页分裂时地址维护更脆弱，且没有事务和崩溃恢复——这也是生产环境几乎清一色 InnoDB 的原因。</p>
	      <p>顺带澄清一个常见误区：<strong>InnoDB 不支持手动创建哈希索引</strong>。但引擎内部有一套自动管理的<strong>自适应哈希索引（Adaptive Hash Index）</strong>——对热点页自动在 B+ 树之上建哈希加速，无需也无法人工干预，参数层面只能开关它。</p>

	      <h2>5. 回表与覆盖索引</h2>
	      <p>有了"二级索引叶子只存主键"这个前提，回表就好理解了：</p>
	      <pre><code class="language-sql">SELECT * FROM user WHERE name = '张三';   -- name 上有普通索引 idx_name

-- 执行过程：
-- ① 在 idx_name 的 B+ 树里查到 '张三'，叶子节点里拿到的是主键 id（比如 4）
-- ② 拿着 id=4 回到主键（聚簇）索引树，查出整行数据
-- ③ 这一步"回到主键树"就是回表</code></pre>
	      <p>查到一行就回一次表。如果命中 1 行无所谓，命中 1 万行就是 1 万次主键树查找，优化器甚至会觉得"还不如全表扫描"，干脆放弃这个索引。</p>
	      <p><strong>覆盖索引</strong>就是消灭回表的手段：要查的列，在二级索引里全都有，不用回主键树了。</p>
	      <pre><code class="language-sql">-- 只查 id 和 name：idx_name 的叶子里就有（name + 主键 id），直接返回，零回表
SELECT id, name FROM user WHERE name = '张三';

-- 还要查 age：叶子里没有 age，必须回表
-- 解决办法：把 age 一起放进联合索引
CREATE INDEX idx_name_age ON user(name, age);
SELECT id, name, age FROM user WHERE name = '张三';   -- 现在覆盖索引，免回表</code></pre>
	      <p>这就是很多团队规范里"不要写 SELECT *"的索引层原因：<code>SELECT *</code> 几乎注定要回表，把覆盖索引优化全部堵死。EXPLAIN 里出现 <code>Using index</code> 就是"覆盖索引生效"的标志。</p>

	      <h2>6. 联合索引与最左前缀</h2>
	      <p>联合索引 (a, b, c) 不是三个索引，而是<strong>一颗按"a 排序、a 相同再按 b 排、b 相同再按 c 排"的树</strong>。理解了这个排序规则，最左前缀原则就是它的自然推论：</p>
	      <pre><code class="language-sql">KEY idx_abc (a, b, c)

-- 能用上索引的：
WHERE a = 1                              -- 只用 a
WHERE a = 1 AND b = 2                    -- 用 a + b
WHERE a = 1 AND b = 2 AND c = 3          -- 用 a + b + c
WHERE a = 1 AND b &gt; 2                    -- a 精确 + b 范围
WHERE a = 1 ORDER BY b                   -- 索引天然按 b 有序，免 filesort

-- 用不上的：
WHERE b = 2                              -- 树是先按 a 排的，跳过 a 无从下探
WHERE a = 1 AND c = 3                    -- b 断层，c 只能筛选、无法精确定位</code></pre>
	      <p>两个容易踩的细节：</p>
	      <ul>
	          <li><strong>范围查询会"截断"后面的列</strong>。<code>a = 1 AND b &gt; 2 AND c = 3</code> 里 c 用不上索引定位——因为 b 是范围时，满足条件的记录在树里 c 已经无序了。所以联合索引的列序经验法则：<strong>等值条件列在前，范围条件列放最后</strong>。</li>
	          <li><strong>区分度高的列放前面</strong>。性别这种只有两三个取值的列，单独建索引意义不大（过滤后还有一半数据，优化器多半宁可直接全表扫）。</li>
	      </ul>

	      <h2>7. 索引下推（ICP）：把过滤下放到引擎层</h2>
	      <p>Index Condition Pushdown，MySQL 5.6 引入，默认开启。看这个查询：</p>
	      <pre><code class="language-sql">CREATE INDEX idx_name_age ON user(name, age);

SELECT * FROM user WHERE name LIKE '张%' AND age = 10;</code></pre>
	      <p><code>name LIKE '张%'</code> 是前缀匹配，能走 idx_name_age 的 name 前缀；但因为是范围，按最左前缀的截断规则，age 本来"用不上"。可是 age 明明就存在这颗索引的叶子里，真的只能浪费掉吗？5.6 之前确实如此：</p>
	      <ul>
	          <li><strong>无 ICP（5.6 前）</strong>：存储引擎按 <code>name LIKE '张%'</code> 取出所有命中记录（比如 5000 条），<strong>逐条回表</strong>取出整行，交给 server 层再过滤 <code>age = 10</code>——5000 次回表，只有 5 条真的符合。</li>
	          <li><strong>有 ICP（5.6 起）</strong>：server 层把 <code>age = 10</code> 一并"下推"给存储引擎，引擎先在<strong>索引内部</strong>用 age 过滤，只对剩下的 5 条回表——回表次数从 5000 降到 5。</li>
	      </ul>
	      <p>EXPLAIN 的 Extra 列出现 <code>Using index condition</code>，就是 ICP 在工作。它的本质是：<strong>索引里已有的数据，别等回表后在 server 层才过滤，直接在引擎层提前过滤掉</strong>。</p>

	      <h2>8. 索引失效的常见姿势</h2>
	      <p>建了索引 ≠ 用得上。以下场景逐一自查（根本原因大多是"对索引列做了加工，有序结构被破坏"）：</p>
	      <ol>
	          <li><strong>对索引列用函数或运算</strong>：<code>WHERE DATE(create_time) = '2024-01-01'</code>、<code>WHERE id + 1 = 10</code>。改写成范围条件：<code>WHERE create_time &gt;= '2024-01-01' AND create_time &lt; '2024-01-02'</code>。</li>
	          <li><strong>隐式类型转换</strong>：phone 是 VARCHAR，写 <code>WHERE phone = 13800001111</code>（不带引号）——MySQL 会把<strong>列</strong>转成数字再比，等价于对列做函数操作，索引失效。反过来，INT 列与字符串比较，转换发生在常量一侧，索引不受影响。口诀：<strong>别让列去迁就常量</strong>。</li>
	          <li><strong>前导通配符</strong>：<code>LIKE '%三'</code>、<code>LIKE '%三%'</code> 无法定位树上的起点；只有 <code>LIKE '张%'</code> 能走。</li>
	          <li><strong>联合索引不满足最左前缀</strong>：跳过最左列直接查后面的列。</li>
	          <li><strong>OR 两侧混有非索引列</strong>：<code>WHERE a = 1 OR height = 180</code>——height 没索引，等于要求全表扫一遍，优化器直接放弃 a 的索引。给 OR 的每一侧都配上索引才行。</li>
	          <li><strong>不是"失效"，是优化器觉得不划算</strong>：区分度太低的列、回表代价超过全表扫描时，优化器会主动弃用索引。这不是 bug，是成本决策——一切以 <code>EXPLAIN</code> 的实际输出为准。</li>
	      </ol>
	      <p>另外澄清两个流传很广的误传：<code>IS NULL</code> / <code>IS NOT NULL</code> / <code>!=</code> 本身并<strong>不会</strong>让索引必然失效，走不走还是优化器按成本算的，别背口诀，看执行计划。</p>

	      <h2>9. 为什么主键推荐自增</h2>
	      <p>聚簇索引的叶子是按主键顺序存放的。用<strong>自增主键</strong>时，新行永远追加到当前最后一个叶子页后面，页写满就开新页，数据紧凑顺序写入。</p>
	      <p>换成 <strong>UUID 这类随机主键</strong>，每条新行都可能落在树的任意位置：</p>
	      <ul>
	          <li>目标页已满 → 触发<strong>页分裂</strong>：申请新页、挪移部分数据、改上层路标，写入性能骤降，还会留下大量碎片页；</li>
	          <li>更糟的是<strong>所有二级索引的叶子都存主键</strong>，UUID 长（36 字符），每颗二级索引都跟着膨胀，内存里能缓存的索引页变少，IO 更多。</li>
	      </ul>
	      <p>这就是"主键要尽量短、尽量单调递增"的完整理由。业务上确实需要全局唯一 ID 时，用雪花算法这类<strong>趋势递增</strong>的方案，而不是随机 UUID。</p>

	      <h2>小结</h2>
	      <p>把这一篇压缩成五句话：<strong>① 索引由存储引擎实现，InnoDB 是聚簇 B+ 树，主键索引即数据；② 一切设计都为了降低树高、减少磁盘 IO；③ 回表是二级索引查主键树的过程，覆盖索引能免掉它；④ 联合索引按"从左到右排序"组织，等值在前范围在后，ICP 让索引内的列提前过滤；⑤ 索引失效的根源多是对列做了加工</strong>。</p>
	      <p>下一篇我们进入事务的世界：<a href="#/notes/mysql-txn-lock">《MySQL 事务与锁：从 ACID 到 MVCC》</a>——隔离级别、ReadView、间隙锁，看看 InnoDB 是怎么在"数据正确"和"并发够高"之间走钢丝的。</p>`;

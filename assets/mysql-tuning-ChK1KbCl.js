const t=`	      <h1>MySQL 性能调优与 SQL 优化实战</h1>

	      <p>索引原理（<a href="#/notes/mysql-index">索引篇</a>）、事务与锁（<a href="#/notes/mysql-txn-lock">事务篇</a>）、日志（<a href="#/notes/mysql-logs">日志篇</a>）都铺垫完了，这篇全部落到实战：一条慢 SQL 到手，怎么定位、怎么读执行计划、怎么改写。这些是日常开发里真正高频使用的技能——本篇的每一段都尽量给"判断标准"而不只是"知识点"。</p>

	      <h2>1. 调优金字塔：先做性价比最高的事</h2>
	      <table>
	          <tr>
	              <th>层次</th>
	              <th>手段</th>
	              <th>性价比</th>
	          </tr>
	          <tr><td><strong>SQL 与索引</strong></td><td>改写 SQL、补建 / 修正索引</td><td>最高——多数慢查询源于此，零成本</td></tr>
	          <tr><td>库表结构</td><td>字段类型、适度冗余、拆分大字段</td><td>较高，但要改表</td></tr>
	          <tr><td>系统参数</td><td>Buffer Pool 大小、连接数</td><td>有限，别指望调参救烂 SQL</td></tr>
	          <tr><td>硬件与架构</td><td>升配、读写分离、分库分表</td><td>最后才考虑，且引入新复杂度</td></tr>
	      </table>
	      <p>顺序别搞反：先写对 SQL，再谈加机器。一个数据佐证：同样的查询，走索引和全表扫描的差距常常是<strong>三个数量级</strong>（毫秒 vs 秒），而换一块更贵的 SSD 只能差一个数量级——优化金字塔的底层投入产出比就是被这种数量级差距决定的。</p>

	      <h2>2. 慢 SQL 定位：先找到罪犯</h2>
	      <p>优化第一步不是改代码，是<strong>找到最值得优化的那条 SQL</strong>。慢查询日志是第一入口：</p>
	      <pre><code class="language-sql">SET GLOBAL slow_query_log = ON;          -- 开启慢查询日志
SET GLOBAL long_query_time = 1;          -- 超过 1 秒记入日志（默认 10 秒太宽松）
SET GLOBAL log_queries_not_using_indexes = ON;  -- 未走索引的也记录（酌情）

-- 系统自带的分析工具：按总耗时排序取前 10 条
-- mysqldumpslow -s t -t 10 /var/lib/mysql/hostname-slow.log</code></pre>
	      <p>线上突发的卡顿，还有两个"案发现场勘查"命令：</p>
	      <pre><code class="language-sql">-- 谁在占着连接？Query 时间多长？
SHOW PROCESSLIST;
-- 配合 information_schema.innodb_trx 找长事务（见事务篇第 9 节）
SELECT trx_id, trx_started, trx_mysql_thread_id
FROM information_schema.innodb_trx
WHERE trx_started &lt; NOW() - INTERVAL 60 SECOND;</code></pre>
	      <p>慢日志是"日常档案袋"，PROCESSLIST 是"案发现场"，两者配合：日常按慢日志批量治理，突发故障看现场先止血。</p>

	      <h2>3. EXPLAIN：执行计划逐列精读</h2>
	      <p>拿到嫌疑 SQL，第一件事是看执行计划。在 SELECT 前面加 EXPLAIN：</p>
	      <pre><code class="language-sql">EXPLAIN
SELECT o.order_no, u.username
FROM orders o JOIN user u ON o.user_id = u.id
WHERE o.status = 'paid' AND o.created_at &gt;= '2026-01-01';</code></pre>
	      <h3>3.1 全部输出列一览</h3>
	      <table>
	          <tr>
	              <th>列</th>
	              <th>含义</th>
	              <th>优先级</th>
	          </tr>
	          <tr><td>id</td><td>SELECT 序号；相同 id 从上往下读，越大越先执行（子查询）</td><td>读计划的第一步</td></tr>
	          <tr><td>select_type</td><td>SIMPLE（无子查询）/ PRIMARY / SUBQUERY / DERIVED / UNION…</td><td>了解结构</td></tr>
	          <tr><td>table</td><td>这一步访问的表（派生表显示 &lt;derivedN&gt;）</td><td>-</td></tr>
	          <tr><td><strong>type</strong></td><td>访问方式（下节详表）</td><td><strong>核心</strong></td></tr>
	          <tr><td>possible_keys</td><td>理论上可用的索引</td><td>参考</td></tr>
	          <tr><td><strong>key</strong></td><td><strong>实际使用的索引（NULL = 没用索引）</strong></td><td><strong>核心</strong></td></tr>
	          <tr><td>key_len</td><td>用到索引的长度——能判断联合索引用了前几列</td><td>重要</td></tr>
	          <tr><td><strong>rows</strong></td><td>预估扫描行数，越少越好</td><td><strong>核心</strong></td></tr>
	          <tr><td>filtered</td><td>按条件过滤后剩余的百分比（rows × filtered = 真实参与后续的量）</td><td>参考</td></tr>
	          <tr><td><strong>Extra</strong></td><td>附加信息（下节详表）</td><td><strong>核心</strong></td></tr>
	      </table>
	      <p>key_len 的用法值得单独说：联合索引 (a INT, b INT, c INT)，key_len = 8 说明只用了前两列（每个可空 INT 算 5 字节、非空 4 字节）——判断"最左前缀走到哪断了"不用猜，看这个数就行。</p>
	      <h3>3.2 type：扫描方式的成绩单</h3>
	      <table>
	          <tr>
	              <th>type</th>
	              <th>含义</th>
	              <th>评价</th>
	          </tr>
	          <tr><td>const / system</td><td>主键或唯一索引等值命中，最多一行</td><td>最优</td></tr>
	          <tr><td>eq_ref</td><td>join 时被驱动表按主键 / 唯一索引匹配</td><td>很好</td></tr>
	          <tr><td>ref</td><td>普通索引等值匹配</td><td>良好，线上查询的主流目标</td></tr>
	          <tr><td>range</td><td>索引范围扫描（&gt;、&lt;、BETWEEN、IN、前缀 LIKE）</td><td>可接受</td></tr>
	          <tr><td>index</td><td>扫整颗索引树（全索引扫描）</td><td>差，比 ALL 好一点点</td></tr>
	          <tr><td>ALL</td><td>全表扫描</td><td>数据量大的表必须优化</td></tr>
	      </table>
	      <h3>3.3 Extra：藏在备注里的优化信号</h3>
	      <table>
	          <tr>
	              <th>Extra 值</th>
	              <th>含义</th>
	              <th>行动</th>
	          </tr>
	          <tr><td>Using index</td><td>覆盖索引生效，免回表</td><td>理想状态</td></tr>
	          <tr><td>Using index condition</td><td>索引下推（ICP）在工作</td><td>正常</td></tr>
	          <tr><td>Using where</td><td>server 层再过滤</td><td>视情况，配合 rows 看</td></tr>
	          <tr><td><strong>Using filesort</strong></td><td>排序无法利用索引，额外排序</td><td>数据量大时优化：让 ORDER BY 落进索引序</td></tr>
	          <tr><td><strong>Using temporary</strong></td><td>建了临时表（常见于 GROUP BY / DISTINCT / UNION）</td><td>尽量优化：分组列也纳入索引序</td></tr>
	          <tr><td>Using join buffer (hash join)</td><td>被驱动表无索引，靠 join buffer 缓存匹配</td><td>给关联列补索引</td></tr>
	          <tr><td>Select tables optimized away</td><td>聚合被优化器直接算出（如无条件的 MAX）</td><td>理想状态</td></tr>
	      </table>
	      <p>MySQL 8.0 还提供了 <code>EXPLAIN ANALYZE</code>：真正执行一遍并给出每步的<strong>实际</strong>行数与耗时，比预估数字可信得多；<code>EXPLAIN FORMAT=TREE</code> 则以树形展示连接方式。强烈推荐把 ANALYZE 当默认习惯。</p>
	      <h3>3.4 想知道优化器"怎么想的"：optimizer trace</h3>
	      <pre><code class="language-sql">SET optimizer_trace = 'on';
SELECT ... ;   -- 你的嫌疑 SQL
SELECT * FROM information_schema.OPTIMIZER_TRACE;
SET optimizer_trace = 'off';
-- 里面能看到每个候选索引的成本估算（cost），
-- "明明有索引却不用"的答案通常就在 cost 对比里</code></pre>

	      <h2>4. 索引优化实战</h2>
	      <ul>
	          <li><strong>联合索引列序</strong>：等值条件列在前、范围条件列放最后（范围之后的列无法精确定位，见<a href="#/notes/mysql-index">索引篇</a>）；同时让排序列、覆盖列也挤进同一颗索引，一个索引干多件事。经典设计：<code>(user_id, status, created_at)</code> 同时服务"某用户某状态按时间查"和排序。</li>
	          <li><strong>区分度先行</strong>：候选列先算区分度 <code>SELECT COUNT(DISTINCT col)/COUNT(*) FROM t</code>，越接近 1 越值得建。性别这种列（≈0.000001）单独建索引基本白建。</li>
	          <li><strong>前缀索引</strong>：长字符串（邮箱、URL）整列建索引太占空间，可以只取前 N 个字符。N 怎么选？看区分度：</li>
	      </ul>
	      <pre><code class="language-sql">SELECT
  COUNT(DISTINCT LEFT(email, 5))  / COUNT(*) AS n5,
  COUNT(DISTINCT LEFT(email, 10)) / COUNT(*) AS n10,
  COUNT(DISTINCT email)           / COUNT(*) AS full_
FROM user;
-- n10 已接近 full_ 且明显省空间，就用 10</code></pre>
	      <p>注意前缀索引的代价：索引里没有完整列值，<strong>永远无法覆盖索引</strong>，必然回表。</p>
	      <ul>
	          <li><strong>别滥建索引</strong>：每颗索引都是一颗 B+ 树，INSERT/UPDATE 都要同步维护所有索引（写放大）；索引越多，优化器选错索引的概率也越高。废索引及时删——哪些索引没人用可以查 <code>sys.schema_unused_indexes</code>（8.0，基于性能统计）。</li>
	      </ul>

	      <h2>5. SQL 写法优化：六个高频场景</h2>
	      <h3>5.1 别写 SELECT *</h3>
	      <p>三重罪：多传无用字段浪费网络与内存；几乎注定回表，堵死覆盖索引；某些场景还会让优化器放弃索引。只查需要的列。</p>
	      <h3>5.2 深分页：三种方案按场景选</h3>
	      <pre><code class="language-sql">-- 慢：取出 100020 条完整行，丢掉前 100000 条
SELECT * FROM orders WHERE user_id = 42 ORDER BY id
LIMIT 100000, 20;

-- 优化一：延迟关联。子查询只走覆盖索引拿主键，最后只回表 20 次
SELECT t.* FROM orders t
JOIN (SELECT id FROM orders WHERE user_id = 42 ORDER BY id LIMIT 100000, 20) tmp
  ON t.id = tmp.id;

-- 优化二：游标翻页（记住上一页最后一条的 id），常数耗时，翻到多深都快
SELECT * FROM orders WHERE user_id = 42 AND id &gt; 829103 ORDER BY id LIMIT 20;</code></pre>
	      <table>
	          <tr>
	              <th>方案</th>
	              <th>适合</th>
	              <th>局限</th>
	          </tr>
	          <tr><td>原样 LIMIT</td><td>前几页</td><td>页数深了线性变慢</td></tr>
	          <tr><td>延迟关联</td><td>需要跳页（第 N 页直达）</td><td>仍是 O(N)，只是常数小</td></tr>
	          <tr><td>游标（keyset）</td><td>无限下拉/顺序翻页</td><td>不能跳页，排序键必须唯一</td></tr>
	      </table>
	      <h3>5.3 JOIN</h3>
	      <ul>
	          <li><strong>小表驱动大表</strong>：外层循环次数越少越好。INNER JOIN 时优化器一般会自动选择驱动表，写 SQL 时把过滤条件写清楚即可；需要强制顺序时用 STRAIGHT_JOIN。</li>
	          <li><strong>被驱动表的关联列必须有索引</strong>：否则每次匹配都是全表扫（BNL）。8.0.18 起无索引 join 会改用 Hash Join，但给关联列建索引仍是第一原则。</li>
	          <li><strong>JOIN 的字段类型要对齐</strong>：一边 INT 一边 VARCHAR，隐式转换让索引失效。</li>
	      </ul>
	      <h3>5.4 COUNT 家族</h3>
	      <table>
	          <tr>
	              <th>写法</th>
	              <th>语义与性能</th>
	          </tr>
	          <tr><td>count(*)</td><td>不取值、不判空，InnoDB 有专门优化，<strong>与 count(1) 基本无差别，官方也推荐这种写法</strong></td></tr>
	          <tr><td>count(1)</td><td>同上，性能等价</td></tr>
	          <tr><td>count(id)</td><td>取出主键再统计，略慢于 count(*)</td></tr>
	          <tr><td>count(字段)</td><td>要逐行取出该字段并跳过 NULL，<strong>最慢</strong>；语义还是"该列非 NULL 的行数"，多半不是你想要的</td></tr>
	      </table>
	      <p>InnoDB 的精确 count 无法避免扫描（MVCC 下每个事务看到的行数都可能不同，没法存一个全局值；MyISAM 无 WHERE 的 count 是 O(1) 但别为此选它）。计数是高频需求时换思路：计数表（触发器/应用层维护）、<code>SHOW TABLE STATUS</code> 的估算值（误差 10%+，只适合大盘展示）、或缓存层。</p>
	      <h3>5.5 IN / EXISTS 与 UNION</h3>
	      <ul>
	          <li>教科书口诀是"外表小用 IN、外表大用 EXISTS"，但 <strong>8.0 的半连接优化已让 IN 子查询多数情况更优或持平</strong>——别背口诀，直接对比两者 EXPLAIN 的 rows。</li>
	          <li>合并结果集用 <strong>UNION ALL</strong> 代替 UNION：UNION 要去重（建临时表 + 排序），确定无重复或允许重复时就省掉这步。</li>
	      </ul>
	      <h3>5.6 排序与分组</h3>
	      <p><code>ORDER BY</code> 有两种执行路径：<strong>索引序</strong>（扫描即有序，零额外成本）和 <strong>filesort</strong>（在 sort buffer 里排，数据多还要落盘临时文件）。让排序列进索引是根治法；<code>GROUP BY</code> 同理——分组列有序时走松散索引扫描，免临时表。EXPLAIN 里出现 Using filesort / Using temporary 就是这两处要优化的信号（8.0.18 起 GROUP BY 部分场景不再隐式排序，需要确定顺序就显式写 ORDER BY）。</p>

	      <h2>6. 结构与参数：两板斧点到为止</h2>
	      <p><strong>表结构</strong>层面最有效的三板斧：字段类型选小不选大（<a href="#/notes/mysql-basics">基础篇</a>已详述）；大字段（TEXT/BLOB）垂直拆到扩展表，让主表页更"瘦"、Buffer Pool 能缓存更多行；读多写少的统计字段适度<strong>反范式冗余</strong>，少一次 JOIN。</p>
	      <p><strong>参数</strong>层面只需记住一个：<code>innodb_buffer_pool_size</code>——InnoDB 最重要的参数，数据页与索引页的内存缓存，专用数据库服务器一般给到物理内存的 50%~70%。命中率越高，磁盘 IO 越少，其余参数在达到瓶颈前基本不用碰。</p>
	      <p><strong>分库分表</strong>是最后的大招：单表超过几千万行、写入成为瓶颈时才考虑。它解决的是容量与并发上限，但引入跨库 JOIN、分布式事务、跨分片分页一整套新问题——<strong>先确认索引和 SQL 已经优化到位，再考虑动架构</strong>。多数系统把"该有的索引建齐、烂 SQL 改完"，分表的时间点能往后推好几年。</p>

	      <h2>7. 一张调优 Checklist</h2>
	      <table>
	          <tr>
	              <th>#</th>
	              <th>检查项</th>
	              <th>工具/标准</th>
	          </tr>
	          <tr><td>1</td><td>慢 SQL 有没有？</td><td>慢查询日志 / PROCESSLIST</td></tr>
	          <tr><td>2</td><td>type 是否 ALL？</td><td>EXPLAIN，大表必须优化</td></tr>
	          <tr><td>3</td><td>key 是不是预期索引？</td><td>EXPLAIN + key_len 判断联合索引用到第几列</td></tr>
	          <tr><td>4</td><td>rows 是否离谱？</td><td>EXPLAIN ANALYZE 看真实值</td></tr>
	          <tr><td>5</td><td>有没有 filesort / temporary？</td><td>Extra 列</td></tr>
	          <tr><td>6</td><td>SELECT * 改掉了吗？</td><td>覆盖索引机会</td></tr>
	          <tr><td>7</td><td>深分页处理了吗？</td><td>延迟关联 / 游标</td></tr>
	          <tr><td>8</td><td>JOIN 的被驱动表有索引吗？</td><td>EXPLAIN 看 eq_ref/ref</td></tr>
	          <tr><td>9</td><td>隐式转换/函数操作？</td><td>对列加工 = 索引失效（<a href="#/notes/mysql-index">索引篇第 8 节</a>）</td></tr>
	          <tr><td>10</td><td>索引是否过剩？</td><td>sys.schema_unused_indexes</td></tr>
	      </table>

	      <h2>8. 一次真实优化：从 8 秒到 80 毫秒</h2>
	      <p>把方法论走一遍完整案例。线上反馈"订单列表翻页越来越慢"，SQL 长这样（orders 表约 800 万行）：</p>
	      <pre><code class="language-sql">SELECT * FROM orders
WHERE user_id = 42 AND status = 'paid'
ORDER BY created_at DESC
LIMIT 100000, 20;</code></pre>
	      <p><strong>第一步：EXPLAIN 定性。</strong>type = ALL，rows ≈ 800万，Extra = Using filesort——全表扫描 + 排序，实锤。</p>
	      <p><strong>第二步：第一轮优化——补联合索引。</strong>按"等值在前、范围/排序在后"建 <code>idx_user_status_created(user_id, status, created_at)</code>：</p>
	      <pre><code class="language-sql">ALTER TABLE orders ADD INDEX idx_user_status_created (user_id, status, created_at);</code></pre>
	      <p>再看 EXPLAIN：type = ref，rows = 2100（该用户该状态的订单数），filesort 消失（排序走索引序）。耗时 8s → <strong>320ms</strong>。能用，但翻到深页仍然慢——因为 OFFSET 越深，回表越多。</p>
	      <p><strong>第三步：第二轮优化——覆盖索引 + 延迟关联。</strong>子查询只取 id（索引内完成，免回表），外层再按主键取整行：</p>
	      <pre><code class="language-sql">SELECT t.* FROM orders t
JOIN (SELECT id FROM orders WHERE user_id = 42 AND status = 'paid'
      ORDER BY created_at DESC LIMIT 100000, 20) tmp ON t.id = tmp.id;</code></pre>
	      <p>子查询完全走覆盖索引（Extra: Using index），只回表 20 次。深页耗时稳定在 <strong>80ms</strong>。总优化路径：<strong>8s → 320ms（索引）→ 80ms（覆盖 + 延迟关联）</strong>，两次动作都是"零硬件成本"。</p>
	      <p>这个案例的复盘顺序就是通用方法论：<strong>EXPLAIN 定性 → 索引定性优化（数量级）→ 写法优化（常数级）→ 仍慢才考虑结构/架构</strong>。跳过定性直接瞎试，是绝大多数"调优无效"的原因。</p>

	      <h2>9. 高频疑问 FAQ</h2>
	      <ul>
	          <li><strong>为什么我建的索引没被用上？</strong>——三步排查：① EXPLAIN 看 key；② 看 WHERE 是否对列做了加工（函数/隐式转换，见<a href="#/notes/mysql-index">索引篇第 8 节</a>）；③ 看优化器成本——回表代价高于全表扫描时它会主动放弃（表太小、区分度太低都属此类），用 optimizer_trace 看成本对比。</li>
	          <li><strong>加索引一定要锁表吗？</strong>——8.0 的 INPLACE ONLINE DDL 不阻塞读写，但仍要拿 MDL 元数据锁：先确认没有长事务（<a href="#/notes/mysql-txn-lock">事务篇 7.2 节</a>），大表选低峰，并显式写 <code>ALGORITHM=INPLACE, LOCK=NONE</code>。</li>
	          <li><strong>LIMIT 10 很快，LIMIT 100000,10 慢十倍，为什么？</strong>——OFFSET 的语义是"扫描并丢弃"，不是"跳过"：引擎老老实实读出前 100020 行（走二级索引还要回表）再扔掉。用延迟关联或游标翻页（第 5.2 节）。</li>
	          <li><strong>count(*) 到底慢不慢？</strong>——本身已是 InnoDB 的最优实现（count(1) 等价）；真正的问题是 MVCC 下"任何时刻都要现算"。高频计数需求换计数表/缓存/近似值。</li>
	          <li><strong>EXPLAIN 的 rows 是精确值吗？</strong>——是估算（基于统计信息），可能偏差很大；拿 <code>EXPLAIN ANALYZE</code> 的真实执行数据说话。统计信息偏差大时 <code>ANALYZE TABLE</code> 重新采样。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>整个系列的实践路径串起来就是：慢查询日志找到嫌疑犯 → EXPLAIN（重点 type / key / rows / Extra，升级用 EXPLAIN ANALYZE）看清楚执行方式 → 按最左前缀和覆盖索引补正索引 → 按本文的写法清单改写 SQL → 仍然不行才谈结构与架构。始终记住那句铁律：<strong>先测量，再优化</strong>——凭感觉加索引，常常是白忙一场甚至帮倒忙。</p>
	      <p>至此 MySQL 进阶系列四篇完结。祝你的查询全部 const，事务永不回滚。数据库的搭档 <a href="#/notes/redis-basics">Redis 缓存</a>该怎么配合，也在等你看。</p>`;export{t as default};

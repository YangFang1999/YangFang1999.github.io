// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>MySQL 性能调优与 SQL 优化实战</h1>

	      <p>索引原理（<a href="#/notes/mysql-index">索引篇</a>）、事务与锁（<a href="#/notes/mysql-txn-lock">事务篇</a>）、日志（<a href="#/notes/mysql-logs">日志篇</a>）都铺垫完了，这篇全部落到实战：一条慢 SQL 到手，怎么定位、怎么读执行计划、怎么改写。这些是日常开发里真正高频使用的技能。</p>

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
	      <p>顺序别搞反：先写对 SQL，再谈加机器。下面所有手段都按这个优先级展开。</p>

	      <h2>2. 慢 SQL 定位：先找到罪犯</h2>
	      <p>优化第一步不是改代码，是<strong>找到最值得优化的那条 SQL</strong>。慢查询日志是第一入口：</p>
	      <pre><code class="language-sql">SET GLOBAL slow_query_log = ON;          -- 开启慢查询日志
SET GLOBAL long_query_time = 1;          -- 超过 1 秒记入日志（默认 10 秒太宽松）
SET GLOBAL log_queries_not_using_indexes = ON;  -- 未走索引的也记录（酌情）

-- 系统自带的分析工具：按总耗时排序取前 10 条
mysqldumpslow -s t -t 10 /var/lib/mysql/hostname-slow.log</code></pre>
	      <p>线上突发的卡顿，用 <code>SHOW PROCESSLIST</code> 看当前正在执行的连接，配合 information_schema.innodb_trx 找长事务——这俩是"案发现场勘查"，慢日志是"日常档案袋"，配合使用。</p>

	      <h2>3. EXPLAIN：执行计划逐列精读</h2>
	      <p>拿到嫌疑 SQL，第一件事是看执行计划。在 SELECT 前面加 EXPLAIN：</p>
	      <pre><code class="language-sql">EXPLAIN
SELECT o.order_no, u.username
FROM orders o JOIN user u ON o.user_id = u.id
WHERE o.status = 'paid' AND o.created_at &gt;= '2026-01-01';</code></pre>
	      <p>十来列里，重点盯四列：<code>type</code>（访问方式）、<code>key</code>（实际用的索引）、<code>rows</code>（预估扫描行数）、<code>Extra</code>（附加信息）。</p>
	      <h3>type：扫描方式的成绩单</h3>
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
	      <h3>Extra：藏在备注里的优化信号</h3>
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
	          <tr><td><strong>Using temporary</strong></td><td>建了临时表（常见于 GROUP BY / DISTINCT）</td><td>尽量优化：分组列也纳入索引序</td></tr>
	      </table>
	      <p>MySQL 8.0 还提供了 <code>EXPLAIN ANALYZE</code>：真正执行一遍并给出每步的实际行数与耗时，比预估数字可信得多，强烈推荐。</p>

	      <h2>4. 索引优化实战</h2>
	      <ul>
	          <li><strong>联合索引列序</strong>：等值条件列在前、范围条件列放最后（范围之后的列无法精确定位，见索引篇）；同时让排序列、覆盖列也挤进同一颗索引，一个索引干多件事。</li>
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
	          <li><strong>别滥建索引</strong>：每颗索引都是一颗 B+ 树，INSERT/UPDATE 都要同步维护所有索引（写放大）；索引越多，优化器选错索引的概率也越高。废索引及时删。</li>
	      </ul>

	      <h2>5. SQL 写法优化：五个高频场景</h2>
	      <h3>5.1 别写 SELECT *</h3>
	      <p>三重罪：多传无用字段浪费网络与内存；几乎注定回表，堵死覆盖索引；某些场景还会让优化器放弃索引。只查需要的列。</p>
	      <h3>5.2 深分页</h3>
	      <pre><code class="language-sql">-- 慢：取出 100020 条完整行，丢掉前 100000 条（type 是 ALL/扫全索引）
SELECT * FROM orders WHERE user_id = 42 ORDER BY id
LIMIT 100000, 20;

-- 优化一：延迟关联。子查询只走覆盖索引拿主键，最后只回表 20 次
SELECT t.* FROM orders t
JOIN (SELECT id FROM orders WHERE user_id = 42 ORDER BY id LIMIT 100000, 20) tmp
  ON t.id = tmp.id;

-- 优化二：游标翻页（记住上一页最后一条的 id），常数耗时，翻到多深都快
SELECT * FROM orders WHERE user_id = 42 AND id &gt; 829103 ORDER BY id LIMIT 20;</code></pre>
	      <h3>5.3 JOIN</h3>
	      <ul>
	          <li><strong>小表驱动大表</strong>：外层循环次数越少越好。INNER JOIN 时优化器一般会自动选择驱动表，写 SQL 时把过滤条件写清楚即可；需要强制顺序时用 STRAIGHT_JOIN。</li>
	          <li><strong>被驱动表的关联列必须有索引</strong>：否则每次匹配都是全表扫（BNL）。8.0.18 起无索引 join 会改用 Hash Join，但给关联列建索引仍是第一原则。</li>
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
	      <p>顺带一提：MyISAM 不带 WHERE 的 count(*) 是 O(1)（直接读存好的行数），但别因此选 MyISAM——事务和崩溃恢复比一个 count 重要得多。InnoDB 的精确 count 无法避免扫描，计数频繁时可考虑计数表或缓存层。</p>
	      <h3>5.5 IN / EXISTS 与 UNION</h3>
	      <ul>
	          <li>经验法则：<strong>外表小、子查询结果大用 IN；外表大、子查询结果小用 EXISTS</strong>。8.0 的半连接优化已让 IN 子查询多数情况更优，纠结时直接对比两者 EXPLAIN 的 rows。</li>
	          <li>合并结果集用 <strong>UNION ALL</strong> 代替 UNION：UNION 要去重（建临时表 + 排序），确定无重复或允许重复时就省掉这步。</li>
	      </ul>

	      <h2>6. 结构与参数：两板斧点到为止</h2>
	      <p><strong>表结构</strong>层面最有效的三板斧：字段类型选小不选大（基础篇已详述）；大字段（TEXT/BLOB）垂直拆到扩展表，让主表页更"瘦"、Buffer Pool 能缓存更多行；读多写少的统计字段适度<strong>反范式冗余</strong>，少一次 JOIN。</p>
	      <p><strong>参数</strong>层面只需记住一个：<code>innodb_buffer_pool_size</code>——InnoDB 最重要的参数，数据页与索引页的内存缓存，专用数据库服务器一般给到物理内存的 50%~70%。命中率越高，磁盘 IO 越少，其余参数在达到瓶颈前基本不用碰。</p>
	      <p><strong>分库分表</strong>是最后的大招：单表超过几千万行、写入成为瓶颈时才考虑。它解决的是容量与并发上限，但引入跨库 JOIN、分布式事务、跨分片分页一整套新问题——<strong>先确认索引和 SQL 已经优化到位，再考虑动架构</strong>。</p>

	      <h2>小结</h2>
	      <p>整个系列的实践路径串起来就是：慢查询日志找到嫌疑犯 → EXPLAIN（重点 type / key / rows / Extra）看清楚执行方式 → 按最左前缀和覆盖索引补正索引 → 按本文的写法清单改写 SQL → 仍然不行才谈结构与架构。始终记住那句铁律：<strong>先测量，再优化</strong>——凭感觉加索引，常常是白忙一场甚至帮倒忙。</p>
	      <p>至此 MySQL 进阶系列四篇完结。祝你的查询全部 const，事务永不回滚。</p>`;

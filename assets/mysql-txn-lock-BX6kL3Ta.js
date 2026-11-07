const t=`	      <h1>MySQL 事务与锁：从 ACID 到 MVCC</h1>

	      <p>转账扣了钱、记录却没加上；报表统计到一半，数字悄悄变了；两条更新互相等对方释放锁，最后双双被回滚——这些都是事务与锁没搞明白时会踩的坑。这篇从 ACID 讲到 MVCC，再到 InnoDB 的整套锁体系，每个概念都配上"两个会话的时间线实验"，看看它在"数据正确"和"并发够高"之间是怎么走钢丝的。</p>

	      <h2>1. 事务是什么</h2>
	      <p>事务就是把若干条 SQL 打包成一个<strong>不可分割的执行单元</strong>：要么全做，要么全不做。最经典的例子是转账：</p>
	      <pre><code class="language-sql">BEGIN;
UPDATE account SET balance = balance - 100 WHERE id = 1;  -- A 账户扣 100
UPDATE account SET balance = balance + 100 WHERE id = 2;  -- B 账户加 100
COMMIT;   -- 或者 ROLLBACK; 两条一起作废</code></pre>
	      <p>如果第二条 UPDATE 失败而第一条生效，钱就凭空消失了。事务的价值就是把这种"一半成功"的状态从物理上排除。</p>

	      <h2>2. ACID 各自靠什么实现</h2>
	      <p>ACID 不是四个平级的口号，它们在 InnoDB 里各有明确的实现机制（日志部分下一篇<a href="#/notes/mysql-logs">《MySQL 日志系统》</a>展开）：</p>
	      <table>
	          <tr>
	              <th>特性</th>
	              <th>含义</th>
	              <th>靠什么保证</th>
	          </tr>
	          <tr><td><strong>A</strong>tomacity 原子性</td><td>要么全成功，要么全回滚</td><td><strong>undo log</strong>——失败时按逆序回滚</td></tr>
	          <tr><td><strong>C</strong>onsistency 一致性</td><td>事务前后数据满足业务约束</td><td>目的而非手段，由 A + I + D 共同达成</td></tr>
	          <tr><td><strong>I</strong>solation 隔离性</td><td>并发事务互不干扰</td><td><strong>锁 + MVCC</strong>（本篇主角）</td></tr>
	          <tr><td><strong>D</strong>urability 持久性</td><td>提交后断电也不丢</td><td><strong>redo log</strong>——先写日志再刷数据页</td></tr>
	      </table>
	      <p>注意 C 的特殊性：A、I、D 是"机制"，C 是"目的"——原子性保证转账两步同生共死，隔离性保证并发转账不互相污染，持久性保证提交不丢，三者合力才谈得上"账目始终是对的"。</p>

	      <h2>3. 不隔离会发生什么：并发三问题（含实验脚本）</h2>
	      <p>多个事务并发读写同一批数据，按严重程度排有三个经典问题。假设账户里余额 1000：</p>
	      <table>
	          <tr>
	              <th>问题</th>
	              <th>过程（时间从上往下）</th>
	              <th>现象</th>
	          </tr>
	          <tr><td><strong>脏读</strong><br>Dirty Read</td><td>事务 A 把余额改成 1200（未提交）<br>事务 B 读到 1200<br>事务 A 回滚，余额回到 1000</td><td>B 读到了别人<strong>还没提交</strong>的数据，而它后来被撤销了</td></tr>
	          <tr><td><strong>不可重复读</strong><br>Non-Repeatable Read</td><td>事务 B 第一次读余额 = 1000<br>事务 A 把余额改成 1200 并提交<br>事务 B 再读同一条记录 = 1200</td><td>同一个事务里两次读<strong>同一行</strong>，结果不一样（针对 UPDATE）</td></tr>
	          <tr><td><strong>幻读</strong><br>Phantom Read</td><td>事务 B 统计订单数 = 100 条<br>事务 A 插入一条新订单并提交<br>事务 B 再统计 = 101 条</td><td>两次按相同条件统计，<strong>行数</strong>变了（针对 INSERT，读到的范围像闹鬼）</td></tr>
	      </table>
	      <p>这三个问题都能亲手复现——开两个终端窗口，各自连上 MySQL，按时间线交替执行（这就是隔离级别实验的标准做法）：</p>
	      <pre><code class="language-sql">-- 会话 A 与会话 B 都执行：
SET SESSION TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;   -- 最低级别下能亲眼看到脏读

-- 时间线：
-- A: BEGIN; UPDATE account SET balance = 1200 WHERE id = 1;   （未提交）
-- B: SELECT balance FROM account WHERE id = 1;                （读到 1200！脏读）
-- A: ROLLBACK;                                                （1200 从未真实存在）
-- B: 再读 → 1000，刚才读到的是"幻觉值"</code></pre>
	      <p>脏读最危险（数据根本是假的），所以任何隔离级别都禁止它；不可重复读和幻读要不要禁止，取决于业务能接受多大的"时间一致性"。</p>

	      <h2>4. 四个隔离级别</h2>
	      <p>SQL 标准用四个隔离级别在"正确性"和"并发性"之间做取舍：</p>
	      <table>
	          <tr>
	              <th>隔离级别</th>
	              <th>脏读</th>
	              <th>不可重复读</th>
	              <th>幻读</th>
	              <th>说明</th>
	          </tr>
	          <tr><td>READ UNCOMMITTED 读未提交</td><td>可能</td><td>可能</td><td>可能</td><td>几乎不用</td></tr>
	          <tr><td>READ COMMITTED 读已提交（RC）</td><td>不会</td><td>可能</td><td>可能</td><td>Oracle / PostgreSQL 的默认级别</td></tr>
	          <tr><td><strong>REPEATABLE READ 可重复读（RR）</strong></td><td>不会</td><td>不会</td><td>基本不会*</td><td><strong>InnoDB 的默认级别</strong></td></tr>
	          <tr><td>SERIALIZABLE 串行化</td><td>不会</td><td>不会</td><td>不会</td><td>读也加锁，并发最差</td></tr>
	      </table>
	      <p>* MySQL 的 RR 比 SQL 标准强：它把幻读也"基本"解决了（第 6 节说清楚"基本"二字的含义）。查看与修改隔离级别：</p>
	      <pre><code class="language-sql">SHOW VARIABLES LIKE 'transaction_isolation';   -- 默认 REPEATABLE-READ

SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;  -- 当前会话改为 RC</code></pre>
	      <p>很多互联网公司（如早期阿里巴巴规范）会把默认级别调成 RC：行锁更简单（没有间隙锁）、并发更好，代价是自己接受幻读。两种选择都有道理，关键是<strong>知道自己在用什么</strong>。</p>

	      <h2>5. MVCC：不加锁的"时光机"</h2>
	      <p>如果读也加锁、写也加锁，读会阻塞写、写会阻塞读，并发就死了。InnoDB 的答案是 <strong>MVCC（多版本并发控制）</strong>：给每一行保留多个历史版本，让读操作沿着版本链找到"自己该看的那个版本"，从而做到<strong>读不加锁、读写不冲突</strong>。</p>
	      <h3>5.1 隐藏列与版本链</h3>
	      <p>InnoDB 每行数据背后都藏着两个对本篇最重要的隐藏列：</p>
	      <ul>
	          <li><code>db_trx_id</code>：最近一次修改（插入/更新）这行的事务 ID；</li>
	          <li><code>db_roll_ptr</code>：回滚指针，指向这行在 undo log 里的上一个版本。</li>
	      </ul>
	      <p>每次更新一行，旧版本会被拷进 undo log，新版本通过 roll_ptr 指向旧版本——一串版本从新到旧串成<strong>版本链</strong>：</p>
	      <pre><code class="language-plaintext">最新行（trx_id=300, balance=900）
   │ roll_ptr
   ▼
旧版本（trx_id=200, balance=1000）        ← 都存在 undo log 里
   │ roll_ptr
   ▼
旧版本（trx_id=100, balance=1100）</code></pre>
	      <h3>5.2 ReadView：拍下"现在还有谁没提交"</h3>
	      <p>读操作发起时，会生成一份 <strong>ReadView</strong>，本质是当时"还没提交的事务列表"，包含四个字段：</p>
	      <ul>
	          <li><code>m_ids</code>：生成时刻所有活跃（未提交）事务的 ID 集合；</li>
	          <li><code>min_trx_id</code>：m_ids 里最小的；</li>
	          <li><code>max_trx_id</code>：下一个将要分配的事务 ID（不是 m_ids 的最大值）；</li>
	          <li><code>creator_trx_id</code>：当前事务自己。</li>
	      </ul>
	      <p>可见性判断就是一个四叉流程：</p>
	      <pre><code class="language-plaintext">取版本链上某个版本的 trx_id：
  ├── == creator_trx_id ？  → 可见（自己改的）
  ├── &lt; min_trx_id ？        → 可见（ReadView 之前就提交了）
  ├── &gt;= max_trx_id ？       → 不可见（ReadView 之后才开启的事务）
  └── 在 min~max 之间：在 m_ids 里 → 不可见（还没提交）
                      不在 m_ids 里 → 可见（已提交）
  ▼ 不可见时：沿 roll_ptr 找上一版本，重新走一遍判断</code></pre>
	      <p>直到找到一个可见的版本为止。这就是"可重复读"字面意思的实现：<strong>RC 和 RR 的唯一区别，就是 ReadView 的生成时机</strong>——RC 每次 SELECT 都生成新的（所以能读到别人刚提交的，出现不可重复读）；RR 只在事务第一次 SELECT 时生成一次、之后一直复用（所以整个事务看到的数据都是同一个时刻的切面）。想验证？两个会话都开 RR，A 先读一次（生成 ReadView），B 改数据并提交，A 再读——还是旧值。这就是"可重复"。</p>

	      <h2>6. RR 下的幻读：解决了，但没完全解决</h2>
	      <p>读分两种，防幻读的手段也分两条线：</p>
	      <ul>
	          <li><strong>快照读</strong>（普通 SELECT）：靠 MVCC。第一次读拍下 ReadView，之后别人插了新行也看不见，天然不幻。</li>
	          <li><strong>当前读</strong>（SELECT ... FOR UPDATE / FOR SHARE、UPDATE、DELETE、INSERT——要读"最新已提交版本"的操作）：靠 <strong>Next-Key Lock</strong>（下一节的锁）把目标范围锁死，别人插不进来。</li>
	      </ul>
	      <p>但两条线<strong>混用</strong>时有个经典的漏网场景：</p>
	      <pre><code class="language-sql">-- 事务 A（RR）
SELECT * FROM t WHERE score = 60;            -- 快照读，返回 3 条

-- 事务 B：INSERT 一条 score=60 的新行并提交

-- 事务 A
UPDATE t SET remark = 'x' WHERE score = 60;  -- UPDATE 是当前读！B 插的行也被更新了
SELECT * FROM t WHERE score = 60;            -- 这次快照读……返回 4 条，幻读了</code></pre>
	      <p>UPDATE 是当前读，把 B 插入的行也改了——而改过的行 trx_id 变成了自己，ReadView 判定"可见"。于是又幻了。结论：<strong>RR 大幅缓解了幻读，但要彻底避免，用 FOR UPDATE 提前锁定范围，或者干脆上 SERIALIZABLE</strong>。</p>

	      <h2>7. InnoDB 锁体系全景</h2>
	      <h3>7.1 全局锁</h3>
	      <p><code>FLUSH TABLES WITH READ LOCK</code>——整库只读，用于物理备份。InnoDB 场景下更好的选择是 <code>mysqldump --single-transaction</code>：利用 MVCC 的一致性视图导出，全程不锁业务表。</p>
	      <h3>7.2 表级锁</h3>
	      <ul>
	          <li><strong>表锁</strong>：<code>LOCK TABLES t READ / WRITE</code>，InnoDB 时代很少用。</li>
	          <li><strong>元数据锁（MDL）</strong>：增删改查自动加 MDL 读锁，DDL（改表结构）加 MDL 写锁，读写互斥。经典事故时间线：<strong>① 一个长事务开着没提交（持有 MDL 读锁）→ ② DBA 执行 ALTER TABLE（等 MDL 写锁）→ ③ 之后所有新查询也排队等 MDL 写锁后面 → 整张表"假死"</strong>。做表结构变更前先确认没有长事务，或给 ALTER 设 <code>lock_wait_timeout</code> 让它拿不到锁就先放弃。</li>
	          <li><strong>意向锁（IS / IX）</strong>：表级的"预告牌"。事务给某行加行锁前，先在表上留一个意向标记，这样想加表锁的事务看一眼表就知道"里面有人"，不用逐行检查行锁。兼容矩阵（✓ 兼容 / ✗ 冲突）：</li>
	      </ul>
	      <table>
	          <tr><th></th><th>IS</th><th>IX</th><th>S 表锁</th><th>X 表锁</th></tr>
	          <tr><td><strong>IS</strong></td><td>✓</td><td>✓</td><td>✓</td><td>✗</td></tr>
	          <tr><td><strong>IX</strong></td><td>✓</td><td>✓</td><td>✗</td><td>✗</td></tr>
	          <tr><td><strong>S</strong></td><td>✓</td><td>✗</td><td>✓</td><td>✗</td></tr>
	          <tr><td><strong>X</strong></td><td>✗</td><td>✗</td><td>✗</td><td>✗</td></tr>
	      </table>
	      <p>意向锁之间全兼容（都是"预告"），只挡真正的表锁，对业务无感——它是引擎内部的效率机制，你永远不会手动碰到它。</p>
	      <h3>7.3 行级锁（RR 下）</h3>
	      <p>行锁是加在<strong>索引记录</strong>上的，共三种形态：</p>
	      <table>
	          <tr>
	              <th>锁</th>
	              <th>范围</th>
	              <th>作用</th>
	          </tr>
	          <tr><td>Record Lock 记录锁</td><td>单条索引记录</td><td>锁住已存在的行</td></tr>
	          <tr><td>Gap Lock 间隙锁</td><td>两条记录之间的开区间，如 (5, 10)</td><td>锁住"空隙"，<strong>防止别人插入新行</strong>（防幻读的核心）</td></tr>
	          <tr><td>Next-Key Lock</td><td>间隙 + 右端记录的左开右闭区间，如 (5, 10]</td><td>InnoDB 加行锁的默认形态：既锁记录又锁间隙</td></tr>
	      </table>
	      <p><strong>加锁规则速查</strong>（等值/范围 × 唯一/普通索引的四种组合，RR 下）：</p>
	      <table>
	          <tr>
	              <th>查询</th>
	              <th>加锁</th>
	          </tr>
	          <tr><td>唯一索引等值命中</td><td>退化为纯 Record Lock（就是那一行）</td></tr>
	          <tr><td>唯一索引等值未命中</td><td>退化为纯 Gap Lock（锁两侧之间的空隙）</td></tr>
	          <tr><td>普通索引等值</td><td>Next-Key Lock，并向右扫到第一个不满足的值再补一个 Gap Lock</td></tr>
	          <tr><td>范围查询</td><td>沿途全部 Next-Key Lock（边界细节视唯一性而定）</td></tr>
	      </table>
	      <p>间隙锁演示：表里主键有 1、5、10 三个值。</p>
	      <pre><code class="language-sql">-- 事务 A
SELECT * FROM t WHERE id = 7 FOR UPDATE;   -- 7 不存在，加 Gap Lock (5, 10)
-- 事务 B
INSERT INTO t VALUES (8, ...);             -- 被阻塞，直到 A 提交或回滚</code></pre>
	      <p>间隙锁是"别人防我、我也防别人"的双向机制——两个事务持有重叠间隙的 Gap Lock 不冲突，但都插不进去，这也是死锁的高发来源之一。另外插入操作本身有<strong>插入意向锁</strong>（Insert Intention Lock）：插入前先在目标间隙"登记意向"，与 Gap Lock 冲突会等待，彼此之间不冲突（不同位置可并行插入）。</p>
	      <h3>7.4 最惨烈的坑：行锁没走索引</h3>
	      <pre><code class="language-sql">-- name 列上没有索引！
UPDATE t SET score = 0 WHERE name = '张三';</code></pre>
	      <p>行锁锁的是索引记录，这条 UPDATE 走不了索引，只能<strong>全表扫描</strong>——扫描路径上每条记录都会被加锁（RR 下还带间隙）。效果等同于锁全表。所以那句老话在这里再强调一遍：<strong>UPDATE / DELETE 的 WHERE 条件务必走索引</strong>，锁的粒度由索引决定。</p>

	      <h2>8. 死锁：两个人互相等</h2>
	      <pre><code class="language-sql">-- 事务 A                      -- 事务 B
UPDATE account ... WHERE id=1;  UPDATE account ... WHERE id=2;
UPDATE account ... WHERE id=2;  UPDATE account ... WHERE id=1;
-- A 锁着 1 等 2，B 锁着 2 等 1 → 死锁</code></pre>
	      <p>InnoDB 默认开启<strong>死锁检测</strong>（innodb_deadlock_detect）：发现等待环就主动回滚其中代价较小的一方（undo 量少的那位），另一方继续；同时有 <code>innodb_lock_wait_timeout</code>（默认 50 秒）做兜底。死锁现场怎么看：</p>
	      <pre><code class="language-sql">SHOW ENGINE INNODB STATUS;
-- 找 LATEST DETECTED DEADLOCK 段：
-- *** (1) TRANSACTION:   事务 1 正在做什么、持有哪些锁
-- *** (1) WAITING FOR:   事务 1 在等哪个索引的哪条记录
-- *** (2) TRANSACTION:   事务 2 的对称信息
-- 两边 "HOLDS THE LOCK" 与 "WAITING FOR" 交叉的地方就是死锁环</code></pre>
	      <p>避免死锁的实践：</p>
	      <ul>
	          <li><strong>固定加锁顺序</strong>：全系统都先锁 id 小的再锁 id 大的，环就成不了；</li>
	          <li><strong>事务尽量小</strong>：锁持有时间短，碰撞概率低；</li>
	          <li><strong>WHERE 走索引</strong>：避免锁放大（见 7.4）；</li>
	          <li><strong>应用层捕获 1213 错误重试</strong>：死锁被回滚不是异常状态，重试是标准动作；</li>
	          <li>并发极高且能接受幻读时，<strong>降级到 RC</strong>：没有间隙锁，死锁概率显著下降。</li>
	      </ul>

	      <h2>9. 长事务：最容易被低估的性能杀手</h2>
	      <p>MVCC 的版本链要靠"还在跑的事务"维系：只要事务不提交，它开始之前的所有旧版本都不能清理。于是一个跑几小时的长事务会带来：</p>
	      <ul>
	          <li><strong>undo 膨胀</strong>：历史版本堆积，undo 表空间暴涨；</li>
	          <li><strong>查询变慢</strong>：别人的读可能要沿着超长的版本链一路回溯；</li>
	          <li><strong>锁持有过久</strong>：MDL、行锁一直占着，DDL 和其他写全部排队；</li>
	          <li><strong>回滚巨慢</strong>：事务越大，崩溃后回滚的时间越长。</li>
	      </ul>
	      <p>排查命令（找执行时间超过 60 秒的事务）：</p>
	      <pre><code class="language-sql">SELECT trx_id, trx_started, trx_mysql_thread_id
FROM information_schema.innodb_trx
WHERE trx_started &lt; NOW() - INTERVAL 60 SECOND;</code></pre>
	      <p>应用层的对应做法：<strong>事务里不要混入 RPC 调用、消息发送这类慢操作</strong>，先把数据备齐再开事务。一条实用经验：事务的长度应该用"毫秒级"衡量，任何超过一秒的事务都值得问一句"里面在等什么"。</p>

	      <h2>10. 当前读实战：FOR UPDATE 的正确姿势</h2>
	      <p>补一个高频实操——秒杀/库存扣减这类"查出来再改"的场景，必须用当前读把查和改成原子动作：</p>
	      <pre><code class="language-sql">-- ❌ 错误：两次交互之间没有锁，并发下两个事务都可能读到库存 1，都扣减 → 超卖
SELECT stock FROM product WHERE id = 1;              -- 普通读（快照）
UPDATE product SET stock = stock - 1 WHERE id = 1;   -- 另一个事务已经先扣过了

-- ✓ 方式一：FOR UPDATE 当前读，查询时就锁行
BEGIN;
SELECT stock FROM product WHERE id = 1 FOR UPDATE;   -- 行锁，其他事务的读挂起
-- 应用层判断 stock &gt; 0 后：
UPDATE product SET stock = stock - 1 WHERE id = 1;
COMMIT;

-- ✓ 方式二（更简）：条件更新一行搞定，靠 WHERE 保证原子性
UPDATE product SET stock = stock - 1
WHERE id = 1 AND stock &gt; 0;                          -- 影响行数 = 0 就是没抢到</code></pre>
	      <p>方式二更推荐——不显式开事务、锁持有时间最短，把"判断 + 扣减"压缩进一条原子语句，这是并发扣减的标准写法。</p>

	      <h2>小结</h2>
	      <p>一张表收束全篇：<strong>ACID 靠 undo（原子）+ redo（持久）+ 锁与 MVCC（隔离）共同实现；MVCC 用版本链 + ReadView 让读不加锁，RC 与 RR 的区别只在 ReadView 的生成时机；RR 下幻读靠"快照读 MVCC + 当前读 Next-Key Lock"双线防守，混用仍有边角；行锁加在索引上，无索引等于锁全表；并发扣减用条件 UPDATE 一条语句解决</strong>。</p>
	      <p>undo 和 redo 这两个配角已经露了脸，下一篇就让它们当主角：<a href="#/notes/mysql-logs">《MySQL 日志系统：一条 UPDATE 的完整旅程》</a>——一条 UPDATE 从进内存到落盘，undo log、redo log、binlog 是怎么接力配合的。</p>`;export{t as default};

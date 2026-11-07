// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>MySQL 日志系统：一条 UPDATE 的完整旅程</h1>

	      <p>上一篇<a href="#/notes/mysql-txn-lock">《事务与锁》</a>里，undo log 和 redo log 已经多次出镜。这篇让它们当主角，把 MySQL 最重要的三大日志讲清楚，最后用一条 UPDATE 语句的完整旅程把所有机制串起来。</p>

	      <h2>1. 为什么需要日志</h2>
	      <p>直接改磁盘太慢（随机 IO），所以 InnoDB 的写路径是<strong>先改内存里的 Buffer Pool，再找时机批量刷回磁盘</strong>。问题是：数据页还在内存里、还没来得及刷盘时宕机了怎么办？"已提交的数据不能丢"这条底线，就得靠日志来守。三大日志各司其职：</p>
	      <table>
	          <tr>
	              <th>日志</th>
	              <th>所属层</th>
	              <th>内容</th>
	              <th>写入方式</th>
	              <th>核心作用</th>
	          </tr>
	          <tr><td><strong>undo log</strong></td><td>InnoDB 引擎层</td><td>逻辑日志：反向操作（改前镜像）</td><td>随数据修改写入</td><td>回滚、MVCC 版本链</td></tr>
	          <tr><td><strong>redo log</strong></td><td>InnoDB 引擎层</td><td>物理日志：某页做了什么物理改动</td><td><strong>循环写</strong>（固定大小文件）</td><td>崩溃恢复，保证持久性</td></tr>
	          <tr><td><strong>binlog</strong></td><td>MySQL Server 层</td><td>逻辑日志：SQL 或行变更</td><td><strong>追加写</strong>（写满换新文件）</td><td>主从复制、按时间点恢复</td></tr>
	      </table>
	      <p>注意分层：undo / redo 是 InnoDB 的私有日志，binlog 是 Server 层的日志——所以任何引擎都有 binlog，而 redo / undo 只有 InnoDB 有。这也是 MySQL 架构里"引擎可替换"带来的必然分工。</p>

	      <h2>2. undo log：管"过去"</h2>
	      <p>undo log 记录的是<strong>逻辑上的反向操作</strong>：INSERT 对应 DELETE，DELETE 对应 INSERT，UPDATE 对应反向 UPDATE。作用有两个：</p>
	      <ul>
	          <li><strong>回滚</strong>：事务失败或手动 ROLLBACK 时，按 undo log 逆序撤销。这就是原子性的实现。</li>
	          <li><strong>MVCC 版本链</strong>：更新前的旧版本存进 undo log，行的 roll_ptr 指过去，读操作才能回溯到"自己该看的版本"（上一篇讲过）。</li>
	      </ul>
	      <p>一个细节：INSERT 的 undo 在事务提交后就可以直接删（没有活跃事务会去读一个凭空出现的新行）；而 UPDATE / DELETE 的 undo 要保留到<strong>没有任何事务需要访问这个旧版本</strong>为止——这也是长事务导致 undo 膨胀的原因。</p>

	      <h2>3. redo log：管"未来"（崩溃恢复）</h2>
	      <p>如果每次提交都把脏页刷回磁盘，随机 IO 会把性能拖垮。InnoDB 的方案叫 <strong>WAL（Write-Ahead Logging）</strong>：<strong>先顺序写日志，再择机刷数据页</strong>。顺序写日志远快于随机写数据页，性能问题解决；宕机时重放 redo log 就能把没来得及刷盘的改动恢复出来——这就是 crash-safe 能力。</p>
	      <p>redo log 是固定大小的文件组（ib_logfile0、ib_logfile1……），<strong>循环写</strong>：</p>
	      <pre><code class="language-plaintext">  write pos                                checkpoint
      ↓                                        ↓
  ┌────────────────────────────────────────────┐
  │ ███████████░░░░░░░░░░░░░░░░░░░░██████████ │   redo log 文件组
  └────────────────────────────────────────────┘
    █ 已记录、待刷盘      ░ 可覆盖的空间

  write pos：当前写到的位置，写满一圈就从头再来
  checkpoint：已刷盘推进到的位置，之前的日志可以覆盖
  两指针之间的空档 = 还能写的余量；write pos 追上 checkpoint 时必须停下刷盘</code></pre>
	      <p>提交时机由参数 <code>innodb_flush_log_at_trx_commit</code> 控制，三档安全与性能的取舍：</p>
	      <table>
	          <tr>
	              <th>取值</th>
	              <th>提交时行为</th>
	              <th>宕机风险</th>
	          </tr>
	          <tr><td>0</td><td>只写内存，每秒刷一次盘</td><td>可能丢约 1 秒的事务</td></tr>
	          <tr><td><strong>1（默认）</strong></td><td>每次提交都写入并刷盘（fsync）</td><td>不丢已提交事务，最安全</td></tr>
	          <tr><td>2</td><td>提交时写到操作系统页缓存，每秒 fsync</td><td>MySQL 进程挂不丢，机器断电可能丢约 1 秒</td></tr>
	      </table>
	      <p>金融类业务保持默认的 1；能容忍极端情况丢 1 秒日志的高写入场景，2 是常见的性能换法。</p>

	      <h2>4. binlog：管"远方"（复制与恢复）</h2>
	      <p>binlog 是 Server 层日志，<strong>所有引擎共用</strong>，追加写不覆盖。它记录逻辑变更，有三种格式：</p>
	      <table>
	          <tr>
	              <th>格式</th>
	              <th>记录内容</th>
	              <th>优点 / 风险</th>
	          </tr>
	          <tr><td>STATEMENT</td><td>SQL 语句原文</td><td>体积小；但 NOW()、UUID()、无 ORDER BY 的 LIMIT 这类不确定因素会让主从各执行出不同结果</td></tr>
	          <tr><td><strong>ROW（5.7.7 起默认）</strong></td><td>行的前后镜像（改了哪几行、改成什么）</td><td>精确一致，主从安全；代价是批量 UPDATE 会记录大量行镜像，体积大</td></tr>
	          <tr><td>MIXED</td><td>默认用 STATEMENT，遇不确定函数自动切 ROW</td><td>折中方案</td></tr>
	      </table>
	      <p>两大用途：<strong>主从复制</strong>（主库写 binlog → 从库拉取重放，从库落盘前暂存的中转日志叫 relay log）；<strong>数据恢复</strong>（全量备份 + 之后时间段的 binlog 重放，把库恢复到任意时间点——比如误删表之后、删表语句之前的那一刻）。</p>
	      <p>redo log 和 binlog 容易混，一张表分清楚：</p>
	      <table>
	          <tr>
	              <th></th>
	              <th>redo log</th>
	              <th>binlog</th>
	          </tr>
	          <tr><td>归属</td><td>InnoDB 引擎层</td><td>Server 层（所有引擎）</td></tr>
	          <tr><td>内容</td><td>物理日志（某页怎么改的）</td><td>逻辑日志（SQL / 行变更）</td></tr>
	          <tr><td>写法</td><td>固定大小，循环写</td><td>追加写，写满换新文件</td></tr>
	          <tr><td>用途</td><td>崩溃恢复（对内）</td><td>复制、时间点恢复（对外）</td></tr>
	      </table>

	      <h2>5. 两阶段提交：让两本账对得上</h2>
	      <p>一次更新既要写 redo log 又要写 binlog，两份日志必须一致，否则主从就会分叉。拆开想就明白为什么要"两阶段"：</p>
	      <ul>
	          <li><strong>先写 redo 后写 binlog</strong>：redo 写完宕机，binlog 还没写。恢复后主库有这条数据，从库没有——主从不一致。</li>
	          <li><strong>先写 binlog 后写 redo</strong>：binlog 写完宕机，redo 没写。恢复后主库没有这条数据，但 binlog 已被从库重放——反过来不一致。</li>
	      </ul>
	      <p>解法是把 redo log 的提交拆成两步，binlog 夹在中间：</p>
	      <ol>
	          <li><strong>prepare</strong>：写 redo log，标记为 prepare 状态；</li>
	          <li>写 binlog；</li>
	          <li><strong>commit</strong>：写 redo log 的 commit 标记。</li>
	      </ol>
	      <p>崩溃恢复时的裁决规则：redo 处于 prepare 状态时，去查对应的 binlog——<strong>binlog 完整就提交，不完整就回滚</strong>。无论宕机发生在哪一步之间，两本账都能对齐。这套机制本质上引用了分布式事务里的 XA 思想，所以也叫 InnoDB 的内部 XA。高频写入下每笔事务两阶段的开销，还能通过<strong>组提交</strong>（多个事务的日志攒着一起刷）摊薄。</p>

	      <h2>6. 一条 UPDATE 的完整旅程</h2>
	      <pre><code class="language-sql">UPDATE account SET balance = balance - 100 WHERE id = 1;</code></pre>
	      <p>在 InnoDB（RR，默认参数）下，这条语句按下述顺序走完一生：</p>
	      <ol>
	          <li>连接器校验权限，分析器解析 SQL，优化器决定走主键索引定位 id=1；</li>
	          <li>在 Buffer Pool 里找到（或从磁盘读入）id=1 所在的数据页，对行加<strong>记录锁</strong>；</li>
	          <li>把修改前的旧版本写入 <strong>undo log</strong>（原子性与 MVCC 的底气）；</li>
	          <li>在 Buffer Pool 中修改行数据（balance 减 100），这一页成为<strong>脏页</strong>；</li>
	          <li>写入 <strong>redo log</strong>，进入 prepare 状态；</li>
	          <li>写入 <strong>binlog</strong>（默认 ROW 格式，记录这一行的前后镜像）；</li>
	          <li>redo log 打上 commit 标记，<strong>两阶段提交</strong>完成，事务可提交；</li>
	          <li>释放行锁；脏页在系统不忙时由后台线程刷回磁盘（WAL 让"提交"不必等这一步）。</li>
	      </ol>
	      <p>中途任何一步宕机，都能靠 redo / binlog 的两阶段状态恢复到一致点。这就是那句"commit 成功 = 这笔变更绝不会丢"背后的完整保障链。</p>

	      <h2>7. 其余日志一览</h2>
	      <table>
	          <tr>
	              <th>日志</th>
	              <th>作用</th>
	          </tr>
	          <tr><td>慢查询日志（slow log）</td><td>记录超过 long_query_time 的 SQL，调优的第一入口（下一篇实战用它）</td></tr>
	          <tr><td>错误日志（error log）</td><td>启动 / 运行报错，排障第一个要看的地方</td></tr>
	          <tr><td>通用查询日志（general log）</td><td>记录所有到达的 SQL，调试用，量太大平时关闭</td></tr>
	          <tr><td>relay log</td><td>从库上暂存主库 binlog 的中转文件，重放完即清理</td></tr>
	      </table>

	      <h2>小结</h2>
	      <p>用一句话记住三大日志的分工：<strong>undo 管过去（回滚与版本链），redo 管未来（崩溃恢复），binlog 管远方（复制与恢复）</strong>；两阶段提交则是把引擎层的 redo 和 Server 层的 binlog 绑成一条绳的保险结。</p>
	      <p>机制篇到此收官。最后一篇落地到实战：<a href="#/notes/mysql-tuning">《MySQL 性能调优与 SQL 优化实战》</a>——EXPLAIN 怎么读、慢 SQL 怎么定位、深分页和 join 怎么写。</p>`;

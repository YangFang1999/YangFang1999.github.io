// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>MySQL 日志系统：一条 UPDATE 的完整旅程</h1>

	      <p>上一篇<a href="#/notes/mysql-txn-lock">《事务与锁》</a>里，undo log 和 redo log 已经多次出镜。这篇让它们当主角，把 MySQL 最重要的三大日志讲清楚——每一层的文件布局、刷盘策略、崩溃恢复的裁决规则——最后用一条 UPDATE 语句的完整旅程把所有机制串起来。</p>

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
	      <p>注意分层：undo / redo 是 InnoDB 的私有日志，binlog 是 Server 层的日志——所以任何引擎都有 binlog，而 redo / undo 只有 InnoDB 有。这也是 MySQL 架构里"引擎可替换"带来的必然分工：Server 层只管"记录了什么"，引擎层负责"怎么把它做实"。</p>

	      <h2>2. undo log：管"过去"</h2>
	      <p>undo log 记录的是<strong>逻辑上的反向操作</strong>：INSERT 对应 DELETE，DELETE 对应 INSERT，UPDATE 对应反向 UPDATE（记下改前值）。作用有两个：</p>
	      <ul>
	          <li><strong>回滚</strong>：事务失败或手动 ROLLBACK 时，按 undo log 逆序撤销。这就是原子性的实现。</li>
	          <li><strong>MVCC 版本链</strong>：更新前的旧版本存进 undo log，行的 roll_ptr 指过去，读操作才能回溯到"自己该看的版本"（<a href="#/notes/mysql-txn-lock">事务篇第 5 节</a>）。</li>
	      </ul>
	      <p>一个重要细节：INSERT 的 undo 在事务提交后就可以直接删（没有活跃事务会去读一个凭空出现的新行）；而 UPDATE / DELETE 的 undo 要保留到<strong>没有任何事务需要访问这个旧版本</strong>为止。清理工作由后台的 <strong>purge 线程</strong>负责：它顺着历史链判断"最老的活跃事务从哪开始"，之前的版本才能安全删除——这也是长事务导致 undo 膨胀的机制根源：一个几小时不提交的事务，会让 purge 线程干等，undo 越积越多。</p>

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
	      <p>"追上就得停"解释了一个现象：如果数据页刷盘太慢（比如磁盘性能差 + 一次大批量写入），checkpoint 推进不动，整个写入会被卡住——<strong>redo log 的大小要按写入压力配置</strong>（8.0.30 起用 <code>innodb_redo_log_capacity</code>，常见给 1~4GB），太小会频繁触发"追尾停顿"。</p>
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
	      <p>金融类业务保持默认的 1；能容忍极端情况丢 1 秒日志的高写入场景，2 是常见的性能换法。这个参数和 binlog 的 <code>sync_binlog</code> 并称"双 1 配置"——两者都设 1 是最安全组合，也是默认值；压测时常见把双 1 放宽换吞吐，属于拿可靠性换性能的明确交易。</p>

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
	      <p>生产建议默认 <strong>ROW</strong>：它还是很多周边生态的前提——Canal 类 CDC 工具解析 binlog 做数据同步、闪回工具按行镜像回滚，都要求 ROW 格式。</p>
	      <p>两大用途：<strong>主从复制</strong>（第 6 节展开）和 <strong>数据恢复</strong>。恢复的实操流程值得走一遍——"全量备份 + 之后时间段的 binlog 重放，把库恢复到任意时间点"（比如误删表之后、删表语句之前的那一刻）：</p>
	      <pre><code class="language-bash"># 1. 找到误删时间点之前的最近一次全量备份，先恢复
mysql -u root -p mydb &lt; backup_20261107.sql

# 2. 从 binlog 里定位误删语句的位置，重放"备份之后 ~ 误删之前"这一段
mysqlbinlog --start-datetime="2026-11-07 09:00:00" \
            --stop-datetime="2026-11-07 14:59:59" \
            binlog.000123 | mysql -u root -p mydb

# （平时记得开 log_bin 并保留足够天数的 binlog，不然这个方案无从谈起）</code></pre>
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
	      <p>一句话区分：<strong>redo 回答"这个页的这几字节改成什么"，binlog 回答"执行了什么变更"</strong>——前者只对本机恢复有用，后者能被别的实例重放。</p>

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
	      <p>崩溃恢复时的裁决规则：redo 处于 prepare 状态时，去查对应的 binlog——<strong>binlog 完整就提交，不完整就回滚</strong>。无论宕机发生在哪一步之间，两本账都能对齐。这套机制本质上引用了分布式事务里的 XA 思想，所以也叫 InnoDB 的内部 XA。</p>
	      <p>高频写入下每笔事务两次 fsync 的开销不小，<strong>组提交（group commit）</strong>负责摊薄：多个并发事务的 redo/binlog 攒成一批，一次 fsync 服务整组，并发越高摊得越薄。这也是为什么"单线程逐条写"和"并发批量写"的吞吐差距远超预期。</p>

	      <h2>6. 主从复制：binlog 的第一大事</h2>
	      <pre><code class="language-plaintext">主库                                  从库
  UPDATE ──► binlog ──(dump 线程推送)──► IO 线程 ──► relay log（中转日志）
                                                        │
                                     SQL 线程 ◄─────────┘
                                        │
                                        ▼
                                    重放 → 从库数据更新</code></pre>
	      <ul>
	          <li><strong>主库 dump 线程</strong>：binlog 有新事件就推给从库；</li>
	          <li><strong>从库 IO 线程</strong>：接收并写入本地 relay log（中转日志，重放完即清理）；</li>
	          <li><strong>从库 SQL 线程</strong>：读 relay log 重放。</li>
	      </ul>
	      <p><strong>主从延迟</strong>是这套架构最常见的痛点：从库重放是单线程排队（虽然 8.0 支持按库/按事务并行的 MTS），主库一次大批量写入（比如一条 UPDATE 改了 50 万行，ROW 格式下是 50 万个行事件）从库要重放好几分钟——期间从库读到的是旧数据。应对三板斧：大事务拆小（治本）、读写分离时"写后立刻读"强制走主库（治标）、监控 <code>SHOW SLAVE STATUS</code> 的 Seconds_Behind_Master 告警。8.0.26+ 的 GTID 模式（每个事务有全局唯一编号）则让搭建与故障切换省心很多，新集群建议直接开。</p>

	      <h2>7. 一条 UPDATE 的完整旅程</h2>
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

	      <h2>8. 其余日志一览</h2>
	      <table>
	          <tr>
	              <th>日志</th>
	              <th>作用</th>
	          </tr>
	          <tr><td>慢查询日志（slow log）</td><td>记录超过 long_query_time 的 SQL，调优的第一入口（<a href="#/notes/mysql-tuning">下一篇实战</a>用它）</td></tr>
	          <tr><td>错误日志（error log）</td><td>启动 / 运行报错，排障第一个要看的地方</td></tr>
	          <tr><td>通用查询日志（general log）</td><td>记录所有到达的 SQL，调试用，量太大平时关闭</td></tr>
	          <tr><td>relay log</td><td>从库上暂存主库 binlog 的中转文件，重放完即清理</td></tr>
	      </table>

	      <h2>9. 高频疑问 FAQ</h2>
	      <p>把面试和实战里最常被问到的几个问题集中回答一遍：</p>
	      <ul>
	          <li><strong>有了 binlog，为什么还要 redo log？</strong>——binlog 没有崩溃恢复能力：它是 Server 层的追加日志，只有"历史记录"，没有"哪些数据页还没刷盘"的进度信息（binlog 不知道 Buffer Pool 里什么是脏的）。redo log 带着checkpoint 机制精确知道"从哪恢复"。反过来 redo 也不能替代 binlog：它是物理日志且循环写会被覆盖，没法给从库重放，也没法按时间点恢复。</li>
	          <li><strong>为什么是 redo 两阶段提交，而不是给 binlog 做两阶段？</strong>——因为"内部 XA"的协调者必须是先写的那份日志。redo 是 InnoDB 内部事务的一部分，两阶段状态存在 redo 记录里最自然；且崩溃恢复是 InnoDB 自己的职责，裁决信息放在引擎内才能自圆其说。</li>
	          <li><strong>一条 UPDATE，undo / redo / binlog 谁先写？</strong>——undo 最先（改数据前必须留后路），然后 redo prepare，再 binlog，最后 redo commit（完整旅程见第 7 节）。</li>
	          <li><strong>逻辑日志和物理日志，恢复哪个快？</strong>——物理快（redo 是"某页某偏移改成什么"，重放即完成）；逻辑日志要逐条解析语义再执行（AOF 的重放同理）。这就是崩溃恢复用 redo、而跨机器复制用 binlog 的原因之一：物理日志绑机器，逻辑日志可移植。</li>
	          <li><strong>主从延迟的根因是什么？</strong>——从库 SQL 线程重放是排队执行（默认单线程），主库一次大批量变更（一条 UPDATE 改几十万行）从库要逐条重放。解法：大事务拆小 + 并行复制（MTS）+ "写后读"强制走主库兜底（第 6 节）。</li>
	      </ul>

	      <h2>10. 生产环境日志参数清单</h2>
	      <table>
	          <tr>
	              <th>参数</th>
	              <th>推荐值</th>
	              <th>说明</th>
	          </tr>
	          <tr><td>innodb_flush_log_at_trx_commit</td><td>1</td><td>redo 每次提交刷盘；放宽到 2 前想清楚能丢 1 秒</td></tr>
	          <tr><td>sync_binlog</td><td>1</td><td>binlog 每次提交刷盘；与 redo 合称"双 1"</td></tr>
	          <tr><td>innodb_redo_log_capacity</td><td>1~4G</td><td>太小会 checkpoint 追尾卡写入；8.0.30+ 参数</td></tr>
	          <tr><td>binlog_format</td><td>ROW</td><td>主从安全，CDC/闪回工具的前提</td></tr>
	          <tr><td>binlog_expire_logs_seconds</td><td>7~30 天</td><td>按备份策略定：恢复窗口 = 备份周期 + binlog 保留</td></tr>
	          <tr><td>log_bin</td><td>ON</td><td>不开 binlog，复制和 PITR 都无从谈起</td></tr>
	          <tr><td>innodb_undo_tablespaces</td><td>独立表空间</td><td>8.0 默认两个 undo 表空间，长事务膨胀时好观察好回收</td></tr>
	      </table>
	      <p>这七个参数就是日志系统的"全部旋钮"——大多数事故复盘到最后，都是"双 1 被放宽了"或"binlog 没开/保留太短"这一类配置问题。</p>

	      <h2>小结</h2>
	      <p>用一句话记住三大日志的分工：<strong>undo 管过去（回滚与版本链），redo 管未来（崩溃恢复），binlog 管远方（复制与恢复）</strong>；两阶段提交则是把引擎层的 redo 和 Server 层的 binlog 绑成一条绳的保险结，组提交负责把这条绳的成本摊薄，purge 线程负责在所有人都用不到旧版本之后打扫战场。</p>
	      <p>机制篇到此收官。最后一篇落地到实战：<a href="#/notes/mysql-tuning">《MySQL 性能调优与 SQL 优化实战》</a>——EXPLAIN 怎么读、慢 SQL 怎么定位、深分页和 join 怎么写。</p>`;

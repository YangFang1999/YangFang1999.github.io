const t=`	      <h1>Redis 缓存实战：从数据结构到缓存击穿解决方案</h1>

	      <p>Redis（Remote Dictionary Server）是目前最流行的内存数据库。它以极高的读写速度（单机 10 万+ QPS）和丰富的数据结构（String、Hash、List、Set、Sorted Set 等）成为后端开发中不可或缺的基础设施。但 Redis 用得不好反而会引入各种问题——缓存穿透、缓存击穿、缓存雪崩、数据不一致……本文从"为什么快"讲到数据结构的底层实现，再到 Spring Boot 集成、缓存三大问题、分布式锁与高可用方案。数据库侧的配套知识见 <a href="#/notes/mysql-basics">MySQL 基础</a>与 <a href="#/notes/mysql-index">MySQL 索引详解</a>。</p>

	      <h2>1. Redis 为什么这么快？</h2>
	      <ul>
	          <li><strong>纯内存操作：</strong>所有数据存在内存中，读写不涉及磁盘 I/O。内存访问是纳秒级，磁盘是毫秒级，差五个数量级——这是第一性原因。</li>
	          <li><strong>单线程模型：</strong>Redis 6.0 之前核心网络 I/O 和命令执行都是单线程的，没有锁竞争和上下文切换开销。6.0+ 引入了多线程 I/O（网络读写并行），但命令执行仍然是单线程——这也是"避免使用大 Key / O(n) 大命令"的根本原因：一个慢命令会阻塞后面所有请求。</li>
	          <li><strong>I/O 多路复用：</strong>使用 epoll（Linux）等技术，一个线程能同时监听多个网络连接。</li>
	          <li><strong>高效的数据结构：</strong>底层用 C 语言实现，数据结构经过精心优化（跳表、压缩列表/紧凑列表、渐进式 rehash 的哈希表）。</li>
	      </ul>
	      <p><strong>一句话：</strong>Redis 快是因为数据在内存、处理在单线程、I/O 多路复用三者叠加的结果。也正因为单线程，"别在 Redis 上跑慢命令"是使用铁律的第一条（<code>KEYS *</code> 在生产环境是禁词，要扫键用 <code>SCAN</code> 游标分批）。</p>

	      <h2>2. 五大基础数据类型及应用场景</h2>
	      <table>
	          <tr>
	              <th>类型</th>
	              <th>特点</th>
	              <th>典型场景</th>
	          </tr>
	          <tr>
	              <td><strong>String</strong></td>
	              <td>最基础，可以是字符串、数字、二进制</td>
	              <td>缓存对象（JSON 序列化的用户信息）、分布式锁、计数器</td>
	          </tr>
	          <tr>
	              <td><strong>Hash</strong></td>
	              <td>键值对集合，适合存储对象</td>
	              <td>用户信息（每个字段单独存取）、购物车、配置项</td>
	          </tr>
	          <tr>
	              <td><strong>List</strong></td>
	              <td>有序列表，支持从两端操作</td>
	              <td>消息队列、最新动态时间线、阻塞队列</td>
	          </tr>
	          <tr>
	              <td><strong>Set</strong></td>
	              <td>无序集合，自动去重，支持交集/并集/差集</td>
	              <td>标签系统、共同好友、抽奖去重、黑名单</td>
	          </tr>
	          <tr>
	              <td><strong>Sorted Set</strong></td>
	              <td>有序集合，每个元素带分数（score），按分数排序</td>
	              <td>排行榜、延迟队列、按时间排序的时间线</td>
	          </tr>
	      </table>
	      <p>选型口诀：<strong>"一个整体"用 String（整存整取 JSON），"要改其中一两个字段"用 Hash，"要排序"用 ZSet，"要集合运算"用 Set，"要先进先出"用 List</strong>。存 JSON 还是 Hash 的取舍在于读写粒度——整对象读写选 String（少一次网络往返），字段级高频更新选 Hash。另外 5 种高级类型值得知道名字：BitMap（签到）、HyperLogLog（基数估算）、GEO（附近的人）、Stream（消费组消息队列）、Bitfield。</p>

	      <h2>3. 基础命令实战</h2>
	      <pre><code class="language-bash"># String —— 最常用
SET user:1 '{"name":"Alice","age":25}'     # 设置
SET user:1 '{"name":"Alice"}' EX 3600     # 设置 + 过期时间（秒）
GET user:1                                  # 获取
DEL user:1                                  # 删除
INCR view_count:article:100                 # 原子递增（计数器）
SETNX lock:order:1001 "locked" EX 10       # SET if Not eXists（分布式锁）

# Hash —— 比 String 存 JSON 更灵活
HSET user:1 name "Alice" age "25" city "Beijing"
HGET user:1 name                           # 获取单个字段
HGETALL user:1                             # 获取所有字段和值
HDEL user:1 city                           # 删除字段
HINCRBY user:1 login_count 1              # 原子递增数值字段

# List —— 当做队列或栈
LPUSH queue:tasks "task1" "task2"          # 从左边推入
RPOP queue:tasks                            # 从右边弹出（FIFO 队列）
BLPOP queue:tasks 10                        # 阻塞弹出（BRPOP），等 10 秒
LRANGE timeline:user:1 0 9                # 最新 10 条（0 到 9）

# Set —— 去重 + 集合运算
SADD tags:post:1 "java" "spring" "redis"
SMEMBERS tags:post:1                       # 查看所有标签
SINTER tags:post:1 tags:post:2            # 两个文章的公共标签（交集）
SUNION tags:post:1 tags:post:2            # 两个文章的所有标签（并集）
SISMEMBER tags:post:1 "java"              # 判断是否存在

# Sorted Set —— 排行榜神器
ZADD leaderboard 1000 "alice" 800 "bob" 1200 "charlie"
ZRANGE leaderboard 0 -1 REV WITHSCORES    # 按分数降序排列
ZRANK leaderboard "alice"                  # alice 的排名（0-based）
ZSCORE leaderboard "alice"                 # alice 的分数
ZINCRBY leaderboard 50 "alice"            # 加 50 分
ZRANGEBYSCORE leaderboard (800 +inf LIMIT 0 10    # 分数区间查（( = 不含边界）

# 通用：过期与批量
EXPIRE user:1 600                  # 给已有 key 设置过期（秒）
TTL user:1                         # 查看剩余生存时间（-1 永久 / -2 不存在）
SCAN 0 MATCH user:* COUNT 100      # 渐进式扫键（替代禁词 KEYS *）</code></pre>

	      <h2>4. 底层数据结构：面试加分的部分</h2>
	      <h3>4.1 全局哈希表与渐进式 rehash</h3>
	      <p>Redis 的所有键值对装在一张大哈希表里（所以 <code>O(1)</code> 找 key）。扩容时如果一次性搬迁几百万个 key 会卡死单线程，于是用<strong>渐进式 rehash</strong>：同时持有新旧两张表，之后的每次增删改查<strong>顺带搬一小批</strong>，定时任务也搬——查询先查旧表再查新表，写入只写新表，直到旧表搬空释放。用"内存多占一份"换"响应不平滑劣化"，是单线程系统扩容的标准解法。</p>
	      <h3>4.2 ZSet 为什么用跳表而不是红黑树</h3>
	      <pre><code class="language-plaintext">Level 3:  head ────────────────────────────► 80
Level 2:  head ──────────► 40 ──────────────► 80
Level 1:  head ──► 20 ──► 40 ──► 60 ──► 80
（每个节点随机决定自己的层数；查找从高层向右走，走不动就下一层）</code></pre>
	      <p>ZSet 用<strong>跳表（skiplist）+ 哈希表</strong>双结构：跳表负责按分数的范围查询和排序（O(log n)），哈希表负责 member → score 的 O(1) 查分。为什么不用红黑树？实现简单、范围查询顺着底层链表走就行、还天然支持按排名计算（ZRANK 顺带数一下层索引）。这是一个"工程取舍优于理论最优"的经典案例。</p>
	      <h3>4.3 各类型的底层编码（小数据自动优化）</h3>
	      <table>
	          <tr>
	              <th>类型</th>
	              <th>小数据编码</th>
	              <th>大数据编码</th>
	          </tr>
	          <tr><td>Hash</td><td>listpack（连续内存，超省）</td><td>hashtable</td></tr>
	          <tr><td>List</td><td>quicklist（ziplist 组成的双向链表）</td><td>同左</td></tr>
	          <tr><td>Set</td><td>intset（全整数时）</td><td>hashtable</td></tr>
	          <tr><td>ZSet</td><td>listpack</td><td>skiplist + dict</td></tr>
	      </table>
	      <p>这就是"小对象自动压缩"：元素少且短时用紧凑结构省内存，超阈值自动转标准结构。<strong>生产启示：把大 Hash/List 拆小（如按 id 取模分桶）能显著省内存</strong>；用 <code>OBJECT ENCODING key</code> 可以亲眼看当前编码。</p>

	      <h2>5. 过期删除与内存淘汰：Key 是怎么"消失"的</h2>
	      <p>两个容易混淆的机制，面试高频：</p>
	      <p><strong>过期删除</strong>——到期的 key 怎么清：</p>
	      <ul>
	          <li><strong>惰性删除</strong>：key 到期后不立刻删，等下次被访问时检查并删除。省 CPU，但过期 key 可能长期占内存。</li>
	          <li><strong>定期删除</strong>：每隔一段时间随机抽一批设了 TTL 的 key 检查删除。两者配合，在 CPU 与内存之间取平衡。</li>
	      </ul>
	      <p><strong>内存淘汰</strong>——内存满了怎么清（<code>maxmemory</code> 触顶后按 <code>maxmemory-policy</code> 执行）：</p>
	      <table>
	          <tr>
	              <th>策略</th>
	              <th>行为</th>
	              <th>适用</th>
	          </tr>
	          <tr><td>noeviction（默认）</td><td>内存满后写操作直接报错</td><td>把 Redis 当存储用的场景</td></tr>
	          <tr><td>allkeys-lru</td><td>全部 key 里淘汰最久未使用的</td><td><strong>纯缓存场景首选</strong></td></tr>
	          <tr><td>volatile-lru</td><td>只在设了过期时间的 key 里淘汰</td><td>部分 key 是持久数据的场景</td></tr>
	          <tr><td>allkeys-random / volatile-random</td><td>随机淘汰</td><td>key 被访问概率基本一致时</td></tr>
	          <tr><td>volatile-ttl</td><td>优先淘汰剩余存活时间最短的</td><td>希望按 TTL 优先级让路</td></tr>
	          <tr><td>allkeys-lfu / volatile-lfu（4.0+）</td><td>按访问频率淘汰（LFU）</td><td>热点更集中的场景</td></tr>
	      </table>

	      <h2>6. 持久化：RDB 与 AOF</h2>
	      <p>内存数据库怕断电，持久化就是"落保险"：</p>
	      <table>
	          <tr>
	              <th></th>
	              <th>RDB（快照）</th>
	              <th>AOF（追加日志）</th>
	          </tr>
	          <tr><td>内容</td><td>某一时刻的全量数据二进制快照</td><td>每条写命令的文本记录</td></tr>
	          <tr><td>触发</td><td>手动 SAVE/BGSAVE，或按 save 规则定时（fork 子进程写）</td><td>每条写命令追加（appendfsync 控制刷盘频率）</td></tr>
	          <tr><td>恢复速度</td><td><strong>快</strong>（直接载入二进制）</td><td>慢（逐条重放命令）</td></tr>
	          <tr><td>数据安全</td><td>两次快照之间的数据可能丢</td><td><strong>最多丢 1 秒</strong>（everysec 配置下）</td></tr>
	          <tr><td>文件体积</td><td>小（紧凑）</td><td>大（还有 AOF 重写机制瘦身）</td></tr>
	      </table>
	      <p>生产推荐组合：<strong>RDB + AOF 同时开启</strong>——AOF 保数据安全，RDB 加速重启恢复（4.0+ 的混合持久化：AOF 重写时前半段用 RDB 格式，兼得两者）。顺带一提 fork：RDB 和 AOF 重写都靠 fork 子进程执行，利用操作系统的写时复制（COW）——主进程继续服务，子进程按 fork 瞬间的数据快照写盘；实例越大 fork 越慢（页表复制），这就是"Redis 单实例建议控制在 10GB 上下"的一个原因。</p>

	      <h2>7. Spring Boot 集成 Redis</h2>
	      <pre><code class="language-java">// 依赖 (pom.xml)
// spring-boot-starter-data-redis
// commons-pool2  (连接池)

// application.yml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: \${REDIS_PASSWORD}
      timeout: 3000ms
      lettuce:          # 默认客户端（比 Jedis 性能更好，响应式支持）
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 2

// Redis 配置类（设置序列化方式）
@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate&lt;String, Object&gt; redisTemplate(
            RedisConnectionFactory factory) {
        RedisTemplate&lt;String, Object&gt; template = new RedisTemplate&lt;&gt;();
        template.setConnectionFactory(factory);

        // Key 用 String 序列化（可读性好）
        template.setKeySerializer(new StringRedisSerializer());

        // Value 用 JSON 序列化（比 JDK 序列化省空间、可跨语言）
        Jackson2JsonRedisSerializer&lt;Object&gt; jsonSerializer =
            new Jackson2JsonRedisSerializer&lt;&gt;(Object.class);
        template.setValueSerializer(jsonSerializer);

        template.afterPropertiesSet();
        return template;
    }
}</code></pre>
	      <p>不配序列化时的经典现象：Redis-cli 里看到 value 是 <code>¬í\0...</code> 乱码——那是默认 JDK 序列化的字节头。缓存场景还有个更轻的选择：Spring Cache 注解（<code>@Cacheable("user")</code> / <code>@CacheEvict</code>），一行注解完成"查缓存 miss 则查库回填"和"改库删缓存"，简单场景比手写 RedisTemplate 干净得多。</p>

	      <h2>8. 缓存三大问题及解决方案</h2>
	      <p>这是 Redis 面试最爱问的题目，也是线上事故的高发区：</p>

	      <h3>问题一：缓存穿透</h3>
	      <p><strong>现象：</strong>查询一个<strong>根本不存在</strong>的数据，缓存里没有，数据库里也没有。每次请求都穿过缓存直接打到数据库。如果有人恶意用不存在的 ID 大量请求，数据库直接被打挂。</p>
	      <p><strong>解决方案：</strong></p>
	      <ul>
	          <li><strong>缓存空值：</strong>数据库查不到也往 Redis 存一个短过期时间的 null 值（如 5 分钟），下次请求就直接返回 null 不打数据库了。</li>
	          <li><strong>布隆过滤器（Bloom Filter）：</strong>在缓存前加一层布隆过滤器，它可以用很小的内存判断一个 key "一定不存在"或"可能存在"。先把所有合法的 ID 加载到布隆过滤器，请求来了先过过滤器——不存在的直接返回。</li>
	          <li><strong>入口校验：</strong>ID 格式合法性、参数范围在 Controller 层先挡一道，成本低收效快。</li>
	      </ul>

	      <h3>问题二：缓存击穿</h3>
	      <p><strong>现象：</strong>一个<strong>热点 Key</strong>（比如秒杀商品的库存）在过期的一瞬间，大量并发请求同时打到数据库——数据库瞬间压力暴增，可能直接崩溃。</p>
	      <p><strong>解决方案：</strong></p>
	      <ul>
	          <li><strong>互斥锁（Mutex Lock）：</strong>缓存过期后，只让一个线程去查数据库并回填缓存，其他线程等待。Spring Cache 的 <code>sync = true</code> 参数就是干这个的。</li>
	          <li><strong>逻辑过期：</strong>不设 Redis 的 TTL，而是在 Value 里存一个过期时间戳。获取时判断是否过期，过期了先返回旧数据，然后异步更新——用户永远能看到数据，不会阻塞。</li>
	          <li><strong>永不过期：</strong>对于极其热点的数据，干脆不设过期时间，通过后台任务异步更新。</li>
	      </ul>

	      <h3>问题三：缓存雪崩</h3>
	      <p><strong>现象：</strong><strong>大量 Key 在同一时间过期</strong>，或者 Redis 集群宕机，导致所有请求直接打到数据库，数据库可能直接崩溃，引发连锁反应。</p>
	      <p><strong>解决方案：</strong></p>
	      <ul>
	          <li><strong>过期时间加随机值：</strong>在基础过期时间上加上一个随机偏移（如 <code>TTL = 3600 + random(0, 600)</code>），避免大量 Key 同时过期。</li>
	          <li><strong>Redis 高可用：</strong>主从 + 哨兵，或者 Redis Cluster，保证 Redis 本身不单点故障。</li>
	          <li><strong>多级缓存：</strong>本地缓存（Caffeine）+ Redis + 数据库，每一层都有兜底。</li>
	          <li><strong>限流降级：</strong>用 Sentinel 或 Hystrix 对数据库访问做限流，超出后直接返回降级响应。</li>
	      </ul>
	      <p>三个问题一句话区分：<strong>穿透是"查不存在的"（缓存和库里都没有），击穿是"热点 key 过期瞬间"，雪崩是"大面积同时失效"——规模从单个 key 到全站递增</strong>。</p>

	      <h2>9. 分布式锁：从 SETNX 到 Redisson</h2>
	      <p>多实例部署时，JVM 内的 synchronized 失效，跨进程互斥要靠 Redis（或 ZooKeeper）。最朴素的实现一行：</p>
	      <pre><code class="language-bash">SET lock:order:1001 "uuid-xxx" NX EX 10   # NX 保证互斥，EX 防死锁，值唯一标识持有者</code></pre>
	      <p>但朴素实现有三个经典坑：</p>
	      <ol>
	          <li><strong>忘了设过期时间</strong>：持锁方宕机，锁永远不释放 → 全系统卡死。所以 NX 和 EX 必须<strong>同一条 SET 命令</strong>（分开两条命令中间可能宕机）。</li>
	          <li><strong>误删别人的锁</strong>：A 执行慢，锁到期自动释放并被 B 拿到；A 干完后 DEL，删掉的是 B 的锁。解决：<strong>value 存唯一标识，释放时用 Lua 脚本"检查是自己的才删"</strong>（GET + DEL 两步做不到原子，必须 Lua）：</li>
	      </ol>
	      <pre><code class="language-lua">-- unlock.lua：判断 + 删除的原子脚本
if redis.call("GET", KEYS[1]) == ARGV[1] then
    return redis.call("DEL", KEYS[1])
else
    return 0
end</code></pre>
	      <ol start="3">
	          <li><strong>业务超时长于锁时长</strong>：锁 10 秒业务跑 15 秒。解决：看门狗（Redisson 的 watchdog）自动续期。</li>
	      </ol>
	      <p>顺带理解 <strong>Redis 事务与 Lua 的关系</strong>：Redis 的 MULTI/EXEC 能把多条命令打包顺序执行，但<strong>没有回滚</strong>（中途出错前面已执行的不会撤销）；而 Lua 脚本把整段逻辑作为一条命令执行，<strong>天然原子</strong>——所以"需要判断后再操作"的场景（如上面的锁释放、限流器计数）业界统一用 Lua。</p>
	      <p>生产实践别手搓，直接上 <strong>Redisson</strong>——加锁/解锁/watchdog/可重入全部封装好了：</p>
	      <pre><code class="language-java">RLock lock = redissonClient.getLock("lock:order:1001");
if (lock.tryLock(3, 10, TimeUnit.SECONDS)) {   // 最多等 3 秒，锁 10 秒自动续
    try {
        // 临界区：扣库存等
    } finally {
        lock.unlock();      // 内部已做"是自己的才释放"
    }
}</code></pre>

	      <h2>10. 缓存更新策略：如何保证数据一致性？</h2>
	      <p>这是缓存使用中最棘手的难题——<strong>数据库更新了，缓存怎么同步？</strong></p>
	      <ul>
	          <li><strong>Cache Aside（旁路缓存，最常用）：</strong>读的时候先读缓存，miss 了读数据库并回填；写的时候<strong>先更新数据库，再删除缓存</strong>（注意：是删缓存，不是更新缓存！更新缓存会有并发问题）。</li>
	          <li><strong>Read/Write Through：</strong>缓存层代理数据读写，应用只和缓存打交道。实现复杂，需要专门的缓存中间件。</li>
	          <li><strong>Write Behind：</strong>先写缓存，异步批量写数据库。性能最高但数据丢失风险也最大（缓存宕机可能丢数据）。</li>
	      </ul>
	      <p><strong>为什么写操作是"删缓存"而不是"更新缓存"？</strong>因为更新缓存有并发顺序问题：线程 A 更新数据库 → 线程 B 更新数据库 → 线程 B 更新缓存 → 线程 A 更新缓存 → 缓存里的值最终是线程 A 的旧值，而数据库是线程 B 的新值，数据不一致。而删缓存则没有这个问题——下次读自然会回填最新值。另外"删"还有个隐含好处：懒加载，冷数据不会白白写进缓存。</p>
	      <p>再补一刀"<strong>先更新数据库再删缓存</strong>"为什么是对的：它的不一致窗口只在"读请求恰好在写库后、删缓存前读到旧值并回填"的极小概率场景（且该旧值还会被过期时间兜住）；反过来"先删缓存再更新库"则会让并发读立即把旧值回填，不一致概率高得多。极端要求下可以加"延迟双删"或订阅 binlog 异步删缓存（Canal 方案）。</p>

	      <h2>11. 高可用一览：主从、哨兵与集群</h2>
	      <table>
	          <tr>
	              <th>方案</th>
	              <th>解决什么</th>
	              <th>要点</th>
	          </tr>
	          <tr><td>主从复制</td><td>读扩展 + 数据冗余</td><td>从库异步复制主库；主挂了要人工切换；读写分离时注意主从延迟</td></tr>
	          <tr><td>哨兵（Sentinel）</td><td>自动故障转移</td><td>哨兵集群监控主库，主挂自动选新主并通知客户端；数据仍在单机上（容量受限）</td></tr>
	          <tr><td>Cluster 集群</td><td>水平扩容 + 高可用</td><td>16384 个槽分片到多主节点；key 按槽路由；跨槽多键操作受限（hash tag 可解）</td></tr>
	      </table>
	      <p>主从复制原理补两句：首次同步是<strong>全量</strong>（主库 bgsave 生成 RDB 发给从库 + 期间新写命令缓冲后补发），之后是<strong>增量</strong>（主库维护环形缓冲区 repl_backlog，从库断线重连后按 offset 补传，脱太久缓冲被覆盖就退回全量）。哨兵选主的裁决：多个哨兵"主观下线"达成"客观下线"（quorum）→ 按优先级/偏移量/ID 选新主 → 多数哨兵同意后完成切换。Cluster 则是把 16384 个槽映射到各主节点，客户端按 key 的 CRC16 值算槽位、<code>{user1000}.follow</code> 这种 hash tag 能强制多 key 落同一槽以支持多 key 操作。</p>
	      <p>选型经验：数据量小、只求高可用 → 主从 + 哨兵；数据量大到单机内存装不下、写入量高 → Cluster。大部分中小系统，一台主从 + 哨兵就够，<strong>别一上来就上集群，运维复杂度是真实的</strong>。</p>

	      <h2>12. 两个综合实战模式</h2>
	      <h3>12.1 延迟队列（订单超时自动取消）</h3>
	      <pre><code class="language-bash"># 思路：ZSet 的 score 存"执行时间戳"，消费者轮询取到期任务
ZADD delay:queue 1730980900 "order:1001"     # score = 应执行的时间戳

# 消费者（定时任务/循环）：
ZRANGEBYSCORE delay:queue -inf &lt;当前时间戳&gt; LIMIT 0 10   # 取已到期的
# 处理成功后 ZREM；为防多实例重复消费，处理前先 SETNX 抢占任务锁</code></pre>
	      <p>比轮询更优雅的是 Redis 6.0+ 的 <strong>Stream + 消费组</strong>（XADD/XREADGROUP/XACK），支持消息持久化、消费者组与确认机制——小规模延迟任务 ZSet 就够，正经消息队列需求上 Stream 或 MQ。</p>
	      <h3>12.2 排行榜（ZSet 的标准舞台）</h3>
	      <pre><code class="language-bash">ZINCRBY rank:score:20261107 10 "user:42"              # 用户得分
ZREVRANK rank:score:20261107 "user:42"                # 我的排名（0-based）
ZREVRANGE rank:score:20261107 0 9 WITHSCORES          # Top10
ZREVRANGEBYSCORE rank:score:20261107 +inf (ZSCORE值    # 我前面还有多少人（差一名激励）</code></pre>
	      <p>百万级用户排行榜 ZSet 照样从容——这就是选对数据结构的价值：算法逻辑由结构自带，业务代码只剩一行调用。</p>

	      <h2>小结</h2>
	      <p>Redis 入门容易精通难，把全篇收成一张知识网：<strong>快的三要素（内存/单线程/多路复用）；五大数据结构各管一类场景，底层是跳表+渐进式 rehash+小对象压缩的工程智慧；过期靠惰性+定期，内存满了靠淘汰策略；持久化 RDB 保恢复 AOF 保安全；缓存三兄弟按规模递增各有对策；分布式锁的三坑（忘记过期/误删他人/业务超时）一个 Lua 脚本加看门狗全治；一致性记住"先更库后删缓存"</strong>。本文覆盖了日常开发中 90% 的 Redis 使用场景。但记住：<strong>缓存不是万能的，加缓存之前先优化 SQL（见 <a href="#/notes/mysql-tuning">MySQL 调优实战</a>），很多场景下慢查询不是缓存能解决的。</strong></p>`;export{t as default};

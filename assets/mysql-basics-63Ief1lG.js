const e=`	      <h1>MySQL 从入门到高效使用：SQL 语法、设计规范与性能优化</h1>

	      <p>MySQL 是目前最流行的开源关系型数据库。从个人博客到大型电商，从日志存储到数据分析，MySQL 几乎无处不在。但会用 SQL 和用好 MySQL 是两回事——本文从基础语法讲起，用一套贯穿全文的教学表做实战，延伸到表设计规范和常见的性能优化技巧，帮你从一个"会写增删改查"的开发者成长为"知道怎么写更高效"的工程师。这篇是本站 MySQL 系列的入口：想继续深入请看<a href="#/notes/mysql-index">索引详解</a>、<a href="#/notes/mysql-txn-lock">事务与锁</a>、<a href="#/notes/mysql-logs">日志系统</a>和<a href="#/notes/mysql-tuning">调优实战</a>。</p>

	      <h2>1. 关系型数据库核心概念</h2>
	      <p>在写 SQL 之前，先搞清楚几个基本概念。这些词在面试和工作中会反复出现：</p>
	      <ul>
	          <li><strong>数据库（Database）：</strong>一个 MySQL 实例下可以有多个数据库，每个数据库是一个独立的命名空间。类似一个 Excel 文件。</li>
	          <li><strong>表（Table）：</strong>数据库里的"数据表"，由行和列组成。类似 Excel 里的一个 Sheet。</li>
	          <li><strong>行（Row）/ 记录（Record）：</strong>表中的一条数据。</li>
	          <li><strong>列（Column）/ 字段（Field）：</strong>表中的一个属性，如 username、age。</li>
	          <li><strong>主键（Primary Key）：</strong>唯一标识表中每一行的列。一张表只能有一个主键，通常用自增 ID。</li>
	          <li><strong>外键（Foreign Key）：</strong>用于关联两张表，保证引用完整性。实际开发中很多团队选择不用物理外键，而是在应用层维护关联关系（为了性能和灵活性）。</li>
	          <li><strong>索引（Index）：</strong>加速查询的数据结构，类似书的目录。没有索引的查询需要全表扫描，数据量一大就慢得要命。</li>
	      </ul>
	      <p>贯穿全文的教学数据是迷你电商的三张表：<code>users</code>（用户）、<code>products</code>（商品）、<code>orders</code>（订单，外键指向用户和商品）。后面每个语法都拿它们练手。</p>

	      <h2>2. 数据库与表的基本操作</h2>
	      <pre><code class="language-sql">-- 创建数据库，指定字符集
CREATE DATABASE mydb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 切换数据库
USE mydb;

-- 删除数据库（慎用！生产环境这条命令基本是禁止的）
DROP DATABASE IF EXISTS mydb;</code></pre>

	      <p><strong>字符集为什么选 utf8mb4？</strong>MySQL 的 utf8 最多只能用 3 个字节，存不了 Emoji 表情（😂）和部分生僻汉字。utf8mb4 用 4 个字节，是真正的 UTF-8 完整实现。<strong>新项目一律用 utf8mb4。</strong>排序规则选 <code>utf8mb4_unicode_ci</code>（ci = 不区分大小写比较），8.0 默认的 <code>utf8mb4_0900_ai_ci</code> 也很好。</p>

	      <h2>3. 表设计与数据类型选择</h2>
	      <p>建表时选对数据类型，直接影响存储空间和查询性能：</p>
	      <pre><code class="language-sql">CREATE TABLE users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username    VARCHAR(50)  NOT NULL UNIQUE COMMENT '用户名',
    email       VARCHAR(100) NOT NULL COMMENT '邮箱',
    age         TINYINT UNSIGNED COMMENT '年龄（0-255，无符号）',
    balance     DECIMAL(10, 2) DEFAULT 0.00 COMMENT '余额（定点数，不要用FLOAT）',
    status      ENUM('active', 'inactive', 'banned') DEFAULT 'active' COMMENT '状态',
    bio         TEXT COMMENT '个人简介',
    avatar_url  VARCHAR(500) COMMENT '头像URL',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';</code></pre>

	      <h3>常见数据类型选择指南：</h3>
	      <table>
	          <tr>
	              <th>场景</th>
	              <th>推荐类型</th>
	              <th>原因</th>
	          </tr>
	          <tr><td>主键/ID</td><td><code>BIGINT AUTO_INCREMENT</code></td><td>INT 最大 21 亿，高并发场景可能不够</td></tr>
	          <tr><td>金额/价格</td><td><code>DECIMAL(M, D)</code></td><td>FLOAT/DOUBLE 有精度丢失，金额计算会出错</td></tr>
	          <tr><td>长文本</td><td><code>TEXT / MEDIUMTEXT</code></td><td>VARCHAR 最多 65535 字节</td></tr>
	          <tr><td>状态/类型</td><td><code>TINYINT</code> 或 <code>VARCHAR(20)</code></td><td>ENUM 修改需要 ALTER TABLE，生产环境很麻烦</td></tr>
	          <tr><td>时间</td><td><code>TIMESTAMP</code></td><td>自动处理时区转换（DATETIME 不处理）</td></tr>
	          <tr><td>布尔值</td><td><code>TINYINT(1)</code></td><td>MySQL 没有真正的 BOOLEAN 类型</td></tr>
	      </table>
	      <p>一条总原则：<strong>够用的前提下选最小的类型</strong>——列越小，一页 16KB 能存的行越多，索引和缓存效率都跟着涨（原理见 <a href="#/notes/mysql-index">索引篇的 B+ 树页估算</a>）。另外澄清一个流传很广的误解：<code>INT(11)</code> 里的 11 只是"显示宽度"，<strong>不限制存储范围</strong>，INT 永远是 4 字节 ±21 亿，写 INT 和 INT(11) 存的东西一模一样。</p>

	      <h2>4. CRUD 进阶：从基本查询到一组渐进练习</h2>
	      <pre><code class="language-sql">-- ====== 查询 ======
-- 基本查询 + 条件过滤 + 排序 + 分页
SELECT id, username, email
FROM users
WHERE status = 'active'
  AND created_at &gt;= '2024-01-01'
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;     -- 跳过 20 条，取 10 条（第 3 页）

-- 聚合查询：统计 + 分组
SELECT status, COUNT(*) AS cnt, AVG(age) AS avg_age
FROM users
GROUP BY status
HAVING cnt &gt; 5;          -- 对分组结果过滤（不用 WHERE，WHERE 在 GROUP BY 之前过滤行）

-- ====== 插入 ======
INSERT INTO users (username, email, age) VALUES
    ('alice', 'alice@example.com', 25),
    ('bob', 'bob@example.com', 30);

-- 插入或更新（如果有唯一键冲突则更新）
INSERT INTO users (username, email, age) VALUES ('alice', 'new_email@example.com', 26)
ON DUPLICATE KEY UPDATE email = VALUES(email), age = VALUES(age);

-- ====== 更新（生产环境 update 必须带 WHERE！）======
UPDATE users
SET status = 'inactive', updated_at = NOW()
WHERE id = 1;

-- ====== 删除（软删除——推荐做法）======
-- 不要用 DELETE！加一个 is_deleted 字段标记为已删除
UPDATE users SET is_deleted = 1, deleted_at = NOW() WHERE id = 1;</code></pre>
	      <p><strong>核心要点：</strong></p>
	      <ul>
	          <li><strong>SELECT * 别乱用：</strong>只查需要的字段，减少网络传输和内存占用。尤其在表有 TEXT 等大字段时（索引层面的原因见<a href="#/notes/mysql-index">回表与覆盖索引</a>）。</li>
	          <li><strong>LIMIT 必须配合 ORDER BY：</strong>没有 ORDER BY 的 LIMIT 返回顺序是不确定的。</li>
	          <li><strong>软删除优于硬删除：</strong>数据是资产，用 <code>is_deleted</code> 字段标记删除而非真正 DELETE，方便数据恢复和审计。</li>
	          <li><strong>执行顺序记心里：</strong>一条 SELECT 的逻辑执行顺序是 <code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</code>——为什么 HAVING 里不能用 SELECT 起的别名（老版本）、为什么 WHERE 里不能用聚合函数，答案都在这条链上。</li>
	      </ul>
	      <h3>一组渐进练习（拿教学表从易到难）</h3>
	      <pre><code class="language-sql">-- ① 每个用户的订单总数与总金额
SELECT u.username, COUNT(o.id) AS order_cnt, IFNULL(SUM(o.amount), 0) AS total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username;

-- ② 找出下单金额超过 1000 的"大客户"（ having 过滤分组）
SELECT user_id, SUM(amount) AS total
FROM orders
GROUP BY user_id
HAVING total &gt; 1000;

-- ③ 每个分类里价格最高的商品（相关子查询）
SELECT p.name, p.category, p.price
FROM products p
WHERE p.price = (
    SELECT MAX(price) FROM products WHERE category = p.category
);

-- ④ 未下单过的用户（NOT IN 有 NULL 陷阱，用 NOT EXISTS 更稳）
SELECT u.username FROM users u
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);

-- ⑤ 近 7 天每天的下单量（日期截断分组）
SELECT DATE(created_at) AS day, COUNT(*) AS cnt
FROM orders
WHERE created_at &gt;= CURDATE() - INTERVAL 7 DAY
GROUP BY day
ORDER BY day;</code></pre>

	      <h2>5. 多表连接：JOIN 到底怎么连</h2>
	      <p>业务数据必然分表存储（用户表、订单表），JOIN 是把它们拼回来的方式。三种连接的区别用一句话 + 一个例子说清：</p>
	      <pre><code class="language-sql">-- 内连接：只返回两边都能匹配上的行
SELECT u.username, o.order_no, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'paid';

-- 左连接：左表全保留，右表匹配不上补 NULL
-- "所有用户 + 他们的订单数（没下过单的用户也要出现，订单数为 0）"
SELECT u.username, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username;

-- 右连接 = 左连接换方向，实际开发为了可读性一律写 LEFT JOIN</code></pre>
	      <p>两个高频细节：<strong>① LEFT JOIN 后接 WHERE 右表条件会把左连接"退化"成内连接</strong>（把 NULL 行全过滤掉了）——过滤右表的限制应该写在 ON 里；<strong>② 被驱动表的关联列必须有索引</strong>，否则每次匹配都是全表扫描（优化细节见<a href="#/notes/mysql-tuning">调优实战的 JOIN 一节</a>）。还有个冷知识：<code>COUNT(o.id)</code> 在 LEFT JOIN 场景比 <code>COUNT(*)</code> 更符合直觉——前者不数 NULL 行，"没下过单"不会被算成 1。</p>

	      <h2>6. 子查询的四种形态</h2>
	      <table>
	          <tr>
	              <th>形态</th>
	              <th>返回</th>
	              <th>例子</th>
	          </tr>
	          <tr><td>标量子查询</td><td>单个值</td><td><code>SELECT name, (SELECT MAX(price) FROM products) AS ceiling FROM products LIMIT 1</code></td></tr>
	          <tr><td>列子查询</td><td>一列多行（配 IN/ANY/ALL）</td><td><code>WHERE id IN (SELECT user_id FROM orders WHERE amount &gt; 500)</code></td></tr>
	          <tr><td>行子查询</td><td>一行多列</td><td><code>WHERE (age, city) = (SELECT MAX(age), city FROM users LIMIT 1)</code></td></tr>
	          <tr><td>表子查询</td><td>临时结果集（放 FROM）</td><td><code>FROM (SELECT user_id, SUM(amount) s FROM orders GROUP BY user_id) t</code></td></tr>
	      </table>
	      <p>使用建议：<strong>能写 JOIN 就别写相关子查询</strong>（外表每行都执行一次内查询，代价高）；IN 子查询里如果有 NULL，<code>NOT IN</code> 会整体返回空集——这是 SQL 三值逻辑（TRUE/FALSE/UNKNOWN）的经典陷阱，条件里可能出 NULL 时一律用 <code>NOT EXISTS</code>。</p>

	      <h2>7. 常用函数速查</h2>
	      <table>
	          <tr>
	              <th>类别</th>
	              <th>常用函数</th>
	          </tr>
	          <tr><td>字符串</td><td><code>CONCAT / LENGTH / CHAR_LENGTH / SUBSTRING / TRIM / REPLACE / UPPER / LEFT(n, 3)</code></td></tr>
	          <tr><td>数值</td><td><code>ROUND / FLOOR / CEIL / ABS / MOD / TRUNCATE(x, 2)</code></td></tr>
	          <tr><td>日期</td><td><code>NOW() / CURDATE() / DATE_FORMAT(t,'%Y-%m-%d') / DATEDIFF / DATE_ADD(t, INTERVAL 7 DAY)</code></td></tr>
	          <tr><td>流程</td><td><code>IF(c, a, b) / IFNULL(x, d) / COALESCE(x, y, z) / CASE WHEN c THEN a ELSE b END</code></td></tr>
	          <tr><td>聚合</td><td><code>COUNT / SUM / AVG / MAX / MIN / GROUP_CONCAT</code></td></tr>
	      </table>
	      <p>两个高频细节：<code>LENGTH</code> 是字节数、<code>CHAR_LENGTH</code> 才是字符数（中文场景统计长度用后者）；<code>CASE WHEN</code> 能写在 SELECT/ORDER BY/UPDATE 的任何位置，行转列报表全靠它：</p>
	      <pre><code class="language-sql">-- 行转列：每个分类一列，值为商品数
SELECT
    COUNT(CASE WHEN category = 'pc'    THEN 1 END) AS pc_cnt,
    COUNT(CASE WHEN category = 'phone' THEN 1 END) AS phone_cnt,
    COUNT(CASE WHEN category = 'pad'   THEN 1 END) AS pad_cnt
FROM products;</code></pre>

	      <h2>8. 事务：让多条 SQL 同生共死</h2>
	      <pre><code class="language-sql">START TRANSACTION;
UPDATE account SET balance = balance - 100 WHERE id = 1;
UPDATE account SET balance = balance + 100 WHERE id = 2;
COMMIT;      -- 全部生效
-- 或者 ROLLBACK;  全部撤销</code></pre>
	      <p>事务保证 ACID 四个特性，四个隔离级别控制并发行为，InnoDB 默认级别是 REPEATABLE READ——"为什么默认是它""MVCC 怎么实现的""锁有哪几种"，完整展开见 <a href="#/notes/mysql-txn-lock">MySQL 事务与锁</a>。这里先记住两条日常纪律：<strong>① UPDATE/DELETE 必须带 WHERE 且走索引；② 事务尽量短，别把 RPC 调用包进事务里。</strong></p>

	      <h2>9. 索引：查询快的核心秘诀</h2>
	      <p><strong>索引是什么？</strong>类比书的目录——没有目录你要一页页翻找内容（全表扫描），有了目录可以直接定位（索引查找）。</p>
	      <p><strong>MySQL 常用索引类型：</strong></p>
	      <ul>
	          <li><strong>B+ Tree 索引（默认）：</strong>InnoDB 的默认索引结构，适合范围查询和排序。所有数据都存在 B+ Tree 的叶子节点中。</li>
	          <li><strong>唯一索引（UNIQUE）：</strong>索引列的值必须唯一，但允许 NULL（可以有多个 NULL）。</li>
	          <li><strong>联合索引：</strong>多列组合成一个索引。<strong>最重要的原则：最左前缀匹配。</strong>比如联合索引 (a, b, c)，查询条件只用 b 时<strong>不会</strong>命中该索引。</li>
	          <li><strong>全文索引（FULLTEXT）：</strong>用于文本搜索，InnoDB 从 MySQL 5.6 开始支持。</li>
	      </ul>
	      <pre><code class="language-sql">-- 创建索引
CREATE INDEX idx_created_at ON users(created_at);
CREATE INDEX idx_username_email ON users(username, email);  -- 联合索引
CREATE UNIQUE INDEX uk_email ON users(email);                -- 唯一索引

-- 查看查询是否用到了索引
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
-- 关注 type 列：ALL（全表扫描，最差）→ index → range → ref → const（最好）
-- 关注 key 列：实际使用的索引名
-- 关注 rows 列：预估扫描行数</code></pre>
	      <p>索引的数据结构（为什么是 B+ 树）、聚簇与非聚簇、回表、覆盖索引、索引下推这些"为什么"，在 <a href="#/notes/mysql-index">MySQL 索引详解</a>里完整展开——这一篇先会用，下一篇懂原理。</p>

	      <h2>10. SQL 调优清单</h2>
	      <ol>
	          <li><strong>WHERE 条件里的列加索引：</strong>这是最有效的优化。但不要给每列都加索引——索引占空间，且写操作需要维护索引。</li>
	          <li><strong>避免在 WHERE 中对列做函数操作：</strong><code>WHERE DATE(created_at) = '2024-01-01'</code> 不走索引，应改为 <code>WHERE created_at &gt;= '2024-01-01' AND created_at &lt; '2024-01-02'</code>。</li>
	          <li><strong>LIKE 前缀模糊走不了索引：</strong><code>LIKE '%keyword%'</code> 或 <code>LIKE '%keyword'</code> 不走索引，<code>LIKE 'keyword%'</code> 可以走。</li>
	          <li><strong>用 JOIN 替代子查询（很多时候）：</strong>MySQL 的查询优化器对 JOIN 的优化比子查询好。</li>
	          <li><strong>大表分页优化：</strong><code>LIMIT 100000, 10</code> 会扫描前 100010 行再扔掉前 100000 行，非常慢。用"延迟关联"或"游标分页"替代（写法见 <a href="#/notes/mysql-tuning">调优实战</a>）。</li>
	      </ol>

	      <h2>11. InnoDB 存储引擎——你需要知道的</h2>
	      <p>MySQL 的默认存储引擎是 InnoDB，它提供了几个关键特性：</p>
	      <ul>
	          <li><strong>事务（ACID）：</strong>支持事务，通过 MVCC（多版本并发控制）实现高并发下的读不阻塞写。</li>
	          <li><strong>行级锁：</strong>相比 MyISAM 的表级锁，并发性能大幅提升。</li>
	          <li><strong>外键约束：</strong>支持外键（虽然很多团队选择不用）。</li>
	          <li><strong>崩溃恢复：</strong>通过 redo log（重做日志）保证事务的持久性，即使数据库崩溃也能恢复已提交的事务。</li>
	      </ul>
	      <p><strong>关于事务隔离级别：</strong>InnoDB 默认是 <code>REPEATABLE READ</code>（可重复读），通过 Next-Key Lock 在一定程度上避免了幻读问题。</p>

	      <h2>12. 视图、备份与权限：运维三小件</h2>
	      <pre><code class="language-sql">-- 视图：把常用复杂查询固化成"虚拟表"
CREATE VIEW v_user_order AS
SELECT u.id, u.username, COUNT(o.id) AS order_cnt, IFNULL(SUM(o.amount), 0) AS total
FROM users u LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

SELECT * FROM v_user_order WHERE total &gt; 1000;   -- 像查普通表一样用</code></pre>
	      <pre><code class="language-bash"># 备份与恢复（mysqldump 是最常用的逻辑备份工具）
mysqldump -u root -p --single-transaction mydb &gt; backup.sql   # InnoDB 不锁表的一致性备份
mysql -u root -p mydb &lt; backup.sql                             # 恢复</code></pre>
	      <pre><code class="language-sql">-- 权限：给应用建专用账号，只授必要权限（别拿 root 跑业务！）
CREATE USER 'app'@'%' IDENTIFIED BY '强密码';
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'app'@'%';
SHOW GRANTS FOR 'app'@'%';</code></pre>
	      <p>三个新手常撞的报错顺手存档：<strong>1062</strong> Duplicate entry（唯一键冲突）、<strong>1451</strong> Cannot delete（外键引用，先删子表）、<strong>1213</strong> Deadlock found（死锁被回滚，重试即可）。</p>

	      <h2>13. 窗口函数：MySQL 8.0 的报表利器</h2>
	      <p>聚合 + 明细同时要的场景，以前要靠子查询绕，8.0 的窗口函数一行搞定：</p>
	      <pre><code class="language-sql">-- 每个用户的订单 + 该用户订单金额在全体中的排名
SELECT order_no, user_id, amount,
       ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY amount DESC) AS rank_in_user,
       ROUND(amount * 100.0 / SUM(amount) OVER (PARTITION BY user_id), 2) AS pct_of_user
FROM orders;

-- 常用窗口函数速查：
-- ROW_NUMBER()  连续编号（1,2,3...）
-- RANK()        并列同名次，跳号（1,1,3）
-- SUM/AVG/COUNT() OVER (...)  组内累计/均值
-- LAG()/LEAD()  取上一行/下一行的值（环比计算神器）</code></pre>

	      <h2>小结</h2>
	      <p>MySQL 这门技术，入门容易精通难。本文覆盖了从 SQL 语法到表设计规范再到索引优化的核心知识。如果你只能记住三点，请记住：<strong>① 字符集用 utf8mb4；② 金额用 DECIMAL；③ WHERE 条件里的列要建索引。</strong>这三点做到了，至少能避免 80% 的初级错误。再带走三条日常纪律：<strong>UPDATE/DELETE 必带 WHERE、软删除优先、NOT IN 见 NULL 绕道走</strong>。</p>
	      <p>这是 MySQL 系列的第一篇。继续深入：为什么是 B+ 树、回表与索引下推看<a href="#/notes/mysql-index">索引详解</a>；隔离级别与 MVCC 看<a href="#/notes/mysql-txn-lock">事务与锁</a>；redo/binlog 与两阶段提交看<a href="#/notes/mysql-logs">日志系统</a>；EXPLAIN 实战与深分页优化看<a href="#/notes/mysql-tuning">调优实战</a>。缓存层的搭档是 <a href="#/notes/redis-basics">Redis</a>。</p>`;export{e as default};

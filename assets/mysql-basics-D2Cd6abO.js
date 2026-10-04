const e=`	      <h1>MySQL 从入门到高效使用：SQL 语法、设计规范与性能优化</h1>

	      <p>MySQL 是目前最流行的开源关系型数据库。从个人博客到大型电商，从日志存储到数据分析，MySQL 几乎无处不在。但会用 SQL 和用好 MySQL 是两回事——本文从基础语法讲起，延伸到表设计规范和常见的性能优化技巧，帮你从一个"会写增删改查"的开发者成长为"知道怎么写更高效"的工程师。</p>

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

	      <h2>2. 数据库与表的基本操作</h2>
	      <pre><code class="language-sql">-- 创建数据库，指定字符集
CREATE DATABASE mydb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 切换数据库
USE mydb;

-- 删除数据库（慎用！生产环境这条命令基本是禁止的）
DROP DATABASE IF EXISTS mydb;</code></pre>

	      <p><strong>字符集为什么选 utf8mb4？</strong>MySQL 的 utf8 最多只能用 3 个字节，存不了 Emoji 表情（😂）和部分生僻汉字。utf8mb4 用 4 个字节，是真正的 UTF-8 完整实现。<strong>新项目一律用 utf8mb4。</strong></p>

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

	      <h2>4. CRUD 进阶：不止是简单的 SELECT</h2>
	      <pre><code class="language-sql">-- ====== 查询 ======
-- 基本查询 + 条件过滤 + 排序 + 分页
SELECT id, username, email
FROM users
WHERE status = 'active'
  AND created_at >= '2024-01-01'
ORDER BY created_at DESC
LIMIT 10 OFFSET 20;     -- 跳过 20 条，取 10 条（第 3 页）

-- 聚合查询：统计 + 分组
SELECT status, COUNT(*) AS cnt, AVG(age) AS avg_age
FROM users
GROUP BY status
HAVING cnt > 5;          -- 对分组结果过滤（不用 WHERE，WHERE 在 GROUP BY 之前过滤行）

-- 多表关联查询
SELECT u.username, o.order_no, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'paid';

-- 子查询
SELECT username
FROM users
WHERE id IN (
    SELECT DISTINCT user_id FROM orders WHERE amount > 1000
);

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
	          <li><strong>SELECT * 别乱用：</strong>只查需要的字段，减少网络传输和内存占用。尤其在表有 TEXT 等大字段时。</li>
	          <li><strong>LIMIT 必须配合 ORDER BY：</strong>没有 ORDER BY 的 LIMIT 返回顺序是不确定的。</li>
	          <li><strong>软删除优于硬删除：</strong>数据是资产，用 <code>is_deleted</code> 字段标记删除而非真正 DELETE，方便数据恢复和审计。</li>
	      </ul>

	      <h2>5. 索引：查询快的核心秘诀</h2>
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

	      <h2>6. SQL 调优清单</h2>
	      <ol>
	          <li><strong>WHERE 条件里的列加索引：</strong>这是最有效的优化。但不要给每列都加索引——索引占空间，且写操作需要维护索引。</li>
	          <li><strong>避免在 WHERE 中对列做函数操作：</strong><code>WHERE DATE(created_at) = '2024-01-01'</code> 不走索引，应改为 <code>WHERE created_at >= '2024-01-01' AND created_at < '2024-01-02'</code>。</li>
	          <li><strong>LIKE 前缀模糊走不了索引：</strong><code>LIKE '%keyword%'</code> 或 <code>LIKE '%keyword'</code> 不走索引，<code>LIKE 'keyword%'</code> 可以走。</li>
	          <li><strong>用 JOIN 替代子查询（很多时候）：</strong>MySQL 的查询优化器对 JOIN 的优化比子查询好。</li>
	          <li><strong>大表分页优化：</strong><code>LIMIT 100000, 10</code> 会扫描前 100010 行再扔掉前 100000 行，非常慢。用"延迟关联"或"游标分页"替代。</li>
	      </ol>

	      <h2>7. InnoDB 存储引擎——你需要知道的</h2>
	      <p>MySQL 的默认存储引擎是 InnoDB，它提供了几个关键特性：</p>
	      <ul>
	          <li><strong>事务（ACID）：</strong>支持事务，通过 MVCC（多版本并发控制）实现高并发下的读不阻塞写。</li>
	          <li><strong>行级锁：</strong>相比 MyISAM 的表级锁，并发性能大幅提升。</li>
	          <li><strong>外键约束：</strong>支持外键（虽然很多团队选择不用）。</li>
	          <li><strong>崩溃恢复：</strong>通过 redo log（重做日志）保证事务的持久性，即使数据库崩溃也能恢复已提交的事务。</li>
	      </ul>
	      <p><strong>关于事务隔离级别：</strong>InnoDB 默认是 <code>REPEATABLE READ</code>（可重复读），通过 Next-Key Lock 在一定程度上避免了幻读问题。</p>

	      <h2>小结</h2>
	      <p>MySQL 这门技术，入门容易精通难。本文覆盖了从 SQL 语法到表设计规范再到索引优化的核心知识。如果你只能记住三点，请记住：<strong>① 字符集用 utf8mb4；② 金额用 DECIMAL；③ WHERE 条件里的列要建索引。</strong>这三点做到了，至少能避免 80% 的初级错误。</p>
	      <p>下一步推荐学习的方向：慢查询日志分析（<code>slow_query_log</code>）、EXPLAIN 执行计划详解、分库分表方案（ShardingSphere）、以及 MySQL 8.0 的新特性（窗口函数、CTE 递归查询等）。</p>`;export{e as default};

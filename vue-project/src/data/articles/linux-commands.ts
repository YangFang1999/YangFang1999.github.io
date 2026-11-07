// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Linux 基础命令速查：从文件操作到进程管理</h1>

	      <p>Linux 是服务器端的绝对王者——全球超过 96% 的服务器运行在 Linux 上。作为后端开发者或运维人员，<strong>在 Linux 服务器上排查问题是日常操作</strong>：查看日志、检查内存、杀掉卡死的进程、修改配置文件……这些操作都离不开命令行。本文按实际工作场景组织，每个命令都附有常用参数和实战示例，最后还给一节"shell 脚本入门"，把零散命令串成自动化。</p>

	      <h2>1. Linux 哲学：为什么后端开发者必须学 Linux？</h2>
	      <ul>
	          <li><strong>你的代码跑在 Linux 上：</strong>绝大多数生产服务器是 Linux。你不会 Linux，出问题就只能等运维帮忙。</li>
	          <li><strong>命令行效率远超 GUI：</strong>熟练后，在终端里完成文件操作、日志分析、进程管理的速度比鼠标操作快得多。</li>
	          <li><strong>面试必问：</strong>后端岗位几乎都会考察基本的 Linux 命令——ls、grep、top、chmod 这些是常识级别的问题。</li>
	          <li><strong>容器化时代更需要：</strong>Docker 容器内通常只有一个 shell，没有图形界面，一切操作都靠命令行（见 <a href="#/notes/docker-intro">Docker 入门</a>）。</li>
	      </ul>

	      <h2>2. 文件与目录操作——最基础也最重要</h2>
	      <pre><code class="language-bash"># 列出文件（最常用的命令，没有之一）
ls -la              # -l 详细列表，-a 显示隐藏文件
ls -lh              # -h 文件大小人类可读（1K, 234M, 2G 而不是字节数）
ls -lt              # -t 按修改时间排序
ls -ltr             # -r 反向排序（最旧的在最前面）

# 目录导航
cd /path/to/dir     # 切换到绝对路径
cd ..               # 上级目录
cd -                # 回到上一个目录（在 A 和 B 之间来回切换的神键）
cd ~                # 回到 home 目录

# 创建和删除
mkdir -p a/b/c      # -p 递归创建父目录（不用一层层建）
touch README.md     # 创建空文件 或 更新文件的修改时间
rm file.txt         # 删除文件
rm -rf directory/   # 递归强制删除目录（-r 递归，-f 不确认。慎用！）

# 复制和移动
cp source dest      # 复制文件
cp -r dir1 dir2     # 复制目录（-r 递归）
mv old.txt new.txt  # 移动/重命名（同一个命令，取决于目标是否是已有目录）</code></pre>

	      <h2>3. 链接与 inode：理解 Linux 文件系统的底座</h2>
	      <p>先建立一个模型：Linux 文件系统里，<strong>文件名 ≠ 文件本身</strong>。每个文件的真实内容由一个 <strong>inode</strong>（索引节点）管理——存权限、大小、数据块位置；<strong>文件名只是目录里指向 inode 的一条"链接"</strong>。</p>
	      <pre><code class="language-plaintext">目录表                     inode 表                数据块
app.log  ──────┐
backup.log ────┴──► inode #1024 ──────► [磁盘上的内容]
                （两份"链接"指向同一个 inode，链接计数 = 2）</code></pre>
	      <pre><code class="language-bash"># 硬链接：给同一个 inode 起另一个名字（删掉一个名字，内容还在）
ln app.log backup.log
ls -li app.log backup.log    # -i 显示 inode 号：两者相同

# 软链接（符号链接）：一个存"路径"的新文件，类似 Windows 快捷方式
ln -s /opt/app/current/logs /var/log/app
ls -l /var/log/app           # 显示 -> 指向的目标</code></pre>
	      <table>
	          <tr>
	              <th></th>
	              <th>硬链接</th>
	              <th>软链接</th>
	          </tr>
	          <tr><td>本质</td><td>同一 inode 的别名</td><td>存路径的新文件</td></tr>
	          <tr><td>跨文件系统</td><td>不能</td><td>能</td></tr>
	          <tr><td>链接目录</td><td>不能（避免成环）</td><td>能</td></tr>
	          <tr><td>原文件删除后</td><td>内容仍可访问（计数减 1）</td><td>失效（悬空链接）</td></tr>
	      </table>
	      <p>版本发布里常见的 <code>current -> v1.2.3</code> 目录软链，就是软链接最典型的生产应用：发布新版本只需把软链一指，回滚同样一条命令。</p>

	      <h2>4. 文件查看与内容搜索——排查问题的核心技能</h2>
	      <pre><code class="language-bash"># 查看文件
cat file.txt        # 全部输出（文件大时别用，会刷屏）
less file.txt       # 分页查看（Space 翻页，/搜索，q 退出）
head -n 20 file.txt # 前 20 行
tail -n 50 file.txt # 后 50 行
tail -f app.log     # 实时追踪日志（排查线上问题的必备命令）
tail -f app.log | grep --line-buffered ERROR   # 边追边过滤

# 搜索文件内容（grep 是 Linux 最强大的文本搜索工具）
grep "ERROR" app.log                          # 搜索包含 ERROR 的行
grep -i "error" app.log                       # -i 忽略大小写
grep -n "ERROR" app.log                       # -n 显示行号
grep -r "TODO" ./src/                         # -r 递归搜索目录
grep -v "DEBUG" app.log                       # -v 反向匹配（排除 DEBUG 行）
grep -A 3 -B 2 "ERROR" app.log                # 匹配行前 2 行、后 3 行（看上下文）
grep -c "ERROR" app.log                       # -c 计数
grep -E "ERROR|FATAL" app.log                 # -E 扩展正则（多条件或）

# 查找文件本体（find：按名字/大小/时间定位文件）
find /var/log -name "*.log" -mtime -1         # 1 天内修改过的日志
find . -size +100M                            # 当前目录下超过 100M 的大文件
find /var/log -name "*.log" -mtime +7 -delete # 顺手删掉 7 天前的日志</code></pre>

	      <h2>5. 管道与文本三剑客：grep / sed / awk</h2>
	      <p><strong>管道（|）是 Linux 命令行的灵魂。</strong>它把前一个命令的输出作为后一个命令的输入，让你可以像搭乐高一样组合出强大的数据处理流程。而流水线里的主力加工件，就是三剑客：<strong>grep 查（已见上文）、sed 改、awk 统计</strong>。</p>
	      <pre><code class="language-bash"># sed：流编辑器，最常用于替换和提取
sed 's/old/new/' file.txt          # 每行替换第一处 old（只输出，不改文件）
sed -i 's/old/new/g' file.txt      # -i 直接改文件，g 全局替换每行所有匹配
sed -i '3s/old/new/' file.txt      # 只替换第 3 行
sed -n '10,20p' app.log            # 只打印第 10~20 行（截取日志片段神器）
sed '/^#/d' config.conf            # 删除所有以 # 开头的注释行

# awk：按列处理文本（默认按空格切列，$1 第一列，$NF 最后一列）
awk '{print $1}' access.log        # 提取第一列（比如客户端 IP）
awk '{print $1, $7}' access.log    # 提取两列：IP 和请求路径
awk -F: '{print $1}' /etc/passwd   # -F 指定分隔符（这里是冒号）
awk '$9 == 500 {print $1}' access.log   # 条件过滤：第 9 列是 500 的行

# awk 进阶：数组做统计、BEGIN/END 头尾块
# 统计每个 IP 的请求次数（awk 的关联数组天然做哈希计数）
awk '{count[$1]++} END {for (ip in count) print count[ip], ip}' access.log | sort -rn | head

# 三剑客 + 排序统计：一行命令 = 一个小报表
# "统计 access.log 里访问量最高的 10 个 IP"
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -10
#        取 IP 列            排序   去重计数    按次数倒序   取前 10</code></pre>
	      <p>这个"取列 → 排序 → 去重计数 → 再排序"的流水线值得背下来——它是日志分析最经典的组合拳，比写脚本快得多。uniq 的细节：它只合并<strong>相邻</strong>重复行，所以前面必须先 sort。</p>

	      <h2>6. 文件权限管理——安全的第一道防线</h2>
	      <p>Linux 的文件权限分三组：<strong>所有者（user）、所属组（group）、其他人（others）</strong>，每组有<strong>读（r=4）、写（w=2）、执行（x=1）</strong>三种权限。</p>
	      <pre><code class="language-bash"># 查看权限
ls -l filename
# 输出示例：-rwxr-xr--  1 alice dev  1024 May 20 10:00 script.sh
#         -  rwx  r-x  r--
#         类型 所有者 组  其他人
# 解读：所有者 alice 可读写执行，dev 组可读可执行，其他人只能读

# 修改权限
chmod 755 script.sh    # 数字模式：7=rwx, 5=r-x, 5=r-x
chmod u+x script.sh    # 符号模式：u(所有者)+x(执行权限)
chmod g-w file.txt     # 符号模式：g(组)-w(写权限)
chmod -R 755 dir/      # -R 递归修改整个目录

# 修改所有者
chown alice:dev file.txt          # 改为 alice 所有，dev 组
chown -R alice:dev /app/          # -R 递归

# 常见数字组合速记
# 644 = rw-r--r--  普通文件（配置、静态资源）
# 755 = rwxr-xr-x  可执行文件、目录（脚本、程序）
# 600 = rw-------  私密文件（私钥、凭证）</code></pre>
	      <p>权限背后的"人"也要会管：<code>sudo</code> 以管理员身份执行单条命令（比常驻 root 安全）；<code>useradd/adduser</code> 建用户、<code>passwd</code> 改密码、<code>usermod -aG sudo 用户</code> 把人加进管理员组——服务器上的第一件事就是"禁 root 直登 + 建普通用户 + sudo"，权限体系用最小的粒度守住入口。</p>

	      <h2>7. 进程管理——服务器卡了先看这里</h2>
	      <pre><code class="language-bash"># 查看进程
ps aux                  # 查看所有进程（BSD 风格）
ps aux | grep java      # 过滤出 Java 进程
ps -ef | grep nginx     # System V 风格（效果类似）

# 实时系统监控
top                     # 实时查看 CPU、内存、进程负载
# top 界面中常用快捷键：
#   shift+m: 按内存使用排序
#   shift+p: 按 CPU 使用排序
#   q: 退出
htop                    # top 的增强版（界面更友好，需要安装）

# 杀死进程（信号机制）
kill PID                # 优雅地结束进程（发送 SIGTERM 信号）
kill -9 PID             # 强制杀死（SIGKILL，进程无法捕获）
kill -15 PID            # 默认信号，同 kill PID
pkill -f "java -jar"    # 按进程名/命令行参数匹配并杀死</code></pre>
	      <p><strong>SIGTERM 和 SIGKILL 的区别值得单独记：</strong>SIGTERM(15) 是"请你退出"——进程可以接住信号做清理（刷缓冲、关连接、优雅停机）；SIGKILL(9) 是"立即消失"——进程无法捕获，数据可能没落盘。所以生产上永远先 <code>kill</code>（15）等几秒，不行再 -9。常见信号还有 <code>SIGHUP</code>（终端挂断，常被程序用作"重读配置"）、<code>SIGINT</code>（Ctrl+C 发的就是它）。</p>
	      <pre><code class="language-bash"># 后台运行
nohup java -jar app.jar &gt; app.log 2&gt;&amp;1 &amp;   # 后台运行，关闭终端也不会停
# &gt; app.log: 标准输出重定向到文件
# 2&gt;&amp;1: 标准错误也重定向到同一个文件
# &amp;: 后台运行
jobs                    # 看当前 shell 的后台任务
jobs %+                 # 最近放入后台的任务

# 查看端口占用
netstat -tlnp            # 查看所有监听的 TCP 端口
ss -tlnp                 # 更快的替代（推荐）
lsof -i :8080            # 查看 8080 端口被哪个进程占用（查"端口被占"就用它）</code></pre>
	      <p>一个经典排查链：<code>lsof -i :8080</code> 查到占用进程 → <code>ps -p PID</code> 确认是谁 → 决定 <code>kill</code> 还是改自己应用的端口。启动报 "Address already in use" 时就按这个顺序走。</p>

	      <h2>8. 磁盘与内存——服务器空间去哪了？</h2>
	      <pre><code class="language-bash"># 磁盘空间
df -h                    # 查看各分区的磁盘使用情况（-h 人类可读）
df -i                    # 查看 inode 使用情况（小文件太多也会占满）

# 目录大小
du -sh /var/log/         # 查看某个目录的总大小
du -sh *                 # 当前目录下每个子目录的大小
du -sh * | sort -hr      # 按大小降序排列（找到哪个目录最大）

# 内存使用
free -h                  # 查看内存和 swap 使用情况
free -h -s 1             # 每秒刷新一次

# 系统信息
uname -a                 # 内核版本、架构等
cat /etc/os-release      # 操作系统版本
uptime                   # 系统运行了多久 + 平均负载
lscpu                    # CPU 详细信息
lsblk                    # 磁盘和分区信息</code></pre>
	      <p>两个读数的关键：<strong>① free 的 available 列</strong>才是"真正还能给新程序用的内存"——Linux 把空闲内存拿去做页缓存（buff/cache），需要时立刻归还，看 free 列会误以为内存不足；<strong>② uptime 的 load average 三个数</strong>是最近 1/5/15 分钟的"可运行+不可中断"进程数——粗略标准：持续大于 CPU 核数就是过载（4 核机器 load 常年 8+，CPU 一定是在排队）。想更细：<code>vmstat 1</code> 看 CPU/内存/IO 概览，<code>iostat -x 1</code> 看每块磁盘的利用率和等待。</p>

	      <h2>9. 网络操作——服务通不通？</h2>
	      <pre><code class="language-bash"># 测试连通性
ping -c 4 baidu.com      # -c 4 只发 4 个包（Linux 不会自动停止）
ping -c 4 10.0.0.1       # 测试内网连通性

# 查看网络配置
ip addr                  # 查看 IP 地址（替代旧的 ifconfig）
ip route                 # 查看路由表

# DNS 查询
nslookup example.com     # 查询域名 A 记录
dig example.com          # 更详细的 DNS 信息
dig +short example.com   # 只显示结果

# 下载文件
curl -O https://example.com/file.tar.gz    # 下载（-O 保留原文件名）
curl -L https://short.link                 # -L 跟随重定向
wget https://example.com/file.tar.gz       # 另一种下载工具

# 测试 HTTP 接口
curl -X POST http://localhost:8080/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"username":"alice","email":"alice@example.com"}'

# 实用组合：看响应头 + 计时
curl -sI https://example.com        # -sI 只取响应头（看状态码/缓存头）
curl -o /dev/null -s -w '%{time_total}s\\n' https://example.com   # 测总耗时</code></pre>
	      <p>对外服务的另一道门是<strong>防火墙</strong>：Ubuntu 用 <code>ufw allow 8080/tcp</code> + <code>ufw enable</code>；CentOS 用 <code>firewall-cmd --permanent --add-port=8080/tcp</code> + <code>firewall-cmd --reload</code>。"本地 curl 通、外部访问不通"的排查顺序：应用监听地址（是否绑了 127.0.0.1）→ 防火墙 → 云安全组。</p>

	      <h2>10. 远程操作：ssh、scp 与打包传输</h2>
	      <pre><code class="language-bash"># 远程登录
ssh user@192.168.1.100           # 密码登录
ssh -i ~/.ssh/id_rsa user@host   # 指定私钥（免密登录的标配）
ssh -p 2222 user@host            # 非默认端口

# 免密登录三步（配一次，终身受益）
ssh-keygen -t ed25519                          # ① 生成密钥对
ssh-copy-id user@192.168.1.100                 # ② 公钥推到服务器
ssh user@192.168.1.100                         # ③ 之后直接登，不再要密码

# 文件传输
scp app.jar user@host:/opt/app/          # 推文件到远程
scp user@host:/var/log/app.log ./        # 从远程拉文件
scp -r dist/ user@host:/var/www/         # 推目录
rsync -avz --delete dist/ user@host:/var/www/   # 增量同步（大目录比 scp 快得多）

# 打包与解压：tar 的参数可以记成一句话"创建 cvf / 解出 xvf，加 z 处理 gzip"
tar -czvf app.tar.gz dist/        # 打包+压缩（c创建 z用gzip v显示 f文件名）
tar -xzvf app.tar.gz              # 解压（x 解出）
tar -xzvf app.tar.gz -C /opt/app  # -C 指定解压目录
tar -tzf app.tar.gz               # 只看内容不解压（先确认再解，好习惯）</code></pre>
	      <p>压缩格式再补一刀：gzip（快，.tar.gz）、bzip2（更小更慢，-j）、xz（最小最慢，-J）——<code>tar -cjvf / -cJvf</code> 同一套语法。日常 .tar.gz 就够。</p>

	      <h2>11. 服务管理与定时任务</h2>
	      <pre><code class="language-bash"># systemd：现代 Linux 的服务管理器（生产环境部署的标配姿势）
systemctl status nginx        # 看服务状态（active/exited/failed）
systemctl start nginx         # 启动
systemctl stop nginx          # 停止
systemctl restart nginx       # 重启（改完配置后）
systemctl reload nginx        # 重载配置（不断连接，Nginx 常用）
systemctl enable nginx        # 开机自启
journalctl -u nginx -f        # 追踪某个服务的日志（systemd 时代的 tail -f）
journalctl -u app --since "1 hour ago"

# crontab：定时任务（备份、清理、心跳脚本）
crontab -e                    # 编辑当前用户的定时任务
# 五个字段：分 时 日 月 周
# ┌───────────── 分钟 (0-59)
# │ ┌───────────── 小时 (0-23)
# │ │ ┌───────────── 日 (1-31)
# │ │ │ ┌───────────── 月 (1-12)
# │ │ │ │ ┌───────────── 星期 (0-7，0 和 7 都是周日)
0 3 * * *    /opt/scripts/backup.sh              # 每天 3:00
*/10 * * * * /opt/scripts/health-check.sh        # 每 10 分钟
0 0 1 * *    find /var/log -mtime +30 -delete    # 每月 1 号清理 30 天前日志
crontab -l                    # 查看已有任务</code></pre>
	      <p>把应用注册成 systemd 服务（写一个 <code>/etc/systemd/system/app.service</code>），比 nohup 更可靠：崩溃自动重启（Restart=always）、开机自启、日志归 journalctl 管——生产部署的正确姿势。</p>

	      <h2>12. 环境变量与 PATH 的原理</h2>
	      <p>第 2 节"cd 到哪都能执行命令"、Java 的 JAVA_HOME、Docker 的 TZ——背后都是环境变量。机制一句话：<strong>shell 启动时读入一组 KEY=VALUE，每当你敲一个命令，shell 按 $PATH 里冒号分隔的目录顺序找同名的可执行文件</strong>。</p>
	      <pre><code class="language-bash">echo $PATH                  # 看当前搜索路径
export MY_VAR=hello         # 导出给子进程的环境变量（只在本会话有效）
echo $MY_VAR

# 持久化：写进配置文件（按登录方式选）
~/.bashrc      # 交互式非登录 shell（大多数终端场景）
~/.profile     # 登录 shell
# 改完 source ~/.bashrc 生效

# 常用内置变量
$HOME  $USER  $PWD  $RANDOM  $?(上一条命令的退出码，0=成功)</code></pre>
	      <p>"命令找不到"类问题的全部排查路径：echo $PATH 里有没有目标目录 → 目录里文件名对不对（有无 .exe 后缀问题）→ which 命令 看实际命中的是哪个。</p>

	      <h2>13. Vim 基础——服务器上改配置必须会</h2>
	      <pre><code class="language-bash"># 打开文件
vim /etc/nginx/nginx.conf

# 基本操作（必须有耐心，Vim 的学习曲线是陡峭的）
i       # 进入编辑模式（Insert）
Esc     # 退出编辑模式，回到命令模式
:wq     # 保存并退出（write + quit）
:q!     # 强制退出不保存
dd      # 删除当前行
yy      # 复制当前行
p       # 粘贴
/       # 搜索（/keyword + Enter，n 下一个，N 上一个）
u       # 撤销
Ctrl+r  # 重做
:set nu # 显示行号（改配置对行号找问题很常用）</code></pre>

	      <h2>14. shell 脚本入门：把命令串成自动化</h2>
	      <p>重复三遍以上的手工操作，就该写成脚本。一个能落地的"日志备份"脚本，把变量、条件、循环、计划任务全串起来：</p>
	      <pre><code class="language-bash">#!/bin/bash
# backup.sh —— 打包 7 天前的日志并清理（配合 crontab 每天 3 点执行）

LOG_DIR=/var/log/app
BACKUP_DIR=/opt/backup
DATE=$(date +%F)                       # 命令替换：拿到 2026-11-07 这样的输出
TARGET="$BACKUP_DIR/logs-$DATE.tar.gz"

# 条件判断：备份目录不存在就创建
if [ ! -d "$BACKUP_DIR" ]; then
  mkdir -p "$BACKUP_DIR"
fi

# 打包 7 天前的日志
tar -czf "$TARGET" $(find $LOG_DIR -name "*.log" -mtime +7)
echo "[$(date '+%F %T')] 备份完成: $TARGET"

# 循环删除 30 天前的旧备份
for f in $(find $BACKUP_DIR -name "logs-*.tar.gz" -mtime +30); do
  rm -f "$f"
  echo "已清理过期备份: $f"
done</code></pre>
	      <p>三条脚本军规：<strong>① 开头写 shebang（#!/bin/bash）声明解释器</strong>；<strong>② 变量一律加双引号（"$VAR"）</strong>——路径带空格时不加引号就是事故；<strong>③ chmod +x 后先手动跑一遍，再挂 crontab</strong>，crontab 的环境变量和你的终端不同，报错先看 <code>/var/mail/用户</code> 或在脚本里重定向日志。</p>

	      <h2>15. 常见实战场景</h2>
	      <pre><code class="language-bash"># 场景一：线上应用突然很慢，先看什么？
top                         # 看 CPU 和内存
free -h                     # 看内存是否不足
df -h                       # 看磁盘是否满了
tail -200 app.log | grep ERROR  # 看最近有没有报错

# 场景二：日志文件太大，找出访问最多的 IP
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# 场景三：找出并删除所有超过 7 天的日志文件
find /var/log -name "*.log" -mtime +7 -delete

# 场景四：批量替换多个文件中的字符串
sed -i 's/old-text/new-text/g' *.txt     # 当前目录所有 .txt 文件

# 场景五：查一个请求到底卡在哪一跳
curl -o /dev/null -s -w 'DNS %{time_namelookup}s | 连接 %{time_connect}s | 总计 %{time_total}s\\n' https://example.com</code></pre>

	      <h2>16. 让终端快起来的小技巧</h2>
	      <pre><code class="language-bash"># Ctrl+R：历史命令反向搜索——打几个字母就能翻出半年前敲过的长命令
# （再按 Ctrl+R 找上一条，Enter 执行，方向键修改）

# 别名：把长命令缩写写进 ~/.bashrc 或 ~/.zshrc
alias ll='ls -laF'
alias gs='git status'
alias taillog='tail -f /opt/app/logs/app.log'
source ~/.bashrc              # 改完立刻生效

# 其他高价值快捷键
# Ctrl+A / Ctrl+E   跳到行首 / 行尾
# Ctrl+U / Ctrl+K   删到行首 / 行尾
# Ctrl+C / Ctrl+L   中断当前命令 / 清屏（等价 clear）
# Tab × 2           列出所有可能的补全</code></pre>

	      <h2>小结</h2>
      <p>Linux 命令不需要死记硬背——<strong>记住最常用的 20 个</strong>（ls、cd、cat、less、tail、grep、find、chmod、ps、top、kill、df、du、free、ping、curl、ssh、scp、tar、vim），其余的遇到时查 <code>man</code>（manual）或 <code>--help</code> 就行。最重要的是<strong>理解两个理念</strong>：一是管道——通过组合简单命令完成复杂任务，这是 Linux 命令行真正的威力所在；二是"一切皆文件 + inode"——理解了文件名与内容的分离，链接、挂载、权限这些概念就通了。再往后的应用就是容器化（<a href="#/notes/docker-intro">Docker 入门</a>）和版本管理（<a href="#/notes/git-basics">Git 常用命令</a>），工具链是一脉相承的。</p>`;

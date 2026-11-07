// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Docker 容器化实战：从镜像构建到多容器编排</h1>

	      <p>"在我电脑上能跑啊"——这句话大概是软件开发史上最经典的甩锅台词。Docker 的出现就是为了解决这个根本问题：<strong>让应用在任何环境中以相同的方式运行</strong>。本文将带你从 Docker 的核心概念出发，逐步深入到镜像分层的原理、Dockerfile 的最佳实践、Docker Compose 编排多容器应用，以及生产环境的最佳实践与常见坑。</p>

	      <h2>1. Docker 解决了什么问题？</h2>
	      <p>在没有 Docker 的时代（其实也就是 2013 年以前），部署一个 Java Web 应用大概是这样的：</p>
	      <ol>
	          <li>在服务器上安装 JDK（版本必须和开发环境一致）。</li>
	          <li>安装 Tomcat（版本也得一致）。</li>
	          <li>配置环境变量、JVM 参数。</li>
	          <li>把 WAR 包放到 Tomcat 的 webapps 目录。</li>
	          <li>如果服务器上是旧版 JDK → "在我电脑上能跑啊" → 开始排查。</li>
	          <li>如果依赖了某个系统库（比如 ImageMagick 处理图片）→ 服务器上没装 → 继续排查。</li>
	      </ol>
	      <p><strong>Docker 的做法：</strong>把应用 + JDK + Tomcat + 系统库 + 所有依赖<strong>全部打包进一个镜像</strong>。这个镜像在你电脑上跑是什么样，在服务器上跑就是什么样。没有"环境不一致"这回事。</p>

	      <h2>2. 核心概念：镜像、容器、仓库</h2>
	      <table>
	          <tr>
	              <th>概念</th>
	              <th>解释</th>
	              <th>类比</th>
	          </tr>
	          <tr>
	              <td><strong>镜像（Image）</strong></td>
	              <td>一个只读模板，包含运行应用所需的一切（代码、运行时、库、配置）</td>
	              <td>一个虚拟机快照 / 一个安装盘 ISO</td>
	          </tr>
	          <tr>
	              <td><strong>容器（Container）</strong></td>
	              <td>镜像的运行实例，可以启动、停止、删除。每个容器是相互隔离的。</td>
	              <td>从安装盘启动的一台正在运行的虚拟机</td>
	          </tr>
	          <tr>
	              <td><strong>Dockerfile</strong></td>
	              <td>用来构建镜像的文本文件，包含一系列构建指令</td>
	              <td>一个说明书/配方</td>
	          </tr>
	          <tr>
	              <td><strong>仓库（Registry）</strong></td>
	              <td>存放和分发镜像的地方</td>
	              <td>应用商店（Docker Hub 就是最大的公共仓库）</td>
	          </tr>
	          <tr>
	              <td><strong>Docker Compose</strong></td>
	              <td>定义和运行多容器应用的工具</td>
	              <td>管弦乐队的指挥</td>
	          </tr>
	      </table>
	      <p><strong>容器 vs 虚拟机</strong>——一个高频疑问，一张表说清：</p>
	      <table>
	          <tr>
	              <th></th>
	              <th>虚拟机</th>
	              <th>容器</th>
	          </tr>
	          <tr><td>隔离方式</td><td>Hypervisor 虚拟出整套硬件，每个 VM 跑完整操作系统</td><td>共享宿主机内核，靠 Namespace（视图隔离）+ Cgroups（资源限额）隔离进程</td></tr>
	          <tr><td>启动速度</td><td>分钟级</td><td><strong>秒级甚至毫秒级</strong></td></tr>
	          <tr><td>体积</td><td>GB 级（整个 OS）</td><td>MB 级（只有应用和依赖）</td></tr>
	          <tr><td>性能损耗</td><td>有（硬件虚拟化）</td><td>接近原生</td></tr>
	          <tr><td>隔离强度</td><td><strong>强</strong>（内核都不同）</td><td>弱于 VM（共享内核，安全敏感场景要加裁剪）</td></tr>
	      </table>
	      <p>一句话：VM 隔离的是"机器"，容器隔离的是"进程与其视角"——轻量得多，也正因如此能在一台机器上高密度部署。</p>

	      <h2>3. 镜像分层：理解了它，一切都通了</h2>
	      <p>镜像不是一整块"压缩包"，而是<strong>一层层只读文件系统的叠加</strong>（UnionFS 联合文件系统）。Dockerfile 的每条指令生成一层：</p>
	      <pre><code class="language-plaintext">┌─────────────────────────────┐ ← 容器层（可写层：运行时的改动都落在这里，
│  Container (readable/writable)│   容器删除即消失——所以要持久化的数据用卷）
├─────────────────────────────┤
│  Layer 5: COPY app.jar       │ ← 只读层
├─────────────────────────────┤
│  Layer 4: RUN mvn package    │
├─────────────────────────────┤
│  Layer 3: COPY pom.xml       │
├─────────────────────────────┤
│  Layer 2: WORKDIR /build     │
├─────────────────────────────┤
│  Layer 1: FROM eclipse-temurin │ ← 基础镜像（可以被所有项目共享复用）
└─────────────────────────────┘</code></pre>
	      <p>分层带来三个关键性质：</p>
	      <ul>
	          <li><strong>缓存复用</strong>：构建时某一层的输入没变（指令 + 上下文文件都没变），直接用缓存——改一行 Java 代码，pom.xml 那层以下全部命中缓存，秒级完成构建；</li>
	          <li><strong>层间共享</strong>：100 个用同一个基础镜像的应用，宿主机上只存一份基础层；</li>
	          <li><strong>层是只读的</strong>：后面一层删文件只是"标记删除"，前一层的内容还在镜像里——所以"先装包再删"的写法瘦不了身，必须同层完成（第 8 节的瘦身细节）。</li>
	      </ul>
	      <p>想看一张镜像每层的指令和大小：<code>docker history myapp:1.0</code>——哪层胖了一目了然。</p>

	      <h2>4. 常用 Docker 命令速查</h2>
	      <pre><code class="language-bash"># ====== 镜像操作 ======
docker images                              # 查看本地所有镜像
docker pull nginx:latest                   # 从 Docker Hub 拉取镜像
docker pull nginx:1.25-alpine              # 拉取特定版本（Alpine 版极小，只有约 5MB！）
docker rmi nginx:latest                    # 删除镜像
docker build -t myapp:1.0 .               # 从当前目录的 Dockerfile 构建镜像

# ====== 容器操作 ======
docker ps                                  # 查看运行中的容器
docker ps -a                               # 查看所有容器（包括已停止的）
docker run -d -p 8080:80 --name my-nginx nginx  # 运行容器
#     -d: 后台运行（detach）
#     -p 8080:80: 主机 8080 映射到容器的 80 端口
#     --name: 给容器取名
docker stop my-nginx                       # 停止容器
docker start my-nginx                      # 启动已停止的容器
docker restart my-nginx                    # 重启容器
docker rm my-nginx                         # 删除容器（必须先停止）
docker rm -f my-nginx                      # 强制删除（运行中的也直接删）
docker logs -f my-nginx                    # 查看容器日志（-f 实时跟踪，--tail 100 最近 100 行）

# ====== 观察 ======
docker stats                               # 所有容器的实时 CPU/内存/网络占用
docker inspect my-nginx                    # 查看容器完整元数据（IP/挂载/环境变量）
docker top my-nginx                        # 容器内的进程列表

# ====== 进入容器内部调试 ======
docker exec -it my-nginx /bin/bash         # 进入容器的 bash（Alpine 用 /bin/sh）

# ====== 文件复制 ======
docker cp app.log my-nginx:/tmp/           # 宿主机 → 容器
docker cp my-nginx:/etc/nginx/nginx.conf ./ # 容器 → 宿主机

# ====== 清理 ======
docker system prune -a                     # 清理所有未使用的镜像、容器、网络、构建缓存
docker system df                           # 查看 Docker 占用了多少磁盘</code></pre>

	      <h2>5. 编写高质量的 Dockerfile</h2>
	      <p>以 Spring Boot 应用为例，先看一个"能用但不够好"的版本，再看优化后的版本：</p>

	      <pre><code class="language-bash"># === 基础版（能用，但镜像比较大） ===
FROM openjdk:17
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]</code></pre>

	      <pre><code class="language-bash"># === 优化版（利用多阶段构建，镜像更小更安全） ===
# 第一阶段：构建
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline       # 先下载依赖（利用 Docker 缓存层）
COPY src ./src
RUN mvn package -DskipTests

# 第二阶段：运行（只保留运行需要的）
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app &amp;&amp; adduser -S app -G app   # 非 root 用户运行
USER app
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-XX:+UseZGC", "-jar", "app.jar"]</code></pre>
	      <p>前端项目的多阶段构建是同一个思路（构建产物是静态文件，运行阶段只需要 Nginx）：</p>
	      <pre><code class="language-bash">FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci                      # 先装依赖吃缓存，源码改动不重装
COPY . .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=build /app/dist /usr/share/nginx/html   # 只要静态产物
EXPOSE 80</code></pre>

	      <h3>Dockerfile 最佳实践清单：</h3>
	      <ul>
	          <li><strong>多阶段构建：</strong>构建阶段用 Maven/Gradle 镜像（含 JDK + 构建工具），运行阶段只用 JRE 镜像。最终的运行镜像能瘦身 50% 以上。</li>
	          <li><strong>利用构建缓存：</strong>先 COPY 不常变的文件（如 pom.xml），再 COPY 源码。<strong>层的顺序 = 缓存的命中预期</strong>，最常变的放最后。</li>
	          <li><strong>用特定版本标签：</strong><code>FROM openjdk:17</code> 危险——你不知道具体是哪个小版本，且每次构建可能拉到不同版本。用 <code>FROM eclipse-temurin:21-jre-alpine</code>。</li>
	          <li><strong>非 root 用户运行：</strong>默认容器内是 root 用户，有安全风险。创建专用用户来运行应用。</li>
	          <li><strong>添加 HEALTHCHECK：</strong>告诉 Docker 如何判断容器是否健康，配合编排工具做自动恢复。</li>
	          <li><strong>使用 .dockerignore：</strong>类似 .gitignore（见 <a href="#/notes/git-basics">Git 篇</a>），排除 node_modules、.git、target 等大目录，避免它们被 COPY 进镜像。</li>
	          <li><strong>CMD 与 ENTRYPOINT 的分工：</strong>ENTRYPOINT 写死主程序，CMD 提供默认参数（<code>docker run 镜像 --help</code> 里的参数会替换 CMD 追加到 ENTRYPOINT 后）。</li>
	      </ul>

	      <h2>6. Docker Compose：编排多容器应用</h2>
	      <p>一个典型的 Web 应用通常需要：Web 服务 + 数据库 + 缓存 + 消息队列。Docker Compose 用一个 YAML 文件定义所有这些服务：</p>
	      <pre><code class="language-bash"># docker-compose.yml
services:
  # Spring Boot 应用
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/mydb
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: \${DB_PASSWORD}  # 用环境变量，不写在文件里
      SPRING_REDIS_HOST: redis
    depends_on:
      db:
        condition: service_healthy   # 等 MySQL 健康检查通过再启动
      redis:
        condition: service_started
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M               # 资源限额（老版本用 mem_limit/cpuset）
          cpus: '1.0'

  # MySQL 数据库
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: \${DB_PASSWORD}
      MYSQL_DATABASE: mydb
    volumes:
      - mysql_data:/var/lib/mysql    # 持久化数据
    ports:
      - "3306:3306"
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis 缓存
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

volumes:
  mysql_data:     # 命名卷，数据不会因容器删除而丢失
  redis_data:</code></pre>
	      <p>（新版 Compose 已不再强制 <code>version:</code> 字段，写上会有 warning。）</p>

	      <pre><code class="language-bash"># Docker Compose 常用命令
docker compose up -d              # 启动所有服务（-d 后台）
docker compose down               # 停止并删除所有服务
docker compose down -v            # 同时删除数据卷（慎用！）
docker compose logs -f app        # 查看 app 服务的日志
docker compose restart app        # 重启单个服务
docker compose ps                 # 查看所有服务状态
docker compose up -d --build app  # 改完代码重建并只更新 app 服务</code></pre>

	      <h2>7. Docker 网络：容器之间怎么通信？</h2>
	      <p>Docker Compose 默认会创建一个 bridge 网络，所有服务加入同一个网络后，可以通过<strong>服务名</strong>互相访问。比如 app 容器里可以用 <code>jdbc:mysql://db:3306/mydb</code> 连接数据库，<code>db</code> 会被自动解析为 MySQL 容器的 IP——这就是 Compose 里不用写 IP、只写服务名的原因（内建了 DNS）。</p>
	      <p><strong>常见的网络模式：</strong></p>
	      <ul>
	          <li><strong>bridge（默认）：</strong>容器连接到一个虚拟网桥，各自有独立 IP，通过端口映射对外暴露。</li>
	          <li><strong>host：</strong>容器直接使用宿主机网络，性能最好但失去了网络隔离。</li>
	          <li><strong>none：</strong>容器没有网络，适合不需要网络的批处理任务。</li>
	      </ul>
	      <p>排查连通性的套路：容器 A 访问不到容器 B 时，先 <code>docker exec -it A sh</code> 进去，<code>ping B</code>（网络通不通）、<code>nc -zv db 3306</code>（端口开没开）——配合 <a href="#/notes/linux-commands">Linux 命令</a>的网络三件套，九成问题当场定位。另外记住一个常见误区：<strong>容器里访问 localhost 是容器自己</strong>，跨容器用服务名/IP，访问宿主机服务用 <code>host.docker.internal</code>。</p>

	      <h2>8. 数据持久化：容器删了数据不能丢</h2>
	      <p>容器是无状态的——删除容器后，容器内的所有数据都会丢失。要保留数据，必须用<strong>数据卷（Volume）</strong>或<strong>绑定挂载（Bind Mount）</strong>：</p>
	      <ul>
	          <li><strong>Volume（推荐）：</strong>Docker 管理，存储在 <code>/var/lib/docker/volumes/</code>，与宿主机文件系统解耦。跨平台、可备份、可共享。</li>
	          <li><strong>Bind Mount：</strong>把宿主机的一个目录挂载到容器中（<code>-v /host/path:/container/path</code>）。适合开发环境（改代码即时生效），但不适合生产（路径耦合宿主机）。</li>
	      </ul>
	      <p>判断铁律：<strong>数据库、上传文件这类"状态"，必须有卷；应用本身保持无状态</strong>，状态外置到数据库/缓存/对象存储——这样扩缩容和重启才没有后顾之忧。</p>

	      <h2>9. 镜像瘦身技巧</h2>
	      <ul>
	          <li><strong>选 Alpine 版本的基础镜像：</strong><code>eclipse-temurin:21-jre-alpine</code> 比 <code>openjdk:17</code> 小几倍。</li>
	          <li><strong>合并 RUN 命令：</strong>每个 RUN 产生一个新层，合并后减少层数。用 <code>&amp;&amp;</code> 连接多个命令，最后 <code>rm -rf /var/cache/apk/*</code> 清理包管理器缓存。<strong>注意：写在后面一层的 rm 删不掉前面层里的文件</strong>（层是只读叠加的，删只是标记），清理必须与安装写在同一条 RUN 里。</li>
	          <li><strong>.dockerignore 排除无关文件：</strong>node_modules、.git、target、*.md 等构建时不需要的文件。</li>
	          <li><strong>多阶段构建：</strong>把编译和运行分开，最终的镜像只包含运行时依赖。</li>
	          <li><strong>验收工具：</strong><code>docker history myapp:1.0</code> 逐层看大小，谁胖了优化谁；<code>dive myapp:1.0</code>（第三方工具）能逐层看文件变化。</li>
	      </ul>

	      <h2>10. 生产环境常见坑</h2>
	      <table>
	          <tr>
	              <th>坑</th>
	              <th>现象</th>
	              <th>解决</th>
	          </tr>
	          <tr><td>容器时区是 UTC</td><td>日志时间差 8 小时</td><td>环境变量 <code>TZ=Asia/Shanghai</code>，或挂载 <code>/etc/localtime</code></td></tr>
	          <tr><td>日志膨胀打满磁盘</td><td>json-file 日志无限增长</td><td><code>--log-opt max-size=10m --log-opt max-file=3</code> 限制轮转</td></tr>
	          <tr><td>强杀进程丢请求</td><td>stop 等 10 秒后直接 SIGKILL</td><td>应用正确处理 SIGTERM（Spring Boot 默认支持优雅停机，配置 <code>server.shutdown: graceful</code>）</td></tr>
	          <tr><td>JVM 在容器里内存算错</td><td>按宿主机内存算堆导致 OOMKilled</td><td>JDK 10+ 默认感知容器限额；再显式设 <code>-XX:MaxRAMPercentage=75</code></td></tr>
	          <tr><td>容器内 localhost 误区</td><td>容器里访问 localhost 连不上别人的服务</td><td>localhost 是容器自己；跨容器用服务名/IP，访问宿主机用 <code>host.docker.internal</code></td></tr>
	          <tr><td>没做资源限额</td><td>一个容器吃光内存拖垮宿主机</td><td><code>--memory</code> / <code>--cpus</code> 或 compose 的 deploy.resources</td></tr>
	      </table>

	      <h2>11. 进 CI/CD：一条完整的构建发布流水线</h2>
	      <p>Docker 在 CI 里的角色是"交付标准品"——构建出带版本号的镜像推到仓库，部署端只负责拉取运行。GitHub Actions 的完整例子：</p>
	      <pre><code class="language-bash"># .github/workflows/deploy.yml 核心 step
- name: Build &amp; Push image
  run: |
    docker build -t registry.example.com/myapp:\${{ github.sha }} .
    docker login registry.example.com -u \${{ secrets.REG_USER }} -p \${{ secrets.REG_PASS }}
    docker push registry.example.com/myapp:\${{ github.sha }}

- name: Deploy (SSH 到服务器更新)
  run: |
    ssh deploy@server "cd /opt/app &amp;&amp; \\
      IMAGE=registry.example.com/myapp:\${{ github.sha }} docker compose up -d"</code></pre>
	      <p>注意镜像标签用 <strong>git commit SHA</strong> 而不是固定 latest：每个版本可追溯、可秒级回滚（把镜像 tag 换回上一个 SHA 重新 up 即可）。Docker 学习顺序的最后一步通常是 Kubernetes——那是"一台机器装不下、多机调度"阶段的事，把单机容器化先做扎实。</p>

	      <h2>小结</h2>
	      <p>Docker 是云原生时代的基石技术。<strong>学会 Docker，你的应用可以以相同的方式在任何地方运行</strong>——本地开发、测试环境、生产服务器、Kubernetes 集群。本文覆盖了日常开发中最常用的场景：镜像分层原理、从基础命令到 Dockerfile 编写，再到 Compose 多容器编排与生产避坑。掌握这些，你已经能应对 90% 的容器化需求。</p>
	      <p>运维命令的细节都可以在 <a href="#/notes/linux-commands">Linux 命令速查</a>里找到对应；"为什么镜像能秒启"的底层，是操作系统进程隔离这堂老课的新包装。</p>`;

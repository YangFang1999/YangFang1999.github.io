// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Spring Boot 快速入门：从零搭建你的第一个 RESTful API</h1>

	      <p>如果说 Java 是企业级开发的标准语言，那 Spring Boot 就是 Java 企业开发的"标准起手式"。它解决了传统 Spring 项目配置繁琐、依赖管理混乱、部署复杂三大痛点，让你能用几分钟而不是几天来启动一个新项目。本文从实际开发角度出发，带你走完从项目创建到写出第一个 CRUD 接口的全流程，并把事务、校验这些"第一天就会用到、第一天就踩坑"的部分一次讲清。</p>

	      <h2>1. Spring Boot 解决了什么问题？</h2>
	      <p>在 Spring Boot 出现之前（大约 2014 年之前），搭建一个 Spring Web 项目有多痛苦？</p>
	      <ul>
	          <li>你需要手动配置 web.xml（Servlet 3.0 之后可以不用，但遗留项目大量存在）。</li>
	          <li>你需要手动管理几十个 Maven 依赖的版本兼容性（Spring Core、Spring MVC、Spring JDBC……版本不一致直接报错）。</li>
	          <li>你需要配置 DispatcherServlet、视图解析器、事务管理器、数据源……每一个都要写一大段 XML 或 Java Config。</li>
	          <li>部署时要打 WAR 包，放到 Tomcat 的 webapps 目录下，Tomcat 版本和项目里用到的 Servlet API 版本还得匹配。</li>
	      </ul>
	      <p>Spring Boot 做了一件革命性的事：<strong>"约定优于配置"（Convention over Configuration）</strong>。它通过 Starter 依赖统一管理版本、通过自动配置（Auto Configuration）按需装配 Bean、通过内嵌 Tomcat 让应用直接以 JAR 包运行。你只需关注业务代码。</p>

	      <h2>2. Spring Boot 的核心特性</h2>
	      <table>
	          <tr>
	              <th>特性</th>
	              <th>说明</th>
	              <th>解决了什么</th>
	          </tr>
	          <tr>
	              <td><strong>起步依赖（Starter）</strong></td>
	              <td>一个 Starter 聚合一组相关依赖，如 <code>spring-boot-starter-web</code> 自动引入 Spring MVC + Jackson + Tomcat</td>
	              <td>依赖地狱</td>
	          </tr>
	          <tr>
	              <td><strong>自动配置</strong></td>
	              <td>根据 classpath 中的 jar 自动配置 Bean，如检测到 H2 数据库的 jar 就自动配好 DataSource</td>
	              <td>繁琐的手动配置</td>
	          </tr>
	          <tr>
	              <td><strong>内嵌服务器</strong></td>
	              <td>内嵌 Tomcat/Jetty/Undertow，打成一个 fat JAR 直接 <code>java -jar</code> 运行</td>
	              <td>部署 WAR 包 + 配置独立 Servlet 容器</td>
	          </tr>
	          <tr>
	              <td><strong>Actuator</strong></td>
	              <td>生产就绪的监控端点：健康检查、指标、环境信息、线程 dump 等</td>
	              <td>线上问题排查困难</td>
	          </tr>
	          <tr>
	              <td><strong>外部化配置</strong></td>
	              <td>通过 application.yml / 环境变量 / 命令行参数覆盖配置，不同环境无需改代码</td>
	              <td>多环境配置管理</td>
	          </tr>
	      </table>

	      <h2>3. 自动配置的原理：它是怎么"猜"到你要什么的</h2>
	      <p>理解自动配置，只需要记住一个机制：<strong>条件化装配</strong>。自动配置类里全是条件注解：</p>
	      <pre><code class="language-java">@AutoConfiguration
@ConditionalOnClass(DataSource.class)        // 类路径上有 DataSource 这个类才生效
@ConditionalOnMissingBean(DataSource.class)  // 用户自己没配 DataSource 才用默认的
public class DataSourceAutoConfiguration {
    // 按约定从 application.yml 读 spring.datasource.* 创建数据源
}</code></pre>
	      <p>链条串起来：<code>@SpringBootApplication</code> 里的 <code>@EnableAutoConfiguration</code> → 加载所有 jar 包里 <code>META-INF/spring/...AutoConfiguration.imports</code> 登记的配置类清单 → 逐个检查条件注解（类在不在、用户有没有自己配）→ 条件满足的才注册成 Bean。所以<strong>"引入 spring-boot-starter-data-redis 就能直接用 StringRedisTemplate"</strong>不是魔法，是"检测到 Redis 客户端类 → 帮你建好连接工厂和模板"的条件装配。想看最终生效了哪些：启动加 <code>--debug</code>，条件评估报告（CONDITIONS EVALUATION REPORT）一目了然。</p>

	      <h2>4. 创建你的第一个 Spring Boot 项目</h2>
	      <p>推荐两种方式：</p>
	      <ol>
	          <li><strong>Spring Initializr（在线生成）：</strong>打开 <code>start.spring.io</code>，选择 Maven、Java、Spring Boot 版本（选最新的稳定版），添加 <strong>Spring Web</strong> 和 <strong>Lombok</strong> 依赖，点击 Generate 下载 ZIP 包，解压后用 IDEA 打开。</li>
	          <li><strong>IDEA 内置创建：</strong>New Project → Spring Initializr → 勾选 Spring Web → 完成。IDEA 会直接生成并打开项目。</li>
	      </ol>
	      <p>生成后的项目结构：</p>
	      <pre><code class="language-bash">demo/
├── src/
│   ├── main/java/com/example/demo/
│   │   ├── controller/               # Web 层：接收请求、校验参数、返回响应
│   │   ├── service/                  # 业务层：业务逻辑、事务边界
│   │   ├── repository/               # 数据层：访问数据库
│   │   └── DemoApplication.java      # 启动类（有 @SpringBootApplication 注解）
│   └── main/resources/
│       ├── application.yml            # 配置文件
│       ├── static/                    # 静态资源（HTML, CSS, JS）
│       └── templates/                 # 模板文件（Thymeleaf 等）
├── pom.xml                            # Maven 配置（已自动引入父 POM 和 Starter）
└── mvnw / mvnw.cmd                    # Maven Wrapper（无需预装 Maven）</code></pre>
	      <p><strong>关键：</strong><code>DemoApplication.java</code> 上的 <code>@SpringBootApplication</code> 注解是一个组合注解，它等价于：<code>@SpringBootConfiguration</code> + <code>@EnableAutoConfiguration</code> + <code>@ComponentScan</code>。三合一，一个注解搞定配置。分层纪律：Controller 不写业务、Service 不拼 SQL、每层的返回对象不直接透传（实体不裸奔出 Service 层，用 DTO/VO 隔离——避免加字段时把密码散列这种内部结构漏给前端）。</p>

	      <h2>5. 编写第一个 REST API</h2>
	      <pre><code class="language-java">// UserController.java
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // 构造器注入（推荐，比 @Autowired 字段注入更容易测试）
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List&lt;UserVO&gt; list() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public UserVO getById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserVO create(@RequestBody @Valid UserCreateRequest request) {
        return userService.create(request);
    }

    @PutMapping("/{id}")
    public UserVO update(@PathVariable Long id, @RequestBody @Valid UserUpdateRequest request) {
        return userService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}</code></pre>

	      <h3>关键注解解释：</h3>
	      <ul>
	          <li><code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code>，表示这个类的每个方法返回值都直接序列化为 JSON 写入 HTTP 响应体。</li>
	          <li><code>@RequestMapping("/api/users")</code> 定义了这个 Controller 下所有接口的 URL 前缀。</li>
	          <li><code>@GetMapping</code>、<code>@PostMapping</code> 等是 <code>@RequestMapping(method = ...)</code> 的简写，语义更清晰。</li>
	          <li><code>@PathVariable</code> 从 URL 路径中提取参数（如 <code>/api/users/5</code> 中的 5）。</li>
	          <li><code>@RequestBody</code> 把 HTTP 请求体的 JSON 字符串自动反序列化为 Java 对象。</li>
	          <li><code>@Valid</code> 触发参数校验（需要配合 Jakarta Validation 注解使用，见下节）。</li>
	          <li><code>@ResponseStatus(HttpStatus.CREATED)</code> 自定义 HTTP 响应状态码（默认 200，创建资源应返回 201）。</li>
	      </ul>

	      <h2>6. 参数校验：把 if-else 挡在门口</h2>
	      <p>请求参数的合法性检查不要手写在业务里，用 Bean Validation 注解声明式完成：</p>
	      <pre><code class="language-java">public record UserCreateRequest(
    @NotBlank(message = "用户名不能为空")
    @Size(min = 2, max = 20, message = "用户名长度 2~20")
    String name,

    @NotBlank @Email(message = "邮箱格式不正确")
    String email,

    @Min(value = 0, message = "年龄不能为负数")
    @Max(150)
    Integer age
) {}</code></pre>
	      <table>
	          <tr>
	              <th>注解</th>
	              <th>校验内容</th>
	          </tr>
	          <tr><td>@NotNull / @NotBlank / @NotEmpty</td><td>非 null / 非空白字符串 / 非空集合</td></tr>
	          <tr><td>@Size / @Length</td><td>长度（集合或字符串）</td></tr>
	          <tr><td>@Min / @Max / @Range</td><td>数值范围</td></tr>
	          <tr><td>@Email / @Pattern(regexp=...)</td><td>格式（邮箱 / 自定义正则）</td></tr>
	          <tr><td>@Past / @Future</td><td>时间在过去 / 在未来</td></tr>
	      </table>
	      <p>校验失败的异常由下一节的全局异常处理器统一翻译成 400 响应——业务代码零侵入。</p>

	      <h2>7. 全局异常处理与统一响应体</h2>
	      <p>用 <code>@RestControllerAdvice</code> 统一处理异常，Controller 层代码会干净很多；再配合统一响应包装，前端拿到的结构永远一致：</p>
	      <pre><code class="language-java">// 统一响应体
public record ApiResponse&lt;T&gt;(int code, String message, T data) {
    public static &lt;T&gt; ApiResponse&lt;T&gt; ok(T data) { return new ApiResponse&lt;&gt;(0, "success", data); }
    public static ApiResponse&lt;Void&gt; error(int code, String msg) { return new ApiResponse&lt;&gt;(code, msg, null); }
}

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse&lt;Void&gt; handleNotFound(ResourceNotFoundException ex) {
        return ApiResponse.error(404, ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse&lt;Void&gt; handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -&gt; e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining("; "));
        return ApiResponse.error(400, msg);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse&lt;Void&gt; handleOther(Exception ex) {
        // 生产环境别把堆栈细节吐给前端，日志里记全即可
        log.error("unhandled exception", ex);
        return ApiResponse.error(500, "服务器内部错误");
    }
}</code></pre>
	      <p>这样，Controller 里就不用写 try-catch 了——业务代码抛异常，全局异常处理器自动拦截并返回结构化的 JSON 错误响应。</p>

	      <h2>8. @Transactional 与它的失效现场</h2>
	      <p>事务是 Service 层的标配：<code>@Transactional</code> 一加，方法内多条数据库操作要么全成、要么全滚（原理见 <a href="#/notes/mysql-txn-lock">MySQL 事务与锁</a>）。但它有几个著名的"不生效"场景，每一个都来自同一根源——<strong>事务由 AOP 代理实现，绕过代理 = 绕过事务</strong>：</p>
	      <table>
	          <tr>
	              <th>失效场景</th>
	              <th>原因</th>
	              <th>修复</th>
	          </tr>
	          <tr><td>同类中 this 调用</td><td><code>this.methodB()</code> 走的是原对象，不经过代理</td><td>拆到另一个 Bean，或注入自身代理</td></tr>
	          <tr><td>方法不是 public</td><td>代理只拦截 public 方法</td><td>改 public</td></tr>
	          <tr><td>异常被 try-catch 吃掉</td><td>代理看不到异常，以为一切正常</td><td>抛出去，或 <code>TransactionAspectSupport.currentTransactionStatus().setRollbackOnly()</code></td></tr>
	          <tr><td>默认只回滚 RuntimeException</td><td>受检异常（如 IOException）默认不回滚</td><td><code>@Transactional(rollbackFor = Exception.class)</code>（建议养成习惯）</td></tr>
	          <tr><td>类没被 Spring 管理</td><td>自己 new 的对象没有代理</td><td>交给容器管理</td></tr>
	      </table>
	      <p>另外记住两条事务纪律：<strong>① 事务里不要调 RPC/发消息</strong>（拖长事务，见<a href="#/notes/mysql-txn-lock">长事务的危害</a>）；<strong>② 事务边界在 Service，粒度到方法级</strong>，只读接口加 <code>@Transactional(readOnly = true)</code> 让驱动和连接池做优化。</p>

	      <h2>9. application.yml 与多环境配置</h2>
	      <pre><code class="language-bash">server:
  port: 8080                          # 服务端口

spring:
  application:
    name: demo                        # 应用名（注册到注册中心时用）
  datasource:
    url: jdbc:mysql://localhost:3306/mydb?useSSL=false&amp;serverTimezone=Asia/Shanghai
    username: root
    password: \${DB_PASSWORD}          # 敏感信息用环境变量！
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate              # 生产用 validate，开发可用 update
    show-sql: true                    # 打印 SQL（开发环境开，生产关）

# Actuator 配置
management:
  endpoints:
    web:
      exposure:
        include: health,info          # 生产只暴露必要的端点</code></pre>
	      <p>多环境用 <strong>profile</strong> 组织——主配置里 <code>spring.profiles.active</code> 切换，差异项放进各自的 profile 文件：</p>
	      <pre><code class="language-bash">application.yml            # 公共配置 + 默认激活的环境
application-dev.yml        # 开发：本地数据库、show-sql、 Debug 日志
application-prod.yml       # 生产：环境变量取密码、日志关闭 SQL、Actuator 收紧

# 激活方式三选一：
java -jar app.jar --spring.profiles.active=prod
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
spring.profiles.active: prod   # 写在 application.yml（本地开发常用）</code></pre>
	      <p><strong>重要提醒：</strong>不要把数据库密码直接写在 application.yml 里提交到 Git！使用环境变量 <code>\${DB_PASSWORD}</code> 或配置中心（Nacos / Vault）。同一原则见 <a href="#/notes/git-basics">Git 篇</a>的 .gitignore 一节。</p>

	      <h2>10. 运行与打包</h2>
	      <pre><code class="language-bash"># 开发模式运行（热重载，改代码自动重启）
mvn spring-boot:run

# 打包成可执行的 JAR 文件
mvn clean package -DskipTests

# 运行 JAR 包
java -jar target/demo-0.0.1-SNAPSHOT.jar

# 指定 profile（比如用生产环境配置）
java -jar target/demo-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# 覆盖配置项
java -jar target/demo-0.0.1-SNAPSHOT.jar --server.port=9090</code></pre>
	      <p>服务器上让它常驻，用 systemd 或 <code>nohup ... &amp;</code>（命令见 <a href="#/notes/linux-commands">Linux 命令</a>第 6、10 节）；容器化部署见 <a href="#/notes/docker-intro">Docker 入门</a>。</p>

	      <h2>11. Spring Boot 3.x 的重要变化</h2>
	      <ul>
	          <li><strong>最低 Java 17：</strong>Spring Boot 3.x 不再支持 Java 8 和 11。如果你在维护老项目，需要先升级 JDK。</li>
	          <li><strong>Jakarta EE 替换 Java EE：</strong>所有 <code>javax.*</code> 包名改为 <code>jakarta.*</code>（如 <code>javax.servlet</code> → <code>jakarta.servlet</code>）。这是最大的迁移成本。</li>
	          <li><strong>GraalVM 原生镜像支持：</strong>可以将 Spring Boot 应用编译为原生可执行文件，启动时间从秒级降到毫秒级，适合 Serverless 场景。</li>
	          <li><strong>虚拟线程支持（Java 21 + Spring Boot 3.2+）：</strong>开启 <code>spring.threads.virtual.enabled=true</code> 即可使用虚拟线程处理 HTTP 请求。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>Spring Boot 的精髓在三个词：<strong>简化、约定、自动</strong>。它把 Spring 生态的复杂性封装成一套开箱即用的框架，让你能把精力集中在业务逻辑上而不是配置上。本文覆盖了开发中最常用的场景——REST 接口、参数校验、异常处理、事务、多环境配置。掌握了这些，你已经能独立完成 80% 的后端 CRUD 需求了。再往深一层，框架里到处是<a href="#/notes/design-patterns">设计模式</a>的身影（IoC 是工厂、AOP 是代理、事件是观察者），读它就是最好的模式教材。</p>
	      <p>接下来值得深入的方向：Spring Security（认证授权）、Spring Data JPA / MyBatis（持久层）、Spring Cloud（微服务）、以及自动化测试（单元测试 + 集成测试）。</p>`;

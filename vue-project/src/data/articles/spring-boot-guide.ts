// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Spring Boot 快速入门：从零搭建你的第一个 RESTful API</h1>

	      <p>如果说 Java 是企业级开发的标准语言，那 Spring Boot 就是 Java 企业开发的"标准起手式"。它解决了传统 Spring 项目配置繁琐、依赖管理混乱、部署复杂三大痛点，让你能用几分钟而不是几天来启动一个新项目。本文从 IoC 的思想根源讲起，带你走完从项目创建到 REST 接口、事务、AOP、测试的全流程，并把"第一天就会用到、第一天就踩坑"的部分一次讲清。</p>

	      <h2>1. Spring Boot 解决了什么问题？</h2>
	      <p>在 Spring Boot 出现之前（大约 2014 年之前），搭建一个 Spring Web 项目有多痛苦？</p>
	      <ul>
	          <li>你需要手动配置 web.xml（Servlet 3.0 之后可以不用，但遗留项目大量存在）。</li>
	          <li>你需要手动管理几十个 Maven 依赖的版本兼容性（Spring Core、Spring MVC、Spring JDBC……版本不一致直接报错）。</li>
	          <li>你需要配置 DispatcherServlet、视图解析器、事务管理器、数据源……每一个都要写一大段 XML 或 Java Config。</li>
	          <li>部署时要打 WAR 包，放到 Tomcat 的 webapps 目录下，Tomcat 版本和项目里用到的 Servlet API 版本还得匹配。</li>
	      </ul>
	      <p>Spring Boot 做了一件革命性的事：<strong>"约定优于配置"（Convention over Configuration）</strong>。它通过 Starter 依赖统一管理版本、通过自动配置（Auto Configuration）按需装配 Bean、通过内嵌 Tomcat 让应用直接以 JAR 包运行。你只需关注业务代码。</p>

	      <h2>2. 核心特性一览</h2>
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

	      <h2>3. 先补课：IoC 与 DI 到底是什么</h2>
	      <p>用 Spring 之前必须想清楚它的出发点。<strong>控制反转（IoC）</strong>说的是"对象的创建和装配权"从你的代码反转给了容器。没有容器时，类自己 new 依赖：</p>
	      <pre><code class="language-java">// 手工时代：每个类自己拉依赖，改实现 = 全项目改 new
public class OrderService {
    private MySQLOrderDao dao = new MySQLOrderDao();   // 写死了实现
    private SendGridMail mailer = new SendGridMail();  // 测试时也会真发邮件！
}</code></pre>
	      <p><strong>依赖注入（DI）</strong>把方向反过来：类只声明"我需要什么类型"，容器负责创建和塞进来：</p>
	      <pre><code class="language-java">@Service
public class OrderService {
    private final OrderDao dao;          // 依赖抽象（接口）
    private final MailSender mailer;

    public OrderService(OrderDao dao, MailSender mailer) {   // 构造器注入（推荐）
        this.dao = dao;
        this.mailer = mailer;
    }
}</code></pre>
	      <p>三个直接收益：<strong>可替换</strong>（MySQL 换 PG，改一个实现类；配置换 DataSource 而已）、<strong>可测试</strong>（单测时注入 Mock 实现，不用起真数据库）、<strong>可治理</strong>（事务、日志、监控这些横切能力由容器统一织入）。<strong>Bean</strong> 就是"被容器管理的对象"，容器像一张注册表维护它们的名字、类型、生命周期和相互依赖。</p>
	      <h3>Bean 的生命周期（面试高频）</h3>
	      <pre><code class="language-plaintext">实例化（调构造器）→ 属性注入（@Autowired 填充依赖）
→ Aware 回调（BeanNameAware 等）→ BeanPostProcessor 前置处理
→ @PostConstruct 初始化 → 可用…… → 容器关闭 → @PreDestroy 销毁</code></pre>
	      <p>两个最常用的挂钩：<code>@PostConstruct</code>（依赖注入完成后做初始化，如预热缓存）和 <code>@PreDestroy</code>（优雅关停时释放资源）。AOP 代理对象也是 BeanPostProcessor 在这一阶段包出来的——记住"事务失效"很多都和"绕过代理"有关（第 8 节）。</p>

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
	      <h3>常用 Bean 注解与作用域</h3>
	      <table>
	          <tr>
	              <th>注解</th>
	              <th>用途</th>
	          </tr>
	          <tr><td>@Component / @Service / @Repository / @Controller</td><td>类扫描注册：通用组件 / 业务层 / 数据层 / Web 层（本质相同，语义区分）</td></tr>
	          <tr><td>@Configuration + @Bean</td><td>第三方类的注册入口（人家的类没法加 @Component）：方法返回值注册为 Bean</td></tr>
	          <tr><td>@Autowired / 构造器注入</td><td>注入依赖；<strong>推荐构造器注入</strong>（字段不可变、便于单测、能发现循环依赖）</td></tr>
	          <tr><td>@Value / @ConfigurationProperties</td><td>注入配置项 / 按前缀批量绑定配置类</td></tr>
	          <tr><td>@Scope("prototype")</td><td>默认单例；prototype 每次获取都新建（罕见需求）</td></tr>
	          <tr><td>@Primary / @Qualifier</td><td>同一接口多个实现时，指定默认者 / 按名字精确指定</td></tr>
	      </table>

	      <h2>5. 自动配置的原理：它是怎么"猜"到你要什么的</h2>
	      <p>理解自动配置，只需要记住一个机制：<strong>条件化装配</strong>。自动配置类里全是条件注解：</p>
	      <pre><code class="language-java">@AutoConfiguration
@ConditionalOnClass(DataSource.class)        // 类路径上有 DataSource 这个类才生效
@ConditionalOnMissingBean(DataSource.class)  // 用户自己没配 DataSource 才用默认的
public class DataSourceAutoConfiguration {
    // 按约定从 application.yml 读 spring.datasource.* 创建数据源
}</code></pre>
	      <p>链条串起来：<code>@EnableAutoConfiguration</code> → 加载所有 jar 包里 <code>META-INF/spring/...AutoConfiguration.imports</code> 登记的配置类清单 → 逐个检查条件注解（类在不在、用户有没有自己配）→ 条件满足的才注册成 Bean。所以<strong>"引入 spring-boot-starter-data-redis 就能直接用 StringRedisTemplate"</strong>不是魔法，是"检测到 Redis 客户端类 → 帮你建好连接工厂和模板"的条件装配。想看最终生效了哪些：启动加 <code>--debug</code>，条件评估报告（CONDITIONS EVALUATION REPORT）一目了然。</p>
	      <h3>动手写一个自定义 Starter（理解原理的终极练习）</h3>
	      <pre><code class="language-java">// ① 自动配置类：条件装配一个"问候服务"
@AutoConfiguration
@ConditionalOnClass(GreetingService.class)
@EnableConfigurationProperties(GreetProperties.class)
public class GreetAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean
    public GreetingService greetingService(GreetProperties props) {
        return new GreetingService(props.getPrefix());
    }
}

// ② 配置属性类：yml 里 greet.prefix 就能配
@ConfigurationProperties(prefix = "greet")
public class GreetProperties {
    private String prefix = "Hello";
    // getter/setter
}

// ③ 登记：src/main/resources/META-INF/spring/
//    org.springframework.boot.autoconfigure.AutoConfiguration.imports
//    文件里写一行：com.example.greet.GreetAutoConfiguration</code></pre>
	      <p>把这三件套打成 jar，别的项目引入这个 starter、在 yml 里配 <code>greet.prefix: "你好"</code> 就能用 GreetingService——你已经会造 Spring Boot 生态的"轮子"了，那些官方 starter 的原理一模一样。</p>

	      <h2>6. 编写第一个 REST API</h2>
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
	          <li><code>@PathVariable</code> 从 URL 路径中提取参数（如 <code>/api/users/5</code> 中的 5）；<code>@RequestParam</code> 从 query 参数取；<code>@RequestHeader</code> 取请求头。</li>
	          <li><code>@RequestBody</code> 把 HTTP 请求体的 JSON 字符串自动反序列化为 Java 对象。</li>
	          <li><code>@Valid</code> 触发参数校验（需要配合 Jakarta Validation 注解使用，见下节）。</li>
	          <li><code>@ResponseStatus(HttpStatus.CREATED)</code> 自定义 HTTP 响应状态码（默认 200，创建资源应返回 201）。</li>
	      </ul>

	      <h2>7. 参数校验：把 if-else 挡在门口</h2>
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

	      <h2>8. 全局异常处理与统一响应体</h2>
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

	      <h2>9. @Transactional 与它的失效现场</h2>
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

	      <h2>10. AOP 实战：一个能落地的日志切面</h2>
	      <p>AOP（面向切面编程）是"代理模式"的工业化：把日志、耗时这类横切逻辑从业务方法里抽出来，声明式织入。一个接口耗时统计切面，直接可抄：</p>
	      <pre><code class="language-java">@Aspect
@Component
public class ApiTimingAspect {

    // 切点：service 包下所有类的所有方法
    @Pointcut("execution(* com.example.demo.service..*(..))")
    public void serviceMethods() {}

    @Around("serviceMethods()")
    public Object time(ProceedingJoinPoint pjp) throws Throwable {
        String name = pjp.getSignature().toShortString();
        long start = System.currentTimeMillis();
        try {
            return pjp.proceed();                    // 执行原方法
        } finally {
            long cost = System.currentTimeMillis() - start;
            if (cost &gt; 500) {
                log.warn("慢方法 {} 耗时 {}ms", name, cost);
            }
        }
    }
}</code></pre>
	      <p>五种通知类型：@Before（前）、@AfterReturning（正常返回后）、@AfterThrowing（抛异常后）、@After（无论如何都执行）、@Around（全权代理，最常用）。<strong>过滤器 vs 拦截器 vs AOP</strong> 的分界也顺手理清：Filter 是 Servlet 规范层（编码/跨域/全局请求处理，最外层）、HandlerInterceptor 是 Spring MVC 层（登录态、权限预检，能拿到 handler 信息）、AOP 是 Bean 层（业务方法级织入，最贴近业务）——越往外越"基础设施"，越往内越"业务"。</p>

	      <h2>11. application.yml 与多环境配置</h2>
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
application-dev.yml        # 开发：本地数据库、show-sql、Debug 日志
application-prod.yml       # 生产：环境变量取密码、日志关闭 SQL、Actuator 收紧

# 激活方式三选一：
java -jar app.jar --spring.profiles.active=prod
SPRING_PROFILES_ACTIVE=prod java -jar app.jar
spring.profiles.active: prod   # 写在 application.yml（本地开发常用）</code></pre>
	      <p><strong>重要提醒：</strong>不要把数据库密码直接写在 application.yml 里提交到 Git！使用环境变量 <code>\${DB_PASSWORD}</code> 或配置中心（Nacos / Vault）。同一原则见 <a href="#/notes/git-basics">Git 篇</a>的 .gitignore 一节。</p>

	      <h2>12. 测试：@SpringBootTest 与 MockMvc</h2>
	      <p>Spring Boot 自带测试全家桶，一个接口测试的标准写法：</p>
	      <pre><code class="language-java">@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createUser_shouldReturn201() throws Exception {
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"alice\",\"email\":\"a@example.com\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.name").value("alice"));
    }

    @Test
    void createUser_blankName_shouldReturn400() throws Exception {
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"\",\"email\":\"a@example.com\"}"))
            .andExpect(status().isBadRequest());
    }
}</code></pre>
	      <p>MockMvc 发假 HTTP 请求不走真实端口、速度极快；配合 <code>@MockBean</code> 替换掉外部依赖（邮件、支付），就能对 Service 层做隔离测试。测试分层心法：<strong>单测测逻辑（不起容器，毫秒级）、切片测 Web 层（@WebMvcTest）、全量测集成（@SpringBootTest，少量）</strong>——全部用全量测试的项目，CI 会慢到没人愿意跑。</p>

	      <h2>13. 运行与打包</h2>
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
	      <p>服务器上让它常驻，用 systemd 或 <code>nohup ... &amp;</code>（命令见 <a href="#/notes/linux-commands">Linux 命令</a>第 7、11 节）；容器化部署见 <a href="#/notes/docker-intro">Docker 入门</a>。</p>

	      <h2>14. Spring Boot 3.x 的重要变化</h2>
	      <ul>
	          <li><strong>最低 Java 17：</strong>Spring Boot 3.x 不再支持 Java 8 和 11。如果你在维护老项目，需要先升级 JDK。</li>
	          <li><strong>Jakarta EE 替换 Java EE：</strong>所有 <code>javax.*</code> 包名改为 <code>jakarta.*</code>（如 <code>javax.servlet</code> → <code>jakarta.servlet</code>）。这是最大的迁移成本。</li>
	          <li><strong>GraalVM 原生镜像支持：</strong>可以将 Spring Boot 应用编译为原生可执行文件，启动时间从秒级降到毫秒级，适合 Serverless 场景。</li>
	          <li><strong>虚拟线程支持（Java 21 + Spring Boot 3.2+）：</strong>开启 <code>spring.threads.virtual.enabled=true</code> 即可使用虚拟线程处理 HTTP 请求。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>Spring Boot 的精髓在三个词：<strong>简化、约定、自动</strong>。往深一层说：IoC 把对象的创建权交给容器换来可替换与可测试；自动配置用条件装配把"引入依赖即拥有能力"变成现实；AOP 用代理把横切逻辑从业务里抽走；@Transactional 的所有坑都指向同一个根源——绕过代理。理解了这四条骨架，框架里到处是<a href="#/notes/design-patterns">设计模式</a>的身影（IoC 是工厂、AOP 是代理、事件是观察者），读它就是最好的模式教材。</p>
	      <p>接下来值得深入的方向：Spring Security（认证授权）、Spring Data JPA / MyBatis（持久层）、Spring Cloud（微服务）、以及自动化测试（单元测试 + 集成测试）。</p>`;

// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>设计模式入门：从单例到观察者，写出更优雅的代码</h1>

	      <p>设计模式（Design Patterns）是软件开发中<strong>经过反复验证的、可复用的解决方案</strong>。它们不是具体的代码，而是解决某类问题的最佳实践模板。GoF（Gang of Four，四人帮）在 1994 年总结了 23 种经典设计模式。本文聚焦于日常开发中最常用的几种，通过 Java 代码示例带你理解它们的核心思想和使用场景。</p>

	      <h2>1. 学设计模式之前，先懂六大原则</h2>
	      <p>设计模式是"术"，设计原则是"道"。理解原则后，你会发现很多模式其实是在不同场景下对同一原则的具体应用：</p>
	      <table>
	          <tr>
	              <th>原则</th>
	              <th>一句话解释</th>
	              <th>应用</th>
	          </tr>
	          <tr><td><strong>单一职责（SRP）</strong></td><td>一个类只做一件事</td><td>UserService 只管用户逻辑，不管发邮件</td></tr>
	          <tr><td><strong>开闭原则（OCP）</strong></td><td>对扩展开放，对修改关闭</td><td>加新支付方式不改 PaymentService，而是实现 PaymentStrategy 接口</td></tr>
	          <tr><td><strong>里氏替换（LSP）</strong></td><td>子类必须能完全替换父类</td><td>不要重写父类方法让它抛异常</td></tr>
	          <tr><td><strong>依赖倒置（DIP）</strong></td><td>依赖抽象而非具体实现</td><td>Controller 依赖 UserService 接口，不依赖具体实现类</td></tr>
	          <tr><td><strong>接口隔离（ISP）</strong></td><td>接口要小而精，不要大而全</td><td>不要强迫实现类实现它不需要的方法</td></tr>
	          <tr><td><strong>迪米特法则</strong></td><td>最少知道原则，只和直接朋友通信</td><td>A 不要直接调用 C 的方法，应通过 B 转发</td></tr>
	      </table>
	      <p>六大原则里，<strong>开闭原则是"目的地"</strong>，其余五条都是通往它的路。判断一段设计好不好，最实用的检验就一句：加一个新需求，我是改了老代码，还是只加了新代码？</p>

	      <h2>2. 单例模式（Singleton）—— 全局唯一的实例</h2>
	      <p><strong>场景：</strong>数据库连接池、配置管理器、日志对象——这些在整个应用中只需要一个实例。</p>
	      <p><strong>核心思想：</strong>私有构造器 + 静态方法访问唯一实例。</p>
	      <pre><code class="language-java">// 推荐：枚举单例（最安全，自动防反射攻击和序列化破坏）
public enum ConfigManager {
    INSTANCE;

    private Properties props = new Properties();

    public void load(String path) { /* 加载配置 */ }
    public String get(String key) { return props.getProperty(key); }
}

// 使用
ConfigManager.INSTANCE.load("app.properties");
String dbUrl = ConfigManager.INSTANCE.get("db.url");

// 另一种推荐：静态内部类（懒加载，线程安全，无锁）
public class DbConnectionPool {
    private DbConnectionPool() {}

    private static class Holder {
        static final DbConnectionPool INSTANCE = new DbConnectionPool();
    }

    public static DbConnectionPool getInstance() {
        return Holder.INSTANCE;  // 类加载时才初始化，天然线程安全
    }
}</code></pre>
	      <p><strong>面试常见追问：双重检查锁定（DCL）为什么要用 volatile？</strong>完整写法留个底：</p>
	      <pre><code class="language-java">public class Singleton {
    private static volatile Singleton instance;   // volatile 是关键

    private Singleton() {}

    public static Singleton getInstance() {
        if (instance == null) {                    // 第一次检查（避免每次加锁）
            synchronized (Singleton.class) {
                if (instance == null) {            // 第二次检查（防并发重复创建）
                    instance = new Singleton();    // 非原子：分配→初始化→赋引用
                }
            }
        }
        return instance;
    }
}</code></pre>
	      <p>原因：<code>new Singleton()</code> 不是原子操作——"分配内存 → 初始化对象 → 引用赋值"可能被指令重排。没有 volatile 时，另一个线程可能在"引用已赋值但对象未初始化完成"的窗口拿到半成品实例。volatile 禁止这个重排序。</p>

	      <h2>3. 工厂模式（Factory）—— 把对象的创建和使用分离</h2>
	      <p><strong>场景：</strong>支付系统中根据支付方式创建不同的支付处理器。如果不用工厂，你需要在业务代码里写一堆 if-else 来 new 不同的实现类。</p>
	      <pre><code class="language-java">// 定义支付接口
interface PaymentStrategy {
    void pay(BigDecimal amount);
}

// 具体实现
@Component
class WeChatPay implements PaymentStrategy {
    public void pay(BigDecimal amount) {
        System.out.println("微信支付：" + amount + " 元");
    }
}

@Component
class AliPay implements PaymentStrategy {
    public void pay(BigDecimal amount) {
        System.out.println("支付宝支付：" + amount + " 元");
    }
}

// 工厂类：Spring Boot 中可以用 Map 自动注入
@Component
class PaymentFactory {
    // Spring 会自动把所有 PaymentStrategy 的实现注入到这个 Map 中
    // Key 是 Bean 的名字（weChatPay, aliPay）
    @Autowired
    private Map&lt;String, PaymentStrategy&gt; strategyMap;

    public PaymentStrategy getStrategy(String type) {
        PaymentStrategy strategy = strategyMap.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("不支持的支付方式: " + type);
        }
        return strategy;
    }
}

// 使用（Controller 层）
@RestController
public class OrderController {
    @Autowired
    private PaymentFactory paymentFactory;

    @PostMapping("/pay")
    public String pay(@RequestBody PayRequest request) {
        PaymentStrategy strategy = paymentFactory.getStrategy(request.getType());
        strategy.pay(request.getAmount());
        return "支付成功";
    }
}</code></pre>
	      <p>这个例子展示了工厂模式 + 策略模式 + Spring 依赖注入的经典组合：<strong>新增支付方式只需加一个新类，不用改任何已有代码</strong>——完美符合开闭原则。顺带一个消灭 if-else 的轻量变体：类型枚举有限且每个分支只有几行时，直接用 <code>Map&lt;String, Handler&gt;</code>（或枚举内部方法）注册处理逻辑，比完整的策略体系更轻。</p>

	      <h2>4. 建造者模式（Builder）—— 优雅地构造复杂对象</h2>
	      <p><strong>场景：</strong>一个对象有十几个可选参数。用构造器传参的话调用方根本不知道第 5 个参数是什么意思；用 setter 的话对象可能处于不完整状态。</p>
	      <pre><code class="language-java">// 使用 Lombok @Builder（最简单的方式）
@Builder
@Data
@AllArgsConstructor
public class User {
    private String name;      // 必填
    private int age;          // 必填
    private String email;     // 可选
    private String phone;     // 可选
    private String address;   // 可选
}

// 使用
User user = User.builder()
    .name("张三")
    .age(25)
    .email("zhangsan@example.com")
    .phone("13800138000")
    .build();
// 调用方只需要关心自己需要的字段，而且链式调用比构造器参数表清晰得多</code></pre>
	      <p>JDK 标准库里也随处可见这个模式：<code>Stream.builder()</code>、<code>StringBuilder</code>（链式 append）、<code>HttpRequest.newBuilder()</code>。见到 <strong>方法名即语义的链式调用最后以 build() 收尾</strong>，就是 Builder。</p>

	      <h2>5. 策略模式（Strategy）—— 用组合替代 if-else</h2>
	      <p><strong>场景：</strong>电商促销系统中，不同的优惠策略（满减、折扣、立减）。如果业务代码里写满 if-else，加一个新策略就要改核心逻辑。</p>
	      <pre><code class="language-java">// 定义策略接口
interface DiscountStrategy {
    BigDecimal apply(BigDecimal originalPrice);
}

// 满减策略
@Component
class FullReductionStrategy implements DiscountStrategy {
    public BigDecimal apply(BigDecimal price) {
        return price.compareTo(new BigDecimal("100")) &gt;= 0
            ? price.subtract(new BigDecimal("20"))
            : price;
    }
}

// 折扣策略
@Component
class PercentageStrategy implements DiscountStrategy {
    public BigDecimal apply(BigDecimal price) {
        return price.multiply(new BigDecimal("0.8")); // 8折
    }
}

// 使用：通过工厂获取策略后调用，业务逻辑极其简洁
BigDecimal finalPrice = discountStrategy.apply(originalPrice);</code></pre>
	      <p>策略模式的本质是<strong>把"变化的算法"封装成可替换的零件</strong>。它和工厂经常成对出现：工厂负责选零件，策略负责零件的标准形状。</p>

	      <h2>6. 观察者模式（Observer）—— 一对多的通知机制</h2>
	      <p><strong>场景：</strong>用户注册后需要发欢迎邮件 + 发优惠券 + 记录日志。把这些"副作用"写在注册方法里会让它越来越臃肿。</p>
	      <pre><code class="language-java">// Spring 事件机制就是经典的观察者模式实现

// 1. 定义事件
public class UserRegisteredEvent extends ApplicationEvent {
    private final User user;
    public UserRegisteredEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
    public User getUser() { return user; }
}

// 2. 发布事件（在注册服务中）
@Service
public class UserService {
    @Autowired
    private ApplicationEventPublisher publisher;

    public void register(User user) {
        // ... 保存用户到数据库
        publisher.publishEvent(new UserRegisteredEvent(this, user));
        // 注册逻辑到此结束，后续操作由监听器处理
    }
}

// 3. 监听事件（多个监听器、互不耦合）
@Component
class EmailListener {
    @EventListener
    public void sendWelcomeEmail(UserRegisteredEvent event) {
        // 发送欢迎邮件
    }
}

@Component
class CouponListener {
    @EventListener
    public void issueCoupon(UserRegisteredEvent event) {
        // 发放新用户优惠券
    }
}

// 要增加新的副作用（比如发送短信通知），只需新增一个监听器类，
// 完全不用改 UserService 的代码——这就是观察者模式的威力。</code></pre>
	      <p>两个实践注意点：<strong>① 监听器默认同步执行</strong>，邮件这种慢操作加上 <code>@Async</code> 或换成消息队列（MQ 是跨进程的观察者模式）；<strong>② 事务边界</strong>——默认事件在事务提交前发布，需要"提交后才发"时用 <code>@TransactionalEventListener</code>。</p>

	      <h2>7. 模板方法（Template Method）—— 骨架固定，细节下放</h2>
	      <p><strong>场景：</strong>多个流程的步骤完全一致，只有某一步的实现不同。把骨架定在父类，把变化的步骤留给子类——Spring 的 <code>JdbcTemplate</code> 把"取连接、开事务、执行、释放"封装好，只留 SQL 给你，就是这个模式：</p>
	      <pre><code class="language-java">public abstract class OrderHandler {
    // 模板方法：final 防止子类改流程
    public final OrderResult handle(Order order) {
        validate(order);                    // ① 固定步骤：校验
        OrderResult r = doProcess(order);   // ② 变化步骤：交给子类
        notifyIfSlow(r);                    // ③ 固定步骤：监控
        return r;
    }

    protected abstract OrderResult doProcess(Order order);   // 钩子
    protected void validate(Order order) { /* 默认实现，可覆写 */ }
    protected void notifyIfSlow(OrderResult r) { /* 默认空实现 */ }
}</code></pre>
	      <p>判断标志：<strong>"流程一致 + 个别步骤可定制" eight 个字</strong>。回调接口（Listener/Callback）是它的孪生兄弟——模板方法靠继承定制，回调靠传参定制。</p>

	      <h2>8. 代理模式（Proxy）—— 不改源码，增强行为</h2>
	      <p><strong>场景：</strong>给接口方法统一加日志、耗时统计、事务、权限校验。Spring AOP 就是代理模式的工业化实现——<code>@Transactional</code> 让方法自动包上事务、<code>@Cacheable</code> 自动加缓存，全是代理在背后织入的代码。</p>
	      <pre><code class="language-java">// JDK 动态代理：运行时生成实现同一接口的代理类
UserService target = new UserServiceImpl();
UserService proxy = (UserService) Proxy.newProxyInstance(
    target.getClass().getClassLoader(),
    target.getClass().getInterfaces(),
    (p, method, args) -&gt; {
        long start = System.currentTimeMillis();
        try {
            return method.invoke(target, args);       // 前置增强 → 原方法 → 后置增强
        } finally {
            System.out.println(method.getName() + " 耗时 "
                + (System.currentTimeMillis() - start) + "ms");
        }
    });
proxy.getUser(1L);   // 调用被自动包上了耗时统计</code></pre>
	      <p>分清两个易混模式：<strong>代理</strong>与真实对象"控制访问"（事务、权限、懒加载——语义不变），<strong>装饰器</strong>与真实对象"叠加能力"（Java IO：<code>new BufferedReader(new FileReader(f))</code> 一层层包出缓冲能力）。接口相同、意图不同。</p>

	      <h2>9. 23 种模式速查地图</h2>
	      <table>
	          <tr>
	              <th>分类</th>
	              <th>模式</th>
	              <th>优先掌握</th>
	          </tr>
	          <tr><td><strong>创建型</strong>（怎么 new）</td><td>单例 ★、工厂（简单/工厂方法/抽象）★、建造者 ★、原型</td><td>三个 ★ 必会</td></tr>
	          <tr><td><strong>结构型</strong>（怎么组合）</td><td>代理 ★、装饰器、适配器、外观、桥接、组合、享元</td><td>代理必会，装饰器/适配器眼熟即可</td></tr>
	          <tr><td><strong>行为型</strong>（怎么交互）</td><td>观察者 ★、策略 ★、模板方法 ★、迭代器、责任链、命令、状态、备忘录、中介者、访问者、解释器</td><td>三个 ★ 必会，责任链在网关/过滤器场景常见</td></tr>
	      </table>

	      <h2>10. 设计模式使用心法</h2>
	      <ul>
	          <li><strong>不要为了用模式而用模式：</strong>模式是解决问题的工具，不是炫技的资本。如果一段简单的 if-else 就够用了，不要强行套工厂模式。</li>
	          <li><strong>优先考虑简单方案：</strong>在模式和 KISS（Keep It Simple, Stupid）原则冲突时，优先选简单的。</li>
	          <li><strong>模式是演进而来的：</strong>好的设计往往是重构出来的，不是设计出来的。先写能用的代码，当 if-else 太多或类太臃肿时，再考虑引入合适的模式。</li>
	          <li><strong>Spring 框架本身就是设计模式的最佳教材：</strong>IoC 容器（工厂模式）、AOP（代理模式）、事件机制（观察者模式）、JdbcTemplate（模板方法模式）……读 Spring 源码是学习设计模式的最好方式，见 <a href="#/notes/spring-boot-guide">Spring Boot 指南</a>。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>设计模式不是背出来的，是<strong>在写代码的过程中"悟"出来的</strong>。当你写了一段代码感觉"这里好像不太好改"、"这个类好像太大了"时，去看看设计模式——大概率正好有一种模式能解决你的问题。不需要一次学完 23 种，<strong>先掌握单例、工厂、建造者、策略、观察者这 5 种最常用的</strong>，其余的随着实践慢慢补充。</p>`;

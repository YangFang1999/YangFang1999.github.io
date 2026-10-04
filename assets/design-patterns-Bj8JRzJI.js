const e=`	      <h1>设计模式入门：从单例到观察者，写出更优雅的代码</h1>

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
	      <p><strong>面试常见追问：</strong>双重检查锁定（DCL）为什么要用 volatile？因为 new 操作不是原子性的，volatile 禁止指令重排序，防止返回未初始化完成的实例。</p>

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
	      <p>这个例子展示了工厂模式 + 策略模式 + Spring 依赖注入的经典组合：<strong>新增支付方式只需加一个新类，不用改任何已有代码</strong>——完美符合开闭原则。</p>

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
        return price.compareTo(new BigDecimal("100")) >= 0
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

	      <h2>7. 设计模式使用心法</h2>
	      <ul>
	          <li><strong>不要为了用模式而用模式：</strong>模式是解决问题的工具，不是炫技的资本。如果一段简单的 if-else 就够用了，不要强行套工厂模式。</li>
	          <li><strong>优先考虑简单方案：</strong>在模式和 KISS（Keep It Simple, Stupid）原则冲突时，优先选简单的。</li>
	          <li><strong>模式是演进而来的：</strong>好的设计往往是重构出来的，不是设计出来的。先写能用的代码，当 if-else 太多或类太臃肿时，再考虑引入合适的模式。</li>
	          <li><strong>Spring 框架本身就是设计模式的最佳教材：</strong>IoC 容器（工厂模式）、AOP（代理模式）、事件机制（观察者模式）、JdbcTemplate（模板方法模式）……读 Spring 源码是学习设计模式的最好方式。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>设计模式不是背出来的，是<strong>在写代码的过程中"悟"出来的</strong>。当你写了一段代码感觉"这里好像不太好改"、"这个类好像太大了"时，去看看设计模式——大概率正好有一种模式能解决你的问题。不需要一次学完 23 种，<strong>先掌握单例、工厂、建造者、策略、观察者这 5 种最常用的</strong>，其余的随着实践慢慢补充。</p>`;export{e as default};

// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>设计模式入门：从单例到观察者，写出更优雅的代码</h1>

	      <p>设计模式（Design Patterns）是软件开发中<strong>经过反复验证的、可复用的解决方案</strong>。它们不是具体的代码，而是解决某类问题的最佳实践模板。GoF（Gang of Four，四人帮）在 1994 年总结了 23 种经典设计模式。本文聚焦于日常开发中最常用的几种，通过 Java 代码示例带你理解它们的核心思想和使用场景——并且给出一个"从烂代码重构到模式"的完整案例，让你看到模式是怎么"长出来"的。</p>

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
	      <p>原因：<code>new Singleton()</code> 不是原子操作——"分配内存 → 初始化对象 → 引用赋值"可能被指令重排。没有 volatile 时，另一个线程可能在"引用已赋值但对象未初始化完成"的窗口拿到半成品实例。volatile 禁止这个重排序。当然也要说一句：在 Spring 这类容器里，<strong>Bean 默认就是单例</strong>，手写单例的场合比想象中少。</p>

	      <h2>3. 策略 + 工厂：一个完整重构案例</h2>
	      <p>与其孤立地讲两个模式，不如看它们联手消灭 if-else 的全过程。这是"模式怎么从烂代码里长出来"的最好示例。</p>
	      <h3>3.1 起点：一段会无限膨胀的代码</h3>
	      <pre><code class="language-java">// 订单结算：每接入一种新支付方式/新优惠，都要改这个方法
public BigDecimal checkout(Order order, String payType, String promoType) {
    BigDecimal amount = order.getOriginal();

    if ("full_reduction".equals(promoType)) {
        if (amount.compareTo(new BigDecimal("100")) &gt;= 0) amount = amount.subtract(new BigDecimal("20"));
    } else if ("discount".equals(promoType)) {
        amount = amount.multiply(new BigDecimal("0.8"));
    }   // ← 每新增一种促销，这里加一个 else if

    if ("wechat".equals(payType)) {
        weChatPay.pay(amount);          // ← 每新增一种支付，这里也要加
    } else if ("alipay".equals(payType)) {
        aliPay.pay(amount);
    }
    return amount;
}</code></pre>
	      <p>问题清单：条件分支随业务线性增长；每次改核心方法都要回归测试全部分支；单元测试要造一堆组合场景；新同事根本看不出"促销"和"支付"是两个独立维度。</p>
	      <h3>3.2 第一步：把"变化的算法"抽成策略</h3>
	      <pre><code class="language-java">interface PromoStrategy {
    BigDecimal apply(BigDecimal original);
}

@Component
class FullReductionStrategy implements PromoStrategy {
    public BigDecimal apply(BigDecimal price) {
        return price.compareTo(new BigDecimal("100")) &gt;= 0
            ? price.subtract(new BigDecimal("20")) : price;
    }
}

@Component
class PercentageStrategy implements PromoStrategy {
    public BigDecimal apply(BigDecimal price) {
        return price.multiply(new BigDecimal("0.8")); // 8折
    }
}</code></pre>
	      <h3>3.3 第二步：Spring 的 Map 注入当工厂</h3>
	      <pre><code class="language-java">@Component
public class PromoFactory {
    // Spring 自动把所有 PromoStrategy 实现注入进来，key 是 Bean 名
    private final Map&lt;String, PromoStrategy&gt; strategyMap;

    public PromoFactory(Map&lt;String, PromoStrategy&gt; strategyMap) {
        this.strategyMap = strategyMap;
    }

    public PromoStrategy get(String type) {
        PromoStrategy s = strategyMap.get(type);
        if (s == null) throw new IllegalArgumentException("未知促销类型: " + type);
        return s;
    }
}</code></pre>
	      <h3>3.4 终点：核心逻辑不再认识任何具体策略</h3>
	      <pre><code class="language-java">@Service
public class CheckoutService {
    private final PromoFactory promoFactory;
    private final Map&lt;String, PayChannel&gt; payChannels;   // 支付同理再抽一层

    public CheckoutService(PromoFactory promoFactory, Map&lt;String, PayChannel&gt; payChannels) {
        this.promoFactory = promoFactory;
        this.payChannels = payChannels;
    }

    public BigDecimal checkout(Order order, String promoType, String payType) {
        BigDecimal amount = promoFactory.get(promoType).apply(order.getOriginal());
        payChannels.get(payType).pay(amount);
        return amount;
    }
}</code></pre>
	      <p>现在加新支付方式 = 新增一个类，核心代码零改动——开闭原则达成。这个组合拳的判断标志：<strong>"同一抽象、多个实现、按类型选择"</strong>——满足这三点，策略 + 工厂（Spring 里 Map 注入就是工厂）就该出场了。</p>

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

	      <h2>5. 观察者模式（Observer）—— 一对多的通知机制</h2>
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

	      <h2>6. 模板方法（Template Method）—— 骨架固定，细节下放</h2>
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
	      <p>判断标志：<strong>"流程一致 + 个别步骤可定制"八个字</strong>。回调接口（Listener/Callback）是它的孪生兄弟——模板方法靠继承定制，回调靠传参定制。现代 Java 里回调更常见（避免继承的僵化），但"骨架复用"的思想完全一致。</p>

	      <h2>7. 代理模式（Proxy）—— 不改源码，增强行为</h2>
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

	      <h2>8. 责任链（Chain of Responsibility）—— 流水线式处理</h2>
	      <p><strong>场景：</strong>一个请求要依次经过多重校验/加工，且环节可能增删。Servlet 的 Filter 链、Spring Security 的过滤器链、网关的鉴权/限流/日志，全是责任链：</p>
	      <pre><code class="language-java">public interface OrderValidator {
    void validate(Order order, List&lt;String&gt; errors);   // 每个环节往错误列表里追加
}

@Component
class StockValidator implements OrderValidator {
    public void validate(Order o, List&lt;String&gt; errors) {
        if (!stockService.enough(o)) errors.add("库存不足");
    }
}

@Component
class CouponValidator implements OrderValidator { /* 校验优惠券有效性 */ }

@Service
public class OrderValidateService {
    private final List&lt;OrderValidator&gt; validators;     // Spring 注入全部实现，按 @Order 排序

    public void validate(Order order) {
        List&lt;String&gt; errors = new ArrayList&lt;&gt;();
        validators.forEach(v -&gt; v.validate(order, errors));   // 串成链
        if (!errors.isEmpty()) throw new BizException(String.join("; ", errors));
    }
}</code></pre>
	      <p>这里的实现用了"collect 式责任链"（每环节处理后继续），Web Filter 那种则是"pass-through 式"（每个环节决定是否调 <code>chain.doFilter</code> 放行）。精髓相同：<strong>环节之间互不认识，链的顺序可配置</strong>。</p>

	      <h2>9. 状态模式（State）—— 把状态分支变成类</h2>
	      <p><strong>场景：</strong>订单有"待支付 / 已支付 / 已发货 / 已完成 / 已取消"，每个状态下允许的行为和流转都不一样。用 if-else 写状态机，分支会随状态×行为乘法式膨胀：</p>
	      <pre><code class="language-java">public interface OrderState {
    OrderStatus status();
    void pay(OrderContext ctx);      // 各状态自己决定这些操作合不合法
    void ship(OrderContext ctx);
    void cancel(OrderContext ctx);
}

@Component
class CreatedState implements OrderState {          // 待支付
    public OrderStatus status() { return OrderStatus.CREATED; }
    public void pay(OrderContext ctx) { ctx.transitionTo(OrderStatus.PAID); }
    public void ship(OrderContext ctx) { throw new BizException("未支付不能发货"); }
    public void cancel(OrderContext ctx) { ctx.transitionTo(OrderStatus.CANCELLED); }
}

@Component
class PaidState implements OrderState { /* pay 抛异常、ship 允许、cancel 允许 */ }

// Context（订单）把行为完全委托给当前状态对象
public class OrderContext {
    private OrderState state;
    public void pay()  { state.pay(this);  }
    public void ship() { state.ship(this); }
}</code></pre>
	      <p>每个状态的行为内聚在自己的类里，加新状态 = 加一个类。轻量替代：状态少且流转简单时，用 <code>Map&lt;当前状态×事件, 目标状态&gt;</code> 的流转表 + 枚举也够用——模式的选择永远看复杂度。</p>

	      <h2>10. 用 Lambda 简化模式：现代 Java 的轻量替代</h2>
	      <p>很多"只有一个方法"的模式，JDK 8 之后可以直接用函数式接口替代，不必建一堆类：</p>
	      <pre><code class="language-java">// 策略：Map 里直接放 Lambda
Map&lt;String, UnaryOperator&lt;BigDecimal&gt;&gt; promos = Map.of(
    "discount", price -&gt; price.multiply(new BigDecimal("0.8")),
    "half",     price -&gt; price.divide(new BigDecimal("2"))
);
BigDecimal finalPrice = promos.get("discount").apply(price);

// 命令模式：Runnable / Consumer 就是命令对象
Map&lt;String, Runnable&gt; commands = Map.of(
    "backup", () -&gt; backupService.run(),
    "cleanup", () -&gt; cleanService.run()
);
commands.get("backup").run();</code></pre>
	      <p>判断标准：<strong>策略/命令只有一个方法且无状态 → Lambda 足矣；有多个方法、需要维护状态、需要被依赖注入管理 → 老老实实建类</strong>。模式是思想，不是类的数量。</p>

	      <h2>11. 23 种模式速查地图</h2>
	      <table>
	          <tr>
	              <th>分类</th>
	              <th>模式</th>
	              <th>优先掌握</th>
	          </tr>
	          <tr><td><strong>创建型</strong>（怎么 new）</td><td>单例 ★、工厂（简单/工厂方法/抽象）★、建造者 ★、原型</td><td>三个 ★ 必会</td></tr>
	          <tr><td><strong>结构型</strong>（怎么组合）</td><td>代理 ★、装饰器、适配器、外观、桥接、组合、享元</td><td>代理必会，装饰器/适配器眼熟即可</td></tr>
	          <tr><td><strong>行为型</strong>（怎么交互）</td><td>观察者 ★、策略 ★、模板方法 ★、迭代器、责任链、命令、状态、备忘录、中介者、访问者、解释器</td><td>三个 ★ 必会，责任链/状态在业务系统常见</td></tr>
	      </table>

	      <h2>12. 设计模式使用心法</h2>
	      <ul>
	          <li><strong>不要为了用模式而用模式：</strong>模式是解决问题的工具，不是炫技的资本。如果一段简单的 if-else 就够用了，不要强行套工厂模式。</li>
	          <li><strong>优先考虑简单方案：</strong>在模式和 KISS（Keep It Simple, Stupid）原则冲突时，优先选简单的。反模式警报：只有一个实现类的"接口 + 实现"、只有一个策略的策略族、层层包装的"为了扩展性"——过度设计比没有设计更难维护。</li>
	          <li><strong>模式是演进而来的：</strong>好的设计往往是重构出来的，不是设计出来的。先写能用的代码，当 if-else 太多或类太臃肿时，再考虑引入合适的模式（第 3 节的案例就是这个过程）。</li>
	          <li><strong>Spring 框架本身就是设计模式的最佳教材：</strong>IoC 容器（工厂模式）、AOP（代理模式）、事件机制（观察者模式）、JdbcTemplate（模板方法模式）、HandlerInterceptor（责任链模式）……读 Spring 源码是学习设计模式的最好方式，见 <a href="#/notes/spring-boot-guide">Spring Boot 指南</a>。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>设计模式不是背出来的，是<strong>在写代码的过程中"悟"出来的</strong>。当你写了一段代码感觉"这里好像不太好改"、"这个类好像太大了"时，去看看设计模式——大概率正好有一种模式能解决你的问题。不需要一次学完 23 种，<strong>先掌握单例、工厂+策略、建造者、观察者这 5 种最常用的</strong>，遇到"流程一致"想模板方法、"环节可增删"想责任链、"状态决定行为"想状态模式，其余的随着实践慢慢补充。</p>`;

// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>IntelliJ IDEA 高效开发：从快捷键到生产力飞跃</h1>

	      <p>IntelliJ IDEA 被绝大多数 Java 开发者评为"最好的 Java IDE"。但遗憾的是，很多同学只用了它 20% 的功能——敲代码、运行、调试，然后抱怨"电脑卡"。<strong>IDEA 真正的威力在于它帮你做的事情</strong>：智能补全、自动重构、一键导航、模板生成……今天我们不列清单，而是按<strong>实际开发场景</strong>来组织——你在写代码时遇到什么操作，对应的快捷键是什么。</p>

	      <h2>1. 为什么 IDEA 能成为 Java 开发的事实标准？</h2>
	      <p>简单对比一下市面上主流的 Java 开发工具：</p>
	      <ul>
	          <li><strong>Eclipse：</strong>免费、插件多，但界面老旧，索引速度慢，重构功能弱。老项目维护可能还会碰到。</li>
	          <li><strong>VS Code：</strong>轻量、前端开发王者，但 Java 支持靠插件堆砌，大型项目的智能提示和重构远不如 IDEA。</li>
	          <li><strong>IntelliJ IDEA：</strong>开箱即用的智能（Smart Code Completion 能根据上下文推断类型）、强大的重构引擎、与 Spring/Maven/Git 的深度集成。社区版免费且功能足够个人开发。</li>
	      </ul>
	      <p>IDEA 强大的根本原因是它的<strong>索引</strong>：打开项目的瞬间，它就把所有代码解析成抽象语法树（AST）并建好交叉引用索引——补全、导航、重构、查引用全都查这张索引，所以又快又准。也正因为索引占内存，"IDEA 卡"多半是索引问题（最后一节讲治法）。</p>
	      <p>简单说：<strong>写 Java，用 IDEA 就对了。</strong>接下来是核心——怎么用得高效。</p>

	      <h2>2. 场景一：写代码——别再一个个字母敲了</h2>
	      <p>这是日常最高频的操作。记住下面几个，写代码的速度能翻倍。</p>
	      <table>
	          <tr>
	              <th>快捷键</th>
	              <th>功能</th>
	              <th>使用场景</th>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Space</code></td>
	              <td>基础代码补全</td>
	              <td>输入类名、方法名、变量名前几个字母，按它自动补全</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Shift + Space</code></td>
	              <td>智能类型补全</td>
	              <td>根据上下文预期的类型来过滤候选项，比如该传 List 的地方只显示 List 类型变量</td>
	          </tr>
	          <tr>
	              <td><code>Alt + Enter</code></td>
	              <td>万能修复键</td>
	              <td>自动导包、创建不存在的方法、生成 try-catch、实现接口方法……看到灯泡就按它</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + L</code></td>
	              <td>格式化代码</td>
	              <td>代码写得歪歪扭扭？一键对齐缩进和换行</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + D</code></td>
	              <td>复制当前行</td>
	              <td>快速复制一行代码到下一行（不用 Ctrl+C Ctrl+V）</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Y</code></td>
	              <td>删除当前行</td>
	              <td>删掉整行，不用鼠标选中</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Shift + ↑/↓</code></td>
	              <td>移动当前行</td>
	              <td>把一行代码整体上移或下移，比剪切粘贴快 10 倍</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Shift + U</code></td>
	              <td>切换大小写</td>
	              <td>选中一段文本，一键切换大小写</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + W</code> / <code>Ctrl + Shift + W</code></td>
	              <td>扩展/收缩选区</td>
	              <td>从光标处的单词一圈圈向外选中（变量 → 表达式 → 语句 → 块），配合提取重构特别顺</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + /</code></td>
	              <td>注释/取消注释</td>
	              <td>选中多行批量切换行注释，再按一次还原</td>
	          </tr>
	      </table>
	      <p><strong>核心心法：</strong>看到代码有问题（红线/黄线），鼠标移到上面看一眼提示，然后按 <code>Alt + Enter</code>，IDEA 通常已经帮你把解决方案列出来了。黄线（警告）也值得处理——IDEA 的静态检查能抓出空指针风险、资源未关闭这类真问题，<code>Ctrl + Alt + Shift + I</code> 甚至能按 inspections 批量跑整个项目。</p>

	      <h2>3. 场景二：找东西——项目大了怎么快速定位？</h2>
	      <p>当你接手一个几十万行的项目，最耗时的不是写代码，而是<strong>找到要改的代码在哪里</strong>。</p>
	      <table>
	          <tr>
	              <th>快捷键</th>
	              <th>功能</th>
	              <th>使用场景</th>
	          </tr>
	          <tr>
	              <td><code>Double Shift</code></td>
	              <td>万能搜索</td>
	              <td>搜类、文件、符号、Git 操作、设置……任何东西都能搜</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + N</code></td>
	              <td>搜索类</td>
	              <td>按类名搜索，支持驼峰匹配（搜 <code>UsSe</code> 匹配 <code>UserService</code>）</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Shift + N</code></td>
	              <td>搜索文件</td>
	              <td>按文件名搜索，包括配置文件、前端文件等</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Shift + F</code></td>
	              <td>全局字符串搜索</td>
	              <td>在整个项目里搜关键字，比如搜一个 SQL 表名出现在哪</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + B</code></td>
	              <td>跳转到定义</td>
	              <td>鼠标按住 Ctrl 再点类/方法/变量，直接跳过去。这是最常用的导航键。</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + B</code></td>
	              <td>跳转到实现</td>
	              <td>在接口方法上按，列出所有实现类——看源码的必备技能</td>
	          </tr>
	          <tr>
	              <td><code>Alt + F7</code></td>
	              <td>查找所有引用</td>
	              <td>想知道某个方法/变量在哪些地方被用到了？用这个。重构前必查。</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + H</code></td>
	              <td>调用层次</td>
	              <td>谁调它（向上）/ 它调谁（向下）双向切换——梳理业务链路比引用列表更直观</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + ←/→</code></td>
	              <td>前进/后退</td>
	              <td>跳来跳去后回到刚才的位置，就像浏览器的前进后退按钮</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + E</code></td>
	              <td>最近文件</td>
	              <td>在几个文件之间反复横跳时比用鼠标点 tab 快</td>
	          </tr>
	      </table>
	      <p>把搜索工具按用途分个类，就不至于每次都开万能搜索：</p>
	      <ul>
	          <li><strong>知道名字</strong> → Ctrl+N（类）/ Ctrl+Shift+N（文件）；</li>
	          <li><strong>知道内容片段</strong> → Ctrl+Shift+F（全局文本，支持正则与文件掩码）；</li>
	          <li><strong>知道符号要用在哪</strong> → Alt+F7（引用）/ Ctrl+Alt+H（调用链）；</li>
	          <li><strong>什么都不知道</strong> → Double Shift 到处撒网。</li>
	      </ul>
	      <p><strong>核心心法：</strong>养成习惯——不要用鼠标在项目树里翻文件，用 <code>Ctrl + N</code> 和 <code>Ctrl + Shift + N</code> 直接搜。</p>

	      <h2>4. 场景三：改代码——重构不止是改个名</h2>
	      <p>重构是日常开发的高频操作，但手动重构容易出错。IDEA 的重构引擎能<strong>自动更新所有引用</strong>，安全又高效。</p>
	      <table>
	          <tr>
	              <th>快捷键</th>
	              <th>功能</th>
	              <th>使用场景</th>
	          </tr>
	          <tr>
	              <td><code>Shift + F6</code></td>
	              <td>安全重命名</td>
	              <td>重命名变量/方法/类，IDEA 会自动更新项目中所有引用它的地方</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + V</code></td>
	              <td>提取变量</td>
	              <td>选中一个表达式，自动声明为变量并推断类型</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + M</code></td>
	              <td>提取方法</td>
	              <td>选中一段代码，抽成一个独立方法——"这个函数太长了"的解决方案</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + C</code></td>
	              <td>提取常量</td>
	              <td>把硬编码的数字或字符串抽成 <code>private static final</code> 常量</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + P</code></td>
	              <td>提取参数</td>
	              <td>把方法里的硬编码值抽成方法参数——多态化一个写死的方法</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + F</code></td>
	              <td>提取字段</td>
	              <td>把方法内的局部值提升为类字段（配合构造器注入）</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + O</code></td>
	              <td>优化导入</td>
	              <td>删除无用的 import，按规范重新排序。提交代码前必做。</td>
	          </tr>
	          <tr>
	              <td><code>Ctrl + Alt + Shift + T</code></td>
	              <td>重构菜单（Refactor This）</td>
	              <td>忘了具体快捷键时，一个键唤出当前上下文所有可用的重构</td>
	          </tr>
	      </table>
	      <p><strong>核心心法：</strong>重构不用怕——IDEA 的重构是基于 AST（抽象语法树）的，不是简单的文本替换。它不会把字符串里的同名文本也给改了。用一组连续动作感受一下"提取"的威力：</p>
	      <pre><code class="language-java">// 重构前：魔法数字 + 超长方法
public String render(User u) {
    if (u.getAge() &gt;= 18 &amp;&amp; u.getAge() &lt;= 60 &amp;&amp; u.isVerified() &amp;&amp; u.getBalance() &gt; 100) {
        // ...50 行业务
    }
    return "denied";
}

// Ctrl+W 选中表达式 → Ctrl+Alt+V 提取变量，命名成业务语言
public String render(User u) {
    boolean adultAndWorkingAge = u.getAge() &gt;= 18 &amp;&amp; u.getAge() &lt;= 60;
    boolean canLoan = adultAndWorkingAge &amp;&amp; u.isVerified() &amp;&amp; u.getBalance() &gt; 100;
    if (canLoan) {
        // ...50 行业务
    }
    return "denied";
}</code></pre>
	      <p>几秒钟，可读性质变——这就是"重构是 refactor this 出来的，不是憋出来的"。</p>

	      <h2>5. 场景四：调试——别只会用 System.out.println</h2>
	      <p>很多新手调试靠 <code>System.out.println</code> 打日志，效率极低。IDEA 的调试器要强大得多：</p>
	      <table>
	          <tr>
	              <th>快捷键</th>
	              <th>功能</th>
	              <th>说明</th>
	          </tr>
	          <tr>
	              <td><code>Shift + F9</code></td>
	              <td>Debug 运行</td>
	              <td>以调试模式启动程序</td>
	          </tr>
	          <tr>
	              <td><code>F8</code></td>
	              <td>Step Over</td>
	              <td>执行当前行，不进入方法内部</td>
	          </tr>
	          <tr>
	              <td><code>F7</code></td>
	              <td>Step Into</td>
	              <td>进入当前行调用的方法内部（<code>Alt + Shift + F7</code> 强制进入第三方库源码）</td>
	          </tr>
	          <tr>
	              <td><code>Shift + F8</code></td>
	              <td>Step Out</td>
	              <td>执行完当前方法并跳出到调用处</td>
	          </tr>
	          <tr>
	              <td><code>Alt + F8</code></td>
	              <td>表达式求值</td>
	              <td>断点处可以执行任意 Java 代码！比如执行 <code>list.size()</code>、调用 service 方法、甚至修改集合内容</td>
	          </tr>
	          <tr>
	              <td><code>F9</code></td>
	              <td>放行到下一个断点</td>
	              <td>Resume，配合条件断点用</td>
	          </tr>
	      </table>
	      <p><strong>高玩技巧——条件断点：</strong>在断点上右键，设置条件（如 <code>i == 99</code>），只有满足条件时程序才会停住。在循环里排查某个特定迭代的问题时特别好用。断点还可以右键勾选 <strong>"Remove once hit"</strong>（触发一次后自动消失），排查"第一次进入这里时状态对不对"最合适。</p>
	      <p><strong>断点其实有三种：</strong>行断点之外，还有<strong>方法断点</strong>（断在接口方法上，任何实现被调用都停——排查"到底走的哪个实现"）和<strong>异常断点</strong>（Breakpoints 面板里加 Java Exception Breakpoints，比如 NullPointerException——不必知道它在哪行抛出，任何地方抛 NPE 都会停在案发现场，治"线上偶发 NPE 本地复现"的利器）。</p>
	      <p><strong>两个更少人知的调试神器：</strong>① <strong>Drop Frame（回退帧）</strong>——调试器工具栏上的回退箭头，能把当前栈帧"退回去重跑"：单步走过了关键行？不用重启，直接退回这一帧重新执行（副作用如写库无法撤销，但纯计算场景是时间机器）。② <strong>Force Return（强制返回）</strong>——在栈帧上右键，让方法立刻返回一个你指定的值：想测"如果这个接口返回 null 会怎样"，不用改代码。</p>

	      <h2>6. 场景五：Live Templates —— 你敲几个字母，它写一段代码</h2>
	      <p>Live Template 是 IDEA 的代码模板系统，输入缩写 + Tab，自动展开为完整代码块。内置的常用模板：</p>
	      <pre><code class="language-java">psvm + Tab    →  public static void main(String[] args) {}
sout + Tab    →  System.out.println();
soutv + Tab   →  System.out.println("变量名 = " + 变量);  // 自动带上变量名
fori + Tab    →  for (int i = 0; i &lt; ; i++) {}
iter + Tab    →  for (Object o : iterable) {}  // 增强 for 循环
ifn + Tab     →  if (var == null) {}
inn + Tab     →  if (var != null) {}
inst + Tab    →  if (obj instanceof Type) {}</code></pre>
	      <p><strong>自定义模板完整步骤</strong>（以一个日志计时模板为例）：Settings → Editor → Live Templates → 选 Java 组 → + 号 → Abbreviation 填 <code>timer</code>，Template text 填：</p>
	      <pre><code class="language-java">long $START$ = System.currentTimeMillis();
$END$   // 光标最后停在这里
System.out.println("耗时 " + (System.currentTimeMillis() - $START$) + "ms");</code></pre>
	      <p>两个关键细节：<code>$变量名$</code> 是占位符（生成后按 Tab 依次跳转填值），<code>$END$</code> 是最终光标位置。模板右上角还要点 <strong>Define → Java</strong> 声明适用语言，否则模板是灰的。</p>

	      <h2>7. 进阶技巧：少有人知但超实用的功能</h2>
	      <ul>
	          <li><strong>多光标编辑：</strong>按住 <code>Alt + Shift</code>，鼠标在多个位置点击，同时编辑多处——批量修改变量名的利器。按 <code>Ctrl + Alt + Shift + J</code> 选中当前词的所有出现位置，一次改完全部。</li>
	          <li><strong>列模式：</strong>按住 <code>Alt</code>，鼠标拖动选择矩形区域——处理列对齐的数据时超好用。</li>
	          <li><strong>Postfix Completion：</strong>输入 <code>list.for</code> + Tab 自动生成 for 循环；<code>user.nn</code> + Tab 生成 if (user != null)；<code>name.sout</code> + Tab 生成 System.out.println(name)。这是比 Live Template 更自然的补全方式——先写表达式，再想"对它做什么"。</li>
	          <li><strong>书签：</strong><code>F11</code> 在当前行打书签，<code>Ctrl + F11</code> 打带编号的书签，<code>Shift + F11</code> 查看所有书签——追踪关键代码位置。</li>
	          <li><strong>剪贴板历史：</strong><code>Ctrl + Shift + V</code> 弹出最近复制的十几条内容——从报错信息、日志、代码之间来回搬运时，比来回切换复制快得多。</li>
	          <li><strong>内置 HTTP Client：</strong>Tools → HTTP Client，写 <code>.http</code> 文件就能发请求（GET/POST/带 token 头都能配），接口自测不用开 Postman，而且文件能进 Git 跟团队共享。</li>
	          <li><strong>Database 面板：</strong>Community 版也自带。连上 MySQL 后，写 SQL 时的表名/列名补全和跳转和写 Java 一个体验——<a href="#/notes/mysql-basics">调 SQL</a> 时按下 <code>Ctrl+Enter</code> 直接在编辑器里执行选中语句。</li>
	          <li><strong>Spring 相关仪表盘：</strong>打开类文件边栏的 Spring 图标，能直接跳到 Bean 的注入点/配置来源；Services 面板（Alt+8）统一管理多个 Spring Boot 应用的启停。</li>
	      </ul>

	      <h2>8. 性能优化：IDEA 卡怎么办？</h2>
	      <ul>
	          <li><strong>调大内存：</strong>Help → Edit Custom VM Options，把 <code>-Xmx</code> 调到 4096m 或更高（内存够的话）。</li>
	          <li><strong>排除不需要索引的目录：</strong>右键 node_modules、target、.git 等目录 → Mark Directory as → Excluded。大项目卡顿的第一嫌疑人是"把构建产物也索引了"。</li>
	          <li><strong>关闭不需要的插件：</strong>Settings → Plugins，禁用你没用到的插件（每次启动都加载它们）。</li>
	          <li><strong>Power Save Mode（应急）：</strong>右下角小人图标，关掉代码分析只保留编辑——临时打开巨大文件不想等索引时用。</li>
	          <li><strong>使用 SSD：</strong>把项目和 IDEA 的缓存目录放在固态硬盘上，效果立竿见影。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>IDEA 的学习曲线是阶梯式的：入门只需知道怎么运行和调试；进一步提升靠记住核心快捷键；真正高手则会把重构、模板、多光标、调试器这些组合起来用。<strong>不需要一次记住所有快捷键</strong>——把本文收藏起来，每次写代码时挑一两个刻意练习，两周后你会发现自己再也回不去了。</p>
	      <p>最后推荐一个 IDEA 插件：<strong>Key Promoter X</strong>，它会在你用鼠标操作时弹出提示"这个操作用快捷键 X 也能完成"。用上一个月，你会感谢它的。工具只是放大器，把省下来的时间投给 <a href="#/notes/java-collections-framework">集合原理</a>、<a href="#/notes/spring-boot-guide">Spring 实战</a>这些硬知识，才是真正的复利。</p>`;

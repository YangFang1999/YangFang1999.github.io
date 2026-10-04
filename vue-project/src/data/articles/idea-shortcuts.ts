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
	      </table>
	      <p><strong>核心心法：</strong>看到代码有问题（红线/黄线），鼠标移到上面看一眼提示，然后按 <code>Alt + Enter</code>，IDEA 通常已经帮你把解决方案列出来了。</p>

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
	              <td><code>Ctrl + Alt + ←/→</code></td>
	              <td>前进/后退</td>
	              <td>跳来跳去后回到刚才的位置，就像浏览器的前进后退按钮</td>
	          </tr>
	      </table>
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
	              <td><code>Ctrl + Alt + O</code></td>
	              <td>优化导入</td>
	              <td>删除无用的 import，按规范重新排序。提交代码前必做。</td>
	          </tr>
	      </table>
	      <p><strong>核心心法：</strong>重构不用怕——IDEA 的重构是基于 AST（抽象语法树）的，不是简单的文本替换。它不会把字符串里的同名文本也给改了。</p>

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
	              <td>进入当前行调用的方法内部</td>
	          </tr>
	          <tr>
	              <td><code>Shift + F8</code></td>
	              <td>Step Out</td>
	              <td>执行完当前方法并跳出到调用处</td>
	          </tr>
	          <tr>
	              <td><code>Alt + F8</code></td>
	              <td>表达式求值</td>
	              <td>断点处可以执行任意 Java 代码！比如执行 <code>list.size()</code>、修改变量值等</td>
	          </tr>
	      </table>
	      <p><strong>高玩技巧——条件断点：</strong>在断点上右键，设置条件（如 <code>i == 99</code>），只有满足条件时程序才会停住。在循环里排查某个特定迭代的问题时特别好用。</p>

	      <h2>6. 场景五：Live Templates —— 你敲几个字母，它写一段代码</h2>
	      <p>Live Template 是 IDEA 的代码模板系统，输入缩写 + Tab，自动展开为完整代码块。内置的常用模板：</p>
	      <pre><code class="language-java">psvm + Tab    →  public static void main(String[] args) {}
sout + Tab    →  System.out.println();
soutv + Tab   →  System.out.println("变量名 = " + 变量);  // 自动带上变量名
fori + Tab    →  for (int i = 0; i < ; i++) {}
iter + Tab    →  for (Object o : iterable) {}  // 增强 for 循环
ifn + Tab     →  if (var == null) {}
inn + Tab     →  if (var != null) {}</code></pre>
	      <p><strong>你还可以自定义模板！</strong>比如 Spring Boot 项目里经常写 <code>@Autowired</code> 和 <code>@RestController</code>，可以创建自己的缩写。进入 Settings → Editor → Live Templates，添加你的模板即可。</p>

	      <h2>7. 进阶技巧：少有人知但超实用的功能</h2>
	      <ul>
	          <li><strong>多光标编辑：</strong>按住 <code>Alt + Shift</code>，鼠标在多个位置点击，同时编辑多处——批量修改变量名的利器。</li>
	          <li><strong>列模式：</strong>按住 <code>Alt</code>，鼠标拖动选择矩形区域——处理列对齐的数据时超好用。</li>
	          <li><strong>最近文件：</strong><code>Ctrl + E</code> 弹出最近打开的文件列表——在几个文件之间反复横跳时比用鼠标点 tab 快。</li>
	          <li><strong>书签：</strong><code>F11</code> 在当前行打书签，<code>Ctrl + F11</code> 打带编号的书签，<code>Shift + F11</code> 查看所有书签——追踪关键代码位置。</li>
	          <li><strong>Postfix Completion：</strong>输入 <code>list.for</code> + Tab 自动生成 for 循环；<code>user.nn</code> + Tab 生成 if (user != null)；<code>name.sout</code> + Tab 生成 System.out.println(name)。这是比 Live Template 更自然的补全方式。</li>
	      </ul>

	      <h2>8. 性能优化：IDEA 卡怎么办？</h2>
	      <ul>
	          <li><strong>调大内存：</strong>Help → Edit Custom VM Options，把 <code>-Xmx</code> 调到 4096m 或更高（内存够的话）。</li>
	          <li><strong>排除不需要索引的目录：</strong>右键 node_modules、target、.git 等目录 → Mark Directory as → Excluded。</li>
	          <li><strong>关闭不需要的插件：</strong>Settings → Plugins，禁用你没用到的插件（每次启动都加载它们）。</li>
	          <li><strong>使用 SSD：</strong>把项目和 IDEA 的缓存目录放在固态硬盘上，效果立竿见影。</li>
	      </ul>

	      <h2>小结</h2>
	      <p>IDEA 的学习曲线是阶梯式的：入门只需知道怎么运行和调试；进一步提升靠记住核心快捷键；真正高手则会把重构、模板、多光标这些组合起来用。<strong>不需要一次记住所有快捷键</strong>——把本文收藏起来，每次写代码时挑一两个刻意练习，两周后你会发现自己再也回不去了。</p>
	      <p>最后推荐一个 IDEA 插件：<strong>Key Promoter X</strong>，它会在你用鼠标操作时弹出提示"这个操作用快捷键 X 也能完成"。用上一个月，你会感谢它的。</p>`;

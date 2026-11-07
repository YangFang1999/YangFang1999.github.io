// 文章正文（HTML）。由 NoteDetail 按需动态加载，只包含正文，不含页面框架。
export default `	      <h1>Git 从入门到团队协作：常用命令、工作流与踩坑指南</h1>

	      <p>Git 是目前最流行的分布式版本控制系统。不管你是一个人写 side project 还是和团队协同开发，Git 都是每天必用的工具。但 Git 的命令繁多、概念抽象，很多新手"只会 add、commit、push，遇到冲突就慌了"。本文从日常开发的实际场景出发，把 Git 的核心概念、高频命令、团队协作工作流和常见踩坑场景一次性讲清楚。</p>

	      <h2>1. Git 的核心概念：先搞懂这几个词</h2>
	      <p>Git 最难的地方不是命令多，而是<strong>概念抽象</strong>——如果不理解下面这几个词，遇到问题你就只能靠搜索瞎试：</p>
	      <table>
	          <tr>
	              <th>概念</th>
	              <th>解释</th>
	              <th>类比</th>
	          </tr>
	          <tr>
	              <td><strong>工作区（Working Directory）</strong></td>
	              <td>你电脑上能看到的项目文件夹</td>
	              <td>你的办公桌</td>
	          </tr>
	          <tr>
	              <td><strong>暂存区（Staging Area）</strong></td>
	              <td>通过 <code>git add</code> 把修改加入暂存区，等待提交</td>
	              <td>你把要交的文件整理放在一个文件夹里</td>
	          </tr>
	          <tr>
	              <td><strong>本地仓库（Local Repository）</strong></td>
	              <td><code>git commit</code> 后修改进入本地仓库（.git 目录）</td>
	              <td>你把文件夹封存交给了档案室</td>
	          </tr>
	          <tr>
	              <td><strong>远程仓库（Remote Repository）</strong></td>
	              <td>GitHub / GitLab / Gitee 上的仓库</td>
	              <td>你把档案寄到了总部存档</td>
	          </tr>
	          <tr>
	              <td><strong>HEAD</strong></td>
	              <td>指向当前所在分支的最新提交</td>
	              <td>一个指针，指向你"现在"在哪</td>
	          </tr>
	      </table>
	      <p><strong>数据流转方向：</strong>工作区 → (git add) → 暂存区 → (git commit) → 本地仓库 → (git push) → 远程仓库。所有"撤销"类命令本质上都是在这条流水线上倒着搬东西——想清楚你要撤哪一段，命令自然就对号入座了。</p>

	      <h2>2. 基础配置与仓库初始化</h2>
	      <pre><code class="language-bash"># 首次使用 Git 必须配置（不配的话 Git 不让你 commit）
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# 推荐配置：改默认分支名为 main（GitHub 已默认用 main 而非 master）
git config --global init.defaultBranch main

# 推荐配置：设置别名（alias），省时间
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all --decorate"

# 创建仓库的两种方式
git init                              # 在现有项目中初始化 Git
git clone git@github.com:user/repo.git # 克隆远程仓库</code></pre>
	      <p><code>git lg</code> 这个别名强烈建议配上——图形化的提交树对理解分支合并有极大帮助，比默认的 log 可读性高一个量级。</p>

	      <h2>3. 日常工作流：从写代码到推代码</h2>
	      <pre><code class="language-bash"># 1. 查看当前状态（最常用的命令，没有之一）
git status

# 2. 查看具体改了什么
git diff                    # 工作区 vs 暂存区
git diff --staged           # 暂存区 vs 本地仓库（即上次 commit）

# 3. 添加修改到暂存区
git add filename.txt        # 添加指定文件
git add .                   # 添加当前目录下所有修改
git add -p                  # 交互式暂存（一个文件里改了 10 行只想交 5 行时用）

# 4. 提交到本地仓库
git commit -m "feat: add user login feature"

# 5. 推送到远程仓库
git push origin main

# 6. 拉取远程更新
git pull origin main        # = git fetch + git merge（注意：可能产生合并提交）
git pull --rebase origin main  # = git fetch + git rebase（提交历史更干净，推荐）</code></pre>

	      <h2>4. 分支管理：并行开发的基石</h2>
	      <p><strong>分支是 Git 最强大的功能。</strong>它让你能在不影响主代码的情况下开发新功能、修复 Bug、做实验性改动。Git 的分支本质只是<strong>一个指向某个 commit 的可移动指针</strong>——创建分支几乎零成本，这也是它和 SVN 等旧系统最本质的区别。</p>
	      <pre><code class="language-plaintext">                main ──► A ──► B ──► F ──► G   （主干继续前进）
                          \\         /
                           C ──► D ─┘
feature-login ──────────────┘
（从 B 分叉出 C、D，开发完合并回 main 产生 F 或直接快进）</code></pre>
	      <pre><code class="language-bash"># 查看分支
git branch                  # 本地分支
git branch -r               # 远程分支
git branch -a               # 所有分支

# 创建分支
git branch feature-login    # 创建但不切换
git checkout -b feature-payment  # 创建并切换（最常用）
git switch -c feature-payment    # 新命令，功能同上（Git 2.23+）

# 切换分支
git checkout feature-login
git switch feature-login    # 新命令（推荐，语义更清晰）

# 合并分支
git checkout main
git merge feature-login     # 把 feature-login 合入 main

# 删除分支
git branch -d feature-login      # 安全删除（未合并的分支删不掉）
git branch -D feature-login      # 强制删除（放弃该分支的所有改动）

# 把本地新建的分支推送到远程
git push -u origin feature-login  # -u 设置上游，之后直接 git push 即可</code></pre>

	      <h2>5. merge 与 rebase：两种合并哲学</h2>
	      <p>这是 Git 使用中争议最大、也最值得想清楚的问题：</p>
	      <pre><code class="language-plaintext">合并前：          merge 后：                rebase 后：
main   A─B        main   A─B───────M       main   A─B
feature  \\C─D    feature  \\C─D /          feature（已删除）
                        \\ /                     \\
                         C─D                      C'─D'  ← 提交被"搬到"B 之后</code></pre>
	      <table>
	          <tr>
	              <th></th>
	              <th>git merge</th>
	              <th>git rebase</th>
	          </tr>
	          <tr><td>历史形状</td><td>保留真实分叉，多一个合并提交 M</td><td>把你的提交"摘下来重放"到目标分支末尾，历史变成一条直线</td></tr>
	          <tr><td>优点</td><td>不改写历史，安全</td><td>提交历史干净，review 友好</td></tr>
	          <tr><td>缺点</td><td>历史图乱成一团"地铁线路图"</td><td><strong>改写了提交（C、D 变成新的 C'、D'）</strong></td></tr>
	          <tr><td>适用</td><td>把 feature 合入 main（公开历史）</td><td>把自己的提交同步到最新主干（私有历史）</td></tr>
	      </table>
	      <p><strong>黄金法则：rebase 只用于"还没推给别人的提交"。</strong>公共分支上的提交被 rebase 改写后，协作者的本地历史和远程对不上，会陷入"push 被拒 → 拉下来一堆重复提交"的泥潭。日常节奏记住一句话：<strong>feature 分支上用 rebase 跟上 main，合回 main 时用 merge（或 PR 的 squash）</strong>。</p>

	      <h2>6. 提交信息规范：别乱写 commit message</h2>
	      <p>好的 commit message 能让半年后的你也看得懂这次改了什么。推荐使用 <strong>Conventional Commits</strong> 规范：</p>
	      <pre><code class="language-bash"># 格式：type(scope): description
feat: add user registration API       # 新功能
fix: fix null pointer in login        # Bug 修复
docs: update README installation guide # 文档改动
refactor: extract auth logic to service # 重构
style: format code with prettier       # 格式调整
test: add unit tests for UserService   # 测试
chore: update dependency versions      # 杂务（构建、依赖等）

# 好的 commit message：
feat(user): add email verification on registration

# 不好的 commit message：
update
fix bug
改了点东西</code></pre>
	      <p>这套规范还有个隐藏红利：<strong>type 是机器可读的</strong>，配合工具能自动生成 CHANGELOG、自动判断版本号该升 major/minor/patch。</p>

	      <h2>7. 撤销与回退：出错了怎么办？</h2>
	      <p>这是新手最容易慌的场景。别怕，Git 几乎所有操作都有"后悔药"：</p>
	      <pre><code class="language-bash"># --- 场景一：改错了工作区的文件，想回到上次 commit 的状态 ---
git checkout -- filename.txt        # 丢弃单个文件的工作区修改
git restore filename.txt            # 新命令（Git 2.23+），等价于上面
git restore .                       # 丢弃所有工作区修改

# --- 场景二：git add 错了，想从暂存区撤回来 ---
git reset HEAD filename.txt         # 将文件从暂存区移回工作区（修改保留）
git restore --staged filename.txt   # 新命令

# --- 场景三：git commit 错了/不完整，想修改最后一次 commit ---
git commit --amend -m "新的提交信息"  # 修改最后一次 commit（注意：不要 amend 已 push 的 commit！）

# --- 场景四：想回到以前的某个版本 ---
git log --oneline                     # 先找到目标 commit 的 hash
git reset --soft HEAD~1              # 撤销 commit，修改保留在暂存区（最安全）
git reset --mixed HEAD~1             # 撤销 commit + add，修改保留在工作区（默认）
git reset --hard HEAD~1              # 彻底回到之前，丢弃所有修改（危险！不可逆！）

# --- 场景五：已经 push 了，想撤销 ---
git revert HEAD                       # 创建一个新 commit 来撤销上次 commit（安全，推荐）
# revert 不会改变历史，适合已经 push 的 commit
# reset 会修改历史，只能用于还没 push 的 commit</code></pre>
	      <p>三个 reset 模式的记忆法：<strong>soft 只动 commit、mixed 动到 add、hard 全动</strong>。另外 <code>HEAD~1</code> 是"父提交"，<code>HEAD~2</code> 是"祖父提交"——合并提交有两个父亲时用 <code>HEAD^2</code> 指第二个父亲，这两个符号不是一回事。</p>

	      <h2>8. reflog：最后的救命稻草</h2>
	      <p>如果 <code>git reset --hard</code> 回退过头、或者 rebase 中途搞丢了提交，别慌——<strong>reflog 记录了 HEAD 的每一步移动</strong>，只要 commit 对象还存在（Git 会保留约 90 天），就能找回来：</p>
	      <pre><code class="language-bash">git reflog                     # 列出 HEAD 的移动历史
# a1b2c3d HEAD@{0}: reset: moving to HEAD~2
# e4f5g6h HEAD@{1}: commit: 完成登录功能    ← 丢掉的那个提交还在！
git reset --hard e4f5g6h       # 直接跳回任意历史位置</code></pre>
	      <p>reflog 的存在意味着：<strong>只要提交过，几乎不会真丢</strong>。这个知识点能救你于最深的绝望，值得单独一节。</p>

	      <h2>9. 解决冲突：合并时冲突了怎么办？</h2>
	      <p>当两个分支修改了同一个文件的同一行时，Git 无法自动决定保留哪个，就会产生冲突：</p>
	      <pre><code class="language-bash"># 冲突文件的标记：
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
你的改动
=======
别人的改动
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature-branch

# 解决步骤：
# 1. 手动编辑文件，保留需要的代码，删除冲突标记（&lt;&lt;&lt; / === / &gt;&gt;&gt;）
# 2. git add 已解决的文件
# 3. git commit（不要加 -m，Git 会自动生成 merge commit 信息）
# 4. 如果 rebase 过程中冲突，解决后执行 git rebase --continue
#    （实在处理不了：git rebase --abort 一步回到 rebase 之前的状态）</code></pre>
	      <p>降低冲突概率的实践：<strong>feature 分支周期别太长</strong>（越大越难合）、定期把 main 同步进自己的分支、大改动拆小提交。</p>

	      <h2>10. 常用 Git 工作流</h2>
	      <ul>
	          <li><strong>Git Flow：</strong>main + develop + feature + release + hotfix 分支，适合有固定发布周期的团队。缺点是分支多、流程重。</li>
	          <li><strong>GitHub Flow：</strong>只有 main + feature 分支，feature 通过 PR 合入 main 后立即部署。适合持续部署的小团队或个人项目。</li>
	          <li><strong>GitLab Flow：</strong>在 GitHub Flow 基础上加入环境分支（如 staging、production），适合有多个部署环境的项目。</li>
	      </ul>
	      <p><strong>个人项目推荐 GitHub Flow，简单够用。</strong>本博客就是：feature 改完直接进 main。发布版本时打个 tag 固定点位：</p>
	      <pre><code class="language-bash">git tag -a v2.3 -m "MySQL 进阶系列 + 全站文章质量升级"   # 附注标签（推荐）
git push origin v2.3            # tag 不会随 push 自动上传，要单独推
git tag -l                      # 列出所有标签</code></pre>

	      <h2>11. Git 实用技巧与常见问题</h2>
	      <pre><code class="language-bash"># 查看某行代码是谁写的（追责神器）
git blame filename.txt

# 暂存当前工作，切换到其他分支（工作区有未提交的修改时）
git stash                   # 暂存
git stash pop               # 恢复
git stash list              # 查看暂存列表
git stash -u                # 连未跟踪的新文件一起暂存

# 查看某次 commit 的详细改动
git show COMMIT_HASH

# 比较两个分支的差异
git diff branch1..branch2

# 把某个 commit 从一个分支"复制"到另一个分支（如 hotfix 同时要上两个版本线）
git cherry-pick COMMIT_HASH

# 合并多个 commit 为一个（整理提交历史）
git rebase -i HEAD~3        # 交互式 rebase 最近 3 个 commit

# 找出某段代码是哪次提交引入的（比 blame 更进一步，能跨重构追溯）
git log -S "某个函数名" --oneline</code></pre>

	      <h2>12. .gitignore 文件：千万别把不该传的传上去</h2>
	      <pre><code class="language-bash"># 每个项目必备的 .gitignore 模板
node_modules/          # 依赖目录
dist/                  # 构建产物
.env                   # 环境变量（含敏感信息！）
*.log                  # 日志文件
.idea/                 # IDEA 配置（可选：团队共享的放仓库，个人的忽略）
*.class                # Java 编译产物
target/                # Maven 构建目录
.DS_Store              # Mac 系统文件
Thumbs.db              # Windows 系统文件</code></pre>
	      <p><strong>重要提醒：</strong>.env 文件、数据库密码、API 密钥等<strong>绝对不能提交到 Git</strong>。一旦提交，即使在后续 commit 中删除，Git 历史里仍然能找到。如果不小心提交了敏感信息，需要重写 Git 历史（<code>git filter-branch</code> 或 BFG Repo-Cleaner），并在相关平台吊销已泄露的密钥。另一个常见误会：已被跟踪的文件后加进 .gitignore 是无效的，要先 <code>git rm --cached 文件名</code> 停止跟踪。</p>

	      <h2>小结</h2>
	      <p>Git 的命令很多，但 80% 的时间你只需要：<strong>status、add、commit、push、pull、branch、checkout、merge</strong> 这 8 个命令。其余命令是"救火"用的——遇到问题时知道有对应解决方案就行，不必死记硬背。多带两条心法走：<strong>rebase 别碰公共历史；搞砸了先 git reflog</strong>。<strong>最好的学习方式是在真实项目中使用 Git</strong>，遇到冲突不要怕，这正是理解 Git 原理的好机会。代码写完要跑起来，就轮到 <a href="#/notes/linux-commands">Linux 命令</a>和 <a href="#/notes/docker-intro">Docker</a> 登场了。</p>`;

<script setup lang="ts">
// 命令提示符：dir/tree/cd 真目录结构、type/find 真文章数据、calc 真四则运算、
// color 终端配色、history 持久化、Tab 补全、Ctrl+L 清屏 / Ctrl+C 中断任务。
// 文章数据统一走 articlesIndex（懒加载 + 缓存），不在终端里重复实现。
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';
import { notes, type Note } from '../data/notes';
import {
  loadArticle, loadAllArticles, searchArticles, sizeKB, estimateMinutes, stripTags,
} from '../data/articlesIndex';
import { categoryNames, CAT_ORDER } from '../data/categories';

const router = useRouter();

interface Line { t: string; c?: string }

const lines = ref<Line[]>([]);
const input = ref('');
const history = ref<string[]>([]);
const historyIdx = ref(-1);
const matrixMode = ref(false);
const bodyEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);
const cwd = ref<string[]>([]);   // 当前所在分类目录（仅一层：C:\YF\BLOG\<分类>）

const bootAt = Date.now();
let matrixTimer: ReturnType<typeof setInterval> | undefined;
let pingTimer: ReturnType<typeof setInterval> | undefined;
let sizesWarmed = false;

const APPS: Record<string, string> = {
  notepad: '/notepad',
  paint: '/paint',
  calculator: '/calculator',
  airplane: '/airplane',
  survivor: '/survivors',
  minesweeper: '/minesweeper',
  explorer: '/computer',
  terminal: '/terminal',
  typing: '/typing',
};

const COMMANDS = [
  'calc', 'cd', 'cls', 'color', 'date', 'dir', 'echo', 'find', 'help', 'history',
  'list', 'ls', 'matrix', 'neofetch', 'open', 'ping', 'start', 'time', 'tree', 'type', 'ver', 'whoami',
];

const HISTORY_KEY = 'terminal-history';
const HISTORY_MAX = 100;

function loadStoredHistory(): string[] {
  try {
    const arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === 'string') : [];
  } catch { return []; }
}

// ============ 终端配色（color 命令，DOS 两位十六进制代码） ============
const DOS_COLORS: Record<string, string> = {
  '0': '#000000', '1': '#000080', '2': '#008000', '3': '#008080',
  '4': '#800000', '5': '#800080', '6': '#808000', '7': '#c0c0c0',
  '8': '#808080', '9': '#0000ff', 'a': '#00ff00', 'b': '#00ffff',
  'c': '#ff0000', 'd': '#ff00ff', 'e': '#ffff00', 'f': '#ffffff',
};
const DEFAULT_COLOR = { bg: '#000000', fg: '#d4d4d4' };

function applyColorCode(code: string): { bg: string; fg: string } {
  const bg = DOS_COLORS[code[0]?.toLowerCase() ?? ''];
  const fg = DOS_COLORS[code[1]?.toLowerCase() ?? ''];
  return bg && fg ? { bg, fg } : { ...DEFAULT_COLOR };
}

function loadColorScheme(): { bg: string; fg: string } {
  try {
    const v = localStorage.getItem('terminal-color');
    if (v && /^[0-9a-f]{2}$/i.test(v)) return applyColorCode(v);
  } catch { /* 忽略 */ }
  return { ...DEFAULT_COLOR };
}

const colorScheme = ref(loadColorScheme());

const currentPath = (): string => 'C:\\YF\\BLOG' + (cwd.value.length ? '\\' + cwd.value.join('\\') : '');
const PROMPT = computed(() => currentPath() + '>');

// ============ 基础输出 ============
function push(t: string, c?: string): void {
  lines.value.push({ t, c });
}

function pushLines(items: string[], c?: string): void {
  for (const t of items) push(t, c);
}

function uptime(): string {
  const s = Math.floor((Date.now() - bootAt) / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} 分 ${s % 60} 秒` : `${s} 秒`;
}

function browserName(): string {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Edge';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Safari\//.test(ua)) return 'Safari';
  return '未知';
}

const ASCII = computed(() => ([
  '     .--.        ',
  '    |o_o |       ',
  '    |:_/ |       ',
  '   //   \\ \\      ',
  "  (|     | )     ",
  " /'\\_   _/`\\     ",
  ' \\___)=(___/     ',
]));

function scrollBottom(): void {
  nextTick(() => {
    if (bodyEl.value) bodyEl.value.scrollTop = bodyEl.value.scrollHeight;
  });
}

// ============ 目录解析 ============
function resolveCategory(raw: string): string | null {
  const s = raw.trim().toLowerCase().replace(/^\\+|\\+$/g, '');
  if (categoryNames[s]) return s;
  const name = raw.trim().toLowerCase();
  for (const [id, n] of Object.entries(categoryNames)) {
    if (n.toLowerCase() === name) return id;
  }
  return null;
}

function resolveNote(raw: string): Note | null {
  const s = raw.trim().toLowerCase().replace(/\.txt$/, '');
  if (!s) return null;
  const exact = notes.find(n => n.id === s);
  if (exact) return exact;
  // 在分类目录里允许 id 前缀简写
  if (cwd.value.length) {
    const fuzzy = notes.find(n => n.category === cwd.value[0] && n.id.startsWith(s));
    if (fuzzy) return fuzzy;
  }
  return null;
}

// ============ 各命令实现 ============
async function cmdDir(): Promise<void> {
  push(` ${currentPath()} 的目录`, '#9adcff');
  push('');
  if (!cwd.value.length) {
    const today = new Date();
    const stamp = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    push(` ${stamp}  09:30    <DIR>          .`);
    push(` ${stamp}  09:30    <DIR>          ..`);
    const cats = CAT_ORDER.filter(c => notes.some(n => n.category === c));
    for (const cat of cats) {
      const files = notes.filter(n => n.category === cat);
      const latest = files.map(f => f.date).sort()[files.length - 1];
      push(` ${latest}  09:30    <DIR>          ${cat.padEnd(11)} ${categoryNames[cat]}`);
    }
    push('');
    push(`              共 ${cats.length} 个目录, ${notes.length} 个文件`, '#9adcff');
    return;
  }
  const cat = cwd.value[0];
  const files = notes.filter(n => n.category === cat);
  if (!sizesWarmed) push(' 正在统计文件体积...', '#888');
  const all = await loadAllArticles();
  sizesWarmed = true;
  let total = 0;
  for (const f of files) {
    const kb = sizeKB(all.get(f.id) ?? '');
    total += kb;
    push(` ${f.date}  09:30    ${String(kb).padStart(9)} ${f.id}.txt`);
  }
  push('');
  push(`              共 ${files.length} 个文件, 约 ${total} KB`, '#9adcff');
  scrollBottom();
}

function cmdTree(): void {
  push('C:\\YF\\BLOG', '#9adcff');
  const cats = CAT_ORDER.filter(c => notes.some(n => n.category === c));
  cats.forEach((cat, i) => {
    const files = notes.filter(n => n.category === cat);
    const lastCat = i === cats.length - 1;
    push(`${lastCat ? '└──' : '├──'} ${categoryNames[cat]}/  (${files.length} 篇)`, '#9adcff');
    files.forEach((f, j) => {
      const lastFile = j === files.length - 1;
      push(`    ${lastFile ? '└──' : '├──'} ${f.id}.txt`);
    });
  });
  push('');
  push(`共 ${cats.length} 个分类, ${notes.length} 篇文章。D:\\GAMEZ 里还有 3 款游戏。`, '#9adcff');
  scrollBottom();
}

function cmdCd(rawTarget: string): void {
  const t = rawTarget.trim();
  if (!t) { push(' ' + currentPath()); return; }
  if (t === '..') { if (cwd.value.length) cwd.value.pop(); return; }
  if (t === '\\' || t === '/' || t.toLowerCase() === 'c:\\yf\\blog') { cwd.value = []; return; }
  const cat = resolveCategory(t);
  if (!cat) { push('系统找不到指定的路径。', '#ff8080'); return; }
  cwd.value = [cat];
}

async function cmdType(rawId: string): Promise<void> {
  const note = resolveNote(rawId);
  if (!note) { push(`系统找不到文件 "${rawId}"。用 dir 查看列表。`, '#ff8080'); return; }
  push(`正在读取 ${note.id}.txt ...`, '#888');
  const html = await loadArticle(note.id);
  if (!html) { push('文件读取失败。', '#ff8080'); return; }
  const kb = sizeKB(html);
  const mins = estimateMinutes(html);
  push('─'.repeat(44), '#808080');
  push(` ${note.title}`, '#ffd34d');
  push(` ${note.date} · ${note.category ? (categoryNames[note.category] ?? note.category) : '未分类'} · ${kb} KB · 约 ${mins} 分钟读完`, '#9adcff');
  const hs = Array.from(html.matchAll(/<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi));
  if (hs.length) {
    push(' 目录:', '#9adcff');
    for (const [, lvl, inner] of hs) {
      const text = stripTags(inner).trim();
      if (text) push(`   ${lvl === '3' ? '· ' : ''}${text}`);
    }
  }
  const paras = Array.from(html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
    .map(m => stripTags(m[1]).trim())
    .filter(t => t.length > 0);
  push('');
  for (const p of paras.slice(0, 3)) push(' ' + p);
  const more = paras.length - Math.min(3, paras.length);
  if (more > 0) push(` ……以下还有 ${more} 段，输入 open ${note.id} 阅读全文`, '#888');
  push('─'.repeat(44), '#808080');
  scrollBottom();
}

async function cmdFind(rawArg: string): Promise<void> {
  const arg = rawArg.trim();
  const openMode = /^-o\s+/i.test(arg);
  const q = (openMode ? arg.replace(/^-o\s+/i, '') : arg).trim();
  if (!q) { push('用法: find <关键词>    find -o <关键词>（直接打开最佳匹配）', '#ff8080'); return; }
  const cat = cwd.value[0] ?? '';
  if (cat) push(` 搜索范围: ${categoryNames[cat] ?? cat} 分类（cd .. 可扩大到全库）`, '#888');
  push(` 正在搜索 "${q}" ...`, '#888');
  let res = await searchArticles({ name: '', content: q, category: cat });
  if (!res.indexed) {
    push(' 首次全文搜索，正在建立索引...', '#888');
    await loadAllArticles();
    res = await searchArticles({ name: '', content: q, category: cat });
  }
  const hits = res.hits.filter(h => h.contentMatches > 0);
  if (!hits.length) {
    const byTitle = await searchArticles({ name: q, content: '', category: cat });
    if (!byTitle.hits.length) { push(` 没有找到包含 "${q}" 的文件。`, '#ff8080'); scrollBottom(); return; }
    push(` 正文中未命中，标题匹配的文件:`, '#9adcff');
    for (const h of byTitle.hits) push(` ${h.id}.txt  ${h.categoryName} · ${h.date}`, '#9adcff');
    push(` 输入 open ${byTitle.hits[0].id} 打开第一个结果`, '#888');
    scrollBottom();
    return;
  }
  if (openMode) {
    const best = [...hits].sort((a, b) => b.contentMatches - a.contentMatches)[0];
    push(` 最佳匹配: ${best.title}（${best.contentMatches} 处命中），正在打开...`, '#9adcff');
    setTimeout(() => router.push(best.path), 400);
    scrollBottom();
    return;
  }
  for (const h of hits.slice(0, 10)) {
    push(` ${h.id}.txt  ${h.contentMatches} 处命中 · ${h.categoryName} · ${h.date}`, '#9adcff');
    if (h.snippet) push(`   ${stripTags(h.snippet)}`);
  }
  if (hits.length > 10) push(` ……共 ${hits.length} 个文件命中，仅显示前 10 个`, '#888');
  push(` 提示: find -o ${q} 直接打开最佳匹配`, '#888');
  scrollBottom();
}

function cmdCalc(expr: string): void {
  const s = expr.trim();
  if (!s) { push('用法: calc <表达式>    例: calc (1+2)*3.5', '#ff8080'); return; }
  interface Tok { t: 'num' | 'op'; v: string }
  const toks: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === ' ') { i++; continue; }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      const ns = s.slice(i, j);
      if (!/^(\d+\.?\d*|\.\d+)$/.test(ns)) { push('表达式无效。', '#ff8080'); return; }
      toks.push({ t: 'num', v: ns }); i = j;
    } else if ('+-*/%()'.includes(ch)) { toks.push({ t: 'op', v: ch }); i++; }
    else { push(`表达式无效（不认识 "${ch}"）。支持 + - * / % 和括号。`, '#ff8080'); return; }
  }
  if (!toks.length) { push('表达式无效。', '#ff8080'); return; }
  // 递归下降求值：expr = term (+|- term)*，term = unary (*|/|% unary)*
  let p = 0;
  let bad = false;
  const peek = (): Tok | undefined => toks[p];
  const primary = (): number => {
    const tk = peek();
    if (!tk) { bad = true; return 0; }
    if (tk.t === 'num') { p++; return parseFloat(tk.v); }
    if (tk.v === '(') {
      p++;
      const v = expr1();
      const nx = peek();
      if (nx && nx.t === 'op' && nx.v === ')') { p++; return v; }
      bad = true; return 0;
    }
    bad = true; return 0;
  };
  const unary = (): number => {
    const tk = peek();
    if (tk && tk.t === 'op' && (tk.v === '-' || tk.v === '+')) {
      p++;
      const v = unary();
      return tk.v === '-' ? -v : v;
    }
    return primary();
  };
  const term = (): number => {
    let v = unary();
    while (!bad) {
      const tk = peek();
      if (tk && tk.t === 'op' && (tk.v === '*' || tk.v === '/' || tk.v === '%')) {
        p++;
        const r = unary();
        if ((tk.v === '/' || tk.v === '%') && r === 0) { bad = true; return 0; }
        v = tk.v === '*' ? v * r : tk.v === '/' ? v / r : v % r;
      } else break;
    }
    return v;
  };
  const expr1 = (): number => {
    let v = term();
    while (!bad) {
      const tk = peek();
      if (tk && tk.t === 'op' && (tk.v === '+' || tk.v === '-')) {
        p++;
        const r = term();
        v = tk.v === '+' ? v + r : v - r;
      } else break;
    }
    return v;
  };
  const val = expr1();
  if (bad || p !== toks.length || !isFinite(val)) {
    push('表达式无效。支持 + - * / % 和括号，除数不能为 0。', '#ff8080');
    return;
  }
  const out = Math.abs(val) < 1e15 ? String(parseFloat(val.toPrecision(12))) : val.toExponential(6);
  push(` ${s} = ${out}`, '#ffd34d');
}

function cmdColor(rawCode: string): void {
  const code = rawCode.trim();
  if (!code) {
    colorScheme.value = { ...DEFAULT_COLOR };
    try { localStorage.removeItem('terminal-color'); } catch { /* 忽略 */ }
    push('配色已恢复默认。用法: color <背景><文字>，如 color 0A 黑底绿字、color 1F 蓝底白字。');
    return;
  }
  if (!/^[0-9a-f]{2}$/i.test(code)) { push(`无效配色 "${code}"。格式: color <背景><文字>，两位十六进制(0-F)。`, '#ff8080'); return; }
  colorScheme.value = applyColorCode(code);
  try { localStorage.setItem('terminal-color', code.toLowerCase()); } catch { /* 忽略 */ }
  push(`配色已切换为 ${code.toUpperCase()}。`, '#9adcff');
}

function cmdHistory(rawArg: string): void {
  if (rawArg.trim() === '-c') {
    history.value = [];
    try { localStorage.removeItem(HISTORY_KEY); } catch { /* 忽略 */ }
    push('命令历史已清空。');
    return;
  }
  if (!history.value.length) { push('暂无历史命令。'); return; }
  history.value.forEach((h, i) => push(`   ${String(i + 1).padStart(3)}  ${h}`));
}

// ============ 命令分发 ============
function run(raw: string): void {
  const cmdLine = raw.trim();
  push(PROMPT.value + ' ' + raw);
  if (!cmdLine) return;
  const [cmd, ...args] = cmdLine.split(/\s+/);
  const arg = args.join(' ');
  const c = cmd.toLowerCase();

  switch (c) {
    case 'help':
      pushLines([
        '可用命令：',
        '  dir              列出当前目录（真实日期与体积）',
        '  tree             树状显示博客全部目录',
        '  cd <分类> / ..   切换分类目录（如 cd vue、cd ..）',
        '  type <文章id>    终端内预览文章（标题/目录/开头几段）',
        '  open <文章id>    打开文章页面',
        '  find <关键词>    全文检索正文（find -o 直接打开最佳匹配）',
        '  calc <表达式>    四则运算（支持 + - * / % 和括号）',
        '  color <代码>     终端配色（color 0A 黑底绿字，color 恢复默认）',
        '  history          命令历史（history -c 清空，跨会话保存）',
        '  start <应用>     启动应用（notepad/paint/calculator/airplane/survivor/minesweeper/explorer...）',
        '  neofetch         显示系统信息',
        '  ping <主机>      测试网络连通（Ctrl+C 中断）',
        '  matrix           ？？？',
        '  date / time      显示当前日期 / 时间',
        '  whoami / ver     你是谁 / 系统版本',
        '  cls / Ctrl+L     清屏',
        '  Tab              补全命令与文件名（有歧义时列出候选）',
        '  ↑ / ↓            翻看历史命令',
      ]);
      break;

    case 'dir':
    case 'ls':
    case 'list':
      void cmdDir();
      break;

    case 'tree':
      cmdTree();
      break;

    case 'cd':
      cmdCd(arg);
      break;

    case 'type':
      if (!arg) { push('用法: type <文章id>   提示: 用 dir 或 tree 查看列表', '#ff8080'); break; }
      void cmdType(arg);
      break;

    case 'open': {
      if (!arg) { push('用法: open <文章id>   提示: 用 dir 查看列表', '#ff8080'); break; }
      const note = resolveNote(arg);
      if (!note) { push(`系统找不到文件 "${arg}"。`, '#ff8080'); break; }
      push(`正在打开 ${note.title} ...`, '#9adcff');
      setTimeout(() => router.push(`/notes/${note.id}`), 500);
      break;
    }

    case 'find':
      void cmdFind(arg);
      break;

    case 'calc':
      cmdCalc(arg);
      break;

    case 'color':
      cmdColor(arg);
      break;

    case 'history':
      cmdHistory(arg);
      break;

    case 'start': {
      const app = arg.toLowerCase();
      if (APPS[app]) {
        push(`正在启动 ${app} ...`, '#9adcff');
        setTimeout(() => router.push(APPS[app]), 400);
      } else {
        push(`'${arg || ''}' 不是可用的应用。可用: ${Object.keys(APPS).join(' / ')}`, '#ff8080');
      }
      break;
    }

    case 'neofetch': {
      const info = [
        'YF@blog',
        '-----------------',
        'OS: Windows 98 Edition (Vue 3 + Vite)',
        'Host: YF\'s Personal Tech Blog',
        'Kernel: ' + browserName() + ' ' + (navigator.userAgent.match(/(Edg|Firefox|Chrome|Safari)\/[\d.]+/)?.[0] ?? ''),
        'Uptime: ' + uptime(),
        'Articles: ' + notes.length + ' 篇',
        'Games: 飞机大战 / 桌面保卫战 / 扫雷',
        'Pets: QQ 企鹅 x1',
        'Resolution: ' + window.screen.width + 'x' + window.screen.height,
      ];
      const art = ASCII.value;
      const rows = Math.max(art.length, info.length);
      for (let i = 0; i < rows; i++) {
        push((art[i] ?? '                 ').padEnd(18) + (info[i] ?? ''), i === 0 ? '#ffd34d' : undefined);
      }
      break;
    }

    case 'ping': {
      const host = arg || 'blog.yf.dev';
      const ip = '42.' + (Math.floor(Math.random() * 200) + 20) + '.' + (Math.floor(Math.random() * 250) + 5) + '.10';
      push(`正在 Ping ${host} [${ip}] 具有 32 字节的数据:`, '#9adcff');
      let i = 0;
      // 连发防护：上一个 ping 未结束时先清掉，否则旧 interval 被覆盖后永远清不掉
      if (pingTimer) clearInterval(pingTimer);
      pingTimer = setInterval(() => {
        i++;
        push(`来自 ${ip} 的回复: 字节=32 时间=${Math.floor(Math.random() * 30) + 8}ms TTL=118`);
        if (i >= 4) {
          clearInterval(pingTimer);
          pingTimer = undefined;
          push(`\n${host} 的 Ping 统计信息:\n    已发送 = 4，已接收 = 4，丢失 = 0 (0% 丢失)`, '#9adcff');
          scrollBottom();
        }
      }, 380);
      break;
    }

    case 'matrix': {
      if (matrixMode.value) break;
      matrixMode.value = true;
      push('Wake up, Neo...', '#3fff3f');
      let n = 0;
      const chars = 'アイウエオカキクケコサシスセソ0123456789';
      matrixTimer = setInterval(() => {
        n++;
        let line = '';
        for (let i = 0; i < 66; i++) line += Math.random() < 0.4 ? chars[Math.floor(Math.random() * chars.length)] : ' ';
        push(line, '#3fff3f');
        if (n > 46) {
          clearInterval(matrixTimer);
          matrixTimer = undefined;
          matrixMode.value = false;
          push('跟着我，选择红色药丸。', '#3fff3f');
        }
        scrollBottom();
      }, 70);
      break;
    }

    case 'date':
      push('当前日期: ' + new Date().toLocaleDateString('zh-CN'));
      break;
    case 'time':
      push('当前时间: ' + new Date().toLocaleTimeString('zh-CN'));
      break;
    case 'whoami':
      push('DESKTOP\\访客（权限：路人）');
      break;
    case 'ver':
      push("YF's Blog [版本 2.2] · Windows 98 Edition");
      break;
    case 'cls':
      lines.value = [];
      break;
    case 'echo':
      push(arg || 'ECHO 处于打开状态。');
      break;

    default:
      push(`'${cmd}' 不是内部或外部命令，也不是可运行的程序或批处理文件。`, '#ff8080');
      push("输入 help 查看可用命令。", '#888');
  }
}

// ============ 输入交互 ============
function execute(): void {
  const raw = input.value;
  input.value = '';
  historyIdx.value = -1;
  const trimmed = raw.trim();
  if (trimmed) {
    history.value.push(trimmed);
    if (history.value.length > HISTORY_MAX) history.value = history.value.slice(-HISTORY_MAX);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.value)); } catch { /* 忽略 */ }
  }
  run(raw);
  scrollBottom();
}

// Ctrl+C：中断 ping / matrix 这类滚动输出
function interruptJobs(): void {
  let stopped = false;
  if (pingTimer) { clearInterval(pingTimer); pingTimer = undefined; stopped = true; }
  if (matrixTimer) { clearInterval(matrixTimer); matrixTimer = undefined; stopped = true; }
  if (matrixMode.value) matrixMode.value = false;
  if (stopped) push('^C', '#ff8080');
}

// Tab 补全：第一个词补命令，参数按命令类型补文章 id / 应用名 / 分类 / 配色码
function tabComplete(): void {
  const raw = input.value;
  const parts = raw.split(/\s+/);
  const lastIdx = parts.length - 1;
  const last = (parts[lastIdx] ?? '').toLowerCase();
  const cmd = (parts[0] ?? '').toLowerCase();

  let pool: string[] = [];
  if (parts.length === 1) {
    pool = COMMANDS;
  } else if (cmd === 'open' || cmd === 'type') {
    pool = (cwd.value.length ? notes.filter(n => n.category === cwd.value[0]) : notes).map(n => n.id);
  } else if (cmd === 'start') {
    pool = Object.keys(APPS);
  } else if (cmd === 'cd') {
    pool = ['..', ...CAT_ORDER];
  } else if (cmd === 'color') {
    pool = ['07', '0a', '0b', '0c', '0e', '1f', '2a', 'f0'];
  } else {
    return;
  }

  const matches = last ? pool.filter(p => p.startsWith(last)) : pool;
  if (!matches.length) return;
  if (matches.length === 1) {
    parts[lastIdx] = matches[0];
    input.value = parts.join(' ');
    return;
  }
  // 多个候选：像真 shell 一样回显当前行并列出候选
  push(PROMPT.value + ' ' + raw);
  push(matches.map(m => (cwd.value.length && cmd === 'cd' && m !== '..' ? categoryNames[m] + ' (' + m + ')' : m)).join('   '), '#9adcff');
  scrollBottom();
}

function onKeydown(e: KeyboardEvent): void {
  // 中文输入法组词中按 Enter 是确认候选词，不执行命令
  if (e.isComposing || e.keyCode === 229) return;
  if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) { e.preventDefault(); lines.value = []; return; }
  if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) { e.preventDefault(); interruptJobs(); return; }
  if (e.key === 'Tab') { e.preventDefault(); tabComplete(); return; }
  if (e.key === 'Enter') {
    execute();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (!history.value.length) return;
    historyIdx.value = historyIdx.value < 0
      ? history.value.length - 1
      : Math.max(0, historyIdx.value - 1);
    input.value = history.value[historyIdx.value];
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIdx.value < 0) return;
    historyIdx.value++;
    if (historyIdx.value >= history.value.length) { historyIdx.value = -1; input.value = ''; }
    else input.value = history.value[historyIdx.value];
  }
}

function focusInput(): void {
  inputEl.value?.focus();
}

// 开场白
onMounted(() => {
  history.value = loadStoredHistory();
  pushLines([
    "Microsoft(R) Windows 98",
    '   (C)Copyright Microsoft Corp 1981-1999.',
    '',
    "欢迎来到 YF's Blog 命令行。输入 help 查看可用命令。",
    '',
  ], '#9adcff');
  focusInput();
  scrollBottom();
});

onUnmounted(() => {
  if (matrixTimer) clearInterval(matrixTimer);
  if (pingTimer) clearInterval(pingTimer);
});
</script>

<template>
  <Window
    title="C:\WINDOWS\system32\command.com"
    icon="fa fa-terminal"
    :isOpen="true"
    :isActive="true"
    :defaultMaximized="true"
    @close="router.push('/')"
  >
    <div
      class="w-full h-full font-mono text-[13px] leading-[1.5] overflow-hidden flex flex-col"
      :style="{ background: colorScheme.bg }"
      @click="focusInput"
    >
      <div ref="bodyEl" class="flex-1 overflow-y-auto p-2 whitespace-pre-wrap break-all win-terminal">
        <div v-for="(l, i) in lines" :key="i" :style="{ color: l.c || colorScheme.fg }">{{ l.t }}</div>
        <div class="flex">
          <span class="shrink-0" :style="{ color: colorScheme.fg }">{{ PROMPT }}&nbsp;</span>
          <input
            ref="inputEl"
            v-model="input"
            class="flex-1 bg-transparent outline-none border-none font-mono"
            :style="{ color: colorScheme.fg, caretColor: colorScheme.fg }"
            spellcheck="false"
            autocomplete="off"
            @keydown="onKeydown"
          />
        </div>
      </div>
    </div>
  </Window>
</template>

<style scoped>
.win-terminal::-webkit-scrollbar { width: 14px; }
.win-terminal::-webkit-scrollbar-thumb { background: #c0c0c0; border: 2px solid; border-color: #fff #808080 #808080 #fff; }
.win-terminal::-webkit-scrollbar-track { background: transparent; }
</style>

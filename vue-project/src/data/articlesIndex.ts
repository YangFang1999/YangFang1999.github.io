// 文章全量索引：懒加载 + 缓存、体积/阅读时长估算、全文搜索（含摘要）。
// NoteDetail / 查找对话框 / 我的电脑 共用这一份，避免重复加载与重复实现。
import { notes } from './notes';

// 每篇文章一个独立 chunk，只在需要时才下载（与 NoteDetail 原有逻辑一致）
const articleLoaders: Record<string, () => Promise<{ default: string }>> = {
  'hello-world': () => import('./articles/hello-world'),
  'idea-shortcuts': () => import('./articles/idea-shortcuts'),
  'java-collections-framework': () => import('./articles/java-collections-framework'),
  'vue-migration': () => import('./articles/vue-migration'),
  'spring-boot-guide': () => import('./articles/spring-boot-guide'),
  'mysql-basics': () => import('./articles/mysql-basics'),
  'git-basics': () => import('./articles/git-basics'),
  'docker-intro': () => import('./articles/docker-intro'),
  'linux-commands': () => import('./articles/linux-commands'),
  'javascript-es6': () => import('./articles/javascript-es6'),
  'design-patterns': () => import('./articles/design-patterns'),
  'redis-basics': () => import('./articles/redis-basics'),
  'vue-reactivity': () => import('./articles/vue-reactivity'),
  'vue-composition': () => import('./articles/vue-composition'),
  'vue-router4': () => import('./articles/vue-router4'),
  'pinia-intro': () => import('./articles/pinia-intro'),
  'learning-journey': () => import('./articles/learning-journey'),
};

const categoryNames: Record<string, string> = {
  java: 'Java',
  spring: 'Spring',
  database: 'Database',
  frontend: 'Frontend',
  devops: 'DevOps',
  vue: 'Vue',
  essay: '随笔',
};

export { articleLoaders, categoryNames };

const contentCache = new Map<string, string>();
let loadAllPromise: Promise<Map<string, string>> | null = null;

/** 读取单篇正文（带缓存） */
export async function loadArticle(id: string): Promise<string> {
  const hit = contentCache.get(id);
  if (hit !== undefined) return hit;
  const loader = articleLoaders[id];
  if (!loader) return '';
  const mod = await loader();
  contentCache.set(id, mod.default);
  return mod.default;
}

/** 预热全部正文（搜索/磁盘占用用），多次调用复用同一个进行中的 Promise */
export function loadAllArticles(): Promise<Map<string, string>> {
  if (loadAllPromise) return loadAllPromise;
  loadAllPromise = (async () => {
    await Promise.all(Object.keys(articleLoaders).map(id => loadArticle(id)));
    return contentCache;
  })();
  return loadAllPromise;
}

export function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

/** 预计阅读时长（中文为主，按 400 字/分钟） */
export function estimateMinutes(html: string): number {
  return Math.max(1, Math.round(stripTags(html).replace(/\s/g, '').length / 400));
}

/** 体积 KB（按 UTF-8 字节算） */
export function sizeKB(html: string): number {
  return Math.max(1, Math.round(new TextEncoder().encode(html).length / 1024));
}

export interface ArticleMeta {
  id: string;
  title: string;
  date: string;
  category: string;
  categoryName: string;
  icon: string;
  path: string;
}

export function articleMetas(): ArticleMeta[] {
  return notes.map(n => ({
    id: n.id,
    title: n.title,
    date: n.date,
    category: n.category ?? '',
    categoryName: n.category ? (categoryNames[n.category] ?? n.category) : '未分类',
    icon: n.icon,
    path: n.path,
  }));
}

export interface SearchHit extends ArticleMeta {
  size: number;          // KB
  minutes: number;
  contentMatches: number;
  snippet: string;       // 已含 <mark> 高亮的 HTML
}

/** 转义正则特殊字符 */
function escapeReg(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 纯文本摘要：截取关键词前后各 ~48 字符，并高亮所有命中 */
function makeSnippet(text: string, query: string): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  const lower = flat.toLowerCase();
  const q = query.toLowerCase();
  const first = lower.indexOf(q);
  if (first < 0) return '';
  const start = Math.max(0, first - 48);
  const end = Math.min(flat.length, first + q.length + 60);
  let seg = (start > 0 ? '…' : '') + flat.slice(start, end) + (end < flat.length ? '…' : '');
  // 高亮该片段内的全部命中
  seg = seg.replace(new RegExp(escapeReg(query), 'gi'), m => `<mark>${m}</mark>`);
  return seg;
}

export interface SearchOptions {
  name: string;      // 文件名/标题关键词
  content: string;   // 包含文字
  category: string;  // '' = 全部
}

/** 全文搜索：标题/分类即时过滤；contentQuery 需要正文（自动预热缓存） */
export async function searchArticles(opts: SearchOptions): Promise<{ hits: SearchHit[]; indexed: boolean }> {
  const name = opts.name.trim();
  const content = opts.content.trim();
  const needContent = content.length > 0;
  let contents: Map<string, string> | null = null;
  let indexed = true;
  if (needContent) {
    contents = contentCache.size >= Object.keys(articleLoaders).length ? contentCache : null;
    if (!contents) {
      // 先用已缓存的部分给出即时结果，同时后台补全索引
      contents = contentCache;
      indexed = false;
      void loadAllArticles();
    }
  }
  const hits: SearchHit[] = [];
  for (const meta of articleMetas()) {
    if (opts.category && meta.category !== opts.category) continue;
    if (name && !meta.title.toLowerCase().includes(name.toLowerCase())) continue;
    const html = contents?.get(meta.id) ?? '';
    let contentMatches = 0;
    let snippet = '';
    if (needContent) {
      if (html) {
        const text = stripTags(html);
        contentMatches = countOccurrences(text, content);
        if (contentMatches === 0) continue;
        snippet = makeSnippet(text, content);
      } else {
        snippet = '<span class="text-gray-500">索引中…</span>';
      }
    }
    hits.push({
      ...meta,
      size: html ? sizeKB(html) : 0,
      minutes: html ? estimateMinutes(html) : 0,
      contentMatches,
      snippet,
    });
  }
  return { hits, indexed };
}

function countOccurrences(text: string, query: string): number {
  if (!query) return 0;
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let count = 0;
  let i = lower.indexOf(q);
  while (i >= 0) {
    count++;
    i = lower.indexOf(q, i + q.length);
  }
  return count;
}

/** 转义 HTML（标题高亮用） */
export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** 高亮标题里的命中词 */
export function highlightTitle(title: string, query: string): string {
  const safe = escapeHtml(title);
  if (!query.trim()) return safe;
  return safe.replace(new RegExp(escapeReg(escapeHtml(query.trim())), 'gi'), m => `<mark>${m}</mark>`);
}

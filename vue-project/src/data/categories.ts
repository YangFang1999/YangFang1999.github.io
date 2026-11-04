// 分类单一来源：显示名 / 终端顺序 / 控制面板卡片（图标+颜色）都在这一个文件里。
// articlesIndex、NoteDetail、Categories、TerminalApp 全部从这里取——
// 加分类只改这里（此前四处重复映射的技术债已收敛，勿再复制映射）。
export interface CategoryDef {
  id: string;
  name: string;      // 显示名
  icon: string;      // FA 4.7 类（控制面板卡片）
  color: string;     // tailwind 文本色（控制面板卡片）
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'java', name: 'Java', icon: 'fa fa-coffee', color: 'text-orange-500' },
  { id: 'spring', name: 'Spring', icon: 'fa fa-leaf', color: 'text-green-500' },
  { id: 'database', name: 'Database', icon: 'fa fa-database', color: 'text-blue-500' },
  { id: 'frontend', name: 'Frontend', icon: 'fa fa-code', color: 'text-pink-500' },
  { id: 'vue', name: 'Vue', icon: 'fa fa-diamond', color: 'text-emerald-400' },
  { id: 'devops', name: 'DevOps', icon: 'fa fa-server', color: 'text-purple-500' },
  { id: 'essay', name: '随笔', icon: 'fa fa-pencil', color: 'text-sky-300' },
];

export const categoryNames: Record<string, string> = Object.fromEntries(
  CATEGORIES.map(c => [c.id, c.name]),
);

/** 终端 dir/tree 的分类顺序（= CATEGORIES 声明顺序） */
export const CAT_ORDER: string[] = CATEGORIES.map(c => c.id);

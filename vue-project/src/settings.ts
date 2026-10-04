// 桌面主题设置（控制面板 → 显示属性）：响应式 + localStorage 持久化
import { ref } from 'vue';

export type DesktopTheme = 'wallpaper' | 'teal' | 'blue' | 'dark';

const KEY = 'desktop-theme';

export const THEMES: Record<DesktopTheme, { name: string; bg: string | null }> = {
  wallpaper: { name: '默认壁纸', bg: null },
  teal: { name: '经典青绿', bg: '#008080' },
  blue: { name: '蔚蓝桌面', bg: '#3a6ea5' },
  dark: { name: '深夜黑', bg: '#0b0b10' },
};

function load(): DesktopTheme {
  const v = localStorage.getItem(KEY) as DesktopTheme | null;
  return v && v in THEMES ? v : 'wallpaper';
}

export const desktopTheme = ref<DesktopTheme>(load());

export function setTheme(t: DesktopTheme): void {
  desktopTheme.value = t;
  try { localStorage.setItem(KEY, t); } catch { /* 忽略 */ }
}

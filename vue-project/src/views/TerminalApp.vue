<script setup lang="ts">
// 命令提示符：dir 列文章 / open 打开文章 / start 启动应用 / neofetch / ping / matrix 彩蛋
import { ref, nextTick, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';
import { notes } from '../data/notes';

const router = useRouter();

interface Line { t: string; c?: string }

const PROMPT = "C:\\YF's BLOG>";
const lines = ref<Line[]>([]);
const input = ref('');
const history = ref<string[]>([]);
const historyIdx = ref(-1);
const matrixMode = ref(false);
const bodyEl = ref<HTMLElement | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);

const bootAt = Date.now();
let matrixTimer: ReturnType<typeof setInterval> | undefined;

const APPS: Record<string, string> = {
  notepad: '/notepad',
  paint: '/paint',
  calculator: '/calculator',
  airplane: '/airplane',
  survivor: '/survivors',
  explorer: '/computer',
};

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

function run(raw: string): void {
  const cmdLine = raw.trim();
  push(PROMPT + ' ' + raw, '#ffffff');
  if (!cmdLine) return;
  const [cmd, ...args] = cmdLine.split(/\s+/);
  const arg = args.join(' ');
  const c = cmd.toLowerCase();

  switch (c) {
    case 'help':
      pushLines([
        '可用命令：',
        '  dir              列出博客文章与目录',
        '  open <文章id>    打开指定文章（如 open spring-boot-guide）',
        '  ls / list        同 dir',
        '  start <应用>     启动应用（notepad/paint/calculator/airplane/survivor）',
        '  neofetch         显示系统信息',
        '  ping <主机>      测试网络连通',
        '  matrix           ？？？',
        '  date / time      显示当前日期 / 时间',
        '  whoami / ver     你是谁 / 系统版本',
        '  cls              清屏',
      ]);
      break;

    case 'dir':
    case 'ls':
    case 'list': {
      push(' C:\\YF\\BLOG 的目录', '#9adcff');
      push('');
      push('2026-10-04  10:00    <DIR>          .');
      push('2026-10-04  10:00    <DIR>          ..');
      push('2026-10-04  10:00    <DIR>          游戏');
      for (const n of notes) {
        const kb = (n.id.length * 137 % 900 + 100).toLocaleString();
        push(` ${n.date}  09:30       ${kb.padStart(9)} ${n.id}.txt`);
      }
      push(`              共 ${notes.length} 个文件，2 个目录`, '#9adcff');
      break;
    }

    case 'open': {
      if (!arg) { push('用法: open <文章id>   提示: 用 dir 查看列表', '#ff8080'); break; }
      const note = notes.find(n => n.id === arg || n.id === arg.replace('.txt', ''));
      if (!note) { push(`系统找不到文件 "${arg}"。`, '#ff8080'); break; }
      push(`正在打开 ${note.title} ...`, '#9adcff');
      setTimeout(() => router.push(`/notes/${note.id}`), 500);
      break;
    }

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
        'Games: 飞机大战 / 桌面保卫战',
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
      const timer = setInterval(() => {
        i++;
        push(`来自 ${ip} 的回复: 字节=32 时间=${Math.floor(Math.random() * 30) + 8}ms TTL=118`);
        if (i >= 4) {
          clearInterval(timer);
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
    case 'cd':
      push(arg ? '目录不存在。' : 'C:\\YF\\BLOG');
      break;

    default:
      push(`'${cmd}' 不是内部或外部命令，也不是可运行的程序或批处理文件。`, '#ff8080');
      push("输入 help 查看可用命令。", '#888');
  }
}

function scrollBottom(): void {
  nextTick(() => {
    if (bodyEl.value) bodyEl.value.scrollTop = bodyEl.value.scrollHeight;
  });
}

function execute(): void {
  const raw = input.value;
  input.value = '';
  history.value.push(raw);
  historyIdx.value = -1;
  run(raw);
  scrollBottom();
}

function onKeydown(e: KeyboardEvent): void {
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
    <div class="w-full h-full bg-black font-mono text-[13px] leading-[1.5] overflow-hidden flex flex-col" @click="focusInput">
      <div ref="bodyEl" class="flex-1 overflow-y-auto p-2 whitespace-pre-wrap break-all win-terminal">
        <div v-for="(l, i) in lines" :key="i" :style="{ color: l.c || '#d4d4d4' }">{{ l.t }}</div>
        <div class="flex">
          <span class="text-[#d4d4d4] shrink-0">{{ PROMPT }}&nbsp;</span>
          <input
            ref="inputEl"
            v-model="input"
            class="flex-1 bg-transparent outline-none border-none text-[#d4d4d4] font-mono caret-[#d4d4d4]"
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
.win-terminal::-webkit-scrollbar-track { background: #000; }
</style>

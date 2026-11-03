// 扫雷引擎：纯逻辑，不含任何 DOM / Vue。
// 规则：首次点击布雷（首点 3×3 无雷）、左键翻开 + 空区扩散、右键循环 旗→问号→无、
// 和弦（chord：已翻开数字周围旗数等于数字时翻开其余邻居）、
// 胜利条件 = 翻开全部非雷格（自动给剩余雷插旗）。

export type CellState = 'hidden' | 'revealed' | 'flag' | 'question';

export interface Cell {
  mine: boolean;
  adj: number;                                   // 周围雷数（0-8）
  state: CellState;
  exploded?: boolean;                            // 踩中的那颗雷（红底）
  wrongFlag?: boolean;                           // 失败时标错的旗（打叉）
}

export interface Difficulty {
  key: 'beginner' | 'intermediate' | 'expert';
  name: string;
  w: number;
  h: number;
  m: number;
}

export const DIFFICULTIES: Difficulty[] = [
  { key: 'beginner', name: '初级', w: 9, h: 9, m: 10 },
  { key: 'intermediate', name: '中级', w: 16, h: 16, m: 40 },
  { key: 'expert', name: '高级', w: 30, h: 16, m: 99 },
];

export function difficultyByKey(key: Difficulty['key']): Difficulty {
  return DIFFICULTIES.find(d => d.key === key) ?? DIFFICULTIES[0];
}

export class Minesweeper {
  w: number;
  h: number;
  mines: number;
  grid: Cell[];
  started = false;      // 首次翻开才布雷并开始计时
  over = false;
  won = false;
  revealedCount = 0;
  flagCount = 0;
  boomX = -1;
  boomY = -1;

  constructor(w: number, h: number, m: number) {
    this.w = w;
    this.h = h;
    this.mines = m;
    this.grid = [];
    this.reset();
  }

  reset(): void {
    this.grid = Array.from({ length: this.w * this.h }, () => ({ mine: false, adj: 0, state: 'hidden' as CellState }));
    this.started = false;
    this.over = false;
    this.won = false;
    this.revealedCount = 0;
    this.flagCount = 0;
    this.boomX = -1;
    this.boomY = -1;
  }

  idx(x: number, y: number): number {
    return y * this.w + x;
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.w && y >= 0 && y < this.h;
  }

  neighbors(x: number, y: number): Array<[number, number]> {
    const out: Array<[number, number]> = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if ((dx || dy) && this.inBounds(x + dx, y + dy)) out.push([x + dx, y + dy]);
      }
    }
    return out;
  }

  /** 布雷：safeX/safeY 及其邻居保证无雷（若棋盘太小放不下则只保证首格） */
  private placeMines(safeX: number, safeY: number): void {
    const banned = new Set<number>([this.idx(safeX, safeY)]);
    for (const [nx, ny] of this.neighbors(safeX, safeY)) banned.add(this.idx(nx, ny));
    if (this.w * this.h - banned.size < this.mines) {
      banned.clear();
      banned.add(this.idx(safeX, safeY));
    }
    const total = this.w * this.h;
    let placed = 0;
    while (placed < this.mines) {
      const i = Math.floor(Math.random() * total);
      if (banned.has(i) || this.grid[i].mine) continue;
      this.grid[i].mine = true;
      placed++;
    }
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const c = this.grid[this.idx(x, y)];
        if (!c.mine) c.adj = this.neighbors(x, y).filter(([nx, ny]) => this.grid[this.idx(nx, ny)].mine).length;
      }
    }
  }

  /** 翻开。返回 'noop' | 'ok' | 'boom' */
  open(x: number, y: number): 'noop' | 'ok' | 'boom' {
    if (this.over || !this.inBounds(x, y)) return 'noop';
    const c = this.grid[this.idx(x, y)];
    if (c.state === 'revealed' || c.state === 'flag') return 'noop';
    if (!this.started) {
      this.placeMines(x, y);
      this.started = true;
    }
    if (c.mine) {
      c.state = 'revealed';
      c.exploded = true;
      this.boomX = x;
      this.boomY = y;
      this.over = true;
      this.revealAllMines();
      return 'boom';
    }
    this.floodReveal(x, y);
    this.checkWin();
    return 'ok';
  }

  private floodReveal(x: number, y: number): void {
    const stack: Array<[number, number]> = [[x, y]];
    while (stack.length) {
      const [cx, cy] = stack.pop()!;
      const c = this.grid[this.idx(cx, cy)];
      if (c.state === 'revealed' || c.state === 'flag' || c.mine) continue;
      c.state = 'revealed';
      this.revealedCount++;
      if (c.adj === 0) {
        for (const [nx, ny] of this.neighbors(cx, cy)) {
          const n = this.grid[this.idx(nx, ny)];
          if (n.state === 'hidden' || n.state === 'question') stack.push([nx, ny]);
        }
      }
    }
  }

  /** 右键：hidden → flag → question → hidden */
  cycleFlag(x: number, y: number): void {
    if (this.over || !this.inBounds(x, y)) return;
    const c = this.grid[this.idx(x, y)];
    if (c.state === 'revealed') return;
    if (c.state === 'hidden') { c.state = 'flag'; this.flagCount++; }
    else if (c.state === 'flag') { c.state = 'question'; this.flagCount--; }
    else c.state = 'hidden';
  }

  /** 和弦：对已翻开的数字格，旗数 == adj 时翻开周围未插旗格。返回是否踩雷。 */
  chord(x: number, y: number): boolean {
    if (this.over || !this.inBounds(x, y)) return false;
    const c = this.grid[this.idx(x, y)];
    if (c.state !== 'revealed' || c.adj === 0) return false;
    const ns = this.neighbors(x, y);
    const flags = ns.filter(([nx, ny]) => this.grid[this.idx(nx, ny)].state === 'flag').length;
    if (flags !== c.adj) return false;
    let boom = false;
    for (const [nx, ny] of ns) {
      const n = this.grid[this.idx(nx, ny)];
      if (n.state === 'hidden' || n.state === 'question') {
        const r = this.open(nx, ny);
        if (r === 'boom') boom = true;
      }
    }
    return boom;
  }

  private revealAllMines(): void {
    for (const c of this.grid) {
      if (c.mine && c.state !== 'flag') c.state = 'revealed';
      if (!c.mine && c.state === 'flag') c.wrongFlag = true;
    }
  }

  private checkWin(): void {
    // 胜利时所有非雷格都已翻开，因此不存在错旗——剩余雷全部自动插旗，LED 归零
    if (this.revealedCount === this.w * this.h - this.mines) {
      this.won = true;
      this.over = true;
      for (const c of this.grid) {
        if (c.mine && c.state !== 'flag') { c.state = 'flag'; this.flagCount++; }
      }
    }
  }
}

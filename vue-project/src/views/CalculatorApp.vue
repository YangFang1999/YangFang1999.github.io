<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Window from '../components/Window.vue';

const router = useRouter();

const display = ref('0');
const expression = ref('');
let currentOperand = '';
let previousOperand = '';
let operation: string | null = null;
let shouldResetDisplay = false;
let justPressedEquals = false;

function updateDisplay() {
  display.value = currentOperand || '0';
  if (operation) {
    expression.value = `${previousOperand} ${operation}`;
  } else {
    expression.value = '';
  }
}

function inputDigit(d: string) {
  if (justPressedEquals) {
    currentOperand = d;
    previousOperand = '';
    operation = null;
    justPressedEquals = false;
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }
  if (shouldResetDisplay) {
    currentOperand = d;
    shouldResetDisplay = false;
  } else {
    currentOperand = currentOperand === '0' ? d : currentOperand + d;
  }
  updateDisplay();
}

function inputDecimal() {
  if (justPressedEquals) {
    currentOperand = '0.';
    previousOperand = '';
    operation = null;
    justPressedEquals = false;
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }
  if (shouldResetDisplay) {
    currentOperand = '0.';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }
  if (!currentOperand.includes('.')) {
    currentOperand += '.';
  }
  updateDisplay();
}

function computeResult(): string {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return currentOperand;
  let result: number;
  switch (operation) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/': result = curr !== 0 ? prev / curr : NaN; break;
    default: return currentOperand;
  }
  if (isNaN(result) || !isFinite(result)) return 'Error';
  const str = parseFloat(result.toPrecision(12)).toString();
  return str.length > 14 ? result.toExponential(8) : str;
}

function inputOperator(op: string) {
  justPressedEquals = false;
  if (operation && !shouldResetDisplay) {
    const result = computeResult();
    currentOperand = result;
    previousOperand = result;
  } else {
    previousOperand = currentOperand;
  }
  operation = op;
  shouldResetDisplay = true;
  updateDisplay();
}

function inputEquals() {
  if (!operation) return;
  const result = computeResult();
  expression.value = `${previousOperand} ${operation} ${currentOperand} =`;
  currentOperand = result;
  previousOperand = '';
  operation = null;
  shouldResetDisplay = true;
  justPressedEquals = true;
  display.value = currentOperand;
}

function inputClear() {
  currentOperand = '0';
  previousOperand = '';
  operation = null;
  shouldResetDisplay = false;
  justPressedEquals = false;
  updateDisplay();
}

function inputClearEntry() {
  currentOperand = '0';
  shouldResetDisplay = false;
  justPressedEquals = false;
  updateDisplay();
}

function inputSqrt() {
  const num = parseFloat(currentOperand);
  if (num < 0) {
    display.value = 'Error';
    currentOperand = '0';
    return;
  }
  currentOperand = parseFloat(Math.sqrt(num).toPrecision(12)).toString();
  updateDisplay();
}

function inputPercent() {
  const num = parseFloat(currentOperand);
  currentOperand = parseFloat((num / 100).toPrecision(12)).toString();
  updateDisplay();
}

function inputBackspace() {
  if (justPressedEquals || shouldResetDisplay) return;
  currentOperand = currentOperand.length > 1 ? currentOperand.slice(0, -1) : '0';
  updateDisplay();
}

function inputNegate() {
  if (currentOperand === '0') return;
  currentOperand = currentOperand.startsWith('-') ? currentOperand.slice(1) : '-' + currentOperand;
  updateDisplay();
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') inputOperator('+');
  else if (e.key === '-') inputOperator('-');
  else if (e.key === '*') inputOperator('*');
  else if (e.key === '/') { e.preventDefault(); inputOperator('/'); }
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); inputEquals(); }
  else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') inputClear();
  else if (e.key === 'Backspace') inputBackspace();
  else if (e.key === '%') inputPercent();
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

type BtnFn = () => void;

interface CalcBtn {
  label: string;
  action: BtnFn;
  wide?: boolean;
  accent?: boolean;
}

const buttons: CalcBtn[][] = [
  [
    { label: 'C', action: inputClear, accent: true },
    { label: 'CE', action: inputClearEntry, accent: true },
    { label: '√', action: inputSqrt, accent: true },
    { label: '÷', action: () => inputOperator('/'), accent: true },
  ],
  [
    { label: '7', action: () => inputDigit('7') },
    { label: '8', action: () => inputDigit('8') },
    { label: '9', action: () => inputDigit('9') },
    { label: '×', action: () => inputOperator('*'), accent: true },
  ],
  [
    { label: '4', action: () => inputDigit('4') },
    { label: '5', action: () => inputDigit('5') },
    { label: '6', action: () => inputDigit('6') },
    { label: '−', action: () => inputOperator('-'), accent: true },
  ],
  [
    { label: '1', action: () => inputDigit('1') },
    { label: '2', action: () => inputDigit('2') },
    { label: '3', action: () => inputDigit('3') },
    { label: '+', action: () => inputOperator('+'), accent: true },
  ],
  [
    { label: '±', action: inputNegate },
    { label: '0', action: () => inputDigit('0') },
    { label: '.', action: inputDecimal },
    { label: '=', action: inputEquals, accent: true },
  ],
];
</script>

<template>
  <Window
    title="计算器"
    icon="fa fa-calculator"
    :isOpen="true"
    :isActive="true"
    @close="router.push('/')"
  >
    <div class="flex flex-col gap-[4px] h-full max-w-[300px] mx-auto select-none outline-none" tabindex="0">
      <!-- Display -->
      <div class="bg-white shadow-win95-inset px-[8px] py-[4px] flex flex-col items-end justify-end min-h-[56px] border-2 border-[#808080]">
        <div class="text-[10px] text-gray-500 h-[14px] font-mono">{{ expression }}</div>
        <div class="text-[26px] font-bold font-mono tracking-tight leading-none truncate w-full text-right text-black">{{ display }}</div>
      </div>

      <!-- Buttons -->
      <div class="flex flex-col gap-[3px]">
        <div v-for="(row, ri) in buttons" :key="ri" class="flex gap-[3px]">
          <button
            v-for="btn in row"
            :key="btn.label"
            @click="btn.action"
            class="flex-1 h-[42px] flex items-center justify-center text-[14px] font-bold border-none cursor-pointer select-none"
            :class="btn.accent
              ? 'bg-[#c0c0c0] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a]'
              : 'bg-[#c0c0c0] text-black shadow-[inset_-1px_-1px_#0a0a0a,inset_1px_1px_#ffffff,inset_-2px_-2px_#808080,inset_2px_2px_#dfdfdf] active:shadow-[inset_-1px_-1px_#ffffff,inset_1px_1px_#0a0a0a]'"
            style="font-family: 'MS Sans Serif', 'Microsoft YaHei', sans-serif;"
          >
            {{ btn.label }}
          </button>
        </div>
      </div>

      <!-- Keyboard hint -->
      <div class="text-[9px] text-gray-500 text-center mt-auto pt-2">
        支持键盘输入 · Esc=清除 · Enter=等于
      </div>
    </div>
  </Window>
</template>

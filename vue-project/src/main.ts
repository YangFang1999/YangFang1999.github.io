import { createApp } from 'vue'
import 'font-awesome/css/font-awesome.min.css'
import './style.css'
// giscus 会话捕获必须在 router 之前（理由见文件头注释）
import './giscusCapture'
import App from './App.vue'
import router from './router'
import { showBsod } from './bsod'

const app = createApp(App)

// 蓝屏兜底：任何未捕获错误都以 Win98 BSOD 呈现（过滤无害噪音，避免误杀）
const BENIGN_ERRORS = [/ResizeObserver loop/i, /^Script error\.?$/i];
const isBenign = (msg: string): boolean => BENIGN_ERRORS.some(re => re.test(msg));

app.config.errorHandler = (err) => {
  const msg = err instanceof Error ? err.message : String(err);
  if (!isBenign(msg)) showBsod(msg);
}
window.addEventListener('error', (e) => {
  const msg = e.message || '';
  if (msg && !isBenign(msg)) showBsod(msg);
})
window.addEventListener('unhandledrejection', (e) => {
  const detail = String(e.reason).slice(0, 160);
  if (!isBenign(detail)) showBsod('未处理的异步错误：' + detail);
})

app.use(router).mount('#app')

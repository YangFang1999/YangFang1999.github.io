import { createApp } from 'vue'
import 'font-awesome/css/font-awesome.min.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { showBsod } from './bsod'

const app = createApp(App)

// 蓝屏兜底：任何未捕获错误都以 Win98 BSOD 呈现
app.config.errorHandler = (err) => {
  showBsod(err instanceof Error ? err.message : String(err))
}
window.addEventListener('error', (e) => {
  showBsod(e.message || '未知脚本错误')
})
window.addEventListener('unhandledrejection', (e) => {
  showBsod('未处理的异步错误：' + String(e.reason).slice(0, 160))
})

app.use(router).mount('#app')

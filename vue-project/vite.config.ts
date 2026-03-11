import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Use relative base path for GitHub Pages compatibility
  plugins: [vue()],
})

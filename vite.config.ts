import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), electron({
    entry: path.resolve(__dirname, './electron/main.ts'),
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})

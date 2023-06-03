import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {devSourcemap: true},
  build: {sourcemap: true},
  define: {
    __APP_ENV__: "dev"
  }
})

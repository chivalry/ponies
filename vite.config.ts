import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/test/setup.ts'],
  },
  root: 'src_front',
  cacheDir: '../node_modules/.vite',
  build: {
    outDir: '../dist/public',
    emptyOutDir: true,
  },
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL ?? 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: process.env.VITE_API_URL ?? 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})

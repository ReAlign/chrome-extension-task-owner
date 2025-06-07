/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [react()],
  // test: {
  //   globals: true,
  //   clearMocks: true,
  //   environment: 'jsdom',
  //   setupFiles: './src/setupTests.ts',
  // },
})

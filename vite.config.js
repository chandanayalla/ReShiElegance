import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    fs: {
      allow: [resolve(__dirname), resolve(__dirname, '..', 'node_modules')]
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },
  server:{
    port: 5173,
    proxy:{
      '/api':{
      target: 'http://localhost:4000',
    }
    }
  }
})

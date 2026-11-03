import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Whenever React tries to go to '/api/something'
      // Vite will silently forward it to 'http://localhost:5000/api/something'
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})



import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
    build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase split into its own chunk
          firebase: ['firebase/app', 'firebase/firestore'],
          // React split into its own chunk
          vendor: ['react', 'react-dom'],
        }
      }
    }
  }
})

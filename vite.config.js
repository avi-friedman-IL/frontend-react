import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/public',
    emptyOutDir: true,
    rollupOptions: {
      external: ['react-icons'], // מניעת Tree Shaking עבור react-icons
    },
  },
})

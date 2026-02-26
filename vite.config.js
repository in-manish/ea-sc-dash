import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain deployment should always serve from root.
export default defineConfig({
  base: '/',
  plugins: [react()],
})

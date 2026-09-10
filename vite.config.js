import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { imageMetaPlugin } from './vite.imageMetaPlugin.js'

// Custom domain deployment should always serve from root.
export default defineConfig({
  base: '/',
  plugins: [react(), imageMetaPlugin()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/specter-terminal/',
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks: {
          'recharts': ['recharts'],
        },
      },
    },
  },
  plugins: [react(), tailwindcss()],
})

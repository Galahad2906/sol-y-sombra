import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-framer': ['framer-motion'],
          'ui-lucide': ['lucide-react'],
          'supabase-js': ['@supabase/supabase-js'],
          'utils-pdf': ['jspdf', 'jspdf-autotable', 'html2canvas']
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger']
  }
})

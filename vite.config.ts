import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2200,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
          // Split each decade and league database chunk into its own file
          const chunkMatch = id.match(/chunks[/\\]([^/\\]+)\.json/);
          if (chunkMatch) {
            return `squads-${chunkMatch[1].replace(/_/g, '-')}`;
          }
        },
      },
    },
  },
})


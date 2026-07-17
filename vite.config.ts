import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * ULTRA PRO MAX PRODUCTION BUNDLING SPECIFICATION
 * =========================================================================
 * Core compilation pipeline configuration for the Chalo Ne! Transit Mesh.
 * Incorporates absolute folder path sub-mapping overrides to resolve blank
 * deployment viewport errors on cloud static webpage networks.
 */
export default defineConfig({
  // 1. PATH INTEGRITY ROUTING EXTENSION
  // Maps all absolute script directories straight to your folder directory 
  // to clear out Net-Aborted 404 asset compilation failures immediately.
  base: '/chalo-ne/', 

  // 2. PLUGINS CORE MATRIX
  // Injects fast client refresh layers and compilation optimizations
  plugins: [react()],

  // 3. SERVER TELEMETRY ENVIRONMENT METRICS
  server: {
    port: 3000,
    cors: true,
    host: true,
  },

  // 4. PRODUCTION COMPILATION & BUNDLE SPLITTING SPECS
  build: {
    target: 'esnext',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});

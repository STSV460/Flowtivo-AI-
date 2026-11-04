import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) }, dedupe: ['react', 'react-dom'] },
  optimizeDeps: { include: ['react', 'react-dom/client', '@fillout/react'] },
  server: { host: '127.0.0.1', port: 5173 },
  build: { outDir: 'dist' },
});

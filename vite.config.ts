import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths to ensure assets load correctly on GitHub Pages
  build: {
    outDir: 'dist',
  },
});
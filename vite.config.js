import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep everything under /assets so nginx can serve it while every other path returns 404.
    assetsDir: 'assets',
    sourcemap: false,
  },
});

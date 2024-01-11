import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    viteTsConfigPaths({
      projects: ['../../tsconfig.base.json'],
    }),
  ],
  server: {
    open: true,
    port: 3000,
  },
  define: {
    global: 'globalThis',
  },
});

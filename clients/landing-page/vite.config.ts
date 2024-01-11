import { defineConfig } from 'vite';
import path from 'path';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';

const packagePath = path.join(__dirname, '../../packages');
const rootPath = path.join(__dirname, '../..');

export default defineConfig({
  plugins: [vike({ prerender: true }), mdx(), react()],
  resolve: {
    alias: {
      '@project/theme': `${packagePath}/theme/src/index.ts`,
      '@project/config': `${rootPath}/app.config.ts`,
    },
  },
});

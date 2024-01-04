import { defineConfig } from 'vite';
import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import vike from 'vike/plugin';

export default defineConfig({
  plugins: [vike({ prerender: true }), mdx(), react()],
});

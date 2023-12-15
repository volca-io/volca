#!/usr/bin/env -S npx tsx
import esbuild from 'esbuild';
import path from 'path';
import { config } from '../esbuild.config';

const watch = async () => {
  let ctx = await esbuild.context({ ...config, entryPoints: [path.join(__dirname, '../src/local-server.ts')] });

  await ctx.watch();
};

watch();

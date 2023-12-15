#!/usr/bin/env -S npx tsx
import esbuild from 'esbuild';
import path from 'path';
import { config } from '../esbuild.config';

export const build = async () => {
  await esbuild.build({ ...config, entryPoints: [path.resolve(__dirname, '../src/server.ts')] });
};

build();

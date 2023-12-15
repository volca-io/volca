import esbuild from 'esbuild';
import path from 'path';

export const config: esbuild.BuildOptions = {
  logLevel: 'info',
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile: path.resolve(__dirname, './dist/server.js'),
  sourcemap: true,
  target: 'node18.6',
  packages: 'external',
  external: ['sqlite3', 'better-sqlite3', 'mysql2', 'mysql', 'tedious', 'oracledb', 'pg-query-stream'],
  tsconfig: path.resolve(__dirname, './tsconfig.json'),
};

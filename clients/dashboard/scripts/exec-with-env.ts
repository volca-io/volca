#!/usr/bin/env -S npx tsx

import { spawnSync } from 'child_process';
import { environments, Environment } from '../environment';

const envArg = process.argv[2];
const command = process.argv[3];
const args = process.argv.slice(4);

if (!Object.keys(environments).includes(envArg)) {
  throw new Error(`No environment configured for ${envArg}`);
}

const env = Object.assign({}, process.env, environments[envArg as Environment]);

const result = spawnSync(command, args, { env, stdio: 'inherit' });

process.exit(result.status || 0);

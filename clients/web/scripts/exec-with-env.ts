#!/usr/bin/env -S ts-node -P ../../tsconfig.json

import { spawn } from 'child_process';
import { environments, Environment } from '../environment';

const envArg = process.argv[2];
const command = process.argv[3];
const args = process.argv.slice(4);

if (!Object.keys(environments).includes(envArg)) {
  throw new Error(`No environment configured for ${envArg}`);
}

const env = Object.assign({}, process.env, environments[envArg as Environment]);

spawn(command, args, { env, stdio: 'inherit' });

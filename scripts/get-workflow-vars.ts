#!/usr/bin/env -S npx tsx
import { program } from 'commander';
import { Environment } from '../types/volca';
import { config } from '../volca.config';

program.requiredOption('-e, --environment <environment>');
program.parse();

const { environment } = program.opts();
const env = config.environments[environment as Environment];

if (!env || !env.aws) {
  console.error(`Failed to read environment config for ${environment}`);
  process.exit(1);
}

console.log(`APPLICATION_NAME=${config.name}`);
console.log(`AWS_ACCOUNT=${env.aws.account}`);
console.log(`AWS_REGION=${env.aws.region}`);

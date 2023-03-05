#!/usr/bin/env -S npx tsx
import { program } from 'commander';
import { Environment } from '../config/types';
import { config } from '../app.config';

program.requiredOption('-e, --environment <environment>');
program.parse();

const { environment } = program.opts();
const env = config.environments[environment as Environment];

if (!env || !env.deploymentConfig) {
  console.error(`Failed to read environment config for ${environment}`);
  process.exit(1);
}

console.log(`APPLICATION_NAME=${config.name}`);
console.log(`AWS_ACCOUNT=${config.aws.account}`);
console.log(`AWS_REGION=${config.aws.region}`);

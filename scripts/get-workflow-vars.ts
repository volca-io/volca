import { program } from 'commander';
import { config } from '../volca.config';
import { Environment } from '../types/volca';

program.option('-e, --environment <environment>');
program.parse();

const { environment } = program.opts();

const env = config.environments[environment as Environment];
if (!env) {
  throw new Error(`Failed to read environment config for ${environment}`);
}

console.log(`APPLICATION_NAME=${config.name}`);
console.log(`AWS_ACCOUNT=${env.aws.account}`);
console.log(`AWS_REGION=${env.aws.region}`);

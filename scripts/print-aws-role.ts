import { program } from 'commander';
import { config } from '../volca.config';
import { Environment } from '../types/volca';

program.option('-e, --environment <environment>').option('-s, --service <service>');
program.parse();

const { environment, service } = program.opts();

const env = config.environments[environment as Environment];
if (!env) {
  throw new Error(`Failed to read environment config for ${environment}`);
}

const role = `arn:aws:iam::${env.aws.account}:role/${config.name}-${environment}-github-actions-${service}-deployment-role`;

console.log(role);

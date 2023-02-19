import { SSMClient, PutParameterCommand } from '@aws-sdk/client-ssm';
import * as crypto from 'crypto';
import { config } from '../app.config';

const parameters = [
  { name: 'SIGNING_KEY', value: crypto.randomBytes(32).toString('hex') },
  { name: 'DB_PASSWORD', value: crypto.randomBytes(32).toString('hex') },
  { name: 'STRIPE_KEY', value: 'STRIPE_KEY' },
  { name: 'STRIPE_WEBHOOK_SECRET', value: 'STRIPE_WEBHOOK_SECRET' },
];

export const createSsmParameters = async () => {
  Object.keys(config.environments).forEach((environment) => {
    const environmentConfig = config.environments[environment as keyof typeof config.environments];
    if (environmentConfig.deploymentConfig) {
      const client = new SSMClient({ region: environmentConfig.deploymentConfig.aws.region });
      parameters.forEach(async (parameter) => {
        console.log(`[ INFO ] Setting parameter ${parameter.name} for ${environment}`);
        try {
          const command = new PutParameterCommand({
            Name: `/${environment}/${parameter.name}`,
            Value: parameter.value,
            Type: 'SecureString',
          });
          await client.send(command);
        } catch (error) {
          console.log(`[ ERROR ] Failed to write parameter ${parameter.name} for ${environment}`);
          console.log(error);
        }
      });
    }
  });
};

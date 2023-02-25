import { SSMClient, PutParameterCommand, GetParametersByPathCommand } from '@aws-sdk/client-ssm';
import * as crypto from 'crypto';
import { config } from '../app.config';

const rawParameters = [
  { name: 'SIGNING_KEY', value: crypto.randomBytes(32).toString('hex') },
  { name: 'DB_PASSWORD', value: crypto.randomBytes(32).toString('hex') },
  { name: 'STRIPE_KEY', value: 'STRIPE_KEY' },
  { name: 'STRIPE_WEBHOOK_SECRET', value: 'STRIPE_WEBHOOK_SECRET' },
];

export const createSsmParameters = async ({ environment }: { environment: string }) => {
  console.log(`[ INFO ] Creating SSM parameters...`);
  const environmentConfig = config.environments[environment as keyof typeof config.environments];
  const prefix = `/${config.name}/${environment}/`;
  const parameters = rawParameters.map(({ name, value }) => ({
    name: prefix + name,
    value,
  }));

  if (environmentConfig.deploymentConfig) {
    const client = new SSMClient({ region: environmentConfig.deploymentConfig.aws.region });

    // Check if parameters have been created already
    const getParametersCommand = new GetParametersByPathCommand({ Path: prefix });
    const createdParameters = await client.send(getParametersCommand);

    if (createdParameters.Parameters && createdParameters.Parameters.length > 0) {
      console.log('[ INFO ] Parameters already exist, skipping...');
      return;
    }

    // Create parameters
    parameters.forEach(async (parameter) => {
      console.log(`[ INFO ] Setting parameter ${parameter.name} for ${environment}`);
      try {
        const command = new PutParameterCommand({
          Name: parameter.name,
          Value: parameter.value,
          Type: 'SecureString',
        });
        await client.send(command);
      } catch (error) {
        console.log(`[ ERROR ] Failed to write parameter ${parameter.name}`);
        console.log(error);
      }
    });
  }
};

if (require.main === module && process.env.STAGE) {
  createSsmParameters({ environment: process.env.STAGE });
}

#!/usr/bin/env -S npx tsx
import { SSMClient, PutParameterCommand, GetParametersByPathCommand } from '@aws-sdk/client-ssm';
import * as crypto from 'crypto';
import 'zx/globals';
import { config } from '@project/config';

const rawParameters = [
  { name: 'DB_PASSWORD', value: crypto.randomBytes(32).toString('hex') },
  { name: 'STRIPE_KEY', value: 'STRIPE_KEY' },
  { name: 'STRIPE_WEBHOOK_SECRET', value: 'STRIPE_WEBHOOK_SECRET' },
];

export const createSsmParameters = async ({ environment }: { environment: string }) => {
  console.log(`[ INFO ] Creating SSM parameters for ${environment} environment...`);
  const prefix = `/${config.name}/${environment}/api/`;
  const parameters = rawParameters.map(({ name, value }) => ({
    name: prefix + name,
    value,
  }));

  const client = new SSMClient({ region: config.aws.region });

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
};

const bootstrapCDK = async () => {
  const { account, region } = config.aws;

  await $`yarn cdk bootstrap aws://${account}/us-east-1 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess`;
  if (region !== 'us-east-1') {
    await $`yarn cdk bootstrap aws://${account}/${region} --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess`;
  }
};

const deployCoreStack = async () => {
  await $`cdk deploy --stacks core-stack --exclusively`;
};

const run = async () => {
  await bootstrapCDK();
  await deployCoreStack();

  const environments = Object.keys(config.environments).filter((environment) => environment !== 'local');
  for (const environment of environments) {
    await createSsmParameters({ environment });
  }
};

run();

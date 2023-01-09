#!/usr/bin/env -S npx tsx
import 'zx/globals';
import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { program } from 'commander';

import { config } from '../volca.config';
import { Environment } from '../types/volca';

const isBootstrapped = async (region: string): Promise<boolean> => {
  const client = new CloudFormationClient({ region });

  const command = new DescribeStacksCommand({
    StackName: 'CDKToolkit',
  });

  try {
    const { Stacks } = await client.send(command);
    return !!Stacks && Stacks?.length > 0;
  } catch (err: unknown) {
    return false;
  }
};

const run = async (stage: string, stacks: string) => {
  const env = config.environments[stage as Environment];

  if (!env.aws) {
    throw new Error(`[ Error ] Could not find a configured stage in volca.config.ts for stage ${stage}`);
  }

  console.log(`[ INFO ] Checking if AWS CDK is bootstrapped in region ${env.aws.region}...`);
  const bootstrapped = await isBootstrapped(env.aws.region);
  console.log(`[ INFO ] AWS CDK is ${bootstrapped ? '' : 'not '} bootstrapped`);

  if (!bootstrapped) {
    console.log(`[ INFO ] Bootstrapping CDK...`);
    try {
      await $`cdk bootstrap -c stage=${stage}`;
    } catch (error) {
      console.error(`[ Error ] ${error}`);
      process.exit(1);
    }
  }

  console.log(`[ INFO ] Deploying...`);

  try {
    await $`cdk deploy -c stage=${stage} ${stacks} --require-approval never`;
  } catch (error) {
    console.error(`[ Error ] ${error}`);
    process.exit(1);
  }
};

program
  .requiredOption('-s, --stage <stage>')
  .option('--stacks <stacks', 'space separated names of CloudFormation stacks to deploy', '--all');
program.parse();

const { stage, stacks } = program.opts();

run(stage, stacks);

import { spawn } from 'child_process';
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

const bootstrapCDK = async (stage: string): Promise<void> => {
  const child = spawn('cdk', ['bootstrap', '-c', `stage=${stage}`], { stdio: 'inherit' });
  child.stdout.on('data', (data: Buffer) => {
    console.log(data.toString());
  });

  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Deploy failed with a non 0 exit code'));
      }
    });
  });
};

const deploy = async (stage: string, stacks: string): Promise<void> => {
  const child = spawn('cdk', ['deploy', '-c', `stage=${stage}`, stacks || '--all'], { stdio: 'inherit' });

  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error('Deploy failed with a non 0 exit code'));
      }
    });
  });
};

const run = async (region: string, stage: string, stacks: string): Promise<void> => {
  console.log(`[ INFO ] Checking if AWS CDK is bootstrapped in region ${region}..`);
  const bootstrapped = await isBootstrapped(region);
  console.log(`[ INFO ] AWS CDK is ${bootstrapped ? '' : 'not '} bootstrapped`);

  if (!bootstrapped) {
    console.log(`[ INFO ] Bootstrapping CDK..`);
    try {
      await bootstrapCDK(stage);
    } catch (error: unknown) {
      console.error(`[ Error ] ${error}`);
      process.exit(1);
    }
  }

  console.log(`[ INFO ] Deploying..`);
  try {
    await deploy(stage, stacks);
  } catch (error: unknown) {
    console.error(`[ Error ] ${error}`);
    process.exit(1);
  }
};

program.option('-s, --stage <stage>').option('--stacks <stacks');
program.parse();

const { stage, stacks } = program.opts();

const env = config.environments[stage as Environment];

if (!env) {
  throw new Error(`[ Error ] Could not find a configured stage in volca.config.ts for stage ${stage}`);
}

run(env.aws.region, stage, stacks);

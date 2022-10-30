import { spawn } from 'child_process';
import { program } from 'commander';
import { config } from '../volca.config';

const destroy = async (stage: string): Promise<void> => {
  const child = spawn('cdk', ['destroy', '-c', `stage=${stage}`, '--all'], { stdio: 'pipe' });

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

const run = async (region: string, stage: string): Promise<void> => {
  console.log(`[ INFO ] Destroying..`);
  try {
    await destroy(stage);
  } catch (error: unknown) {
    console.error(`[ Error ] ${error}`);
    process.exit(1);
  }
};

program.option('-r, --region <region>').option('-s, --stage <stage>');
program.parse();

const { stage } = program.opts();

const env = config.environments[stage];

if (!env) {
  console.log(`[ Error ] Could not find a configured stage in volca.config.ts for stage ${stage}`);
}

run(env.aws.region, stage);

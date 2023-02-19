#!/usr/bin/env -S npx tsx
import { $ } from 'zx';
import { program } from 'commander';
import { config } from '../app.config';
import { Environment } from '../config/types';

const run = async (stage: string, stacks: string) => {
  const env = config.environments[stage as Environment];

  if (!env) {
    console.log(`[ Error ] Could not find a configured stage in app.config.ts for stage ${stage}`);
  }

  await $`cdk destroy -c stage=${stage} ${stacks}`;
};

program
  .requiredOption('-s, --stage <stage>')
  .option('--stacks <stacks', 'space separated names of CloudFormation stacks to deploy', '--all');
program.parse();

const { stage, stacks } = program.opts();

run(stage, stacks);

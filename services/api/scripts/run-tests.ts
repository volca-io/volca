#!/usr/bin/env -S npx tsx
import 'zx/globals';
import { spinner } from 'zx/experimental';

const run = async () => {
  process.env.FORCE_COLOR = '3';

  try {
    await spinner('Starting database...', async () => {
      await $`docker-compose down`;
      await $`docker-compose --profile integration-test up --remove-orphans -d`;
      await $`wait-on tcp:5432`;
    });

    await spinner('Migrating database...', () => $`serverless invoke local -f migrate --data '{"type":"latest"}'`);

    await spinner('Seeding database...', () => $`serverless invoke local -f seed`);

    const res = await $`NODE_NO_WARNINGS=1 jest`;

    await spinner('Stopping database...', () => $`docker-compose down`);

    console.log('Tests successfully completed!');
    process.exit(res.exitCode || 0);
  } catch (err: any) {
    console.error(chalk.red('Test suite failed'));
    console.error(chalk.red('Error: \n') + err.stderr);
    console.error(chalk.blue('Output: \n') + err.stdout);
    process.exit(err.exitCode);
  }
};

run();

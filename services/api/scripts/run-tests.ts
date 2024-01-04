#!/usr/bin/env -S npx tsx
import 'zx/globals';
import { spinner } from 'zx/experimental';

const run = async () => {
  process.env.FORCE_COLOR = '3';

  try {
    await spinner('Starting database...', async () => {
      await $`docker compose down`;
      await $`docker compose --profile integration-test up --remove-orphans -d`;
      await $`wait-on tcp:5432`;
    });

    await spinner('Migrating database...', () => $`${path.join(__dirname, './migrate.ts')}`);
    await spinner('Seeding database...', () => $`${path.join(__dirname, './seed.ts')}`);

    const res = await $`yarn jest`;

    await spinner('Stopping database...', () => $`docker compose down`);

    process.exit(res.exitCode || 0);
  } catch (err: unknown) {
    console.error(chalk.red('Test suite failed'));
    console.error(chalk.red('Error: \n') + (err instanceof ProcessOutput ? err.stderr : 'Unknown error'));
    console.error(chalk.blue('Output: \n') + (err instanceof ProcessOutput ? err.stdout : ''));
    process.exit(err instanceof ProcessOutput && err.exitCode ? err.exitCode : 1);
  }
};

run();

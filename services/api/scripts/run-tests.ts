#!/usr/bin/env -S npx tsx
import 'zx/globals';
import { spinner } from 'zx/experimental';

const run = async () => {
  await spinner('Starting database...', async () => {
    await $`docker-compose down`;
    await $`docker-compose --profile integration-test up --remove-orphans -d`;
    await $`wait-on tcp:5432`;
  });

  await spinner(
    'Migrating databse...',
    () => $`env-cmd -f ./env/.env.test sls invoke local -f migrate --data '{"type":"latest"}'`
  );

  await spinner('Seeding database...', () => $`env-cmd -f ./env/.env.test serverless invoke local -f seed`);

  const res =
    await $`NODE_NO_WARNINGS=1 NODE_OPTIONS=--experimental-vm-modules env-cmd -f ./env/.env.test jest`;

  await spinner('Stopping database...', () => $`docker-compose down`);

  process.exit(res.exitCode || 0);
};

run();

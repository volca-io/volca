#!/usr/bin/env -S npx tsx
import { createServer } from '../src/server';

const run = async (): Promise<void> => {
  const action = process.argv.slice(2).pop();
  const { database } = await createServer();

  if (action === 'latest' || !action) {
    await database.migrate.latest();
  }
  if (action === 'up') {
    await database.migrate.up();
  }
  if (action === 'down') {
    await database.migrate.down();
  }

  await database.destroy();
};

run();

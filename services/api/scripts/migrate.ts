#!/usr/bin/env -S npx tsx
import { createServer } from '../src/server';

const run = async (): Promise<void> => {
  const { database } = await createServer();
  await database.migrate.latest();
  await database.destroy();
};

run();

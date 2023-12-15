#!/usr/bin/env -S npx tsx
import { createServer } from '../src/server';

const run = async (): Promise<void> => {
  const { database } = await createServer();
  await database.seed.run();
  await database.destroy();
};

run();

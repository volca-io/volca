#!/usr/bin/env -S npx tsx
import 'zx/globals';
import path from 'path';

const run = async () => {
  console.log('Clearing bundle files...');
  await $`rm -rf ./bundle`;
  await $`rm -rf ./bundle_os`;
  await $`rm -rf bundle-customer.zip`;
  await $`rm -rf bundle-os.zip`;

  console.log('Overwriting custom config with example config...');
  await $`mv example.config.ts volca.config.ts `;

  console.log('Generating customer bundle...');
  await $`rsync --prune-empty-dirs -a --exclude-from .gitignore --exclude-from exclude ./ bundle/`;

  console.log('Packaging customer bundle...');
  await $`rsync --prune-empty-dirs -a .yarn ./bundle/ --exclude .yarn/cache`;
  await $`cd ./bundle && zip -r ../bundle-customer.zip . && cd ..`;

  console.log('Generating open source bundle...');
  await $`${path.join(__dirname, 'bundle-open-source.ts')}`;

  console.log('Packaging open source bundle...');
  await $`cd ./bundle_os && zip -r ../bundle-os.zip . && cd ..`;
};

run();

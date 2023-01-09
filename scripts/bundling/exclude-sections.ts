#!/usr/bin/env -S npx tsx
import 'zx/globals';
import fs from 'fs';

const run = async () => {
  console.log('Excluding sections..');
  const findResult = await $`find ${path.join(__dirname, '../../bundle_os')}`;
  const files = findResult.stdout.split('\n');
  for (const file of files) {
    if (!file || !fs.lstatSync(file).isFile()) continue;

    while (true) {
      const start = await $`grep -n "\\/\\* volca-exclude-start os \\*\\/" ${file} || true`;
      const end = await $`grep -n "\\/\\* volca-exclude-end os \\*\\/" ${file} || true`;

      if (start.stdout && end.stdout) {
        const startLine = start.stdout.trim().split(':')[0];
        const endLine = end.stdout.trim().split(':')[0];

        if (process.platform === 'darwin') {
          await $`sed -i "" "${startLine},${endLine}"d "${file}"`;
        } else {
          await $`sed -i "${startLine},${endLine}"d "${file}"`;
        }
      } else {
        break;
      }
    }
  }
};

run();

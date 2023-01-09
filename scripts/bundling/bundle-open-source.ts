#!/usr/bin/env -S npx tsx
import 'zx/globals';
import * as fs from 'fs';

const run = async () => {
  const CUSTOMER_BUNDLE_FOLDER = 'bundle';
  const OS_BUNDLE_FOLDER = 'bundle_os';

  const fileContent = fs.readFileSync('include-os').toString();
  const patterns = fileContent.split('\n');

  let filesToCopyStr = '';

  for (const pattern of patterns) {
    if (pattern.length) {
      const { stdout } = await $`find ${CUSTOMER_BUNDLE_FOLDER}/${pattern} -maxdepth 1 -type f`;
      filesToCopyStr += stdout;
    }
  }

  const filesToCopy = filesToCopyStr.split('\n').filter(Boolean);
  const foldersToCreate = new Set<string>();

  filesToCopy.forEach((filePath) => {
    const paths = filePath.split('/');
    paths.pop();
    foldersToCreate.add(paths.join('/'));
  });

  console.log('Creating folders...');
  console.log(foldersToCreate);

  for (const folder of foldersToCreate) {
    const folderToCreate = folder.replace(`${CUSTOMER_BUNDLE_FOLDER}/`, '');
    await $`mkdir -p ${OS_BUNDLE_FOLDER}/${folderToCreate}`;
  }

  console.log('Copying files...');
  console.log(filesToCopy);

  for (const fileToCopy of filesToCopy) {
    // TODO: Need to exclude parent folder from fileToCopy
    const destination = fileToCopy.replace(`${CUSTOMER_BUNDLE_FOLDER}/`, '');
    await $`cp ${fileToCopy} ${OS_BUNDLE_FOLDER}/${destination}`;
  }
  console.log('Excluding code blocks...');
  await $`${path.join(__dirname, 'exclude-sections.ts')}`;
};

run();

#!/bin/bash

echo "Running install..."
yarn

echo "Clearing bundle files..."
rm -rf ./bundle
rm -rf ./bundle_os
rm -rf bundle-customer.zip
rm -rf bundle-os.zip

echo "Overwriting custom config with example config..."
mv example.config.ts volca.config.ts 

echo "Generating customer bundle..."
rsync --prune-empty-dirs -a --exclude-from .gitignore --exclude-from exclude ./ bundle/

echo "Packaging customer bundle..."
# Copy .yarn folder into bundle folder
rsync --prune-empty-dirs -a .yarn ./bundle/ --exclude .yarn/cache
cd ./bundle && zip -r ../bundle-customer.zip . && cd ..

echo "Generating open source bundle..."

yarn ts-node scripts/bundling/bundle-open-source.ts


echo "Packaging open source bundle..."
# Copy .yarn folder into bundle folder
rsync --prune-empty-dirs -a .yarn ./bundle_os/ --exclude .yarn/cache
cd ./bundle_os && zip -r ../bundle-os.zip . && cd ..

#!/bin/bash

rm -rf ./bundle
rm -rf bundle.zip
mv example.config.ts volca.config.ts # Overwrite custom config with example config
rsync --prune-empty-dirs -a --exclude-from .gitignore --exclude-from exclude ./ bundle/
cp -r .yarn ./bundle/
cd ./bundle && zip -r ../bundle.zip .

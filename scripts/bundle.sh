#!/bin/bash

rm -rf ./bundle
rm -rf bundle.zip
rsync --prune-empty-dirs -a --exclude-from .gitignore --exclude-from exclude ./ bundle/
cp -r .yarn ./bundle/
zip -r bundle.zip ./bundle

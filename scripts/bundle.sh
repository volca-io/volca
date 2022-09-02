#!/bin/bash

rm -rf ./bundle
rm -rf volca.zip
rsync --prune-empty-dirs -a --exclude-from .gitignore --exclude-from exclude ./ bundle/
zip volca.zip ./bundle

#!/bin/bash

rm -rf ./bundle
rm -rf bundle.zip
mv example.config.ts volca.config.ts # Overwrite custom config with example config
rsync --prune-empty-dirs -a --exclude-from .gitignore --exclude-from exclude --exclude-from exclude-os ./ bundle/

for f in $(find ./bundle) ; do
    if [ -f "$f" ]; then

        start="start"
        end="end"

        while [ ! -z "$start" ] && [ ! -z "$end" ]
        do
            start=$(grep -n "\/\* volca-exclude-start os \*\/" $f | awk -F  ":" '{print $1}')
            end=$(grep -n "\/\* volca-exclude-end os \*\/" $f | awk -F  ":" '{print $1}')

            if [ ! -z "$start" ] && [ ! -z "$end" ]; then
                start_line=`echo "${start}" | head -1`
                end_line=`echo "${end}" | head -1`

                if [[ "$OSTYPE" == "darwin"* ]]; then
                    sed -i "" "${start_line},${end_line}"d "$f"
                else
                    sed -i "${start_line},${end_line}"d "$f"
                fi
            fi
        done
    fi;
done;

cp -r .yarn ./bundle/

cd ./bundle && zip -r ../bundle.zip .

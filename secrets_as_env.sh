#!/bin/bash

while IFS= read -r line
do
    SECRET_NAME=$(echo $line | cut -d'=' -f1)
    if [ "$SECRET_NAME" == "PRIVATE_KEY" ]; then
        export $SECRET_NAME="$(cat /workspace/$SECRET_NAME.txt)"
    else
        export $SECRET_NAME=$(cat /workspace/$SECRET_NAME.txt)
    fi
done < env-staging-names.txt

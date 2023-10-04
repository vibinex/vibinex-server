#!/bin/bash

while IFS= read -r line
do
    SECRET_NAME=$(echo $line | cut -d'=' -f1)
    export $SECRET_NAME=$(cat /workspace/$SECRET_NAME.txt)
done < env-staging-names.txt

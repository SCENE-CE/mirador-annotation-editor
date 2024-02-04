#!/bin/bash

# Remove all node stuff to avoid arror on docker rebuild
rm -rf node_modules
rm -f package-lock.json
rm -f .babelrc
npm install
./cli post_install

if [ "$ENV" == "prod" ]; then
    npm run build
    cmd="serve -s demo/dist"
else
    cmd="npm start"
fi

if [ ! -z "$1" ];  then
    cmd=$@
fi
exec $cmd

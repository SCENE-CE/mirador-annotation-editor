#!/bin/bash

rm -f .balelrc
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

#!/bin/sh

set -eu

cd $(dirname "$0")

if [ "${1:-}" = "--force" ] || [ ! -d ./frontend/dist ]; then
  ( cd ./frontend; npm ci; npm run build )
fi

if [ "${1:-}" = "--force" ] || [ ! -d ./generator/build ]; then
  ( cd ./generator; npm ci; npm run build )
fi

./generator/cli.js

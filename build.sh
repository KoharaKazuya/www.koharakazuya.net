#!/bin/sh

set -eu

cd "$(dirname "$0")"

(cd ./themes/lightning; yarn install && yarn build)

rm -rf public/
hugo --minify

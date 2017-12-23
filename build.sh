#!/bin/sh

set -eu

cd "$(dirname "$0")"

./themes/lightning/build.sh

rm -rf public/
hugo

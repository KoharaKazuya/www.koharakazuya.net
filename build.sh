#!/bin/sh

set -eu

cd "$(dirname "$0")"

reset="$(tput sgr0    2>/dev/null || : )"
rev="$(  tput rev     2>/dev/null || : )"
white="$(tput setaf 7 2>/dev/null || : )"
green="$(tput setaf 2 2>/dev/null || : )"

echo ''
echo "$white$rev INFO $reset Build theme"
echo ''
(cd ./themes/lightning; yarn install && yarn build)

echo ''
echo "$white$rev INFO $reset Build content"
echo ''
rm -rf public/
hugo --minify

echo ''
echo "$green$rev  OK  $reset$green Done!"
echo ''

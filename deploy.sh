#!/bin/sh

set -eu

cd "$(dirname "$0")"

S3_BUCKET='www.koharakazuya.net'
CLOUDFRONT_DISTRIBUTION_ID='EPH8OJU2WVFO'

reset="$(tput sgr0    2>/dev/null || : )"
rev="$(  tput rev     2>/dev/null || : )"
white="$(tput setaf 7 2>/dev/null || : )"
green="$(tput setaf 2 2>/dev/null || : )"

cd public/

echo ''
echo "$white$rev INFO $reset HTML/XML Upload"
echo ''
aws s3 sync \
  --exclude='*' \
  --include='*.html' \
  --include='*.xml' \
  --include='service-worker.js' \
  --cache-control="max-age=300" \
  . "s3://${S3_BUCKET}/"

echo ''
echo "$white$rev INFO $reset JS/CSS Upload"
echo ''
aws s3 sync \
  --exclude='*' \
  --include='*.js' \
  --include='*.css' \
  --exclude='service-worker.js' \
  --exclude='manifest.webmanifest' \
  --cache-control="max-age=31536000" \
  . "s3://${S3_BUCKET}/"

echo ''
echo "$white$rev INFO $reset Assets Upload"
echo ''
aws s3 sync \
  --exclude='*.DS_Store' \
  --exclude='*.html' \
  --exclude='*.xml' \
  --exclude='*.js' \
  --exclude='*.css' \
  --cache-control="max-age=604800" \
  . "s3://${S3_BUCKET}/"

echo ''
echo "$white$rev INFO $reset Web App Manifest Upload"
echo ''
aws s3 cp \
  --cache-control="max-age=300" \
  --content-type="application/manifest+json" \
  ./manifest.webmanifest "s3://${S3_BUCKET}/"

echo ''
echo "$white$rev INFO $reset Sweep Stales"
echo ''
aws s3 sync --delete \
  --exclude='*.DS_Store' \
  . "s3://${S3_BUCKET}/"

echo ''
echo "$white$rev INFO $reset Invalidation CDN Cache"
echo ''
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths '/*'

echo ''
echo "$green$rev  OK  $reset$green Done!"
echo ''

#!/bin/sh

set -eu

cd "$(dirname "$0")"

S3_BUCKET='www.koharakazuya.net'
CLOUDFRONT_DISTRIBUTION_ID='EPH8OJU2WVFO'

cd public/

echo 'HTML/XML Upload'
aws s3 sync \
  --exclude='*' \
  --include='*.html' \
  --include='*.xml' \
  --cache-control="max-age=300" \
  . "s3://${S3_BUCKET}/"

echo 'JS/CSS Upload'
aws s3 sync \
  --exclude='*' \
  --include='*.js' \
  --include='*.css' \
  --cache-control="max-age=31536000" \
  . "s3://${S3_BUCKET}/"

echo 'Assets Upload'
aws s3 sync \
  --exclude='*.DS_Store' \
  --exclude='*.html' \
  --exclude='*.xml' \
  --exclude='*.js' \
  --exclude='*.css' \
  --cache-control="max-age=604800" \
  . "s3://${S3_BUCKET}/"

echo 'Sweep Stales'
aws s3 sync --delete \
  --exclude='*.DS_Store' \
  . "s3://${S3_BUCKET}/"

echo 'Invalidation CDN Cache'
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths '/*'

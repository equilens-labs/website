#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
mkdir -p dist

# Copy only site pages and allowed assets
rsync -a \
  --exclude '.git/' \
  --exclude '.github/' \
  --exclude 'output/' \
  --exclude 'output/ops/' \
  --exclude 'scripts/' \
  --exclude 'tasks/' \
  --exclude 'template/' \
  --exclude 'themes/appline/*.html' \
  --exclude 'vendor/' \
  . dist/

# Guard: no vendor demo HTML should ship
if rg -n --hidden '/themes/appline/.*\.html|/template/appline.*\.html' dist >/dev/null 2>&1; then
  echo 'ERROR: vendor demo HTML detected in dist/' >&2
  rg -n --hidden '/themes/appline/.*\.html|/template/appline.*\.html' dist || true
  exit 1
fi

echo '[OK] dist prepared'


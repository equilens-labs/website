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
  --exclude 'vendor/' \
  . dist/

# Guard: no vendor demo HTML should ship
MAP=$(find dist -type f -name '*.html' -print0 | xargs -0 -I{} sh -c "grep -nE '(^|/)template/appline-.*\\.html' '{}' || true")
if [ -n "$MAP" ]; then
  echo 'ERROR: vendor demo HTML detected in dist/' >&2
  echo "$MAP"
  exit 1
fi

echo '[OK] dist prepared'

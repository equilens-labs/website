#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
mkdir -p dist

# Update footer with deploy date and commit hash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
chmod +x "$SCRIPT_DIR/update-footer.sh"
"$SCRIPT_DIR/update-footer.sh"

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

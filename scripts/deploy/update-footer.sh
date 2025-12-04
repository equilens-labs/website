#!/usr/bin/env bash
# Update footer deploy metadata in all HTML files
set -euo pipefail

DEPLOY_DATE=$(date -u +%Y-%m-%d)
COMMIT_SHORT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

echo "Updating footer: date=$DEPLOY_DATE commit=$COMMIT_SHORT"

# Pattern to match the deploy metadata in footer
# Matches: Last deploy YYYY-MM-DD (commit xxxxxxx).
# Uses perl for cross-platform compatibility (macOS sed differs from GNU sed)
find . -maxdepth 3 -name '*.html' -type f ! -path './dist/*' ! -path './.git/*' -print0 | \
  xargs -0 perl -i -pe "s/Last deploy \d{4}-\d{2}-\d{2} \(commit [a-f0-9]+\)/Last deploy ${DEPLOY_DATE} (commit ${COMMIT_SHORT})/g"

echo "[OK] Footer metadata updated"

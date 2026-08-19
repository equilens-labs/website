#!/usr/bin/env bash
# Update footer deploy metadata in all HTML files
set -euo pipefail

TARGET_DIR="${1:-.}"
DEPLOY_DATE=$(date -u +%Y-%m-%d)
# Stamp the checked-out tree. Under workflow_run, GITHUB_SHA can name the
# default-branch tip rather than the exact audited commit checked out below.
COMMIT_SHORT="$(git rev-parse --short=7 HEAD 2>/dev/null || true)"
if [[ -z "${COMMIT_SHORT}" ]]; then
  FALLBACK_SHA="${GITHUB_SHA:-}"
  COMMIT_SHORT="${FALLBACK_SHA:0:7}"
fi
COMMIT_SHORT="${COMMIT_SHORT:-unknown}"

echo "Updating footer in ${TARGET_DIR}: date=${DEPLOY_DATE} commit=${COMMIT_SHORT}"

# Pattern to match the deploy metadata in footer
# Matches: Last deploy YYYY-MM-DD (commit xxxxxxx).
# Uses perl for cross-platform compatibility (macOS sed differs from GNU sed)
find "${TARGET_DIR}" -maxdepth 3 -name '*.html' -type f ! -path '*/.git/*' -print0 | \
  xargs -0 perl -i -pe "s/__DEPLOY_DATE__/${DEPLOY_DATE}/g; s/__DEPLOY_COMMIT__/${COMMIT_SHORT}/g; s/Last deploy: stamped during publishing\./Last deploy ${DEPLOY_DATE} (commit ${COMMIT_SHORT})./g; s/Last deploy \d{4}-\d{2}-\d{2} \(commit [a-f0-9]+\)/Last deploy ${DEPLOY_DATE} (commit ${COMMIT_SHORT})/g"

echo "[OK] Footer metadata updated"

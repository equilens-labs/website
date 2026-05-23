#!/usr/bin/env bash
set -euo pipefail

bad_matches=$(
  find . -maxdepth 3 -name '*.html' -type f \
    ! -path './dist/*' \
    ! -path './.git/*' \
    ! -path './node_modules/*' \
    -print0 |
    xargs -0 grep -nE 'Last deploy [0-9]{4}-[0-9]{2}-[0-9]{2} \(commit [a-f0-9]{7,}\)' || true
)

if [[ -n "$bad_matches" ]]; then
  echo "::error ::Source HTML contains hard-coded footer deploy metadata. Run scripts/content/sync_footer_ssot.py so source uses publish-time footer metadata."
  echo "$bad_matches"
  exit 1
fi

echo "[OK] Footer deploy metadata is publish-time only in source"

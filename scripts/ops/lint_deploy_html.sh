#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DIST_DIR="${REPO_ROOT}/dist"

cleanup() {
  rm -rf "${DIST_DIR}"
}
trap cleanup EXIT

cd "${REPO_ROOT}"
scripts/deploy/prepare.sh
mapfile -t DIST_HTML < <(find "${DIST_DIR}" -type f -name '*.html' | sort)
if [[ "${#DIST_HTML[@]}" -eq 0 ]]; then
  echo "[FAIL] no HTML files in deploy artifact" >&2
  exit 1
fi

npx html-validate "${DIST_HTML[@]}"
echo "[OK] html-validate checked ${#DIST_HTML[@]} deployed HTML files"

#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 1 ]]; then
  echo "usage: $0 /path/to/vale" >&2
  exit 2
fi

VALE_BIN="$1"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DIST_DIR="${REPO_ROOT}/dist"
NORMALIZED_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${DIST_DIR}" "${NORMALIZED_DIR}"
}
trap cleanup EXIT

cd "${REPO_ROOT}"
scripts/deploy/prepare.sh
mapfile -t DIST_HTML < <(find "${DIST_DIR}" -type f -name '*.html' | sort)
if [[ "${#DIST_HTML[@]}" -eq 0 ]]; then
  echo "[FAIL] no HTML files in deploy artifact" >&2
  exit 1
fi

"${VALE_BIN}" --config .vale.ini "${DIST_HTML[@]}"
python3 scripts/ops/normalize_html_text.py "${DIST_DIR}" "${NORMALIZED_DIR}"
mapfile -t NORMALIZED_TEXT < <(find "${NORMALIZED_DIR}" -type f -name '*.txt' | sort)
"${VALE_BIN}" --config .vale.ini "${NORMALIZED_TEXT[@]}"
python3 scripts/ops/check_claims_gate.py "${VALE_BIN}"

echo "[OK] claims gate checked raw and rendered text for ${#DIST_HTML[@]} deployed HTML files"

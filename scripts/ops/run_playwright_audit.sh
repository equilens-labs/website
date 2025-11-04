#!/usr/bin/env bash
set -euo pipefail

TAG="${1:-PLAYWRIGHT-AUDIT}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="output/ops/${TAG}-${STAMP}"
mkdir -p "$OUT"

export PLAYWRIGHT_AUDIT_TAG="$TAG"
export PLAYWRIGHT_AUDIT_STAMP="$STAMP"

PORT=8000
BASE_URL="http://localhost:${PORT}"
SERVER_PID=""

if ! curl -Is --max-time 2 "${BASE_URL}/" >/dev/null 2>&1; then
  python3 -m http.server "${PORT}" >/tmp/website_server_playwright.log 2>&1 &
  SERVER_PID=$!
  sleep 1
  if ! curl -Is --max-time 3 "${BASE_URL}/" >/dev/null 2>&1; then
    BASE_URL="https://equilens.io"
  fi
fi

export EQL_BASE_URL="$BASE_URL"

cleanup() {
  if [[ -n "$SERVER_PID" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

npx @playwright/test install chromium >/tmp/playwright-install.log 2>&1
npx @playwright/test test --config=playwright.config.ts

ARTIFACTS="${OUT}/artifacts"
if compgen -G "${ARTIFACTS}/*.png" >/dev/null 2>&1; then
  (cd "${ARTIFACTS}" && sha256sum *.png > ../SHA256SUMS.txt)
else
  : > "${OUT}/SHA256SUMS.txt"
fi

python3 - <<'PY' "${OUT}" "${BASE_URL}" "${STAMP}" "${TAG}"
import json
import pathlib
import subprocess
import sys

out_dir, base_url, stamp, tag = sys.argv[1:5]
config_path = pathlib.Path("config/tests/playwright-pages.json")
config = json.loads(config_path.read_text())

commit = subprocess.check_output(['git', 'rev-parse', '--short', 'HEAD']).decode().strip()

manifest = {
    "tag": tag,
    "stamp": stamp,
    "base_url": base_url,
    "commit": commit,
    "pages": config.get("pages", []),
    "anchors": config.get("anchors", []),
    "artifacts": sorted([p.name for p in pathlib.Path(out_dir, "artifacts").glob("*.png")]),
    "report": "report.json"
}

manifest_path = pathlib.Path(out_dir) / "manifest.json"
manifest_path.write_text(json.dumps(manifest, indent=2))
PY

cat > "${OUT}/meta.json" <<EOF
{
  "tag": "${TAG}",
  "stamp": "${STAMP}",
  "base_url": "${BASE_URL}",
  "generated_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "[OK] Playwright audit -> ${OUT}"

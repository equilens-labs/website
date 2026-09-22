#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

TAG="${PLAYWRIGHT_AUDIT_TAG:-${1:-PLAYWRIGHT-AUDIT}}"
STAMP="${PLAYWRIGHT_AUDIT_STAMP:-$(date -u +%Y%m%dT%H%M%SZ)}"
OUT="output/ops/${TAG}-${STAMP}"
mkdir -p "$OUT"

export PLAYWRIGHT_AUDIT_TAG="$TAG"
export PLAYWRIGHT_AUDIT_STAMP="$STAMP"
PLAYWRIGHT_WORKERS="${PLAYWRIGHT_WORKERS:-8}"

# Use a fresh loopback port and this exact checkout. Reusing an arbitrary server
# on 8000 can silently validate a different worktree.
PORT="${PLAYWRIGHT_PORT:-$(python3 -c 'import socket; s = socket.socket(); s.bind(("127.0.0.1", 0)); print(s.getsockname()[1]); s.close()')}"
BASE_URL="http://127.0.0.1:${PORT}"
SERVER_PID=""

cleanup() {
  if [[ -n "$SERVER_PID" ]]; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$REPO_ROOT" >"${OUT}/server.log" 2>&1 &
SERVER_PID=$!
READY=0
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if kill -0 "$SERVER_PID" 2>/dev/null && curl --fail --silent --max-time 2 "${BASE_URL}/" -o "${OUT}/server-index.html"; then
    if cmp -s index.html "${OUT}/server-index.html"; then READY=1; break; fi
  fi
  sleep 0.2
done
if [[ "$READY" != 1 ]] || ! kill -0 "$SERVER_PID" 2>/dev/null; then
  echo "[FAIL] This checkout's local server did not start; live-site fallback is prohibited" >&2
  exit 1
fi
export EQL_BASE_URL="$BASE_URL"

if [[ -n "${CI:-}" ]]; then
  npx @playwright/test install --with-deps chromium >/tmp/playwright-install.log 2>&1
else
  npx @playwright/test install chromium >/tmp/playwright-install.log 2>&1
fi
npx @playwright/test test --config=playwright.config.ts --workers="${PLAYWRIGHT_WORKERS}"

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

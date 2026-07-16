#!/usr/bin/env bash
set -euo pipefail

TASK="${1:-SITE-DEPLOY}"
STAMP="$(date -u +%Y%m%d%H%M%SZ)"
OUT="output/ops/${TASK}-${STAMP}"
mkdir -p "$OUT"

FILES=(
  "index.html"
  "fl-bsa/index.html"
  "contact/index.html"
  "legal/index.html"
  "trust-center/index.html"
  "procurement/index.html"
  "robots.txt"
  "sitemap.xml"
  "assets/eql/base.css"
  "assets/eql/nav.js"
  "assets/eql/contact.js"
  "config/web/nav.json"
  "config/web/footer.json"
  "brand/tokens/tokens.json"
  "brand/tokens/tokens.css"
  "brand/logo/equilens-wordmark-light.svg"
  "brand/social/og-1200x630.svg"
  "brand/social/og-1200x630.png"
)

existing=()
missing=()
for f in "${FILES[@]}"; do
  if [[ -f "$f" ]]; then
    existing+=("$f")
  else
    missing+=("$f")
  fi
done

{
  printf "files:\n"
  for f in "${existing[@]}"; do
    printf "  - %s\n" "$f"
  done
  if ((${#missing[@]})); then
    printf "missing:\n"
    for f in "${missing[@]}"; do
      printf "  - %s\n" "$f"
    done
  fi
} > "${OUT}/manifest.list"

if ((${#existing[@]})); then
  sha256sum "${existing[@]}" > "${OUT}/hashes.sha256"
else
  : > "${OUT}/hashes.sha256"
fi

python3 - "$TASK" "$STAMP" "${existing[@]}" -- "${missing[@]}" <<'PY' > "${OUT}/manifest.json"
import json
import sys

args = sys.argv[1:]
sep = args.index('--') if '--' in args else len(args)
task, stamp = args[0], args[1]
existing = args[2:sep]
missing = args[sep + 1:] if sep < len(args) else []
manifest = {
    "task": task,
    "stamp": stamp,
    "files": existing,
}
if missing:
    manifest["missing"] = missing
json.dump(manifest, sys.stdout, indent=2)
sys.stdout.write("\n")
PY

echo "[OK] evidence -> ${OUT}"

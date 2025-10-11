#!/usr/bin/env bash
set -euo pipefail

SVG="assets/brand/og-default.svg"
OUT="assets/brand/og-default.png"

if [[ ! -f "$SVG" ]]; then
  echo "error: ${SVG} not found" >&2
  exit 1
fi

python3 -m cairosvg "$SVG" -o "$OUT" -W 1200 -H 630

echo "[OK] rendered $OUT"

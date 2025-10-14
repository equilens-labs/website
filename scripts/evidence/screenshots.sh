#!/usr/bin/env bash
set -euo pipefail

# Headless Chrome screenshot helper for reproducible evidence captures.
# Outputs artifacts under output/ops/SCREENSHOTS-<timestamp>/ with a manifest and hashes.
#
# Usage:
#   scripts/evidence/screenshots.sh [TASK_TAG]
#
# Notes:
# - Starts a local http.server on :8000 if one isn't already running.
# - Captures desktop and mobile viewports for discovered pages.
# - Avoids external dependencies; uses the system Chrome/Chromium.

TASK="${1:-SCREENSHOTS}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="output/ops/${TASK}-${STAMP}"
mkdir -p "$OUT"

# Resolve Chrome binary
CHROME_BIN="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
if [[ -z "${CHROME_BIN}" ]]; then
  echo "error: Chrome/Chromium binary not found (google-chrome/chromium)" >&2
  exit 1
fi

CHROME_VER="$($CHROME_BIN --version || true)"
echo "$CHROME_VER" > "$OUT/chrome_version.txt"

# Ensure local server is running on :8000
PORT=8000
if [[ -f /tmp/website_server.pid ]] && ps -p "$(cat /tmp/website_server.pid)" >/dev/null 2>&1; then
  : # already running
else
  python3 -m http.server "$PORT" >/tmp/website_server.log 2>&1 &
  echo $! > /tmp/website_server.pid
  sleep 0.5
fi

BASE_URL="http://localhost:${PORT}"

# Discover pages: root plus all reachable *.html in site content.
# Skip VCS, CI, scripts, and prior outputs to avoid noise.
declare -a PAGES
PAGES+=("/")

while IFS= read -r f; do
  # Normalize to a URL path
  rel="${f#./}"
  if [[ "$rel" == index.html ]]; then
    # root already included
    continue
  elif [[ "$rel" == */index.html ]]; then
    path="/${rel%/index.html}/"
  else
    path="/${rel}"
  fi
  PAGES+=("$path")
done < <(find . \
  \( -path './.git' -o -path './.github' -o -path './output' -o -path './scripts' \) -prune -false -o \
  -type f -name '*.html' -print | sort)

# Unique list
readarray -t PAGES < <(printf '%s\n' "${PAGES[@]}" | awk '!seen[$0]++')

# Screenshot helper
shot() {
  local label="$1" url="$2" width="$3" height="$4" scale="$5"
  local out_png="$OUT/${label}-${width}x${height}-${scale}x.png"
  "$CHROME_BIN" --headless=new --disable-gpu \
    --window-size="${width},${height}" \
    --force-device-scale-factor="${scale}" \
    --hide-scrollbars \
    --default-background-color=ffffff \
    --virtual-time-budget=5000 \
    --screenshot="${out_png}" "${url}" >/dev/null 2>&1 || true
}

# Iterate pages (desktop + mobile)
for path in "${PAGES[@]}"; do
  # label: strip slashes, map root to 'home'
  label=$(sed -E 's#^/+##; s#/$##; s#\.#-#g; s#/#-#g' <<<"$path")
  [[ -z "$label" ]] && label="home"
  url="${BASE_URL}${path}"
  # Desktop
  shot "$label" "$url" 1440 3200 2
  # Mobile tall viewport to include footers on long pages
  shot "${label}-mobile" "$url" 390 3200 3
done

# Add mid-breakpoint tablet captures for key routes
declare -a TABLET_ROUTES=( "/" "/fl-bsa/" "/pricing/" "/trust-center/" "/fl-bsa/whitepaper/" )
for path in "${TABLET_ROUTES[@]}"; do
  # only capture if page was discovered (exists in PAGES)
  if printf '%s\n' "${PAGES[@]}" | rg -x "$path" >/dev/null 2>&1; then
    label=$(sed -E 's#^/+##; s#/$##; s#\.#-#g; s#/#-#g' <<<"$path")
    [[ -z "$label" ]] && label="home"
    url="${BASE_URL}${path}"
    # 768px tablet portrait @2x
    shot "${label}-tablet768" "$url" 768 3200 2
    # 1024px tablet landscape/small desktop @2x
    shot "${label}-tablet1024" "$url" 1024 3200 2
  fi
done

( cd "$OUT" && sha256sum *.png > SHA256SUMS.txt ) || true

cat > "$OUT/manifest.txt" <<EOF
timestamp_utc: $STAMP
task: $TASK
chrome_version: $CHROME_VER
base_url: $BASE_URL
viewports:
  - desktop: { width: 1440, height: 3200, scale: 2 }
  - mobile:  { width:  390, height: 3200, scale: 3 }
pages:
$(for p in "${PAGES[@]}"; do printf "  - %s\n" "$p"; done)
EOF

echo "[OK] screenshots -> ${OUT}"

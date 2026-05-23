#!/usr/bin/env bash
set -euo pipefail

rm -rf dist
mkdir -p dist

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Copy only the public website surface (allowlist)
# NOTE: When adding a new top-level page/section, update SITE_FILES/SITE_DIRS so it is included in dist/.
SITE_FILES=(
  "404.html"
  "index.html"
  "robots.txt"
  "CNAME"
)

SITE_DIRS=(
  "assets"
  "brand"
  ".well-known"
  "contact"
  "docs"
  "faq"
  "fl-bsa"
  "legal"
  "press"
  "pricing"
  "procurement"
  "trust-center"
)

for file in "${SITE_FILES[@]}"; do
  if [ -f "$file" ]; then
    rsync -a "$file" dist/
  fi
done

if [ -f "sitemap.xml" ]; then
  rsync -a "sitemap.xml" dist/
fi

for dir in "${SITE_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    mkdir -p "dist/${dir}"
    rsync -a --exclude ".DS_Store" "${dir}/" "dist/${dir}/"
  fi
done

# Runtime config required by nav.js (copy only the web SSOT subtree).
if [ -d "config/web" ]; then
  mkdir -p dist/config/web
  rsync -a --exclude ".DS_Store" "config/web/" "dist/config/web/"
fi

# Stamp only the deploy artifact with the actual build date and commit. Source
# HTML keeps a publish-time note so repository files cannot drift from HEAD.
chmod +x "$SCRIPT_DIR/update-footer.sh"
"$SCRIPT_DIR/update-footer.sh" dist

# Guard: no vendor demo HTML should ship
MAP=$(find dist -type f -name '*.html' -print0 | xargs -0 -I{} sh -c "grep -nE '(^|/)(themes/appline/.*\\.html|template/appline-.*\\.html)' '{}' || true")
if [ -n "$MAP" ]; then
  echo 'ERROR: vendor demo HTML detected in dist/' >&2
  echo "$MAP"
  exit 1
fi

echo '[OK] dist prepared'

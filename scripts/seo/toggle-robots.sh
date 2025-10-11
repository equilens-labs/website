#!/usr/bin/env bash
set -euo pipefail

usage() {
  echo "usage: scripts/seo/toggle-robots.sh private|public" >&2
  exit 1
}

MODE=${1:-}
[[ -n "$MODE" ]] || usage
if [[ "$MODE" != "private" && "$MODE" != "public" ]]; then
  usage
fi

if [[ -f CNAME ]]; then
  DOMAIN=$(tr -d '\r\n' < CNAME)
else
  DOMAIN=""
fi

if [[ "$MODE" == "private" ]]; then
  cat > robots.txt <<'TXT'
User-agent: *
Disallow: /
TXT
else
  if [[ -z "$DOMAIN" ]]; then
    echo "warning: CNAME missing or empty; generating robots.txt without Sitemap" >&2
    cat > robots.txt <<'TXT'
User-agent: *
Allow: /
TXT
  else
    cat > robots.txt <<TXT
User-agent: *
Allow: /
Sitemap: https://${DOMAIN}/sitemap.xml
TXT
  fi
fi

echo "[OK] robots.txt -> ${MODE}"

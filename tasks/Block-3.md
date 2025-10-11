Below is Block‑3: Automation & Public‑Toggle for your website repo.
It adds indexing toggle, sitemap generator, OG export, 404.html, security.txt, and wires them into your existing GitHub Pages workflow—with smallest diffs, no secrets, and auditable artifacts.

⸻

1) Context & Goal

Harden the static site with deterministic scripts and a workflow‑controlled privacy toggle:
	•	Default stays private (noindex, Disallow: /).
	•	A manual dispatch can flip to public (adds sitemap, allows indexing).
	•	Always render OG PNG from SVG and snapshot evidence.

⸻

2) Current State & SSoT
	•	Repo: separate website repo serving equilens.io via GitHub Pages.
	•	Brand v1.1 wired; favicons present; OG SVG/PNG present; robots = Disallow; noindex set.
	•	CNAME present (equilens.io).
	•	Existing workflow (“Deploy website to GitHub Pages”) provided.

⸻

3) Proposed Approach (numbered; impact; alternatives)
	1.	Add SEO/OG/Evidence scripts under scripts/ (pure POSIX + Python).
	•	Impact: Low • Lanes: Web/Ops/SEO • Rollback: delete scripts/*.
	2.	Add 404 page & security.txt (standards‑aligned).
	•	Impact: Low • Lanes: Web/Sec • Rollback: delete files.
	3.	Update workflow to:
	•	Accept visibility input (private/public) on workflow_dispatch.
	•	Default to private for push builds.
	•	Run: indexing toggle → sitemap (if public) → OG render → evidence snapshot → upload artifact → deploy.
	•	Impact: Med • Lanes: CI/Web • Rollback: restore prior YAML.

Alternative: keep manual scripts only (no CI integration). Not chosen.

⸻

4) Change‑Set Preview (file‑scoped)

Branch: feature/block-3
No secrets. All paths relative to repo root.

4.1 SEO / Indexing scripts

scripts/seo/set-indexing.py
Impact: Med • Lanes: Web/SEO • Rollback: re‑run with opposite mode

#!/usr/bin/env python3
# Usage: python3 scripts/seo/set-indexing.py private|public
import sys, pathlib, re
mode = sys.argv[1] if len(sys.argv)>1 else "private"
assert mode in ("private","public"), "mode must be private|public"
root = pathlib.Path(".")
meta_private = '<meta name="robots" content="noindex, nofollow">'
def rewrite(p: pathlib.Path):
    s = p.read_text(encoding="utf-8")
    if mode == "private":
        if re.search(r'<meta\s+name=["\']robots["\']', s, flags=re.I):
            s = re.sub(r'<meta\s+name=["\']robots["\'][^>]*>', meta_private, s, flags=re.I)
        else:
            s = s.replace("<head>", "<head>\n  " + meta_private)
    else:
        s = re.sub(r'\s*<meta\s+name=["\']robots["\'][^>]*>\s*', "", s, flags=re.I)
    p.write_text(s, encoding="utf-8")
for html in root.rglob("*.html"):
    rewrite(html)
print(f"[OK] set-indexing: {mode}")

scripts/seo/toggle-robots.sh
Impact: Med • Lanes: Web/SEO • Rollback: re‑run opposite mode

#!/usr/bin/env bash
set -euo pipefail
MODE="${1:?usage: scripts/seo/toggle-robots.sh private|public}"
if [[ "$MODE" == "private" ]]; then
  cat > robots.txt <<'TXT'
User-agent: *
Disallow: /
TXT
else
  DOMAIN="$(cat CNAME)"
  cat > robots.txt <<TXT
User-agent: *
Allow: /
Sitemap: https://${DOMAIN}/sitemap.xml
TXT
fi
echo "[OK] robots.txt -> $MODE"

scripts/seo/gen-sitemap.py
Impact: Low • Lanes: Web/SEO • Rollback: delete sitemap.xml

#!/usr/bin/env python3
# Builds sitemap.xml from all index.html files; domain from CNAME.
import pathlib, datetime
root = pathlib.Path(".")
domain = f"https://{root.joinpath('CNAME').read_text().strip()}"
today = datetime.date.today().isoformat()
urls = []
for p in root.rglob("index.html"):
    rel = p.parent.relative_to(root)
    path = "/" if str(rel)=="." else f"/{rel.as_posix().rstrip('/')}/"
    urls.append(f"  <url><loc>{domain}{path}</loc><lastmod>{today}</lastmod></url>")
xml = "\n".join(['<?xml version="1.0" encoding="UTF-8"?>',
                 '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', *urls, '</urlset>'])
root.joinpath("sitemap.xml").write_text(xml, encoding="utf-8")
print(f"[OK] sitemap.xml with {len(urls)} URLs @ {domain}")

4.2 OG renderer

scripts/og/render.sh
Impact: Low • Lanes: Web • Rollback: keep prev PNG

#!/usr/bin/env bash
set -euo pipefail
SVG="assets/brand/og-default.svg"
OUT="assets/brand/og-default.png"
# cairosvg must be available in PATH (installed in CI below)
cairosvg "$SVG" -o "$OUT" -W 1200 -H 630
echo "[OK] rendered $OUT"

4.3 Evidence snapshot

scripts/evidence/snapshot.sh
Impact: Low • Lanes: Ops/Audit • Rollback: remove folder

#!/usr/bin/env bash
set -euo pipefail
TASK="${1:-SITE-DEPLOY}"
STAMP="$(date +%Y%m%d%H%M%S)"
OUT="output/ops/${TASK}-${STAMP}"
mkdir -p "$OUT"
FILES=(
  "index.html" "contact/index.html" "legal/index.html"
  "robots.txt" "sitemap.xml"
  "assets/base.css"
  "assets/brand/logo-mark.svg" "assets/brand/og-default.svg" "assets/brand/og-default.png"
  "docs/brand/tokens.json" "docs/brand/press-kit.json"
)
printf "%s\n" "${FILES[@]}" | sed 's/^/  - /' > "${OUT}/manifest.list"
sha256sum "${FILES[@]}" > "${OUT}/hashes.sha256" || true
jq -n --arg task "${TASK}" --arg stamp "${STAMP}" \
  --argfile list <(printf '%s\n' "${FILES[@]}" | jq -R . | jq -s .) \
  '{task:$task, stamp:$stamp, files:$list}' > "${OUT}/manifest.json"
echo "[OK] evidence -> ${OUT}"

Make executable

chmod +x scripts/seo/toggle-robots.sh scripts/og/render.sh scripts/evidence/snapshot.sh

4.4 404 & security.txt

404.html
Impact: Low • Lanes: Web • Rollback: delete file

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Page not found — Equilens</title>
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="./favicon.ico" sizes="any">
<link rel="stylesheet" href="./assets/base.css">
</head><body>
<header class="wrap"><div class="brand">Equilens <span class="pill">FL‑BSA</span></div></header>
<main class="wrap">
<h1>Page not found</h1>
<p>The page you’re looking for doesn’t exist. Return to the <a href="./">home page</a>.</p>
</main>
<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>

.well-known/security.txt
Impact: Low • Lanes: Sec/Web • Rollback: delete file

Contact: mailto:equilens@equilens.io
Policy: https://equilens.io/legal/
Expires: 2026-01-01T00:00:00Z
Acknowledgments: https://equilens.io/legal/

4.5 HTML head hygiene (minimal diffs)

(Only add if missing; keep relative paths in subpages)

index.html — add inside <head>

<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="./favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/">
<meta name="theme-color" content="#1E293B">
<meta property="og:title" content="Equilens — Fair‑Lending Bias‑Simulation Appliance">
<meta property="og:description" content="Deterministic bias simulation & compliance evidence — self‑hosted, no data leaves your VPC.">
<meta property="og:url" content="https://equilens.io/">
<meta property="og:image" content="https://equilens.io/assets/brand/og-default.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">

contact/index.html and legal/index.html — add inside <head>

<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/contact/"><!-- or /legal/ -->
<meta property="og:image" content="https://equilens.io/assets/brand/og-default.png">


⸻

5) CI: Update your existing Pages workflow (minimal edits)

Replace your current workflow file content with the following (same name is fine).

.github/workflows/pages.yml
Impact: Med • Lanes: CI/Web • Rollback: restore prior YAML

name: Deploy website to GitHub Pages

on:
  push:
    branches: [ main ]
    paths:
      - '**'
  workflow_dispatch:
    inputs:
      visibility:
        description: 'Site visibility (private keeps noindex & Disallow; public adds sitemap & allows indexing)'
        required: true
        default: 'private'
        type: choice
        options: [ 'private', 'public' ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

env:
  # Default to private on push; use dispatch input when manually triggered
  SITE_VISIBILITY: ${{ github.event_name == 'workflow_dispatch' && inputs.visibility || 'private' }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Python for tooling
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install OG renderer (cairosvg) and jq
        run: |
          python -m pip install --upgrade pip
          pip install cairosvg
          sudo apt-get update -y && sudo apt-get install -y jq

      - name: Ensure script permissions
        run: |
          chmod +x scripts/seo/toggle-robots.sh scripts/og/render.sh scripts/evidence/snapshot.sh || true

      - name: Set site visibility (private/public)
        run: |
          echo "SITE_VISIBILITY=${SITE_VISIBILITY}"
          python3 scripts/seo/set-indexing.py "${SITE_VISIBILITY}"
          scripts/seo/toggle-robots.sh "${SITE_VISIBILITY}"

      - name: Generate sitemap (public only)
        if: env.SITE_VISIBILITY == 'public'
        run: python3 scripts/seo/gen-sitemap.py

      - name: Render OpenGraph PNG from SVG
        run: scripts/og/render.sh

      - name: Evidence snapshot
        run: scripts/evidence/snapshot.sh "SITE-DEPLOY"

      - name: Configure Pages
        uses: actions/configure-pages@v5
        with:
          enablement: true

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: .

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

Behavior
	•	Push to main ⇒ builds in private mode (safe default).
	•	Manual dispatch ⇒ choose public to Allow + sitemap; private to reset.

⸻

6) Verification Plan

# Local (optional)
python3 -m http.server 8080
# Visit / (check head), /contact/ and /legal/ (favicons paths), /404.html

# CI (after pushing branch)
# 1) Run dispatch with visibility=private  (keeps status quo)
# 2) Run dispatch with visibility=public
#    - Check https://equilens.io/robots.txt  -> "Allow: /" + Sitemap line
#    - Check https://equilens.io/sitemap.xml -> valid XML with /, /contact/, /legal/
#    - Social debugger(s) show OG image resolution (1200x630)
# Evidence appears under output/ops/SITE-DEPLOY-<timestamp>/


⸻

7) Risk & Rollback

Risk	Impact	Mitigation	Rollback
Site indexed prematurely	Med	Default private on push; public requires manual dispatch	Run dispatch with visibility=private
Robots/meta drift across pages	Low	Script rewrites all *.html each build	Re‑run opposite mode
Wrong domain in sitemap	Low	Uses CNAME as source of truth	Fix CNAME; re‑run
OG export fails	Low	cairosvg installed in CI; fallback to prior PNG	Skip scripts/og/render.sh step


⸻

8) Follow‑ups (I’ll include by default next block unless you say otherwise)
	•	Tiny accessibility pass (focus outlines, prefers‑reduced‑motion).
	•	Lightweight 1200×630 OG variants (dark/light).
	•	Security headers doc for eventual CDN (HSTS, CSP, referrer‑policy) — page‑level safe list.

⸻

9) Assumptions & Unknowns
	•	Hosting remains GitHub Pages; CNAME is authoritative.
	•	You’re fine keeping private by default and promoting to public via manual dispatch.

⸻

Engineer TL;DR
	•	Add scripts, 404.html, .well-known/security.txt.
	•	Replace workflow with provided YAML (keeps your name & deploy steps; adds preprocessing + visibility input).
	•	Push to main (still private).
	•	When ready: Actions → Run workflow → visibility=public.
	•	Evidence & hashes land in output/ops/SITE-DEPLOY-<timestamp>/.

If you want, I can also provide a single git patch bundling all new files + workflow changes.

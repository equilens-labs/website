Perfect. With Block 3 done, here’s Block 4 — Quality & A11y Gates + Security-in-HTML followed by Block 5 — Launch Readiness. Everything below is copy‑paste ready, smallest diffs, deterministic, and fully reversible. I’m not asking—just proposing the next concrete moves.

⸻

Block 4 — Quality & Accessibility + HTML‑level security

1) Goals (fast to adopt)
	•	Add non‑blocking audits (links, a11y, Lighthouse) on PRs and main.
	•	Tighten HTML‑level security (CSP meta, referrer policy) without a CDN.
	•	Remove tiny inline styles to enable a stricter CSP (no unsafe-inline).
	•	Ship accessibility basics (skip link, focus outline, reduced‑motion).
	•	Keep private/public toggle behavior from Block 3 untouched.

2) Proposed changes (impact, lanes, rollback)

Item	What	Impact	Lanes	Rollback
A	Add audit workflow (audit.yml) running Lychee, Pa11y, Lighthouse	Med	CI/Web	Delete workflow
B	Add configs: ops/lychee.toml, ops/pa11yci.json, ops/lighthouserc.json, ops/a11y-urls.txt	Low	Web	Delete files
C	Add CSP meta + Referrer‑Policy meta; remove inline styles	Low	Web/Sec	Remove metas; revert small CSS
D	Add skip link + improved focus styles	Low	Web/A11y	Revert CSS + HTML lines
E	Generate apple‑touch‑icon & web app icons from existing mark	Low	Web	Remove icons


⸻

3) Change‑Set Preview (file‑scoped; paste as‑is)

Branch: feature/block-4

A) CI — Non‑blocking quality audits

.github/workflows/audit.yml
Impact: Med • Lanes: CI/Web • Rollback: delete file

name: Site audits (links, a11y, Lighthouse)

on:
  pull_request:
  push:
    branches: [ main ]

permissions:
  contents: read

jobs:
  audit:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python server
        run: |
          python3 -m pip install --upgrade pip
          nohup python3 -m http.server 8080 >/dev/null 2>&1 &
          sleep 1

      - name: Link check (Lychee pinned)
        uses: lycheeverse/lychee-action@v1.10.0
        with:
          args: --config ops/lychee.toml .

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20.11.1'

      - name: Install a11y & Lighthouse CLIs
        run: |
          npm i -g pa11y-ci@3.1.0 @lhci/cli@0.13.0

      - name: Accessibility (Pa11y CI)
        run: pa11y-ci --config ops/pa11yci.json

      - name: Lighthouse CI (3 URLs)
        run: lhci autorun --config=ops/lighthouserc.json || true

      - name: Upload audit artifacts
        uses: actions/upload-artifact@v4
        with:
          name: site-audits
          path: |
            ./*.report.json
            ./.lighthouseci/**/*
            ./lychee/results.md

ops/lychee.toml
Impact: Low • Lanes: Web • Rollback: delete file

verbose = true
max_concurrency = 8
timeout = 20
retry_wait_time = 2
max_retries = 2
exclude = ["mailto:*"]
offline = false
format = "markdown"
output = "lychee/results.md"

ops/pa11yci.json
Impact: Low • Lanes: A11y/Web • Rollback: delete file

{
  "defaults": {
    "standard": "WCAG2AA",
    "timeout": 60000,
    "chromeLaunchConfig": { "args": ["--no-sandbox","--disable-dev-shm-usage"] }
  },
  "urls": [
    "http://localhost:8080/",
    "http://localhost:8080/contact/",
    "http://localhost:8080/legal/"
  ]
}

ops/lighthouserc.json
Impact: Low • Lanes: Web • Rollback: delete file

{
  "ci": {
    "collect": {
      "url": ["http://localhost:8080/","http://localhost:8080/contact/","http://localhost:8080/legal/"],
      "startServerCommand": "python3 -m http.server 8080",
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:accessibility": ["warn", { "minScore": 0.9 }]
      }
    }
  }
}


⸻

B) HTML‑level security + a11y (no runtime header support needed)

index.html — add inside <head> if not present
Impact: Low • Lanes: Web/Sec • Rollback: remove lines

<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<link rel="preload" href="./assets/base.css" as="style">

index.html — add skip link at top of <body> and remove inline style on logo
Impact: Low • Lanes: A11y/Web • Rollback: remove lines / restore inline

<a class="skip-to-content" href="#main">Skip to content</a>

<header class="wrap">
  <div class="brand">
    <img class="brand-logo" src="./assets/brand/logo-mark.svg" width="28" height="28" alt="Equilens">
    <span class="brand-name">Equilens</span>
    <span class="pill">FL‑BSA</span>
  </div>
  <nav><a href="./contact/">Contact</a> <a href="./legal/">Legal</a></nav>
</header>

<main id="main" class="wrap hero">
  <!-- existing content -->
</main>

contact/index.html & legal/index.html — same edits (depth‑aware paths)
Impact: Low • Lanes: A11y/Web • Rollback: remove lines

<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<a class="skip-to-content" href="#main">Skip to content</a>
<img class="brand-logo" src="../assets/brand/logo-mark.svg" width="28" height="28" alt="Equilens">
<main id="main" class="wrap">
  <!-- page content -->
</main>

assets/base.css — add/adjust only the minimal selectors
Impact: Low • Lanes: Web/A11y • Rollback: delete these blocks

/* A11y helpers */
.skip-to-content {
  position:absolute; left:-9999px; top:auto; width:1px; height:1px; overflow:hidden;
}
.skip-to-content:focus {
  position:static; width:auto; height:auto; padding:.5rem .75rem; background:var(--slate); color:#fff; border-radius:6px;
}
.brand-logo { vertical-align: middle; margin-right: 8px; }

/* Focus visibility */
:focus-visible { outline: 2px solid var(--accent-link); outline-offset: 2px; }

/* Motion preference */
@media (prefers-reduced-motion: reduce) {
  * { animation: none!important; transition: none!important; }
}


⸻

C) Icons for Apple / Web App (from existing pack)

scripts/icons/generate.py
Impact: Low • Lanes: Web • Rollback: delete files & icons

#!/usr/bin/env python3
# Generate Apple and PWA icons from existing 1024px logo-on-white.
from PIL import Image
from pathlib import Path
src = Path("docs/brand/equilens_logo_mark_pack_v1_1/equilens_logo_mark_v1_1_white_1024.png")
out = Path("assets/brand"); out.mkdir(parents=True, exist_ok=True)
img = Image.open(src).convert("RGBA")
img.resize((180,180)).save(out/"apple-touch-icon.png")
img.resize((512,512)).save(out/"icon-512.png")
img.resize((192,192)).save(out/"icon-192.png")
print("[OK] wrote apple-touch-icon.png, icon-512.png, icon-192.png")

(Optional) Minimal Web App Manifest — site.webmanifest
Impact: Low • Lanes: Web • Rollback: delete file + link

{
  "name": "Equilens",
  "short_name": "Equilens",
  "icons": [
    { "src": "/assets/brand/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/assets/brand/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#1E293B",
  "background_color": "#FFFFFF",
  "display": "standalone",
  "start_url": "/"
}

Add to <head> of pages (optional)

<link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">


⸻

4) Verification Plan (exact commands)

# Branch
git checkout -b feature/block-4

# Add / update files above; make scripts executable
chmod +x scripts/icons/generate.py

# Generate icons locally
python3 scripts/icons/generate.py
ls -l assets/brand/apple-touch-icon.png assets/brand/icon-192.png assets/brand/icon-512.png

# Local preview
python3 -m http.server 8080
# Check: skip link focus, focus-visible outlines, logo <img> has no inline style

# CI
git add .
git commit -m "BLOCK-4: audits (Lychee/Pa11y/LHCI), CSP+referrer metas, a11y basics, Apple/PWA icons"
git push origin feature/block-4
# Open PR → See 'Site audits' workflow artifacts; ensure no blocker errors


⸻

5) Risks & Rollback

Risk	Mitigation	Rollback
CSP blocks unexpected inline styles	We removed inline styles; CSS now holds them	Drop CSP meta or loosen (add 'unsafe-inline' for style)
A11y audit failures on first run	Treat workflow as non‑blocking; fix as time allows	Disable audit.yml
Apple/Web app icons unused	Harmless; optional head links control usage	Remove icons & links


⸻

Block 5 — Launch Readiness (when you choose to go public)

Not executed now, but here’s the exact sequence so you can launch cleanly.

1) One‑click checklist (PR or manual)
	•	Confirm legal stubs are replaced or clearly labeled (LexPro owns content).
	•	Makefile (from Block 3) — make seo-public && make sitemap && make og && make evidence.
	•	GitHub Actions → Run workflow with visibility=public.
	•	Validate:
	•	https://equilens.io/robots.txt shows Allow + Sitemap.
	•	https://equilens.io/sitemap.xml is valid and lists /, /contact/, /legal/.
	•	OG debugger shows correct banner.
	•	Audit workflow artifacts have no critical A11y/Link issues.

2) Optional but recommended (later)
	•	Search Console/Bing verification (meta tag or DNS)—create tasks/SEO-VERIFY.md and commit evidence.
	•	CDN security headers (HSTS/CSP/XFO, etc.) if you decide to front GitHub Pages behind a CDN.
	•	Structured data JSON‑LD (Organization + WebSite) once public.

⸻

Follow‑ups I’ll queue next (unless you say otherwise)
	•	Structured data JSON‑LD + Organization logo markup (absolute URLs).
	•	Dark‑mode tokens (only if you want; still WCAG‑AA).
	•	Press kit page auto‑generated from docs/brand/press-kit.json.

If you’re happy, I’ll produce a single unified patch for Block 4, or proceed directly with Block 5 when you say “Go public.”
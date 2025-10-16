
You’re right—the “template pass” leaked vendor demo pages and it shows. I inspected your site-screenshots-stage3 bundle: it includes screenshots for /themes/appline/signin.html, /themes/appline/signup.html, and /template/appline-tailwind/build/ pages (e.g., template-appline-tailwind-build-blog-grid-html-1440x3200-2x.png). That means the template’s demo HTML is being deployed alongside our site instead of only the CSS/JS, which explains the off-brand, chaotic feel. The pack’s manifest lists those routes explicitly (e.g., /themes/appline/signin.html, /themes/appline/signup.html).

⸻

Block‑12 Rescue: Appline Adoption Fix (Deterministic + Reversible)

1) Context & Goal

Restore a professional, minimal shell using Appline without shipping any vendor demo pages. Keep the site private, self‑hosted assets, strict CSP, and smallest diffs.

⸻

2) Findings (from the screenshot bundle)
	•	Vendor demo HTML is public: /themes/appline/signin.html, /themes/appline/signup.html, /template/appline-tailwind/build/* are accessible and got screenshotted.
	•	Style collision risk: Appline’s global selectors can override our tokens if load order is wrong.
	•	JS not required: We don’t need the demo’s interactivity; a no‑JS mobile nav is sufficient.

⸻

3) Proposed Approach (do now)
	1.	Quarantine vendor HTML (keep only CSS/JS)
	•	Move all template HTML out of the deploy tree; keep only themes/appline/style.css, themes/appline/bundle.js (optional), and any images we actually use.
Impact: High (fixes the root cause) • Lanes: Web/Ops • Rollback: move folder back.
	2.	Deploy a curated artifact (dist/), not the repo root
	•	Prepare a clean dist/ that includes only our site pages + allowed assets.
Impact: High • Lanes: Web/Ops • Rollback: point GH Pages back to ..
	3.	Harden head order + CSP
	•	Load themes/appline/style.css → assets/brand/overrides.css → assets/base.css.
	•	CSP stays default-src 'self' (no remote fonts/scripts).
Impact: Med • Lanes: Web/Sec • Rollback: revert head blocks.
	4.	No‑JS mobile nav (keep it simple)
	•	Use our existing depth‑aware grid nav; do not ship bundle.js unless strictly needed.
Impact: Low • Lanes: Web • Rollback: add <script> back.

⸻

4) Change‑Set Preview

Branch: fix/theme-appline-rescue-01

A. Quarantine vendor template

# Keep license material, but remove demo HTML from deploy tree
mkdir -p vendor/appline
git mv template/appline-tailwind vendor/appline/
# Keep only the CSS/JS we actually need:
mkdir -p themes/appline
cp vendor/appline/appline-tailwind/build/style.css themes/appline/style.css
# (Optional, only if needed for menu): cp vendor/appline/appline-tailwind/build/bundle.js themes/appline/bundle.js
# Remove any HTML in themes/appline
git rm -f themes/appline/*.html 2>/dev/null || true

B. Add deploy prep script (curate dist/) — scripts/deploy/prepare.sh (new)

#!/usr/bin/env bash
set -euo pipefail
rm -rf dist
mkdir -p dist
# Copy only site pages and allowed assets
rsync -a \
  --exclude 'vendor/' \
  --exclude 'template/' \
  --exclude '.github/' \
  --exclude 'themes/appline/*.html' \
  --exclude 'output/ops/' \
  --exclude 'tasks/' \
  --exclude 'scripts/' \
  . dist/

# Sanity guards: no vendor demo HTML should slip through
rg -n --hidden '/themes/appline/.*\.html|/template/appline.*\.html' dist && {
  echo "ERROR: vendor demo HTML detected in dist/"
  exit 1
} || true

C. Update Pages workflow — .github/workflows/pages.yml (patch)

      - name: Prepare deploy artifact
        run: |
          chmod +x scripts/deploy/prepare.sh
          scripts/deploy/prepare.sh
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

D. Standardize head (depth-aware)

<!-- in every page head -->
<link rel="preload" href="{DEPTH}themes/appline/style.css" as="style">
<link rel="stylesheet" href="{DEPTH}themes/appline/style.css">
<link rel="stylesheet" href="{DEPTH}assets/brand/overrides.css">
<link rel="stylesheet" href="{DEPTH}assets/base.css">
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'">
<!-- No bundle.js unless we really need it -->

E. Minimal overrides — assets/brand/overrides.css (ensure exists)

:root { --equilens-accent: #6D28D9; }
.text-indigo-600,.hover\:text-indigo-600:hover{ color:var(--equilens-accent)!important; }
.bg-indigo-600,.hover\:bg-indigo-600:hover{ background-color:var(--equilens-accent)!important; }
.border-indigo-600{ border-color:var(--equilens-accent)!important; }
.ring-indigo-600,.focus\:ring-indigo-600:focus{ --tw-ring-color:var(--equilens-accent)!important; }


⸻

5) Verification Plan (exact)

# Local
bash scripts/deploy/prepare.sh
python3 -m http.server 8000 -d dist

# Confirm vendor pages are gone
curl -Is http://localhost:8000/themes/appline/signin.html | head -n1   # expect 404
curl -Is http://localhost:8000/template/appline-tailwind/build/index.html | head -n1  # expect 404

# CI audit still runs
gh workflow run audit.yml

# Evidence snapshot
scripts/evidence/snapshot.sh "THEME-APPLINE-RESCUE-01"


⸻

6) Risks & Rollback
	•	Missed file in dist: If something is missing, change prepare.sh include/exclude list and re‑run.
	•	Style drift: If Appline utilities override our tokens, swap load order (move assets/base.css after Appline).
	•	Rollback: revert workflow to deploy from repo root and restore folders.

⸻

7) Follow‑ups
	•	Stage‑2 visual polish: re‑wrap Home, FL‑BSA, and Pricing sections with Appline’s section grids (without importing demo markup).
	•	Purge CSS (non‑fast gate): optional Tailwind purge to shrink style.css, commit result for determinism.
	•	Guardrail: add a CI check that fails if any path matches /themes/appline/*.html or /template/* in dist/.

⸻

8) Assumptions & Unknowns
	•	I relied on the screenshot manifest for route evidence (shows the vendor demo routes were crawled).
	•	If you still want to retain the original template HTML for reference, I parked it under vendor/ so it’s versioned but not deployed.

⸻

If you approve, I’ll stage branch + scripts + workflow patch as above. After that, the site will only expose our pages and brand, while using Appline only as a CSS layer. ￼
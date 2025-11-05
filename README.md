# Equilens Website

[![DNS/TLS Guard](https://github.com/equilens-labs/website/actions/workflows/dns-ssl-guard.yml/badge.svg)](https://github.com/equilens-labs/website/actions/workflows/dns-ssl-guard.yml)

Static site for Equilens FL‑BSA. Deployed via GitHub Pages from `main`.

- Content: HTML/CSS only, root directory
- Brand assets: source files live under `brand/` (~0.4 MB); runtime copies under `assets/brand/`
  - Includes `wordmark.svg`, `wordmark_text.svg`, `wordmark_outlined.svg`, `tokens.json`, and `press-kit.json`
  - Social preview art: `assets/brand/og-default.svg` and generated `assets/brand/og-default.png`
- Automation scripts: `scripts/seo/*`, `scripts/og/render.sh`, and `scripts/evidence/snapshot.sh`
- Legal verification: `scripts/legal/verify.sh LEGAL-PUB-<tag>` captures compliance evidence for legal pages
- Icon generation: `scripts/icons/generate.py` produces Apple/PWA icons in `assets/brand/`
- Additional hardening: `404.html`, `.well-known/security.txt`
- Custom domain: set via `CNAME`
- Workflows: `.github/workflows/pages.yml` (deploy) and `.github/workflows/audit.yml` (links/a11y/Lighthouse reports)
- Evidence: `output/ops/BRAND-IMPL-001/` and `output/ops/BRAND-IMPL-002/` store hash manifests for brand rollout phases

Local preview: `python3 -m http.server` and open http://localhost:8000

## Content management

- Primary navigation and micro-footer are synchronised from JSON “single source of truth” files:
  - Navigation links: `config/web/nav.json`
  - Footer links: `config/web/footer.json`
- After updating either file, run the sync scripts to fan out the change across every HTML page:

  ```bash
  python3 scripts/content/sync_nav_ssot.py
  python3 scripts/content/sync_footer_ssot.py
  python3 scripts/content/sync_flbsa_subnav.py  # FL-BSA sub-navigation
  ```

- Archived helpers used for previous theming experiments now live under `scripts/archive/legacy-sync/`. They are kept for reference only; do not run them on the current codebase.
- The HTML partials injected by the scripts live under `templates/` (`header.html`, `footer.html`).

## Evidence screenshots

- Standardized captures: run `scripts/evidence/screenshots.sh`
  - Starts a local server on `:8000` if needed
  - Produces desktop (1440x3200 @2x) and mobile (390x3200 @3x) PNGs
  - Artifacts, hashes, and a manifest are written under `output/ops/SCREENSHOTS-<timestamp>/`
  - CI workflow runs on PRs, pushes to `main`, and nightly at 02:00 UTC; artifacts are uploaded and a rolling GitHub Release `screenshots-nightly` gets the latest `site-screenshots.tar.gz` asset
- Playwright regression audit: run `scripts/ops/run_playwright_audit.sh`
  - Uses the flows defined in `config/tests/playwright-pages.json`
  - Stores JSON report, screenshots, hashes, and manifest under `output/ops/PLAYWRIGHT-AUDIT-<timestamp>/`
  - Honors `EQL_BASE_URL` if you need to target a deployed environment instead of the local server

## Deployment automation

- Pushes to `main` keep the site private (`noindex` / `Disallow: /`).
- Trigger `Deploy website to GitHub Pages` manually with `visibility=public` once you are ready to open indexing; rerun with `visibility=private` to revert.
- Each deployment run renders the OG PNG and writes evidence snapshots under `output/ops/SITE-DEPLOY-<timestamp>/`.
 - A DNS/TLS guard validates GitHub Pages DNS A/AAAA records and live TLS SANs for the custom domain; deployment fails if mismatched. Evidence is saved under `output/ops/DNS-SSL-GUARD-<timestamp>/`.

## VS Code remote setup

- Install the Remote Development pack and enable automatic reconnects for unstable links.
- Recommended extensions: Live Preview (Microsoft), Live Server, Prettier, HTML CSS Support, CSS Peek, Webhint, axe Accessibility Linter, GitHub Actions.
- Editor defaults live in `.vscode/settings.json` (auto-save after delay, Prettier on save, Emmet Tab expansion).
- Run `Serve: Local preview` from `Tasks: Run Task…` to launch the bundled `python3 -m http.server` watcher on port 8000.

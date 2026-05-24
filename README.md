# Equilens Website

[![DNS/TLS Guard](https://github.com/equilens-labs/website/actions/workflows/dns-ssl-guard.yml/badge.svg)](https://github.com/equilens-labs/website/actions/workflows/dns-ssl-guard.yml)

Static site for Equilens FL-BSA. Source changes land on `main`; the deploy workflow builds a `dist/` artifact and publishes it to the `gh-pages` branch used by GitHub Pages.

- Content: HTML/CSS only, root directory
- Brand assets: All brand assets live under `brand/` directory structure:
  - Logos: `brand/logo/equilens-wordmark-{light,dark,mono}.svg`
  - Icons: `brand/icons/favicon.{svg,ico}`, Apple touch icons, PWA maskable icons
  - Social: `brand/social/og-1200x{630,600}.{svg,png}` for Open Graph images
  - Tokens: `brand/tokens/tokens.{json,css}` for design system
  - Symbol: `brand/symbol/equilens-symbol.svg` and `brand/symbol/equilens-symbol-light-*.png` for favicon/app-icon sources
- Automation scripts: `scripts/seo/*`, `scripts/og/render.sh`, and `scripts/evidence/snapshot.sh`
- Legal verification: `scripts/legal/verify.sh LEGAL-PUB-<tag>` captures compliance evidence for legal pages
- Icon generation: `scripts/icons/generate.py` deterministically regenerates `brand/icons/{apple-touch-icon-180.png,icon-192-maskable.png,icon-512-maskable.png,favicon.ico}` from `brand/symbol/equilens-symbol-light-1024.png` using `magick` (required)
- Additional hardening: `404.html`, `.well-known/security.txt`
- Custom domain: set via `CNAME`
- Workflows: `.github/workflows/pages.yml` (deploy) and `.github/workflows/audit.yml` (links/a11y/Lighthouse reports)
- Evidence: `output/ops/BRAND-IMPL-001/` and `output/ops/BRAND-IMPL-002/` store hash manifests for brand rollout phases

## Analytics

- Public website visits, outbound link clicks, and file download clicks are measured with Plausible Analytics for the `equilens.io` domain.
- The active snippet is the cookieless Plausible script:

  ```html
  <script defer data-domain="equilens.io" src="https://plausible.io/js/script.outbound-links.file-downloads.js"></script>
  ```

- Page CSP policies allow `https://plausible.io` only for `script-src` and `connect-src`.
- Keep the legal Privacy Notice and Cookie Policy synchronized with any analytics change. The current posture is aggregate Plausible analytics for pageviews, outbound links, and file downloads only; no form-submission tracking, advertising pixels, social trackers, cookies, browser storage, or persistent visitor identifiers.
- Run `scripts/legal/verify.sh <tag>` after changing analytics/legal text so the evidence bundle records the approved Plausible posture.

**Local preview:** Install the [Live Preview extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) in VS Code, then right-click any HTML file and select "Show Preview" for instant live reload on save.

## Content management

- Primary navigation and the micro-footer are synchronised from JSON single-source files:
  - Navigation links: `config/web/nav.json`
  - Footer links: `config/web/footer.json`
- Navigation is rendered at runtime into the `#nav-placeholder` container by `/assets/eql/nav.js`, which reads from `config/web/nav.json`. This keeps the nav SSOT in a single JSON file while avoiding extra build tooling.
- The FL-BSA product sub-nav is maintained as a static HTML partial at `templates/flbsa_subnav.html`.
- After updating the footer JSON, run the sync script to fan out the change across every HTML page:

  ```bash
  python3 scripts/content/sync_footer_ssot.py
  ```

- Archived helpers used for previous theming experiments now live under `scripts/archive/legacy-sync/`. They are kept for reference only; do not run them on the current codebase.
- The HTML partials injected by the sync scripts live under `templates/` (currently `footer.html` and `flbsa_subnav.html`).

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
- Content lint: run `npm run content:lint`
  - Reuses the same forbidden-phrase checks enforced by `.github/workflows/audit.yml`
  - Blocks stale AWS Marketplace subscribe language, pre-live Marketplace/tier phrasing, unsupported compliance promises, and regulatory attestation phrasing

## Deployment automation

- Pushes to `main` keep the site private (`noindex` / `Disallow: /`).
- Trigger `Deploy website to GitHub Pages` manually with `visibility=public` once you are ready to open indexing; rerun with `visibility=private` to revert.
- The deploy workflow prepares the allowlisted public surface under `dist/`, stamps footer metadata in that deploy artifact, and publishes the resulting tree to `gh-pages`.
- Each deployment run renders the OG PNG and writes evidence snapshots under `output/ops/SITE-DEPLOY-<timestamp>/`.
- A DNS/TLS guard validates GitHub Pages DNS A/AAAA records and live TLS SANs for the custom domain; deployment fails if mismatched. Evidence is saved under `output/ops/DNS-SSL-GUARD-<timestamp>/`.

## VS Code setup

- Recommended extensions: Live Preview (Microsoft), Prettier, HTML CSS Support, Webhint, axe Accessibility Linter, GitHub Actions.
- Editor defaults live in `.vscode/settings.json` (auto-save after delay, Prettier on save, Emmet Tab expansion).
- For live preview with auto-reload: Install the Live Preview extension, right-click any HTML file, and select "Show Preview".

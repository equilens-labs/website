# Equilens Website

Static site for Equilens FL‑BSA. Deployed via GitHub Pages from `main`.

- Content: HTML/CSS only, root directory
- Brand assets: source files live under `docs/brand/`; runtime copies under `assets/brand/`
  - Includes `wordmark.svg`, `wordmark_text.svg`, `wordmark_outlined.svg`, `tokens.json`, and `press-kit.json`
  - Social preview art: `assets/brand/og-default.svg` and generated `assets/brand/og-default.png`
- Automation scripts: `scripts/seo/*`, `scripts/og/render.sh`, and `scripts/evidence/snapshot.sh`
- Icon generation: `scripts/icons/generate.py` produces Apple/PWA icons in `assets/brand/`
- Additional hardening: `404.html`, `.well-known/security.txt`
- Custom domain: set via `CNAME`
- Workflows: `.github/workflows/pages.yml` (deploy) and `.github/workflows/audit.yml` (links/a11y/Lighthouse reports)
- Evidence: `output/ops/BRAND-IMPL-001/` and `output/ops/BRAND-IMPL-002/` store hash manifests for brand rollout phases

Local preview: `python3 -m http.server` and open http://localhost:8000

## Deployment automation

- Pushes to `main` keep the site private (`noindex` / `Disallow: /`).
- Trigger `Deploy website to GitHub Pages` manually with `visibility=public` once you are ready to open indexing; rerun with `visibility=private` to revert.
- Each deployment run renders the OG PNG and writes evidence snapshots under `output/ops/SITE-DEPLOY-<timestamp>/`.

## VS Code remote setup

- Install the Remote Development pack and enable automatic reconnects for unstable links.
- Recommended extensions: Live Preview (Microsoft), Live Server, Prettier, HTML CSS Support, CSS Peek, Webhint, axe Accessibility Linter, GitHub Actions.
- Editor defaults live in `.vscode/settings.json` (auto-save after delay, Prettier on save, Emmet Tab expansion).
- Run `Serve: Local preview` from `Tasks: Run Task…` to launch the bundled `python3 -m http.server` watcher on port 8000.

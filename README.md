# Equilens Website

Static site for Equilens FL‑BSA. Deployed via GitHub Pages from `main`.

- Content: HTML/CSS only, root directory
- Brand assets: source files live under `docs/brand/`; runtime copies under `assets/brand/`
- Custom domain: set via `CNAME`
- Workflow: `.github/workflows/pages.yml`

Local preview: `python3 -m http.server` and open http://localhost:8000

## VS Code remote setup

- Install the Remote Development pack and enable automatic reconnects for unstable links.
- Recommended extensions: Live Preview (Microsoft), Live Server, Prettier, HTML CSS Support, CSS Peek, Webhint, axe Accessibility Linter, GitHub Actions.
- Editor defaults live in `.vscode/settings.json` (auto-save after delay, Prettier on save, Emmet Tab expansion).
- Run `Serve: Local preview` from `Tasks: Run Task…` to launch the bundled `python3 -m http.server` watcher on port 8000.

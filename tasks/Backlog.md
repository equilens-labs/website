# Backlog (equilens.io website)

**Last updated:** 2026-02-14  
**Purpose:** Single list of pending website work for `equilens.io` (content, deployment, audits). Keep this file short; link out to `tasks/Legal*.md` and source files for details.

**Priority legend:** P0 = blocking / fix before launch, P1 = soon / high leverage, P2 = later / opportunistic.

## Current Production Snapshot (Facts)

- Live site footer shows last deploy **2026-02-14** (commit `b3af8e9`).
- GitHub Pages is configured in **branch mode** (serving from `gh-pages`).
- `audit.yml` succeeded on the same SHA as the latest deploy.

## P0 (Launch Blockers)

- [x] **Fix deploy workflow mismatch (branch-mode Pages)**
  - Problem: `pages.yml` "build" job performs SEO toggles + sitemap + OG + PDF render, but the branch-mode publish job re-checks out and only runs `scripts/deploy/prepare.sh`, so those build steps never ship.
  - DoD:
    - One deploy path produces the final `dist/` (including visibility toggles + sitemap + OG renders + PDFs if intended) and publishes exactly that output to `gh-pages`.
    - `workflow_dispatch visibility=private|public` produces the expected production behavior (robots + meta robots + sitemap).
  - Refs: `.github/workflows/pages.yml`, `scripts/deploy/prepare.sh`, `scripts/seo/*`, `scripts/og/render.sh`.

- [x] **Indexing posture: decide private vs public, then enforce**
  - Problem: production indexing posture previously drifted from the intended "private-by-default" behavior.
  - DoD:
    - Default visibility mode is explicitly chosen and enforced on push-to-main and manual deploys.
    - `robots.txt`, meta-robots tags, and `sitemap.xml` are consistent with the chosen posture.
  - Refs: `README.md`, `robots.txt`, `scripts/seo/set-indexing.py`, `scripts/seo/toggle-robots.sh`.

- [x] **Broken FL-BSA downloads (404): Whitepaper + Example Report**
  - Problem: `/fl-bsa/` links to PDFs that do not exist in the deployed tree.
  - DoD:
    - Both links resolve (HTTP 200) or the CTAs are removed/disabled until ready.
    - Prefer stable public-release URLs (see FL-BSA repo guidance) instead of committing large binaries here, unless there is a deliberate reason to host locally.
  - Refs: `fl-bsa/index.html`, FL-BSA repo `docs/development/ci-cd.md` ("Release assets (website-linkable)").

- [x] **Robots points at missing sitemap**
  - Problem: production previously advertised a sitemap in `robots.txt` while `sitemap.xml` was missing (404).
  - DoD:
    - Either publish a valid `sitemap.xml` when public OR remove the sitemap line when no sitemap is shipped.
    - `curl -I https://equilens.io/sitemap.xml` matches intended behavior for the chosen visibility mode.
  - Refs: `robots.txt`, `scripts/seo/gen-sitemap.py`.

- [x] **Fix invalid JSON-LD on `/fl-bsa/` (SEO structured data)**
  - Problem: FAQ JSON-LD includes an HTML comment inside the JSON, making it invalid.
  - DoD:
    - JSON-LD blocks are valid JSON (parseable) and pass basic linting.
  - Refs: `fl-bsa/index.html`.

- [ ] **Legal: EU GDPR representative is still a placeholder**
  - Problem: Privacy Notice says "EU GDPR Representative: To be appointed."
  - DoD:
    - Replace placeholder with actual representative details OR (if not applicable) adjust the claim and ensure legal counsel is aligned.
  - Refs: `legal/index.html`, `tasks/Legal3.md`, `tasks/Legal4.md`.

- [x] **Contact page functionality vs CSP**
  - Problem: pages set CSP `script-src 'self'`, but `/contact/` relies on an inline `<script>` (likely blocked in modern browsers).
  - DoD:
    - Contact flow works with the deployed CSP (recommended: move inline JS into a same-origin script under `assets/`).
  - Refs: `contact/index.html`.

- [x] **Fix failing accessibility audit (Pa11y)**
  - Problem: home page uses obsolete `<center>` markup; Pa11y CI fails.
  - DoD:
    - `pa11y-ci --config ops/pa11yci.json` passes locally and in `audit.yml`.
  - Refs: `index.html`, `ops/pa11yci.json`, `.github/workflows/audit.yml`.

## P1 (Soon / High Leverage)

- [ ] **Decide what content should be publicly published**
  - Problem: `scripts/deploy/prepare.sh` copies most of the repo into `dist/` (including `SSoT.md`, `AGENTS.md`, `.vscode/`, `ops/`, `tests/`, `package*.json`, etc.).
  - DoD:
    - Explicit allowlist for what ships, or explicit decision that publishing these files is acceptable (and keep them polished for public consumption).
    - If `SSoT.md` is intentionally public, ensure it is a canonical, launch-grade document (no draft/preface text) and aligned with the FL-BSA repo SSOT.
  - Refs: `scripts/deploy/prepare.sh`.

- [ ] **Deployment gating policy: don't deploy when audits fail**
  - Problem: `audit.yml` can fail while `pages.yml` deploy still succeeds, so production can drift into a known-bad state (a11y/SEO/regression).
  - DoD:
    - Define and implement a policy: either make deploy depend on audits, or explicitly document why deploy can proceed with known audit failures.
  - Refs: `.github/workflows/audit.yml`, `.github/workflows/pages.yml`.

- [ ] **Truth sync: FL-BSA performance claims and SSOT**
  - Problem: `/fl-bsa/` claims "~12 minutes for ~1M rows" but canonical SSOT treats 1M+ as long-running/capacity-planning.
  - DoD:
    - Website claims match canonical SSOT and/or validated public baselines; no over-promising.
  - Refs: `fl-bsa/index.html`, FL-BSA repo `SSoT.md` and `docs/technical/performance.md`.

- [ ] **Truth sync: Trust Center claims vs shipped controls**
  - Problem: Trust Center makes concrete security claims (seccomp/AppArmor, KMS/Secrets Manager, read-only) that must match what we actually ship/support in FL-BSA.
  - DoD:
    - Each claim is backed by shipped configuration/docs, or is softened to "supported / available options" with clear scoping.
  - Refs: `trust-center/index.html`, FL-BSA repo `docs/security/*`, deploy configs.

- [x] **Fix CSS font loading vs CSP + privacy posture**
  - Problem: `assets/eql/base.css` imports Google Fonts, but CSP `style-src 'self'` blocks it and it adds third-party requests.
  - DoD:
    - Either self-host fonts (preferred for CSP/privacy) or remove/replace the import and use local/system fonts.
  - Refs: `assets/eql/base.css`.

- [x] **Expand audits to cover FL-BSA and Trust Center pages**
  - Problem: `ops/pa11yci.json` and `ops/lighthouserc.json` only cover `/`, `/contact/`, `/legal/`.
  - DoD:
    - Add `/fl-bsa/` and `/trust-center/` (at minimum) to a11y/Lighthouse sweeps.
  - Refs: `ops/pa11yci.json`, `ops/lighthouserc.json`, `.github/workflows/audit.yml`.

- [ ] **Align procurement/pricing language with actual Marketplace reality**
  - Problem: procurement page claims "Annual and multi-year licensing options" and "Pilot tier (3-month)" which must match the actual AWS Marketplace listing/strategy.
  - DoD:
    - Copy matches the live listing(s) and commercial motion; no implied SKUs that are not real.
  - Refs: `procurement/index.html`, `tasks/Legal4.md`.

## P2 (Later / Opportunistic)

- [ ] **Bring Playwright audit configuration in sync with real routes**
  - Problem: `config/tests/playwright-pages.json` references paths that do not exist (e.g., `/fl-bsa/whitepaper/`, `/fl-bsa/pricing/`), so audits will drift or provide false confidence.
  - DoD:
    - Either create real routes for those paths OR adjust the config to match the actual site information architecture.
  - Refs: `config/tests/playwright-pages.json`, `tests/site.spec.ts`, `scripts/ops/run_playwright_audit.sh`.

- [ ] **README accuracy pass**
  - Problem: README claims deployment "from main" and a visibility strategy that does not match current Pages branch-mode behavior; it also references missing config files (e.g., `config/web/flbsa_subnav.json`).
  - DoD:
    - README matches the actual deploy mode, visibility controls, and config structure.
  - Refs: `README.md`, `.github/workflows/pages.yml`, `config/web/`.

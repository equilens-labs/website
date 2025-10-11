# Blocks 4 & 5 Implementation Summary

## Scope
- **Block 4** introduced automated quality gates (link, accessibility, Lighthouse audits), HTML-level security controls, enhanced navigation/globals, and PWA-compatible icons.
- **Block 5** populated the static site with full product/trust/pricing content, aligning with our SSOT copy, and preserved evidence trails.

## Block 4 Highlights
1. **Quality workflow** (`.github/workflows/audit.yml:1`)
   - Runs on PRs and pushes to `main`.
   - Steps: checkout → lightweight HTTP server → Lychee link check (`ops/lychee.toml:1`) → Node 20 setup → Pa11y CI (`ops/pa11yci.json:1`) → Lighthouse autorun (`ops/lighthouserc.json:1`) → artifact upload (reports).
   - Non-blocking; Lighthouse asserts only warn if perf/accessibility scores drop below thresholds.
   - Artifacts capture Markdown link summary, Pa11y JSON, Lighthouse data (`.lighthouseci/`).

2. **Security metas & navigation (all pages)**
   - Added `Content-Security-Policy`, `referrer` meta, CSS preload, and PWA links to head elements.
   - Introduced skip links (`.skip-to-content`) and consistent `id="main"` anchors for keyboard navigation.
   - Ensured new nav exposes Product, Trust Center, Pricing (Block 5 later provided targets).

3. **CSS enhancements (`assets/base.css:1`)**
   - Added `.brand-logo` class, skip-link utilities, `:focus-visible` styling, and `@media (prefers-reduced-motion: reduce)` override.
   - Prepared layout primitives: `.section`, `.grid`, `.span-*`, `.card`, `.kpi`, `.badge`, `.checks` for use in content fill.
   - Adjusted brand pill text color to meet AA contrast standards on accent background.

4. **PWA icons**
   - Script `scripts/icons/generate.py:1` (Pillow, Lanczos scaling) creates `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` from the 1024px white logo.
   - `site.webmanifest:1` references the generated icons; head updated to include `<link rel="apple-touch-icon">` and `<link rel="manifest">`.

5. **Trust/404/Security**
   - `404.html:1` adds a minimal branding page with skip link and year script.
   - `.well-known/security.txt:1` publishes contact/policy data.

6. **Evidence**
   - Block 4 didn’t require new evidence beyond existing manifests; actions workflows provide artifacts that can be downloaded per run.

## Block 5 Highlights
1. **Home page (`index.html:1`)**
   - Updated hero copy, bullet list, CTA, and sections (“How it works”, “Designed for regulators”, “Why teams choose Equilens”, “Next steps”).
   - Navigation extended to include new static routes.

2. **New sections**
   - `product/index.html:1`: describes architecture, dual-branch calibration, synthetic generation, evidence bundle, observability, input scenarios, target roles.
   - `trust-center/index.html:1`: security/compliance artifacts, operational controls, networking, contact details, evidence chain.
   - `pricing/index.html:1`: sandbox/pilot/growth/enterprise tiers with bullet features and CTA back to contact.

3. **Contact & Legal**
   - `contact/index.html:1` instructs prospects what to include when emailing; nav synced with new structure.
   - `legal/index.html:1` retains placeholder list but uses consistent layout/skip link.

4. **CSS Utilization**
   - Block 4 utilities used across new pages (cards, grids, KPIs, badges, checklists).
   - Layout remains pure HTML/CSS, no JS beyond year script.

5. **Evidence**
   - `output/ops/BLOCK-5-CONTENT-20251011200304Z/` (manifest list + hashes) records the state of key brand/content files post-block.

6. **Workflows**
   - Deploy workflow (Block 3) handled deployments; Block 4 `audit.yml` now produces Pa11y/Lighthouse evidence on this content.

## Testing & Validation
- `python3 scripts/icons/generate.py` run after Block 4 modifications.
- `scripts/evidence/snapshot.sh "BLOCK-5-CONTENT"` executed for Block 5; manifest lists missing `sitemap.xml` (expected due to private mode).
- `python3 -m http.server` used locally to verify new routes and A11y additions.
- `gh run view` confirmed both deploy and audit workflows pass with new copy (Pa11y contrast issue resolved by adjusting pill text color).

## Dependencies & Notes
- Pa11y/Lighthouse actions rely on Node 20.11.1 and the global npm installs specified in the workflow.
- PIL/Pillow is required for `scripts/icons/generate.py` (installed automatically in GH-run environment; locally ensure `pip install pillow`).
- Content changes maintain `noindex`/`Disallow: /` stance until Block 5 launch readiness tasks (see Block 5 follow-ups).

## Next Considerations
- Structured data (JSON-LD) and CDN security headers ready for inclusion when public toggle flips (Block 6 follow-up).
- Future evidence snapshots should increment `output/ops/SITE-DEPLOY-*` or create new tags to retain change history.
- Audit workflow output is available via GitHub Actions artifacts; download for compliance documentation if needed.

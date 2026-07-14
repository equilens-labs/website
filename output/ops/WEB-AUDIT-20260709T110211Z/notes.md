# WEB-AUDIT-20260709T110211Z — full website audit pass

Branch: `web-audit-pass-20260709`. Scope: presentation + content audit of the
public website, cross-checked against canonical sources
(`repos/fl-bsa/SSoT.md` 2026-06-12, `fl-bsa-gtm-private/CLAIMS_REGISTER.md`,
`OFFERS/OFFER_LADDER.md`, `CHANNELS/WEBSITE.md`, `SOURCE_TRUTH.md`).

## Verified healthy (no change)

- `v5.0.0-rc9-public-fix-2724455` remains the correct public artifact
  reference; claims register forbids citing `v5.0.0` until the
  customer-handoff readiness packet merges.
- No banned claims on any page (no "certified"/GA/CTGAN/marketplace-live);
  no pricing figures (per CHANNELS/WEBSITE.md rule).
- Port claims (8080 API, 9090 Prometheus) match
  `repos/fl-bsa/docker-compose.prod.yml`.
- `fl-bsa/trust-root.json` sha256
  `256280436bd13c079fb04327c11137583c6aa4d8fc106d75654052746e65dee4`
  matches the value published on /trust-center/ and /fl-bsa/whitepaper/.
- All 11 distinct external links return HTTP 200 (LinkedIn returns 999 =
  bot-block, expected).
- Source `robots.txt` `Disallow: /` is intended private-by-default posture;
  deploy flips public + sitemap (pages.yml default since 2026-06-10).
- "fair-lending/EEA equality laws" wording is verbatim counsel draft
  (`tasks/Legal.md:111`) — retained.
- Performance figures in the FAQ match SSoT §6.1.

## Changes in this pass

1. `/fl-bsa/` JSON-LD FAQ deployment answer aligned to visible FAQ
   ("AMI-first AWS customer path").
2. Contact interest label "Evidence-readiness assessment" (hyphenation
   aligned with SSoT §9.1 and /fl-bsa/#pricing).
3. `fl-bsa/{faq,legal,pricing}/index.html` redirect stubs rewritten to the
   tested policy-metadata pattern (proper titles, descriptions, fragment
   og:url/twitter:url); added to `flbsaRedirectMetadata` in tests.
4. Home hero cards: icons moved out of `<h3>` (fixes broken two-column
   squeeze at <768px; see before/ vs after/ screenshots) and icon↔concept
   mapping aligned with /fl-bsa/ (refresh=Outcome Simulation,
   doc-check=Evidence Packs, cloud=Customer-Hosted).
5. Website `SSoT.md` refreshed verbatim from canonical
   `repos/fl-bsa/SSoT.md` (2026-06-12); see SSOT-SYNC-20260709T110857Z.
6. Footer system reconciliation: `templates/footer.html` +
   `config/web/footer.json` + `scripts/content/sync_footer_ssot.py` now emit
   the sr-only "Site sections" heading and the claims-register mandatory
   product-boundary disclaimer on every page (was 1/10 pages each); sync
   script now skips `output/` and `dist/` (evidence-integrity guard); sync
   executed across all 10 page footers; Playwright assertions extended.
7. README/CONTRIBUTING corrected to actual mechanisms (runtime nav.js;
   footer sync; removed phantom `fl-bsa.css`, `sync_flbsa_subnav.py`,
   `flbsa_subnav.json`, `scripts/archive/legacy-sync/`, og-1200x600
   references); `scripts/evidence/snapshot.sh` hash list repointed at real
   files.

## Verification results

- Playwright: 192/192 passed (chromium desktop/mobile/tablet-768/tablet-1024).
- `scripts/ops/content_lint.sh`: PASS.
- `scripts/ops/check_footer_metadata.sh`: PASS.
- `sync_footer_ssot.py` idempotent (second run produces no further diff;
  `output/` untouched).
- `gen-sitemap.py`: 8 canonical URLs; rewritten stubs remain excluded
  (meta-refresh preserved).

## Flagged, not changed (follow-ups for owner decision)

- Deploy workflow not gated on audit workflow (repo backlog P1); Playwright
  suite not run in CI; Lighthouse budgets warn-only.
- Home hero CTAs carry no Plausible event classes; procurement
  "Review Trust Center" fires `Security Pack Click` (deliberate in PR #61/#62
  taxonomy — left unchanged).
- security.txt expires 2026-12-31 — renew before year-end.
- Light-only theme (dark tokens unused) — deliberate.

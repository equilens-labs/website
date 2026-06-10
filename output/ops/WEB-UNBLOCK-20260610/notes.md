# WEB-UNBLOCK-20260610 — Evidence Notes

Ticket: indexing unblock + rc9 public-fix re-pointing + audit quick wins + whitepaper landing page.
Branch: `web-unblock-rc9-20260610`. Date: 2026-06-10.

## Basis

Four-lens independent audit (visual w/ rendered screenshots; content/claims; technical/a11y/links;
buyer journey) run 2026-06-10. Headline grades: T A-, C B-, V B-, D C+. This change set implements
the claims corrections, pre-indexing quick wins, release re-pointing, and the whitepaper landing
page. Larger builds (partners page, architecture diagram, verify-walkthrough page, vendor pack,
static-nav bake) are deliberately deferred to a follow-up branch.

## Source verification

- rc9-public-fix release assets verified live before re-pointing (HEAD 302→200):
  whitepaper.pdf, customer_report.pdf, gold_bundle.zip, WhitePaper_Intake_Bundle_v4.zip,
  SHA256SUMS.txt, manifest.json at
  `https://github.com/equilens-labs/fl-bsa-pub/releases/tag/v5.0.0-rc9-public-fix-2724455`.
- Served trust root `/fl-bsa/trust-root.json` SHA-256 verified (repo + live):
  `256280436bd13c079fb04327c11137583c6aa4d8fc106d75654052746e65dee4` — now printed on the
  Trust Center and whitepaper pages with "verify out of band" instruction.
- Release wording aligned to source truth: `v5.0.0-rc9-public-fix-2724455` described only as
  "public technical-proof reference (non-commercial prerelease)".

## Validation run on this branch

- `scripts/ops/content_lint.sh`: PASS (exit 0).
- Residual `rc8.4` references in HTML: 0.
- Claims sweep over changed pages (GA / live scoring / model validation service / certified
  compliance / regulator-approved / marketplace-live patterns): no non-negated hits.
- `scripts/seo/gen-sitemap.py` dry run after stub-exclusion fix: 8 URLs — exactly the canonical
  pages (/, /fl-bsa/, /fl-bsa/whitepaper/, /trust-center/, /procurement/, /contact/, /legal/,
  /press/); all 13 meta-refresh stubs excluded.
- Local render check (Playwright, 1440px): home hero headline and /fl-bsa/whitepaper/ landing page
  render correctly with site styling.

## Deploy behaviour change (deliberate)

`pages.yml` default visibility flipped `private` → `public`: pushes to `main` now deploy with
indexing allowed (robots Allow + sitemap + no injected noindex). Manual dispatch with
`visibility=private` remains available to re-hide. The whitepaper-stub→PDF render step was removed
(it published a junk redirect-page PDF at a guessable URL).

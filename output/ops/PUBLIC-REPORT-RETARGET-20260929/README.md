# Corrected public report retarget — 2026-09-29

Scope: retarget the seven existing public sample-report links to the corrected,
report-only immutable prerelease. Existing campaign messaging and the separately
held whitepaper/intake links remain unchanged. Release-coordinate labels and
visible page-count and file-size metadata now match the corrected 17-page,
239223-byte report. No Gold, robustness, product, or `releases/latest` link is
added.

- Release tag: `v5.0.8-report-fix-20260929`
- Release ID: `399150186`
- Release page: <https://github.com/equilens-labs/fl-bsa-pub/releases/tag/v5.0.8-report-fix-20260929>
- Report: <https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.8-report-fix-20260929/customer_report.pdf>
- Expected size: `239223` bytes
- Expected SHA-256: `8209216fa746ff8985dd3ad70d46b8bc0eeed7ad39393fffc6dfdefe64d0cf76`

Local validation must confirm exactly seven corrected report hrefs in deployable
HTML, zero stale `v5.0.8/customer_report.pdf` hrefs, zero Gold hrefs, and no
`releases/latest` hrefs. Production validation repeats those checks after the
audited `main` deployment.

## Local verification

- GitHub release API: release `399150186` is immutable, non-draft, and a
  prerelease with exactly `customer_report.pdf`, `manifest.json`, and
  `SHA256SUMS.txt`.
- Anonymous release page and report download: HTTP `200` on 2026-09-29.
- Downloaded report: `239223` bytes, 17 pages, SHA-256
  `8209216fa746ff8985dd3ad70d46b8bc0eeed7ad39393fffc6dfdefe64d0cf76`.
- `scripts/deploy/prepare.sh`: pass.
- `python3 scripts/ops/check_public_demo_links.py dist`: pass.
- `npm run content:lint`: pass.
- `npm run lint:html`: pass across 24 deployed HTML files.
- `npm test`: 440 passed across desktop, mobile, and two tablet viewports.
- Post-review focused Playwright run covering every page render plus the paid
  evidence CTA: 68 passed across desktop, mobile, and two tablet viewports.

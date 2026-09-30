# v5.0.8 technical-whitepaper retarget — 2026-09-30

Scope: replace the website's retained RC9 whitepaper and standalone intake
offer with the reviewed full FL-BSA v5.0.8 technical paper and its bounded
verification companion. Keep all seven campaign/sample-report links pinned to
the separate corrected report-only release. No Gold, product artifact, mutable
`latest`, customer-evidence, production-utility, certification, regulator, or
Marketplace/GA claim is added.

## Published technical release

- Tag: `v5.0.8-technical-whitepaper-20260930`
- Release ID: `400385791`
- Release page:
  <https://github.com/equilens-labs/fl-bsa-pub/releases/tag/v5.0.8-technical-whitepaper-20260930>
- Published: `2026-09-30T19:49:10Z`
- GitHub state: immutable, non-draft prerelease with exactly four assets
- Paper:
  <https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.8-technical-whitepaper-20260930/whitepaper.pdf>
  — `956402` bytes, 21 pages, SHA-256
  `374fe04edf52359976170f4115762b6b11d90fdc21cb340f3de73749eaebb736`
- Companion:
  <https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.8-technical-whitepaper-20260930/fl-bsa-v5.0.8-technical-companion.zip>
  — `103130` bytes, seven members, SHA-256
  `b110cfa4ccf61a029b71cb0d8b4e963c9effae8761c6b16670ca7f1ac25abb2d`
- Release sidecar:
  <https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.8-technical-whitepaper-20260930/whitepaper_release.json>
  — `3147` bytes, SHA-256
  `8396eceb05e7211264d76928853504c04b3268f2bae180f5245e8f44324fc980`
- Checksums:
  <https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.8-technical-whitepaper-20260930/SHA256SUMS.txt>
  — `275` bytes, SHA-256
  `ab9ae86965626373839fe144072ae0702eb6969eb38d2d7ed493682e50656bb5`
- Public provenance:
  <https://github.com/equilens-labs/fl-bsa-pub/blob/main/PROVENANCE.md#v508-technical-whitepaper-20260930>

The immutable source sidecar records the source-build state before public
distribution. The later exact-byte authorization, reviewed dry-run, public
release, and closed publication gates are recorded in public `PROVENANCE.md`.
The site links both records so that the source history is not rewritten or
misrepresented as the later publication decision.

## Preserved report release

All campaign and sample-report links remain on:

<https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.8-report-fix-20260929/customer_report.pdf>

The fresh anonymous download returned HTTP `200`, `239223` bytes, and SHA-256
`8209216fa746ff8985dd3ad70d46b8bc0eeed7ad39393fffc6dfdefe64d0cf76`.
No website link promotes the withdrawn v5.0.8 Gold bundle.

## Local verification

Checked from website base commit `2c5c541` at `2026-09-30T20:10:31Z`:

- All four exact technical-release asset URLs and the release page returned
  HTTP `200` without authentication.
- Fresh asset downloads matched GitHub's asset sizes and digests;
  `sha256sum -c SHA256SUMS.txt` passed for the PDF, companion, and sidecar.
- `pdfinfo` reported 21 pages.
- The extracted `verify_public_technical_companion.py` verified the downloaded
  seven-member companion, product commit, 40/40 robustness rows, and
  `customer_evidence_eligible=false`.
- `npm run content:lint`: pass.
- `npm run lint:html`: pass; 24 deployed HTML files and the public-demo link
  contract passed.
- Full Playwright pass before the final test wording correction: 468/472
  passed across desktop, phone, and two tablet viewports; the four failures
  were the same newly added overly literal text assertion.
- Corrected focused Playwright test: 4/4 passed across all four viewports.
- Full-page desktop and mobile renders of `/fl-bsa/whitepaper/`, plus the
  desktop `/fl-bsa/` render, were visually reviewed. The new labels, long tag
  and verifier filename wrap within their containers; no clipping or overlap
  was observed.

The pull-request audit is expected to rerun the complete browser suite and the
external link checker before deployment.

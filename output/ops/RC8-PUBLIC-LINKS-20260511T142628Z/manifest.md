# RC8 Public Link Readiness Note

Date: `2026-05-11`

## Intent

Record the post-merge public-link pass for the `v5.0.0-rc8` public artifacts after:

- `equilens-labs/fl-bsa-pub#3`
- `equilens-labs/website#32`

## Observations

- Live `/fl-bsa/` exposes explicit `v5.0.0-rc8` links for `whitepaper.pdf`,
  `customer_report.pdf`, and the `fl-bsa-pub` RC8 tag page.
- Live `/procurement/` exposes explicit `v5.0.0-rc8` links for `customer_report.pdf`,
  `manifest.json`, and `SHA256SUMS.txt`.
- Live `/trust-center/` exposes the explicit `v5.0.0-rc8` public-artifact release link.
- Live footer deploy metadata on `/fl-bsa/` and `/procurement/` reads:
  `Last deploy 2026-05-11 (commit ac9784e)`.
- GitHub release metadata for `equilens-labs/fl-bsa-pub` now has no stable latest release:
  all visible public-artifact releases are marked prerelease, `gh release view` returns
  `release not found`, and `/releases/latest` redirects to `/releases`.

## Operating Note

Use explicit tag links for RC8 public artifacts. Do not use GitHub `/latest` for RC8 while RC8
remains a prerelease.

The remaining upstream follow-up issues are not all RC8 blockers:

- RC8 hygiene if refreshing assets: uniform demo watermark and SHA256SUMS publish verification.
- Future schema/hardening: `public.artifacts.v3` disposition metadata.
- Repo hygiene: `fl-bsa-pub` LICENSE.
- Next public-copy revision: soften `regulator-ready` wording.

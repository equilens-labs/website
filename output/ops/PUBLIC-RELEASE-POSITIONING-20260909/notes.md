# Public-release positioning alignment

Date: 2026-09-09 UTC

## Intent

Restore the programme boundary across the public product, procurement, and contact surfaces: full
public stable release is the FL-BSA destination, while any pre-release controlled
evaluation or private handoff is optional, separately approved, and not a release gate or substitute
for public release.

## Anchors and boundaries

- Website base: `dfd9d30fc90340446cf44a6413a83ec5cac3bb76` (merged website PR #78).
- Product engineering ledger review head: `d2526bc01905cf0f0b6b7bd1e802011a1f297c6c`.
- Product PR #1738 passed its exact-head hosted checks and squash-merged as
  `46539e54322f9433d6b00255e11ca5dda08351d4` at 2026-09-09T06:30:38Z. Its merged tree
  `5a4f7c762f0bcf239c3de9067679ff68fd1eced6` exactly matches the reviewed PR tree.
- Canonical product truth is corrected by product PR #1739. The stale, partial website-local
  `SSoT.md` mirror is removed so it cannot remain a second authority; the website README points
  maintainers to the canonical product source instead.
- Product implementation anchor at review start:
  `3d65db3f01b389dfba5dd4e116a5e709c09461d6`.
- The public demo remains the non-commercial prerelease
  `v5.0.0-rc9-public-fix-2724455`.
- This change does not claim that a stable release, public AWS Marketplace listing, customer
  delivery route, or publication date exists.
- The existing paid-campaign route key, analytics identifiers, anchor, and machine-readable
  `Controlled FL-BSA Pilot` interest are retained for attribution and inbound-link compatibility.
  Visible page, form, default-message, email-body, and email-subject text maps that legacy identity
  to an optional pre-release evaluation.
- The changed campaign/contact JavaScript uses a new shared `20260909a` asset token so cached old
  scripts cannot recreate pilot-oriented email text under the new page copy.
- Deployment and runtime wording is grounded in product SSoT sections 1.3 and 6: AMI access is not
  presented as a standing current path, and the selected native v5 runtime is CPU-based rather than
  GPU-preferred.

## Verification

- `npm run content:lint`: passed. The lint now self-tests both
  ASCII-hyphen and en-dash forms of the stale singular `~20-25 minute range` claim.
- `npm run lint:html`: passed across 22 deployed HTML files.
- Pre-review focused assertion rerun after updating renamed labels: 8/8 passed across four
  viewports.
- Final Playwright site audit: 312/312 passed in 3.6 minutes with zero skipped, unexpected, or flaky
  tests. It covers stable campaign routing with evaluation-oriented body/subject text, the release
  section ordered before optional evaluation, removal of the website SSoT fork, section banding,
  and accessibility.
- After the cache-busting token fix, the 12 directly affected asset-identity and CTA-to-email tests
  passed again across desktop, mobile, and both tablet viewports.
- Final desktop and mobile product captures were inspected; release and access now precedes the
  optional evaluation, and the changed copy remains readable without clipping or broken layout.
- Two independent reviews, one independent consolidation, and final judge verification of the exact
  reviewed tree remain required before merge.
- Normal same-commit website audit/deploy gates remain required; no manual audit bypass.

# Documentation and task consolidation evidence

Date: 2026-09-30
Base commit: `ada886fe918095e4276b7caf273606471325807b`

Scope:

- replace the completed shadow backlog with an issue-only live queue;
- preserve the former backlog byte-for-byte under `tasks/ARCHIVE/`;
- label historical brand/legal working inputs as non-authoritative; and
- document the role and retention rules for `output/ops/` evidence.

Validation:

- `npm ci`: passed;
- `npm test`: 472 Playwright checks passed across desktop, mobile and tablet profiles in 5.3 minutes;
- `git diff --check`: passed; and
- latest pre-change exact-main audit, deploy and Pages runs for base commit: passed.

This change does not alter deployed HTML, CSS, JavaScript, assets, redirects, workflows, legal copy,
product claims or campaign routing.

# GTM Alignment RC8.4 Website Pass

Timestamp: `2026-05-19T12:15:00Z`

## Intent

Align the public website with the current GTM frame:

- category: self-hosted fair-outcomes evidence for regulated credit decisions;
- current controlled-pilot product reference: `v5.0.0-rc8.4`;
- pinned public demo artifacts remain synthetic/demo-only `v5.0.0-rc8` release assets;
- avoid production, certification, regulator-ready, audit-ready, and stale appliance-category wording.

## Local Validation

- `npm run content:lint`
- `git diff --check`
- Local HTTP smoke check for `/`, `/fl-bsa/`, `/procurement/`, and `/trust-center/`

## Live Deployment Check

Read-only checks against the current deployed site before this PR was merged:

- GitHub Pages API reported `status: built`, `cname: equilens.io`, `https_enforced: true`,
  and source branch `gh-pages`.
- `https://equilens.io/` returned HTTP `200`.
- Live footer reported last deploy `2026-05-19` at commit `16b7112`.
- Live deployment still emitted `noindex, nofollow` and `robots.txt` with `Disallow: /`,
  matching the current push-default private visibility mode.

## Deployment Note

This manifest records pre-merge validation. The updated public copy deploys only after the PR merges
to `main` and the existing GitHub Pages workflow completes.

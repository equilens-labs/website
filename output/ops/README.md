# Website Operations Evidence

This directory contains reproducible website audit, screenshot, deployment, legal-publication,
DNS/TLS and regression evidence. It is evidence storage, not a task queue or a source of current
product, legal, release, campaign or deployment truth.

## Current-state rule

- Current source is `main`.
- Current production is the commit recorded by the latest successful `Deploy website to GitHub
  Pages` run.
- Current pending work is the open GitHub issue queue.
- Dated folders are historical receipts. Text such as “current,” old release URLs, or a deployment
  SHA inside one folder applies only to that capture.

## Retention

Keep tracked manifests, hashes, legal-publication receipts, deployment receipts, and evidence named
by a PR, workflow, issue, release record, or incident. Generated screenshots, browser traces,
Playwright outputs, and repeated local captures may be removed only after a dated inventory proves
that they are ignored/untracked, unreferenced, and not the sole receipt for a material decision.

Do not bulk-delete this directory by age. First record path, tracked/ignored state, size, reference,
and proposed disposition. Preserve tracked history through Git even when a later reviewed cleanup
removes redundant generated material.

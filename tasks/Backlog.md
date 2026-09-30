# Website Work Queue

**Last reviewed:** 2026-09-30

GitHub issues are the only live website execution queue. This file is a short pointer and must not
repeat completed checklists, deployment SHAs, legal drafts, or product truth.

## Current work

- [Open website issues](https://github.com/equilens-labs/website/issues?q=is%3Aissue+is%3Aopen) are
  the live task list. This pointer deliberately does not copy issue numbers, titles or counts.

Pull requests record implementation and review state; they do not replace the issue queue.

## Current deployment

Use the latest successful `Deploy website to GitHub Pages` run and its recorded deployed commit as
production truth. Do not pin a mutable “latest deployed SHA” in this task file. A newer `main`
commit is not production until its required exact-main audit and deployment complete successfully.

Product, release, public-artifact and GTM truth remain in their owning repositories. Website tasks
must link those sources rather than copy changing status.

## Historical inputs

- The completed former backlog is retained at
  [`ARCHIVE/Backlog-completed-through-20260819.md`](ARCHIVE/Backlog-completed-through-20260819.md).
- `Brand.md` and `Legal.md` through `Legal4.md` are historical working inputs. Their banners identify
  them as non-authoritative; the live site plus the open issue queue control current website legal
  state.
- Evidence captures remain under `output/ops/` and follow its retention/index rules.

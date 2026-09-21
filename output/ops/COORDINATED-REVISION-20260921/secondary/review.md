# Supporting-page revision review

**Verdict: accepted for the proposed PR from this review scope.** The composed revision is a substantial improvement. Both findings raised during review have been corrected and the affected final renderings checked. No blocking visual or shared-navigation issue remains in this scope.

This is an independent inspection of the rendered local build, not acceptance based only on changed CSS. I inspected Legal, Trust Center, Procurement, Whitepaper, Press, and the readiness note at **1280×960**, **768×1024**, and **375×812**, including full-page views and close views of lower sections. All 18 normal-size captures have no horizontal overflow or JavaScript page errors, and visible images loaded.

The browser runner is `render-review.cjs`; the root agent executed it after the child process encountered a sandbox/approval boundary. I personally viewed the generated images and inspected the rendered measurements and interaction results. After inspecting all 18 page/viewport combinations and full-page compositions, I reinspected the final corrections to mobile navigation and the whitepaper list. The accepted final corpus was captured **2026-09-21 15:54:57–15:55:17 UTC**, with CSS SHA-256 `b7b7462b4f0e96dbf543641221a1df696f98a7b7c1cf0c4fe8647560457b41f2` and nav SHA-256 `180a4cb825632e6d903e7301cdabbfd7cf41f8e22f76c8a5706d4da205ad73fe`.

## Findings resolved during review

**SR-01 / P2 — Mobile contents landing after closing Menu: resolved.**

The initial full interaction sequence (Skip → Menu open → Escape → contents link) placed the selected heading above the sticky navbar. Ordinary contents activation worked, so the failure required reproducing the preceding menu sequence. Root identified an obsolete `body.nav-open main` rule that added 9rem/144px to the page and caused a subsequent scroll-position shift. Removing this push rule matches the menu's existing overlay layout; no speculative change to the anchor JavaScript was needed.

I viewed [the final full-sequence destination](legal-375-contents-target.png): Accessibility is fully visible below the navbar, with a clear focus outline. The selected section retains focus, and the contents disclosure closes. The ordinary bounded checks at 375/768 show heading y≈152px beneath navbar bottom 69px, stable at the sampled 0/50/300/1000ms intervals (`anchor-confirm.json`). I also viewed [the final Menu overlay](legal-375-menu-open.png). This closes the review finding.

**SR-02 / P3 — Whitepaper list alignment: resolved.**

[The final 1280px verification section](whitepaper-1280x960-verify-it-yourself.png) now aligns the ordered list with the surrounding prose, retaining normal number indentation and a readable measure. The earlier centered list no longer creates a large horizontal jump.

## Nonblocking polish

The shared hero gutter is also a little more inset than the following section at mobile/tablet widths. This is a minor consistency opportunity, not a reason to prolong the revision or a functional fault.

## Page judgments

| Page | Judgment |
|---|---|
| Legal | The native local index addresses the original long-page navigation gap. Plain sections, left-aligned subheads, and restrained background bands are clearer than nested panels. The document remains long because of its content; the index now gives users an appropriate way through it. |
| Trust Center | The left-aligned control descriptions are easier to scan. Grouping controls into cards still makes sense here. The privacy notice and role address are now available where the page invites a privacy action. Evidence-chain content is dense but has meaningful hierarchy and no observed clipping. |
| Procurement | The linear numbered process is a strong improvement over the five equal cards. Availability and delivery approval now precede preparation, installation, and the agreed test. The order communicates a credible prerequisite chain. |
| Whitepaper | The primary reading action stays prominent. Supporting inputs are described more plainly, and visible page count, size, and date help readers decide before downloading. The long hash wraps within the mobile viewport. The final desktop verification list follows the same left-aligned reading flow. |
| Press | Real light/dark logo previews make choosing an asset immediate. The short company description, format labels, PNG social asset, and subordinate implementation-assets disclosure suit the intended audience. |
| Readiness note | The editorial hierarchy remains strong: distinct headline, readable prose, numbered sections, useful output callout, and source links. The shared changes do not flatten this page into a generic card layout. |

## Shared accessibility and navigation evidence

- The contents index remains available at mobile and tablet widths as a native disclosure. [Open mobile index](legal-375x812-contents-open.png).
- Without JavaScript, the primary links are visible at the top and the inert Menu control is absent. The local contents links are also available. [No-JavaScript state](legal-375-nojs.png).
- The first Tab exposes Skip to content, and activation focuses `main#main`.
- Menu opens with Enter, updates `aria-expanded`, and closes with Escape while returning focus to the trigger.
- Desktop TOC activation focuses the selected Accessibility section; the next Tab reaches the email link inside that section rather than the next TOC item. [Desktop target](legal-1280-keyboard-target.png).
- Reduced-motion mode reaches the destination immediately in the captured interaction state; the code respects the preference. The final mobile visual landing is verified under SR-01.
- Standard text sizes remained readable at all three widths. The change preserves the clear dark-text/pale-background palette. This visual review does not replace the technical agent’s automated accessibility checks.

## Boundaries

All browser contexts installed request interception **before navigation**. Only GET/HEAD requests to `http://127.0.0.1:8765` were allowed; external requests were blocked. No form was submitted, no endpoint was probed, and no production surface was changed.

This pass does not establish native 200% browser zoom, real screen-reader behavior, iOS/Android browser behavior, PDF tagging, external download delivery, legal accuracy, or live submission/error announcements. Prior synthetic font-resize experiments are not being relabelled as native zoom results. Contact-specific validation and input-purpose changes belong to the main/technical reviewer’s scope.

Only evidence and this report were authored here; no implementation source was edited by this reviewer.

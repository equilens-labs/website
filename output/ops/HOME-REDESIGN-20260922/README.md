# Homepage redesign — 22 September 2026

The shorter page composition remains in use. The owner subsequently rejected the diagram shown in this evidence; its visual acceptance is superseded by the [new homepage illustration and current captures](../HOME-ILLUSTRATION-20260922/README.md).

The previous homepage was technically sound but still read as a document: six competing text blocks beside a miniature report, followed by repeated explanations. The owner rejected it. This revision makes the home a brief visual introduction and leaves detailed evaluation, deployment and procurement material on the product/support pages.

The opening pairs a short proposition with a conceptual flow: synthetic cohorts → simulation → report, metrics and manifest. Its one primary action explores FL-BSA. Three concise benefits, an actual synthetic sample and a buyer-pack action complete the page. The diagram contains no invented results or application interface. Current scope, pre-release access and the existing footer boundaries remain visible.

## Inspect the rendered result

| Width | Before | Final |
|---|---|---|
| 375px | [Opening](before/home-375-viewport.png) / [full page](before/home-375-full.png) | [Opening](final/home-375-viewport.png) / [full page](final/home-375-full.png) |
| 768px | [Opening](before/home-768-viewport.png) / [full page](before/home-768-full.png) | [Opening](final/home-768-viewport.png) / [full page](final/home-768-full.png) |
| 1280px | [Opening](before/home-1280-viewport.png) / [full page](before/home-1280-full.png) | [Opening](final/home-1280-viewport.png) / [full page](final/home-1280-full.png) |
| 320px stress | [Full page](before/home-320-full.png) | [Full page](final/home-320-full.png) |

The main agent personally viewed final complete pages and the corrected openings at 375/768/1280, plus the 320px stress page. Before and after used the same Chrome 153 renderer. Desktop main-content words fall from 294 to 150; mobile 144 because the redundant diagram caption is hidden. The 375px page falls from 4,532 to 2,640px including the footer. These are composition measurements, not conversion evidence.

## Independent review and corrections

- [Visual review](review.md): previous acceptance withdrawn, first impression and complete-page composition reassessed. The narrow footer word break was corrected with a two-column layout below 360px.
- [Technical review](independent-review.md): claims, assets, deployment, accessibility and navigation preserved. Enlarged text initially overflowed at four widths; font-relative container rules correct it. The main agent then caught and removed automatic headline hyphenation in the rendered output.
- [16-case smoke](independent-smoke.json): Chromium 320/375/699/700/768/1280 at 100% and 200% root font size; Firefox/WebKit 375/1280. Zero document/diagram overflow, loaded images and no page errors. Seven axe scans clean; keyboard product link, buyer-pack prefill and navigation without JavaScript pass. [Original failure evidence](independent-smoke-before-fix.json).
- Full local regression: 356 tests passed across four Chromium projects. Content lint and deployed HTML validation (22 files) passed. [Composed geometry](rhythm.json) also passes. Exact final-head CI is recorded on PR #90.

No production form submission or synthetic live analytics event was sent. Browser interception was installed before navigation and allowed only loopback GET/HEAD. All external requests and writes were blocked; contact navigation did not enter values or submit the form.

## Provenance and limits

`home.css` is scoped to the homepage; no JavaScript or external dependency was added. Existing Geist fonts, SVG icon sprite and `brand/product/report-screening.png` are reused unchanged. The report retains its existing immutable public PDF destination and synthetic/demo label. Diagram shapes are authored CSS, not fabricated product evidence. Source and artifact hashes are in [manifest.json](manifest.json).

This is a review-branch result, not a deployment or owner design approval. Browser automation does not establish native zoom, physical-device, screen-reader speech, PDF accessibility or field conversion performance. The account-level analytics-goal dependency remains separate from this source change.

# Homepage illustration revision — 22 September 2026

Superseded: the owner liked this visual style but found the illustration uninformative. The homepage now uses a [concrete synthetic-demo evidence illustration](../HOME-EXPLAINER-20260922/README.md). This directory preserves the earlier art and its provenance, not current design acceptance.

The owner accepted the shorter homepage direction but rejected its box-and-connector illustration. This revision replaces that diagram with a commissioned AI-generated conceptual illustration. Synthetic cohort markers pass through transparent planes held by indigo brackets; report, metrics and manifest motifs form the evidence bundle. The white background integrates with the existing page. The illustration is conceptual, not a hardware photograph, application screenshot or evidence of measured results.

Generated with the built-in `image_gen` tool. The complete production prompt is [prompt.txt](prompt.txt). The original generated PNG is retained at the source path recorded in [manifest.json](manifest.json). Two responsive WebP assets are stored in `brand/product/`, encoded with `cwebp -q 86 -m 6`; the smaller variant additionally uses `-resize 700 0`. No semantic editing or compositing followed generation. Source, asset and page checksums are in the manifest.

The illustration uses an ordinary image with equivalent alt text, declared dimensions and a responsive source set. Its short caption remains real HTML text. Existing hero copy, product access limits, product CTA, actual sample report and buyer-pack destination remain unchanged. Old diagram markup and its CSS are removed; no JavaScript or dependency is added to the site. Public deployment already includes `brand/` recursively.

## Visual review

The main agent inspected the generated original and the rendered final desktop opening, tablet opening and complete mobile page, plus the narrow 320px view. The new art has a clear silhouette, restrained indigo accents and visible material detail. It removes the heavy dark panel and reads as a brand illustration. Inputs and output sheets remain distinct at phone size, with no raster text to become illegible. This supersedes the previous homepage diagram's acceptance; other homepage review findings still apply.

Captures: [1280px](home-1280-viewport.png), [768px](home-768-viewport.png), [375px full page](home-375-full.png), [320px](home-320-viewport.png).

## Verification and limits

Content lint, all 22 deployed HTML pages and `git diff --check` pass. The focused Chrome run covers 320/375/699/700/768/1280 at 100% and 200% root font size, plus keyboard product navigation, buyer-pack prefill and navigation without JavaScript. Three automated WCAG A/AA scans cover narrow, tablet and desktop. See [render checks](render-checks.json). Network interception was installed before navigation, allowing loopback GET/HEAD only. No production analytics or form submission was generated.

The attempted Firefox/WebKit continuation was unavailable because those browser binaries are absent in the local cache; its partial result is retained separately. No cross-browser result from the earlier illustration is claimed for this revision. The system Homebrew Node executable also has a missing dynamic library; validation used a project-local Node 22.14.0 binary from nodejs.org, verified against its published SHA256, without changing the system runtime. CI status is separate and belongs to the current PR head.

The update remains on the existing review branch/local preview until the owner's reserved merge decision. Visual inspection and automated checks do not establish buyer conversion performance or owner design approval.

# Narrative homepage illustration — 22 September 2026

The owner rejected the analytical panel as inappropriate for a homepage hero. That review passed technical/readability checks but missed the requested visual form. The replacement is an actual editorial illustration: synthetic borrower profiles feed two groups with different approval patterns; a magnifier examines the difference; a report retains the comparison. Three short HTML labels identify these stages. The light indigo, white paper and restrained dimensional style are retained.

The artwork was generated with the built-in `image_gen` tool. The earlier sculptural image was supplied only as a material/palette reference, with an explicit instruction to replace its subject and composition. Full [prompt](prompt.txt) and [source/asset checksums](manifest.json). Final responsive assets: `brand/product/borrower-outcomes-700.webp` and `brand/product/borrower-outcomes-1402.webp`, encoded with `cwebp -q 86 -m 6`; the small version adds `-resize 700 0`. No semantic image editing followed generation.

The illustration depicts a conceptual simulation, not recorded data, a physical product, a software screenshot or a customer result. Approval symbols belong to individual simulated borrowers; there is no overall compliance/certification badge. Equivalent alt text identifies the scene as illustrative. Visible labels identify synthetic borrowers and comparison/evidence purposes; the existing no-customer-model-execution and pre-release boundaries remain nearby. The analytical hero panel, numeric results, error bars and its ZIP action are removed. The actual public sample report further down remains available.

## Visual judgment

Main personally inspected the original image and final 1280/768/375/320 page captures, including the complete mobile page. Profile cards, two groups, a magnifier and a report remain distinguishable at phone size. Tiny report motifs are secondary; the story does not depend on reading them. The three labels remain page text and reflow vertically when enlarged text requires it. [Desktop](home-1280-viewport.png), [tablet](home-768-viewport.png), [mobile](home-375-full.png), [narrow](home-320-viewport.png).

The existing independent visual reviewer assessed the generated artwork against the corrected brief. Without relying on labels, they inferred profiles feeding two groups, different positive/negative outcomes, examination through a magnifier and a retained report. They identified no material asset defect and specifically judged it a substantive illustration rather than a chart panel. They noted that synthetic/illustrative scope requires the labels/context, and left actual rendered-page readability to the main agent. This is not owner acceptance. The prior chart review explicitly missed the requested form and is superseded.

## Verification

Content lint, all 22 deployed HTML files and diff checks pass. [Render checks](render-checks.json): 12 Chrome cases at 320/375/699/700/768/1280 with 100% and 200% root font size, three automated accessibility scans and three navigation/prefill checks. No overflow, missing images or page errors. Tests blocked all external requests and writes before navigation; no production analytics or form submission was generated. Firefox/WebKit remain unavailable locally; no current cross-browser claim. CI is tracked on the exact PR head separately.

Changes remain on the existing review branch and local preview. Source/capture hashes are in the manifest; publication remains subject to the owner's reserved merge decision.

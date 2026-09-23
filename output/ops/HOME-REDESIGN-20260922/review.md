# Independent homepage visual review — 22 September 2026

The rebuilt homepage resolves the material composition problem in the rejected version. It now introduces a product, explains its basic input and outputs visually, offers one clear next step, and supplies a real artifact below. I recommend showing this revision to the owner. This is a bounded visual judgment, not a substitute for the owner's approval or evidence of conversion performance.

The previous acceptance was insufficient: it gave too much weight to correct content, shorter pages and stable geometry, and too little to whether the page felt like an effective homepage. The rejected opening was a stack of headline, explanatory prose, scope notice, competing actions and another explanation; a miniature document did not relieve that reading burden.

## Evidence personally viewed

I inspected the revised opening and full-page PNGs at all four sizes, plus the before captures. For the bounded final pass, I personally viewed the regenerated 375/768/1280px openings and the 320px full page. The final headlines preserve whole words, and the 320px footer correction is visible. The supplied 375/768/1280px geometry records are unchanged; the 320px page grows only in its footer. Links below point to the final capture set. All are local renders of `/`; no live forms or network site tests were performed for this review.

| Viewport | Revised evidence | Page height, before → revised |
| --- | --- | --- |
| 375 × 812 | [Opening](final/home-375-viewport.png), [full page](final/home-375-full.png) | 4,532 → 2,640px |
| 768 × 900 | [Opening](final/home-768-viewport.png), [full page](final/home-768-full.png) | 2,420 → 1,898px |
| 1280 × 900 | [Opening](final/home-1280-viewport.png), [full page](final/home-1280-full.png) | 2,437 → 1,857px |
| 320 × 812 | [Opening](final/home-320-viewport.png), [full page](final/home-320-full.png) | 4,798 → 2,968px |

The supplied [geometry data](final/geometry.json) reports no horizontal overflow, a loaded report image and no page errors at these widths. It records 150 visible main-content words on desktop/tablet and 144 on mobile, where the diagram's six-word caption is hidden. These support, but do not determine, the judgment below.

## What changed the visual judgment

- **HR-01 / previous P1, resolved — reading stack at the entrance.** At 375px the headline, audience/product description, primary action, scope and complete diagram fit within the 812px opening capture. The diagram begins around y517 and ends around y802. The eye has a clear visual destination. At 1280 and 768px, the diagram balances the headline and body copy rather than adding another text panel beneath them. The source is `.home-hero-layout` and `.home-simulation`.
- **HR-02 / previous P1, resolved — weak explanatory visual.** “Synthetic cohorts → FL-BSA simulation → Report / Metrics / Manifest” can be read at ordinary mobile size. Labels remain legible and connectors remain intact at 320px; the outputs naturally continue below that shorter first screen. The brackets connect the diagram to the existing brand. This is a useful conceptual explanation, without pretending to show a live application or measured customer result.
- **HR-03 / previous P1, resolved — premature and competing actions.** `.home-product-link` is now the only prominent hero action. The buyer-pack request follows the sample section and explains its contents and email response. The sequence supports a newcomer learning before making contact; this is a design rationale, not a measured uplift claim.
- **HR-04 / previous P1, resolved — repetitive homepage sections.** The page now has distinct jobs: introduction, three brief benefits, real sample, next step. The dark hero diagram, open benefit row, pale proof band and compact final action create visual rhythm. The home no longer reads as a compressed technical product page. Its shorter height is a consequence of that stronger editing and composition.

## Final closure

**HR-05 / P2, resolved — footer word break at 320px.** The earlier three-column footer split “Documentation” as “Documentati/on”. The final font-relative footer container uses two columns at this narrow width. I personally viewed [the final 320px full page](final/home-320-full.png): “Documentation” and the other resource labels remain whole, all links remain visible, and the layout has no horizontal overflow in the supplied geometry. The 375px geometry is unchanged. This adds 199px of footer height at 320px, taking the page from the initial revision's 2,769px to 2,968px; the improved reading is worth this narrow-screen tradeoff. No remaining P0/P1/P2 visual correction is requested within the reviewed scope.

The builder also caught an intermediate automatic-hyphenation regression that unchanged geometry had failed to reveal. I inspected the regenerated openings after `hyphens:manual` was restored: “evidence” is whole at 375/768/1280px. Geometry alone is not a typography or visual-composition check.

## Residual limits and tradeoffs

- The sample is still a document thumbnail: its table entries cannot be read comfortably in place. It now has a clear role as an artifact link, with a separate “Open sample report” action and file metadata. It is no longer expected to explain the product in the hero. I would not enlarge or annotate it further for this bounded revision.
- At 320px the heading takes four lines and the complete diagram requires a small scroll. Nothing is clipped in the full-page capture. This is a reasonable narrow-screen tradeoff, not a reason to compress the type.
- The page remains restrained and technical in character. It is materially more visual, but this review does not establish whether that level of brand expression matches the owner's taste. The owner should see the 375 and 1280px openings together.
- This review covers rendered homepage composition and readability only. It does not certify interactions, screen-reader behavior, other engines, product claims, PDF content, or the rest of the site. The separate technical review owns those checks.

Final source snapshot read during closure: `index.html` SHA-256 `2e4285f809ae8109aeb8a97ff348a5e8df8619c79528e5a6cfdcbf7cc87adecc`; `assets/eql/home.css` SHA-256 `4d654b5392d36b0a4a0ba7271d131eca9e7bcbca2c7bd9e48fcc7f98596b9966`.

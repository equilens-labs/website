# Corrected public report retarget — 2026-09-29

Scope: retarget the seven existing public sample-report links to the corrected,
report-only immutable prerelease. Existing campaign messaging and the separately
held whitepaper/intake links remain unchanged. Release-coordinate labels and
visible page-count and file-size metadata now match the corrected 17-page,
239223-byte report. No Gold, robustness, product, or `releases/latest` link is
added.

- Release tag: `v5.0.8-report-fix-20260929`
- Release ID: `399150186`
- Release page: <https://github.com/equilens-labs/fl-bsa-pub/releases/tag/v5.0.8-report-fix-20260929>
- Report: <https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.8-report-fix-20260929/customer_report.pdf>
- Expected size: `239223` bytes
- Expected SHA-256: `8209216fa746ff8985dd3ad70d46b8bc0eeed7ad39393fffc6dfdefe64d0cf76`

Local validation must confirm exactly seven corrected report hrefs in deployable
HTML, zero stale `v5.0.8/customer_report.pdf` hrefs, zero Gold hrefs, and no
`releases/latest` hrefs. Production validation repeats those checks after the
audited `main` deployment.

## Local verification

- GitHub release API: release `399150186` is immutable, non-draft, and a
  prerelease with exactly `customer_report.pdf`, `manifest.json`, and
  `SHA256SUMS.txt`.
- Anonymous release page and report download: HTTP `200` on 2026-09-29.
- Downloaded report: `239223` bytes, 17 pages, SHA-256
  `8209216fa746ff8985dd3ad70d46b8bc0eeed7ad39393fffc6dfdefe64d0cf76`.
- `scripts/deploy/prepare.sh`: pass.
- `python3 scripts/ops/check_public_demo_links.py dist`: pass.
- `npm run content:lint`: pass.
- `npm run lint:html`: pass across 24 deployed HTML files.
- `npm test`: 440 passed across desktop, mobile, and two tablet viewports.
- Post-review focused Playwright run covering every page render plus the paid
  evidence CTA: 68 passed across desktop, mobile, and two tablet viewports.

## Homepage preview provenance

`brand/product/report-screening.png` is a direct derivative of PDF page 2,
“Findings and review priorities,” from the exact corrected public report. That
page shows the controlling Race: Asian versus Black comparison, ratio `0.950`,
threshold `0.800`, and `Within Threshold` status together. No report content was
redrawn.

- Source release: immutable prerelease `399150186`, tag
  `v5.0.8-report-fix-20260929`
- Source asset ID: `598229439`
- Source report: `239223` bytes, SHA-256
  `8209216fa746ff8985dd3ad70d46b8bc0eeed7ad39393fffc6dfdefe64d0cf76`
- Source page: PDF page 2 (content page 1 of 16), issued
  `2026-09-29 12:02 UTC`
- Derived preview: 619 × 800 pixels, indexed PNG, `36926` bytes, SHA-256
  `bf1ce45299b4f9659f25c34e9413b2b6e96e4ec42751e088ddc4f970996560b1`
- Renderer: Poppler `pdftoppm` 24.02.0; optimizer: Pillow 11.3.0
- Cache key in deployable HTML: `?v=20260929a`

Deterministic render and optimization recipe:

```bash
pdftoppm -f 2 -l 2 -singlefile -png -scale-to-x 619 -scale-to-y 800 \
  -aa yes -aaVector yes customer_report.pdf corrected-page2
python3 - <<'PY'
from PIL import Image

image = Image.open("corrected-page2.png").convert("RGB")
image.quantize(
    colors=256,
    method=Image.Quantize.MAXCOVERAGE,
    dither=Image.Dither.NONE,
).save("report-screening.png", format="PNG", optimize=True, compress_level=9)
PY
```

The deploy link contract pins the current derived preview SHA-256 and fails if
that preview is missing or its bytes change without updating the guard.

- Corrected-preview focused Playwright run: 8 homepage render and asset-key
  checks passed across desktop, mobile, and two tablet viewports; the desktop
  full-page screenshot was visually reviewed for legibility and cropping.

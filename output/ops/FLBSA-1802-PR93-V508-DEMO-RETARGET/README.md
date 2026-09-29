# FL-BSA v5.0.8 public-demo website retarget evidence

- Collected: `2026-09-29T03:47:47Z`
- Change records: `equilens-labs/fl-bsa#1802`, `equilens-labs/website#93`
- Public release: `equilens-labs/fl-bsa-pub` release ID `398600408`, tag `v5.0.8`, <https://github.com/equilens-labs/fl-bsa-pub/releases/tag/v5.0.8>
- Public release target: `9a5518d9b467202d1d8fad56c6f65aa8358046d6`

## Immutable source assets

| Asset | Release asset ID | Bytes | SHA-256 | Source |
| --- | ---: | ---: | --- | --- |
| `customer_report.pdf` | `596345871` | 237,593 | `2b2c39fc846097d6935b39f547eb80d0b022e32f23a52a3e129b8f6c27fcadf3` | <https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.8/customer_report.pdf> |
| `gold_bundle.zip` | `596345868` | 2,931,913 | `4ae706e1e4e16c9547dd0ee5cee8022383d1db861e7715ac4878515643a443c4` | <https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.8/gold_bundle.zip> |

A fresh download returned HTTP 200 for both assets and matched both hashes. The PDF is 16 pages.

## Report preview provenance

`brand/product/report-screening.png` is a direct derivative of PDF page 2, headed “Findings and review priorities.” That page was selected after reviewing all 16 pages because it clearly shows the demo watermark, screening result, headline metric, worst comparison, and review priorities. No report content was redrawn.

- Source: the exact `customer_report.pdf` bytes above
- Source page: PDF page 2 (content page 1 of 15)
- Previous preview: 76,735 bytes; SHA-256 `a74ca3ce9fc3efc0d358e0678cf32f6b0c37064aa09fc7c0bec4922e3f364794`
- Derived preview: 619 × 800 pixels, indexed PNG, 36,530 bytes; SHA-256 `ae6c0974adbac1640bd10263e2c663d395c3e9f0de5be63becc19b57c883ff0a`
- Renderer: Poppler `pdftoppm` 24.02.0; optimizer: Pillow 11.3.0

Deterministic render and optimization recipe:

```bash
pdftoppm -f 2 -l 2 -singlefile -png -scale-to-x 619 -scale-to-y 800 \
  -aa yes -aaVector yes customer_report.pdf page2-direct
python3 - <<'PY'
from PIL import Image
image = Image.open("page2-direct.png").convert("RGB")
image.quantize(
    colors=256,
    method=Image.Quantize.MAXCOVERAGE,
    dither=Image.Dither.NONE,
).save("report-screening.png", format="PNG", optimize=True, compress_level=9)
PY
```

## Deployable link inventory

The source-level invariant in `scripts/ops/check_public_demo_links.py` checks the generated `dist` HTML (23 pages):

- v5.0.8 `customer_report.pdf`: 7 links (`index.html` 2, `fl-bsa/index.html` 3, `fl-bsa/evidence/index.html` 1, `procurement/index.html` 1)
- v5.0.8 `gold_bundle.zip`: 1 link (`fl-bsa/index.html`)
- RC9 report and GOLD links: 0
- `/releases/latest/` links: 0
- Retained RC9 whitepaper and intake links: 2 each
- Retained RC9 `SHA256SUMS.txt`, `manifest.json`, and tag-page links: 2 each

The Trust Center labels the v5.0.8 report/GOLD set separately from the held RC9 whitepaper/intake set. All retained RC9 URLs remain unchanged.

## Validation

- Content lint, footer metadata guard, deployed-HTML validation, and link-contract invariant: pass.
- Vale 3.7.1 over raw and rendered text: 0 findings across 23 pages; 20/20 Markdown and 9/9 rendered-HTML negative probes fired.
- Full Playwright/visual/axe run: 402/404 pass. The two failures were the pre-existing parallel clock race (`clock.pauseAt: Cannot fast-forward to the past`) in E1 analytics tests at `tests/site.spec.ts:1322` and `:1371`; a direct single-worker rerun of both tests passed 8/8 across all four browser projects.
- Desktop and mobile full-page screenshots: manually reviewed; the rendered page is legible, uncropped, and consistent with the PDF.
- Lychee 0.24.2: 475 successful checks, 16 intentional `mailto:` exclusions, 0 errors.
- Lighthouse CI 0.13.0, six configured routes: pass. Performance 90–100, accessibility 100, best practices 100, SEO 92–93. An initial local attempt encountered an unrelated process already bound to port 8080; the isolated-port rerun is the reported result.
- Fresh public-asset download and SHA-256 verification: pass (HTTP 200 for both assets).
- Link-invariant mutation probe: pass; replacing one v5.0.8 report URL with RC9 made the checker exit 1 and report both count violations.

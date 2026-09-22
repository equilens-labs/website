# Homepage evidence illustration — 22 September 2026

The owner liked the light indigo visual style but found the generated sculpture uninformative. The hero now explains a concrete product use: comparing approval rates across synthetic groups, exposing their gap, and inspecting the evidence behind it. It keeps the white surface, indigo accents and subtle paper depth. Its text and chart are native HTML/SVG/CSS, without raster labels, animation or added JavaScript. This is an editorial explanation of a published demo, not an invented application interface.

## Source and interpretation

The figure uses the historical public GOLD bundle's `02_gender_bias` scenario, run on 6 June 2026. [Source data and checksum provenance](source-data.json) record the exact public URL, ZIP/member hashes, retained metrics, rounding and checks. An independent technical reviewer verified the source and display; see [bounded review](independent-data-review.md).

- Female: 1,815 approvals / 4,991 observations = 36.365457824%, displayed 36.4%.
- Male: 2,803 / 5,009 = 55.959273308%, displayed 56.0%.
- Male-minus-female gap: 19.593815484 percentage points, displayed 19.6; the caption explicitly states that the female rate is lower.
- Error bars use the source's reported 95% intervals, not newly estimated intervals: female 35.0418–37.7101%; male 54.5804–57.3290%. Equivalent rounded ranges are exposed to assistive technology.

The hero identifies a synthetic demo and links its complete evidence ZIP. The values come from the retained metrics covering 10,000 observations; the shipped input CSV has 5,000 rows and was not used to recalculate the displayed rates or intervals. No regulatory threshold, compliance verdict, customer result or current-release performance claim is introduced. The existing nearby no-customer-model-execution boundary remains. The separate 16-page balanced sample further down the page is now explicitly labelled balanced; it is not the chart's 18-page scenario report.

## Review and verification

Main inspected final 1280/768/375/320 renderings, including the full mobile page. The numerical difference is visible directly in proportional bars; text explains its magnitude and gives a route to the source. [Desktop](home-1280-viewport.png), [tablet](home-768-viewport.png), [mobile](home-375-full.png), [narrow](home-320-full.png).

The local [render checks](render-checks.json) pass: 12 Chrome cases covering 320/375/699/700/768/1280 at 100% and 200% root font size, three automated accessibility scans, and three navigation/prefill checks. No overflow, missing images or page errors. Content lint, all 22 deployed HTML files and diff checks pass. Bar-to-track contrast is 3.26:1, and values remain readable as text. Numerical checks independently reconcile retained counts/rates, one-decimal display, positive gap direction and exact SVG bar lengths on a zero-to-100 scale.

Local contexts block external requests and all writes before navigation; no production form or analytics event was generated. Firefox/WebKit binaries remain unavailable locally, and no current cross-browser claim is made. CI state belongs to the current PR head. Review-branch changes are not deployment or owner design acceptance.

Source and capture hashes: [manifest](manifest.json). Previous abstract art and its generation provenance remain as historical evidence; the homepage no longer references those assets.

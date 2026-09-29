# FL-BSA v5.0.8 Gold-link withdrawal

- Recorded: `2026-09-29`
- Affected immutable asset: `gold_bundle.zip`
- Affected tag: `v5.0.8`
- SHA-256: `4ae706e1e4e16c9547dd0ee5cee8022383d1db861e7715ac4878515643a443c4`
- Retained campaign asset: `customer_report.pdf`
- Retained report SHA-256: `2b2c39fc846097d6935b39f547eb80d0b022e32f23a52a3e129b8f6c27fcadf3`

The Gold bundle's public run summary labels an absolute selection-rate gap of `0.0049` as average
odds difference. The canonical metrics and the retained customer report correctly record average
odds difference as unavailable because the required ground-truth and prediction provenance is not
present. Warning-band controlling comparisons are also absent from the public run summary.

The website therefore removes the Gold download link from active distribution while retaining the
numerically correct balanced-scenario report. The immutable release and its bytes remain available
for audit history. A corrected Gold bundle requires a superseding release and separate website
retarget after exact-asset review.

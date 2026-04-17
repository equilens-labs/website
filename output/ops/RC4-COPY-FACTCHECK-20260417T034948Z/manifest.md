# RC4 Copy Fact Check

Generated: 2026-04-17T03:49:48Z

Scope:
- `fl-bsa/index.html`
- `trust-center/index.html`
- `SSoT.md`
- `scripts/ops/content_lint.sh`

Sources checked:
- Public artifact release: https://github.com/equilens-labs/fl-bsa-pub/releases/tag/v5.0.0-rc4
- Public manifest: https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc4/manifest.json
- Public customer report: https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc4/customer_report.pdf
- Private FL-BSA SSoT at tag `v5.0.0-rc4`: `repos/equilens-labs/fl-bsa/contents/SSoT.md?ref=v5.0.0-rc4`
- Public gold bundle: https://github.com/equilens-labs/fl-bsa-pub/releases/download/v5.0.0-rc4/gold_bundle.zip

Verified facts:
- `customer_report.pdf` has 13 pages (`pdfinfo` output: `Pages: 13`), so website copy must not claim a 30-page report.
- RC4 SSoT says the ~10k full pipeline is typically in the ~20-25 minute range on reference CPU, not `<= ~20 minutes`.
- RC4 SSoT regulatory scope covers ECOA/Reg B, EU AI Act, and FCA Consumer Duty/SDEG; OSFI B-10, APRA CPS 230, SR 11-7, and FCA PS22/9 are not in the RC4 SSoT scope lines checked for this patch.
- RC4 gold bundle certificate files include input validation, data profiling, hyperparameter tuning, model, generation process, synthetic quality, synthetic validation, and regulatory alignment certificate families.

Patch decision:
- Remove the specific report page count from schema and visible FAQ copy.
- Change the runtime wording to the RC4 SSoT range in schema and visible FAQ copy.
- Replace marketing certificate labels with RC4 evidence-bundle certificate family language.
- Narrow Trust Center regulatory mapping to the RC4 SSoT-scoped frameworks.
- Add content-lint guards for the stale phrases fixed by this patch.

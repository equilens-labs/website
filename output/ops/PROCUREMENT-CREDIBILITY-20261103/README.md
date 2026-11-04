# Procurement credibility patch

Date: `2026-11-03`

## Intent

Give procurement reviewers two current, independently bounded buying signals on the public
procurement page:

- Valfox Ltd, trading as Equilens, is an **FSQS-registered supplier**;
- the Equilens Regulated Credit Evidence Readiness Assessment has an active public AWS Marketplace
  **Professional Services** listing.

The copy keeps company registration separate from product certification, and the services listing
separate from FL-BSA software / AMI availability.

## Evidence checked

- Website base: `equilens-labs/website@95c6c1670b27ad0cea49d4eb5fd3415224ecef57`.
- Approved FSQS wording and boundary:
  `equilens-labs/fl-bsa-gtm-private@3b81208437a5b287e7aae8c3dfbc90b5e3fcab52:CLAIMS_REGISTER.md`
  (`Supplier Registration: FSQS`). The underlying company evidence is the private Hellios
  completion and publication confirmation dated `2026-10-26`; inspected certificate renewal
  `2027-11-05`.
- Product Marketplace boundary:
  `equilens-labs/fl-bsa@eb29b06234b40bdcc7205dc5eb59ba1f3200e144:SSoT.md`
  (`Cloud marketplace posture`).
- AWS Marketplace Catalog API and public listing, rechecked read-only on `2026-11-03`:
  <https://aws.amazon.com/marketplace/pp/prodview-3xmzqkeh4hozc>.

Subject diff SHA-256 (only `legal/index.html`, `procurement/index.html`, and
`tests/site.spec.ts`):
`2ad17e319f2eba9bbf8c3cf26052999ae83d9ea2d3f34638de8a1c928a859887`.

## Validation

- `npm run content:lint`: PASS.
- `npm run lint:html`: PASS for the 27-file deploy surface, including HTML validation and public
  demo-link contracts.
- Targeted Playwright review: PASS, `3` expected / `0` unexpected / `0` skipped. It covered the
  procurement axe scan, the new registration/services/software claim contract, and dense-page
  overflow at `375`, `768`, and `1440` pixels. Report:
  `../PROCUREMENT-REVIEW-20261103T112000Z/report.json`.
- Full Playwright audit: PASS, `548` expected / `0` unexpected / `0` skipped across desktop,
  mobile, 768-pixel tablet, and 1024-pixel tablet projects. The full local audit output follows the
  repository's ignored `PLAYWRIGHT-AUDIT-*` convention; the focused retained report above is the
  review artifact carried by this change.
- Independent claims/correctness review: APPROVE after all findings were resolved.

The pull request carries the final branch head and hosted checks.

Local commands:

```text
npm run content:lint
npm test
```

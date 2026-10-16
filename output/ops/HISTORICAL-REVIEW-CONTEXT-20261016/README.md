# Historical-review context correction

External-review response, 16 October 2026. Parent candidate: `b7b331de5650c4375696e5d53a014742c0bea623`.

The example page changes five sentences: identify the FL-BSA measurement development track outside the current simulation-only release; explain why the public HMDA fields serve this example; replace “proves” with “checks”; limit results to this data; explain the report’s metric labels. The current-release footer is unchanged. Naming the implementation does not decide future standalone product placement, pricing or release availability.

The [live FL-BSA FAQ](https://equilens.io/fl-bsa/#faq) states that measurement over supplied decision/score columns is a separate development track outside the current release. The [official CFPB public LAR field reference](https://ffiec.cfpb.gov/documentation/publications/loan-level-datasets/lar-data-fields) documents `action_taken` and `applicant_sex`; this supports the bounded dataset rationale. No exclusivity claim about HMDA being the only public dataset is made. Sources checked 16 October 2026.

`Object.hasOwn` was unavailable in the simulated compatibility condition. The existing route script then failed to preserve the exact paid route. Use `Object.prototype.hasOwnProperty.call` for both allowlist lookups. The regression test removes `Object.hasOwn` before scripts execute, checks paid and organic enquiry subjects through mocked submissions, and rejects `__proto__`, `constructor` and `toString`. This verifies that missing API condition in Chromium; it is not a claim of complete old-Safari support.

Local validation before this commit: 24 historical-page browser checks passed, with no real submissions or analytics writes. Vale 3.7.1 passed 27 deployed raw/normalized HTML files and all 29 known-bad claim probes. The failing pre-fix regression and the one full post-fix suite are retained in the private local review-response evidence directory; final run results are recorded there, without rewriting this source commit.

The PDF and findings bytes remain identical to the parent candidate. No advertising plan, creative, image, budget, route identity, public page, analytics setting or customer delivery changed externally.

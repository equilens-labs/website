# October landing page integration — 29 September 2026

Integrated against website main `83d0f1003ff3fe8f4af4434ed92803ce0531480e`.

The two October campaign identities now retain their region and campaign attribution from the
evidence landing page into the evaluation and procurement-pack enquiry subjects. The privacy
notice adds the previously reviewed disclosure of LinkedIn professional targeting and aggregate
reporting. Its 29 September browser-preference disclosure remains intact.

Page B uses the presentation reviewed on 28 September: a larger headline, framed illustration,
structured evidence cards and a distinct evaluation section. Its product wording, contact intent,
analytics attributes and noindex treatment are preserved. The sample-report link and metadata stay
on the current approved v5.0.8 PDF (16 pages, 232 KiB). This change adds no Gold ZIP link.

Provenance: routes from prepared commit `05ead3f`; design from `44c675d` plus reviewed CSS fixes
`0fdd974`. The old preparations predate the current report URL and privacy notice; they were
integrated selectively rather than replacing those pages wholesale.

Visual review on the integrated checkout: Chromium at 375, 768 and 1280 pixels, first screen and
full page; the sample-report action is visible in the first phone screen, the report and evaluation
sections have clear hierarchy, and no horizontal overflow occurs. The October pack route retains
the compact name/email form. Browser renders do not establish acceptance in the native LinkedIn
in-app browser.

The test fixture intercepts external requests and writes before navigation. Enquiry submissions
in the suite are intercepted fixtures; they do not send mail or consume form quota. Publication
requires the full site audit and the owner's merge instruction, followed by live visual checks.

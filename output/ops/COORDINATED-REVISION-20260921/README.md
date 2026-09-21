# Coordinated website revision — 21 September 2026

The revision addresses 20 of the 21 findings from the independent nine-page review. The remaining account-level analytics goal cannot be configured with the current API authority. These are branch changes awaiting founder review/merge; this report does not claim production deployment or improved conversions.

Home and product now lead with the present offer and an actual sample. Contact starts with the required fields. Shared typography, contents navigation, engagement comparison, supporting pages and enquiry feedback have been revised together. Existing routes, immutable downloads, campaign routing and current product boundaries are retained.

## Review the result

- [Homepage, desktop](screenshots/home-after-1440.png), [tablet](screenshots/home-after-768.png), [mobile](screenshots/home-after-375.png)
- [Product, desktop](screenshots/product-after-1280-full.png), [mobile full page](screenshots/product-after-375-full.png)
- [Contact, desktop](screenshots/contact-after-1280.png), [mobile](screenshots/contact-after-375.png)
- [Legal](screenshots/legal-after-1280.png), [Trust Center](screenshots/trust-center-after-1280.png), [Procurement](screenshots/procurement-after-1280.png), [Whitepaper](screenshots/whitepaper-after-1280.png), [Press](screenshots/press-after-1280.png), [Note](screenshots/note-after-1280.png)
- Before: [home](screenshots/home-before-1440.png), [product mobile](screenshots/product-before-375.png), [contact mobile](screenshots/contact-before-375.png)
- [Mobile section destination](screenshots/legal-mobile-keyboard-target.png) and [form keyboard focus](screenshots/contact-mobile-keyboard-focus.png)

Product height changed from 19,139 to 9,213px at 375px, and 14,274 to 6,625px at 1440px: approximately 52–54% shorter. These are directional rendered comparisons using different Chromium versions, not controlled performance or conversion results. Essential contact fields are now visible in the opening 375px viewport.

## Independent acceptance and verification

Three independent review scopes accepted the final implementation: principal-page visual composition, six supporting pages/shared accessibility, and technical behaviour/claims/test isolation. The main agent personally inspected all nine pages and principal 375/768/1280 layouts, including the corrections found during review.

- [Principal visual review](visual/final-review.md) and [accepted input hashes](visual/accepted-inputs.sha256.json).
- [Supporting-page review](secondary/review.md), including the reproduced and fixed Menu→contents landing issue.
- [Independent technical review](independent-technical-review.md).
- Final automated results are recorded in [validation-summary.json](validation-summary.json), with [cross-browser detail](cross-browser.json) and [layout measurements](layout-metrics.json).
- Content lint and HTML conformance cover the 22 deployed HTML files. Chromium regressions cover four viewport projects. Firefox/WebKit supplement these with nine canonical routes at 375/1280, automatic WCAG A/AA scans and navigation checks.
- Local form fixtures block external traffic before navigation and fulfil form/analytics requests locally. No production test submission or synthetic analytics event is part of this work. Acceptance events indicate provider HTTP acceptance, not inbox delivery.

Full capture/test output is retained in the private local working corpus. The versioned bundle intentionally includes selected screenshots, review reports, compact results and hashes; detailed paths in reviewer reports may refer to that larger corpus.

## Finding disposition

| Finding | Implemented result or remaining dependency |
|---|---|
| R01 (P1) | Recomposed product journey: proposition/sample, process, comparable engagements, access, resources, FAQ. |
| R02 (P1) | Native contents disclosures at mobile/tablet; persistent sidebar on wide screens. |
| R03 (P1) | Contact form is the primary content; name and email appear in the opening viewport. |
| R04 (P1) | Account dependency remains: the existing Sites API authority refused goal creation (401). Client success event is preserved; configuration is not claimed complete. |
| R05 (P1) | Home/product metadata and opening copy align on synthetic simulation, no customer-model execution and agreed pre-release access; unverified portal promise removed. |
| R06 (P2) | Three equal-width engagement rows replace the broken stacked-card grid. |
| R07 (P2) | Existing synthetic report preview and directly adjacent PDF action appear near the proposition. |
| R08 (P2) | Left-aligned prose, wider mobile measure, ordinary-size essential notes, aligned plain lists and clear keyboard focus. |
| R09 (P2) | Buyer value, scope and sample lead; detailed regulatory context remains accessible in relevant sections/disclosure. |
| R10 (P2) | Buyer-pack actions consistently explain the written reply and its contents; specialist security-pack route retained. |
| R11 (P2) | Procurement sequence now confirms availability and terms/approval before preparation and installation. |
| R12 (P2) | Input purposes declared for name, email, organisation and role. |
| R13 (P2) | Section activation transfers focus; subsequent Tab continues in the section. Menu-to-contents scroll-shift defect also fixed. |
| R14 (P2) | Local navigation honors reduced motion; ordinary navigation retains smooth scrolling. |
| R15 (P2) | Trust Center offers contextual privacy-notice links and the published privacy role inbox. |
| R16 (P3) | Primary links remain visible without JavaScript; contact email fallback stays available. |
| R17 (P3) | Downloads identify format/size and supporting synthetic inputs; whitepaper shows verified 11-page count and 6 June 2026 demo build date. |
| R18 (P3) | Press shows original light/dark logo previews, format-labelled downloads and subordinate implementation assets. |
| R19 (P2) | Current design spec, brand font guidance and behavioural/geometry regressions replace contradictory presentation rules. |
| R20 (P2) | Immediate Sending status, bounded 15-second wait, preserved fields, honest uncertain-delivery recovery and no automatic retry. Live status has no busy ancestor. |
| R21 (P2) | Attempt event occurs only after validation/honeypot guard; accepted event only after HTTP 2xx. |

## Provenance and limits

Base: website main `1a889d273960188a29239c2888f2640de5db661f`. The final changed-source hashes are in [source-sha256.json](source-sha256.json). Original report assets, logo files and Geist fonts are reused; no customer evidence was fabricated. Whitepaper metadata was derived from the immutable public demo PDF and release manifest: 11 pages, 390,331 bytes, 6 June 2026 build. The description does not turn the demo into a stable release.

Real screen-reader speech, native OS zoom, physical devices, production form delivery and account configuration are not certified by these browser checks. The PDF itself has not been redesigned or made accessible in this revision. The existing development-only transitive fast-uri advisory is unchanged; it is not shipped as a browser dependency. CI provides additional link, Pa11y and Lighthouse checks against the PR.

R04 remains open: exactly the Plausible event goal `Enquiry Submitted` must be added through approved Sites API write authority. The failed attempt made no verified change; no credential change or reauthorization was attempted. This is independent of the corrected client event behaviour.

Publication follows DESIGN-SPEC.md: branch → PR with evidence → founder review/merge → normal audited deployment.

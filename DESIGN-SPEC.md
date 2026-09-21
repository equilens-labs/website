# Equilens website — design spec

Current composition rules, revised 21 September 2026 following the independent
website review and owner instruction. These supersede the earlier requirement
for identical centered cards inside alternating rounded panels. This file is
outside the public deployment allowlist.

## Type and colour

- Self-hosted **Geist Sans** for headings, body, labels and captions. Geist Mono
  only for code, hashes and numbered badges. No third-party font requests.
- Body: 16px / 1.7 at default browser size, using relative units. Leads: 18px.
  Buyer H1: 36px mobile, up to 56px desktop. Section H2: 28px mobile / 40px desktop.
  H3: 20px for cards, steps and service rows. Metadata/captions: 14px.
- Scope, availability, privacy explanations and commercial terms are ordinary
  body copy, even when historical markup calls them a `note`.
- Long prose and section headings align left. Aim for 55–75 characters in a
  desktop reading column. Centered text is reserved for brief display elements.
- Keep slate/indigo and existing contrast: `--color-primary` for chrome and
  `--color-primary-text` for readable accent text.
- Preserve the founder's `.product-name` treatment for FL-BSA in prose and H2/H3,
  the bracket identity, logo proportions and sentence-case labels.

## Page architecture

- Home/product: buyer, job, simulation scope, action and a real sample in the
  opening. Desktop pairs text and sample; mobile stacks in reading order.
- Product: three-step process, comparable engagement rows, bounded optional
  evaluation, deployment/context/resources and compact FAQ. Preserve published
  anchor IDs and allowlisted campaign routes.
- Contact: one H1 and purpose, then Name/Email. Both fields must be visible at
  375×812. Alternative routes follow or sit alongside the form.
- Legal/Trust/product: native “On this page” disclosure at small widths and a
  sticky contents rail on desktop. Works without scripts; JS enhances section
  focus and active-location feedback, respecting reduced motion.
- Supporting resources use a stable reading column. Press provides previews
  and clear download labels; implementation files have secondary prominence.

## Components and spacing

- Plain sections, without mandatory bordered panels. Subtle bands can separate
  topics; there is no requirement for a strict alternating sequence.
- Cards represent distinct items. Reading content aligns left; icons are optional.
- `.service-list > .service-row`: equal widths, aligned duration and deliverables;
  two text columns on desktop, stacked text on mobile.
- `.process-list` provides semantic ordered steps and visible numbering.
- Use the existing 4px spacing scale. Paragraph gaps are smaller than section
  boundaries. Avoid repeated mobile padding that constricts the reading measure.
- One primary action per decision area. “Request buyer pack” consistently identifies
  the object. Explain contents and written reply. Samples link to the real PDF,
  with synthetic/demo status and file metadata attached.
- Buttons and fields retain visible keyboard focus; hover is supplementary.
  Without JS, the primary links remain usable and the inert menu button is hidden.

## Claims and behaviour

- Current scope: customer-hosted simulation over synthetic cohorts. No execution
  of customer models, live lending decisions, legal advice or certification.
  Keep roadmap work distinct from the available product.
- Current access is pre-release and agreed separately. No unverified portal,
  Marketplace availability, delivery date or response SLA.
- Terms and delivery approval precede installation in procurement.
- Keep the mandatory footer boundary generated from JSON/template source.
- Preserve the “call” word ban, em-dash copy ban and claims lint rules.
- Count valid attempts after the honeypot guard; accepted submissions after HTTP
  2xx. No personal/freeform input in analytics. Receipt and qualification are
  subsequent operating outcomes, not browser conversion claims.

## Verification and release

1. `npm run content:lint` and `npm run lint:html`.
2. `npm test` against loopback with persistent external-request blocking. Preserve
   campaign/claims/privacy checks; test behaviour and geometry, not CSS bytes.
3. `node scripts/ops/measure_rhythm.mjs <local-url>` for composed layout geometry.
4. Independent complete-page screenshots at 375/768/1280, viewed by the main
   agent. Include 320px stress and original-scale component crops when needed.
5. Branch → PR with evidence → founder review/merge → normal audited deployment.
   After deployment, the main agent views live 375/768/1280 renders.

Record source, checks, coverage limits and artifact hashes in
`output/ops/COORDINATED-REVISION-20260921/`. Browser automation does not establish
screen-reader or physical-device acceptance.

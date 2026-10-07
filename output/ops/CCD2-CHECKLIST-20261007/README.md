# CCD2 non-discrimination checklist page (2026-10-07)

## Purpose

- Publish the checklist that the prepared EU A1 LinkedIn lead-generation cell offers. The cell is not
  launched.
- No privacy-notice change in this PR. The EU representative (GDPR Art. 27) is not yet appointed. The
  privacy update will be a separate PR, merged before any EU form collects data.

## Changes

- `notes/ccd2-non-discrimination/`: an HTML page and a 2-page PDF. The PDF was built from the same
  text. It is a byte-identical copy of the GTM checklist PDF.
- The page text is the checklist text, word for word. Only the markup follows the site's note
  template, as on the UK page:
  - an "Equilens checklist" eyebrow;
  - PDF and contact buttons in place of the contact line;
  - a linked sources list;
  - the copyright line in the site footer.
- The FIN-FSA quote keeps its attribution.
- The page is registered in the Playwright, Lighthouse and pa11y page lists. The link check excludes
  the page's own canonical URL until it is published (precedent 854e843).
- No other page changes. `legal/index.html` is unchanged.

## Provenance

- PDF SHA-256: see `SHA256SUMS.txt`.
- Page text and PDF match the GTM checklist source as of 15:55 UTC (`checklist.html` SHA-256
  `631377b2886421e9ddd654b89fc5b3a1606f25f0911f7f26ba57beafb9582e99`).
- Source quotes were checked word-for-word against saved official texts:
  - Directive (EU) 2023/2225, Arts 6, 18(3), 18(4), 18(8) and 48;
  - Charter of Fundamental Rights of the European Union, Art 21;
  - FIN-FSA thematic review on the assessment of consumers' creditworthiness (8 April 2026);
  - GDPR Art 9(1).
- Product sentence: unchanged from the approved CLAIMS_REGISTER sentence ("by sex, and by ethnicity
  where you hold or can lawfully derive it"). Age groups are not claimed; see equilens-labs/fl-bsa
  issue 1836. The product box also says that FL-BSA (Fair-Lending Bias-Simulation Appliance) does not
  report approval-rate gaps by age group.

## Screenshots

- `note-desktop-first.png`: first screen of the new page at 1280 px.

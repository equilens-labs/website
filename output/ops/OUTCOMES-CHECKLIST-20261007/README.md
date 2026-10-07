# Outcomes-by-customer-group checklist page + LinkedIn lead-form privacy notice (2026-10-07)

## Purpose

- Publish the checklist that the prepared UK A1 LinkedIn lead-generation cell offers. The cell is not
  launched; see the GTM PR.
- Make the privacy notice cover LinkedIn Lead Gen Form data before any form collects it.

## Changes

- `notes/outcomes-by-customer-group/`: an HTML page and a 2-page PDF. The PDF was built from the same
  text.
- `legal/index.html` privacy notice. Additions:
  - a LinkedIn lead-form data item;
  - a sentence on the legal basis (legitimate interests, plus consent for the optional updates box);
  - LinkedIn as a recipient;
  - a 12-month retention entry (proposed default; owner to confirm);
  - a new effective date, 2026-10-08.
- The page is registered in the Playwright, Lighthouse and pa11y page lists.

## Provenance

- PDF SHA-256: see `SHA256SUMS.txt`.
- Source quotes were checked word-for-word against:
  - FCA FG22/5 (paras 1.27, 11.11, 11.38, 11.40, 11.42, 11.43);
  - the FCA outcomes-monitoring review (27 Jul 2026);
  - CDEI review (2020);
  - ICO "What is special category data?";
  - Equality Act 2010 Sch. 3 para 20A.
- Product sentence: limited to current capability ("by sex, and by ethnicity where you hold or can
  lawfully derive it"), per fl-bsa SSoT and data-requirements. Age groups are not claimed; see
  equilens-labs/fl-bsa issue 1836.
- Two independent copy reviews (facts/claims and audience) were run before this PR; findings applied.

## Screenshots

- `note-desktop-first.png`: first screen of the new page at 1280 px.
- `privacy-crop.png`: the amended privacy list.

# LinkedIn paid-measurement route — 2026-09-01

Status: local preparation only; not deployed and not campaign authority.

## Purpose

Preserve a static, non-PII identity from the reviewed LinkedIn EEA campaign URL through the
existing automated-creditworthiness CTA to the visitor's email client. This lets Equilens
distinguish a LinkedIn-attributed enquiry without an advertising pixel, cookie, form submission,
or server-side collection of contact-form contents.

## Frozen route

- Landing path: `/fl-bsa/#creditworthiness-readiness`
- Route: `linkedin-era-eea-202609`
- `utm_source`: `linkedin`
- `utm_medium`: `paid-social`
- `utm_campaign`: `flbsa_era_eea_202609`
- Initial `utm_content`: `single_image_v1`
- Static email subject: `FL-BSA enquiry: Evidence readiness — LinkedIn EEA Sep 2026`

The route activates only when every required static value occurs exactly once and matches the
reviewed route. The landing page carries the same route and UTM values to the contact page, which
revalidates them before selecting the campaign-specific email subject. Names, organisations,
roles, email addresses, form contents, and message text are not included in the URL or analytics
properties.

Direct-email and no-JavaScript fallbacks remain deliberately unattributed. A generic enquiry is
preferable to claiming paid attribution without the complete reviewed route.

## Verification gate

- Existing Google campaign routing must remain unchanged.
- The LinkedIn route must work at desktop and mobile viewport sizes.
- A mismatched LinkedIn medium must fall back to the generic contact route.
- Missing, unknown, mismatched, or duplicated campaign values must generate a generic email
  subject.
- Changing the selected interest must generate a generic subject for that interest.
- The existing Plausible event and UTM reporting remain aggregate and non-PII.
- Deployment, ad creation, launch, and spend each remain separate operator decisions.

## Verification result

- Candidate base: `00c4a4ca4aea6d0b226d5e7123ceccdc7b43640f`
- Candidate branch: `codex/linkedin-paid-measurement-20260901`
- Content lint: passed.
- Deployable HTML lint: passed across 22 HTML files.
- Focused campaign journey: 12/12 passed across desktop, mobile, and two tablet Chromium profiles.
- Full Chromium browser suite: 300/300 passed; 0 skipped, unexpected, or flaky. The raw Playwright
  report is deliberately not retained because it embeds machine-specific absolute paths and
  ephemeral attachment references.
- Desktop and mobile screenshots were reviewed locally but are not committed; repository policy
  keeps bulky generated PNGs in transient workflow artifacts rather than Git.
- Source and test fingerprints: `MANIFEST.sha256`.

These results prove the local candidate only. They do not prove a deployment, campaign launch,
click volume, enquiry volume, or revenue.

Firefox and WebKit binaries are not installed in the local Playwright environment, so their smoke
checks remain a pre-deployment/live-browser check rather than a claimed pass. After deployment and
before spend, verify the exact landing-to-email journey in fresh and previously cached desktop and
mobile browser sessions and confirm receipt in the Equilens inbox.

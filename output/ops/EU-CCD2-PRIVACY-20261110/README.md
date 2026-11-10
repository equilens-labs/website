# EU lead-form notice alignment — 10 November 2026

The notice previously said any further EU email required updates consent and promised deletion of
all details after 30 days. Align it with the reviewed form: fulfilment only without optional updates
consent; necessary requested replies handled separately; downloaded form records deleted after
30 days; standalone fulfilment mail deleted if no reply; LinkedIn controls its own platform records.
The public effective date is 10 November 2026. No form field, tracking or entity claim changes.
This notice correction does not establish an Article 27 exemption or representative appointment.

Source: https://www.linkedin.com/help/linkedin/answer/a7495170 and the existing form/handling controls.

## Product-page delivery correction

The normal CI audit exposed an existing product-page performance miss at its unchanged 0.90 gate.
Keep the approved full-size hero and its caption, alt text, link and 3:2 layout. Serve 480- and
768-pixel delivery derivatives through matching image/preload source sets, after viewport metadata.
The original remains the fallback and full-size destination. Defer its noncritical monospace-font
preload. The font face remains available normally. No image content or test threshold changes.

`hero-provenance.json` binds the original and both deterministic downsampled WebPs. Four local mobile
profiles, with analytics blocked, showed LCP 1,856/1,860 ms before and 1,416/1,428 ms after, with exactly
one 52,662-byte hero request instead of 157,038 bytes. Hosted CI remains the deployment gate.

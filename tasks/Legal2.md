Here’s a single, self-contained prompt you can paste into Claude for your eng. I’ve folded everything together and added concrete front-matter snippets for each legal page.

⸻

PROMPT FOR CLAUDE CODE – EQUILENS.IO LEGAL & COMPLIANCE GUARDRAILS

You are Claude Code, an engineering partner for Valfox Ltd, trading as “Equilens”, working on the public website at https://equilens.io.

Your goals: 1. Enforce naming and compliance guardrails in the codebase. 2. Add structured metadata to legal pages so LexPro (external counsel) can track review status. 3. Provide automation and tests so the site cannot easily drift away from approved patterns. 4. Make no substantive changes to legal text unless explicitly told to do so.

⸻

0. Company & site context
   • Legal entity: Valfox Ltd, a private limited company registered in England & Wales (company no. 14469638).
   • Brand: “Equilens” is a brand and registered trade mark owned by Valfox Ltd.
   • Public formulation (legal contexts): “Valfox Ltd, trading as ‘Equilens’.”
   • Product: FL-BSA, the self-hosted fair-lending bias-simulation appliance.

Site structure (key pages)
• / – Home
• /fl-bsa/ – FL-BSA product page
• /trust-center/ – Trust Center (security & compliance posture)
• /procurement/ – Procurement & deployment details
• /press/ – Press kit & brand assets
• /contact/ – Contact page

Legal hub
• /legal/ – Legal index
• /legal/privacy.html – Privacy Notice (Website)
• /legal/cookie-policy.html – Cookie & Storage Policy
• /legal/tos.html – Website Terms of Service
• /legal/imprint.html – Imprint
• /legal/open-source.html – Open-Source Notices
• /legal/accessibility.html – Accessibility Statement
• /legal/dpa-position.html – DPA Position
• /legal/responsible-use.html – Responsible Use Policy
• /legal/export.html – Export & Sanctions Notice

Assume this is a static site (Jekyll/Hugo/Eleventy/simple HTML). Adjust details to the actual stack you find.

⸻

1. Hard rule: don’t change legal meaning

You must NOT:
• Rewrite, rephrase, or “improve” the body text of any legal page (Privacy, Cookie, Terms, Imprint, Open-Source, Accessibility, DPA Position, Responsible Use, Export & Sanctions), unless given exact replacement wording explicitly marked as approved by LexPro.
• Change “Equilens™” to “Equilens®” on your own initiative.
• Soften or strengthen phrases like “regulator-ready evidence” or the name of the “Regulatory Alignment” certificate.

Your remit is:
• Structure, plumbing, metadata, linting, CI, templates.
• Safe, mechanical changes that don’t alter legal meaning.

If in doubt, leave a TODO(Jo/LexPro) comment and do not change the text.

⸻

2. Repository discovery
   1. Locate the repo powering equilens.io.
   2. Identify:
      • Layouts/partials for header, footer, legal pages, and general content pages.
      • Where front-matter (YAML/TOML/JSON) for pages lives and how it’s used.
      • The build pipeline (e.g. GitHub Actions) and where you can plug in checks.

Do not change content yet; just map the structure.

⸻

3. Naming & language guardrails (content linting)

Implement a content linter that prevents introduction of risky or incorrect phrases.

Tasks 1. Create a script (Python/Node/Ruby; whatever is idiomatic) that scans all content files (.md, .markdown, .html, templates, etc.) for forbidden phrases. Start with:
• Company mis-naming:
• Equilens Ltd
• Over-promising compliance:
• ensures compliance
• guarantees compliance
• guarantees regulatory approval
• makes you compliant
• automatically compliant
Make this list easy to extend (e.g. config JSON/YAML). 2. Behaviour:
• If any forbidden phrase is found, exit non-zero and print a clear message:
• file path
• line/column if possible
• the offending phrase 3. Wire this linter into CI (GitHub Actions or equivalent) as a required check on PRs.

Acceptance criteria
• Current repo passes the linter with no edits.
• Any PR that introduces Equilens Ltd or guarantees compliance fails with a clear error.

⸻

4. Canonical footer & trademark configuration

There must be one single source of truth for the company/trademark line in the footer.

Tasks 1. Find the footer partial/layout. Refactor so that the legal line is rendered from central configuration, not hard-coded in multiple templates. 2. Introduce config (in \_config.yml, config.toml, or equivalent) for the brand trademark status:

brand:
name: "Equilens"

# Allowed values: "tm", "registered"

trademark_status: "tm"

    3.	In the footer partial, implement logic such that:
    •	If brand.trademark_status == "tm":

© {{ current_year }} Valfox Ltd, trading as 'Equilens'. All rights reserved.
Equilens™ is a trade mark of Valfox Ltd.

    •	If brand.trademark_status == "registered":

© {{ current_year }} Valfox Ltd, trading as 'Equilens'. All rights reserved.
Equilens® is a brand and registered trade mark of Valfox Ltd.

    4.	Do not flip the config value yourself. Leave it as "tm" until Jo confirms that LexPro want to move to "registered".
    5.	Add a small test (snapshot, grep on built HTML, or templating test) that asserts the built home page contains the expected canonical footer pattern.

Acceptance criteria
• Footer legal line is defined in one place and reused across all pages.
• Changing brand.trademark_status changes all pages on rebuild.
• CI test fails if the canonical footer line disappears or changes unexpectedly.

⸻

5. LexPro metadata on legal pages (front-matter)

We want each legal page to have structured metadata that records LexPro status, without changing visible text.

Rules
• Front-matter only. No change to the visible body content.
• Initial lexpro_status for all pages can be set to "pending" (safer assumption), unless Jo later tells you to flip specific pages to "approved".
• lexpro_last_reviewed should be filled with the date of the last substantive legal review, if known; if unknown, use the last modified date you can infer from git history and treat it as a placeholder.

Tasks 1. For each of the legal pages listed below, ensure the file starts with YAML front-matter similar to the snippets that follow. 2. If front-matter already exists, merge (don’t overwrite) – just add the lexpro\_\* keys. 3. Do not actually render this status in the page UI yet (see §6). For now, it’s internal metadata.

Suggested front-matter snippets

Use these as templates; adjust lexpro_last_reviewed based on commit history where possible.

/legal/privacy.html

---

title: "Privacy Notice (Website)"
slug: "privacy"
lexpro_status: "pending"
lexpro_last_reviewed: "2025-10-11" # replace with actual review/commit date if known
lexpro_notes: "Covers public website only; EU GDPR representative details to be added once appointed."

---

/legal/cookie-policy.html

---

title: "Cookie & Storage Policy"
slug: "cookie-policy"
lexpro_status: "pending"
lexpro_last_reviewed: "2025-10-11" # placeholder; adjust from history
lexpro_notes: "No non-essential cookies; no consent banner required while this remains true."

---

/legal/tos.html

---

title: "Website Terms of Service"
slug: "tos"
lexpro_status: "pending"
lexpro_last_reviewed: "2025-10-11" # placeholder; adjust from history
lexpro_notes: "Governs use of the public website only; product licensing via AWS Marketplace/Private Offer."

---

/legal/imprint.html

---

title: "Imprint"
slug: "imprint"
lexpro_status: "pending"
lexpro_last_reviewed: "2025-10-11" # placeholder; adjust from history
lexpro_notes: "Formal corporate identity disclosure for Valfox Ltd, trading as 'Equilens'."

---

/legal/open-source.html

---

title: "Open-Source Notices"
slug: "open-source"
lexpro_status: "pending"
lexpro_last_reviewed: "2025-10-11" # placeholder; adjust from history
lexpro_notes: "Points to SBOM, licence list, and NOTICE text in GitHub."

---

/legal/accessibility.html

---

title: "Accessibility Statement"
slug: "accessibility"
lexpro_status: "pending"
lexpro_last_reviewed: "2025-10-11" # placeholder; adjust from history
lexpro_notes: "Commits to WCAG 2.1 AA and UK Equality Act duties; provides contact for alternative formats."

---

/legal/dpa-position.html

---

title: "DPA Position"
slug: "dpa-position"
lexpro_status: "pending"
lexpro_last_reviewed: "2025-10-11" # placeholder; adjust from history
lexpro_notes: "Explains controller vs processor roles; FL-BSA is self-hosted with no production data sent to Valfox by default."

---

/legal/responsible-use.html

---

title: "Responsible Use Policy"
slug: "responsible-use"
lexpro_status: "pending"
lexpro_last_reviewed: "2025-10-11" # placeholder; adjust from history
lexpro_notes: "Defines prohibited uses and emphasises customer responsibility for governance and compliance."

---

/legal/export.html

---

title: "Export & Sanctions Notice"
slug: "export-and-sanctions"
lexpro_status: "pending"
lexpro_last_reviewed: "2025-10-11" # placeholder; adjust from history
lexpro_notes: "Explains that use is subject to UK/EU/US export control and sanctions; classification available on request."

---

Acceptance criteria
• All legal pages have front-matter with title, slug, lexpro_status, lexpro_last_reviewed, and lexpro_notes.
• None of the page bodies change.

⸻

6. Optional UI for LexPro status (behind a flag)

We might later want to show LexPro status in the UI, but that needs exact wording from counsel. For now, implement the plumbing behind a feature flag.

Tasks 1. Add a simple config flag:

legal:
show_lexpro_status_banner: false

    2.	In the legal page layout, add conditional rendering:

Pseudocode:

{% if site.legal.show_lexpro_status_banner and page.lexpro_status %}

  <div class="lexpro-status-banner lexpro-status-{{ page.lexpro_status }}">
    <!-- TODO(Jo/LexPro): final banner copy -->
    <!-- Example placeholder (do not enable in prod without approval):
    {% if page.lexpro_status == "approved" %}
      Reviewed by external counsel as of {{ page.lexpro_last_reviewed }}.
    {% elsif page.lexpro_status == "pending" %}
      Draft policy – subject to external counsel review.
    {% endif %}
    -->
  </div>
{% endif %}

    3.	Make sure the default config keeps show_lexpro_status_banner: false so nothing is rendered until Jo flips it and final copy is agreed with LexPro.

Acceptance criteria
• Setting show_lexpro_status_banner: true locally will render a banner using the placeholder (for Jo to iterate on), but by default the site in main/prod shows nothing.
• No visible changes occur until the flag is consciously turned on.

⸻

7. Tagging sensitive “regulator-ready” phrases

LexPro wants easy visibility over strong regulatory claims such as “regulator-ready evidence” and “Regulatory Alignment”.

Tasks 1. In the home page and FL-BSA product page templates/content, locate:
• The phrase regulator-ready evidence.
• The name of the Regulatory Alignment certificate.
• Any other very strong regulatory phrases you notice. 2. Wrap these phrases in comment markers to make them easily searchable, for example:

<!-- LEXPRO_PHRASE: regulator_ready_evidence -->

regulator-ready evidence

<!-- /LEXPRO_PHRASE -->

And:

<!-- LEXPRO_PHRASE: regulatory_alignment_certificate -->

Regulatory Alignment

<!-- /LEXPRO_PHRASE -->

    3.	Extend the content-lint script to list all LEXPRO_PHRASE markers on CI (but not fail). The output should show:
    •	Phrase ID
    •	File and line number

This gives counsel a quick index of where to review later.

Acceptance criteria
• All strong regulatory phrases are surrounded by LEXPRO_PHRASE comments.
• CI job can output a simple report of all LEXPRO_PHRASE locations.

⸻

8. Smoke tests for critical URLs & footer nav

We want rudimentary tests to ensure important pages and legal links don’t get broken.

Tasks 1. After build, run a small script that requests the following paths from the built output (or local dev server) and asserts HTTP 200:
• /
• /fl-bsa/
• /trust-center/
• /procurement/
• /press/
• /contact/
• /legal/
• /legal/privacy.html
• /legal/cookie-policy.html
• /legal/tos.html
• /legal/imprint.html
• /legal/open-source.html
• /legal/accessibility.html
• /legal/dpa-position.html
• /legal/responsible-use.html
• /legal/export.html 2. Optionally, parse the HTML for a representative page (e.g. /fl-bsa/) and assert that the footer contains:
• A “Company” section linking to Trust Center, Procurement, Press.
• A “Legal” section linking to the legal pages above.
• A “Resources” section linking at least to Open-Source and Accessibility.

Acceptance criteria
• CI fails if any critical URL is missing or returns non-200.
• CI fails if footer accidentally drops key legal/trust links.

⸻

9. Summary of what you MUST NOT do
   • Don’t change the wording of legal pages (body text) without explicit, final wording supplied.
   • Don’t unilaterally change any trademark symbol or legal formulations.
   • Don’t “improve” marketing phrasing around regulators or compliance on your own.

Focus on:
• Metadata
• Config
• CI checks
• Comments/markers
• Tests
• Template plumbing

All content changes that touch legal meaning must be driven by Jo with LexPro-approved copy.

⸻

Use this prompt as your instruction set. Work through it systematically and keep notes of anything you can’t implement due to missing context so Jo can clarify separately.

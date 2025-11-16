Privileged Draft – For Internal Counsel Review (LexPro)
Scope: EU/UK only • Channel: website + AWS Marketplace • Target: “operate” by 01‑Jan‑2026 • Assumption: first customers may land later in Q1

Below is a surgical, copy‑paste pack plus minimal changes to land you in a safe posture. I keep it terse and thorough.

⸻

2.1 Company & brand naming (global)

A) Canonical legal formulation (approve):

“Valfox Ltd, a company registered in England and Wales (company number 14469638), trading as ‘Equilens’.”

B) Standard footer line (two versions):
• Before trade mark registers:
“© [YEAR] Valfox Ltd, trading as ‘Equilens’. All rights reserved. Equilens™ is a trade mark of Valfox Ltd.”
• After registration certificate issues:
“© [YEAR] Valfox Ltd, trading as ‘Equilens’. All rights reserved. Equilens® is a registered trade mark of Valfox Ltd.”

C) Naming rule (approve):
• Treat “Equilens” as a brand, not a legal entity. Never use “Equilens Ltd” in legal text. (See verification script below.)

D) Product description line (approve):

“FL‑BSA is a software product provided by Valfox Ltd, trading as ‘Equilens’.”

⸻

2.2 Website‑specific legal documents

(a) Privacy Notice — website only (final language to paste)

Scope: website + email enquiries; no analytics, no ads, no forms.

Controller & contact

Controller: Valfox Ltd (trading as “Equilens”). Contact: privacy@equilens.io (or the chosen inbox).
If appointed, add: EU GDPR representative: [name, address, email].

Data we process

(i) Emails you send us; (ii) basic server logs (IP address, user agent, timestamp) for reliability and security.

Purposes & lawful bases

Responding to enquiries (legitimate interests), operating and securing the site (legitimate interests), legal compliance (legal obligation) where applicable.

Sharing

Our email provider and hosting/CDN providers as processors. No sale. No behavioural advertising.

Retention

Enquiry emails retained as needed to handle your request and for routine business record‑keeping; server logs rotated on a short schedule. You can ask us to delete enquiry emails unless we need to keep them to comply with law.

Your rights

Access, rectification, erasure, restriction, objection; UK residents may complain to the ICO; EEA residents may contact their local supervisory authority and/or our EU representative (if appointed).

Cookies

We use only essential cookies (if any) required to deliver the site; see our Cookie Policy for details.

Changes

We will update this notice if our practices change and post the effective date.

Decision: Bases and scope are correct for “no analytics / email‑only”. Add EU representative block once appointed.

⸻

(b) Cookie & Storage Policy — final minimal version

Company name: Use Valfox Ltd (trading as “Equilens”) (fix any “Equilens Ltd”).

Content to paste (short):

We do not use analytics, advertising, or social‑media trackers. If the hosting/CDN sets an essential cookie to deliver pages or provide security (e.g., load balancer affinity, DDoS protection), it is used only for that essential function and not for profiling. If we ever introduce non‑essential cookies (analytics, A/B, ads), we will implement consent controls before enabling them.

Banner rule: With essential‑only cookies, a consent banner is not required under UK PECR; retain a simple cookie page for transparency. If anything beyond essential is added, enable a CMP first.

⸻

(c) Website Terms (non‑product; final outline with key clauses)
• Scope/acceptance: visiting and using the public website only.
• No licence to product: “These terms do not grant a licence to FL‑BSA. Product use is governed by the licence/EULA agreed in AWS Marketplace or a Private Offer.”
• IP & brand: site content © Valfox Ltd; Equilens™/® usage rules; no scraping or logo use without consent.
• Acceptable use: lawful use; no security testing/overload; no reverse engineering of site code.
• Disclaimers: informational only; no advice; site provided “as is.”
• Liability cap: exclude indirect losses; cap at £100 for free website access (reasonable‑use cap).
• Governing law & courts: England & Wales; exclusive or non‑exclusive jurisdiction (pick one—exclusive is fine).
• Contact for notices: legal@equilens.io.

Action: replace any “Equilens Ltd” and remove “provisional” flags.

⸻

(d) DPA Position page — approved structure and wording
• Posture statement:
“We provide a self‑hosted software product (FL‑BSA). We do not receive or process your production datasets in our systems when you deploy the product in your own environment.”
• Roles:
Controller: website enquiries, support mailboxes, sales communications, and vendor management.
Processor: only if you ask us to handle support materials that include personal data (e.g., logs, dumps) or if you enable telemetry to us (off by default).
• DPA triggers:
We will sign our DPA when we process customer personal data as a processor (support logs/telemetry/pilots). No DPA is required for self‑hosted use where no customer personal data is sent to us.
• Consistency: keep wording aligned with your DPA template and AWS listing.

⸻

(e) Responsible‑Use / Acceptable‑Use (final)
• Prohibited uses: (i) unlawful discrimination or contravention of fair‑lending/EEA equality laws; (ii) attempts to evade law/regulation; (iii) use on unlawfully obtained datasets; (iv) uses that violate export/sanctions; (v) high‑risk automated decisioning without appropriate human oversight.
• Customer responsibility: you remain responsible for regulatory compliance, dataset rights, model governance, and human review.
• Research vs production: clarify that demo/evaluation outputs are not production approvals.

⸻

(f) Export & Sanctions (safe baseline)
• Policy clause (to mirror in EULA/POs):
You must comply with all applicable export control and sanctions laws of the UK, EU, and U.S.; you may not use, export, re‑export, transfer, or provide the software to restricted countries or listed parties; you must not use the software for prohibited end‑uses (e.g., WMD).
• Classification note: do not publish a specific ECCN/DUC until confirmed; respond “classification provided on request” and keep a private record.
• Restricted territories: standard UK/EU/US consolidated lists—link to government lists, not bespoke lists.

⸻

2.3 Product claims & disclaimers (approve exact wording)

Approved framing for all pages/listings:
• Supportive, not determinative:
“FL‑BSA provides measurements and reports to support your obligations under applicable fair‑lending and AI laws. Use of FL‑BSA does not guarantee regulatory approval or compliance outcomes. You remain responsible for your decisions and compliance.”
• Evidence claims:
“Generates reproducible artefacts (reports, metrics, SBOMs) suitable for internal audit and regulator dialogue.”
• Benchmarks / thresholds:
Quote only specific, reproducible metrics (e.g., statistical parity difference computed per [method X]) and always include scope & version.
• Ban the absolutes: avoid “regulator‑ready” as a promise; if you keep it, qualify: “regulator‑ready formatting” or “regulator‑ready documentation templates.”

⸻

2.4 Trust Center & security claims (allowable, today)
• Allowed now:
• “External penetration test completed on [date]; remediation tracking in place. Letter available under NDA.”
• “SBOM provided per release; container images are signed (Sigstore/Cosign).”
• “Encryption in transit using TLS; encryption at rest depends on customer environment.”
• Do not claim: SOC 2, ISO 27001, FIPS unless you truly hold them. If you plan CE/CE+, say “Cyber Essentials (in progress)” or link the certificate once awarded.
• Consistency check: align Trust Center statements with the Security Checklist, pen‑test letter, and any commitments in your EULA/DPAs.

⸻

2.5 Open Source & IP (approve + tidy)
• Open‑source notices: ensure Apache‑2.0 components’ NOTICE text is reproduced; MIT/BSD acknowledgments listed; link to SBOM (or “on request”).
• Press/brand usage: add a short brand‑use page: permit nominative references, forbid implication of partnership/endorsement; require correct ™/® usage; forbid altering the logo; reserve right to withdraw permission.

⸻

Minimal Change‑Set Preview (surgical) 1. Global naming fix: replace all “Equilens Ltd” → “Valfox Ltd, trading as ‘Equilens’.” 2. /legal/privacy.html: paste the Privacy text above; add EU rep once appointed. 3. /legal/cookie‑policy.html: replace with the minimal cookie text; remove “provisional”. 4. /legal/tos.html: ensure governing law clause (England & Wales) and not a product licence line. 5. /legal/dpa‑position.html: paste posture and DPA triggers above. 6. /legal/responsible‑use.html: paste prohibited uses and responsibility lines. 7. /legal/export.html: paste export clause; no ECCN on page. 8. Footer: choose ™ until registration; switch to ® after certificate. 9. Trust Center: replace any certification claims with the “allowed now” set; add SBOM/signing lines.

⸻

Verification Plan (exact commands / checks)

# 1) Naming hygiene

rg -n "Equilens Ltd" -- legal/ | wc -l # expect 0
rg -n "trading as ‘?Equilens" -- legal/ | sed -n '1,20p'

# 2) Footer mark usage

rg -n "Equilens®" -- :/ | wc -l # expect 0 before registration
rg -n "Equilens™" -- :/ | sed -n '1,20p'

# 3) Privacy completeness

rg -n "Controller: Valfox Ltd" legal/privacy.html
rg -n "EU representative" legal/privacy.html # present once appointed
rg -n "ICO" legal/privacy.html

# 4) ToS guardrails

rg -n "do not grant a licence to FL-BSA" legal/tos.html
rg -n "England and Wales" legal/tos.html

# 5) Cookie stance

rg -n "no analytics|essential cookies" legal/cookie-policy.html

# 6) Trust claims consistency

rg -n "SOC 2|ISO 27001|FIPS" trust-center/ | wc -l # expect 0 unless truly held
rg -n "SBOM|Cosign|penetration test" trust-center/

Artifacts to snapshot into OUTPUT_DIR/ops/LEGAL-PUB-\*.

⸻

Risk & Rollback

Item Impact Lanes Rollback
Brand naming & ™/® hygiene Low Web/Legal Swap ™↔® on registration
Privacy + EU rep High Legal/Privacy Remove rep if you later establish in the EU
Cookie “essential‑only” posture Med Web Add CMP before any analytics
DPA position clarity Med Legal/Sales Sign DPA only when you act as processor
Trust claims accuracy Med Security/Legal Update as certifications arrive

⸻

Follow‑ups (owner inputs needed)
• Confirm EU representative vendor and contact block.
• Confirm pen‑test letter date and whether Cyber Essentials is in progress.
• Tell me if you want me to push diffs as ready‑to‑commit HTML snippets for each page above.

Assumptions & Unknowns
• You will remain analytics‑free at launch; any change triggers cookie/CMP update.
• No hosted/SaaS component at launch; if that changes, revisit Privacy, DPA posture, and cookie banner.

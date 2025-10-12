Privileged Draft – For Internal Counsel Review
Role: LexPro (GC/Regulatory & DPO) — advisory & assessment only; product decisions remain with owners.

⸻

1) Context & Goal

You shared Website Legal Publication Spec — Equilens (Valfox Ltd) for the marketing site at equilens.io (no analytics, no forms, mailto only). You want (a) a surgical legal/DPO review for EU/UK‑only requirements and (b) the exact commands Codex should run to generate evidence and verify the site content. Delivering both here with minimal diff to your spec.

Authority anchors (EU/UK):
	•	UK company trading disclosures on websites (registered name/number/office & where registered).  ￼
	•	UK GDPR transparency (privacy notice content under Arts. 13/14; ICO guidance).  ￼
	•	PECR cookies (consent for non‑essential; exceptions incl. “strictly necessary”; updated ICO guidance Jul 7 2025).  ￼
	•	security.txt best practice (RFC 9116).  ￼
	•	Open‑source attributions where required (e.g., Apache‑2.0 NOTICE).  ￼
	•	Accessibility (good practice; align with WCAG 2.1 AA; Equality Act “reasonable adjustments” duty applies to service providers).  ￼

⸻

2) Surgical review of your Spec (delta only)

A) Status changes (Must/Should)
	•	L‑07 Imprint / Company Info → Must (was “Should”)
UK trading disclosure rules require websites to show registered number, registered office address, place of registration (e.g., England & Wales) and the fact it’s a limited company. Keep “Valfox Ltd (t/a Equilens)” consistent.  ￼
	•	L‑05 security.txt → keep as internal “Must” (not a legal mandate, but best practice). Cite RFC 9116 in your Trust Center “standards we follow” line.  ￼

B) Clarifications (no new scope)
	•	L‑02 Privacy Notice: add mandatory UK‑GDPR elements explicitly: controller identity & contact, purposes/legal bases, recipients (e.g., hosting/CDN + email provider), retention, international transfers (state none/unknown or specify safeguards), data subject rights, and ICO complaint route. Do not promise analytics controls you don’t run.  ￼
	•	L‑03 Cookie Policy: your “no consent banner” statement is correct only if you truly set no non‑essential cookies (and no similar storage). Keep a plain cookie page anyway; if this changes, deploy a consent banner before enabling analytics.  ￼
	•	R‑03 Open‑Source Notices: make clear that a NOTICE excerpt will be reproduced on the page if any component requires it (e.g., Apache‑2.0 §4). Link to a downloadable SBOM.  ￼
	•	Accessibility: keep “Should”, reference WCAG 2.1 AA as target and Equality Act “reasonable adjustments” duty.  ￼
	•	Export/Sanctions: short advisory is fine; link GOV.UK Strategic Export Controls overview; you are not publishing a licence.  ￼

⸻

3) Minimal content seeds (publish‑safe boilerplates)

Replace bracketed placeholders <>. Keep tone factual. Don’t add tracking scripts or forms.

3.1 /legal/privacy.html — Website Privacy Notice (UK/EU)

<h1>Privacy Notice (Website)</h1>
<p><strong>Controller:</strong> Valfox Ltd (trading as “Equilens”), registered in England & Wales. Contact: <a href="mailto:equilens@equilens.io">equilens@equilens.io</a>.</p>
<p><strong>Scope:</strong> This notice covers the public website <code>equilens.io</code> only (no product telemetry; the Equilens appliance runs entirely in customers’ environments).</p>
<p><strong>What we collect:</strong> (i) Emails you send us; (ii) Minimal server/CDN logs (IP address, user agent, timestamp) for security and reliability.</p>
<p><strong>Purposes & legal bases:</strong> Responding to inquiries and operating a reliable, secure site—our <em>legitimate interests</em>.</p>
<p><strong>Recipients:</strong> Our email provider (<em>e.g., Google Workspace</em>) and hosting/CDN providers as necessary to deliver the site.</p>
<p><strong>Transfers:</strong> If personal data is processed outside the UK/EEA by our providers, we rely on appropriate safeguards (e.g., adequacy or standard contractual clauses). Details available on request.</p>
<p><strong>Retention:</strong> Inquiry emails kept as needed for support/comms and deleted when no longer required; server logs rotate and are retained for &lt;X days&gt;.</p>
<p><strong>Your rights:</strong> UK/EU rights of access, rectification, erasure, restriction, objection, and portability (where applicable). You may lodge a complaint with the UK ICO (<a href="https://ico.org.uk">ico.org.uk</a>).</p>
<p><strong>Cookies:</strong> See our <a href="/legal/cookie-policy.html">Cookie Policy</a>. We do not use analytics or advertising technologies.</p>
<p><strong>Updates:</strong> We may update this notice; the effective date will change accordingly.</p>
<p><em>Effective date:</em> &lt;YYYY‑MM‑DD&gt;</p>

(Aligns with ICO guidance on privacy information content under Arts. 13/14.)  ￼

3.2 /legal/cookie-policy.html

<h1>Cookie & Storage Policy</h1>
<p>We do <strong>not</strong> use analytics, advertising or social media cookies. We do not include third‑party scripts.</p>
<p>Essential operation: our hosting/CDN may set strictly necessary cookies or use storage/logs to deliver pages and protect the service. These are not used for profiling by us.</p>
<p>If we ever add non‑essential cookies or similar technologies, we will deploy a consent mechanism <em>before</em> they are active.</p>
<p>Questions? <a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>

(Consent not required only for strictly necessary/communication exemptions; otherwise PECR consent applies.)  ￼

3.3 /legal/tos.html — Website Terms (not product EULA)

<h1>Website Terms</h1>
<p>This website is provided “as is” for general information about Equilens. It is not legal, compliance or technical advice.</p>
<p>Intellectual property: © Valfox Ltd and respective owners. You may not use our trademarks or logos without permission.</p>
<p>Liability: To the extent permitted by law, we exclude implied warranties and limit liability for website use.</p>
<p>Governing law: England & Wales. Contact: <a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>

3.4 /.well-known/security.txt (RFC 9116)

Contact: mailto:equilens@equilens.io
Policy: https://equilens.io/legal/
Preferred-Languages: en
Expires: 2026-12-31T23:59:59Z

(Place exactly at /.well-known/security.txt.)  ￼

3.5 /legal/accessibility.html (recommended)

<h1>Accessibility</h1>
<p>We aim to conform to <a href="https://www.w3.org/TR/WCAG21/">WCAG 2.1 AA</a>. If you encounter any barriers, email <a href="mailto:equilens@equilens.io">equilens@equilens.io</a> and we will make reasonable adjustments.</p>

(Referencing WCAG 2.1; Equality Act “reasonable adjustments”.)  ￼

3.6 /legal/imprint.html — Company Info (UK Trading Disclosures)

<h1>Company Information</h1>
<p><strong>Registered name:</strong> Valfox Ltd</p>
<p><strong>Company number:</strong> &lt;Number&gt;</p>
<p><strong>Registered office:</strong> &lt;Address&gt;</p>
<p><strong>Place of registration:</strong> England & Wales</p>
<p><strong>Trading as:</strong> Equilens</p>

(Mandatory items for websites under UK trading disclosures.)  ￼

3.7 /legal/responsible-use.html (recommended)

<h1>Responsible Use</h1>
<ul>
  <li>Equilens is a self‑hosted appliance; no customer datasets are sent to us.</li>
  <li>Use responsibly and in line with applicable law and sector guidance.</li>
  <li>Avoid high‑risk deployments without appropriate governance by your organisation.</li>
</ul>

3.8 /legal/dpa-position.html — DPA Position (public summary)

<h1>Data Processing Role – Summary</h1>
<p>For the Equilens appliance, customers deploy and operate within their own environments. Valfox Ltd does not act as a processor for customer datasets processed by the appliance. We act as a controller only for business contact data (e.g., emails sent to us), as described in our Website Privacy Notice.</p>
<p>A standard DPA can be provided <em>on request</em> for procurement workflows.</p>

3.9 /trust-center/index.html — Security & Compliance Summaries

<h1>Trust Center</h1>
<ul>
  <li>Security program overview and responsible disclosure (see security.txt).</li>
  <li>Artefacts (SOC2 letter, recent pen‑test letter, SBOM, signing keys) available <em>on request</em> and, if applicable, under NDA.</li>
</ul>

3.10 /legal/open-source.html — Open‑Source Notices (summary + SBOM)

<h1>Open‑Source Notices</h1>
<p>This site/product uses open‑source software. Licences and attributions are listed in our SBOM (download link) and NOTICE excerpts below where required.</p>
<p>Where a component’s licence (e.g., Apache‑2.0) requires reproduction of a NOTICE file, the relevant text is included here.</p>

(Ensure Apache‑2.0 NOTICE reproduction if applicable.)  ￼

3.11 /legal/export.html (short notice; optional)

<h1>Export & Sanctions Notice</h1>
<p>Use of our software and documentation is subject to applicable UK/EU export control and sanctions laws. You agree to comply with those laws and not to use or export to restricted jurisdictions, users or end‑uses.</p>
<p>For general information see the UK Strategic Export Controls guidance on GOV.UK.</p>

￼

⸻

4) Spec patch (surgical edits)
	•	Table row L‑07: change Publish? → Must; Notes: “Required by UK trading disclosures for websites: registered number, registered office, jurisdiction, limited status.”  ￼
	•	L‑02 Notes: add “Include ICO complaint route & transfer safeguards note if providers process outside UK/EEA.”  ￼
	•	L‑03 Notes: add “No banner only while no non‑essential storage is present; implement consent before enabling analytics/ads.”  ￼
	•	R‑03 Notes: add “Reproduce NOTICE excerpts where required by component licences (e.g., Apache‑2.0 §4).”  ￼

⸻

5) Verification plan (deterministic; no secrets)

Codex run‑book — creates an evidence bundle output/ops/LEGAL-PUB-<TAG>/ with checksums and assertions.

#!/usr/bin/env bash
set -euo pipefail
TAG="${1:-LEGAL-PUB-v1}"
BASE="output/ops/LEGAL-PUB-${TAG}"
mkdir -p "$BASE"

# 1) Inventory of legal pages (filenames only)
find legal -maxdepth 1 -type f -name "*.html" -print | sort >"$BASE/legal_pages.txt"
[ -f .well-known/security.txt ] && cp .well-known/security.txt "$BASE/security.txt.copy" || echo "MISSING .well-known/security.txt" > "$BASE/security_missing.txt"

# 2) Mandatory content assertions (UK)
rg -n "Valfox Ltd" legal/imprint.html >"$BASE/imprint_has_name.txt"
rg -n "Company number|Company Number|number" legal/imprint.html >"$BASE/imprint_has_number.txt"
rg -n "Registered office" legal/imprint.html >"$BASE/imprint_has_office.txt"
rg -n "England & Wales|England and Wales" legal/imprint.html >"$BASE/imprint_has_jurisdiction.txt"

# 3) Privacy notice essentials
rg -n "(Controller|controller).*Valfox" legal/privacy.html >"$BASE/privacy_has_controller.txt"
rg -n "legitimate interests|Legitimate Interests" legal/privacy.html >"$BASE/privacy_has_legal_basis.txt"
rg -n "ICO|ico.org.uk" legal/privacy.html >"$BASE/privacy_has_ico.txt"
rg -n "Cookies|cookie policy|cookie-policy" legal/privacy.html >"$BASE/privacy_links_cookie.txt"

# 4) Cookie policy: no analytics claim present
rg -n "do not use analytics|no analytics" legal/cookie-policy.html >"$BASE/cookie_no_analytics.txt"

# 5) Site hygiene (static): no forms, no third-party scripts on legal pages
rg -n "<form" legal || echo "OK: no forms found" >"$BASE/no_forms_ok.txt"
rg -n "<script[^>]+src=\"https?://" legal || echo "OK: no external script src on legal/" >"$BASE/no_external_scripts_ok.txt"

# 6) security.txt minimally valid (RFC 9116 fields)
rg -n "^Contact: " "$BASE/security.txt.copy" >"$BASE/security_contact.txt"
rg -n "^Expires: " "$BASE/security.txt.copy" >"$BASE/security_expires.txt"

# 7) Hashes (chain of custody)
python3 - <<'PY'
import hashlib, json, os, sys
base=os.environ.get("BASE")
ev={}
for root,_,files in os.walk(base):
  for fn in files:
    p=os.path.join(root,fn)
    with open(p,'rb') as f: ev[os.path.relpath(p,base)]=hashlib.sha256(f.read()).hexdigest()
open(os.path.join(base,'_checksums.json'),'w').write(json.dumps(ev,indent=2,sort_keys=True))
print("Artifacts:", len(ev))
PY
echo "Evidence bundle at: $BASE"

What I will check in the bundle
	•	legal_pages.txt lists /legal/{privacy,cookie-policy,tos,imprint}.html at minimum.
	•	All imprint assertions present (name/number/office/jurisdiction).  ￼
	•	Privacy notice includes controller, legal basis, ICO complaint route, link to cookie policy.  ￼
	•	Cookie policy shows no analytics; security.txt contains Contact & Expires (RFC 9116).  ￼

⸻

6) Risk & rollback

Issue	Risk if omitted	Impact	Lanes touched	Rollback
Missing imprint details on site	Company trading disclosure breach	Low	Web only	Add the page/fields
Over‑promising privacy/consent	Misrepresentation risk	Low	Web only	Edit copy
Cookie banner absent but analytics enabled	PECR enforcement risk	Med	Web only	Add CMP before enabling analytics
No NOTICE where required	OSS licence breach	Low	Web only	Add NOTICE excerpt promptly
security.txt missing	No disclosure channel (not illegal)	Low	Web only	Add /.well-known/security.txt


⸻

7) Owner inputs needed (fill these once; no new features)
	•	Company number and registered office address (for imprint).  ￼
	•	Log retention period (e.g., 30 days) to populate privacy notice.  ￼
	•	Hosting/CDN provider names (privacy recipients; e.g., “Cloudflare Pages” or “Netlify”).  ￼
	•	Email provider confirmation (e.g., Google Workspace) to keep the privacy notice accurate.  ￼
	•	Governing law/venue (suggest England & Wales) for website terms.

⸻

8) Assumptions & unknowns
	•	Site remains static with mailto only; no analytics or external scripts are loaded. If that changes, you must update L‑03 and deploy consent controls before activation.  ￼
	•	The Equilens appliance remains self‑hosted only; no product telemetry to Valfox. If telemetry is added later, public pages must be updated to reflect controller/processor roles.

⸻

One‑line next step

Have Codex create the pages using the seeds in §3, then run the verification script in §5 and share the bundle path. I’ll sign off or provide a tiny diff patch.

Sources of authority (key): UK trading disclosures for websites; ICO privacy‑notice guidance; ICO cookies/PECR (including Jul 7 2025 update); RFC 9116 security.txt; Apache‑2.0 NOTICE; WCAG 2.1 AA & Equality Act accessibility duty.  ￼

Advisory only; product and publication decisions remain with owners.
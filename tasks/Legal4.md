Privileged Draft – For Internal Counsel Review (LexPro)
Scope: Second pass legal/compliance review of equilens.io • Date: 05‑Dec‑2025 • Goal: green‑light for 01‑Jan‑2026

I re‑crawled the live site and checked all key pages. Below are surgical fixes only with exact copy patches and a verification checklist. Citations point to the specific page/line I’m referencing.

⸻

A) Ship‑blockers (fix before launch) 1. EU GDPR representative still a placeholder
• Where: Legal → Privacy Notice shows [Representative Name], [Address], [Email]. ￼
• Patch (replace the block):
EU GDPR representative: [Company name], [full postal address], [rep‑email]. They may be contacted on EU data matters.
• Impact: High (Art. 27 transparency) • Lanes: Privacy/Legal • Rollback: keep “to be appointed” only if the contract truly isn’t signed yet (but that’s non‑ideal at launch). 2. Broken downloads: FL‑BSA Whitepaper & Example Report (404)
• Where: FL‑BSA page “View Whitepaper” and “View Example” both 404. ￼
• Patch: either (a) upload the files at the linked paths, or (b) hide these CTAs until ready and leave “request via email” behind the Contact link.
• Impact: High (buyer trust / dead links) • Lanes: Web/Legal • Rollback: none (links can be re‑enabled when live). 3. “Regulator‑ready” phrasing appears again on FL‑BSA
• Where: “Review the 30‑page regulator‑ready PDF report.” ￼
• Patch (safer framing):
“Review the 30‑page regulator‑oriented report formatted for regulatory dialogue.”
• Impact: Medium (claims) • Lanes: Marketing/Legal • Rollback: revert later if you gain third‑party attestations.

⸻

B) Important clean‑ups (reduce procurement friction) 4. “Unlimited rows & models” needs a contract qualifier
• Where: FL‑BSA → “Enterprise” bullet. ￼
• Patch:
“Scaled rows & models as defined in the contract and validated hardware profile.”
• Impact: Medium • Lanes: Legal/Marketing. 5. Listing/pricing language must match AWS Marketplace reality
• Where: Procurement page says “Annual and multi‑year licensing options” and “Pilot tier (3‑month)”. ￼
• Action: Ensure your Marketplace listing actually exposes those options; if not, change to:
“Contract pricing via AWS Private Offers; Pilot tier available on request.”
• Impact: Medium • Lanes: Product/Tax/Legal. 6. Security contact file (security.txt) – confirm live
• I couldn’t fetch /.well-known/security.txt via the tool; please make sure it’s present with Contact, Policy and Expires fields per RFC 9116. (Examples & standard: securitytxt.org.) ￼
• Impact: Low‑Med • Lanes: Security/Web.

⸻

C) What’s good (keep as‑is)
• Home hero wording fixed (“regulator‑oriented evidence packs and documentation templates”). ￼
• Trust Center disclaimer present (“Mapping only… not certification or legal advice”). ￼
• Delivery model clarified: container as primary, AMI as Alternate (clear labels). ￼
• Privacy/Cookies reflect “no analytics / essential‑only”; ICO link present; effective date visible. ￼ ￼
• DPA Position / Responsible Use read correctly and align with the self‑hosted posture. ￼ ￼
• Open‑source page: now “SBOM and NOTICE on request,” removing prior 404s. ￼
• Imprint uses Valfox Ltd t/a Equilens (no “Equilens Ltd” anywhere). ￼
• Footer shows ™ (correct pre‑registration). ￼

⸻

D) Copy‑ready patches (paste & commit)

1. FL‑BSA → “How it Works” §4
   Replace:

“Review the 30‑page regulator‑ready PDF report. Use the findings to tune models or document Less Discriminatory Alternatives (LDA s).” ￼
With:
“Review the 30‑page regulator‑oriented report formatted for regulatory dialogue. Use the findings to tune models or document Less Discriminatory Alternatives (LDAs).”

2. FL‑BSA → “Enterprise” bullet
   Replace:

“Unlimited rows & models.” ￼
With:
“Scaled rows & models as defined in the contract and validated hardware.”

3. Procurement → “Commercials”
   Replace:

“AWS Marketplace listing with Annual and multi‑year licensing options. Pilot tier (3‑month)…” ￼
With (if not yet live on the listing):
“Contract pricing via AWS Private Offers; Pilot (3‑month) available on request.”

4. Legal → Privacy Notice (EU rep block)
   Replace the placeholder with your rep details. ￼

⸻

E) Verification checklist (5 quick manual checks) 1. Privacy page shows named EU rep (name, full address, email). ￼ 2. FL‑BSA links: “View Whitepaper” and “View Example” open successfully (or are removed). ￼ 3. FL‑BSA wording: “regulator‑oriented” now present. ￼ 4. Procurement pricing section matches your actual Marketplace setup. ￼ 5. /.well-known/security.txt loads and includes Contact and Expires per RFC 9116. ￼

⸻

F) Risk & rollback

Item Impact Lanes Rollback
EU rep placeholder High Privacy/Legal None (must populate)
Doc links 404 High Web/Legal Hide CTAs until files are live
“Regulator‑ready” claim Med Marketing/Legal Re‑add later with third‑party attestations
“Unlimited” claim Med Legal/Marketing Qualify via contract/hardware
Pricing mismatch Med Product/Tax/Legal Update copy when plans change

⸻

G) Heads‑up on prior uploads

Some files you shared earlier (e.g., evidence bundles) have expired in this chat workspace. If you want me to re‑check those artefacts alongside the site (e.g., SBOM/NOTICE, pen‑test letter), please re‑upload and I’ll fold them into the same pass.

⸻

If you want, I can provide the exact HTML diffs for the patches above so you can commit them in one PR.

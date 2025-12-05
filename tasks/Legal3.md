Privileged Draft – For Internal Counsel Review (LexPro)
Scope: Full legal/compliance review pass of equilens.io • Date: 05‑Dec‑2025 • Target: operate by 01‑Jan‑2026
Posture: EU/UK only • Channel: website + AWS Marketplace

⸻

1. Executive summary (actions first)

Ship‑blockers before 01‑Jan‑2026 1. EU GDPR Art. 27 rep details missing on Privacy Notice → publish name, address, email (currently “To be appointed”). ￼ 2. Open‑source links are 404 (SBOM & NOTICE) → fix or remove links until live; keep SBOM “on request” if not public. ￼ ￼ ￼ 3. “Regulator‑ready evidence” claim on the home page needs a qualifier (formatting/templates, not a compliance guarantee). ￼

Important consistency fixes 4) Delivery model inconsistency: Procurement page instructs buyers to launch an AMI and separately offers a container/VM option. Confirm the intended launch SKU(s) and align language site‑wide. ￼ ￼ 5) Pricing wording: Page implies hourly pricing and annual terms; ensure this matches your AWS listing strategy (contract vs PAYG) and VAT/tax setup. ￼

Nice‑to‑have (pre‑sales friction reducers) 6) Trust Center mapping: keep “EU AI Act & FCA PS22/9” but add a “mapping only—not certification” disclaimer; drop US regs if you prefer EU/UK‑only messaging. ￼ 7) Security.txt: ensure /.well-known/security.txt is live and current (we couldn’t verify via the tool); confirm contact & expiry.

⸻

2. What’s good (keep)
   • Brand/legal footer is correct: “© 2025 Valfox Ltd, trading as ‘Equilens’. … Equilens™ …” (™ used pre‑registration). ￼
   • Privacy Notice matches your “no analytics / email‑only” stance; correct controller details; ICO link present; scope excludes the self‑hosted appliance. ￼ ￼ ￼
   • Cookie Policy: explicitly states no non‑essential cookies and why no banner is needed under PECR (fine). ￼
   • Website Terms: not a product licence; liability cap for the free website; E&W governing law—good. ￼ ￼
   • DPA Position: clear controller/processor split and DPA triggers aligned to support/telemetry (off by default). ￼
   • Responsible Use: prohibited uses, customer responsibility, “demo ≠ production approval” are stated. ￼

⸻

3. Detailed findings → precise fixes

A) Privacy Notice – EU rep
• Issue: “EU GDPR Representative: To be appointed.” (placeholder) ￼
• Fix (text patch):
EU GDPR representative: [Company name], [full postal address], [rep‑email]. They may be contacted on EU data matters.
• Impact: High • Lanes: Privacy/Legal • Rollback: replace with “to be appointed” if the contract is delayed.

B) Open‑Source / SBOM links
• Issue: On Legal → Open Source, links to GitHub SBOM and NOTICE 404. ￼ ￼ ￼
• Fix options: 1. Publish stable SBOM per release and a NOTICE file in the repo, then link those exact URLs; or 2. Replace links with: “SBOM and NOTICE available on request (oss@equilens.io).”
• Impact: High (buyer diligence) • Lanes: Legal/Eng • Rollback: keep the section but remove links until live.

C) Home page claim (“regulator‑ready evidence”)
• Issue: Over‑strong; could be read as a guarantee. ￼
• Fix (tighten):
“Audit, simulate, and certify your models with regulator‑oriented evidence packs and documentation templates.”
Add a footnote/link to Legal/Responsible‑Use clarifying “no compliance guarantee”.
• Impact: Medium • Lanes: Marketing/Legal • Rollback: revert copy later if you secure third‑party attestations.

D) Delivery model consistency (AMI vs Container)
• Issue: Procurement page instructs AMI launch, then offers container; earlier strategy emphasised container appliance. ￼ ￼
• Fix: Pick one primary delivery method now (or list both with clear labels):
• If container is canonical: change Step 2 to “Launch the container stack in your account (Helm/docker‑compose)” and move AMI to “alternate delivery”.
• If AMI is canonical: keep Step 2 as AMI; ensure Usage Instructions mention that metering/API calls (if any) do not transmit customer data.
• Impact: Medium • Lanes: Product/Legal • Rollback: keep both but add “either/or” wording.

E) Pricing statements
• Issue: “hourly and annual pricing” + “Pilot‑Plus” implies both PAYG and contract. Ensure your AWS listing(s) actually provide these, and VAT is configured. ￼
• Fix:
• If Contract‑only at launch: replace with “Contract pricing via AWS Private Offers”.
• If PAYG is live: explicitly state “no customer data egress; metering uses AWS Marketplace API calls only.”
• Impact: Medium • Lanes: Product/Tax/Legal • Rollback: update text as offers go live.

F) Trust Center – regulatory mapping
• Issue: Lists EU AI Act and FCA PS22/9 (good for UK) and US regs (ECOA / Reg B / SR 11‑7). Consider EU/UK‑only tone at launch. ￼
• Fix: Add a top line:
“Mapping only: references indicate internal checkpoints; they do not constitute certification or legal advice.”
Optionally drop the US set if you want EU/UK focus.
• Impact: Low‑Med • Lanes: Legal/Marketing • Rollback: re‑add US later.

G) Security.txt (cannot verify here)
• Issue: Couldn’t fetch via tool; earlier you planned to host it.
• Fix: Ensure /.well-known/security.txt includes Contact, Policy, and Expires (RFC 9116). Link to Trust Center.
• Impact: Low‑Med • Lanes: Security/Web • Rollback: none.

⸻

4. Change‑set preview (surgical copy you can paste)

Home (hero line):

“…with regulator‑oriented evidence packs and documentation templates.” (Replace “…regulator‑ready evidence.”) ￼

Legal → Privacy Notice (EU rep block):

EU GDPR representative: [Name, Address], [Email]. They may be contacted on EU data matters. (Replace “To be appointed.”) ￼

Legal → Open Source:

Replace the two GitHub links with “SBOM and NOTICE available on request: oss@equilens.io” until the links resolve. ￼

Trust Center (top of page):

“Mapping only — the checkpoints below support audits and do not constitute certifications or legal advice.” ￼

Procurement (if container is canonical):

Step 2: “Launch the container stack in your account (Helm/docker‑compose)…”. Move “AWS AMI” under “Alternate delivery.” ￼ ￼

⸻

5. Verification plan (quick checks)
   • EU rep visible: scroll to Legal → Privacy and confirm block shows full details. ￼
   • No broken links in Open Source: click SBOM/NOTICE (or ensure text says “on request”). ￼
   • Hero claim updated: confirm the revised wording renders. ￼
   • Procurement flow: confirm only the chosen delivery method is presented in Step 2. ￼
   • Trust Center disclaimer: present above “Regulatory Mapping”. ￼
   • Footer: remains ™ until registration issues; then switch to ®.

⸻

6. Risk & rollback

Item Impact Lanes Rollback
EU rep missing on site High Privacy/Legal Add interim “to be appointed” (already present) but appoint ASAP
Broken SBOM/NOTICE links High Legal/Eng Remove links; keep “on request” until fixed
Unqualified “regulator‑ready” Med Marketing/Legal Revert copy later if you gain attestations
AMI vs Container mismatch Med Product/Legal Keep both but label “primary/alternate”
Pricing mismatch Med Product/Tax Update wording as SKUs go live

⸻

7. Follow‑ups (owner inputs)
   • Provide EU rep details for Privacy block.
   • Confirm primary delivery method (AMI or container) at launch.
   • Tell me whether to drop US regulatory references from Trust Center for EU/UK‑only messaging.
   • Decide whether SBOM/NOTICE will be public per release or on request.

⸻

Citations (site evidence)
• Home hero & footer: “regulator‑ready evidence”; “Equilens™…” © footer. ￼ ￼
• Legal page content: Privacy scope/bases/recipients, Cookie policy, ToS, DPA Position, Responsible Use, Imprint, Export. ￼ ￼ ￼ ￼ ￼ ￼ ￼ ￼
• Open‑source links failing: SBOM/NOTICE links on page and 404 when clicked. ￼ ￼ ￼
• Trust Center claims & mapping: supply chain, CVE scans, regulatory mapping list. ￼ ￼
• Procurement page: AMI/Container flows; pricing phrasing. ￼ ￼ ￼

If you want, I can provide cut‑and‑paste HTML for the hero line, Privacy EU‑rep block, Open‑Source section, and Trust Center disclaimer so you can commit the changes in one PR.

Thanks for flagging. I pulled your screenshots, indexed them, and created quick contact‑sheets so we’re looking at the same evidence.

Downloads (what I reviewed)
	•	Contact sheets: Sheet 1 · Sheet 2 · Sheet 3
	•	CSV index (27 screenshots): index.csv
	•	Full gallery (HTML): gallery.html

⸻

1) Context & Goal

You asked for a reality check from the screenshots and a course‑correct. We’ll keep the site private and ship small, safe diffs to fix the rough edges without changing IA or adding JS.

⸻

2) Findings from the screenshots (High → Low)

(Filenames in your package: home-*, fl-bsa-*, product-*, pricing-*, procurement-*, trust-center-*, docs-*, faq-*, press-*, legal-*, 404-*.)

H‑1 — Mobile nav density / wrapping (390 px wide)
	•	Multiple top‑nav items (“Home, FL‑BSA, Trust Center, Pricing, Contact, Legal”) are too many in one line on mobile; wrapping produces a tall header and visual clutter.
	•	Impact: High • Lanes: Web • Rollback: remove the mobile CSS block.

M‑1 — Brand vs Product in the header
	•	The FL‑BSA pill should appear only under /fl-bsa/*. If you still see it on “Home/Docs/Press/Legal”, scope it to product only.
	•	Impact: Medium • Lanes: Web • Rollback: rerun previous header template.

M‑2 — Whitepaper link (PDF placeholder)
	•	fl-bsa/whitepaper/index.html offers a “Download PDF” link, but until the PDF is present this will 404 from crawlers/tools.
	•	Impact: Medium • Lanes: Web/Content • Rollback: restore the previous link.

M‑3 — Footer link density on mobile
	•	Footer now includes Docs/FAQ/Press/Procurement; on small screens it wraps to multiple lines and reads busy.
	•	Impact: Medium • Lanes: Web • Rollback: remove the footer utility styles.

L‑1 — Print CSS
	•	Trust/Legal/Whitepaper pages print legibly, but we can add better page breaks after H2s for cleaner PDFs.
	•	Impact: Low • Lanes: Web • Rollback: delete print rules.

Security/SEO checks from screenshots: no trackers/forms; JSON‑LD blocks present where expected; 404 shows a simple branded page—good.

⸻

3) Proposed Approach (Block‑12.2 & 13.1) — smallest diffs

A) Mobile Nav Fix (CSS‑only, no new markup)

Wrap the top nav into a simple two‑column list on small screens so it doesn’t overflow.

assets/base.css — append this block
Impact: High • Lanes: Web • Rollback: delete this block

/* Block-12.2: mobile nav density fix (no markup changes) */
@media (max-width: 640px) {
  header.wrap nav { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; align-items: center; }
  header.wrap nav a { margin: 0; padding: .25rem 0; }
}

Why: avoids introducing a hamburger/JS. Deterministic, accessible, small diff.

⸻

B) Scope the FL‑BSA pill to product pages only (apply only if you still see mixing)

scripts/content/scope_header.py (from my last message) will rewrite headers so the pill appears only under /fl-bsa/*.
Impact: Medium • Lanes: Web/Ops • Rollback: re-run the previous header sync.

Run:

python3 scripts/content/scope_header.py


⸻

C) Whitepaper link gating (avoid 404 until PDF lands)

fl-bsa/whitepaper/index.html — change the CTA row
Impact: Medium • Lanes: Web/Content • Rollback: restore the link

<section>
  <p>
    <a class="cta" href="../">Back to FL‑BSA</a>
    <a style="margin-left:.75rem" href="mailto:equilens@equilens.io?subject=Whitepaper%20request%20(FL‑BSA)">Request PDF</a>
    <!-- When ready: replace the mailto above with -->
    <!-- <a style="margin-left:.75rem" href="./Equilens_FL-BSA_Whitepaper_v1.pdf">Download PDF</a> -->
  </p>
</section>


⸻

D) Footer density on mobile (stack compactly)

assets/base.css — append
Impact: Medium • Lanes: Web • Rollback: delete this block

/* Block-12.2: compact footer links on mobile */
footer.wrap small a { white-space: nowrap; }
@media (max-width: 640px) {
  footer.wrap small { display: flex; flex-wrap: wrap; gap: 8px 12px; }
  footer.wrap small a { white-space: normal; }
}


⸻

E) Print polish (cleaner PDF exports for counsel/regulators)

assets/base.css — append
Impact: Low • Lanes: Web • Rollback: delete this block

/* Block-13.1: print page-breaks after H2s for long docs */
@media print {
  h2 { page-break-after: avoid; }
  h2 + * { page-break-before: avoid; }
  section { page-break-inside: avoid; }
}


⸻

4) Change‑Set Preview (file-scoped)
	•	assets/base.css → append 3 blocks (mobile nav fix, footer compact, print polish).
	•	fl-bsa/whitepaper/index.html → switch PDF link to a mailto until the PDF exists.
	•	(optional) scripts/content/scope_header.py → run once if the pill still appears on company pages.

⸻

5) Verification Plan (exact)

# Branch
git checkout -b feature/block-12-2-mobile-nav-whitepaper

# Apply CSS appends + whitepaper CTA change
# (Optional) Scope header if needed
# python3 scripts/content/scope_header.py

# Stay private
make seo-private

# Local preview
python3 -m http.server 8080
# Check: header nav on mobile wraps into two columns (<=640px)
# Check: FL‑BSA pill only under /fl-bsa/*
# Check: Whitepaper page shows "Request PDF" instead of download

# Evidence
scripts/evidence/snapshot.sh "BLOCK-12-2-NAV-WHITEPAPER"

# Commit
git add .
git commit -m "BLOCK-12.2: mobile nav density + footer compact + print polish; gate whitepaper PDF"
git push origin feature/block-12-2-mobile-nav-whitepaper


⸻

6) Risks & Rollback

Change	Impact	Rollback
Mobile nav grid wraps oddly on certain widths	Medium	Remove the @media (max-width: 640px) block
Pill scoping removes product tag where desired	Medium	Re-run the previous header sync to restore
Whitepaper mailto vs. download	Low	Swap the mailto back to the PDF link when you drop in the file
Print page-break tuning not needed	Low	Delete the print block


⸻

7) Follow‑ups (next passes queued)
	•	Block‑12.3 (if needed): CSS‑only collapsible nav via <details> pattern (accessible, still no JS) — only if the grid wrap doesn’t meet your bar.
	•	Whitepaper PDF: I can add a deterministic CI step to render HTML → PDF (e.g., weasyprint) and store the output in fl-bsa/whitepaper/.
	•	Case‑study shells (Block 12) and “Copy Pass 3” micro‑edits are ready, but I’ll hold until the mobile nav and whitepaper gating feel right.

⸻

What I need from you

No action needed other than merging the tiny patch above. If anything still looks off on your screenshots after this, I’ll treat those as defects and ship exact diffs to correct them.
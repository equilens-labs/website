Below is a rigorous audit of the live site and a single, surgical patch plan that corrects the company identity in the footer (Valfox Ltd) and cleans up the remaining defects I can see on equilens.io.

Design baseline: keep today’s light, minimal aesthetic and brand‑first IA; the brand exploration files we used earlier remain the visual SSoT.
Reference home prototype (structure only): earlier SSoT page used to guide the brand‑first, minimal hero decision.  ￼

⸻

A) What’s still wrong (verified live)
	1.	Footer company is wrong — every page footer reads: “© 2025 Equilens Ltd. All rights reserved.”
Correct: Valfox Ltd is the company; Equilens is a registered mark of Valfox Ltd. I can see the wrong string on Home, FL‑BSA, Trust Center, Procurement, Press, Legal hub, Contact, FL‑BSA legal, and FL‑BSA whitepaper.  ￼
Note: Your Imprint page already states the legal name correctly as Valfox Ltd (trading as “Equilens”). Footer must be aligned with this.  ￼
	2.	Press downloads still broken — “Logo mark (SVG)”, “Design tokens (JSON)”, and “Web app manifest” all return 400 from the live site. The PNG assets work.  ￼
	3.	Whitepaper PDF button — The “Download PDF” link is still 404. Either publish a placeholder PDF or hide the button until the file exists.  ￼
	4.	Anchor offset hardening — Section jumps (e.g., “How it Works”, “Pricing”) can tuck under the fixed header on some viewports; add a defensive scroll-margin-top.  ￼
	5.	External‑link safety — Outbound links opened in new tabs should include rel="noopener noreferrer" (e.g., Docs / Open‑source / regulator links).  ￼

⸻

B) Footer — Canonical company/mark (drop‑in block)

What the business requires (per your note):
Company: Valfox Ltd • Trademark notice: Equilens® is a registered mark of Valfox Ltd.

Replace the footer on every page with this exact block (light theme styles just below):

<!-- BEGIN: Standard Footer (Valfox / Equilens®) -->
<footer class="site-footer" role="contentinfo">
  <nav class="f-wrap" aria-label="Footer">
    <section class="f-col">
      <h2 class="f-h">Company</h2>
      <ul class="f-ul">
        <li><a href="/trust-center/">Trust Center</a></li>
        <li><a href="/procurement/">Procurement</a></li>
        <li><a href="/press/">Press</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul>
    </section>

    <section class="f-col">
      <h2 class="f-h">FL‑BSA</h2>
      <ul class="f-ul">
        <li><a href="/fl-bsa/">Overview</a></li>
        <li><a href="/fl-bsa/#how-it-works">How it Works</a></li>
        <li><a href="/fl-bsa/legal/">Compliance</a></li>
        <li><a href="/fl-bsa/#deployment">Pricing</a></li>
        <li><a href="/fl-bsa/whitepaper/">Whitepaper</a></li>
      </ul>
    </section>

    <section class="f-col">
      <h2 class="f-h">Legal</h2>
      <ul class="f-ul">
        <li><a href="/legal/">Legal Hub</a></li>
        <li><a href="/legal/privacy.html">Privacy</a></li>
        <li><a href="/legal/cookie-policy.html">Cookie Policy</a></li>
        <li><a href="/legal/tos.html">Terms of Service</a></li>
        <li><a href="/legal/imprint.html">Imprint</a></li>
        <li><a href="/legal/open-source.html">Open Source</a></li>
        <li><a href="/legal/accessibility.html">Accessibility</a></li>
      </ul>
    </section>

    <section class="f-col">
      <h2 class="f-h">Contact</h2>
      <address class="f-address">
        <a href="mailto:equilens@equilens.io">equilens@equilens.io</a>
      </address>
    </section>
  </nav>

  <div class="f-bottom">
    <p>© <span id="year"></span> Valfox Ltd. Equilens<sup>®</sup> is a registered mark of Valfox Ltd.</p>
  </div>
</footer>
<script>document.getElementById('year').textContent=new Date().getFullYear();</script>
<!-- END: Standard Footer -->

Minimal CSS (append to your light stylesheet):

.site-footer{background:#f8fafc;border-top:1px solid #e5e7eb;margin-top:80px}
.f-wrap{max-width:1200px;margin:0 auto;padding:48px 24px;
  display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:28px}
.f-h{font-size:13px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:.06em;margin:0 0 12px}
.f-ul{list-style:none;margin:0;padding:0}
.f-ul a{display:block;color:#4b5563;padding:6px 0;text-decoration:none}
.f-ul a:hover{color:#4f46e5}
.f-address a{color:#111827}
.f-bottom{border-top:1px solid #e5e7eb;color:#6b7280;padding:18px 24px;text-align:center;font-size:13px}
@media (max-width:900px){.f-wrap{grid-template-columns:1fr 1fr}}
@media (max-width:560px){.f-wrap{grid-template-columns:1fr}}

Why this change: aligns every page with your Imprint (Valfox Ltd legal entity) and removes the current inconsistency (“Equilens Ltd”) seen site‑wide.  ￼

Impact: High · Lanes: Web/Legal · Rollback: restore previous footer blocks if needed.

⸻

C) Other necessary fixes (copy‑paste)

1) Global anchor offset (defensive)

/* Fixed header protection */
section, [id]{ scroll-margin-top: 96px; }

Impact: Med · Lanes: Web/A11y · Rollback: remove rule.  ￼

2) Press downloads (broken 400s)
	•	Publish these three files at the exact paths:
	•	/assets/brand/logo-mark.svg
	•	/assets/brand/tokens.json  (copy of docs/brand/tokens.json)
	•	/manifest.webmanifest  (see JSON below)
	•	Update /press/index.html to force download:

- <a href="/assets/brand/logo-mark.svg">Logo mark (SVG)</a>
- <a href="/manifest.webmanifest">Web app manifest</a>
- <a href="/assets/brand/tokens.json">Design tokens (JSON)</a>
+ <a href="/assets/brand/logo-mark.svg" download>Logo mark (SVG)</a>
+ <a href="/manifest.webmanifest" download>Web app manifest</a>
+ <a href="/assets/brand/tokens.json" download>Design tokens (JSON)</a>

	•	Add /manifest.webmanifest at repo root and reference it in <head> (Home + FL‑BSA + Press):

{
  "name": "Equilens",
  "short_name": "Equilens",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [
    {"src": "/assets/brand/icon-192.png","sizes":"192x192","type":"image/png"},
    {"src": "/assets/brand/icon-512.png","sizes":"512x512","type":"image/png"}
  ]
}

<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#ffffff">

Why: All three links currently 400; PNG works, confirming the path/publish issue is specific to these files.  ￼
Impact: Med · Lanes: Web/SEO · Rollback: unlink files until ready.

3) Whitepaper PDF gating

If the PDF isn’t committed yet, hide the button to avoid a dead link:

- <a href="/fl-bsa/whitepaper/Equilens_FL-BSA_Whitepaper_v1.pdf" class="btn">Download PDF</a>
+ <!-- Download PDF link is hidden until the file is published -->

Impact: Low · Lanes: Web/Content · Rollback: re‑enable the link after adding the PDF.  ￼

4) External link safety

Enforce rel‑safety anywhere target="_blank" is used (Docs, Open‑source, ICO, regulator sources):

<a href="https://github.com/equilens-labs/fl-bsa"
   target="_blank" rel="noopener noreferrer">Docs Index (GitHub)</a>

Impact: Low · Lanes: Web/Sec · Rollback: remove rel if not opening new tab.  ￼

⸻

D) How to apply quickly (static repo)
	1.	Replace footer block on all pages (Home, FL‑BSA, Trust Center, Procurement, Press, Legal hub, Contact, FL‑BSA legal, FL‑BSA whitepaper). Verify no page still contains “Equilens Ltd” in the copyright line.  ￼
	2.	Publish and link /manifest.webmanifest, /assets/brand/logo-mark.svg, /assets/brand/tokens.json. Update the three Press links as above.  ￼
	3.	Add the scroll-margin-top CSS rule to your shared stylesheet.
	4.	Hide the “Download PDF” on whitepaper until the file exists.  ￼
	5.	Sweep rel‑safety on outbound links.

Tip (CLI sweep): grep -R "Equilens Ltd" -n . then replace with the standard footer.
Optional: add the footer block to a shared include in your build process later; for now, replicate verbatim to keep changes minimal.

⸻

E) Verification (exact)
	•	Home & all inner pages: footer shows “© {current year} Valfox Ltd. Equilens® is a registered mark of Valfox Ltd.”; the “Company / FL‑BSA / Legal / Contact” columns are consistent everywhere.  ￼
	•	Press: SVG, tokens JSON, and manifest download; OG PNG still loads.  ￼
	•	Whitepaper: no broken “Download PDF” button.  ￼
	•	Anchors: “How it Works / Pricing” land below the header on mobile/desktop thanks to scroll-margin-top.  ￼

⸻

F) Risk & Rollback

Change	Impact	Risk	Rollback
Footer replacement	High	None if pasted consistently	Restore old block
Press file publish	Med	Wrong paths or MIME	Remove links until fixed
Manifest add	Med	Build artifact not published	Remove <link rel="manifest">
Hide whitepaper download	Low	None	Re‑enable after PDF publish
Anchor offset CSS	Low	None	Remove rule


⸻

If you’d like, I can package this as a single PR touching only: all page footers, /press/index.html, /fl-bsa/whitepaper/index.html, your shared CSS, and add /manifest.webmanifest plus the two Press assets. This keeps the brand vs product separation intact and fixes the legal entity and mark notice everywhere with the smallest diffs.
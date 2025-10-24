Below is a precise audit of the live site plus a single patch plan that (a) fixes the front‑page copy (“Introducing FL‑BSA”), (b) replaces the heavy footer with a slim, brand‑correct micro‑footer (Valfox Ltd / mark notice), (c) stops the top bar from going dark on scroll, and (d) cleans up spacing/alignment and the broken Press/manifest links.

What I verified on the live site
• Home still says “Introducing — Equilens” (you asked for Introducing FL‑BSA) and uses the brand‑first IA.  ￼
• Procurement footer is inconsistent: “© 2025 Equilens Ltd” (wrong entity). Other pages already show Valfox Ltd + mark notice.  ￼
• Press downloads for SVG / tokens.json / manifest still 400 (broken).  ￼
• Site now follows the light, minimal direction (good); keep that aesthetic and avoid dark scroll effects.  ￼
• The current brand exploration/colors we’ve used before remain the reference for accent usage.  ￼

⸻

Fix plan (smallest diffs, copy‑paste)

1) Home hero → Introduce FL‑BSA, minimal & centered

File: /index.html
Change: Replace the “Introducing — Equilens” block with the FL‑BSA variant; keep the short explainer + one primary CTA to /fl-bsa/.

<!-- Replace the hero text block on Home -->
<h2 class="eyebrow">Introducing</h2>
<h1 class="brand-title">FL‑BSA</h1>
<p class="lead">
  Our self‑hosted fair‑lending bias‑simulation appliance. Generates synthetic borrower cohorts
  (with loan decisions) to measure disparate impact and produce regulator‑ready evidence —
  with <strong>no customer data leaving your VPC</strong>.
</p>
<p class="cta-row">
  <a class="btn-primary" href="/fl-bsa/">Explore FL‑BSA</a>
</p>

CSS add (shared stylesheet, e.g., assets/base.css):

.eyebrow{font:600 12px/1.2 system-ui; letter-spacing:.14em; text-transform:uppercase; color:#6b7280; margin-bottom:12px}
.brand-title{font-weight:700; letter-spacing:-.02em; font-size:clamp(40px,6vw,64px); margin:0 0 16px; color:#111827}
.lead{max-width:64ch; margin:0 auto 24px; color:#374151; font-size:clamp(16px,1.6vw,18px); line-height:1.55}
.cta-row{margin-top:8px}

Impact: High · Lanes: Web/Content · Rollback: revert the block to previous H1.

⸻

2) Stop top bar turning dark on scroll (keep light header)

Your previous prototype included a JS scroll darkener (good for dark themes, not for this site)  ￼. Remove it and enforce a light, translucent white header with a hairline border.

HTML: delete any window.addEventListener('scroll', ...) that mutates navbar styles.

CSS (add/update):

/* Light, fixed header (no darkening) */
.site-nav{position:sticky; top:0; z-index:1000; background:rgba(255,255,255,.86);
  -webkit-backdrop-filter:saturate(160%) blur(10px); backdrop-filter:saturate(160%) blur(10px);
  border-bottom:1px solid #e5e7eb}
.site-nav a{color:#111827}
.site-nav a:hover{color:#4f46e5}

Impact: Med · Lanes: Web/Design · Rollback: restore the scroll listener.

⸻

3) Slim micro‑footer (brand‑correct, less visual weight)

Replace the bulky block with a compact two‑row footer; keep brand/product separation but remove visual bulk.

Markup for all pages (drop‑in):

<!-- BEGIN micro-footer -->
<footer class="micro-footer" role="contentinfo">
  <div class="mf-wrap">
    <nav class="mf-links" aria-label="Footer">
      <a href="/trust-center/">Trust Center</a>
      <a href="/procurement/">Procurement</a>
      <a href="/press/">Press</a>
      <span class="sep" aria-hidden="true">•</span>
      <a href="/legal/">Legal Hub</a>
      <a href="/legal/privacy.html">Privacy</a>
      <a href="/legal/cookie-policy.html">Cookies</a>
      <a href="/contact/">Contact</a>
    </nav>
    <p class="mf-legal">
      © <span id="y"></span> Valfox Ltd. Equilens<sup>®</sup> is a registered mark of Valfox Ltd.
    </p>
  </div>
</footer>
<script>document.getElementById('y').textContent = new Date().getFullYear();</script>
<!-- END micro-footer -->

CSS (add):

.micro-footer{margin-top:64px; border-top:1px solid #e5e7eb; background:#fff}
.mf-wrap{max-width:1120px; margin:0 auto; padding:16px 20px}
.mf-links{display:flex; flex-wrap:wrap; gap:12px; justify-content:center}
.mf-links a{color:#6b7280; text-decoration:none; font-size:14px}
.mf-links a:hover{color:#4f46e5}
.mf-legal{margin-top:8px; text-align:center; color:#9ca3af; font-size:12px}
.sep{color:#d1d5db}
@media (max-width:600px){ .mf-links{gap:10px} }

Ensure Procurement page replaces its wrong line (“© 2025 Equilens Ltd”) with this block. I confirmed that page is still incorrect.  ￼

Impact: High · Lanes: Web/Legal · Rollback: restore prior footer.

⸻

4) Spacing & alignment guardrails (one CSS patch)

Small, global utilities remove the remaining misalignment/stacking issues across pages.

CSS (append once, e.g., assets/base.css):

/* Containers & rhythm */
.container{max-width:1120px; margin:0 auto; padding:0 20px}
.section{padding:clamp(48px,8vw,96px) 0}
.stack>*+*{margin-top:clamp(12px,1.8vw,20px)}
/* Headings */
h1,h2,h3{line-height:1.15; color:#111827}
h2{font-size:clamp(24px,3vw,32px); margin:0 0 12px}
h3{font-size:clamp(18px,2.5vw,22px); margin:0 0 8px}
/* Lists inside content blocks */
.content ul{margin:8px 0 16px 1.2rem}
.content li{margin:6px 0}
/* Anchor offset under sticky header */
[id]{scroll-margin-top:96px}

Impact: Med · Lanes: Web/A11y · Rollback: remove this block.

⸻

5) Press links & PWA manifest (fix 400s)

I re‑checked: SVG, tokens.json, and manifest still 400. Keep the paths below and make sure the files exist in the published artifact; switch Press links to download.  ￼

Add files at these exact paths:
	•	/assets/brand/logo-mark.svg  (SVG logo mark)
	•	/assets/brand/tokens.json   (copy of docs/brand/tokens.json)
	•	/manifest.webmanifest       (JSON below)

/manifest.webmanifest:

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

Head tag (Home + FL‑BSA + Press):

<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#ffffff">

Press page links (e.g., /press/index.html):

<ul class="assets">
  <li><a href="/assets/brand/logo-mark.svg" download>Logo mark (SVG)</a></li>
  <li><a href="/assets/brand/og-default-light.png" download>OG banner (PNG 1200×630)</a></li>
  <li><a href="/manifest.webmanifest" download>Web app manifest</a></li>
  <li><a href="/assets/brand/icon-512.png" download>Logo 512×512 (PNG)</a></li>
  <li><a href="/assets/brand/tokens.json" download>Design tokens (JSON)</a></li>
</ul>

Impact: Med · Lanes: Web/SEO/Brand · Rollback: temporarily remove dead links.

⸻

6) Whitepaper PDF gating

If the PDF isn’t ready, hide the button to avoid a dead link; show only the outline text.

<!-- /fl-bsa/whitepaper/index.html -->
<!-- Hide Download PDF until file exists at /fl-bsa/whitepaper/Equilens_FL-BSA_Whitepaper_v1.pdf -->
<!-- <a class="btn" href="/fl-bsa/whitepaper/Equilens_FL-BSA_Whitepaper_v1.pdf">Download PDF</a> -->

Impact: Low · Lanes: Web/Content · Rollback: re‑enable once PDF is published.

⸻

7) External‑link safety (quick sweep)

When opening in a new tab, always add rel‑safety:

<a href="https://github.com/equilens-labs/fl-bsa" target="_blank" rel="noopener noreferrer">
  Docs (GitHub)
</a>

Impact: Low · Lanes: Web/Sec · Rollback: remove rel if same‑tab.

⸻

Front page (final content & IA checklist)
	•	Header (brand‑only): Equilens · FL‑BSA · Trust Center · Procurement · Press · Legal · Contact (this is what’s live).  ￼
	•	Hero copy: Introducing — FL‑BSA (not Equilens) + one CTA to /fl-bsa/ (done in §1).
	•	Below the hero (optional, compact): two 3‑bullet cards — “Why banks use FL‑BSA” and “Designed for regulators” (same content you have on the FL‑BSA page; keep it brief).
	•	No product nav in the top bar beyond the single FL‑BSA item (keeps brand/product separation).  ￼

⸻

Verification (exact)
	1.	Home: hero reads Introducing — FL‑BSA; CTA goes to /fl-bsa/.  ￼
	2.	Header: remains light while scrolling (no darkening).
	3.	Footer: all pages show the micro‑footer with © {year} Valfox Ltd. Equilens® …. Procurement now fixed.  ￼
	4.	Press: SVG/tokens/manifest download; OG PNG still loads.  ￼
	5.	Whitepaper: no dead “Download PDF” link.
	6.	Anchors: sections land below the header thanks to scroll-margin-top.
	7.	External links: if using target="_blank", they include rel="noopener noreferrer".

⸻

Impact / lanes / rollback (at a glance)

Change	Impact	Lanes	Rollback
Hero copy to FL‑BSA	High	Web/Content	Revert hero block
Remove dark scroll header	Med	Web/Design	Restore scroll JS
Micro‑footer (Valfox/mark)	High	Web/Legal	Restore old footer
Spacing/alignment CSS	Med	Web/A11y	Remove CSS block
Press assets + manifest	Med	Web/Brand/SEO	Unlink files
Whitepaper gating	Low	Web/Content	Re‑enable link
External link safety	Low	Web/Sec	Remove rel


⸻

Notes & references
	•	The light, minimal direction and accent palette are aligned with the brand exploration assets we used as SSoT.
	•	The original dark prototype (with on‑scroll darkening) is not suitable for the current aesthetic and should remain retired.  ￼

If you paste the snippets above into the repo (Home hero, header CSS, micro‑footer, spacing utilities, Press links + files, manifest, whitepaper gating), the site will look tighter, lighter, and legally correct (Valfox/mark) while preserving the brand‑first IA.
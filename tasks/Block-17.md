You’re right. Let’s zero‑in on design only and make the site look tight and professional. Below is a focused, comprehensive design workstream with concrete HTML/CSS you can drop in now. Palette/tones stay aligned with your brand explorations (slate neutrals + violet/indigo accent).  ￼  ￼

⸻

0) Design tokens (single source)

Impact: High · Lanes: Design/Web · Rollback: restore assets/base.css

Append to assets/base.css (top or tokens section):

/* === Equilens design tokens === */
:root{
  /* color */
  --eql-bg: #ffffff;
  --eql-bg-alt: #f8fafc;
  --eql-text: #0f172a;         /* slate900 */
  --eql-muted: #64748b;        /* slate */
  --eql-accent: #6D28D9;       /* violet */
  --eql-accent-2: #6366F1;     /* indigo */
  --eql-border: #e2e8f0;

  /* type scale */
  --eql-h1: clamp(34px, 5vw, 48px);
  --eql-h2: clamp(24px, 3.2vw, 32px);
  --eql-h3: 20px;
  --eql-lead: clamp(16px, 1.8vw, 18px);
  --eql-body: 16px;

  /* layout */
  --eql-container: 1120px;
  --eql-section: 72px;       /* standard vertical rhythm */
  --eql-section-tight: 48px;
  --eql-section-loose: 96px;

  /* components */
  --eql-radius: 12px;
  --eql-shadow: 0 8px 24px rgba(0,0,0,.04);
}

/* base */
html,body{ background:var(--eql-bg); color:var(--eql-text); }
.container{ max-width:var(--eql-container); margin-inline:auto; padding-inline:20px; }
.section{ padding-block:var(--eql-section); }
.section--alt{ background:var(--eql-bg-alt); }
.lead{ color:var(--eql-muted); font-size:var(--eql-lead); }

/* headings */
h1{ font-size:var(--eql-h1); font-weight:700; letter-spacing:-.01em; }
h2{ font-size:var(--eql-h2); font-weight:700; letter-spacing:-.01em; }
h3{ font-size:var(--eql-h3); font-weight:600; }

/* cards */
.card{ border:1px solid var(--eql-border); border-radius:var(--eql-radius); box-shadow:var(--eql-shadow); background:#fff; padding:24px; }

/* buttons */
.btn{ display:inline-block; padding:.7rem 1.1rem; border-radius:10px; font-weight:600; }
.btn-primary{ background:var(--eql-accent); color:#fff; }
.btn-primary:hover{ filter:brightness(.92); }
.btn-ghost{ background:#fff; border:1px solid var(--eql-border); color:var(--eql-text); }
.btn-ghost:hover{ background:#f8fafc; }

/* links & focus */
a{ color:var(--eql-text); text-decoration-color:rgba(100,116,139,.6) }
a:hover{ text-decoration-color:var(--eql-accent) }
:focus-visible{ outline:2px solid var(--eql-accent); outline-offset:2px }

/* kill any leftover gradients from the template */
[class*="bg-gradient-"], .bg-gradient{ background-image:none !important; }


⸻

1) Header / Navigation (one clean pattern)

Impact: High · Lanes: Design/Web · Rollback: revert header block

Replace the header area in every page with this markup (same on all pages):

<header class="site-header">
  <div class="container header-row">
    <a class="brand" href="/">
      <img src="/assets/brand/wordmark.svg" alt="Equilens" width="168" height="52">
    </a>
    <button class="nav-toggle" aria-controls="site-nav" aria-expanded="false">
      <span class="sr-only">Menu</span>
    </button>
    <nav id="site-nav" class="nav" hidden>
      <ul class="nav-list">
        <li><a href="/product/">Product</a></li>
        <li><a href="/fl-bsa/">FL‑BSA</a></li>
        <li><a href="/pricing/">Pricing</a></li>
        <li><a href="/trust-center/">Trust Center</a></li>
        <li><a href="/docs/">Docs</a></li>
        <li><a href="/faq/">FAQ</a></li>
        <li><a class="btn btn-primary" href="/contact/">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>

Add to assets/base.css:

/* header */
.site-header{ background:#fff; border-bottom:1px solid var(--eql-border); }
.header-row{ display:flex; align-items:center; justify-content:space-between; padding-block:14px; }
.nav-toggle{ inline-size:44px; block-size:44px; border:1px solid var(--eql-border); border-radius:8px; background:#fff; display:none; }
.nav[hidden]{ display:none; }
.nav-list{ display:flex; gap:20px; align-items:center; margin:0; padding:0; list-style:none; }
.nav-list a{ padding:8px 6px; display:inline-block; }
@media (max-width: 860px){
  .nav-toggle{ display:block; }
  .nav-list{ display:block; padding-block:12px; }
}

Optional minimal JS for mobile toggle (drop at end of </body> or as /assets/js/nav.js):

<script>
(() => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.toggleAttribute('hidden');
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !nav.hasAttribute('hidden')) {
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('hidden', '');
      btn.focus();
    }
  });
})();
</script>

Why this helps: one consistent header, no template artifacts, clean mobile behavior, clear primary CTA.

⸻

2) Footer (simple, sober, identical everywhere)

Impact: High · Lanes: Design/Web · Rollback: revert footer block

Replace the footer area in every page with:

<footer class="site-footer">
  <div class="container foot-grid">
    <section>
      <h3>Company</h3>
      <ul>
        <li><a href="/press/">Press</a></li>
        <li><a href="/procurement/">Procurement</a></li>
        <li><a href="/trust-center/">Trust Center</a></li>
      </ul>
    </section>
    <section>
      <h3>Legal</h3>
      <ul>
        <li><a href="/legal/privacy.html">Privacy</a></li>
        <li><a href="/legal/cookie-policy.html">Cookie Policy</a></li>
        <li><a href="/legal/tos.html">Terms</a></li>
        <li><a href="/legal/imprint.html">Imprint</a></li>
      </ul>
    </section>
    <section>
      <h3>Resources</h3>
      <ul>
        <li><a href="/legal/open-source.html">Open Source</a></li>
        <li><a href="/legal/accessibility.html">Accessibility</a></li>
      </ul>
    </section>
  </div>
  <div class="container footnote">© Equilens. All rights reserved.</div>
</footer>

Add to assets/base.css:

/* footer */
.site-footer{ border-top:1px solid var(--eql-border); background:#fff; padding-block:48px; }
.foot-grid{ display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; }
.site-footer h3{ font:600 14px/1.2 ui-sans-serif,system-ui; text-transform:uppercase; letter-spacing:.06em; color:#334155; margin:0 0 8px; }
.site-footer ul{ list-style:none; margin:0; padding:0; }
.site-footer a{ color:var(--eql-text); }
.footnote{ padding-top:16px; color:var(--eql-muted); font-size:14px; }
@media (max-width:860px){ .foot-grid{ grid-template-columns:1fr; } }


⸻

3) Heroes (remove “template sheen”, add authority)

Impact: High · Lanes: Design/Web · Rollback: restore hero section

For Home and FL‑BSA heroes, replace the gradient hero section with a plain white block, strong H1, concise lead, and clear CTAs:

<section class="section hero--plain">
  <div class="container">
    <h1>Algorithmic compliance that stands up to regulators</h1>
    <p class="lead">Equilens helps banks evidence fair‑lending compliance with synthetic‑data audits and regulator‑ready reports.</p>
    <div style="margin-top:18px;">
      <a class="btn btn-primary" href="/contact/">Request a pilot</a>
      <a class="btn btn-ghost" href="/fl-bsa/">Explore FL‑BSA</a>
    </div>
  </div>
</section>

If you keep a light alt section next, apply .section--alt to get a calm slate‑tinted backdrop.

⸻

4) Sections & grids (consistent rhythm)

Impact: Med · Lanes: Design/Web · Rollback: remove classes

Use .section on every major block. For simple two‑column feature rows:

<section class="section">
  <div class="container" style="display:grid; grid-template-columns: 1.2fr 1fr; gap:28px;">
    <div class="card">
      <h2>How it works</h2>
      <p class="lead">Upload → Calibrate → Generate → Audit. PDF + JSON manifest—regulator‑ready.</p>
      <ul>
        <li>Dual‑branch calibration (intrinsic vs. amplification)</li>
        <li>Signed evidence bundles and retrieval by task ID</li>
        <li>Prometheus `/metrics` for operational visibility</li>
      </ul>
    </div>
    <div class="card">
      <h3>Designed for regulators</h3>
      <p>Outputs align to ECOA/Reg B, EU AI Act, FCA Consumer Duty.</p>
    </div>
  </div>
</section>


⸻

5) Buttons (one style, everywhere)

Impact: Med · Lanes: Design/Web · Rollback: revert button classes

Swap any leftover theme classes for our .btn, .btn-primary, .btn-ghost (already defined). This instantly normalizes CTAs across pages.

⸻

6) Cards & imagery (tidy, not bubbly)

Impact: Med · Lanes: Design/Web · Rollback: remove .card

Use .card for pricing, trust artifacts, and product highlights; keep radius at 12px, soft shadow. Avoid oversized rounded‑pill styles—this is a banking audience.

⸻

7) Typography (crisp, consistent)

Impact: Med · Lanes: Design/Web · Rollback: restore sizes
	•	H1/H2 use the token scale above.
	•	Max paragraph width ≈ 68ch for comfortable reading (optional rule):

.prose{ max-width:68ch; }


⸻

8) Navigation cues & link treatment

Impact: Low · Lanes: Design/Web · Rollback: remove rules

Add a subtle active‑link underline (per‑page set with aria-current="page"):

.nav-list a[aria-current="page"]{ text-decoration: underline; text-decoration-thickness:2px; text-underline-offset:6px; text-decoration-color: var(--eql-accent); }


⸻

9) Optional: wordmark choice (works with current palette)

Impact: Low · Lanes: Design/Web · Rollback: swap <img>

Until the final logo is signed off, use a monochrome wordmark (near‑black) with a subtle accent on the i‑dot; it harmonizes with the sober layout and avoids the “FedEx” split problem. You already have candidate vectors from our explorations; either will work with this shell.  ￼  ￼

⸻

Quick page‑by‑page checklist (no code talk—visual only)
	•	Header: same height, same spacing, “Contact” as a primary button.
	•	Hero: white background, strong headline, one line of lead, two CTAs.
	•	Sections: equal vertical rhythm; alternate light section only when helpful.
	•	Cards: same radius/shadow/border; grid gutters consistent.
	•	Links/CTAs: same color/hover everywhere.
	•	Footer: identical columns + footnote on every page.

⸻

Want me to prep patch‑ready snippets per page (Home, Product, FL‑BSA, Pricing, Trust) using the exact HTML you have now? I can produce minimal diffs that only touch header, hero, grids, and footer—purely visual, nothing else.
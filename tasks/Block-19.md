Equilens Website — Implementation (Light Theme · Brand‑First IA)

Ask: Move from dark to a minimal, elegant light theme (white/grey/black + one accent), keep brand‑only main nav on Home, and keep product navigation inside /fl‑bsa/*. Reuse the structure of your current SSoT page and brand boards, but invert the palette to light.  ￼

⸻

1) Context & Goal
	•	Goal:
	•	Home (/) → brand page with minimal centered hero and one CTA → /fl‑bsa/.
	•	Main nav (everywhere) lists only company‑level items + a single FL‑BSA entry (no product sub‑items).
	•	Product sub‑nav appears only inside /fl‑bsa/* pages.
	•	Visual → switch to light (whites/greys/black) with a single accent color (default Indigo‑600 #4F46E5; easily switched to Purple‑600 #7C3AED in tokens).
	•	Keep: Static architecture and privacy posture (noindex), system fonts, no external CDNs, current workflows/evidence cadence.
	•	Sources used for structure & brand direction: your current home HTML and brand/light explorations.

⸻

2) Proposed Approach (numbered; impact · lanes · rollback)
	1.	Add new light theme assets
	•	Create assets/eql/site-light.css (light palette, components) and reuse assets/eql/nav.js.
	•	Impact: High · Lanes: Web/Design · Rollback: unlink stylesheet.
	2.	Replace Home with minimal hero (brand page)
	•	Update index.html to load light CSS, brand‑only nav, and a centered hero (1 blurb + 1 CTA to /fl‑bsa/).
	•	Impact: High · Lanes: Web/IA/Design · Rollback: restore old index.html.
	3.	Keep brand‑only main nav site‑wide; move product links inside
	•	Nav items: FL‑BSA, Trust Center, Procurement, Press, Legal, Contact.
	•	Impact: Med · Lanes: Web/IA · Rollback: revert links block.
	4.	Add/ensure product sub‑nav on /fl‑bsa/* only
	•	Sub‑nav: Overview · How it Works · Compliance · Pricing/Deployment · Whitepaper.
	•	Impact: Med · Lanes: Web/Design · Rollback: remove sub‑nav block.
	5.	Update brand tokens (colors/spacing/type) in docs/brand/tokens.json
	•	Add a light palette + --accent token; keep gradients in reserve if needed.
	•	Impact: Med · Lanes: Brand/Web · Rollback: revert JSON.
	6.	Polish & a11y
	•	Mobile menu toggle; skip‑link; focus rings; anchor offset for fixed header; safe external links.
	•	Impact: Med · Lanes: Web/A11y · Rollback: remove small CSS/JS patches.
	7.	OG/Manifest tweaks
	•	Add assets/brand/og-default-light.svg/png, set <meta name="theme-color" content="#ffffff">.
	•	Impact: Low · Lanes: Web/SEO · Rollback: point back to dark OG & theme‑color.

⸻

3) Change‑Set Preview (copy‑paste)

3.1 NEW — assets/eql/site-light.css

/* === Equilens Light Theme ===  (minimal, elegant) */
/* Tokens */
:root{
  --bg:#ffffff;
  --surface:#ffffff;
  --muted:#f8fafc;
  --border:#e5e7eb;
  --text:#111827;
  --text-muted:#4b5563;
  --accent:#4f46e5;     /* Indigo-600 default; switch to #7c3aed for Purple-600 */
  --accent-hover:#4338ca; /* Indigo-700 */
  --ring:#4338ca;
  --radius:12px;
}

/* Base */
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  color:var(--text);background:var(--bg);line-height:1.6;overflow-x:hidden
}
a{text-decoration:none;color:inherit}

/* Header / Nav (brand-only) */
.navbar{
  position:fixed;top:0;left:0;right:0;z-index:1000;
  background:rgba(255,255,255,.86);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--border); padding:16px 24px;
}
.navbar-content{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:10px}
.logo-dot{width:8px;height:8px;background:var(--accent);border-radius:50%}
.logo-text{font-size:18px;font-weight:600;letter-spacing:-.01em}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-link{color:var(--text-muted);font-size:14px;font-weight:500}
.nav-link:hover{color:var(--accent)}
.nav-toggle{display:none;border:1px solid var(--border);border-radius:8px;padding:8px 10px;background:transparent}

/* Hero (minimal centered) */
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:120px 24px 96px}
.hero-content{text-align:center;max-width:820px;margin:0 auto}
.eyebrow{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#6b7280;margin-bottom:12px}
.hero h1{font-size:56px;font-weight:300;letter-spacing:-.02em;margin-bottom:8px}
.tagline{font-size:18px;font-weight:500;color:var(--text-muted);margin-bottom:18px}
.summary{font-size:18px;color:var(--text-muted);line-height:1.7;margin:0 auto 28px;max-width:680px}
.cta{display:inline-block;background:var(--accent);color:#fff;padding:14px 24px;border-radius:10px;font-weight:600}
.cta:hover{background:var(--accent-hover);transform:translateY(-1px);transition:all .2s ease}

/* Product sub-nav (only in /fl-bsa/*) */
.product-subnav{
  position:sticky;top:64px;z-index:900;background:rgba(255,255,255,.9);
  backdrop-filter:blur(8px);border-bottom:1px solid var(--border)
}
.subnav-inner{max-width:1200px;margin:0 auto;padding:10px 24px;display:flex;gap:18px;overflow:auto}
.subnav-link{color:var(--text-muted);font-size:14px;font-weight:500;white-space:nowrap}
.subnav-link:hover{color:var(--accent)}

/* Footer */
footer{background:var(--muted);border-top:1px solid var(--border);padding:56px 24px}
.footer-content{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px}
.footer-section h4{font-size:14px;font-weight:700;color:var(--text);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em}
.footer-section a,.footer-section p{color:var(--text-muted);font-size:14px;margin-bottom:8px}
.footer-section a:hover{color:var(--accent)}
.footer-bottom{text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid var(--border);color:#6b7280;font-size:13px}

/* A11y */
.skip-to-content{position:absolute;left:-9999px;top:auto}
.skip-to-content:focus{left:24px;top:24px;background:var(--accent);color:#fff;padding:8px 10px;border-radius:8px}
:focus-visible{outline:2px solid var(--ring);outline-offset:2px}

/* Mobile */
@media (max-width:768px){
  .navbar{padding:12px 16px}
  .nav-toggle{display:inline-block}
  .nav-links{display:none;flex-direction:column;gap:14px;padding-top:10px}
  .nav-links[data-open="true"]{display:flex}
  .hero h1{font-size:40px}
  .tagline{font-size:16px}
}

3.2 REUSE — assets/eql/nav.js (same as before)

// Mobile nav toggle
const toggle=document.querySelector('.nav-toggle');
const links=document.getElementById('nav-links');
if(toggle && links){
  toggle.addEventListener('click',()=>{
    const open=links.getAttribute('data-open')==='true';
    links.setAttribute('data-open', String(!open));
    toggle.setAttribute('aria-expanded', String(!open));
  });
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape' && links.getAttribute('data-open')==='true'){
      links.setAttribute('data-open','false');
      toggle.setAttribute('aria-expanded','false');
      toggle.focus();
    }
  });
}
// Guarded smooth scroll for hash links only
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  const h=a.getAttribute('href'); if(!h||h==='#') return;
  a.addEventListener('click',e=>{
    const t=document.querySelector(h);
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});
// Subtle header effect on scroll (optional)
window.addEventListener('scroll',()=>{
  const nav=document.querySelector('.navbar'); if(!nav) return;
  nav.style.boxShadow = (window.scrollY>16)?'0 6px 24px rgba(0,0,0,.06)':'none';
});

3.3 REPLACE — index.html (Home; minimal hero + brand‑only nav)

Structure remains as in your SSoT, but we invert to light theme and brand IA; only the hero remains on Home.  ￼

<!doctype html><html lang="en"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Equilens — Algorithmic Compliance</title>
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#ffffff">
  <link rel="stylesheet" href="/assets/eql/site-light.css">
</head><body>
  <a class="skip-to-content" href="#main">Skip to content</a>

  <nav class="navbar" role="navigation" aria-label="Primary">
    <div class="navbar-content">
      <a href="/" class="logo" aria-label="Equilens home">
        <div class="logo-dot"></div><span class="logo-text">Equilens</span>
      </a>
      <button class="nav-toggle" aria-controls="nav-links" aria-expanded="false">Menu</button>
      <div id="nav-links" class="nav-links" data-open="false">
        <!-- BRAND-ONLY MENU -->
        <a href="/fl-bsa/" class="nav-link">FL‑BSA</a>
        <a href="/trust-center/" class="nav-link">Trust Center</a>
        <a href="/procurement/" class="nav-link">Procurement</a>
        <a href="/press/" class="nav-link">Press</a>
        <a href="/legal/" class="nav-link">Legal</a>
        <a href="/contact/" class="nav-link">Contact</a>
      </div>
    </div>
  </nav>

  <main id="main">
    <section class="hero" aria-label="Equilens overview">
      <div class="hero-content">
        <div class="eyebrow">Introducing</div>
        <h1>Equilens</h1>
        <div class="tagline">Algorithmic Compliance</div>
        <p class="summary">
          <strong>FL‑BSA</strong> is our self‑hosted fair‑lending bias‑simulation appliance.
          It generates synthetic borrower cohorts (with loan decisions) to measure disparate impact and
          produce regulator‑ready evidence — without any customer data leaving your VPC.
        </p>
        <a class="cta" href="/fl-bsa/">Explore FL‑BSA</a>
      </div>
    </section>
  </main>

  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <h4>Company</h4>
        <a href="/trust-center/">Trust Center</a>
        <a href="/procurement/">Procurement</a>
        <a href="/press/">Press</a>
        <a href="/legal/">Legal</a>
        <a href="/contact/">Contact</a>
      </div>
      <div class="footer-section">
        <h4>Contact</h4>
        <p><a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 Equilens Ltd. All rights reserved.</p>
    </div>
  </footer>

  <script src="/assets/eql/nav.js" defer></script>
</body></html>

3.4 PATCH — /fl-bsa/index.html (add product sub‑nav under the header)

<nav class="product-subnav" aria-label="FL‑BSA">
  <div class="subnav-inner">
    <a href="/fl-bsa/" class="subnav-link">Overview</a>
    <a href="/fl-bsa/#how-it-works" class="subnav-link">How it Works</a>
    <a href="/fl-bsa/legal/" class="subnav-link">Compliance</a>
    <a href="/fl-bsa/#deployment" class="subnav-link">Pricing</a>
    <a href="/fl-bsa/whitepaper/" class="subnav-link">Whitepaper</a>
  </div>
</nav>

(Ensure only one primary header exists on product pages; delete any duplicate navbar blocks.)
Anchor offset: If not already present via the light CSS, include section{scroll-margin-top:96px}.

3.5 PATCH — docs/brand/tokens.json (light palette & accent)

{
  "version": "1.2.0",
  "colors": {
    "bg": "#ffffff",
    "surface": "#ffffff",
    "muted": "#f8fafc",
    "border": "#e5e7eb",
    "text": "#111827",
    "text_muted": "#4b5563",
    "accent": "#4f46e5",
    "accent_hover": "#4338ca",
    "accent_alt": "#7c3aed"
  },
  "type": {
    "scale": [12,14,16,18,24,32,40,56],
    "weight": {"light":300,"regular":400,"medium":500,"semibold":600}
  },
  "radius": {"sm":8,"md":12,"lg":16}
}

This lets you switch accent to Purple quickly (accent_alt) if preferred, keeping continuity with prior brand boards.

3.6 PATCH — OG & manifest (optional but recommended)
	•	Add assets/brand/og-default-light.svg and a PNG export assets/brand/og-default-light.png.
	•	In <head> on Home and key pages set:

<meta name="theme-color" content="#ffffff">
<!-- If you decide to point to light OG -->
<!-- <meta property="og:image" content="/assets/brand/og-default-light.png"> -->


⸻

4) Verification Plan (exact)

# local preview
python3 -m http.server 8000
# visit http://localhost:8000/

# Check (desktop + mobile emulation @390px):
# 1) Home shows only the centered hero; CTA -> /fl-bsa/
# 2) Main nav = FL‑BSA · Trust Center · Procurement · Press · Legal · Contact
# 3) Mobile: Menu toggles open/close; Esc closes; focus returns to button
# 4) /fl-bsa/ shows sticky product sub‑nav; section links land below header (no clipping)
# 5) Footer uses equilens@equilens.io; no unverified “certified” claims
# 6) Visuals are light, minimal, with a single accent (buttons/links)

(Optional evidence if you keep the cadence):

scripts/evidence/snapshot.sh "HOME-LIGHT-MINIMAL"
# => output/ops/HOME-LIGHT-MINIMAL/<manifest.json + hashes>


⸻

5) Risks & Rollback

Risk	Impact	Mitigation	Rollback
New CSS leaks into other pages	Med	Only include /assets/eql/site-light.css on pages you intend to restyle now	Remove <link> include
Duplicate headers on /fl-bsa/*	High	Keep one primary header; delete extra blocks	Revert page
Accent color contrast on light bg	Med	Accent ≥ Indigo‑600 meets AA for links; verify CTAs with Pa11y	Switch to darker accent in tokens
IA confusion	Low	Brand‑only nav; all product links inside /fl-bsa/*	Restore prior nav block


⸻

6) Follow‑ups (next PRs)
	•	Apply the light theme to /fl-bsa/* content sections for full visual consistency (hero and cards), using the same tokens.
	•	When the wordmark is final, swap .logo-text for an SVG in /assets/brand/ (keeps layout identical; aesthetic becomes sharper).
	•	When public: flip robots/sitemap/OG with your existing scripts; keep the light theme‑color.

⸻

7) Assumptions & Unknowns
	•	The listed brand‑level routes (/trust-center/, /procurement/, /press/, /legal/, /contact/) already exist.
	•	No external webfonts required (system stack aligns with your prior files).  ￼
	•	You want Indigo as default accent; switch to Purple by changing accent in tokens if preferred.

⸻

8) One‑shot Engineer Checklist
	•	Add assets/eql/site-light.css.
	•	Reuse assets/eql/nav.js.
	•	Replace index.html with the minimal light hero + brand‑only nav.  ￼
	•	Add product sub‑nav to /fl-bsa/index.html; remove duplicate headers; ensure anchor offset.
	•	Update docs/brand/tokens.json (colors/scale).
	•	Manual QA (desktop/mobile); optional evidence snapshot.

This keeps your new site clean, bright, and elegant with a single accent, preserves the Equilens vs FL‑BSA separation you want, and stays aligned with your SSoT structure and brand explorations.
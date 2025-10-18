Equilens Website — Technical Implementation Plan (New Home Design, Brand‑First IA)

Audience: Website repo engineers
Scope: Replace the current home page with the new dark design while keeping the site brand‑first (Equilens ≠ FL‑BSA). Home nav will contain a single “FL‑BSA” item (linking to the product area), not product sub‑anchors. All changes are deterministic, minimal‑diff, and reversible.
Design SSoT: equilens_website.html (uploaded) — color, spacing, components, hero, cards.  ￼
Brand SSoT (palette/mark direction): equilens_brand_final.html, equilens-logos-v4.html.

⸻

1) Context & Goal
	•	Goal: Implement the new home page aesthetic exactly as designed, keep brand‑first navigation (one top‑level FL‑BSA entry), keep existing pages intact (pricing, trust center, docs, etc.), and avoid cross‑page regressions.
	•	Non‑goals (this pass): Converting other pages to the new theme; changing SEO/privacy toggles; altering build workflows.

⸻

2) Current State & SSoT
	•	The repo contains the old site plus standard assets/workflows. We will add new assets and replace only the root home page.
	•	New visual reference is the uploaded single‑file HTML (dark slate + violet/indigo, hero, features, process, compliance, deployment blocks). We will extract its CSS/JS into modular files to keep diffs small and maintenance sane.  ￼
	•	Brand color guidance and future mark/wordmark directions live in the brand SSoT files.

⸻

3) Proposed Approach (numbered; impact; lanes; rollback)
	1.	Add page‑scoped assets for the new home
	•	Create assets/eql/site-dark.css (styles from SSoT) and assets/eql/nav.js (mobile toggle, smooth scroll guard).
Impact: High · Lanes: Web/Design · Rollback: unlink these files from index.html.
	2.	Replace root index.html with the new design (brand‑first nav)
	•	Use the SSoT layout, but change the top nav to brand items: FL‑BSA → /fl-bsa/, Pricing → /pricing/, Trust Center → /trust-center/, Docs, FAQ, Contact.
	•	Keep the SSoT home sections (FL‑BSA content can remain on home as narrative), but nav does not link to those anchors.
Impact: High · Lanes: Web · Rollback: restore previous index.html.
	3.	Keep other routes untouched
	•	/fl-bsa/, /pricing/, /trust-center/, /docs/, /faq/, /contact/ remain as-is.
Impact: Low · Lanes: Web · Rollback: n/a.
	4.	(Optional now, recommended next) add a product sub‑nav only on /fl-bsa/* (Overview · How it Works · Compliance · Deployment · Whitepaper) styled to match the new home.
Impact: Med · Lanes: Web/Design · Rollback: remove the sub‑nav block and styles.
	5.	Legal/copy hygiene (no visual change)
	•	Escape < in stats (&lt; 32GB).
	•	Don’t assert “SOC 2 Type II certified” unless confirmed by LexPro; use neutral wording (“program” or remove).
	•	Use provisioned contact: equilens@equilens.io.
Impact: Med · Lanes: Web/Legal · Rollback: restore lines.

⸻

4) Change‑Set Preview (file‑scoped diffs/snippets)

The CSS/JS below is extracted from the SSoT homepage file and minimally adapted to brand‑first nav and accessibility (skip‑link, focus rings, anchor offset). Visuals remain identical.  ￼

4.1 NEW — assets/eql/site-dark.css

/* Equilens Home — dark slate + violet/indigo (from SSoT) */
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#e2e8f0;background:#0f172a;overflow-x:hidden}

/* Header / Nav */
.navbar{position:fixed;top:0;width:100%;background:rgba(15,23,42,.95);backdrop-filter:blur(10px);padding:20px 40px;z-index:1000;border-bottom:1px solid #1e293b}
.navbar-content{display:flex;justify-content:space-between;align-items:center;max-width:1400px;margin:0 auto}
.logo{display:flex;align-items:center;gap:12px;text-decoration:none}
.logo-dot{width:8px;height:8px;background:#8b5cf6;border-radius:50%}
.logo-text{font-size:18px;font-weight:500;color:#e2e8f0;letter-spacing:-.01em}
.nav-links{display:flex;gap:32px}
.nav-link{color:#94a3b8;text-decoration:none;font-size:14px;font-weight:500;transition:color .3s ease}
.nav-link:hover{color:#8b5cf6}
.nav-toggle{display:none;color:#e2e8f0;background:transparent;border:1px solid #334155;border-radius:8px;padding:10px 12px}

/* Hero */
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);position:relative;padding:100px 40px 80px}
.hero-content{text-align:center;max-width:900px}
.hero h1{font-size:64px;font-weight:300;margin-bottom:24px;color:#e2e8f0;letter-spacing:-.02em}
.hero .tagline{font-size:20px;font-weight:400;color:#8b5cf6;margin-bottom:32px;letter-spacing:.02em}
.hero .description{font-size:18px;font-weight:300;color:#94a3b8;margin-bottom:48px;line-height:1.7}

/* Sections / layout */
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
section{scroll-margin-top:96px}
.section{padding:100px 40px;max-width:1400px;margin:0 auto}
.section-title{font-size:36px;font-weight:600;color:#e2e8f0;margin-bottom:60px;text-align:center}
.section-subtitle{font-size:18px;color:#94a3b8;margin-bottom:80px;text-align:center;max-width:700px;margin-inline:auto}

/* Features / cards / process (from SSoT) */
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:40px;margin-bottom:80px}
.feature-card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:40px 32px;transition:all .3s ease}
.feature-card:hover{border-color:#8b5cf6;transform:translateY(-4px)}
.feature-icon{width:48px;height:48px;background:#8b5cf6;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:24px;font-size:24px}
.feature-card h3{font-size:20px;font-weight:600;color:#e2e8f0;margin-bottom:16px}
.feature-card p{color:#94a3b8;line-height:1.6}

.process-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:32px;margin:60px 0}
.process-step{text-align:center;position:relative}
.step-number{width:48px;height:48px;background:#8b5cf6;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;margin:0 auto 24px}
.process-step h3{font-size:18px;font-weight:600;color:#e2e8f0;margin-bottom:12px}
.process-step p{color:#94a3b8;font-size:14px;line-height:1.5}

.compliance-logos{display:flex;justify-content:center;align-items:center;gap:60px;margin:60px 0;flex-wrap:wrap}
.compliance-logo{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:20px 32px;color:#94a3b8;font-size:14px;font-weight:500;text-transform:uppercase;letter-spacing:.05em}

.stats-section{background:#1e293b;border-radius:16px;padding:60px 40px;margin:80px 0;text-align:center}
.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:40px;margin-top:40px}
.stat{text-align:center}
.stat-number{font-size:36px;font-weight:700;color:#8b5cf6;margin-bottom:8px}
.stat-label{color:#94a3b8;font-size:14px;text-transform:uppercase;letter-spacing:.05em}

.deployment-options{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;margin:60px 0}
.deployment-card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:32px 24px;text-align:center}
.deployment-card h3{font-size:18px;font-weight:600;color:#e2e8f0;margin-bottom:16px}
.deployment-card p{color:#94a3b8;margin-bottom:24px;line-height:1.5}
.deployment-card .price{font-size:24px;font-weight:700;color:#8b5cf6;margin-bottom:8px}
.deployment-card .price-note{font-size:12px;color:#64748b}

/* Buttons */
.cta-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.btn-primary{background:#8b5cf6;color:#fff;padding:16px 32px;border:none;border-radius:8px;font-size:16px;font-weight:500;text-decoration:none;display:inline-block;transition:all .3s ease;cursor:pointer}
.btn-primary:hover{background:#7c3aed;transform:translateY(-2px)}
.btn-secondary{background:transparent;color:#e2e8f0;padding:16px 32px;border:1px solid #334155;border-radius:8px;font-size:16px;font-weight:500;text-decoration:none;display:inline-block;transition:all .3s ease;cursor:pointer}
.btn-secondary:hover{border-color:#8b5cf6;color:#8b5cf6}

/* Footer */
footer{background:#020617;padding:80px 40px 40px;border-top:1px solid #1e293b}
.footer-content{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:60px}
.footer-section h4{color:#e2e8f0;font-size:16px;font-weight:600;margin-bottom:20px}
.footer-section p,.footer-section a{color:#94a3b8;text-decoration:none;margin-bottom:8px;display:block;font-size:14px}
.footer-section a:hover{color:#8b5cf6}
.footer-bottom{text-align:center;margin-top:60px;padding-top:40px;border-top:1px solid #1e293b;color:#64748b;font-size:14px}

/* Accessibility */
.skip-to-content{position:absolute;left:-9999px;top:auto}
.skip-to-content:focus{left:24px;top:24px;background:#8b5cf6;color:#fff;padding:10px 12px;border-radius:8px}
.nav-link:focus-visible,.btn-primary:focus-visible,.btn-secondary:focus-visible{outline:2px solid #8b5cf6;outline-offset:2px}

/* Mobile */
@media (max-width:768px){
  .hero h1{font-size:48px}
  .section{padding:80px 20px}
  .navbar{padding:15px 20px}
  .nav-toggle{display:inline-block}
  .nav-links{display:none;flex-direction:column;gap:16px;padding-top:12px}
  .nav-links[data-open="true"]{display:flex}
  .compliance-logos{gap:30px}
}

4.2 NEW — assets/eql/nav.js

// Guarded smooth scroll (hash links only)
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  const h = a.getAttribute('href');
  if(!h || h === '#') return;
  a.addEventListener('click', e=>{
    const t = document.querySelector(h);
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

// Mobile nav toggle (accessible)
const toggle = document.querySelector('.nav-toggle');
const links  = document.getElementById('nav-links');
if(toggle && links){
  toggle.addEventListener('click', ()=>{
    const open = links.getAttribute('data-open') === 'true';
    links.setAttribute('data-open', String(!open));
    toggle.setAttribute('aria-expanded', String(!open));
  });
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape' && links.getAttribute('data-open')==='true'){
      links.setAttribute('data-open','false');
      toggle.setAttribute('aria-expanded','false');
      toggle.focus();
    }
  });
}

// Header opacity on scroll (as per SSoT)
window.addEventListener('scroll', ()=>{
  const navbar = document.querySelector('.navbar');
  if(!navbar) return;
  navbar.style.background = (window.scrollY>100)
    ? 'rgba(15, 23, 42, 0.98)'
    : 'rgba(15, 23, 42, 0.95)';
});

4.3 REPLACE — root index.html

Start from the SSoT file and make these edits (brand‑first nav + a11y).  ￼

Head additions

<link rel="stylesheet" href="/assets/eql/site-dark.css">

First child of <body>

<a class="skip-to-content" href="#main">Skip to content</a>

Navbar block (brand‑first; one FL‑BSA link)

<nav class="navbar" role="navigation" aria-label="Primary">
  <div class="navbar-content">
    <a href="/" class="logo">
      <div class="logo-dot"></div><span class="logo-text">Equilens</span>
    </a>
    <button class="nav-toggle" aria-controls="nav-links" aria-expanded="false">Menu</button>
    <div id="nav-links" class="nav-links" data-open="false">
      <a href="/fl-bsa/" class="nav-link">FL‑BSA</a>
      <a href="/pricing/" class="nav-link">Pricing</a>
      <a href="/trust-center/" class="nav-link">Trust Center</a>
      <a href="/docs/" class="nav-link">Docs</a>
      <a href="/faq/" class="nav-link">FAQ</a>
      <a href="/contact/" class="nav-link">Contact</a>
    </div>
  </div>
</nav>

Main wrapper anchor target

<main id="main">
  <!-- existing hero/sections from SSoT stay as-is -->

Hero CTAs (brand‑first)

- <a href="#deployment" class="btn-primary">View Deployment Options</a>
- <a href="#how-it-works" class="btn-secondary">See How It Works</a>
+ <a href="/fl-bsa/" class="btn-primary">Explore FL‑BSA</a>
+ <a href="/pricing/" class="btn-secondary">Pricing</a>

Stat escape

- <div class="stat-number">< 32GB</div>
+ <div class="stat-number">&lt; 32GB</div>

Footer first column (brand‑first, product present but not dominant)

- <h4>Product</h4>
- <a href="#product">FL-BSA Platform</a>
- <a href="#how-it-works">How It Works</a>
- <a href="#compliance">Compliance</a>
- <a href="#deployment">Pricing</a>
+ <h4>FL‑BSA</h4>
+ <a href="/fl-bsa/">Overview</a>
+ <a href="/fl-bsa/#how-it-works">How It Works</a>
+ <a href="/fl-bsa/legal/">Compliance</a>
+ <a href="/pricing/">Pricing</a>

Footer contact (provisioned email)

- <p>Sales: sales@equilens.com</p>
- <p>Support: support@equilens.com</p>
- <p>Security: security@equilens.com</p>
+ <p><a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>

(Adjust when aliases exist.)

Footer claim (if present)

- | SOC 2 Type II Certified
+ <!-- remove or change per LexPro: SOC 2 Type II program -->

End of body

<script src="/assets/eql/nav.js" defer></script>

4.4 (Optional) — Product sub‑nav on /fl-bsa/index.html

Insert under the global navbar (product pages only)

<nav class="product-subnav" aria-label="FL‑BSA">
  <div class="subnav-inner">
    <a href="/fl-bsa/" class="subnav-link">Overview</a>
    <a href="/fl-bsa/#how-it-works" class="subnav-link">How it Works</a>
    <a href="/fl-bsa/legal/" class="subnav-link">Compliance</a>
    <a href="/fl-bsa/#deployment" class="subnav-link">Deployment</a>
    <a href="/fl-bsa/whitepaper/" class="subnav-link">Whitepaper</a>
  </div>
</nav>

Styles (append to assets/eql/site-dark.css)

.product-subnav{position:sticky;top:68px;z-index:900;background:rgba(2,6,23,.85);backdrop-filter:blur(6px);border-bottom:1px solid #1e293b}
.subnav-inner{max-width:1400px;margin:0 auto;padding:10px 40px;display:flex;gap:20px;overflow:auto}
.subnav-link{color:#94a3b8;text-decoration:none;font-size:14px;font-weight:500;white-space:nowrap}
.subnav-link:hover{color:#8b5cf6}


⸻

5) Verification Plan (exact commands; artifacts/URLs)

# 1) Local preview
python3 -m http.server 8000
# open http://localhost:8000/

# 2) Manual checks (desktop + 390px mobile emulation)
# - Top nav reads: FL‑BSA · Pricing · Trust Center · Docs · FAQ · Contact
# - “Explore FL‑BSA” → /fl-bsa/
# - “Pricing” → /pricing/
# - Mobile menu toggles open/close; Esc closes; focus returns to button
# - Anchor scroll only affects hash links (absolute links untouched)
# - “< 32GB” renders properly as “< 32GB”
# - Footer uses equilens@equilens.io; no unverified certification claims

# 3) (Optional) Existing link/a11y audits if you keep them
# gh workflow run audit.yml --ref main   # verify Pa11y/Lighthouse artifacts

# 4) Evidence snapshot (if your scripts exist)
scripts/evidence/snapshot.sh "HOME-REDESIGN-V1"
# => output/ops/HOME-REDESIGN-V1/manifest.json + hashes


⸻

6) Risk & Rollback

Risk	Impact	Mitigation	Rollback
New CSS bleeds into other pages	Med	Only link assets/eql/site-dark.css in index.html	Remove the <link>
Mobile nav JS conflicts	Low	Only load assets/eql/nav.js in index.html	Remove the <script>
Brand/product confusion	Low	Home nav uses a single “FL‑BSA” link; product sub‑nav lives under /fl-bsa/ only	Revert nav block
Legal wording	Med	Remove/neutralize certification claims until LexPro confirms	Revert lines in footer


⸻

7) Follow‑ups (next PRs)
	1.	/fl‑bsa/ page alignment — apply the same look (hero/cards) and inject the product sub‑nav; copy sections from the SSoT home as separate blocks.  ￼
	2.	Header/footer unification — optional scripts to sync a canonical header/footer across pages (keeps brand‑first + product sub‑nav only on /fl-bsa/*).
	3.	Wordmark swap — when a final wordmark is chosen from brand explorations, replace .logo-text with the SVG and place assets in /assets/brand/.
	4.	Content parity pass — ensure Pricing/Trust Center copy matches current FL‑BSA positioning and legal guidance.

⸻

8) Assumptions & Unknowns
	•	We keep the site private (robots noindex) and deploy workflow unchanged in this pass.
	•	Contact aliases beyond equilens@equilens.io will be confirmed later.
	•	The current /fl-bsa/, /pricing/, /trust-center/, /docs/, /faq/, /contact/ routes already exist in the repo (as per prior tree states).
	•	All code examples are vanilla HTML/CSS/JS; no external CDNs or webfonts are introduced.

⸻

Engineer Ready Checklist
	•	Add assets/eql/site-dark.css and assets/eql/nav.js.
	•	Replace index.html with SSoT design + brand‑first nav + a11y fixes.  ￼
	•	Verify links/menus locally; correct footer email/claims.
	•	Commit: feat(home): new brand-first landing (dark theme) and push.

This plan maps 1:1 from the provided SSoT home design and brand references, ensuring the repo team can implement the new aesthetic without disturbing the rest of the site.
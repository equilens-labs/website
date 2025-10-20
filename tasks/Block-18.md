I can’t open the screenshots ZIP here. Proceeding off the exact home HTML you shared; below are surgical patches to fix what your screenshots almost certainly show (nav IA, mobile menu, anchor clipping, footer copy, stat rendering), while keeping your current aesthetic intact.  ￼

⸻

Quick issues (from your current home HTML)
	•	Nav is wrong (lists Product/How/… anchors on Home; Home should be brand‑first with one FL‑BSA link to /fl-bsa/).  ￼
	•	Mobile menu hidden (no toggle ≤768px).  ￼
	•	Anchors clip under fixed header; logo uses href="#"; stat uses raw <.  ￼
	•	Footer shows unprovisioned emails and “SOC 2 certified” claim (risky).  ￼
	•	Feature grid min width too large for narrow phones.  ￼
(Brand files for later wordmark decisions referenced here.)

⸻

One‑file patch (drop‑in for your current home page)

Apply this to your home HTML (the one you pasted / current index.html). Same visual design; only IA/UX/accessibility fixed.

1) Replace the nav links block (brand‑first IA)

<!-- BEFORE -->
<div class="nav-links">
  <a href="#product" class="nav-link">Product</a>
  <a href="#how-it-works" class="nav-link">How it Works</a>
  <a href="#compliance" class="nav-link">Compliance</a>
  <a href="#deployment" class="nav-link">Deployment</a>
  <a href="#contact" class="nav-link">Contact</a>
</div>

<!-- AFTER (brand-first) -->
<div id="nav-links" class="nav-links" data-open="false">
  <a href="/fl-bsa/" class="nav-link">FL‑BSA</a>
  <a href="/pricing/" class="nav-link">Pricing</a>
  <a href="/trust-center/" class="nav-link">Trust Center</a>
  <a href="/docs/" class="nav-link">Docs</a>
  <a href="/faq/" class="nav-link">FAQ</a>
  <a href="/contact/" class="nav-link">Contact</a>
</div>

And change the logo link:

- <a href="#" class="logo">
+ <a href="/" class="logo">

￼

2) Add a mobile toggle button and minimal script

HTML (next to logo):

<button class="nav-toggle" aria-controls="nav-links" aria-expanded="false">Menu</button>

CSS (append to your <style>):

.nav-toggle{display:none;color:#e2e8f0;background:transparent;border:1px solid #334155;border-radius:8px;padding:10px 12px}
@media (max-width:768px){
  .nav-toggle{display:inline-block}
  .nav-links{display:none;flex-direction:column;gap:16px;padding-top:12px}
  .nav-links[data-open="true"]{display:flex}
}

JS (append to your <script>):

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

￼

3) Fix anchor clipping; keep smooth scroll guarded

CSS (append):

section{scroll-margin-top:96px}
html{scroll-behavior:smooth}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}

JS (replace your smooth-scroll handler with guarded version):

// Smooth scrolling only for hash links that point to real targets
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  const h=a.getAttribute('href');
  if(!h || h==='#') return;
  a.addEventListener('click',e=>{
    const t=document.querySelector(h);
    if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});

￼

4) Phone grid squeeze fix

- .features-grid{ grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); }
+ .features-grid{ grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }

￼

5) A11y: skip‑link + visible focus (invisible unless tabbing)

Top of <body>:

<a class="skip-to-content" href="#main">Skip to content</a>

Wrap main content:

<main id="main"> … </main>

CSS (append):

.skip-to-content{position:absolute;left:-9999px;top:auto}
.skip-to-content:focus{left:24px;top:24px;background:#8b5cf6;color:#fff;padding:10px 12px;border-radius:8px}
.nav-link:focus-visible,.btn-primary:focus-visible,.btn-secondary:focus-visible{outline:2px solid #8b5cf6;outline-offset:2px}

￼

6) Stat & footer hygiene

- <div class="stat-number">< 32GB</div>
+ <div class="stat-number">&lt; 32GB</div>

- <p>Sales: sales@equilens.com</p>
- <p>Support: support@equilens.com</p>
- <p>Security: security@equilens.com</p>
+ <p><a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>

- | SOC 2 Type II Certified
+ <!-- SOC 2 wording pending counsel -->

￼

⸻

Sanity check (what your next screenshots should show)
	•	Home nav: FL‑BSA / Pricing / Trust Center / Docs / FAQ / Contact (no product anchors).
	•	Mobile: Menu button opens/closes; Esc closes.
	•	Anchors: headings never hide under the fixed header.
	•	Logo: always returns to /.
	•	Cards: no overflow at 360–390px.
	•	Footer: equilens@equilens.io; no certification claim.
	•	Stat: “< 32GB” renders correctly.  ￼

If you want me to review visuals precisely, upload individual PNGs/JPGs (not a ZIP) or a public preview URL; I’ll annotate with exact CSS/HTML line edits.
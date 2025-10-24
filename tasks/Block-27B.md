You’re right—the FL‑BSA CTA still reads like highlighted text, and the second (product) nav looks awkward. Below is a single, surgical fix‑pack you can paste now. It focuses only on: (1) the home hero CTA (looks/hover/focus), (2) the “Introducing” hierarchy, and (3) a refined FL‑BSA sub‑nav (slimmer, elegant, with active state and proper sticky behavior). It keeps your current light, minimal aesthetic and avoids the old dark-on‑scroll behavior from earlier prototypes.   ￼

⸻

A) Quick Diagnosis (what’s happening)
	•	CTA looks like a highlight → anchor lacks true button affordances (solid fill, shadow, lift on hover, focus ring, active press).
	•	“Introducing” feels small → eyebrow label needs deliberate size/tracking for hierarchy.
	•	Second nav (product sub‑nav) feels heavy/misaligned → tall bar, no active indicator, inconsistent sticky offset vs. header.

⸻

B) One‑Pass Fix Pack (copy‑paste)

Where to put CSS: wherever your global light stylesheet lives (e.g., assets/base.css or assets/eql/site-light.css).
Where to put JS: at the bottom of the page(s) (or in your small shared nav.js).

1) HOME HERO — real button + bigger “Introducing”

HTML (Home hero block — keep only class additions if your structure already matches):

<div class="hero-content">
  <div class="eyebrow">Introducing</div>
  <h1 class="brand-title">FL‑BSA</h1>
  <p class="lead">
    Self‑hosted fair‑lending bias‑simulation. Generates synthetic borrower cohorts (with loan decisions)
    to measure disparate impact and produce regulator‑ready evidence — with
    <strong>no customer data leaving your VPC</strong>.
  </p>
  <p class="cta-row">
    <a class="btn btn-primary" href="/fl-bsa/">Explore FL‑BSA</a>
  </p>
</div>

CSS (add once globally):

/* --- Hero hierarchy --- */
.eyebrow{font:600 13px/1.2 system-ui; letter-spacing:.16em; text-transform:uppercase; color:#6b7280; margin-bottom:12px}
.brand-title{font-weight:700; letter-spacing:-.02em; color:#111827; font-size:clamp(44px,6vw,68px); margin:0 0 14px}
.lead{max-width:64ch; margin:0 auto 22px; color:#374151; font-size:clamp(16px,1.6vw,18px); line-height:1.55}
.cta-row{margin-top:8px}

/* --- Buttons (true button affordance) --- */
.btn{display:inline-block; text-decoration:none; border-radius:12px; font-weight:600; cursor:pointer; line-height:1.1; -webkit-appearance:none; appearance:none}
.btn-primary{
  background:#4f46e5; color:#fff; padding:14px 22px; font-size:16px;
  box-shadow:0 1px 0 rgba(0,0,0,.06), 0 10px 20px rgba(79,70,229,.14);
  transition:transform .15s ease, box-shadow .15s ease, background .15s ease
}
.btn-primary:hover{ background:#4338ca; transform:translateY(-1px);
  box-shadow:0 1px 0 rgba(0,0,0,.06), 0 14px 28px rgba(79,70,229,.18) }
.btn-primary:active{ transform:translateY(0) }
.btn:focus-visible{ outline:2px solid #4338ca; outline-offset:2px }

Impact: High · Lanes: Web/Design · Rollback: remove the added CSS rules and restore the previous hero block.

⸻

2) PRODUCT SUB‑NAV — slender, elegant, active state, correct sticky offset

HTML — place immediately below the global header on /fl-bsa/index.html (and other FL‑BSA pages), one instance only:

<nav class="product-subnav" aria-label="FL‑BSA">
  <div class="subnav-inner">
    <a href="/fl-bsa/" class="subnav-link">Overview</a>
    <a href="/fl-bsa/#how-it-works" class="subnav-link">How it Works</a>
    <a href="/fl-bsa/legal/" class="subnav-link">Compliance</a>
    <a href="/fl-bsa/#deployment" class="subnav-link">Pricing</a>
    <a href="/fl-bsa/whitepaper/" class="subnav-link">Whitepaper</a>
  </div>
</nav>

CSS (append globally):

/* Sub-nav — slim, light, scrolls horizontally on small screens */
.product-subnav{
  position:sticky; top:64px; z-index:900;
  background:rgba(255,255,255,.9); backdrop-filter:blur(8px);
  border-bottom:1px solid #e5e7eb
}
.subnav-inner{max-width:1120px; margin:0 auto; padding:8px 16px; display:flex; gap:18px; overflow:auto}
.subnav-link{
  color:#6b7280; font-size:14px; font-weight:600; text-decoration:none; padding:10px 0; position:relative; white-space:nowrap
}
.subnav-link:hover{ color:#4f46e5 }
.subnav-link[aria-current="true"]{ color:#111827 }
.subnav-link[aria-current="true"]::after{
  content:""; position:absolute; left:0; right:0; bottom:-8px; height:2px; background:#4f46e5; border-radius:2px
}

/* Ensure anchored sections don't hide under sticky bars */
section,[id]{ scroll-margin-top:96px }

JS (active link + fix any legacy scroll-darkener) — add at the bottom of FL‑BSA pages:

<script>
  // Mark current subnav item active (exact path match or hash match)
  (function(){
    const here = location.pathname + (location.hash || '');
    document.querySelectorAll('.product-subnav .subnav-link').forEach(a=>{
      const target = a.getAttribute('href');
      if (!target) return;
      const norm = new URL(target, location.origin);
      const same = (norm.pathname === location.pathname) &&
                   (!norm.hash || norm.hash === location.hash || norm.hash==="#");
      if (same || norm.href === location.href) a.setAttribute('aria-current','true');
    });
  })();

  // Defensive: remove any legacy "dark on scroll" behavior
  window.removeEventListener?.('scroll', window.__eq_darknav);
</script>

Impact: Med · Lanes: Web/Design/A11y · Rollback: remove the sub‑nav block + CSS/JS.

⸻

3) MAIN NAV — keep it light (no darkening on scroll)

If a remnant script is still darkening the header on scroll, neutralize with CSS (and, if present, delete the script):

/* Light fixed header – no dark-on-scroll */
.navbar{
  position:sticky; top:0; z-index:1000; background:rgba(255,255,255,.86);
  -webkit-backdrop-filter:saturate(160%) blur(10px); backdrop-filter:saturate(160%) blur(10px);
  border-bottom:1px solid #e5e7eb
}
.navbar a{ color:#111827 }
.navbar a:hover{ color:#4f46e5 }

Why: it aligns with your light, minimal direction; the dark scroll effect came from the old prototype and clashes here.  ￼

⸻

C) Verification (3 minutes)
	1.	Home → “Introducing” is visibly larger; CTA looks/feels like a real button (hover lift, active press, focus ring).
	2.	Scroll → the top bar stays light; no darkening.
	3.	/fl‑bsa/ → only one product sub‑nav under the header; it’s slim, horizontally scrollable on small screens, and shows an active underline on the current item; section jumps land below the sticky bars.
	4.	Mobile → sub‑nav scrolls sideways; no wrap glitches; main CTA still reads like a button.

⸻

D) Impact / Lanes / Rollback
	•	CTA + Eyebrow (Home): High · Web/Design · rollback by removing the button/eyebrow CSS.
	•	Product sub‑nav slim refactor: Med · Web/Design/A11y · rollback by removing the new sub‑nav block and CSS/JS.
	•	Header light freeze: Med · Web/Design · rollback by removing the override (or re‑adding the old script).

⸻

Notes
	•	This keeps the light, minimal brand you approved (white/grey/black + one accent) and removes visual noise from the old dark prototype.   ￼
	•	If you want, I can package these as a single PR touching only index.html, /fl-bsa/index.html, and the global CSS/JS with the smallest possible diffs.
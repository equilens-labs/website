Below is a tight audit of the live site plus surgical patches you can paste today. I focused on the home hero (Introducing / CTA), the top bar darkening, footer bulk, spacing/alignment, and the still‑broken Press downloads.

Verified live pages (now): Home, FL‑BSA, Trust Center, Procurement, Press, Legal, Contact. The home hero currently reads “Introducing / FL‑BSA” and shows an “Explore FL‑BSA” CTA.  ￼
Reference for design direction: keep the light, minimal style and single accent we established in the brand boards; avoid the old dark/scroll‑darkening prototype.

⸻

A) Findings (what’s still off)
	1.	Home CTA looks weak
The “Explore FL‑BSA” button reads like a plain link (size/contrast/weight). Needs a proper button style, hover/active, and focus ring.  ￼
	2.	“Introducing” label too small
Hierarchy feels underweighted. It should be small but intentionally visible (bigger letter‑spaced eyebrow).  ￼
	3.	Top bar still darkens on scroll
The live site continues to alter the navbar background on scroll (clashes with the light theme brief; the old dark script must be removed).  ￼
	4.	Footer feels heavy on some viewports
The new micro‑footer is much better, but the spacing (padding/margins) can still feel like a big block depending on screen height; we can tighten it globally.  ￼
	5.	Spacing/alignment
Some sections still “breathe” unevenly across pages; we should enforce consistent container width and vertical rhythm utilities site‑wide.  ￼
	6.	Press downloads still 400
logo-mark.svg, tokens.json, and manifest.webmanifest return 400; PNG icon works.  ￼

⸻

B) Patches (copy‑paste)

Where to paste CSS: the shared light stylesheet you’re loading globally (e.g., assets/base.css or assets/eql/site-light.css).
Style tokens: keep the single accent (Indigo‑600 #4F46E5).

1) Hero polish — bigger “Introducing”, strong CTA

HTML (home hero block):

<!-- Home hero (centered) -->
<div class="hero-content">
  <div class="eyebrow">Introducing</div>
  <h1 class="brand-title">FL‑BSA</h1>
  <p class="lead">
    Self‑hosted fair‑lending bias‑simulation. Generates synthetic borrower cohorts (with loan decisions)
    to measure disparate impact and produce regulator‑ready evidence — with <strong>no customer data leaving your VPC</strong>.
  </p>
  <p class="cta-row">
    <a class="btn btn-primary" href="/fl-bsa/">Explore FL‑BSA</a>
  </p>
</div>

CSS (add once globally):

/* ——— Hero hierarchy ——— */
.eyebrow{
  font:600 13px/1.2 system-ui; letter-spacing:.16em; text-transform:uppercase;
  color:#6b7280; margin-bottom:12px
}
.brand-title{
  font-weight:700; letter-spacing:-.02em; color:#111827;
  font-size:clamp(44px,6vw,68px); margin:0 0 14px
}
.lead{
  max-width:64ch; margin:0 auto 22px; color:#374151;
  font-size:clamp(16px,1.6vw,18px); line-height:1.55
}

/* ——— Buttons ——— */
.btn{display:inline-block; text-decoration:none; border-radius:12px; font-weight:600; cursor:pointer}
.btn-primary{
  background:#4f46e5; color:#fff; padding:14px 22px; font-size:16px;
  box-shadow:0 1px 0 rgba(0,0,0,.06), 0 10px 20px rgba(79,70,229,.14);
  transition:transform .15s ease, box-shadow .15s ease, background .15s ease
}
.btn-primary:hover{ background:#4338ca; transform:translateY(-1px);
  box-shadow:0 1px 0 rgba(0,0,0,.06), 0 14px 28px rgba(79,70,229,.18)}
.btn-primary:active{ transform:translateY(0) }
.btn:focus-visible{ outline:2px solid #4338ca; outline-offset:2px }

Result: eyebrow is clearly readable; CTA reads as a true primary button (not a text link) and meets contrast/a11y. Keeps the light, elegant feel from the brand boards.

⸻

2) Freeze the header to light (remove scroll darkening)

Remove any JS that mutates navbar background on scroll (legacy dark prototype did this). If you can’t easily find it, add this safe override:

/* Light header, always */
.navbar{
  position:sticky; top:0; z-index:1000; background:rgba(255,255,255,.86);
  backdrop-filter:saturate(160%) blur(10px); border-bottom:1px solid #e5e7eb
}
.navbar a{ color:#111827 }
.navbar a:hover{ color:#4f46e5 }

<!-- Optional hard kill if legacy script persists -->
<script>
  // Remove any window scroll handlers that change navbar styles
  addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.navbar');
    if (nav){ nav.style.background='rgba(255,255,255,.86)'; nav.style.borderBottom='1px solid #e5e7eb'; }
    // best is deleting the code; this is a defensive fallback only
  });
</script>

Why: the live site still changes nav color on scroll, which fights the light minimal aesthetic.  ￼

⸻

3) Micro‑footer: tighten spacing (no “big chunk”)

CSS tweaks (global):

.micro-footer{ margin-top:40px; border-top:1px solid #e5e7eb; background:#fff }
.mf-wrap{ max-width:1120px; margin:0 auto; padding:12px 16px }
.mf-links{ display:flex; flex-wrap:wrap; gap:10px; justify-content:center; line-height:1.2 }
.mf-links a{ color:#6b7280; text-decoration:none; font-size:14px }
.mf-links a:hover{ color:#4f46e5 }
.mf-legal{ margin-top:6px; text-align:center; color:#9ca3af; font-size:12px }
.sep{ color:#d1d5db }

Keeps the legal line and compact link row, but removes blocky padding so it no longer feels like a large slab at the bottom.  ￼

⸻

4) Spacing & alignment guardrails (site‑wide)

/* Containers & vertical rhythm */
.container{ max-width:1120px; margin:0 auto; padding:0 20px }
.section{ padding:clamp(48px,8vw,96px) 0 }
.stack>*+*{ margin-top:clamp(12px,1.8vw,20px) }

/* Headings */
h1,h2,h3{ line-height:1.15; color:#111827 }
h2{ font-size:clamp(24px,3vw,32px); margin:0 0 12px }
h3{ font-size:clamp(18px,2.5vw,22px); margin:0 0 8px }

/* Anchor offset under sticky header */
[id]{ scroll-margin-top:96px }

This evens out section spacing on Home + FL‑BSA + Trust Center/Procurement/Legal.  ￼

⸻

5) Press downloads (fix 400s) & manifest

Publish files at these exact paths and update links (they currently 400):
	•	/assets/brand/logo-mark.svg
	•	/assets/brand/tokens.json
	•	/manifest.webmanifest

Head include (Home + FL‑BSA + Press):

<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#ffffff">

/manifest.webmanifest (content):

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

/press/index.html links:

<ul class="assets">
  <li><a href="/assets/brand/logo-mark.svg" download>Logo mark (SVG)</a></li>
  <li><a href="/assets/brand/og-default-light.png" download>OG banner (PNG 1200×630)</a></li>
  <li><a href="/manifest.webmanifest" download>Web app manifest</a></li>
  <li><a href="/assets/brand/icon-512.png" download>Logo 512×512 (PNG)</a></li>
  <li><a href="/assets/brand/tokens.json" download>Design tokens (JSON)</a></li>
</ul>

Right now SVG/tokens/manifest return 400; the PNG icon loads. This patch fixes the broken links.  ￼

⸻

C) Quick checks (after patch)
	•	Home hero shows larger “Introducing” and a crisp “Explore FL‑BSA” button (hover, active, focus ring).  ￼
	•	Header no longer darkens on scroll.  ￼
	•	Footer is a slim micro‑footer (tight padding; one or two lines max on desktop; wraps neatly on mobile).  ￼
	•	Spacing is consistent across Home/FL‑BSA/Trust/Procurement/Legal.  ￼
	•	Press: SVG/tokens/manifest download correctly.  ￼

⸻

D) Impact / Lanes / Rollback

Change	Impact	Lanes	Rollback
Hero copy & CTA styling	High	Web/Design/Content	Revert block/CSS
Stop header darkening	Med	Web/Design	Remove override; restore script
Micro‑footer tighten	Med	Web/Design/Legal	Revert CSS
Spacing guardrails	Med	Web	Remove CSS
Press assets + manifest	Med	Web/Brand/SEO	Unlink till ready


⸻

E) Notes / SSoT
	•	Keep the light, minimal brand we defined (white/grey/black + one accent). The older dark prototype should not drive behavior (e.g., nav darkening).

If you want, I can bundle these as a single PR. The result will immediately fix the home CTA, eyebrow, header behavior, footer weight, rhythm, and the Press downloads in one sweep.
Below is a clean, second‑pass audit of the live site with concrete fixes. I’m focusing on brand‑first IA, visual polish, and product separation, and I’ve called out exact pages/sections observed on the current deploy.

⸻

1) Top Findings (prioritized)

🔴 High‑priority
	1.	Duplicate primary header injected mid‑page on product pages
The FL‑BSA pages render an extra “Equilens — Menu” header block within content (see FL‑BSA near workflow section and again on Whitepaper). This creates noise, odd spacing, and confuses keyboard users. Fix by keeping one global header and removing the stray header blocks in content templates.  ￼  ￼
	2.	Main‑nav inconsistency across pages (brand IA drift)
The home page and inner pages expose different nav sets (e.g., home shows one mix; contact/procurement show another). The requirement is brand‑only main nav with a single FL‑BSA entry, and all product links living under /fl-bsa/*. Align all pages to one nav block.  ￼
Reference IA goal: brand‑first home + product sub‑nav only inside FL‑BSA.  ￼
	3.	Press → “Web app manifest” link doesn’t resolve correctly
The “Web app manifest” link returns an error (tool sees 400). Likely content‑type/serving issue or missing file at /site.webmanifest. Ensure the file exists and is served with an appropriate manifest MIME (application/manifest+json is widely accepted). Update head on key pages to reference it.  ￼
	4.	Home is still a product landing, not a minimal brand hero
Current home includes long sections (“Trust badges”, “How it works”, “Why teams choose…”) rather than the agreed minimal centered hero with a single CTA to FL‑BSA. If we keep brand‑first, reduce the home to the one‑screen hero and move FL‑BSA sections under /fl-bsa/.  ￼  ￼
	5.	Risky trust claims on home
“Trust badges: ISO 27001, AWS Partner, Privacy by design” are listed without context; they may be read as certification/partnership claims. Either remove, or replace with neutral text (e.g., “Security program, privacy by design”) until formally verified.  ￼

⸻

🟠 Medium‑priority
	6.	Product sub‑nav OK but needs cleanup
FL‑BSA sub‑nav exists (“Overview, How it Works, Compliance, Deployment, Whitepaper”) but keep only one sub‑nav instance, de‑duplicate anchors, and ensure scroll‑margin‑top so sections aren’t hidden beneath the fixed header.  ￼
	7.	External links harden
Ensure all external links (target="_blank") include rel="noopener noreferrer" and that GitHub links from Docs open in new tabs.  ￼
	8.	Active nav state & keyboard focus
Add aria-current="page" on active items; preserve visible focus styles for main nav and sub‑nav.
	9.	Footer contact consistency
Keep equilens@equilens.io as the single email across all pages; remove unused aliases.
	10.	Meta/OG/manifest completeness (private mode)
While private, include <meta name="robots" content="noindex, nofollow"> on all pages; ensure OG image and theme-color are present. When public, toggle robots/sitemap via your existing scripts.

⸻

🟢 Low‑priority polish
	11.	Typography & spacing
Normalize heading sizes and vertical rhythm across FL‑BSA and brand pages for a tighter, more “enterprise” feel (keep the current minimalist aesthetic and a single accent color).
	12.	Whitepaper “Download PDF”
The Whitepaper page shows a “Download PDF / Request PDF”. When the PDF exists, link directly and provide a clear fallback (“email us if you need a copy”).  ￼

⸻

2) Concrete Fixes (minimal diffs)

Keep static, brand‑first architecture. Only change what’s necessary.

A) Unify main nav (all pages)

Replace the nav links block with the same set on every page:

<!-- BRAND-ONLY NAV (same everywhere) -->
<nav class="navbar" role="navigation" aria-label="Primary">
  <div class="navbar-content">
    <a href="/" class="logo" aria-label="Equilens home">
      <span class="logo-dot"></span><span class="logo-text">Equilens</span>
    </a>
    <button class="nav-toggle" aria-controls="nav-links" aria-expanded="false">Menu</button>
    <div id="nav-links" class="nav-links" data-open="false">
      <a href="/fl-bsa/" class="nav-link" aria-current="false">FL‑BSA</a>
      <a href="/trust-center/" class="nav-link" aria-current="false">Trust Center</a>
      <a href="/procurement/" class="nav-link" aria-current="false">Procurement</a>
      <a href="/press/" class="nav-link" aria-current="false">Press</a>
      <a href="/legal/" class="nav-link" aria-current="false">Legal</a>
      <a href="/contact/" class="nav-link" aria-current="false">Contact</a>
    </div>
  </div>
</nav>

	•	Impact: High · Lanes: Web/IA · Rollback: restore previous header include.
	•	Why: Matches brand‑first goal; removes “Docs/FAQ” from the top bar (those can live in footer or within FL‑BSA).  ￼

B) Remove duplicated header blocks on product pages

Search in /fl-bsa/index.html and /fl-bsa/whitepaper/index.html for extra <nav class="navbar">…</nav> or “Equilens — Menu” snippets and delete the duplicates so only the global header remains.  ￼
	•	Impact: High · Lanes: Web · Rollback: re‑insert removed block.

C) Keep product sub‑nav inside FL‑BSA only

Add/retain a single sub‑nav right under the global header in /fl-bsa/*:

<nav class="product-subnav" aria-label="FL‑BSA">
  <div class="subnav-inner">
    <a href="/fl-bsa/" class="subnav-link">Overview</a>
    <a href="/fl-bsa/#how-it-works" class="subnav-link">How it Works</a>
    <a href="/fl-bsa/legal/" class="subnav-link">Compliance</a>
    <a href="/fl-bsa/#deployment" class="subnav-link">Pricing</a>
    <a href="/fl-bsa/whitepaper/" class="subnav-link">Whitepaper</a>
  </div>
</nav>
<style>section{scroll-margin-top:96px}</style>

	•	Impact: Med · Lanes: Web · Rollback: remove sub‑nav block.
	•	Note: Eliminate any secondary copies of the sub‑nav further down the page.  ￼

D) Home = minimal hero (brand page)

If we revert to the brand‑first plan, strip long sections from /index.html and keep hero + short FL‑BSA blurb + one CTA to /fl-bsa/. (This is exactly the minimal hero discussed earlier.)  ￼  ￼
	•	Impact: High · Lanes: Web/Content · Rollback: re‑enable sections.

E) Press → Manifest fix
	1.	Ensure a file exists at root: /site.webmanifest with valid JSON:

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

	2.	Reference it in <head>:

<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#ffffff">

	3.	Verify it serves with an appropriate content type (Chrome accepts application/manifest+json / application/json).  ￼

	•	Impact: Med · Lanes: Web · Rollback: unlink the manifest until fixed.

F) Trust badges copy

Replace the “ISO 27001 / AWS Partner / Privacy by design” list with neutral wording (e.g., “Security program”, “Evidence‑based privacy by design”). Don’t imply certification or partnership unless finalized.  ￼
	•	Impact: Med · Lanes: Content/Legal · Rollback: restore previous bullets.

G) External link hardening

Where external links open in new tabs (Docs → GitHub, etc.), add:

<a href="https://github.com/..." target="_blank" rel="noopener noreferrer">Docs Index</a>

	•	Impact: Med · Lanes: Web/Sec · Rollback: remove attributes.  ￼

H) Privacy (private mode)

Confirm <meta name="robots" content="noindex, nofollow"> remains present on key pages while the site is private; keep robots.txt restrictive until launch. (Your scripts can flip this later.)
	•	Impact: Low · Lanes: Web/SEO · Rollback: remove meta/toggle script at launch.

⸻

3) QA Checklist (do this after the patch)
	•	Nav uniformity: every page shows FL‑BSA · Trust Center · Procurement · Press · Legal · Contact in the main nav; Docs/FAQ moved to footer or product areas only.  ￼
	•	Product sub‑nav: appears only on /fl-bsa/*; section anchors scroll below header.  ￼
	•	No duplicate headers: FL‑BSA and its whitepaper show one global header only.  ￼
	•	Press → Manifest: link downloads/opens valid JSON; Lighthouse PWA audit doesn’t flag manifest.  ￼
	•	Copy risk removed: home no longer implies certs/partnerships.  ￼
	•	External links hardened: new‑tab links include rel="noopener noreferrer".  ￼
	•	Private mode: pages carry noindex; public toggle handled only when ready.

⸻

4) Notes on Visual Direction
	•	The approved design language is minimal, elegant, light with one accent; keep that for the next pass while we complete IA and cleanup. The logo/brand explorations remain your SSoT for future mark/wordmark swaps and tokenization.

⸻

5) Small Code Aids
	•	Hide the “Menu” button on desktop:

@media (min-width: 769px){ .nav-toggle{ display:none } }

	•	Active state:

<a href="/fl-bsa/" class="nav-link" aria-current="page">FL‑BSA</a>

	•	Section offset under fixed header:
Go for it
section{ scroll-margin-top: 96px; }


⸻

If you want, I can package the above as a single PR touching only: index.html, /fl-bsa/index.html, /fl-bsa/whitepaper/index.html, the shared header include (if you have one), and add /site.webmanifest + tiny CSS tweaks. The plan keeps your brand vs product separation intact and removes the distracting defects without altering your chosen aesthetic.  ￼
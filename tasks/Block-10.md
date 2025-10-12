Great—keeping the site private and moving in small, safe steps, here’s the next increment.

Block‑10 — Content Pass 2 (Docs / FAQ / Press + JSON‑LD + Print CSS)

Goal: add three low‑risk pages and search‑ready metadata while preserving current IA, brand, and private mode.
Style: smallest diffs; deterministic; reversible; no external scripts; WCAG‑AA.

⸻

1) Context & Goal
	•	The site reads well after Block‑9 but is still sparse.
	•	We’ll add /docs, /faq, /press and JSON‑LD on key pages, plus a print stylesheet for Trust/Legal.
	•	Keep top‑nav unchanged; expose new pages via footer to avoid IA churn.

⸻

2) Current State & SSoT
	•	Private mode (noindex + Disallow) ✅
	•	Brand v1.1; Product/Trust/Pricing/Contact present ✅
	•	Legal skeletons aligned with LexPro ✅
	•	Audits (Lychee/Pa11y/Lighthouse) in CI ✅

⸻

3) Proposed Approach (numbered; impact; alternatives)
	1.	Add three pages: /docs/, /faq/, /press/.
	•	Impact: Med • Lanes: Web/Content • Rollback: delete the folders.
	2.	Insert JSON‑LD on Home (Organization/WebSite/Breadcrumbs) and Product (SoftwareApplication/Product/Breadcrumbs).
	•	Impact: Med • Lanes: SEO/Web • Rollback: remove <script type="application/ld+json"> blocks.
	•	Alt: delay JSON‑LD until public; not chosen (safe under current CSP).
	3.	Print CSS for Trust/Legal/FAQ (clean PDFs for counsel/regulator sharing).
	•	Impact: Low • Lanes: Web • Rollback: delete the appended CSS block.
	4.	Footer links to the new pages (keep header nav stable).
	•	Impact: Low • Lanes: Web/Content • Rollback: remove footer lines.

⸻

4) Change‑Set Preview (file‑scoped diffs/snippets)

Branch: feature/block-10-content
Note: Paths are relative to repo root. Depth‑aware links preserved.

4.1 New pages (drop‑in)

A) docs/index.html

Impact: Low • Lanes: Web/Content • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Documentation — Equilens</title>
<meta name="description" content="Entry point to product documentation and technical resources.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/docs/">
<meta name="theme-color" content="#1E293B">
<link rel="stylesheet" href="../assets/base.css">
</head><body>
<a class="skip-to-content" href="#main">Skip to content</a>
<header class="wrap">
  <div class="brand">
    <img class="brand-logo" src="../assets/brand/logo-mark.svg" width="28" height="28" alt="Equilens">
    <span class="brand-name">Equilens</span> <span class="pill">FL‑BSA</span>
  </div>
  <nav>
    <a href="../">Home</a>
    <a href="../product/">Product</a>
    <a href="../trust-center/">Trust Center</a>
    <a href="../pricing/">Pricing</a>
    <a href="../contact/">Contact</a>
    <a href="../legal/">Legal</a>
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Documentation</h1>
  <div class="card">
    <p>FL‑BSA documentation lives in the product repository.</p>
    <ul class="asset-list">
      <li><a href="https://github.com/equilens-labs/fl-bsa/blob/main/docs/_INDEX.md">Docs index (GitHub)</a></li>
      <li><a href="https://github.com/equilens-labs/fl-bsa/tree/main/docs/gold">Production‑ready components</a></li>
    </ul>
    <p class="note">External links open GitHub; no analytics on this site.</p>
  </div>
</main>

<footer class="wrap">
  <small>© <span id="yr"></span> Equilens · <a href="../docs/">Docs</a> · <a href="../faq/">FAQ</a> · <a href="../press/">Press</a></small>
</footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>

B) faq/index.html

Impact: Med • Lanes: Web/Content/SEO • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FAQ — Equilens FL‑BSA</title>
<meta name="description" content="Common questions about FL‑BSA deployment, data handling, evidence, and compliance.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/faq/">
<meta name="theme-color" content="#1E293B">
<link rel="stylesheet" href="../assets/base.css">
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
    {"@type":"Question","name":"Do we send any data to Equilens?",
     "acceptedAnswer":{"@type":"Answer","text":"No. FL‑BSA is self‑hosted; all compute happens in your VPC/VM. Zero outbound calls by default."}},
    {"@type":"Question","name":"How long does a run take?",
     "acceptedAnswer":{"@type":"Answer","text":"Minutes for 10k rows; ~12 minutes for ~1M rows on validated profiles. Daily monitoring reuses the generator and completes in ≤5 minutes."}},
    {"@type":"Question","name":"Which frameworks are covered?",
     "acceptedAnswer":{"@type":"Answer","text":"ECOA/Reg B (US), EU AI Act, FCA Consumer Duty. Certificates: Data Quality, Model Fidelity, Training Convergence, Synthetic Quality, Regulatory Alignment."}},
    {"@type":"Question","name":"Deployment options?",
     "acceptedAnswer":{"@type":"Answer","text":"AWS Marketplace AMI or docker‑compose; CPU‑only and GPU‑preferred profiles supported."}},
    {"@type":"Question","name":"What’s in the evidence bundle?",
     "acceptedAnswer":{"@type":"Answer","text":"30‑page PDF report, signed manifest (dataset hash, RNG seed, software version), certificates. Artifacts are chained and retrievable by Task ID."}}
  ]
}
</script>
</head><body>
<a class="skip-to-content" href="#main">Skip to content</a>
<header class="wrap">
  <div class="brand">
    <img class="brand-logo" src="../assets/brand/logo-mark.svg" width="28" height="28" alt="Equilens">
    <span class="brand-name">Equilens</span> <span class="pill">FL‑BSA</span>
  </div>
  <nav>
    <a href="../">Home</a>
    <a href="../product/">Product</a>
    <a href="../trust-center/">Trust Center</a>
    <a href="../pricing/">Pricing</a>
    <a href="../contact/">Contact</a>
    <a href="../legal/">Legal</a>
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Frequently Asked Questions</h1>
  <details class="faq-item"><summary>Do we send any data to Equilens?</summary><p>No. FL‑BSA is self‑hosted; all compute happens in your boundary. Zero outbound calls by default.</p></details>
  <details class="faq-item"><summary>How long does a run take?</summary><p>Minutes for 10k rows; ~12 minutes for ~1M rows on validated profiles. Monitoring runs finish in ≤5 minutes.</p></details>
  <details class="faq-item"><summary>Which frameworks are covered?</summary><p>ECOA/Reg B (US), EU AI Act, FCA Consumer Duty—with evidence mapping.</p></details>
  <details class="faq-item"><summary>Deployment options?</summary><p>AWS Marketplace AMI or docker‑compose. CPU‑only and GPU‑preferred profiles supported.</p></details>
  <details class="faq-item"><summary>What’s in the evidence bundle?</summary><p>PDF report, signed manifest, and certificates; artifacts chained and retrievable by Task ID.</p></details>
</main>

<footer class="wrap">
  <small>© <span id="yr"></span> Equilens · <a href="../docs/">Docs</a> · <a href="../faq/">FAQ</a> · <a href="../press/">Press</a></small>
</footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>

C) press/index.html

Impact: Low • Lanes: Web/Brand • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Press Kit — Equilens</title>
<meta name="description" content="Logos, colors, and usage notes for Equilens.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/press/">
<meta name="theme-color" content="#1E293B">
<link rel="stylesheet" href="../assets/base.css">
</head><body>
<a class="skip-to-content" href="#main">Skip to content</a>
<header class="wrap">
  <div class="brand">
    <img class="brand-logo" src="../assets/brand/logo-mark.svg" width="28" height="28" alt="Equilens">
    <span class="brand-name">Equilens</span> <span class="pill">FL‑BSA</span>
  </div>
  <nav>
    <a href="../">Home</a>
    <a href="../product/">Product</a>
    <a href="../trust-center/">Trust Center</a>
    <a href="../pricing/">Pricing</a>
    <a href="../contact/">Contact</a>
    <a href="../legal/">Legal</a>
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Press Kit</h1>
  <div class="card">
    <p>For media use. Keep clear space around the logo; do not alter colors or proportions.</p>
    <ul class="asset-list">
      <li><a href="../assets/brand/logo-mark.svg" download>Logo mark (SVG)</a></li>
      <li><a href="../assets/brand/og-default.png" download>OG banner (PNG 1200×630)</a></li>
      <li><a href="../docs/brand/equilens_logo_mark_pack_v1_1/equilens_logo_mark_v1_1_white_512.png" download>Logo 512×512 (PNG)</a></li>
      <li><a href="../docs/brand/tokens.json">Design tokens (JSON)</a></li>
    </ul>
    <p class="note">Questions: <a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>
  </div>
</main>

<footer class="wrap">
  <small>© <span id="yr"></span> Equilens · <a href="../docs/">Docs</a> · <a href="../faq/">FAQ</a> · <a href="../press/">Press</a></small>
</footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

4.2 JSON‑LD inserts (minimal diffs)

D) index.html — inside <head> (keep existing meta; add this block)

Impact: Med • Lanes: SEO/Web • Rollback: remove block

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"Organization",
      "name":"Equilens",
      "url":"https://equilens.io/",
      "logo":"https://equilens.io/assets/brand/icon-512.png",
      "contactPoint":[{"@type":"ContactPoint","contactType":"sales","email":"equilens@equilens.io"}]
    },
    {"@type":"WebSite","url":"https://equilens.io/","name":"Equilens","inLanguage":"en"},
    {"@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://equilens.io/"}]}
  ]
}
</script>

E) product/index.html — inside <head>

Impact: Med • Lanes: SEO/Web • Rollback: remove block

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"SoftwareApplication",
      "name":"FL‑BSA — Fair‑Lending Bias‑Simulation Appliance",
      "applicationCategory":"BusinessApplication",
      "operatingSystem":"Linux, Containerized",
      "publisher":{"@type":"Organization","name":"Equilens"},
      "inLanguage":"en",
      "offers":[
        {"@type":"Offer","name":"Pilot‑Plus","priceCurrency":"GBP","price":"10000"},
        {"@type":"Offer","name":"Growth","priceCurrency":"GBP","price":"36000"},
        {"@type":"Offer","name":"Enterprise","priceCurrency":"GBP","price":"120000"}
      ]
    },
    {"@type":"Product","name":"FL‑BSA","brand":{"@type":"Brand","name":"Equilens"},"url":"https://equilens.io/product/"},
    {"@type":"BreadcrumbList","itemListElement":[
      {"@type":"ListItem","position":1,"name":"Home","item":"https://equilens.io/"},
      {"@type":"ListItem","position":2,"name":"Product","item":"https://equilens.io/product/"}]}
  ]
}
</script>


⸻

4.3 CSS — append print rules

F) assets/base.css (append at end)

Impact: Low • Lanes: Web • Rollback: delete this block

/* Print styles (Trust/Legal/FAQ export) */
@media print {
  header, nav, .pill, .cta, .skip-to-content { display: none !important; }
  a[href]:after { content: " (" attr(href) ")"; font-size: .9em; color: var(--muted); }
  .card { border: 1px solid #bbb !important; background: #fff !important; }
  body { color: #000; }
}


⸻

4.4 Footer links on existing pages (tiny addition)

Add to footer <small> in: index.html, product/index.html, trust-center/index.html, pricing/index.html, contact/index.html, legal/*.html
Impact: Low • Lanes: Web • Rollback: remove the links

 · <a href="./docs/">Docs</a> · <a href="./faq/">FAQ</a> · <a href="./press/">Press</a>
<!-- use ../docs/ etc. on subpages -->


⸻

5) Verification Plan (exact commands; artifacts)

# 0) Branch
git checkout -b feature/block-10-content

# 1) Add new pages
mkdir -p docs faq press
# (Paste files above into docs/index.html, faq/index.html, press/index.html)

# 2) Append CSS print block and add footer links (depth-aware) on existing pages

# 3) Insert JSON-LD blocks into index.html and product/index.html <head>

# 4) Local preview
python3 -m http.server 8080
# Visit: /, /product/, /docs/, /faq/, /press/
# Print preview on /trust-center/ and /legal/privacy.html (no CTA/nav)

# 5) Audits (CI will run), quick local checks:
grep -R "application/ld+json" -n index.html product/index.html faq/index.html
grep -R "<a href=\"\.\./" -n docs faq press  # depth correctness

# 6) Evidence
scripts/evidence/snapshot.sh "BLOCK-10-CONTENT"
# Artifacts in: output/ops/BLOCK-10-CONTENT-<timestamp>/

# 7) Commit
git add .
git commit -m "BLOCK-10: add docs/faq/press; JSON-LD on Home/Product; print CSS; footer links (site remains private)"
git push origin feature/block-10-content


⸻

6) Risks & Rollback

Risk	Impact	Mitigation	Rollback
JSON‑LD typos	Low	Schema is simple; CI link checks unaffected	Remove <script> blocks
Footer links clutter	Low	Kept to footer only	Remove links
Print CSS affects screen styles	Low	Scoped to @media print	Delete block


⸻

7) Follow‑ups (queued after Block‑10)
	•	Pass‑2 polish: add a brief “Who it’s for” tile on Home; add a small “In practice” example card on Product.
	•	Case Study shell: /case-studies/bank‑alpha/ (placeholder copy, private).
	•	Public launch script remains unchanged; we’ll stay private until you say otherwise.

⸻

8) Assumptions & Unknowns
	•	Product docs remain on GitHub (equilens-labs/fl-bsa).
	•	No analytics; CSP stays as in Block‑4 (JSON‑LD allowed since we didn’t add script-src).

⸻

TL;DR

Implement Block‑10 above to make the site feel complete (Docs, FAQ, Press + structured data + printable pages) while keeping private.
If you prefer, I can supply a single unified patch for feature/block-10-content.
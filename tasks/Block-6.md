
1) Context & Goal

Populate the site with useful content and search‑ready metadata while preserving the static, privacy‑first architecture:
	•	Add JSON‑LD (Organization, WebSite, Product, FAQPage, Breadcrumbs).
	•	Add pages: /docs/, /faq/, /press/.
	•	Keep no third‑party scripts, system‑UI fonts, and relative nav.

⸻

2) Proposed Approach (smallest diffs)

Item	What	Impact	Lanes	Rollback
A	JSON‑LD on Home (Organization, WebSite, Breadcrumbs)	Med	Web/SEO	Remove <script type="application/ld+json"> blocks
B	JSON‑LD on Product (SoftwareApplication + Product)	Med	Web/SEO	Remove JSON‑LD block
C	New Docs landing (/docs/) linking to GitHub docs	Low	Web	Remove folder
D	New FAQ (/faq/) with regulator‑grade Q&A + FAQPage JSON‑LD	Med	Web/SEO	Remove folder
E	New Press Kit (/press/) surfacing brand assets & usage	Low	Web/Brand	Remove folder
F	Tiny CSS helpers for FAQ/press (append only)	Low	Web	Delete appended lines

CSP note: Your CSP meta omits script-src, so inline JSON‑LD is allowed. We will not add any executable JS.

⸻

3) Change‑Set Preview (copy/paste)

Branch: feature/block-6-pages-schema
Uses your existing head pattern (canonical, OG, theme-color, favicons). Depth‑aware links preserved.

F) assets/base.css (append at end; no removals)

Impact: Low • Lanes: Web • Rollback: remove these blocks

/* FAQ & Press helpers */
.faq-item { border:1px solid var(--line); border-radius:8px; padding:1rem; background:#fff; margin-bottom:1rem }
.faq-item summary { cursor:pointer; font-weight:700 }
.faq-item[open] { background:var(--surface) }
.asset-list { list-style:disc; margin:0 0 1.25rem 1.25rem }
.note { color: var(--muted); font-size:.95rem }


⸻

A) Add JSON‑LD to Home (index.html, inside <head>; keep your existing tags)

Impact: Med • Lanes: Web/SEO • Rollback: remove this <script> block

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"Organization",
      "name":"Equilens",
      "url":"https://equilens.io/",
      "logo":"https://equilens.io/assets/brand/icon-512.png",
      "contactPoint":[{
        "@type":"ContactPoint",
        "contactType":"sales",
        "email":"equilens@equilens.io",
        "areaServed":["GB","US","EU"]
      }]
    },
    {
      "@type":"WebSite",
      "url":"https://equilens.io/",
      "name":"Equilens",
      "inLanguage":"en"
    },
    {
      "@type":"BreadcrumbList",
      "itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://equilens.io/"}
      ]
    }
  ]
}
</script>


⸻

B) Add JSON‑LD to Product (product/index.html, inside <head>)

Impact: Med • Lanes: Web/SEO • Rollback: remove block

<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@graph":[
    {
      "@type":"SoftwareApplication",
      "name":"FL‑BSA — Fair‑Lending Bias‑Simulation Appliance",
      "applicationCategory":"BusinessApplication",
      "operatingSystem":"Linux, Containerized",
      "softwareHelp":"https://github.com/equilens-labs/fl-bsa",
      "publisher":{"@type":"Organization","name":"Equilens"},
      "inLanguage":"en",
      "offers":[
        {"@type":"Offer","name":"Pilot‑Plus","priceCurrency":"GBP","price":"10000","category":"license"},
        {"@type":"Offer","name":"Growth","priceCurrency":"GBP","price":"36000","category":"license"},
        {"@type":"Offer","name":"Enterprise","priceCurrency":"GBP","price":"120000","category":"license"}
      ]
    },
    {
      "@type":"Product",
      "name":"FL‑BSA",
      "brand":{"@type":"Brand","name":"Equilens"},
      "description":"Self‑hosted appliance for bias simulation, audit evidence, and reporting in lending workflows.",
      "url":"https://equilens.io/product/"
    },
    {
      "@type":"BreadcrumbList",
      "itemListElement":[
        {"@type":"ListItem","position":1,"name":"Home","item":"https://equilens.io/"},
        {"@type":"ListItem","position":2,"name":"Product","item":"https://equilens.io/product/"}
      ]
    }
  ]
}
</script>


⸻

C) docs/index.html (new — Docs landing)

Impact: Low • Lanes: Web • Rollback: remove folder

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
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Documentation</h1>
  <div class="card">
    <p>FL‑BSA documentation lives in the product repository.</p>
    <ul class="asset-list">
      <li><a href="https://github.com/equilens-labs/fl-bsa/blob/main/docs/_INDEX.md">Docs Index (GitHub)</a></li>
      <li><a href="https://github.com/equilens-labs/fl-bsa/tree/main/docs/gold">Production‑ready components</a></li>
    </ul>
    <p class="note">External links open GitHub; no data is collected on this site.</p>
  </div>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

D) faq/index.html (new — FAQ + FAQPage JSON‑LD)

Impact: Med • Lanes: Web/SEO • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FAQ — Equilens FL‑BSA</title>
<meta name="description" content="Common questions about FL‑BSA deployment, data, evidence, and compliance.">
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
    {"@type":"Question","name":"How long does a typical run take?",
     "acceptedAnswer":{"@type":"Answer","text":"From minutes for 10k rows to ~12 minutes for ~1M rows on validated hardware profiles; daily monitoring runs reuse the generator and complete in ≤5 minutes."}},
    {"@type":"Question","name":"What regulatory frameworks are covered?",
     "acceptedAnswer":{"@type":"Answer","text":"Evidence maps to ECOA/Reg B (US), EU AI Act, and FCA Consumer Duty. Certificates include Data Quality, Model Fidelity, Training Convergence, Synthetic Quality, and Regulatory Alignment."}},
    {"@type":"Question","name":"What are the deployment options?",
     "acceptedAnswer":{"@type":"Answer","text":"AWS Marketplace AMI or containerized via docker‑compose. CPU‑only and GPU‑preferred profiles supported."}},
    {"@type":"Question","name":"What’s in the evidence bundle?",
     "acceptedAnswer":{"@type":"Answer","text":"A 30‑page PDF report, a signed manifest (dataset hash, RNG seed, software version), and certificates. Artifacts are chained for auditability and can be retrieved by Task ID."}}
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
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Frequently Asked Questions</h1>

  <details class="faq-item"><summary>Do we send any data to Equilens?</summary>
    <p>No. FL‑BSA is self‑hosted; all compute happens in your VPC/VM. Zero outbound calls by default.</p>
  </details>

  <details class="faq-item"><summary>How long does a typical run take?</summary>
    <p>From minutes for 10k rows to ~12 minutes for ~1M rows on validated hardware profiles; daily monitoring runs reuse the generator and complete in ≤5 minutes.</p>
  </details>

  <details class="faq-item"><summary>What regulatory frameworks are covered?</summary>
    <p>Evidence maps to ECOA/Reg B (US), EU AI Act, and FCA Consumer Duty. Certificates include Data Quality, Model Fidelity, Training Convergence, Synthetic Quality, and Regulatory Alignment.</p>
  </details>

  <details class="faq-item"><summary>What are the deployment options?</summary>
    <p>AWS Marketplace AMI or containerized via docker‑compose. CPU‑only and GPU‑preferred profiles supported.</p>
  </details>

  <details class="faq-item"><summary>What’s in the evidence bundle?</summary>
    <p>A 30‑page PDF report, a signed manifest (dataset hash, RNG seed, software version), and certificates. Artifacts are chained for auditability and can be retrieved by Task ID.</p>
  </details>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

E) press/index.html (new — Press Kit)

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
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Press Kit</h1>
  <div class="card">
    <p>For media use. Please keep clear space around the logo and do not alter colors or proportions.</p>
    <ul class="asset-list">
      <li><a href="../assets/brand/logo-mark.svg" download>Logo mark (SVG)</a></li>
      <li><a href="../assets/brand/og-default.png" download>OG banner (PNG 1200×630)</a></li>
      <li><a href="../site.webmanifest">Web app manifest</a></li>
      <li><a href="../docs/brand/equilens_logo_mark_pack_v1_1/equilens_logo_mark_v1_1_white_512.png" download>Logo 512×512 (PNG)</a></li>
      <li><a href="../docs/brand/tokens.json">Design tokens (JSON)</a></li>
    </ul>
    <p class="note">Questions: <a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>
  </div>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

4) Verification Plan (exact)

# 1) Branch
git checkout -b feature/block-6-pages-schema

# 2) Add new folders/files:
#    - docs/index.html
#    - faq/index.html
#    - press/index.html
#    - JSON-LD <script> blocks into: index.html and product/index.html
#    - Append CSS to assets/base.css

# 3) Local preview
python3 -m http.server 8080
# Visit: /, /product/, /docs/, /faq/, /press/

# 4) Quick checks
grep -R "application/ld+json" -n index.html product/index.html faq/index.html
grep -R "<a href=\"\.\./" -n docs faq press  # depth-aware paths on subpages

# 5) Evidence snapshot (existing)
scripts/evidence/snapshot.sh "BLOCK-6-PAGES-SCHEMA"

# 6) Commit
git add .
git commit -m "BLOCK-6: docs/faq/press pages + JSON-LD (Org/WebSite/Product/FAQ); small CSS helpers"
git push origin feature/block-6-pages-schema


⸻

5) Risks & Rollback

Risk	Impact	Mitigation	Rollback
JSON‑LD mis‑typed	Low	Validate in Rich Results test when public	Remove <script> blocks
External GitHub links fail CI link‑check	Low	Lychee usually OK; if flaky, add to ops/lychee.toml allowlist	Remove link or adjust allowlist
Press downloads outdated later	Low	Tied to SSOT locations; refresh when brand updates	Remove link or update target


⸻

6) Follow‑ups (after merge or when going public)
	•	Add Breadcrumb JSON‑LD to other pages (Pricing, Trust Center, Contact)—same pattern as Product.
	•	Structured data (Organization logo): once live, submit in Search Console.
	•	Sitemaps already generated in Block 3 when you flip to public.
	•	Case Study and Whitepaper placeholders (optional): /case-studies/ and /resources/.

⸻

7) Assumptions & Unknowns
	•	Product docs remain hosted in equilens-labs/fl-bsa (GitHub).
	•	Keeping site in private mode until you explicitly flip to public via the workflow.


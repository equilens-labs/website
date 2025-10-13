Acknowledged. We’ll keep the site private and separate Equilens (brand/company) from FL‑BSA (product) with the smallest safe diffs.

Below is Block 12 — IA Separation + Whitepaper and Block 13 — Copy Pass 3.
Everything is drop‑in, deterministic, reversible, and consistent with your current repo/workflows.

⸻

Block 12 — IA Separation + Whitepaper

1) Context & Goal
	•	Avoid brand/product mixing on the website.
	•	Introduce a product area under /fl-bsa/.
	•	Keep /product/ as a hub (no deep copy there).
	•	Add a Whitepaper skeleton (HTML landing; printable; PDF placeholder path).
	•	Provide product‑level legal summary separate from company legal.

2) Proposed Approach (impact • lanes • rollback)
	1.	Create product area /fl-bsa/ (overview page).
Impact: Med • Lanes: Web/Content • Rollback: remove folder.
	2.	Re-purpose /product/ as a simple Products hub → links to /fl-bsa/.
Impact: Low • Lanes: Web • Rollback: restore previous file.
	3.	Add Whitepaper: /fl-bsa/whitepaper/ (HTML, print‑ready; PDF link placeholder).
Impact: Med • Lanes: Web/Content • Rollback: remove folder.
	4.	Add product‑level legal summary: /fl-bsa/legal/ (summary + on‑request notices).
Impact: Low • Lanes: Web/Legal • Rollback: remove folder.
	5.	Nav label: change header “Product” → “FL‑BSA” linking to /fl-bsa/ (scripted update).
Impact: Low • Lanes: Web • Rollback: run script to revert.
	6.	CSS (append only): minor .paper print helpers.
Impact: Low • Lanes: Web • Rollback: delete appended block.

⸻

3) Change‑Set Preview (file‑scoped)

Branch: feature/block-12-separation

A) Update header across all pages (script)

scripts/content/sync_nav.py
Impact: Low • Lanes: Web/Ops • Rollback: rerun with prior header

#!/usr/bin/env python3
import pathlib, re
root = pathlib.Path(".")
TEMPLATE = """
<header class="wrap">
  <div class="brand">
    <img class="brand-logo" src="{DEPTH}assets/brand/logo-mark.svg" width="28" height="28" alt="Equilens">
    <span class="brand-name">Equilens</span> <span class="pill">FL‑BSA</span>
  </div>
  <nav>
    <a href="{DEPTH}">Home</a>
    <a href="{DEPTH}fl-bsa/">FL‑BSA</a>
    <a href="{DEPTH}trust-center/">Trust Center</a>
    <a href="{DEPTH}pricing/">Pricing</a>
    <a href="{DEPTH}contact/">Contact</a>
    <a href="{DEPTH}legal/">Legal</a>
  </nav>
</header>
""".strip()
def depth_for(p): return "" if p.parent == root else "../"
for html in root.rglob("*.html"):
    s = html.read_text(encoding="utf-8")
    new = re.sub(r"<header[\s\S]*?</header>", TEMPLATE.replace("{DEPTH}", depth_for(html)), s, flags=re.M)
    if new != s:
        html.write_text(new, encoding="utf-8")
        print("[OK] header:", html)
print("Done.")

B) New product area — /fl-bsa/index.html

Impact: Med • Lanes: Web/Content • Rollback: remove file/folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FL‑BSA — Fair‑Lending Bias‑Simulation Appliance</title>
<meta name="description" content="Self‑hosted appliance for bias simulation, signed evidence, and reporting across lending workflows.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/fl-bsa/">
<meta name="theme-color" content="#1E293B">
<link rel="stylesheet" href="../assets/base.css">
<!-- JSON-LD (SoftwareApplication/Product) for later public use -->
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"SoftwareApplication","name":"FL‑BSA — Fair‑Lending Bias‑Simulation Appliance","applicationCategory":"BusinessApplication","operatingSystem":"Linux, Containerized","publisher":{"@type":"Organization","name":"Equilens"},"inLanguage":"en"},
{"@type":"Product","name":"FL‑BSA","brand":{"@type":"Brand","name":"Equilens"},"url":"https://equilens.io/fl-bsa/"}
]}
</script>
</head><body>
<a class="skip-to-content" href="#main">Skip to content</a>
<header class="wrap"> <!-- will be auto-synced by script --></header>
<main id="main" class="wrap section">
  <h1>FL‑BSA</h1>
  <p class="tag">Self‑hosted appliance for bias simulation, signed evidence, and reporting.</p>
  <div class="grid">
    <div class="card span-6">
      <h2>Architecture</h2>
      <ul class="checks">
        <li>Multi‑container via docker‑compose (API, Worker, Redis)</li>
        <li>AMI via AWS Marketplace (single‑tenant)</li>
        <li>Optional Prometheus; <code>/metrics</code> endpoint</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Dual‑branch calibration</h2>
      <ul class="checks">
        <li>Amplification: features + historic decisions</li>
        <li>Intrinsic: features only (achievable fairness)</li>
        <li>Shows “Historical bias: X% → Achievable: Y%”</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Evidence bundle</h2>
      <p>PDF, signed manifest (dataset hash, RNG seed, software version), and certificates (Data Quality, Model Fidelity, Training Convergence, Synthetic Quality, Regulatory Alignment).</p>
    </div>
    <div class="card span-6">
      <h2>Input scenarios</h2>
      <ul class="checks">
        <li>Full‑row mode (≥10k rows incl. decision + protected class)</li>
        <li>Summary‑stats mode (IPF over FCA template)</li>
      </ul>
    </div>
  </div>
  <section class="section">
    <a class="cta" href="../contact/">Request details</a>
    <a style="margin-left:.75rem" href="./whitepaper/">Whitepaper</a>
    <a style="margin-left:.75rem" href="./legal/">Product legal</a>
  </section>
</main>
<footer class="wrap"><small>© <span id="yr"></span> Equilens · <a href="../docs/">Docs</a> · <a href="../faq/">FAQ</a> · <a href="../press/">Press</a> · <a href="../procurement/">Procurement</a></small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>

C) Re-purpose /product/ as hub

Impact: Low • Lanes: Web • Rollback: restore previous file

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Products — Equilens</title>
<meta name="description" content="Equilens product listing.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/product/">
<meta name="theme-color" content="#1E293B">
<link rel="stylesheet" href="../assets/base.css">
</head><body>
<a class="skip-to-content" href="#main">Skip to content</a>
<header class="wrap"></header>
<main id="main" class="wrap section">
  <h1>Products</h1>
  <div class="card">
    <h2><a href="../fl-bsa/">FL‑BSA</a></h2>
    <p>Fair‑Lending Bias‑Simulation Appliance — self‑hosted bias simulation with audit‑ready evidence.</p>
    <p class="note">More products may be added here in future.</p>
  </div>
</main>
<footer class="wrap"><small>© <span id="yr"></span> Equilens · <a href="../docs/">Docs</a> · <a href="../faq/">FAQ</a> · <a href="../press/">Press</a> · <a href="../procurement/">Procurement</a></small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>

D) Whitepaper landing — /fl-bsa/whitepaper/index.html

Impact: Med • Lanes: Web/Content • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FL‑BSA Whitepaper</title>
<meta name="description" content="Technical overview of the FL‑BSA approach: dual‑branch calibration, metrics, evidence chain, and regulatory mapping.">
<link rel="icon" href="../../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/fl-bsa/whitepaper/">
<meta name="theme-color" content="#1E293B">
<link rel="stylesheet" href="../../assets/base.css">
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"TechArticle","headline":"FL‑BSA Whitepaper","about":"Fair‑lending bias simulation and evidence","publisher":{"@type":"Organization","name":"Equilens"},"inLanguage":"en"}
</script>
<style>
/* page-local helpers (print-friendly) */
.paper h1{margin:.2rem 0 .6rem} .paper h2{margin:1.2rem 0 .4rem}
.paper .byline{color:var(--muted)}
.paper section{margin:1rem 0}
</style>
</head><body>
<a class="skip-to-content" href="#main">Skip to content</a>
<header class="wrap"></header>
<main id="main" class="wrap section paper">
  <h1>FL‑BSA Whitepaper</h1>
  <p class="byline">Version: draft v1 • This HTML is print‑ready (File → Print → Save as PDF).</p>

  <section>
    <h2>Abstract</h2>
    <p>FL‑BSA provides a self‑hosted bias‑simulation approach for lending portfolios using a dual‑branch calibration of CTGAN models to distinguish historical bias from achievable fairness…</p>
  </section>

  <section>
    <h2>1. Introduction & Rationale</h2>
    <p>Regulatory scrutiny (ECOA/Reg B, EU AI Act, FCA Consumer Duty) requires demonstrable testing for disparate impact and treatment…</p>
  </section>

  <section>
    <h2>2. Method (Dual‑Branch Calibration)</h2>
    <ul class="checks">
      <li>Amplification branch: train on features + historic decisions</li>
      <li>Intrinsic branch: train on features only</li>
      <li>Independent hyperparameter optimization per branch (Optuna)</li>
    </ul>
  </section>

  <section>
    <h2>3. Synthetic Generation & Metrics</h2>
    <p>Generation scale (100k–3M), over‑sampling options, metrics (AIF360/Fairlearn), LaTeX→PDF pipeline, signed manifest…</p>
  </section>

  <section>
    <h2>4. Evidence Chain & Certificates</h2>
    <p>Data lineage, statistical fidelity, bias preservation, convergence, regulatory mapping, immutable audit trail…</p>
  </section>

  <section>
    <h2>5. Performance Profiles</h2>
    <p>Validated timings (10k→1M), CPU‑only fallbacks, GPU‑preferred profiles…</p>
  </section>

  <section>
    <h2>6. Security & Privacy Posture</h2>
    <p>Self‑hosted, no outbound by default, Cosign‑signed images, SBOM/SLSA…</p>
  </section>

  <section>
    <h2>7. Limitations & Appropriate Use</h2>
    <p>Scope, assumptions, limitations of CTGAN, responsible‑use notes…</p>
  </section>

  <section>
    <p><a class="cta" href="../">Back to FL‑BSA</a> <a style="margin-left:.75rem" href="./Equilens_FL-BSA_Whitepaper_v1.pdf">Download PDF (placeholder)</a></p>
  </section>
</main>
<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>

Optional authoring source (no build):
docs/whitepapers/fl-bsa_v1.md — keep the same section headings for counsel/SMEs.

E) Product‑level legal summary — /fl-bsa/legal/index.html

Impact: Low • Lanes: Web/Legal • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FL‑BSA — Product Legal (Summary)</title>
<meta name="description" content="High-level legal position for FL‑BSA. Contractual terms delivered via AWS Marketplace or private offer.">
<link rel="icon" href="../../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/fl-bsa/legal/">
<meta name="theme-color" content="#1E293B">
<link rel="stylesheet" href="../../assets/base.css">
</head><body>
<a class="skip-to-content" href="#main">Skip to content</a>
<header class="wrap"></header>
<main id="main" class="wrap section">
  <h1>Product Legal (Summary)</h1>
  <div class="card">
    <h2>Position</h2>
    <ul class="checks">
      <li>Self‑hosted appliance; Equilens is <strong>not</strong> a processor of customer datasets for runs.</li>
      <li>Contracts via AWS Marketplace or Private Offer; product terms provided in the offer.</li>
      <li>Security/compliance artefacts available on request (SOC2 letter, pen‑test letter, SBOM/SLSA).</li>
    </ul>
    <p class="note">This page is a summary. Company website legal lives at <a href="../../legal/">/legal/</a>.</p>
  </div>
  <div class="card">
    <h2>Requests</h2>
    <ul class="checks">
      <li><a href="mailto:equilens@equilens.io?subject=FL‑BSA%20contract%20terms%20request">Request contract terms</a></li>
      <li><a href="mailto:equilens@equilens.io?subject=Security%20artefacts%20request">Request security artefacts</a></li>
    </ul>
  </div>
</main>
<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>

F) CSS append (print helpers)

assets/base.css (append)
Impact: Low • Lanes: Web • Rollback: delete block

/* Block‑12: paper helpers */
.paper { max-width: 84ch; }
@media print {
  header, nav, .pill, .cta, .skip-to-content { display: none !important; }
  a[href]:after { content: " (" attr(href) ")"; font-size: .9em; color: var(--muted); }
  .card { border: 1px solid #bbb !important; background: #fff !important; }
}


⸻

4) Verification Plan

git checkout -b feature/block-12-separation

# Add new folders/files:
mkdir -p fl-bsa fl-bsa/whitepaper fl-bsa/legal scripts/content
# Paste the HTML files above + sync_nav.py; append CSS

# Sync header (Product -> FL‑BSA; link to /fl-bsa/)
python3 scripts/content/sync_nav.py

# Local preview (site remains private)
python3 -m http.server 8080
# Visit: /fl-bsa/, /fl-bsa/whitepaper/, /fl-bsa/legal/, /product/

# Evidence
scripts/evidence/snapshot.sh "BLOCK-12-SEPARATION"

git add .
git commit -m "BLOCK-12: separate brand vs product (FL‑BSA area + whitepaper + product legal); header nav update; print helpers"
git push origin feature/block-12-separation


⸻

5) Risks & Rollback

Risk	Impact	Mitigation	Rollback
Broken internal links	Med	Depth‑aware paths; test locally; CI link check	Revert folder or run quick sed fix
IA churn	Low	Header label only; /product/ preserved as hub	Restore previous header
Whitepaper PDF missing	Low	HTML is print‑ready; PDF link marked placeholder	Remove link or upload PDF later


⸻

Block 13 — Copy Pass 3 (clarity, audience tiles, examples)

1) Goals
	•	Make company vs. product intent obvious on key pages.
	•	Add “Who it’s for” tile on Home.
	•	Add a small “In practice” example on FL‑BSA page.

2) Change‑Set (small diffs)

A) index.html — add audience tile

Impact: Low • Lanes: Content/Web • Rollback: remove block

<section class="wrap section alt">
  <h2>Who it’s for</h2>
  <div class="grid">
    <div class="card span-6"><h3>Compliance & Risk</h3><p>Evidence your fair‑lending posture with regulator‑ready PDFs and traceable manifests.</p></div>
    <div class="card span-6"><h3>Model Risk & Data</h3><p>Run synthetic scenarios safely; compare historical vs. achievable fairness with clear deltas.</p></div>
  </div>
</section>

B) /fl-bsa/index.html — add small “In practice” example

Impact: Low • Lanes: Content/Web • Rollback: remove block

<section class="wrap section">
  <h2>In practice</h2>
  <div class="card">
    <p><strong>Example:</strong> A bank ingests 250k prior applications including decisions. FL‑BSA reports historical DI of 0.68 and an achievable DI of 0.83 after removing decision leakage—documented with certificate chain and signed manifest.</p>
    <p class="note">Illustrative only; not a customer claim.</p>
  </div>
</section>

C) /pricing/index.html — clarify scope (product‑specific)

Impact: Low • Lanes: Content/Web • Rollback: remove line

<h1>Pricing — FL‑BSA</h1>
<p class="note">This pricing applies to the FL‑BSA product.</p>

D) /trust-center/index.html — clarify scope (company‑level)

Impact: Low • Lanes: Content/Web • Rollback: remove line

<p class="note">This Trust Center reflects Equilens (company) controls. Product‑specific summary lives at <a href="../fl-bsa/legal/">FL‑BSA legal</a>.</p>


⸻

3) Verification Plan

git checkout -b feature/block-13-copy

# Apply the small additions above to: index.html, fl-bsa/index.html, pricing/index.html, trust-center/index.html

python3 -m http.server 8080
# Navigate and confirm brand vs product separation feels clear.

scripts/evidence/snapshot.sh "BLOCK-13-COPY"

git add .
git commit -m "BLOCK-13: copy pass (audience tile, example on FL‑BSA; scope notes on Pricing/Trust Center)"
git push origin feature/block-13-copy


⸻

Follow‑ups
	•	When the PDF whitepaper is ready, drop it at: fl-bsa/whitepaper/Equilens_FL-BSA_Whitepaper_v1.pdf and refresh evidence.
	•	If you later want “Products” in the header (instead of FL‑BSA), run sync_nav.py with an alternate template (I can supply), and keep /fl-bsa/ unchanged.

⸻

Assumptions & Unknowns
	•	One product (FL‑BSA) today; more may be added later under /products/ or separate slugs.
	•	All pages remain private (noindex + Disallow) until you flip via the existing workflow.
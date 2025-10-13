Excellent. Let’s proceed with Block 11 — Procurement & Deployment Path to make the site feel complete for bank buyers while staying private. This is a small, safe pass: one new page, tiny CSS helpers, footer links, and structured data. No layout rewrites, no analytics, no public index.

⸻

1) Context & Goal

Turn your SSOT “Sales & Procurement Flow” into a concise, audit‑ready /procurement/ page that explains how to buy (AWS Marketplace) and how to deploy (AMI or docker‑compose), with on‑request evidence links. Add HowTo JSON‑LD for search readiness later (kept safe under current CSP). Keep header nav unchanged; expose via footer only.

⸻

2) Proposed Approach (smallest diffs)

Item	What	Impact	Lanes	Rollback
A	New page: /procurement/ (how to buy + deploy)	Med	Web/Content	Remove folder
B	HowTo JSON‑LD (How‑to Buy) on /procurement/	Med	SEO/Web	Remove <script> block
C	Footer links: add “Procurement”	Low	Web	Remove links
D	CSS helpers for step list (append only)	Low	Web	Delete appended lines
E	Evidence snapshot	Low	Ops/Audit	Delete snapshot dir


⸻

3) Change‑Set Preview (copy/paste)

Branch: feature/block-11-procurement
Site remains private (noindex + Disallow). Depth‑aware links preserved.

D) assets/base.css — append (no removals)

Impact: Low • Lanes: Web • Rollback: delete this block

/* Block‑11: procurement steps */
.steps { counter-reset: step; display:grid; grid-template-columns: repeat(12,1fr); gap:24px; margin:1rem 0 }
.step { grid-column: span 6; border:1px solid var(--line); border-radius:8px; background:#fff; padding:1rem }
.step header { font-weight:700; margin-bottom:.25rem }
.step::before { counter-increment: step; content: counter(step); display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:999px; background:var(--slate); color:#fff; margin-right:.5rem }
@media(max-width:900px){ .step{grid-column: span 12} }


⸻

A/B) procurement/index.html — new page (How to Buy & Deploy)

Impact: Med • Lanes: Web/Content/SEO • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Procurement & Deployment — Equilens FL‑BSA</title>
<meta name="description" content="How to buy via AWS Marketplace and deploy FL‑BSA inside your boundary.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/procurement/">
<meta name="theme-color" content="#1E293B">
<link rel="stylesheet" href="../assets/base.css">
<!-- HowTo JSON‑LD (safe under current CSP; non-executable) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Buy and deploy FL‑BSA",
  "description": "How regulated teams subscribe via AWS Marketplace and deploy the self‑hosted appliance.",
  "totalTime": "PT15M",
  "step": [
    { "@type":"HowToStep", "name":"Subscribe", "text":"Open the AWS Marketplace listing and click Subscribe. Accept terms." },
    { "@type":"HowToStep", "name":"Launch", "text":"Launch the AMI in your account. Choose instance type and VPC/subnet per policy." },
    { "@type":"HowToStep", "name":"Start services", "text":"Boot runs docker‑compose automatically. Access the appliance on the instance IP:8080 (or your chosen port)." },
    { "@type":"HowToStep", "name":"Run a test", "text":"Upload sample data (or use the FCA sandbox dataset). Generate the PDF and signed manifest." },
    { "@type":"HowToStep", "name":"Move to Pilot‑Plus", "text":"If needed, activate the paid 3‑month tier. For upgrades, request a Private Offer." }
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
  <h1>Procurement & Deployment</h1>
  <p class="lead">Buy through AWS Marketplace and deploy inside your boundary. No new supplier record is typically required—billing flows through AWS.</p>

  <section class="section">
    <h2>How to buy (AWS Marketplace)</h2>
    <div class="steps">
      <div class="step"><header>Subscribe</header><p>Open the AWS Marketplace listing and click <em>Subscribe</em>. Accept the standard terms.</p></div>
      <div class="step"><header>Launch</header><p>Click <em>Launch instance</em>, select instance type/region, and place into your VPC/subnet per policy.</p></div>
      <div class="step"><header>Start services</header><p>On boot, a systemd service runs <code>docker-compose</code>; the appliance is available at <code>http://&lt;instance‑ip&gt;:8080</code> (or your configured port).</p></div>
      <div class="step"><header>Run a test</header><p>Use the bundled FCA dataset or your summary stats to generate the regulator‑ready PDF and signed manifest.</p></div>
      <div class="step"><header>Pilot‑Plus & upgrades</header><p>Activate Pilot‑Plus (3‑month, up to 100k rows) or request a Private Offer to move to Growth/Enterprise.</p></div>
    </div>
    <p class="note">Alternative: deploy with <strong>docker‑compose</strong> on your VM. CPU‑only and GPU‑preferred profiles are supported.</p>
  </section>

  <section class="section alt">
    <h2>What procurement & security need</h2>
    <div class="grid">
      <div class="card span-6">
        <h3>Procurement</h3>
        <ul class="checks">
          <li>AWS Marketplace vendor (billing via AWS)</li>
          <li>Pricing tiers: Pilot‑Plus, Growth, Enterprise</li>
          <li>Renewal via AWS; Private Offer for upgrades</li>
        </ul>
        <p><a href="mailto:equilens@equilens.io?subject=Private%20Offer%20request%20(Equilens%20FL‑BSA)&body=Company%3A%0ARegion%3A%0ATier%3A%0ATimeline%3A%0A">Request a Private Offer</a></p>
      </div>
      <div class="card span-6">
        <h3>Security</h3>
        <ul class="checks">
          <li>Self‑hosted. No data leaves your boundary by default</li>
          <li>Cosign‑signed images; SBOM + SLSA provenance</li>
          <li>Evidence on request: SOC 2 letter, pen‑test letter</li>
        </ul>
        <p><a href="mailto:equilens@equilens.io?subject=Security%20artefacts%20request&body=Org%3A%0AUse%20case%3A%0AArtefacts%3A%20SOC2%2Fpen‑test%2FSBOM%20%28choose%29%0A">Request security artefacts</a></p>
      </div>
    </div>
  </section>

  <section class="section">
    <h2>Deployment options</h2>
    <div class="grid">
      <div class="card span-6">
        <h3>AWS AMI</h3>
        <p>Single‑tenant AMI. Boots with <code>docker‑compose</code> and exposes API on port 8080. Optional Prometheus on 9090.</p>
      </div>
      <div class="card span-6">
        <h3>Container (VM)</h3>
        <p>docker‑compose with API, Worker, Redis. CPU‑only profile available; GPU‑preferred for faster generation.</p>
      </div>
    </div>
    <p class="note">For regulated changes (CSP/HSTS/CAA), coordinate through your network and DNS teams; we provide guidance on request.</p>
  </section>

  <section class="section">
    <p><a class="cta" href="../contact/">Contact</a></p>
  </section>
</main>

<footer class="wrap">
  <small>© <span id="yr"></span> Equilens · <a href="../docs/">Docs</a> · <a href="../faq/">FAQ</a> · <a href="../press/">Press</a> · <a href="../procurement/">Procurement</a></small>
</footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

C) Footer links — tiny additions

Add to footer <small> on these pages (depth‑aware):
index.html, product/index.html, trust-center/index.html, pricing/index.html, contact/index.html, docs/index.html, faq/index.html, press/index.html, legal/*.html
Impact: Low • Lanes: Web • Rollback: remove the link

 · <a href="./procurement/">Procurement</a>
<!-- use ../procurement/ on subpages -->


⸻

4) Verification Plan (exact)

# 0) Branch
git checkout -b feature/block-11-procurement

# 1) Add new page and CSS append
mkdir -p procurement
# paste procurement/index.html
# append the .steps CSS block to assets/base.css

# 2) Add footer links (depth-aware) across pages
# root pages use "./procurement/", subpages use "../procurement/"

# 3) Local preview (still private)
python3 -m http.server 8080
# Visit: /procurement/ and check layout, mailto prefill, and JSON-LD presence

# 4) Quick checks
grep -R "application/ld+json" -n procurement/index.html
grep -R "<a href=\"\./procurement/" -n index.html
grep -R "<a href=\"\.\./procurement/" -n product trust-center pricing contact docs faq press legal

# 5) Evidence
scripts/evidence/snapshot.sh "BLOCK-11-PROCUREMENT"

# 6) Commit
git add .
git commit -m "BLOCK-11: add procurement/deployment path (HowTo, footer links); site remains private"
git push origin feature/block-11-procurement


⸻

5) Risks & Rollback

Risk	Impact	Mitigation	Rollback
JSON‑LD typos	Low	Simple HowTo schema; remove if noisy	Delete <script> block
IA clutter	Low	Links added only to footer; header unchanged	Remove footer links
Mailto prefill odd in some clients	Low	Uses standard URL encoding; non‑critical	Remove query string


⸻

6) Follow‑ups (queued next)
	•	Block 12 — Case Study Shell + Resources: /case-studies/placeholder/ and /resources/ with on‑request links; tiny cards only.
	•	Block 13 — Copy Pass 3: hero length tightening + “Who it’s for” tile on Home; a brief “In practice” example on Product.
	•	Block 14 — Performance polish: tiny CSS refactor to cut bytes and ensure good Lighthouse metrics (still private).

⸻

7) Assumptions & Unknowns
	•	AWS Marketplace listing exists (we reference it generically; no link published yet while private).
	•	No forms added; contact stays mailto.
	•	You want minimal IA churn (footer only for the new page).

If you want, I can provide a single unified patch for feature/block-11-procurement containing all edits above.
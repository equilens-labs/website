
1) Context & Goal

Populate the website with audit‑ready, regulator‑friendly content for Equilens + FL‑BSA, reusing your SSOT language. Keep no external scripts, system‑UI fonts, relative links, and your existing private/public toggle.

⸻

2) Proposed Approach (smallest diffs)

Item	What	Impact	Lanes	Rollback
A	Fill Home with hero, how‑it‑works, evidence, frameworks	Med	Web/Content	Restore prior file
B	Add /product/ (FL‑BSA deep‑dive)	Med	Web/Content	Remove folder
C	Add /trust-center/ (security & compliance)	Med	Web/Content	Remove folder
D	Add /pricing/ (tiers from SSOT; subject to contract)	Low	Web/Content	Remove folder
E	Expand /contact/ (what to send; privacy note)	Low	Web	Restore prior file
F	Tiny CSS component utilities (cards/grid/kpi)	Low	Web	Remove appended CSS lines


⸻

3) Change‑Set Preview (copy/paste)

Branch: feature/block-6-content.
Note: Keep your Block‑3 heads (canonical, OG, theme‑color). If any head tags below duplicate yours, prefer your existing ones.

⸻

F) assets/base.css (append at end; no removals)

Impact: Low • Lanes: Web • Rollback: delete these blocks

/* Sections & layout */
.section{padding:2.5rem 0}
.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:24px}
.span-12{grid-column:span 12}
.span-6{grid-column:span 6}
@media(max-width:900px){.span-6{grid-column:span 12}}

/* Cards & KPIs */
.card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:1.25rem}
.card.surface{background:var(--surface)}
.kpis{display:flex;gap:24px;flex-wrap:wrap}
.kpi{min-width:220px;border:1px solid var(--line);border-radius:8px;padding:1rem;background:#fff}
.kpi .num{font-weight:700;font-size:1.5rem}
.badge{display:inline-block;background:var(--accent-light);color:var(--accent);border-radius:999px;padding:.25rem .5rem;font-size:.85rem}

/* Simple list */
.checks{list-style:disc;margin:0 0 1.25rem 1.25rem}


⸻

A) index.html (Home)

Impact: Med • Lanes: Web/Content • Rollback: restore previous index.html

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Equilens — Fair‑Lending Bias‑Simulation Appliance (FL‑BSA)</title>
<meta name="description" content="Deterministic bias simulation & audit‑ready evidence for fair‑lending compliance. Self‑hosted; no data leaves your boundary.">
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="./favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/">
<meta name="theme-color" content="#1E293B">
<meta property="og:title" content="Equilens — Fair‑Lending Bias‑Simulation Appliance">
<meta property="og:description" content="Deterministic bias simulation & compliance evidence — self‑hosted, no data leaves your VPC.">
<meta property="og:url" content="https://equilens.io/">
<meta property="og:image" content="https://equilens.io/assets/brand/og-default.png">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<link rel="stylesheet" href="./assets/base.css">
</head><body>
<a class="skip-to-content" href="#main">Skip to content</a>
<header class="wrap">
  <div class="brand">
    <img class="brand-logo" src="./assets/brand/logo-mark.svg" width="28" height="28" alt="Equilens">
    <span class="brand-name">Equilens</span> <span class="pill">FL‑BSA</span>
  </div>
  <nav>
    <a href="./product/">Product</a>
    <a href="./trust-center/">Trust Center</a>
    <a href="./pricing/">Pricing</a>
    <a href="./contact/">Contact</a>
    <a href="./legal/">Legal</a>
  </nav>
</header>

<main id="main" class="wrap hero">
  <h1>Fair‑Lending Bias‑Simulation Appliance</h1>
  <p class="tag">Deterministic bias simulation & <strong>regulator‑ready evidence</strong> — self‑hosted, no data leaves your VPC.</p>
  <ul class="checks">
    <li><strong>Dual‑branch testing</strong>: Historical bias vs achievable fairness, with clear “X% → Y%” deltas.</li>
    <li><strong>Evidence bundle</strong>: 30‑page PDF, signed manifest, quality & compliance certificates.</li>
    <li><strong>Sealed appliance</strong>: AWS Marketplace AMI or docker‑compose; zero outbound calls by default.</li>
  </ul>
  <p><a class="cta" href="./contact/">Contact</a></p>
</main>

<section class="wrap section">
  <h2>How it works</h2>
  <div class="grid">
    <div class="card span-6">
      <h3>1) Calibrate</h3>
      <p>Upload data (or summary stats). A dual‑branch CTGAN engine calibrates:</p>
      <ul class="checks">
        <li>Amplification branch (features + historic decisions)</li>
        <li>Intrinsic branch (features only)</li>
      </ul>
    </div>
    <div class="card span-6">
      <h3>2) Simulate & Measure</h3>
      <p>Generate synthetic borrowers with embedded decisions; compute AIF360 & Fairlearn metrics (DI ratio, EO, etc.).</p>
    </div>
    <div class="card span-6">
      <h3>3) Evidence Bundle</h3>
      <p>Receive a signed manifest, regulator‑ready PDF, certificates (data quality, model fidelity, training convergence, synthetic quality, regulatory alignment).</p>
    </div>
    <div class="card span-6">
      <h3>4) Audit‑Trail</h3>
      <p>Artifacts retrievable by Task ID; hashes chain data → model → output, ensuring defensible lineage.</p>
    </div>
  </div>
</section>

<section class="wrap section">
  <h2>Designed for regulators</h2>
  <div class="kpis">
    <div class="kpi"><div class="num">PDF + Manifest</div><div>30‑page report + signed JSON</div></div>
    <div class="kpi"><div class="num">CFPB • EU AI Act • FCA</div><div>Evidence mapped to framework clauses</div></div>
    <div class="kpi"><div class="num">Self‑hosted</div><div>No data leaves your boundary</div></div>
  </div>
</section>

<section class="wrap section">
  <h2>Why teams choose Equilens</h2>
  <div class="grid">
    <div class="card span-6"><h3>Sealed appliance</h3><p>Runs entirely in your VPC. Optional usage metrics only.</p></div>
    <div class="card span-6"><h3>Deterministic</h3><p>Reproducible runs with pinned versions; CPU‑only profiles supported.</p></div>
    <div class="card span-6"><h3>Performance</h3><p>Validated at scale; 10k–1M rows in minutes; daily monitoring in ≤5 min.</p></div>
    <div class="card span-6"><h3>Observability</h3><p><code>/metrics</code> endpoint (Prometheus format); optional Grafana dashboard JSON.</p></div>
  </div>
</section>

<section class="wrap section">
  <h2>Next steps</h2>
  <p>See the <a href="./product/">product</a> details, review the <a href="./trust-center/">Trust Center</a>, or check <a href="./pricing/">pricing</a>.</p>
</section>

<footer class="wrap"><small>© <span id="yr"></span> Equilens. All rights reserved.</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

B) product/index.html (FL‑BSA)

Impact: Med • Lanes: Web/Content • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>FL‑BSA — Product Overview</title>
<meta name="description" content="FL‑BSA: Dual‑branch calibration, synthetic generation, bias metrics, and signed evidence for fair‑lending compliance.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/product/">
<meta name="theme-color" content="#1E293B">
<meta property="og:title" content="Equilens FL‑BSA — Product">
<meta property="og:image" content="https://equilens.io/assets/brand/og-default.png">
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
    <a href="../trust-center/">Trust Center</a>
    <a href="../pricing/">Pricing</a>
    <a href="../contact/">Contact</a>
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Fair‑Lending Bias‑Simulation Appliance (FL‑BSA)</h1>
  <p class="tag">Self‑hosted appliance for bias simulation, audit evidence, and reporting in lending workflows.</p>

  <div class="grid">
    <div class="card span-6">
      <h2>Architecture</h2>
      <ul class="checks">
        <li>Multi‑container via docker‑compose (API, Worker, Redis). Single‑tenant AMI via AWS Marketplace.</li>
        <li>Optional Prometheus; <code>/metrics</code> exposed for customer monitoring.</li>
        <li>CPU‑only & GPU‑preferred profiles; deterministic configs.</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Dual‑branch calibration</h2>
      <ul class="checks">
        <li><strong>Amplification branch</strong>: train on features + historic decisions.</li>
        <li><strong>Intrinsic branch</strong>: train on features only (no decisions) to estimate achievable fairness.</li>
        <li>Displays “Historical bias: X% → Achievable: Y%”.</li>
      </ul>
    </div>

    <div class="card span-6">
      <h2>Synthetic generation</h2>
      <p>Produce 100k–3M borrower rows matching the joint distribution; can over‑sample sparse protected groups.</p>
    </div>
    <div class="card span-6">
      <h2>Bias‑audit pipeline</h2>
      <p>Metrics via AIF360 & Fairlearn (Statistical Parity, Demographic Parity, Equalized Odds, etc.); renders LaTeX→PDF; signs manifest.</p>
    </div>

    <div class="card span-6">
      <h2>Evidence bundle</h2>
      <ul class="checks">
        <li>Regulator‑ready PDF (ECOA/EU AI Act/FCA variants)</li>
        <li><code>manifest.json</code> with dataset hash, RNG seed, software version</li>
        <li>Certificates: Data Quality, Model Fidelity, Training Convergence, Synthetic Quality, Regulatory Alignment</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Monitoring & observability</h2>
      <ul class="checks">
        <li>Prometheus metrics: CTGAN training, hardware utilization, bias deltas</li>
        <li>Optional Grafana dashboard JSON</li>
        <li>Health checks for Redis & Celery</li>
      </ul>
    </div>
  </div>

  <section class="section">
    <h2>Input scenarios</h2>
    <div class="grid">
      <div class="card span-6">
        <h3>Full‑row mode</h3>
        <p>≥10k anonymized applications incl. decision + one protected class. Trains CTGAN; saves SHA‑256 of CSV.</p>
      </div>
      <div class="card span-6">
        <h3>Summary‑stats mode</h3>
        <p>YAML counts (approval rate by gender, FICO share, product mix). IPF warp of FCA synthetic template.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <h2>Who it’s for</h2>
    <p>Risk, Model Risk, Compliance, Internal Audit; engineers supporting governance & reporting.</p>
  </section>

  <section class="section">
    <a class="cta" href="../contact/">Request details</a>
  </section>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

C) trust-center/index.html

Impact: Med • Lanes: Web/Content • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Trust Center — Security & Compliance</title>
<meta name="description" content="Bank‑grade security & compliance posture for Equilens FL‑BSA.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/trust-center/">
<meta name="theme-color" content="#1E293B">
<meta property="og:title" content="Equilens — Trust Center">
<meta property="og:image" content="https://equilens.io/assets/brand/og-default.png">
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
    <a href="../pricing/">Pricing</a>
    <a href="../contact/">Contact</a>
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Trust Center</h1>
  <p class="tag">Privacy‑first, self‑hosted deployment with transparent evidence and clear responsibilities.</p>

  <div class="grid">
    <div class="card span-6">
      <h2>Security & compliance artefacts</h2>
      <ul class="checks">
        <li>SOC 2 Type II report (annual)</li>
        <li>Annual penetration‑test letter</li>
        <li>SBOM + SLSA provenance (image)</li>
        <li>Cosign‑signed OCI images (keyless with GitHub OIDC)</li>
        <li>Reg‑mapping: EU AI Act, FCA PS22/9, ECOA/Reg B, SR 11‑7, OSFI B‑10, APRA CPS 230, MAS FEAT</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Operational controls</h2>
      <ul class="checks">
        <li>Hardened containers (seccomp, non‑root UID, read‑only FS)</li>
        <li>Secrets via KMS/Secrets Manager; rotation guidance</li>
        <li>Weekly SBOM diff & CVE scan; break‑the‑build on High/Critical</li>
        <li>Semgrep & CodeQL static analysis in CI</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Networking & data</h2>
      <ul class="checks">
        <li>Runs in your VPC/VM; no data leaves by default</li>
        <li>Optional AWS usage metrics; <strong>off by default</strong></li>
        <li>HTTPs recommended with HSTS, CSP, Referrer‑Policy</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Contact</h2>
      <p>Report a security issue via <a href="mailto:equilens@equilens.io">equilens@equilens.io</a>.<br>Security.txt is available at <code>/.well-known/security.txt</code>.</p>
    </div>
  </div>

  <section class="section">
    <h2>Evidence chain</h2>
    <p>Every run emits a signed manifest (SHA‑256) linking input hash → model parameters → outputs (PDF, metrics, generators). Evidence is retrievable by Task ID.</p>
  </section>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

D) pricing/index.html

Impact: Low • Lanes: Web/Content • Rollback: remove folder

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pricing — Equilens FL‑BSA</title>
<meta name="description" content="Transparent tiers from sandbox to enterprise. Subject to contract.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/pricing/">
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
    <a href="../contact/">Contact</a>
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Pricing</h1>
  <p class="tag">Subject to contract; bank procurement rules may apply.</p>

  <div class="grid">
    <div class="card span-6">
      <h2>Sandbox</h2>
      <p><strong>Free</strong> · up to 50k rows · demo only</p>
      <ul class="checks">
        <li>Pre‑bundled FCA sandbox dataset</li>
        <li>Evidence bundle (demo watermark)</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Pilot‑Plus</h2>
      <p><strong>£10k</strong> · 3 months · up to 100k rows</p>
      <ul class="checks">
        <li>Full evidence bundle</li>
        <li>Email support</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Growth</h2>
      <p><strong>£36k/yr</strong></p>
      <ul class="checks">
        <li>Annual subscription</li>
        <li>Evidence bundle + monitoring</li>
      </ul>
    </div>
    <div class="card span-6">
      <h2>Enterprise</h2>
      <p><strong>£120k/yr</strong></p>
      <ul class="checks">
        <li>CLI & unlimited rows (contractual)</li>
        <li>Priority support & onboarding</li>
      </ul>
    </div>
  </div>

  <section class="section">
    <p><a class="cta" href="../contact/">Discuss a tier</a></p>
  </section>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

E) contact/index.html (enhanced)

Impact: Low • Lanes: Web • Rollback: restore prior file

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Contact — Equilens</title>
<meta name="description" content="Get in touch with Equilens about FL‑BSA.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/contact/">
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
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Contact</h1>
  <p>Email <a href="mailto:equilens@equilens.io">equilens@equilens.io</a>.</p>
  <p class="muted">Please include: your role, bank/firm, region, preferred tier, and whether data can leave your network (default: no).</p>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

4) Verification Plan (exact)

# 1) Branch
git checkout -b feature/block-6-content

# 2) Add/replace the files above (create new folders product/, trust-center/, pricing/)

# 3) Local preview
python3 -m http.server 8080
# Visit: /, /product/, /trust-center/, /pricing/, /contact/

# 4) Link sweep (quick grep)
grep -R "<a href=\"\./" -n index.html  # internal nav uses ./ on root
grep -R "<a href=\"\.\./" -n product trust-center pricing contact  # subpage depth

# 5) Evidence snapshot (your existing Block‑3 script)
scripts/evidence/snapshot.sh "BLOCK-6-CONTENT"

# 6) Commit
git add .
git commit -m "BLOCK-6: fill site — Home, Product, Trust Center, Pricing, Contact; minimal CSS components"
git push origin feature/block-6-content


⸻

5) Risks & Rollback

Risk	Mitigation	Rollback
Copy too long for home	Sections are modular; remove any card/section	Revert lines/section
Path mistakes on subpages	Depth‑aware links used; run local preview & grep	Fix links; revert file
Regulator language sensitivity	Text sticks to SSOT; avoid legal advice	Edit copy or add disclaimer
Indexing prematurely	Your toggle still governs robots/meta	Keep default = private


⸻

6) Follow‑ups (I’ll prepare next if you want)
	•	Docs landing at /docs/ linking to your GitHub documentation index.
	•	Case study placeholder and FAQ page (short).
	•	JSON‑LD (Organization + WebSite) once public (requires CSP tuning).


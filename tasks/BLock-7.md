

Block 7 — Legal Skeletons (publish‑safe, LexPro to finalize)

Goal: ship minimal legal pages that reflect the site’s current behavior (no analytics, no third‑party scripts, mailto only) while clearly flagging that LexPro owns final language.

Branch: feature/block-7-legal
Impact: Low • Lanes: Web/Content/Legal • Rollback: delete the 3 files + link lines

Change‑Set (drop‑in files)

legal/privacy.html

Impact: Low • Lanes: Web/Legal • Rollback: delete file / link back to index

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Privacy Notice — Equilens</title>
<meta name="description" content="How the Equilens website handles your data.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/legal/privacy.html">
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
    <a href="./">Legal</a>
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Privacy Notice</h1>
  <p class="note"><strong>Status:</strong> Provisional website notice for review by LexPro. This page describes the static website only (equilens.io). It does not cover product usage of FL‑BSA in customer environments.</p>

  <div class="card">
    <h2>What this site collects</h2>
    <ul class="checks">
      <li><strong>No analytics, no trackers.</strong> We do not load third‑party scripts or analytics.</li>
      <li><strong>No forms.</strong> Contact is via <a href="mailto:equilens@equilens.io">email</a> only (you choose what to send).</li>
      <li><strong>Server logs.</strong> Our static hosting may record standard web logs (e.g., IP, user‑agent) for reliability and security. We do not combine logs to profile visitors.</li>
    </ul>
  </div>

  <div class="card">
    <h2>How we use email</h2>
    <p>When you email <a href="mailto:equilens@equilens.io">equilens@equilens.io</a>, we receive the message and any personal data you include. We use it only to respond and manage your request. Mail is handled by our business email provider (Google Workspace).</p>
  </div>

  <div class="card">
    <h2>Your choices</h2>
    <ul class="checks">
      <li>Do not include sensitive personal data in email (e.g., account numbers).</li>
      <li>You may request that we delete your email thread from our mailbox history; note we may retain minimal records where legally required.</li>
    </ul>
  </div>

  <div class="card">
    <h2>Contact</h2>
    <p>Questions: <a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>
  </div>

  <p class="note">This text is not legal advice. Final wording to be approved by LexPro.</p>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

legal/cookie-policy.html

Impact: Low • Lanes: Web/Legal • Rollback: delete file / link back to index

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cookie Policy — Equilens</title>
<meta name="description" content="Cookie use for the Equilens website.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/legal/cookie-policy.html">
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
    <a href="./">Legal</a>
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Cookie Policy</h1>
  <p class="note"><strong>Status:</strong> Provisional for LexPro review.</p>

  <div class="card">
    <h2>Summary</h2>
    <p>We do <strong>not</strong> set cookies for advertising or analytics on this site. Pages are static; we do not run third‑party scripts.</p>
  </div>

  <div class="card">
    <h2>Essential site operation</h2>
    <p>Static hosting may use infrastructure‑level logs or caches to deliver the site reliably. These are not used by us for profiling.</p>
  </div>

  <div class="card">
    <h2>Changes</h2>
    <p>If we introduce functionality that requires cookies (e.g., authenticated docs), this policy and the site will be updated with consent controls before deployment.</p>
  </div>

  <div class="card">
    <h2>Contact</h2>
    <p>Questions: <a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>
  </div>

  <p class="note">Final wording to be approved by LexPro before public launch.</p>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

legal/tos.html

Impact: Low • Lanes: Web/Legal • Rollback: delete file / link back to index

<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Website Terms — Equilens</title>
<meta name="description" content="Basic terms for using the Equilens website.">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">
<link rel="canonical" href="https://equilens.io/legal/tos.html">
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
    <a href="./">Legal</a>
  </nav>
</header>

<main id="main" class="wrap section">
  <h1>Website Terms</h1>
  <p class="note"><strong>Status:</strong> Provisional; not a license for FL‑BSA. LexPro to finalize.</p>

  <div class="card">
    <h2>Scope</h2>
    <p>This website provides information about Equilens and FL‑BSA. Content is provided “as‑is” for general information and does not constitute legal, regulatory, or technical advice.</p>
  </div>

  <div class="card">
    <h2>Intellectual property</h2>
    <p>Logos and marks are owned by Equilens/Valfox Ltd. Do not reuse without permission.</p>
  </div>

  <div class="card">
    <h2>No warranties & liability</h2>
    <p>We make no warranties as to accuracy or fitness. To the fullest extent permitted by law, we disclaim liability for reliance on this site’s content.</p>
  </div>

  <div class="card">
    <h2>Contact</h2>
    <p><a href="mailto:equilens@equilens.io">equilens@equilens.io</a></p>
  </div>

  <p class="note">Product terms are provided separately in contracts/Marketplace listings.</p>
</main>

<footer class="wrap"><small>© <span id="yr"></span> Equilens</small></footer>
<script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</body></html>


⸻

Update the legal landing to link the new pages

legal/index.html (minimal edit)
Impact: Low • Lanes: Web • Rollback: restore original

<!-- Replace the placeholder list with deep links -->
<main class="wrap">
  <h1>Legal</h1>
  <ul class="asset-list">
    <li><a href="./privacy.html">Privacy Notice</a> — provisional (LexPro review)</li>
    <li><a href="./cookie-policy.html">Cookie Policy</a> — provisional (LexPro review)</li>
    <li><a href="./tos.html">Website Terms</a> — provisional (LexPro review)</li>
  </ul>
</main>


⸻

Verification (exact)

# Branch
git checkout -b feature/block-7-legal

# Add the three files + update legal/index.html
git add legal/privacy.html legal/cookie-policy.html legal/tos.html legal/index.html

# Local preview
python3 -m http.server 8080
# Visit /legal/ and deep links; validate head + skip link + layout

# Evidence snapshot (reuses your script)
scripts/evidence/snapshot.sh "BLOCK-7-LEGAL"

# Commit
git commit -m "BLOCK-7: add legal skeletons (privacy, cookies, website terms) — provisional for LexPro"
git push origin feature/block-7-legal


⸻

What follows immediately after Block 7

Block 6 (if not merged yet) — Docs/FAQ/Press + JSON‑LD
	•	Add /docs/, /faq/, /press/ pages and JSON‑LD on Home & Product (Organization/WebSite/Product/FAQPage).
	•	I already provided the full files and verification steps in the previous message (“Block‑6: pages & schema”). Apply as‑is, then snapshot:
scripts/evidence/snapshot.sh "BLOCK-6-PAGES-SCHEMA"

Block 8 — Launch Candidate (when you choose to go public)
	•	Run:

make seo-public
make sitemap
make og
make evidence  # SITE-DEPLOY


	•	In GitHub Actions → Run workflow with visibility=public.
	•	Validate:
	•	https://equilens.io/robots.txt → Allow: / + Sitemap
	•	https://equilens.io/sitemap.xml lists /, /product/, /trust-center/, /pricing/, /contact/, /legal/, plus any new pages
	•	Social preview picks up OG PNG
	•	audit.yml artifacts show no critical A11y/links errors

⸻

Optional (next 1–2 steps after launch)
	•	Structured Data expansion: Breadcrumb JSON‑LD on Pricing, Trust Center, Contact.
	•	Search Console & Bing verification (DNS or meta tag) with evidence: output/ops/SEO-VERIFY-*.
	•	Press page downloads: add a small ZIP (logo pack + tokens.json); we can generate it in‑repo.

⸻

TL;DR
	•	Do now: merge Block 7 legal skeletons (files above).
	•	If not yet merged: apply Block 6 pages + JSON‑LD.
	•	When ready: run Block 8 launch toggle to go public.

If you want, I can provide a single unified patch for feature/block-7-legal right away.
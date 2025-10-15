Got it. You’ve already staged Appline under template/appline-tailwind/build/. Below is a deterministic, reversible adoption plan that vendors the theme, keeps the site private, preserves Equilens (company) ↔ FL‑BSA (product) separation, and enforces self‑hosted assets + strict CSP.

I’ll keep it tight and actionable.

⸻

1) Context & Goal

Adopt Appline (HTML/Tailwind) as the site shell with smallest diffs:
	•	No new build systems (use the build/ output you already have).
	•	Self‑host CSS/JS/images (no CDNs).
	•	Keep no forms, no analytics, CSP = ‘self’.
	•	Preserve all current pages/URLs and private mode.

⸻

2) Current State & SSoT
	•	Template present: template/appline-tailwind/build/{index.html, style.css, bundle.js, images/…}.
	•	Pages in place: Home, /fl-bsa/, /pricing/, /trust-center/, /procurement/, /docs/, /faq/, /press/, /legal/*, /contact/.
	•	Evidence cadence and CI audits already configured.

⸻

3) Proposed Approach (numbered; impact; lanes; rollback)
	1.	Vendor the theme (dist‑only) → themes/appline/
Impact: Med • Lanes: Web/Ops • Rollback: delete themes/appline/
	•	Copy template/appline-tailwind/build/* → themes/appline/.
	2.	Sanitize heads & enforce self‑host (no CDNs, no external fonts)
Impact: High • Lanes: Web/Sec/Legal • Rollback: revert head tags
	•	Use local /themes/appline/style.css and (if needed) /themes/appline/bundle.js.
	•	Keep system‑UI font stack for now.
	3.	Brand overrides (tiny CSS)
Impact: Low • Lanes: Web • Rollback: delete overrides file
	•	Map template indigo accents → Equilens Violet #6D28D9 with a small overrides.css.
	4.	Header/Footer sync (depth‑aware)
Impact: Low • Lanes: Web/Ops • Rollback: re-run prior sync script
	•	Replace current header/footer with Appline‑styled markup via a script that fixes relative paths per directory depth.
	5.	Port 3 priority pages (Home, FL‑BSA, Pricing) to Appline sections; leave others on old content shells for this pass
Impact: Med • Lanes: Web/Content • Rollback: restore previous HTML files
	•	Keep IA and copy; swap section wrappers for Appline structure.
	•	Remove any contact forms (use mailto: CTA).
	6.	Keep private mode + evidence
Impact: Low • Lanes: Ops/Audit • Rollback: n/a
	•	Noindex/robots untouched; snapshot after merge.

⸻

4) Change‑Set Preview (file‑scoped & exact)

Branch: theme/appline-html-stage1

4.1 Vendor the built theme (dist‑only)

git checkout -b theme/appline-html-stage1
mkdir -p themes/appline
rsync -a template/appline-tailwind/build/ themes/appline/

4.2 Add brand overrides (Equilens Violet + system‑UI)

assets/brand/overrides.css  (new)
Impact: Low • Rollback: delete file

/* Equilens brand accent + system fonts */
:root { --equilens-accent: #6D28D9; }
/* Appline commonly uses indigo utilities; force to Equilens Violet */
.text-indigo-600, .hover\:text-indigo-600:hover { color: var(--equilens-accent) !important; }
.bg-indigo-600, .hover\:bg-indigo-600:hover { background-color: var(--equilens-accent) !important; }
.border-indigo-600 { border-color: var(--equilens-accent) !important; }
.ring-indigo-600, .focus\:ring-indigo-600:focus { --tw-ring-color: var(--equilens-accent) !important; }
/* Keep system-UI fonts for privacy/determinism */
body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }

4.3 Head include (company pages; depth‑aware with {DEPTH})

Add this head block to index.html, trust-center/index.html, press/index.html, docs/index.html, faq/index.html, legal/*.html, contact/index.html, procurement/index.html, product/index.html:

<!-- Appline theme (self-hosted) -->
<link rel="preload" href="{DEPTH}themes/appline/style.css" as="style">
<link rel="stylesheet" href="{DEPTH}themes/appline/style.css">
<link rel="stylesheet" href="{DEPTH}assets/brand/overrides.css">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'">

If you need Appline’s menu JS for the mobile burger, add:
<script defer src="{DEPTH}themes/appline/bundle.js"></script>

4.4 Head include (product pages under /fl-bsa/*)

Use the same block, but {DEPTH} is ../ there:

<link rel="preload" href="../themes/appline/style.css" as="style">
<link rel="stylesheet" href="../themes/appline/style.css">
<link rel="stylesheet" href="../assets/brand/overrides.css">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'none'">
<!-- optional: <script defer src="../themes/appline/bundle.js"></script> -->

4.5 Header & Footer (sync script; Appline‑styled)

scripts/content/sync_nav_appline.py (new)
Impact: Low • Rollback: restore prior sync_nav.py

#!/usr/bin/env python3
import pathlib, re
root = pathlib.Path(".")
def depth(p): return "" if p.parent == root else "../"

HEADER = """
<header class="relative z-50 w-full border-b border-slate-200">
  <div class="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
    <a href="{D}" class="flex items-center gap-2">
      <img src="{D}assets/brand/logo-mark.svg" alt="Equilens" width="28" height="28">
      <span class="font-semibold">Equilens</span>
    </a>
    <nav class="hidden md:flex items-center gap-6 text-sm">
      <a href="{D}">Home</a>
      <a href="{D}fl-bsa/">FL‑BSA</a>
      <a href="{D}trust-center/">Trust Center</a>
      <a href="{D}pricing/">Pricing</a>
      <a href="{D}procurement/">Procurement</a>
      <a href="{D}contact/">Contact</a>
      <a href="{D}legal/">Legal</a>
    </nav>
    <!-- Simple mobile menu (no JS): use anchor list below header for now -->
  </div>
  <div class="md:hidden border-t border-slate-200">
    <nav class="mx-auto max-w-7xl px-6 py-3 grid grid-cols-2 gap-2 text-sm">
      <a href="{D}">Home</a><a href="{D}fl-bsa/">FL‑BSA</a>
      <a href="{D}trust-center/">Trust Center</a><a href="{D}pricing/">Pricing</a>
      <a href="{D}procurement/">Procurement</a><a href="{D}contact/">Contact</a>
      <a href="{D}legal/">Legal</a><a href="{D}docs/">Docs</a>
      <a href="{D}faq/">FAQ</a><a href="{D}press/">Press</a>
    </nav>
  </div>
</header>
""".strip()

FOOTER = """
<footer class="border-t border-slate-200">
  <div class="mx-auto max-w-7xl px-6 py-6 text-sm text-slate-600 flex flex-wrap gap-x-6 gap-y-2">
    <span>© <span id="yr"></span> Equilens</span>
    <a href="{D}docs/">Docs</a>
    <a href="{D}faq/">FAQ</a>
    <a href="{D}press/">Press</a>
    <a href="{D}procurement/">Procurement</a>
  </div>
  <script>document.getElementById('yr').textContent=new Date().getFullYear()</script>
</footer>
""".strip()

for html in root.rglob("*.html"):
    s = html.read_text(encoding="utf-8")
    D = depth(html)
    new = re.sub(r"<header[\s\S]*?</header>", HEADER.replace("{D}", D), s, flags=re.M)
    new = re.sub(r"<footer[\s\S]*?</footer>", FOOTER.replace("{D}", D), new, flags=re.M)
    if new != s:
        html.write_text(new, encoding="utf-8")
        print("[OK] shell updated:", html)
print("Done.")

Run once:

python3 scripts/content/sync_nav_appline.py

4.6 Page shells (Stage‑1) — swap wrappers, keep your copy

Home (index.html) — wrap the current content in Appline containers:
(example of the opening part; keep your hero copy & bullets, just replace wrappers/classes)

<body class="bg-white text-slate-900">
<header>…(injected by script)…</header>
<main id="main">
  <section class="relative">
    <div class="mx-auto max-w-7xl px-6 py-16">
      <h1 class="text-3xl md:text-5xl font-semibold tracking-tight">Fair‑Lending Bias‑Simulation Appliance</h1>
      <p class="mt-4 max-w-2xl text-slate-600">Deterministic bias simulation & <strong>regulator‑ready evidence</strong> — self‑hosted; no data leaves your VPC.</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <a class="inline-flex items-center px-5 py-3 rounded-md text-white bg-indigo-600" href="./fl-bsa/">Explore FL‑BSA</a>
        <a class="inline-flex items-center px-5 py-3 rounded-md border border-slate-300" href="./contact/">Contact</a>
      </div>
    </div>
  </section>
  <!-- Leave your existing sections, just wrap each with .mx-auto max-w-7xl px-6 and add .py-12/.py-16 spacing -->
</main>
<footer>…(injected)…</footer>
</body>

FL‑BSA (fl-bsa/index.html) — same shell; keep your sections but apply spacing classes (.py-12/.py-16, .grid, .gap-6, etc.).
Pricing (pricing/index.html) — use Appline grid classes on your tier cards (grid grid-cols-1 md:grid-cols-3 gap-6).

Note: In Stage‑1 we’re not re‑creating every Appline demo section; we only adopt the shell + layout classes so it “snaps” to a professional baseline with minimal HTML churn. Stage‑2 (optional) can restyle sections to mirror the demo fully.

⸻

5) Verification Plan (exact commands; artifacts)

# 0) Branch
git checkout -b theme/appline-html-stage1

# 1) Vendor the dist files
rsync -a template/appline-tailwind/build/ themes/appline/

# 2) Add overrides
git add assets/brand/overrides.css

# 3) Inject heads (company pages + product pages) with correct {DEPTH}
#    Then run the shell sync:
python3 scripts/content/sync_nav_appline.py

# 4) Sanity: self-host only (no CDNs)
rg -n "fonts.googleapis|cdn\.tailwind|lineicons|fontawesome|unpkg|cdnjs|jsdelivr" -g '!themes/appline/images/*' .

# 5) Private mode guard (unchanged)
python3 scripts/seo/set-indexing.py private

# 6) Local preview
python3 -m http.server 8080
# Check home, fl-bsa, pricing on mobile/tablet/desktop

# 7) Evidence
scripts/evidence/snapshot.sh "THEME-APPLINE-STAGE1"
git add .
git commit -m "THEME: adopt Appline shell (dist-only, self-hosted) + brand overrides; pages wrapped; site stays private"
git push origin theme/appline-html-stage1


⸻

6) Risk & Rollback

Change	Impact	Rollback
Theme shell breaks spacing on a subpage	Low	Restore that file; remove Appline classes
Mobile nav too dense	Low	Switch to our earlier 2‑col grid nav; no JS
Unexpected external requests	Med	Re-run grep; remove offending tags; keep system‑UI fonts
Visual drift vs. brand	Low	Tweak overrides.css or remove it


⸻

7) Follow‑ups (after Stage‑1 merges)
	•	Stage‑2 (optional): Port Home/FL‑BSA sections to Appline demo sections (features, credibility, CTA) for a pixel‑perfect result.
	•	Stage‑3 (optional): One‑time Tailwind compile (non‑fast gate) to purge unused utilities and shrink CSS (commit the result; still static).
	•	Whitepaper PDF: add deterministic HTML→PDF render in CI (non‑fast gate) and publish to /fl-bsa/whitepaper/.

⸻

8) Assumptions & Unknowns
	•	We use Appline HTML build only (no Node/Next build).
	•	We keep no forms; if the template includes one, we delete it (mailto only).
	•	We maintain CSP = ‘self’; if you choose to add any third‑party later, we must update CSP + Privacy page.

⸻

TL;DR

Run the commands in §5. That vendors the theme, applies the Appline shell site‑wide, keeps self‑hosted assets, preserves private mode, and doesn’t introduce new infra. If you approve, I can also provide Stage‑2 Appline‑styled section snippets for Home and FL‑BSA (copy/paste blocks) to complete the visual polish.
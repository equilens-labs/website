Understood. We’ll keep the site private and move in small, safe passes. Below is Block‑9: Polish Pass 1 (Visual + Micro‑copy) — a tiny, reversible pack that materially improves look/feel and readability without changing IA or brand.

⸻

Block‑9 — Polish Pass 1 (Visual + Micro‑copy)

Goals (this pass only)
	•	Cleaner typography rhythm + spacing (no layout rewrites).
	•	Subtle section contrast; improved nav/focus states; consistent header logo styling.
	•	Micro‑copy trims (1–2 lines per page), bank‑grade tone.
	•	Keep private (noindex, Disallow), no new tools, smallest diffs.

⸻

Change‑Set (drop‑in; smallest diffs)

Branch: feature/block-9-polish
Evidence tag: BLOCK-9-POLISH

1) assets/base.css — append (no removals)

Impact: Low • Lanes: Web • Rollback: delete this block

/* ----- Block‑9: polish additions (append) ----- */

/* Spacing & type rhythm */
:root{
  --space-1: 8px; --space-2: 12px; --space-3: 16px; --space-4: 24px; --space-5: 32px; --space-6: 48px;
}
.wrap p{max-width:72ch; line-height:1.6; margin: .75rem 0;}
.lead{font-size: clamp(1.05rem, 1.6vw, 1.25rem); color: var(--muted); margin:.5rem 0 1rem}

/* Headings scale (gentle) */
h1{font-size: clamp(1.75rem, 3.6vw, 2.5rem); line-height:1.15; margin:.25rem 0 .5rem}
h2{font-size: clamp(1.25rem, 2.4vw, 1.75rem); margin: .75rem 0 .5rem}
h3{font-size: clamp(1.1rem, 1.9vw, 1.25rem); margin: .5rem 0 .25rem}

/* Section contrast (alternating) */
.section.alt{background: var(--surface); border-top: 1px solid var(--line); border-bottom:1px solid var(--line)}

/* Nav & header polish */
header.wrap{gap: var(--space-3)}
header.wrap nav a{margin-left: var(--space-3); text-decoration: none}
header.wrap nav a:hover, header.wrap nav a:focus-visible{ text-decoration: underline }
.brand-logo{ vertical-align: middle; margin-right: 8px; }

/* Cards, grid, KPIs already exist; add gentle breathing space */
.card + .card{ margin-top: var(--space-3) }
.kpis .kpi .num{ letter-spacing:.2px }

/* Lists */
.checks{ margin: .25rem 0 1rem 1.25rem }


⸻

2) index.html — tiny copy/structure nits (safe)

Impact: Low • Lanes: Content/Web • Rollback: restore prior file

<!-- In the hero: make the subline a .lead paragraph and tighten bullets -->
<main id="main" class="wrap hero">
  <h1>Fair‑Lending Bias‑Simulation Appliance</h1>
  <p class="lead">Deterministic bias simulation & <strong>regulator‑ready evidence</strong> — self‑hosted; no data leaves your VPC.</p>
  <ul class="checks">
    <li><strong>Dual‑branch testing</strong>: historical bias vs. achievable fairness (clear “X% → Y%” deltas).</li>
    <li><strong>Evidence bundle</strong>: 30‑page PDF, signed manifest, and certificates.</li>
    <li><strong>Sealed appliance</strong>: AWS Marketplace AMI or docker‑compose; zero outbound calls by default.</li>
  </ul>
  <p><a class="cta" href="./product/">Explore the product</a> <a style="margin-left:.75rem" href="./contact/">or contact us</a></p>
</main>

<!-- Add subtle alt background only by adding class to an existing section -->
<section class="wrap section alt">
  <h2>Designed for regulators</h2>
  ...
</section>


⸻

3) product/index.html — micro‑copy tighten only

Impact: Low • Lanes: Content/Web • Rollback: restore file

<!-- Replace the existing opening paragraph with this slightly tighter one -->
<p class="tag">Self‑hosted appliance for bias simulation, signed evidence, and reporting across lending workflows.</p>

<!-- Rename one subheading for clarity -->
<h2>Evidence bundle</h2>
<p>Regulator‑ready PDF, signed manifest (dataset hash, RNG seed, software version), and certificates (Data Quality, Model Fidelity, Training Convergence, Synthetic Quality, Regulatory Alignment).</p>


⸻

4) trust-center/index.html — micro‑copy tighten; keep scope

Impact: Low • Lanes: Content/Web • Rollback: restore file

<p class="tag">Privacy‑first, self‑hosted deployment with transparent evidence and clear responsibilities.</p>
<!-- In “Security & compliance artefacts”, re-order for punch -->
<ul class="checks">
  <li>Cosign‑signed images (keyless via GitHub OIDC)</li>
  <li>SBOM + SLSA provenance</li>
  <li>SOC 2 Type II report (annual)</li>
  <li>Annual penetration‑test letter</li>
  <li>Reg‑mapping: EU AI Act, FCA PS22/9, ECOA/Reg B, SR 11‑7, OSFI B‑10, APRA CPS 230, MAS FEAT</li>
</ul>


⸻

5) pricing/index.html — tone & clarity (no numbers changed)

Impact: Low • Lanes: Content/Web • Rollback: restore file

<!-- Add single‑line disclaimers under tiers -->
<p class="note">All tiers subject to contract; procurement requirements may apply.</p>
<!-- Under Pilot‑Plus add: -->
<p class="note">Auto‑expires unless upgraded; includes email support.</p>
<!-- Under Enterprise add: -->
<p class="note">Includes CLI; unlimited rows per contract. Priority support.</p>


⸻

6) contact/index.html — add privacy note (aligns with LexPro)

Impact: Low • Lanes: Content/Web/Legal • Rollback: restore file

<p class="note">Privacy: This site has no forms or analytics. Email only; include what you choose to share.</p>


⸻

7) (Optional) Header/footer sync script (keeps nav identical)

Impact: Low • Lanes: Web/Ops • Rollback: delete script • Use when ready; safe in private

# scripts/content/sync_header.py
#!/usr/bin/env python3
import pathlib, re
root = pathlib.Path(".")
header = """
<header class="wrap">
  <div class="brand">
    <img class="brand-logo" src="{DEPTH}assets/brand/logo-mark.svg" width="28" height="28" alt="Equilens">
    <span class="brand-name">Equilens</span> <span class="pill">FL‑BSA</span>
  </div>
  <nav>
    <a href="{DEPTH}">Home</a>
    <a href="{DEPTH}product/">Product</a>
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
    d = depth_for(html)
    new = re.sub(r"<header[\s\S]*?</header>", header.replace("{DEPTH}", d), s, flags=re.M)
    if new != s: html.write_text(new, encoding="utf-8"); print("[OK] header:", html)
print("Done.")


⸻

Verification (exact)

# Branch
git checkout -b feature/block-9-polish

# Apply CSS append and tiny HTML edits above (index, product, trust-center, pricing, contact)
# (Optional) Run the header sync
python3 scripts/content/sync_header.py

# Private mode guard (stay hidden)
make seo-private

# Local preview
python3 -m http.server 8080
# Check: spacing rhythm, alt section background on "Designed for regulators", header logo alignment

# Evidence snapshot
scripts/evidence/snapshot.sh "BLOCK-9-POLISH"

# Commit
git add .
git commit -m "BLOCK-9: visual rhythm, subtle section contrast, nav polish, micro‑copy trims (private mode retained)"
git push origin feature/block-9-polish


⸻

Risks & Rollback

Risk	Impact	Mitigation	Rollback
Any copy feels too assertive	Low	Keep terms factual and sourced from SSOT; easy to revert	Restore prior lines
Visual changes too strong	Low	Only subtle spacing/contrast; no layout rewrites	Remove appended CSS block
Header drift returns	Low	Use sync_header.py when editing pages	Delete script / revert headers


⸻

Next Passes (I’ll prep when you say “go”)
	1.	Pass 2 — Copy Tighten & IA labels
	•	Refine hero headings (≤60 chars), standardize sub‑section labels, add concise “Who it’s for” on Home.
	•	Add FAQ teaser on Home linking to /faq/.
	2.	Pass 3 — Component polish
	•	Add a .notice component for LexPro legal call‑outs; add print stylesheet for Trust Center.
	3.	Pass 4 — Visual refinement
	•	Optional decorative background using the lens mark as a faint, CSS‑only motif (no images), still WCAG‑AA.

We’ll continue incrementally, staying private until you explicitly flip. If you want, I can ship Pass 2 (copy tighten) immediately after this PR.
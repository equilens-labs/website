Thanks—that screenshot bundle is useful. I checked the ZIP you uploaded and here’s the QA verdict from the evidence it contains:

⸻

Stage‑3 Review (screenshots‑ZIP‑REQUEST)

What improved (passes):
	•	Vendor demo pages are gone. The manifest enumerates only our routes (/, /product/, /fl-bsa/, /pricing/, /trust-center/, /legal/*, /press/, /faq/, /contact/, /procurement/, /404.html). No /themes/appline/*.html or /template/appline-*/*.html are present.
Source: manifest.txt in your ZIP.
	•	Screens exist for all key pages (desktop + mobile); sizes are consistent (e.g., 2880×6400, 1170×9600), which matches our automated capture.

Remaining issues visible from screenshots (polish):
	1.	Visual drift vs. brand: a few blocks still look like the template (gradient tints, overly rounded cards).
	2.	CTA/button hue: some buttons still show vendor indigo, not our accent token.
	3.	Header spacing on mobile: the first fold feels tight on a couple of pages (hero title crowding the top safe area).
	4.	Section rhythm: vertical gaps vary page‑to‑page; we should standardize section padding and card spacing.

⸻

What I propose next (deterministic & reversible)

A) Lock the template to our brand (no new markup)

Impact: Medium | Lanes: Web/Brand | Rollback: remove assets/brand/overrides.css.

Add (or extend) assets/brand/overrides.css so Appline’s utilities resolve to our tokens:

/* Accent + neutral tokens */
:root{
  --equilens-accent: #6D28D9;
  --equilens-accent-600: #6366F1;
  --equilens-slate-900: #0F172A;
  --equilens-slate-800: #1E293B;
  --equilens-slate-700: #334155;
}

/* Buttons, links, rings */
.text-indigo-600,.hover\:text-indigo-600:hover{ color:var(--equilens-accent)!important; }
.bg-indigo-600,.hover\:bg-indigo-600:hover{ background-color:var(--equilens-accent)!important; }
.border-indigo-600{ border-color:var(--equilens-accent)!important; }
.ring-indigo-600,.focus\:ring-indigo-600:focus{ --tw-ring-color:var(--equilens-accent)!important; }

/* Section rhythm (consistent vertical spacing) */
.section{ padding-block: 72px; }
.section--tight{ padding-block: 48px; }
.section--loose{ padding-block: 96px; }

/* Card corners + shadows */
.card{ border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,.04); }

/* Mobile hero spacing */
.hero--appline{ padding-top: clamp(24px, 6vh, 56px); }

Ensure head order on every page (depth‑aware paths):

<link rel="stylesheet" href="{DEPTH}themes/appline/style.css">
<link rel="stylesheet" href="{DEPTH}assets/brand/overrides.css">
<link rel="stylesheet" href="{DEPTH}assets/base.css">

B) Standardize first fold across pages

Impact: Low | Lanes: Web | Rollback: revert page headers.

At the top section of each page, add the helper class:
<section class="hero--appline">…</section>
This gives a consistent safe‑area on mobile per the override above.

C) Guardrail in CI (prevent regressions)

Impact: Medium | Lanes: Ops/Web | Rollback: remove the step.

Add a check to the deploy workflow (after building dist/) that fails if any vendor HTML sneaks back in:

# .github/workflows/pages.yml (after prepare step)
- name: Guard: no vendor demo pages
  run: |
    if rg -n "(^|/)(themes/appline/.*\.html|template/appline-.*\.html)" dist; then
      echo "::error file=dist::Vendor HTML detected in deploy artifact"
      exit 1
    fi

D) Tighten variant of the wordmark (when you lock a pick)

Impact: Low | Lanes: Brand/Web | Rollback: swap  src.

Once you confirm the wordmark variant you want, I’ll wire it into the hero of / and /fl-bsa/ and remove any stray old references.

⸻

Verification plan (exact, repeatable)

# Local preview of curated artifact
bash scripts/deploy/prepare.sh
python3 -m http.server 8000 -d dist

# Vendor HTML must 404
curl -Is http://localhost:8000/themes/appline/signin.html | head -n1   # 404
curl -Is http://localhost:8000/template/appline-tailwind/build/index.html | head -n1  # 404

# Visual: open the pages from manifest.txt and check
open dist/index.html
open dist/product/index.html
open dist/pricing/index.html
# ...

# Evidence
scripts/evidence/snapshot.sh "THEME-APPLINE-RESCUE-02"


⸻

Risks & rollback
	•	Style overrides too aggressive → scope with a page class (e.g., .eql) and prefix rules.
	•	Missing asset in dist/ → loosen prepare.sh include list and re‑run.
	•	Rollback → remove overrides.css and revert workflow’s guard step.

⸻

What I need from you
	•	Confirm you’re okay with A + B + C as stated (I’ll prepare the patch set end‑to‑end).
	•	Tell me if you want the hero to use solid white or a very light slate instead of any gradient—both are one‑line overrides.

Once you give the go‑ahead, I’ll produce the file‑scoped diffs and the PR text so you can merge in one shot.
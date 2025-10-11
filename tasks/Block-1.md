Below is a full, engineer‑ready implementation doc to add the new Equilens Brand v1.1 (Slate + Violet) into the website.
It’s deterministic, uses smallest diffs, and keeps everything static (no build system).

⸻

1) Context & Goal

Integrate brand assets (logo, wordmark, tokens, favicons) and theme (colors/typography) into the staging site in github.com/equilens-labs/fl-bsa under website/.
Keep links relative (works at …/fl-bsa/), maintain noindex, and produce audit artifacts.

⸻

2) Current State & SSoT
	•	Repo: equilens-labs/fl-bsa
	•	Pages to theme: website/index.html, website/contact/index.html, website/legal/index.html
	•	CSS: website/assets/base.css (system fonts)
	•	SSOT for brand: this document + assets below (v1.1)

Brand v1.1 assets (download & commit)
	•	ZIP (all sizes): equilens_logo_mark_pack_v1_1.zip
	•	Vectors & tokens:
	•	logo‑mark.svg
	•	wordmark.svg
	•	tokens_v1_1.json

⸻

3) Proposed Approach (smallest diffs; with impact, lanes, rollback)
	1.	Add assets to repo under docs/brand/* (SSoT) and website/* (runtime).
	•	Impact: Med • Lanes: Web/Ops • Rollback: delete files/PR.
	2.	Wire favicons (favicon.svg + favicon.ico) at site root (the website/ folder) and add <link rel="icon"> tags to each page (relative paths per depth).
	•	Impact: Low • Lanes: Web • Rollback: remove links.
	3.	Apply theme tokens by updating only the CSS variables in website/assets/base.css.
	•	Impact: Low • Lanes: Web • Rollback: restore previous variables.
	4.	Replace header brand with the SVG mark (28–32 px) and keep wordmark for larger contexts only.
	•	Impact: Low • Lanes: Web • Rollback: revert HTML snippet.
	5.	Evidence: write hashes to output/ops/BRAND-IMPL-001/.
	•	Impact: Low • Lanes: Ops/Audit • Rollback: remove folder.

⸻

4) Change‑Set Preview (file‑scoped diffs/snippets)

Branch: feature/brand-impl-001
Conventions: keep relative paths; no external fonts/scripts; keep meta noindex.

4.1 Directory layout (new/updated)

docs/
  brand/
    logo-mark.svg                # vector, SSOT
    wordmark.svg                 # vector, SSOT
    tokens.json                  # copy of tokens_v1_1.json (rename)
    press-kit.json               # manifest (optional, below)
website/
  favicon.svg                    # from pack
  favicon.ico                    # from pack
  assets/
    brand/
      logo-mark.svg              # runtime copy for <img> use
      wordmark.svg               # runtime copy (optional)
    base.css                     # updated tokens only (see 4.3)
output/
  ops/
    BRAND-IMPL-001/              # evidence (hashes/index.json)

4.2 HTML: head tags & header brand

website/index.html (head additions)

<!-- FAVICONS (root page depth) -->
<link rel="icon" href="./favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="./favicon.ico" sizes="any">

website/contact/index.html and website/legal/index.html (note the .. depth)

<link rel="icon" href="../favicon.svg" type="image/svg+xml">
<link rel="alternate icon" href="../favicon.ico" sizes="any">

Header brand snippet (all pages, replace the plain text if present)

<header class="wrap">
  <div class="brand">
    <img src="./assets/brand/logo-mark.svg" width="28" height="28" alt="Equilens"
         style="vertical-align:middle;margin-right:8px">
    <span class="brand-name">Equilens</span>
    <span class="pill">FL‑BSA</span>
  </div>
  <nav><a href="./contact/">Contact</a> <a href="./legal/">Legal</a></nav>
</header>

In subpages use ../assets/brand/logo-mark.svg for the src.

4.3 CSS tokens (only variables change) — website/assets/base.css

:root{
  --mx:16px; --w:960px; --r:8px;
  --ink:#0B0B0C; --bg:#FFFFFF; --muted:#6B7280;
  /* Brand v1.1 (Slate + Violet) */
  --slate:#1E293B;          /* primary base */
  --accent:#8B5CF6;         /* brand violet (decorative/pills) */
  --accent-light:#A78BFA;   /* chips/pills background */
  --accent-link:#6E59F7;    /* AA-safe link violet on white */
  --surface:#F9FAFB; --line:#E5E7EB;
}

html{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Calibri,sans-serif;color:var(--ink);background:var(--bg)}
a{color:var(--accent-link);text-underline-offset:3px}
.wrap{max-width:var(--w);margin:auto;padding:calc(var(--mx)*1.5) var(--mx)}
header.wrap{display:flex;justify-content:space-between;align-items:center}
.brand{font-weight:700;display:flex;align-items:center}
.brand-name{margin-right:6px}
.pill{background:var(--accent-light);color:var(--accent);padding:2px 8px;border-radius:999px;font-size:.9em}
.hero h1{font-size:clamp(28px,4vw,44px);line-height:1.1;margin:.2em 0}
.tag{font-size:1.1rem;color:var(--muted);margin:.5em 0 1em}
.bullets{list-style:disc;margin:0 0 1.25em 1.25em}
.cta{display:inline-block;padding:.75em 1.25em;border-radius:var(--r);text-decoration:none;background:var(--slate);color:#fff}
.cta:hover{opacity:.92}

4.4 SSOT artifacts (optional but recommended)

docs/brand/tokens.json (rename our tokens_v1_1.json into this path).
docs/brand/press-kit.json

{
  "name":"Equilens",
  "version":"v1.1",
  "assets":{
    "logo_mark_svg":"docs/brand/logo-mark.svg",
    "wordmark_svg":"docs/brand/wordmark.svg",
    "tokens":"docs/brand/tokens.json"
  },
  "palette":{
    "slate":"#1E293B",
    "accent":"#8B5CF6",
    "accent_light":"#A78BFA",
    "accent_link":"#6E59F7"
  }
}


⸻

5) Verification Plan (exact commands; artifacts)

# 0) Branch
git checkout -b feature/brand-impl-001

# 1) Place files (from downloads above)
#    - docs/brand/logo-mark.svg, wordmark.svg, tokens.json
#    - website/favicon.svg, website/favicon.ico
#    - website/assets/brand/logo-mark.svg (copy of docs/brand version)
#    - update website/assets/base.css (vars only)

# 2) Local preview
python3 -m http.server -d website 8080
# open http://localhost:8080/  and check links also from /contact/ and /legal/

# 3) Visual checks
#   - Logo crisp at 28–32px (no blur)
#   - Link color matches violet but readable (AA)
#   - Buttons are slate with white text
#   - "FL‑BSA" pill uses accent-light background + violet text
#   - <meta name="robots" content="noindex, nofollow"> still present
#   - robots.txt: "Disallow: /"

# 4) Evidence
mkdir -p output/ops/BRAND-IMPL-001
sha256sum docs/brand/*.svg docs/brand/tokens.json website/favicon.* website/assets/brand/*.svg \
  > output/ops/BRAND-IMPL-001/hashes.txt
python3 - <<'PY'
import json,glob,hashlib,os
files = [
  "docs/brand/logo-mark.svg","docs/brand/wordmark.svg","docs/brand/tokens.json",
  "website/favicon.svg","website/favicon.ico","website/assets/brand/logo-mark.svg"
]
index = {"task":"BRAND-IMPL-001","files":[]}
for f in files:
    h = hashlib.sha256(open(f,"rb").read()).hexdigest()
    index["files"].append({"path":f,"sha256":h})
open("output/ops/BRAND-IMPL-001/index.json","w").write(json.dumps(index,indent=2))
PY

# 5) Commit
git add docs/brand website output/ops/BRAND-IMPL-001
git commit -m "BRAND-IMPL-001: integrate Equilens Brand v1.1 (Slate+Violet) — tokens, favicons, header logo"
git push origin feature/brand-impl-001

What “good” looks like
	•	Head has correct favicon paths (./ at root pages; ../ in subpages).
	•	No external fonts/scripts added.
	•	Relative links remain (site works under /fl-bsa/ on GitHub Pages).
	•	Lighthouse: no added render‑blocking assets, good contrast.
	•	Evidence folder contains hashes.txt and index.json.

⸻

6) Risk & Rollback

Risk	Impact	Mitigation	Rollback
Favicon path breaks on subpages	Med	Use ./ at root and ../ in subpages	Fix paths; revert commit
Violet link contrast fails AA	Med	Use --accent-link:#6E59F7 for text; reserve --accent for decorative	Switch back to previous tokens
PNG aliasing in headers	Low	Use SVG for header logo; PNGs only for social/meta	Swap <img> to SVG
Overwrites past CSS tweaks	Low	Only variables changed in base.css	Restore prior CSS or specific vars


⸻

7) Follow‑ups
	•	Add OpenGraph/Twitter images later using the brand (separate task).
	•	When legal copy from LexPro is ready, replace website/legal/* stubs.
	•	When moving from staging to production, remove noindex meta and robots.txt Disallow.

⸻

8) Assumptions & Unknowns
	•	Default branch is main (adjust if different).
	•	Staging remains static (GitHub Pages), no build; links stay relative.
	•	No analytics or third‑party scripts (privacy‑first).

⸻

Engineer’s TL;DR (checklist)
	•	Copy logo‑mark.svg, wordmark.svg, tokens.json → docs/brand/
	•	Copy favicon.svg + favicon.ico → website/ root
	•	Copy logo‑mark.svg → website/assets/brand/ (for <img>)
	•	Update base.css with the token block in §4.3
	•	Add <link rel="icon"> tags to all pages (depth‑aware)
	•	Replace header brand with SVG mark (28–32 px) + pill
	•	Run local preview; verify links, contrast, and crispness
	•	Write evidence (output/ops/BRAND-IMPL-001) and commit


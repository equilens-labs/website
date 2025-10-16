You’re right—the issues go well beyond gradients. The nav, footer, rhythm, and token usage are inconsistent, and the pages read “skinned demo,” not “Equilens.” Below is a comprehensive, deterministic workstream to harden IA, navigation, footer, layout system, and brand application without changing our static-site architecture. It’s surgical, repeatable, and fully reversible.

Reference palette/identity direction from the brand boards you shared (slate + violet/indigo, sober enterprise tone).  ￼  ￼

⸻

1) Context & Goal

Deliver a tight, enterprise presentation layer that:
	•	Uses one accessible header/nav and one footer across all pages.
	•	Applies a consistent tokenized layout (type scale, spacing, cards, CTAs).
	•	Removes remaining template look (gradients, odd radii, demo utilities).
	•	Preserves private mode and existing CI/audits.

⸻

2) Current State (symptoms)
	•	Header/Nav: different paddings & behaviors by page; mobile “first fold” is cramped; vendor utility classes still leak.
	•	Footer: columns/links shift by route; typography & spacing vary.
	•	Rhythm: uneven section padding; cards look over‑rounded; button hues inconsistent.
	•	Tokens: not all pages consume the same spacing/type/brand tokens; some vendor indigo remains.

⸻

3) Proposed Approach (numbered, with impact/lanes/rollback)

TASK‑A: Canonical Navigation & Footer (single source + sync)
	•	What: Create docs/web/nav.json and docs/web/footer.json as SSoT, then generate identical markup into each page.
	•	How: Extend our existing scripts/content/sync_nav.py and add scripts/content/sync_footer.py that read JSON ➜ inject into <header> / <footer> blocks across *.html.
	•	Impact: High (fixes global consistency) • Lanes: Web/Ops • Rollback: restore previous headers/footers from git.

TASK‑B: Page Shell Hardening (scoped overrides)
	•	What: Keep template CSS but scope our rules beneath body.eql. Remove gradients, normalize radii, unify CTAs, fix rhythm.
	•	Impact: Med • Lanes: Web/Brand • Rollback: unlink assets/brand/overrides.css or remove class="eql".

TASK‑C: Tokenized Layout System
	•	What: Lock type scale, spacing ramp, and card primitives; enforce one container width and section paddings.
	•	Impact: Med • Lanes: Web/Brand • Rollback: revert assets/base.css edits.

TASK‑D: Dist‑only Deploy + Guardrails (already started)
	•	What: Keep scripts/deploy/prepare.sh to curate dist/; keep the guard step that fails if any vendor demo HTML appears.
	•	Impact: Med • Lanes: Ops • Rollback: deploy from repo root.

TASK‑E: Header A11y & Mobile Safe‑Area
	•	What: Minimal JS (10 lines) to toggle aria-expanded on the menu; ensure focus trap/esc close; add safe‑area top padding.
	•	Impact: Low • Lanes: Web • Rollback: remove assets/js/nav.js and the trigger button.

TASK‑F: Evidence & QA
	•	What: Re‑run audits (Pa11y/Lighthouse) and the screenshots job; stash under output/ops/THEME-HARDEN-001/.
	•	Impact: Low • Lanes: Ops • Rollback: none.

⸻

4) Change‑Set Preview (file‑scoped, copy‑paste ready)

4.1 SSOT data (new)

docs/web/nav.json

{
  "brand": {"href": "/", "img": "/assets/brand/equilens_wordmark.svg", "alt": "Equilens"},
  "links": [
    {"label": "Product", "href": "/product/"},
    {"label": "FL‑BSA", "href": "/fl-bsa/"},
    {"label": "Pricing", "href": "/pricing/"},
    {"label": "Trust Center", "href": "/trust-center/"},
    {"label": "Docs", "href": "/docs/"},
    {"label": "FAQ", "href": "/faq/"},
    {"label": "Contact", "href": "/contact/"}
  ]
}

docs/web/footer.json

{
  "columns": [
    {"title": "Company", "links": [
      {"label": "Press", "href": "/press/"},
      {"label": "Procurement", "href": "/procurement/"},
      {"label": "Trust Center", "href": "/trust-center/"}]},
    {"title": "Legal", "links": [
      {"label": "Privacy", "href": "/legal/privacy.html"},
      {"label": "Cookie Policy", "href": "/legal/cookie-policy.html"},
      {"label": "Terms of Service", "href": "/legal/tos.html"},
      {"label": "Imprint", "href": "/legal/imprint.html"}]},
    {"title": "Resources", "links": [
      {"label": "Open Source", "href": "/legal/open-source.html"},
      {"label": "Accessibility", "href": "/legal/accessibility.html"}]}
  ],
  "note": "© Equilens. All rights reserved."
}

4.2 Markup (drop‑in template used by both scripts)

docs/web/partials/header.html

<header class="site-header" data-sync="nav">
  <div class="container">
    <a class="brand" href="{{brand.href}}">
      <img src="{{brand.img}}" alt="{{brand.alt}}" width="168" height="52">
    </a>
    <button class="nav-toggle" aria-controls="site-nav" aria-expanded="false">
      <span class="sr-only">Menu</span>
    </button>
    <nav id="site-nav" class="nav" hidden>
      <ul>
        {{#each links}}<li><a href="{{href}}">{{label}}</a></li>{{/each}}
      </ul>
    </nav>
  </div>
</header>

docs/web/partials/footer.html

<footer class="site-footer" data-sync="footer">
  <div class="container grid">
    {{#each columns}}
    <section>
      <h3>{{title}}</h3>
      <ul>{{#each links}}<li><a href="{{href}}">{{label}}</a></li>{{/each}}</ul>
    </section>
    {{/each}}
  </div>
  <div class="container footnote">{{note}}</div>
</footer>

4.3 Sync scripts (new)

scripts/content/sync_footer.py

#!/usr/bin/env python3
import json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parents[2]
footer_json = json.loads((ROOT/"docs/web/footer.json").read_text())
partial = (ROOT/"docs/web/partials/footer.html").read_text()

def render():
    # naive template; good enough for static pages
    html = partial
    # expand columns
    cols = []
    for col in footer_json["columns"]:
        links = "".join([f'<li><a href="{l["href"]}">{l["label"]}</a></li>' for l in col["links"]])
        cols.append(f'<section><h3>{col["title"]}</h3><ul>{links}</ul></section>')
    html = html.replace("{{#each columns}}", "").replace("{{/each}}", "")
    html = re.sub(r"<section>.*</section>", "\n".join(cols), html, count=1, flags=re.S)
    html = html.replace("{{note}}", footer_json["note"])
    return html

FOOTER_BLOCK = render()
for page in ROOT.rglob("*.html"):
    if "/docs/" in str(page) or "/vendor/" in str(page) or "/template/" in str(page):
        continue
    text = page.read_text()
    text = re.sub(r"<footer class=\"site-footer\".*?</footer>", FOOTER_BLOCK, text, flags=re.S)
    page.write_text(text)
print("Footer synced.")

(We already have scripts/content/sync_nav.py; mirror this structure. If missing, I can provide a nav script too.)

4.4 Scoped overrides (extend/replace)

assets/brand/overrides.css

/* Scope everything to our site */
body.eql { --eql-accent:#6D28D9; --eql-text:#0F172A; --eql-muted:#64748B; --eql-radius:12px; }
body.eql .container { max-width: 1120px; margin-inline:auto; padding-inline:20px; }

/* Header */
body.eql .site-header { border-bottom:1px solid #e2e8f0; background:#fff; }
body.eql .site-header .container { display:flex; align-items:center; justify-content:space-between; padding-block:14px; }
body.eql .nav-toggle{ inline-size:44px; block-size:44px; border:1px solid #e2e8f0; border-radius:8px; background:#fff }
body.eql .nav[hidden]{ display:none; }
body.eql .nav ul{ display:flex; gap:20px; align-items:center; }
@media (max-width: 860px){
  body.eql .nav ul{ display:block; padding-block:12px }
}

/* Footer */
body.eql .site-footer{ border-top:1px solid #e2e8f0; background:#fff; padding-block:48px }
body.eql .site-footer .grid{ display:grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap:24px }
body.eql .site-footer h3{ font:600 14px/1.2 ui-sans-serif,system-ui; text-transform:uppercase; letter-spacing:.06em; color:#334155; margin:0 0 8px }
body.eql .site-footer a{ color:#0F172A }
@media (max-width: 860px){
  body.eql .site-footer .grid{ grid-template-columns:1fr }
}

/* Buttons */
body.eql .btn{ display:inline-block; padding:.7rem 1.1rem; border-radius:10px; font-weight:600 }
body.eql .btn-primary{ background:var(--eql-accent); color:#fff }
body.eql .btn-primary:hover{ filter:brightness(0.92) }
body.eql .btn-ghost{ background:#fff; border:1px solid #e2e8f0; color:#0F172A }
body.eql .btn-ghost:hover{ background:#f8fafc }

/* Section rhythm & cards */
body.eql section.section{ padding-block:72px }
body.eql .card{ border:1px solid #e2e8f0; border-radius:var(--eql-radius); box-shadow:0 8px 24px rgba(0,0,0,.04); padding:24px }

/* Kill gradients/template look */
body.eql [class*="bg-gradient-"], body.eql .bg-gradient{ background-image:none !important }

/* A11y: focus-visible */
:focus-visible{ outline:2px solid var(--eql-accent); outline-offset:2px }

4.5 Minimal JS for menu (optional, accessible)

assets/js/nav.js

(() => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.toggleAttribute('hidden');
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && !nav.hasAttribute('hidden')) {
      btn.setAttribute('aria-expanded', 'false');
      nav.setAttribute('hidden', '');
      btn.focus();
    }
  });
})();

4.6 Page patch example (top of every file)

- <body>
+ <body class="eql">
  <!-- header injected by sync script -->
  <!-- page content -->
  <!-- footer injected by sync script -->
+ <script src="/assets/js/nav.js" defer></script> <!-- optional -->
</body>


⸻

5) Verification Plan (commands & artifacts)

# 1) Sync header/footer into pages
python3 scripts/content/sync_nav.py
python3 scripts/content/sync_footer.py

# 2) Local preview (curated dist)
bash scripts/deploy/prepare.sh
python3 -m http.server 8000 -d dist

# 3) Checks
# a) Header/footer identical across routes
for p in index.html product/index.html fl-bsa/index.html pricing/index.html trust-center/index.html legal/index.html; do
  diff <(xmllint --html --xpath '//header' dist/$p 2>/dev/null) <(xmllint --html --xpath '//footer' dist/$p 2>/dev/null) >/dev/null || true
done

# b) Guardrail: vendor HTML must not deploy (@audit)
rg -n "(^|/)(themes/appline/.*\.html|template/appline-.*\.html)" dist && exit 1 || echo "@audit OK"

# c) CI audits (already set): Pa11y/Lighthouse
gh workflow run audit.yml --ref main

# 4) Evidence bundle
scripts/evidence/snapshot.sh "THEME-HARDEN-001"  # -> output/ops/THEME-HARDEN-001/

Artifacts to review:
	•	Screenshots (desktop/mobile) for /, /fl-bsa/, /pricing/, /trust-center/.
	•	output/ops/THEME-HARDEN-001/manifest.json & hashes.sha256.

⸻

6) Risks & Rollback
	•	Unintended CSS influence: all overrides are scoped to body.eql. Rollback: remove class="eql" or unlink overrides.css.
	•	Menu JS unwanted: delete assets/js/nav.js and keep a no‑JS nav (works on desktop; mobile stays always open).
	•	Sync script collision: scripts replace <header class="site-header">…</header> / <footer class="site-footer">…</footer> only. Rollback: restore files from git.

⸻

7) Follow‑ups (after this pass)
	•	Hero copy & layout pass (shorten headlines, add 2‑column features block on Home).
	•	Wordmark finalization (choose one of the dot‑accent options; swap in one <img> across site).
	•	Whitepaper CTA card on /fl-bsa/ and /product/ with the same card component.
	•	Print refinements on Trust & Legal (already decent; re‑test after spacing changes).

⸻

8) Assumptions & Unknowns
	•	All pages are static HTML; no templating engine is available (we use sync scripts instead).
	•	We keep private mode (no SEO changes) until you confirm.

⸻

Quick acceptance checklist
	•	Header and footer identical across all routes, passing keyboard/Escape behavior.
	•	No gradients; unified CTAs; consistent section padding.
	•	No vendor demo routes in dist/ (guard step passes).
	•	Lighthouse A11y ≥ 95, Contrast checks pass; Pa11y no criticals.
	•	Evidence snapshot THEME-HARDEN-001 present.

If you’re good with this workstream, I’ll produce the exact diffs for the repo (header/footer SSOT, overrides.css, nav.js, script updates) as Block‑12/13—Hardening PR.
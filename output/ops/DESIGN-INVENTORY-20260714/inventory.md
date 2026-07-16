# Equilens Website — Design-Consistency Inventory
Date: 2026-07-14 · Branch: `home-company-first` · Worktree: `/home/daimakaimura/fl-bsa-root/worktrees/website/home-company-first`
Scope: 9 pages (`/`, `/fl-bsa/`, `/trust-center/`, `/procurement/`, `/legal/`, `/fl-bsa/whitepaper/`, `/press/`, `/contact/`, `/404.html`) + `assets/eql/base.css` (2,475 lines) + `brand/tokens/tokens.css`.
Evidence: `base.css:<line>`, `<page>:<line>`, and screenshots in this directory (`<page>-1440.png`, `<page>-390.png`). Computed styles verified with headless Chromium at 1440px.

Legend: **[N]** = normalization proposal (one line, implementable).

---

## 1. BUTTONS

**1.1 Three button shapes coexist.**
- `.btn` — pill (`--radius-full`), padding `12/24px`, min-height 48px, `font-medium`, `line-height:1.1` (hardcoded), `transition-fast` (base.css:1365–1382; comment *“Rounded pills are trendier”* :1370 — generational marker).
- `.nav-toggle` — button-shaped but `--radius-md` (8px), padding `8/12px`, `text-sm`, `shadow-xs` (base.css:610–633). Same visual family, different radius/size.
- Form submit reuses `.btn.btn-primary` (contact/index.html:110) — OK.
**[N]** One shape: pill for `.btn-*`; restyle `.nav-toggle` as `.btn btn-secondary btn--small`.

**1.2 Primary vs secondary asymmetries** (base.css:1384–1419):
- `.btn-primary` declares `font-size: var(--text-base)`; `.btn-secondary` declares none (inherits 16px — works by accident).
- Hover lift differs: primary `translateY(-2px)` (:1394), secondary `-1px` (:1418), nav-toggle `-1px` (:627). Cards lift `-4px` (:1265).
- `.btn` is the ONLY user of `--transition-fast` (1 use vs 20 uses of `--transition-base`) — buttons ease differently from everything else.
**[N]** Both buttons: `font-size: var(--text-base)`, hover lift −1px, `--transition-base`.

**1.3 No small/tertiary variant exists**, so one-off compensations appear:
- `.artifact-actions .btn { width: min(100%, 22rem) }` (base.css:1206) — fixed-width buttons only inside download cards; everywhere else buttons are content-width.
- Home wraps a lone button in a paragraph: `<p class="mt-6"><a class="btn btn-secondary">` (index.html:118) instead of a `.cta-row`.
**[N]** Add `.btn--small`; make `.artifact-actions` use normal auto-width buttons in a column; all button groups use `.cta-row`.

**1.4 Primary/secondary role drift for the same action.**
- Whitepaper PDF: **primary** on /fl-bsa/whitepaper/ (whitepaper/index.html:55) but **secondary** on /fl-bsa/ docs (fl-bsa/index.html:279) and home (index.html:142). Screenshots: `whitepaper-1440.png` vs `fl-bsa-1440.png`.
- “Request Security Pack”: **primary** on trust-center (trust-center/index.html:65) but **secondary** on home final CTA (index.html:160).
**[N]** Rule: primary = the page’s single conversion action (“Request the Pack”, or the page’s namesake asset); everything else secondary; never two primaries per page.

**1.5 Button-label casing drift** (see §4 for the full casing census):
“Request the Pack”, “Review Trust Center”, “Return Home”, “Download Demo Report (PDF)”, “Download Whitepaper Intake (ZIP)” (Title Case) vs “See how FL-BSA works” (index.html:118), “Download demo report” (index.html:135), “Read the whitepaper” (index.html:142), “Open in email client” (contact/index.html:110) (sentence case). The **same file** is “Download demo report” on home and “Download Demo Report (PDF)” on /fl-bsa/ (fl-bsa/index.html:290). Same ZIP is “Download Whitepaper Intake (ZIP)” (fl-bsa/index.html:280) vs “Download Intake Bundle (ZIP)” (whitepaper/index.html:56).
**[N]** Sentence case for all button labels; one canonical label per asset, format “Download <asset> (PDF/ZIP)”.

**1.6 CTA-row overflow.** `.cta-row` caps at `--max-width-xl` (576px, base.css:1181); the whitepaper hero’s two long buttons don’t fit → stacked/wrapped buttons unique to that page (`whitepaper-1440.png` hero) while every other hero shows a side-by-side pair.
**[N]** Remove the max-width from `.cta-row` (keep `justify-content:center; flex-wrap:wrap`).

**1.7 Non-style classes bloat buttons.** Plausible taggings are written as classes (`plausible-event-name=Request+Pack …` — index.html:91, all pages), so each CTA carries 5–7 pseudo-classes; grep-based style audits misfire on them. **[N]** Keep, but document; or move to `data-` attributes if the Plausible script version allows (script.tagged-events supports class names only — then keep).

**1.8 Ghost class `.cta`.** Referenced only inside `:not(.cta)` guards (base.css:283–285); no `.cta` rule or usage exists. **[N]** Drop from selectors.

---

## 2. CARDS / PANELS / CONTAINERS

**2.1 Seven panel components, five specs.** All white-ish rounded boxes, all different:

| Component | bg | border | radius | padding | shadow | source |
|---|---|---|---|---|---|---|
| `.card` | white | gray-200 | **12px** | **32** | shadow-card | base.css:1247–1259 |
| `.card-hero` | rgba(255,255,255,.6)+blur | rgba(255,255,255,.5) | 12px | 32/24 | **shadow-md** | :1330–1344 |
| `.step` | white | gray-200 | 12px | 32 | shadow-card | :1443–1451 |
| `.timeline-content` | white | gray-200 | **16px** | 32 | shadow-card | :2222–2234 |
| `.evidence-chain-card` | white | gray-200 | 12px | **28** (`--space-7`) | shadow-card | :2319–2337 |
| `.faq-item` | white | **gray-100** (lighter) | 12px | 20/24 | shadow-card | :1701–1708 |
| `.section-block` | **rgba(255,255,255,.88)** | gray-100 | 16px | 40/24→48/48 | **none** | :988–1010 |

**[N]** One `.card` spec (white, gray-200, 12px, 32px, shadow-card) + one modifier `--compact` (24px); `.section-block` stays the only 16px-radius container; kill the .88-alpha white (use solid `--color-white`) and the glass card variant.

**2.2 Hover behavior differs per panel.** Plain `.card` has **no** hover; `a.card`/`.card-interactive` lift −4px (:1262–1267) but **no anchor cards or `.card-interactive` exist on any page** (grep: 0) — dead; `.step:hover` border+shadow (:1453); `.timeline-content:hover` same (:2236); `.faq-item:hover` different pair (border-medium + shadow-md, :1710); `.hero-highlights .card` hover explicitly disabled (:931–935).
**[N]** Static panels get no hover; only real links/summary rows get hover; delete the dead interactive-card rules.

**2.3 Container logic differs per page** (the biggest structural drift):
- Home: `<section class="container section-block">` — container **and** panel on one element, no `.section` wrapper, no alt striping; rhythm via `.landing .section-block { margin-bottom: 48px }` (index.html:98; base.css:1013).
- fl-bsa/trust/procurement/legal/whitepaper: `<section class="section [alt]"><div class="section-block">` — striped slate bands with a floating panel; vertical rhythm = `clamp(3rem,7vw,4.5rem)` top+bottom ⇒ ~144px between panels (base.css:803).
- Press + contact: `.section > .container > .card` — **no section-block at all**; heading sits on the bare stripe (press/index.html:74–75).
- 404: hero only.
Compare `home-1440.png` (flat white, 48px gaps) vs `procurement-1440.png` (striped, ~144px gaps) vs `press-1440.png` (bare).
**[N]** One pattern everywhere: `.section[.alt] > .section-block`; home adopts stripes or every page drops them — pick striped (already on 5/9 pages); press/contact wrap content in a section-block.

**2.4 `.card` sub-variants undocumented mix**: `card card-hero` (home/fl-bsa heroes), `card card--reader` (left text), `card card--compact card--reader mt-8` (trust-center/index.html:209), bare `card--compact` list card with **no heading** (press/index.html:76). `card--reader` applied inconsistently: fl-bsa “Licensing & Usage” card gets it, sibling “Controls & Mapping” doesn’t (fl-bsa/index.html:251 vs 240) though both hold identical check-lists.
**[N]** Two variants only: default (centered marketing card) and `--reader` (left, long-form); apply `--reader` to every card containing `.checks`.

**2.5 `.stack` vs `.grid`.** fl-bsa compliance cards stack full-width single-column (`.stack`, fl-bsa/index.html:228 — sole use in site) while visually identical card sets elsewhere use `.grid`/`.grid-3`. **[N]** Use `.grid`; reserve stacking for `--reader` long-form cards ≥ 60ch.

**2.6 Two page-width systems.** `.container` (padding 20px, base.css:790) vs `.wrap` (padding 24px, :796) — `.wrap` is used on **zero** pages. `--container-width`=1120px but `.section-block` caps at `--max-width-5xl` (same 1120) minus its own margins, while `.policy .section-block` re-caps at hardcoded `48rem` (:1049). **[N]** Delete `.wrap`; express policy width as a token (`--content-width` variant), not a literal.

---

## 3. HEADINGS & TYPE SCALE

**3.1 Actual rendered scale at 1440px (computed-style verified) vs tokens:**

| Context | size/weight/color | evidence |
|---|---|---|
| h1 `.brand-title` (home, fl-bsa, trust, legal, contact, press, 404) | 72px / 800 / slate-900 | base.css:394; verified |
| h1 `.hero-headline` (procurement, whitepaper) | **56px** / 800 | base.css:2466; verified |
| h2 bare in `.section` (press only) | **56px** / 600 | h2 base :353; verified 56px — largest section heading on the site (`press-1440.png`) |
| h2 `.section-block` | 40px / 600 | :1037–1045; verified |
| h2 `.policy .section-block` (legal) | **32px / 600 / indigo-800** | :1052–1056; verified rgb(55,48,163) — only page with colored h2s |
| h2 `.contact-form-card` | **24px** / 600 | :1595; verified |
| h2 `.section-block--evidence-chain` | 40px / 600 | :2304 (duplicate of the block rule) |
| h3 `.card` | 20px / **700** (home/trust/proc) vs **600** (fl-bsa/whitepaper via `.product-page--flbsa` :952–957) | verified both |
| h3 `.hero-highlights .card` | **18px** / indigo-800 | :937–941; verified |
| h3 `.timeline-content` in block | 20px / 600 / **indigo-600 #4F46E5** | :2267; verified |
| h3 `.step` | 20px / 700 / **indigo-800 #3730a3** | :1468–1474; verified |
| h3 `.evidence-chain-card` | 20px / 700 / declared `--chain-accent` #4F46E5 (:2380) **overridden to #3730a3** by `.trust-center-page…` (:1764) | verified rgb(55,48,163) |
| h3 legal (`.policy … > h3`) | **16px** / 600 + border-top | :1111–1116 |
| h3 generic section-block | 18px + border-top | :1101–1109 |
| footer h3 | 12px / 700 / uppercase | :1801–1808 |
| `.toc-label` | 14px / 700 / uppercase | :732–739 |
| `.eyebrow` | 16px / 700 / uppercase / indigo-600 | :382–392 |
| `.brand-subtitle` | 18px / 600 / uppercase / **indigo-700 #4338CA** | :419–427 |
| `.faq-item summary` | 18px / 600 on fl-bsa (:959) — base 500 rule (:1715) never renders (FAQ exists only on fl-bsa) | verified |

So: h1 has 2 sizes, section-h2 has 4 sizes (56/40/32/24) and 2 colors, card-h3 has 3 sizes (16/18/20), 2 weights (600/700) and 3 accent colors. The base `h2 { font-size: var(--text-5xl) }` (:353) is effectively a trap that only press falls into.
**[N]** Fix scale: h1 56/800; section h2 36–40/600 slate-900 (legal included, drop indigo h2); card/step/timeline/evidence h3 20/600 one accent color; sub-h3 in prose 18/600; kill 56px h2 by making the section-block wrapper universal (§2.3).

**3.2 Tracking tokens are no-ops.** `--tracking-tighter/tight/normal` are all `0em` (base.css:110–112); 12 of 20 `letter-spacing` declarations therefore do nothing (:341, 350, 357, 396, 466, 949, 956, 1041, 1069, 1115, 2307, 2375, 2384, 2469). **[N]** Give tighter/tight real values (−0.02em/−0.01em) for display sizes or delete the declarations.

**3.3 Unused heading machinery**: h4/h5/h6 rules (:364–374) — zero h4+ elements on the 9 pages; `--text-note` (13px) used only by `.note`; `--font-light` (300) used once (FAQ “+” glyph :1737).

---

## 4. CASING & MICROCOPY LABELS

**4.1 Section h2 casing is split ~50/50.**
- Title Case: “How it Works”, “Governance Evidence” (fl-bsa/index.html:135, 225), “Security Posture”, “Data Protection”, “Evidence Chain” (trust-center:73–157), “Privacy Notice” … “Export Control” (legal, all 9), “Demo and Synthetic Boundary”, “Provenance”, “Verify It Yourself” (whitepaper:63–90), “Brand Usage Guidelines” (press:75).
- Sentence case: all four home h2s (index.html:99–156), all four procurement h2s (“Deployment steps”, “Procurement package”, “Deployment options”, “Need a walkthrough?” — procurement:64–160), “Ready to scope readiness?” (fl-bsa:346, whitepaper:95), “Need the security pack?” (trust-center:231), “FAQ”.
- Within one page: fl-bsa has “How it Works” (Title, with lowercase “it”!) next to “Ready to scope readiness?” (sentence).
**[N]** Sentence case everywhere (already the voice of home + procurement + every CTA heading; cheapest to converge; questions/CTAs can’t be Title-Cased gracefully). Keep proper nouns (Trust Center, FL-BSA).

**4.2 Card h3 casing mixes on a single page.** Trust-center: “Supply Chain / Runtime Protection / Data Sovereignty / Regulatory Mapping” (Title) then “Customer-hosted appliance / Equilens business data / Privacy contact / Public reports & files” (sentence) — trust-center/index.html:79 vs 133. fl-bsa cards all Title Case; procurement cards sentence case (“Evidence bundle”, “Commercials”, “Container / VM deployment”).
**[N]** Sentence case for all card/step/timeline/evidence h3.

**4.3 Step-component casing differs by component**: `.timeline` h3 Title Case (“Snapshot the Baseline”, fl-bsa:140) vs `.step` h3 sentence case (“Request guided pilot access”, procurement:69). **[N]** Sentence case (follows §4.1/4.2).

**4.4 Button labels** — see §1.5. **[N]** Sentence case.

**4.5 TOC label/id mismatch**: link text “Licensing” targets `#pricing` (fl-bsa/index.html:93); section id `pricing`, heading “Licensing”. **[N]** Rename id to `licensing` with anchor redirect comment, or label back to “Pricing” — one word for one concept.

**4.6 Numbered-badge microcopy**: evidence nodes zero-padded “01…04” mono (trust-center:164) vs step numbers “1…5” (procurement:68). **[N]** Un-padded digits everywhere.

**4.7 Eyebrows are Title Case everywhere** (“Getting Started”, “Media Resources”, “Security & Compliance”, …) — the one label family that IS consistent; uppercase transform makes casing moot. Keep.

---

## 5. COLOR & EMPHASIS RULES

**5.1 Three (four) indigos compete for “emphasis”:**
- `#4F46E5` (`--color-primary`, brand-500): eyebrows (:388), check ✓ (:1520), icons (:2183, 2194), active nav/toc/subnav (:606, 767), FAQ “+” (:1738), step-number bg (:1493), timeline h3 in block (:2268), btn-primary bg.
- `#3730A3` (`--color-primary-text`, indigo-800, hardcoded :20): inline links (:290), `.product-name` (:464), `abbr` (:476), card h3 accents in section-blocks (:1759–1768), step h3 (:1472), hero-highlight h3 (:940), btn-secondary text, nav/toc hover, evidence-node text (:2367).
- `#4338CA` (`--eql-color-brand-700`): `.brand-subtitle` (:426) and all hovers via `--color-primary-hover`.
- `#6366f1` (indigo-500, hardcoded :18): only the hero radial gradient (:879).
Net effect: sibling headings on the same screen use different indigos (timeline h3 #4F46E5 two scrolls below card h3 #3730A3 on /fl-bsa/ — verified; evidence node pairs #3730A3 text inside #4F46E5-alpha chrome).
**[N]** Two roles only: interactive/brand accent = `#4F46E5` (buttons, active states, icons, badges); text-emphasis = `#3730A3` (inline links, product-name, accent headings). Delete `#4338CA` from subtitle (use #3730A3) and keep it solely as hover-darken of #4F46E5; gradient uses primary at 8% alpha, not indigo-500.

**5.2 Two neutral families.** Text was “Updated to Slate” (#0f172a/#334155/#475569, base.css:46–50) but borders/surfaces/muted stay gray (#e5e7eb/#f3f4f6/#9ca3af…) and `--bg-subtle` is slate-50 #f8fafc while `--bg-muted` is gray-50 — cool text on warm-gray borders. tokens.css “ink” (#111827) maps to `--color-gray-900` which is **never used** ⇒ the brand ink color never renders anywhere.
**[N]** Pick slate for everything (text, borders slate-200/300, surfaces slate-50) and update tokens.css ink tokens to match — one neutral ramp.

**5.3 Hardcoded colors bypassing tokens.css** (all in base.css): `#6366f1` :18, `#3730a3` :19–20, gray ramp hexes :30–37, slate hexes :42, 47–49, four `rgba(79,70,229,…)` alphas :21–24, glass whites :139–142, shadow rgba() :128–136, hero gradient `rgba(99,102,241,.08)` :879, section-block `rgba(255,255,255,.88)` :989, select-arrow data-URI fill `#6b7280` :1666, print palette :2092–2100, black #000 :28. tokens.css supplies only 6 of the consumed colors.
**[N]** Promote the used alphas/neutrals into tokens.css (or a derived layer); no raw hex below line 180 of base.css.

**5.4 Dead color tokens**: entire dark-mode set (`--eql-color-*-dark`, `ink-rev`) and all six state colors (success/warning/danger ×2) are consumed **zero** times — the site has no success/error styling at all (contact form has no invalid/error state). Also unused in base.css: `--color-black`, gray-500/600/700/800/900, `--color-primary-light/dark`, `--color-primary-a12`, `--bg-alt`, `--bg-muted`, `--border-dark` (grep-verified).
**[N]** Delete or mark reserved; wire `--eql-color-state-danger-light` into form `:user-invalid` when forms grow validation.

**5.5 Emphasis density.** Body copy mixes four inline emphasis styles in one sentence: `strong` (slate-900 :1152–1159), `.product-name` (indigo semibold :463), `abbr` (indigo small-caps semibold :471–479), `code` chips (:481). See any check-list on /fl-bsa/ (`fl-bsa-1440.png` Governance section) — three colors of bold per line item.
**[N]** Rule: indigo = links & product names only; `abbr` inherits text color (keep small-caps); `strong` stays slate-900.

---

## 6. SPACING / RADII / SHADOWS

**6.1 Spacing tokens vs literals.** Token usage is good in components, but 25+ distinct raw lengths live in base.css: `0.75rem` p-margin (:377), `0.75/1/1.25rem` list margins (:450), `0.5rem` toc padding (:750), `96px` scroll-padding (:226) vs `110px` scroll-margin (:866) vs sticky tops `72px/96px/64px` (:638, 723, 2051), `9rem` nav-open shim (:1958), hero-logo `110px/92px` (:409, 2000), badges `2.5rem/32px`, dot `.35rem`, `22rem` button width, `100px` textarea, `48rem` policy width, measures `68/48/32/36/24ch`, section `clamp(3rem,7vw,4.5rem)` (:803).
**[N]** Keep clamp + measures; move p/list/toc rhythm onto `--space-3/4/5`; derive scroll-padding/scroll-margin/sticky tops from one `--nav-height` variable.

**6.2 Vertical rhythm is 3× different between templates**: landing blocks 48px apart (`.landing .section-block`, :1013) vs ~144px between panels on `.section` pages (§2.3). Heading gaps also differ: `.section h2` margin-bottom 32 (:811) vs `.section-block h2` 16 (:1043) vs bare h2 24 (:356).
**[N]** One section gap (the clamp) on all pages; h2 margin-bottom 16 + lead margin-bottom 40 as the only rhythm pair.

**6.3 Radius census (used)**: 2px (focus, :310), 4px (code), 8px (nav-toggle, inputs, mobile menu, skip-link), 12px (cards/faq/evidence/buttons—well, pills), 16px (section-block, timeline), 9999 (pills/badges). Defined-unused: `--radius-none/2xl/--radius` alias. tokens.css defines a **second radius system** (`--eql-radius-1:6px`, `--eql-radius-2:12px`) consumed **zero** times.
**[N]** Steps: 8 (inputs/small), 12 (cards), 16 (page panels), full (pills/badges); reconcile tokens.css to those four; delete the rest.

**6.4 Shadow census (used)**: `xs`, `card`, `card-hover`, `md`, `lg`, `accent`, `accent-hover`, focus-ring `0 0 0 3px a10` — 8 actives; `sm`/`xl` unused. Panels disagree: card=shadow-card, card-hero=shadow-md, faq-hover=shadow-md, mobile menu=lg.
**[N]** Three shadows: `card` (rest), `card-hover` (raise), `accent` (primary btn) + the focus ring; delete xs/sm/md/lg/xl usage by remapping (xs→card, md/lg→card-hover).

**6.5 Motion**: `--transition-slow/slower` and all four tokens.css `--eql-motion-*` unused; `--transition-fast` used once (§1.2). **[N]** One duration token (200ms standard-ease) + reduced-motion guard (already present :229–242).

---

## 7. ALIGNMENT

**7.1 The de-facto rule is “center everything except long-form”**, but it’s encoded 39 separate times (39 `text-align:center` vs 12 `left` rules) with page-scoped exceptions instead of one grammar.

**7.2 Contradictory paragraph rules**: `.section-block p { text-align:left }` (:1125) is immediately beaten by `.section-block > p { text-align:center }` (:1162) for direct children ⇒ full-width paragraphs on whitepaper (“Demo and Synthetic Boundary”, whitepaper/index.html:64–65) and home render as 3–5 **centered** long lines (`whitepaper-1440.png`, `home-1440.png` “Why teams…” block) — the least readable combination.
**[N]** Direct prose paragraphs in panels: max-width 68ch, `margin-inline:auto`, **left-aligned**; only leads/notes stay centered.

**7.3 Press asset list**: `.card` centers text while `.asset-list li::before` pins “→” at `left:0` of the full-width li ⇒ ragged floating arrows whose distance from the label varies per line (press/index.html:76–84; `press-1440.png`). **[N]** Make the asset card `--reader` (left-aligned) or drop the pseudo-arrows.

**7.4 Ordered steps rendered as ✓.** Whitepaper uses `<ol class="checks">` (whitepaper/index.html:79) — the checks class suppresses numbering and prints checkmarks, so a 1-2-3 procedure displays as three ✓ bullets. **[N]** Add `.steps-list` (numbered) or use `ol` default styling inside `--reader` cards; reserve `.checks` for unordered claims.

**7.5 Mobile split-personality cards.** At ≤768px `.hero-highlights .card-hero` switches to left-aligned icon-grid (:2016–2048) while sibling plain `.card`s stay centered ⇒ home shows left cards then centered cards in one scroll (`home-390.png`). **[N]** Apply the compact left icon-row layout to ALL cards ≤768px.

**7.6 `.section-centered` variant** (:833–863) — a second centering system — is used on zero pages. Delete.

---

## 8. ICONS

**8.1 Coverage is arbitrary per page**: inline SVG count — home 3, fl-bsa 12, trust-center 8, procurement 4, legal 0, whitepaper 0, press 0, contact 0, 404 0. On home, the first card row has icons, the second (Demo report / Whitepaper / Trust Center) doesn’t (index.html:102–151). On fl-bsa every card has an icon **except** “Engagement Shapes” (fl-bsa/index.html:208). Steps/timeline/evidence use number badges instead of icons.
**[N]** Policy: hero-highlight and feature cards get icons; download/CTA/list cards don’t; numbered flows use badges — write it down and fix the two stragglers (home verify row: no icons — fine under policy; fl-bsa Engagement Shapes: none needed if sibling “Controlled Pilot Access” loses its icon → prefer NO icons on `--reader` cards).

**8.2 Two icon sizes, same stroke**: `.icon-hero` 28px (:2179) and `.icon-inline` 24px (:2191), both stroke-2 feather-style. `.icon-inline` inside card h3 is re-laid-out to block-centered (:1279–1284), i.e. it is not actually inline anywhere in cards. Width/height are set twice (SVG attrs + CSS).
**[N]** One 24px icon class; drop per-SVG width/height attrs (keep viewBox).

**8.3 Copy-paste duplication, no sprite.** The document-check path (`M14 2H6a2 2…`+`M9 15l2 2 4-4`) appears 8× across 4 pages; cloud path 4×; shield 3×; layers 2×; refresh 2×; doc-lines 5×. No `<symbol>/<use>`, so every edit is 8 edits.
**[N]** Single inline `<svg><symbol>` sheet per page (or build-time include) + `<use href="#icon-doc-check">`.

**8.4 Icon↔concept mapping is unstable**: doc-check = “Evidence Packs” (index.html:108) but also “Controlled Pilot Access” (fl-bsa:197) and “Public reports & files” (trust:211); shield = “Data Sovereignty” (trust:100), “Commercials” (procurement:122), “Controls & Mapping” (fl-bsa:242); cloud = “Customer-Hosted” and “Guided AWS AMI”. **[N]** One icon per concept (evidence, hosting, security, docs, contact), documented next to the symbol sheet.

**8.5 Three numbered-badge styles**: `.step-number` 40px solid indigo, white “1” (:1486–1499); timeline `::before` 32px indigo-a10, indigo-600 “1” (:2242–2257); `.evidence-chain-node` 40px indigo-a08 + a15 border, indigo-800 “01” (:2362–2378). All verified in `procurement-1440.png` / `fl-bsa-1440.png` / `trust-center-1440.png`.
**[N]** One badge: 40px, `--color-primary-a10` bg, primary text, mono, un-padded digits.

---

## 9. DEAD / DUPLICATE / CONTRADICTORY CSS

**9.1 Selectors with zero matches on the 9 pages** (grep-verified):
- `.wrap` (:796–800)
- `.product-subnav` / `.subnav-inner` / `.subnav-link` block (:635–694) + mobile rules (:2050–2063) — ~75 lines; `templates/flbsa_subnav.html` exists but is included nowhere
- `.section-centered` family (:833–863)
- `.section-block--narrow` (:1017–1035)
- `.cta-row--left` (:1192–1195)
- `.card-interactive`, `a.card:hover`, `a.card-hero`, `a.card-hero:hover`, `a.card.card-hero:hover` (:1261–1267, 1347–1357) — no anchor cards exist
- `.grid-4` (:1236–1240)
- `.text-center`, `.text-center .note` (:2176–2177), `.text-subtle` (:459–461)
- `.policy .section-block .container > h2` + `:first-of-type` (:1062–1076) — legal h2s are direct children of `.section-block`, never inside `.container` (verified by failed selector probe)
- `.hero > .container` (:882–884) — every hero contains `.hero-content` directly
- `.hero-content .checks` (:916–920), `.hero-content .note` (:970–973) — no hero contains checks/notes
- `.section > .container > p:not(.note)` (:816–821) — the only `.section>.container` pages (press/contact) have no direct `<p>`
- h4/h5/h6 rules (:364–374) — no h4+ elements
- `#nav-placeholder` print rule (:2109) + the whole nav.js fetch-fallback path (nav.js:11–45) — all pages ship baked navs
- `.faq-item summary { font-weight: 500 }` (:1718) — FAQs exist only under `.product-page--flbsa`, whose override (:952–957) always wins
- `.step strong` in group (:1155) — no strong inside steps
- `--eql-radius-1/2`, all `--eql-motion-*`, `--eql-color-*-dark`, `ink-rev`, state colors (tokens.css:14–24) — 13 of 19 brand tokens unconsumed
- 38 unused base.css tokens (grep-verified list): `--bg-alt, --bg-muted, --border-dark, --color-black, --color-gray-500/600/700/800/900, --color-primary-a12, --color-primary-dark/light, --leading-none/snug, --max-width-xs/sm/md/lg/4xl/6xl/7xl/full, --radius, --radius-2xl, --radius-none, --shadow-sm/xl, --space-0/24, --transition-slow/slower, --z-base/dropdown/fixed/modal/modal-backdrop/popover/sticky/tooltip`

**9.2 Overridden-in-practice rules (silent losers):**
- `.hero-content .email-highlight a { color: #4F46E5; text-decoration: none }` (:979–985) loses to `p a:not(.btn)…` (:283–291, specificity 0-4-2 vs 0-2-1) ⇒ the contact hero email renders **underlined indigo-800**, not the designed clean link (computed-verified; `contact-1440.png`).
- `.evidence-chain-card h3 { color: var(--chain-accent) }` (:2380) loses to `.trust-center-page … .evidence-chain-card h3` (:1764–1768) on the only page using evidence cards ⇒ the whole `--chain-accent` custom-property system (:2320–2322) is effectively inert.
- `.section-block p` (left, :1125) vs `.section-block > p` (center, :1162) — §7.2.
- `.card h2 { font-size: var(--text-xl) }` (:1269) is overridden by `.contact-form-card h2` (:1595) in its only h2-in-card usage.
- `.note.note--small` (:1560–1565) restates `.note`’s own values (no-op except `opacity:1`); `.policy .section-block .note…` (:1581–1585) restates them again.

**9.3 Duplicates**: `.text-muted` defined twice (:455, :2175); `html` opened twice (:223, :244); h2 margin logic in three places (:356, :811, :1043); evidence-chain h2 rule (:2304–2309) duplicates `.section-block h2` (:1037) verbatim.

**9.4 Generational strata (comments betraying layered redesigns)**: “Version 2.1 (Modern Professional)” (:5), “Updated to Slate … for Depth” (:46), “Increased from 1.625 for elegance” (:106), “Removed white box” (:896), “New Atmospheric Gradient” (:878), “Rounded pills are trendier” (:1370), “Slightly smaller, cleaner” (:565), “2x2 on desktop as requested” (:2288). None are harmful alone; together they mark at least three visual generations coexisting.
**[N]** For all of §9: delete dead rules/tokens (~350 lines ≈ 14% of the file), resolve the two specificity losers intentionally, keep one comment header.

**9.5 Dead class in HTML**: `step-title` (5×, procurement/index.html:69–97) has no CSS rule — styling comes from `.step header h3`. Remove or adopt.

---

## 10. PER-PAGE ODDITIES

**Home (`/`, body `eql landing`)**
- `section.container.section-block` fused element (§2.3); no stripes; unique 48px rhythm.
- Wordmark rendered twice at page top: nav `logo-wordmark` + hero `equilens-wordmark-hero.svg` inside `h1.brand-title` (index.html:68, 85) — the h1 is an image (`home-1440.png` shows the double wordmark stack).
- Mixes glass `card card-hero` (with icons) and plain `.card` (without) as sibling grids (§8.1).
- Lone secondary button in a `<p class="mt-6">` (§1.3).

**FL-BSA (`/fl-bsa/`, body `eql product-page product-page--flbsa`)**
- Page-scoped typography fork: `.product-page--flbsa` downgrades card/timeline/faq headings to 600 and adds `text-wrap:pretty` (:948–968) — same components render heavier on every other page.
- `#pricing` id vs “Licensing” label (§4.5); sr-only h2 “FL-BSA highlights” has no visible counterpart pattern elsewhere.
- Sole user of `.stack`, `.timeline`, FAQ; four download buttons with (PDF)/(ZIP) suffixes vs home’s suffix-less labels.

**Trust Center (`/trust-center/`, body `eql trust-center-page`)**
- Its page class exists solely to re-color card h3s (:1764) — which also neutralizes the evidence-chain accent system (§9.2).
- Casing flips between its own sections (§4.2); only page using `sup` footnotes (:112, 121) and `note--small`.
- Evidence card padding 28px breaks the 32px card rhythm (§2.1).

**Procurement (`/procurement/`, body `eql` — no page class)**
- Only page using `.hero-headline` for a marketing hub h1 (56px vs 72px siblings) — with whitepaper being a doc page, procurement is the odd h1 out among the four hub pages (`procurement-1440.png`).
- Sole user of `.steps/.step/.step-number` — a second numbered-card system duplicating `.timeline` (§8.5); dead `step-title` class (§9.5).
- No TOC although it is as long as trust-center (which has one).

**Legal (`/legal/`, body `eql policy`)**
- Only page with indigo section h2s (32px, §3.1) and 48rem panels; effective-date placement varies (bottom of Privacy legal/index.html:119 vs top of Website Terms :150).
- TOC has 9 links vs 3–6 elsewhere; h3s at 16px are smaller than body text’s emphasis runs.

**Whitepaper (`/fl-bsa/whitepaper/`)**
- Hero CTA stack wraps (§1.6); `ol.checks` steps-as-checkmarks (§7.4); centered long paragraphs (§7.2).
- h1 mixes indigo `product-name` span inside slate headline (whitepaper/index.html:52) — no other h1 does two-tone.
- Carries `product-page product-page--flbsa` class → lighter headings than trust/procurement for identical components.

**Press (`/press/`)**
- Structural outlier: no `.section-block`; 56px h2 on bare stripe (§3.1); heading outside panel while every other page puts h2 inside the panel.
- Bare `card--compact` with no heading; floating arrows (§7.3); only page whose sections end with no CTA row.

**Contact (`/contact/`)**
- Underlined email-highlight bug (§9.2); 24px h2 (§3.1).
- `.contact-form .note` border-top rule (:1567–1573) draws a horizontal rule mid-form above the Interest note and again above the privacy note (`contact-1440.png`) — the “note = footnote with divider” pattern misfires inside a form.

**404 (`/404.html`, body `eql landing`)**
- Consistent hero-only page; “Return Home” Title Case (§1.5). Hero radial gradient’s 60%-stop edge is visible as a soft-edged blob box on all heroes but most obvious here and on press (`404-1440.png`, `press-1440.png` top).

**Cross-page recurring elements — divergence summary**
| Element | pages | divergences |
|---|---|---|
| Page hero | all 9 | h1 72px text / 72px image / 56px; eyebrow present except home/404… (home uses `brand-subtitle` instead of `eyebrow`); CTA pair / single / none; email link only on contact |
| Section heading | all | 56/40/32/24px; slate vs indigo; Title vs sentence (§3.1, §4.1) |
| Card grid | 7 | glass vs plain; icons vs none; grid vs stack; centered vs reader (§2, §8) |
| CTA row | 7 | centered pair standard; wrapped stack (whitepaper); in-card cta-row (fl-bsa docs); missing (press, legal) |
| TOC | fl-bsa, trust, legal | present; absent on equally long procurement/whitepaper |
| FAQ | fl-bsa only | base styling unreachable elsewhere (§9.1) |
| Download row | home, fl-bsa, whitepaper, press | `.artifact-actions` fixed-width buttons vs press underlined links vs hero buttons — three treatments of “download an asset” |
| Boundary note | all footers + fl-bsa/whitepaper in-page | consistent (footer) — the one shared component that never drifts, plus `.note` in-page variants with/without border-top |
| Footer / nav | all 9 | fully consistent (baked by sync script) — keep as the reference implementation |

---

# NORMALIZATION SPEC DRAFT

**Buttons** — one set, pill radius-full, `--transition-base`, hover lift −1px:
- `.btn-primary`: bg `--color-primary`, white text, `--shadow-accent`; exactly one per page (the page’s conversion).
- `.btn-secondary`: white bg, `--color-primary-text` text, gray-300 border, `--shadow-card`.
- `.btn--small`: padding 8/16, `--text-sm`, min-height 40px (nav-toggle, dense rows).
- Labels sentence case; one canonical label per asset (“Download demo report (PDF)”); `.cta-row` = the only button container, no max-width, centered, wraps.

**Card** — one spec: white bg, 1px slate-200 border, radius 12px, padding 32px (`--compact` 24px), `--shadow-card`, no hover unless the whole card is a link (then border-accent + `--shadow-card-hover`, no translate). Variants: default (centered, icon optional per policy) and `--reader` (left, auto-applied wherever `.checks`/long copy lives). Delete `.card-hero` glass, `.step`, fold `.timeline-content`/`.evidence-chain-card` into `.card` + one shared 40px number badge (primary-a10 bg, primary text, mono, unpadded digits). Page panel `.section-block`: solid white, radius 16px, one padding scale — used on **every** page inside `.section[.alt]` stripes (press + contact + home adopt it).

**Heading scale & casing** — h1 56/800; section h2 40/600 slate-900 centered; card h3 20/600; prose h3 18/600; legal h3 16/600; eyebrow 16/700 uppercase primary; footer h3 12/700 uppercase. Delete the 72px/`.brand-title` size (home hero keeps the wordmark image at a set height; text h1s all 56). **Casing: sentence case for every heading, button, and label** (justification: the site’s own CTAs and newest pages already are, and questions/long compound titles can’t be Title-Cased consistently); proper nouns keep caps. Remove per-page weight forks (`.product-page--flbsa`, `.trust-center-page` heading rules).

**Alignment** — centered: hero content, eyebrows, h2, leads, CTA rows, card titles, badges, footer. Left: all prose paragraphs (max-width 68ch, margin-inline auto), all lists, all `--reader` content, forms, legal body. Kill `.section-block > p` centering.

**Indigo emphasis** — `#4F46E5` for interactive/brand chrome (buttons, active states, icons, badges, checkmarks, eyebrows); `#3730A3` for emphasized text (links, product-name, accent h3s); `#4338CA` only as hover of primary. `abbr` inherits body color. Never two indigos in one component.

**Icons** — one 24px stroke-2 set defined once as `<symbol>`s, referenced via `<use>`; fixed concept map (evidence=doc-check, hosting=cloud, security=shield, docs=doc-lines, deploy=layers, contact=chat); icons on feature cards only; numbered badge (one style) for sequences; no icons in `--reader`/download/legal cards.

**Radius / shadow / spacing** — radius: 8 (inputs/small) · 12 (cards) · 16 (panels) · full (pills/badges); shadows: `--shadow-card` / `--shadow-card-hover` / `--shadow-accent` + focus ring only; spacing: `--space-*` scale only (kill raw rem/px), one `--nav-height` var driving scroll-padding/scroll-margin/sticky tops, one section rhythm `clamp(3rem,7vw,4.5rem)` on all pages, h2→lead→content gaps 16/40.

**Tokens & hygiene** — tokens.css becomes the single source (add the alpha-indigos, slate ramp, radius/shadow steps; delete dark/state/motion tokens or mark reserved); base.css drops ~350 dead lines (§9.1), both duplicate selectors, and all generational comments; resolve the email-highlight and evidence-accent specificity losses explicitly.

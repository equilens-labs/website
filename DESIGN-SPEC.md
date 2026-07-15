# Equilens website — design spec

One simple, tidy, professional system. Every rule below is enforced by a gate
where one exists; change the rule and its gate together, never ad hoc.
(Not deployed: root .md files are outside the publish allowlist.)

## Type

- **Geist Sans** (self-hosted `/brand/fonts/geist-latin-wght-normal.woff2`) — all text,
  including eyebrows and the hero subtitle (uppercase, semibold, wide tracking).
- **Geist Mono** (self-hosted) — number badges, hashes/IDs, and code ONLY.
  Never for labels, headings, or captions (founder rules).
- Small annotation text (panel notes, footer boundary) spans the full content
  width of its container, like the grids it annotates — never a `ch` measure,
  which shrinks with font-size and renders small text conspicuously narrow.
- Scale: h1 56/800 · section h2 40/600 (centered) · card h3 18/600 ·
  body 16/1.7 · landing section intro 18 · note 13. Headings track tight.
- Casing: sentence case for headings, buttons, labels. Proper nouns and legal
  document titles keep caps. Eyebrows and footer column headers are uppercase chrome.
- Section titles are short ("Presenting FL-BSA", "Why self-hosted?").

### Dense-text rules (make long copy readable)

- **FL-BSA** always accent-colored semibold via `.product-name` — in prose AND
  h2/h3 headings (h1, nav, buttons, summaries are exempt chrome). Gate enforced.
- Acronym first use per page: expansion in parentheses, no article —
  "FL-BSA (Fair-Lending Bias-Simulation Appliance)".
- Regulatory acronyms get `<abbr title="…">` hover expansions (EU AI Act, ECOA, FCA).
- Technical tokens (SHA-256, versions, file names, config keys) render in `<code>`.
- Emphasis: semibold ink, at most one phrase per paragraph; never italics or
  ALL CAPS in prose (DEMO/EVALUATION artifact label excepted).

## Color roles

- Text: slate ink (`--text-primary/secondary/muted`).
- `#4F46E5` — interactive/brand chrome only (buttons, icons, active states, accents).
- `#3730A3` — text emphasis: links and **`.product-name`** (see rule below).
- `#4338CA` — hover of primary only. Never two indigos in one component.
- State colors (success/warning/danger) reserved for pass/fail vocabulary.

**FL-BSA always renders in the accent color** (founder rule): every prose
occurrence wrapped in `<span class="product-name">` — gate:
`scripts/ops/check_product_name.py` (runs in content lint).

## Rhythm (gate: `scripts/ops/measure_rhythm.mjs`)

Section boundaries identical · h2→content 24 · intro→group 40 · group→CTA 40 ·
group→note 24 · panel padding symmetric (48) · no trailing-margin accumulation.
8px grid; collapse-aware.

## Components (one spec each)

- **Button**: radius-sm (8px), sentence case, one primary per section; the page's
  conversion CTA may repeat as primary. `.btn--small` for dense chrome.
- **Card** (the ONLY grid-card look — no variants): white, hairline slate border,
  radius 12, no rest shadow, **centered** content, **icon above the title on every
  card**, one-line titles, action rows pinned to a shared bottom line.
- **Badge**: one 40px tinted mono number style for every sequence.
- **Evidence figure**: real artifact imagery, hairline frame, body-face demo caption.
- **Note**: 13px muted, centered, spanning the panel content width, top divider.
- Hero: the LANDING hero only is framed by faint bracket strokes in the
  wordmark's squared geometry (`.landing .hero::before/::after`, founder pick
  2026-07-15) — drawn as borders sized relative to the hero (cannot clip),
  tablet-and-up, silent for screen readers. Interior heroes stay clean. No
  grids, gradients, or mist. Wordmark lockup + sans uppercase subtitle.

## Layout & alignment

Chrome (h2, leads, CTA rows, badges) centered; prose left at 68ch;
landing intros centered at 18px. Panels (`.section-block`) on alternating
white/slate stripes on every page.

## Copy rules (gate: `scripts/ops/content_lint.sh`)

- Claims register: banned/approved language enforced (existing rules).
- The word **"call" is banned** site-wide.
- **No em-dashes** in site copy (lint-enforced; titles/meta/JSON-LD names exempt).
- Plain, precise English; short sentences; no marketing embellishment.
- Mandatory product-boundary block in the footer of every page.

## Verification (all must pass before any push)

1. `npm run content:lint` — claims, call-ban, product-name wrapping.
2. `node scripts/ops/measure_rhythm.mjs <url>` — rhythm table.
3. `npm test` — full Playwright suite (grammar pins, a11y patterns, structure).
4. Visual: 100%-scale component crops at 1440 and 390, reviewed before the founder sees anything.

## Process

Branch → PR (before/after renders) → founder review → founder merges → deploy.
No detail-patching with the founder as QA: finish to this spec across the whole
site, then present once.

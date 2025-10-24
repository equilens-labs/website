Below is a clean Indigo‑accent brand pack (v2) that replaces the blue variants in your page with Indigo and gives you ready‑to‑drop assets (SVGs + tokens + press metadata). It keeps your light/minimal direction and the bracketed wordmark you’ve been exploring.

⸻

1) Context & Goal
	•	Goal: Update the brand Identity to Indigo accent (not blue), package vectors and tokens, and keep the bracketed wordmark/lockups you’re happy with.
	•	Keep: light/minimal aesthetic; no external fonts in the shipped assets; pure SVG for determinism.  ￼

⸻

2) What’s included (Indigo v2)

Place these in your repo:

docs/brand/equilens_logo_mark_pack_v2_indigo/
  ├─ svg/
  │   ├─ equilens_wordmark_light.svg
  │   ├─ equilens_wordmark_dark.svg
  │   ├─ equilens_wordmark_tagline_light.svg
  │   ├─ equilens_wordmark_tagline_dark.svg
  │   ├─ equilens_logo_bracket_light.svg
  │   ├─ equilens_logo_bracket_dark.svg
  │   └─ favicon.svg
  ├─ og/
  │   └─ og-default-light.svg   (1200×630)
  └─ meta/
      ├─ tokens.json            (machine-readable brand tokens)
      └─ press-kit.json         (download map + usage notes)

Accent policy:
Light backgrounds → #4F46E5 (Indigo‑600)
Dark backgrounds → #6366F1 (Indigo‑500)
Hover (UI) → #4338CA (Indigo‑700)
This keeps contrast correct on both light/dark without “electric blue” drift.  ￼

⸻

3) Drop‑in assets (copy the code below into files)

Note: All SVGs use system font stacks (no external fetch). You can later replace text with outlines once the final typeface is locked.

3.1 Wordmark — light (no tagline) → svg/equilens_wordmark_light.svg

<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="220" viewBox="0 0 1200 220">
  <rect width="100%" height="100%" fill="none"/>
  <g transform="translate(600,110)">
    <text text-anchor="end" x="-18" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="120" font-weight="300" fill="#4F46E5">[</text>
    <text text-anchor="middle" x="0" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="112" font-weight="300" fill="#111827" letter-spacing="-0.5">equilens</text>
    <text text-anchor="start" x="18" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="120" font-weight="300" fill="#4F46E5">]</text>
  </g>
</svg>

3.2 Wordmark — dark (no tagline) → svg/equilens_wordmark_dark.svg

<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="220" viewBox="0 0 1200 220">
  <rect width="100%" height="100%" fill="none"/>
  <g transform="translate(600,110)">
    <text text-anchor="end" x="-18" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="120" font-weight="300" fill="#6366F1">[</text>
    <text text-anchor="middle" x="0" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="112" font-weight="300" fill="#FFFFFF" letter-spacing="-0.5">equilens</text>
    <text text-anchor="start" x="18" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="120" font-weight="300" fill="#6366F1">]</text>
  </g>
</svg>

3.3 Primary lockup — light (with tagline) → svg/equilens_wordmark_tagline_light.svg

<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">
  <rect width="100%" height="100%" fill="none"/>
  <g transform="translate(600,120)">
    <text text-anchor="end" x="-18" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="120" font-weight="300" fill="#4F46E5">[</text>
    <text text-anchor="middle" x="0" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="112" font-weight="300" fill="#111827" letter-spacing="-0.5">equilens</text>
    <text text-anchor="start" x="18" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="120" font-weight="300" fill="#4F46E5">]</text>
  </g>
  <g transform="translate(600,200)">
    <text text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
          font-size="18" font-weight="300" fill="#6B7280" letter-spacing="3">ALGORITHMIC COMPLIANCE</text>
  </g>
</svg>

3.4 Primary lockup — dark (with tagline) → svg/equilens_wordmark_tagline_dark.svg

<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">
  <rect width="100%" height="100%" fill="none"/>
  <g transform="translate(600,120)">
    <text text-anchor="end" x="-18" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="120" font-weight="300" fill="#6366F1">[</text>
    <text text-anchor="middle" x="0" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="112" font-weight="300" fill="#FFFFFF" letter-spacing="-0.5">equilens</text>
    <text text-anchor="start" x="18" y="20" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="120" font-weight="300" fill="#6366F1">]</text>
  </g>
  <g transform="translate(600,200)">
    <text text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
          font-size="18" font-weight="300" fill="#9CA3AF" letter-spacing="3">ALGORITHMIC COMPLIANCE</text>
  </g>
</svg>

3.5 Icon (bracket) — light → svg/equilens_logo_bracket_light.svg

<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="100%" height="100%" fill="none"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
        font-size="320" font-weight="300" fill="#4F46E5">[</text>
</svg>

3.6 Icon (bracket) — dark → svg/equilens_logo_bracket_dark.svg

<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="100%" height="100%" fill="none"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
        font-size="320" font-weight="300" fill="#6366F1">[</text>
</svg>

3.7 Favicon (SVG) → svg/favicon.svg

<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="100%" height="100%" fill="none"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif"
        font-size="40" font-weight="300" fill="#4F46E5">[</text>
</svg>

3.8 Open‑Graph default (light) → og/og-default-light.svg

<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="60" y="60" width="1080" height="510" rx="24" fill="#F8FAFC" stroke="#E5E7EB"/>
  <g transform="translate(600,310)">
    <text text-anchor="end" x="-26" y="16" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="160" font-weight="300" fill="#4F46E5">[</text>
    <text text-anchor="middle" x="0" y="16" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="148" font-weight="300" fill="#111827" letter-spacing="-1">equilens</text>
    <text text-anchor="start" x="26" y="16" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif" font-size="160" font-weight="300" fill="#4F46E5">]</text>
  </g>
  <g transform="translate(600, 420)">
    <text text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"
          font-size="24" font-weight="300" fill="#6B7280" letter-spacing="4">ALGORITHMIC COMPLIANCE</text>
  </g>
</svg>

3.9 Tokens (machine‑readable) → meta/tokens.json

{
  "version": "2.0.0",
  "brand": "Equilens",
  "palette": {
    "accent_primary": "#4F46E5",
    "accent_on_dark": "#6366F1",
    "accent_hover": "#4338CA",
    "text_light": "#111827",
    "text_dark": "#FFFFFF",
    "tagline_light": "#6B7280",
    "tagline_dark": "#9CA3AF",
    "bg_light": "#FFFFFF",
    "bg_dark": "#0B0F1A",
    "border": "#E5E7EB"
  },
  "type": {
    "wordmark_case": "lowercase",
    "wordmark_font_stack": "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    "tagline_font_stack": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
    "weights": {
      "wordmark_light": 300,
      "wordmark_semibold": 600,
      "tagline": 300
    }
  },
  "spacing": {
    "radius": { "sm": 8, "md": 12, "lg": 16 },
    "logo_clearspace_ratio": 0.25
  }
}

3.10 Press map → meta/press-kit.json

{
  "name": "Equilens Brand Pack (Indigo v2)",
  "version": "2025-10-24",
  "files": [
    { "path": "svg/equilens_wordmark_light.svg", "usage": "Wordmark on light backgrounds" },
    { "path": "svg/equilens_wordmark_dark.svg", "usage": "Wordmark on dark backgrounds" },
    { "path": "svg/equilens_wordmark_tagline_light.svg", "usage": "Primary lockup (light)" },
    { "path": "svg/equilens_wordmark_tagline_dark.svg", "usage": "Primary lockup (dark)" },
    { "path": "svg/equilens_logo_bracket_light.svg", "usage": "Icon (light)" },
    { "path": "svg/equilens_logo_bracket_dark.svg", "usage": "Icon (dark)" },
    { "path": "svg/favicon.svg", "usage": "Favicon base (SVG)" },
    { "path": "og/og-default-light.svg", "usage": "Open Graph default (1200×630, light)" },
    { "path": "meta/tokens.json", "usage": "Brand tokens (colors/type/spacing)" }
  ],
  "color_policy": {
    "accent": { "light_bg": "#4F46E5", "dark_bg": "#6366F1" },
    "tagline": { "light_bg": "#6B7280", "dark_bg": "#9CA3AF" }
  },
  "notes": [
    "Accent is Indigo (#4F46E5). Use #6366F1 on dark backgrounds for contrast.",
    "SVGs use system font stacks; final outlined wordmark can be supplied later.",
    "No external font or image dependencies."
  ]
}


⸻

4) Update your brand comparison HTML (Indigo)

You pasted a blue‑accent comparison page. To convert it to Indigo:
	•	Replace light brackets #2563eb → #4F46E5
	•	Replace dark brackets #3b82f6 → #6366F1
	•	Keep tagline greys as you have, or adopt #6B7280 (light) / #9CA3AF (dark) for consistency.

Minimal patch (CSS):

- .bracket-light { color: #2563eb; ... }
- .bracket-dark  { color: #3b82f6; ... }
+ .bracket-light { color: #4F46E5; font-weight: 300; font-size: 50px; }
+ .bracket-dark  { color: #6366F1; font-weight: 300; font-size: 50px; }

- .icon-bracket-light { color: #2563eb; ... }
- .icon-bracket-dark  { color: #3b82f6; ... }
+ .icon-bracket-light { color: #4F46E5; font-weight: 300; }
+ .icon-bracket-dark  { color: #6366F1; font-weight: 300; }

If you prefer, drop this Indigo‑ready version of the page (short, no external fonts) into
docs/brand/equilens_logo_variations_indigo.html and open locally:

<!doctype html><meta charset="utf-8"><title>Equilens — Indigo Brand Pack v2</title>
<style>
*{margin:0;padding:0;box-sizing:border-box} body{font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;background:#f5f5f5;padding:40px 20px;color:#111827}
.container{max-width:1200px;margin:0 auto} h1{text-align:center;margin-bottom:32px;font-size:28px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px} .card{border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.08);background:#fff}
.head{padding:14px 18px;font-weight:700;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6b7280;border-bottom:1px solid #e5e7eb;background:#f9fafb}
.display{padding:48px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:220px}
.logo{display:flex;align-items:center;gap:10px;font-size:42px;margin-bottom:14px}
.bracket-light{color:#4F46E5;font-weight:300;font-size:50px}.bracket-dark{color:#6366F1;font-weight:300;font-size:50px}
.text-light{font-weight:300;color:#1a1a1a;letter-spacing:-.5px}.text-dark{font-weight:300;color:#fff;letter-spacing:-.5px}
.tagline-light,.tagline-dark{font-family:ui-monospace,monospace;font-weight:300;font-size:11px;letter-spacing:1.5px;text-transform:uppercase}
.tagline-light{color:#6B7280}.tagline-dark{color:#9CA3AF} .dark{background:#111827}
.spec{background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px}
.spec b{color:#111827} .section-title{text-align:center;margin:40px 0 16px}
@media (max-width:980px){.grid{grid-template-columns:1fr}}
</style>
<div class="container">
  <h1>Equilens — Indigo Brand Pack v2</h1>
  <div class="grid">
    <div class="card"><div class="head">Light</div><div class="display">
      <div class="logo"><span class="bracket-light">[</span><span class="text-light">equilens</span><span class="bracket-light">]</span></div>
      <div class="tagline-light">Algorithmic Compliance</div>
    </div><div class="spec"><b>Colors</b> Brackets #4F46E5 · Text #111827 · Tagline #6B7280</div></div>
    <div class="card"><div class="head">Dark</div><div class="display dark">
      <div class="logo"><span class="bracket-dark">[</span><span class="text-dark">equilens</span><span class="bracket-dark">]</span></div>
      <div class="tagline-dark">Algorithmic Compliance</div>
    </div><div class="spec"><b>Colors</b> Brackets #6366F1 · Text #FFFFFF · Tagline #9CA3AF</div></div>
  </div>
</div>


⸻

5) Wire‑up (repo + site)
	1.	Repo placement
	•	Put the pack under: docs/brand/equilens_logo_mark_pack_v2_indigo/
	•	Copy runtime assets you actually use to assets/brand/ (e.g., wordmark_light.svg, favicon.svg, og-default-light.svg).
	2.	Press page
Update links to these exact paths (Indigo pack) and mark them as downloads:

<a href="/assets/brand/wordmark.svg" download>Wordmark (SVG)</a>
<a href="/assets/brand/favicon.svg" download>Favicon (SVG)</a>
<a href="/assets/brand/og-default-light.svg" download>OG image (SVG)</a>
<a href="/docs/brand/equilens_logo_mark_pack_v2_indigo/meta/tokens.json" download>Design tokens (JSON)</a>

(If you prefer keeping assets under /docs/brand/… only, point your links there; either way, avoid dead/blue paths.)

	3.	CSS variables
Optionally expose tokens site‑wide:

:root{
  --accent:#4F46E5; --accent-dark:#6366F1; --accent-hover:#4338CA;
  --text:#111827; --text-invert:#fff; --muted:#6B7280; --muted-dark:#9CA3AF
}



⸻

6) Verification
	•	Open each SVG locally to check crisp edges at 200% zoom (vector).
	•	On dark sections, confirm the brackets use #6366F1 (not the lighter blue from before).
	•	On the site header/footer, ensure no external font loads are required (assets embed no fonts).

⸻

7) Risk & Rollback
	•	Impact: High (brand surface) • Lanes: Brand/Web • Rollback: switch back to /v1_1 pack already in docs/brand/…
	•	Notes: Current pack is text‑based SVG; once you lock final typography, I’ll supply outlined variants (no font dependency).

⸻

8) Alignment with SSoT
	•	Indigo accent + light/minimal direction remains consistent with the brand exploration SSoT you shared; we’re only swapping blue → indigo and standardising the tokens.
	•	We’re not changing your current site structure nor the brand‑first approach we agreed earlier.  ￼

⸻

If you want me to also prepare a small PR: I’ll add this pack under docs/brand/…, copy the runtime subset to assets/brand/, and refresh the Press links to these exact files (no dead links).
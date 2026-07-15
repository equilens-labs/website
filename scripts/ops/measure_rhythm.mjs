#!/usr/bin/env node
// Vertical-rhythm guard for the landing page.
// Measures rendered gaps between the structural text blocks and fails when
// they drift from the documented rhythm table (collapse-aware, 8px grid):
//   section h2 top-gap: identical across all panel-to-panel boundaries
//   h2 -> first content: 24px
//   intro paragraph -> group (grid): 40px
//   group -> CTA row: 40px
//   group -> note: 24px
//   panel top -> h2 == panel bottom -> last child (symmetry)
// Usage: node scripts/ops/measure_rhythm.mjs [baseUrl]   (default http://localhost:8000)

import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:8000';
const TOL = 1; // px tolerance

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(BASE + '/', { waitUntil: 'networkidle' });

const m = await p.evaluate(() => {
  const gaps = [];
  const els = document.querySelectorAll('main h2, main .section-block > p, main .section-block > .grid, main .section-block > .cta-row, main .section-block > .note, main .section-block > figure');
  let prev = null;
  els.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.height === 0) return;
    gaps.push({
      kind: el.tagName.toLowerCase() === 'figure' ? 'figure' : el.tagName.toLowerCase() + (el.classList.contains('note') ? '.note' : el.classList.contains('cta-row') ? '.cta-row' : el.classList.contains('grid') || el.classList.contains('hero-highlights') ? '.grid' : ''),
      gap: prev ? Math.round(r.top - prev.bottom) : null,
      prevKind: prev ? prev.kind : null,
      text: (el.textContent || '').trim().slice(0, 24).replace(/\s+/g, ' '),
    });
    prev = { bottom: r.bottom, kind: gaps[gaps.length - 1].kind };
  });
  const panels = [...document.querySelectorAll('.section-block')].map((blk, i) => {
    const h2 = blk.querySelector('h2');
    const r = blk.getBoundingClientRect();
    return h2 ? {
      i,
      topToH2: Math.round(h2.getBoundingClientRect().top - r.top),
      lastToBottom: Math.round(r.bottom - blk.lastElementChild.getBoundingClientRect().bottom),
    } : null;
  }).filter(Boolean);
  return { gaps, panels };
});
await b.close();

const errors = [];
const near = (a, b) => Math.abs(a - b) <= TOL;

// 1. All h2 top-gaps across panel boundaries identical (skip the first h2 after the hero).
const h2Gaps = m.gaps.filter(g => g.kind === 'h2' && g.gap !== null).map(g => g.gap);
const boundary = h2Gaps.slice(1);
if (boundary.length && !boundary.every(g => near(g, boundary[0]))) {
  errors.push(`section h2 top-gaps differ: ${h2Gaps.join(', ')}`);
}

// 2. Content gap rules.
const RULES = [
  { prev: 'h2', kind: '', expect: 24, label: 'h2 -> intro p' },
  { prev: 'h2', kind: '.grid', expect: 24, label: 'h2 -> grid' },
  { prev: '', kind: '.grid', expect: 40, label: 'intro -> grid' },
  { prev: '.grid', kind: '.cta-row', expect: 40, label: 'grid -> cta-row' },
  { prev: '.grid', kind: '.note', expect: 24, label: 'grid -> note' },
  { prev: '', kind: '.cta-row', expect: 40, label: 'intro -> cta-row' },
  { prev: '', kind: 'figure', expect: 40, label: 'intro -> figure' },
  { prev: 'figure', kind: '.grid', expect: 40, label: 'figure -> grid' },
];
for (const g of m.gaps) {
  if (g.gap === null) continue;
  const rule = RULES.find(r => r.prev === (g.prevKind === 'h2' ? 'h2' : g.prevKind || '') && r.kind === g.kind);
  if (rule && !near(g.gap, rule.expect)) {
    errors.push(`${rule.label} = ${g.gap}px (expected ${rule.expect}) at "${g.text}"`);
  }
}

// 3. Panel symmetry.
for (const pl of m.panels) {
  if (!near(pl.topToH2, pl.lastToBottom)) {
    errors.push(`panel ${pl.i} asymmetric: top->h2 ${pl.topToH2}px vs last->bottom ${pl.lastToBottom}px`);
  }
}
const tops = m.panels.map(pl => pl.topToH2);
if (!tops.every(t => near(t, tops[0]))) {
  errors.push(`panel top paddings differ: ${tops.join(', ')}`);
}

console.log('Measured gaps:');
for (const g of m.gaps) console.log(`  ${(g.prevKind || 'start').padEnd(10)} -> ${g.kind.padEnd(10)} ${String(g.gap ?? '-').padStart(4)}px  ${g.text}`);
console.log('Panels (top->h2 | last->bottom): ' + m.panels.map(pl => `${pl.topToH2}|${pl.lastToBottom}`).join('  '));

if (errors.length) {
  console.error('\n[FAIL] Rhythm drift:\n  - ' + errors.join('\n  - '));
  process.exit(1);
}
console.log('\n[OK] Landing rhythm matches the table');

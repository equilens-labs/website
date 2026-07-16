#!/usr/bin/env python3
"""Bake the primary nav statically into every deployed page.

Reads config/web/nav.json (same SSoT as assets/eql/nav.js) and renders the
exact markup nav.js builds, plus a data-sync="nav" marker so re-syncs are
idempotent. Pages keep the nav.js include: the script now detects the baked
nav, skips the fetch/render, and only wires up nav behaviour.
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
NAV_SSOT = ROOT / "config/web/nav.json"
TEMPLATE_DIR = ROOT / "templates"
BRAND_DIR = ROOT / "brand"

nav = json.loads(NAV_SSOT.read_text())

PLACEHOLDER = '<div id="nav-placeholder"></div>'
RENDERED_RE = re.compile(
    r'<nav class="navbar site-nav" data-sync="nav"[\s\S]*?</nav>', re.I
)


def page_path(page: pathlib.Path) -> str:
    """URL path the page is served at (mirrors window.location.pathname)."""
    rel = page.relative_to(ROOT)
    if rel.name == 'index.html':
        parts = rel.parts[:-1]
        return '/' + ('/'.join(parts) + '/' if parts else '')
    return '/' + '/'.join(rel.parts)


def is_current(link_href: str, current: str) -> bool:
    """Active-link test; mirrors initNavFeatures() in assets/eql/nav.js."""
    if link_href == current:
        return True
    return current != '/' and link_href != '/' and current.startswith(link_href)


def render(current: str) -> str:
    brand = nav['brand']
    brand_compact_img = brand.get('imgCompact') or '/brand/symbol/equilens-symbol-nav.svg'
    nav_links = ''.join(
        '<a href="{href}" class="nav-link"{aria}>{label}</a>'.format(
            href=link['href'],
            aria=' aria-current="page"' if is_current(link['href'], current) else '',
            label=link['label'],
        )
        for link in nav['links']
    )
    return f'''<nav class="navbar site-nav" data-sync="nav" role="navigation" aria-label="Primary">
  <div class="navbar-content">
    <a href="{brand["href"]}" class="logo" aria-label="Equilens home">
      <img class="logo-wordmark" src="{brand["img"]}" alt="{brand["alt"]}" width="196" height="39">
      <img class="logo-symbol" src="{brand_compact_img}" alt="" width="64" height="64" aria-hidden="true">
    </a>
    <button class="nav-toggle btn btn-secondary btn--small" aria-controls="nav-links" aria-expanded="false">Menu</button>
    <div id="nav-links" class="nav-links" data-open="false">
      {nav_links}
    </div>
  </div>
</nav>'''


for page in sorted(ROOT.rglob('*.html')):
    if page.is_relative_to(TEMPLATE_DIR) or page.is_relative_to(BRAND_DIR):
        continue
    # Skip third-party or tool HTML trees, plus evidence snapshots and deploy
    # artifacts: files under output/ are committed evidence and must never be
    # rewritten; tasks/ holds working notes, not deployed pages.
    if any(seg in page.parts for seg in ('vendor', 'node_modules', 'output', 'dist', 'tasks')):
        continue
    s = page.read_text(encoding='utf-8')
    block = render(page_path(page))
    if PLACEHOLDER in s:
        s = s.replace(PLACEHOLDER, block, 1)
    elif RENDERED_RE.search(s):
        s = RENDERED_RE.sub(lambda _match: block, s, count=1)
    else:
        # Redirect stubs and other pages without a primary nav.
        continue
    page.write_text(s, encoding='utf-8')
    print('[nav] synced', page)

print('Nav synced.')

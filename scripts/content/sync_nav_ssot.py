#!/usr/bin/env python3
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
NAV_SSOT = ROOT / "config/web/nav.json"
PARTIAL_PATH = ROOT / "templates/header.html"
TEMPLATE_DIR = ROOT / "templates"
BRAND_DIR = ROOT / "brand"

nav = json.loads(NAV_SSOT.read_text())
partial = PARTIAL_PATH.read_text()

def depth(p: pathlib.Path) -> str:
    parts = p.relative_to(ROOT).parts
    return '' if len(parts) <= 1 else '../' * (len(parts)-1)

def make_href(href: str, d: str) -> str:
    if href.startswith('http'):
        return href
    if href.startswith('/'):
        return href
    return d + href

def render(d: str) -> str:
    html = partial
    # Build brand-first links for the new navbar container
    anchors = ''.join([f'<a href="{make_href(l["href"], d)}" class="nav-link">{l["label"]}</a>' for l in nav['links']])
    html = html.replace('<!--NAV_LINKS-->', anchors)
    return html

HEADER_BLOCKS = {}
for page in ROOT.rglob('*.html'):
    if page.is_relative_to(TEMPLATE_DIR) or page.is_relative_to(BRAND_DIR):
        continue
    if any(seg in page.parts for seg in ('vendor',)):
        continue
    if page.name in {'header.html', 'footer.html'} and 'partials' in page.parts:
        continue
    d = depth(page)
    HEADER_BLOCKS[page] = render(d)

for page, block in HEADER_BLOCKS.items():
    s = page.read_text(encoding='utf-8')
    # Ensure body has class="eql"
    s = re.sub(r'<body(?![^>]*\bclass=)', '<body class="eql"', s, count=1)
    s = re.sub(r'<body([^>]*class=\")([^\"]*)\"', lambda m: f"<body{m.group(1)}{'eql ' if 'eql' not in m.group(2) else ''}{m.group(2)}\"", s, count=1)
    # Replace first header or existing navbar block
    if re.search(r"<header[\s\S]*?</header>", s, flags=re.I):
        s = re.sub(r"<header[\s\S]*?</header>", block, s, count=1, flags=re.I)
    else:
        s = re.sub(r"<nav class=\"navbar\"[\s\S]*?</nav>", block, s, count=1)
    page.write_text(s, encoding='utf-8')
    print('[nav] synced', page)

print('Nav synced.')

#!/usr/bin/env python3
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
nav = json.loads((ROOT/"docs/web/nav.json").read_text())
partial = (ROOT/"docs/web/partials/header.html").read_text()

def depth(p: pathlib.Path) -> str:
    parts = p.relative_to(ROOT).parts
    return '' if len(parts) <= 1 else '../' * (len(parts)-1)

def make_href(href: str, d: str) -> str:
    # Convert absolute hrefs ("/foo/") to depth-aware paths
    return href if href.startswith('http') else (d + href.lstrip('/'))

def render(d: str) -> str:
    html = partial
    html = html.replace('{{brand.href}}', make_href(nav['brand']['href'], d))
    html = html.replace('{{brand.img}}', make_href(nav['brand']['img'], d))
    html = html.replace('{{brand.alt}}', nav['brand'].get('alt',''))
    html = html.replace('{{depth}}', d)
    # expand links
    links_html = ''.join([f'<li><a href="{make_href(l["href"], d)}">{l["label"]}</a></li>' for l in nav['links']])
    html = html.replace('{{#each links}}', '').replace('{{/each}}', '')
    html = re.sub(r'<ul>.*</ul>', f'<ul>{links_html}</ul>', html, count=1, flags=re.S)
    return html

HEADER_BLOCKS = {}
for page in ROOT.rglob('*.html'):
    if any(seg in page.parts for seg in ('vendor','template')):
        continue
    d = depth(page)
    HEADER_BLOCKS[page] = render(d)

for page, block in HEADER_BLOCKS.items():
    s = page.read_text(encoding='utf-8')
    # Ensure body has class="eql"
    s = re.sub(r'<body(?![^>]*\bclass=)', '<body class="eql"', s, count=1)
    s = re.sub(r'<body([^>]*class=\")([^\"]*)\"', lambda m: f"<body{m.group(1)}{'eql ' if 'eql' not in m.group(2) else ''}{m.group(2)}\"", s, count=1)
    # Replace first header
    s = re.sub(r"<header[\s\S]*?</header>", block, s, count=1, flags=re.I)
    page.write_text(s, encoding='utf-8')
    print('[nav] synced', page)

print('Nav synced.')


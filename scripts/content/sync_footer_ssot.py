#!/usr/bin/env python3
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
FOOTER_SSOT = ROOT / "config/web/footer.json"
PARTIAL_PATH = ROOT / "templates/footer.html"
TEMPLATE_DIR = ROOT / "templates"
BRAND_DIR = ROOT / "brand"

footer = json.loads(FOOTER_SSOT.read_text())
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
    column_html = []
    for col in footer['columns']:
        links = ''.join([f'<li><a href="{make_href(l["href"], d)}">{l["label"]}</a></li>' for l in col['links']])
        column_html.append(f'<section><h3>{col["title"]}</h3><ul>{links}</ul></section>')
    html = html.replace('<!--FOOTER_COLUMNS-->', '\n'.join(column_html))
    html = html.replace('{{note}}', footer.get('note',''))
    return html

for page in ROOT.rglob('*.html'):
    if page.is_relative_to(TEMPLATE_DIR) or page.is_relative_to(BRAND_DIR):
        continue
    if any(seg in page.parts for seg in ('vendor',)):
        continue
    d = depth(page)
    block = render(d)
    s = page.read_text(encoding='utf-8')
    s = re.sub(r"<footer[\s\S]*?</footer>", block, s, count=1, flags=re.I)
    page.write_text(s, encoding='utf-8')
    print('[footer] synced', page)

print('Footer synced.')

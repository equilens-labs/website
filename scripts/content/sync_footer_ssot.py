#!/usr/bin/env python3
import datetime
import json
import pathlib
import re

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

def render_link(link: dict, d: str) -> str:
    attrs = [f'href="{make_href(link["href"], d)}"']
    if link.get('external'):
        attrs.append('target="_blank"')
        attrs.append('rel="noopener noreferrer"')
    return f'      <li><a {" ".join(attrs)}>{link["label"]}</a></li>'

def render(d: str) -> str:
    html = partial
    column_html = []
    for col in footer['columns']:
        links = '\n'.join(
            [render_link(link, d) for link in col['links']]
        )
        column_html.append(f'    <section><h3>{col["title"]}</h3><ul>\n{links}\n    </ul></section>')
    html = html.replace('<!--FOOTER_COLUMNS-->', '\n'.join(column_html))
    # Trademark toggle: "tm" or "registered"
    tm_status = footer.get('brand', {}).get('trademark_status', 'tm')
    tm_symbol = '™' if tm_status == 'tm' else '®'
    tm_text = 'trade mark' if tm_status == 'tm' else 'registered trade mark'
    note = footer.get('note', '').format(
        year=datetime.date.today().year,
        deploy_note='stamped during publishing',
        tm_symbol=tm_symbol,
        tm_text=tm_text
    )
    html = html.replace('{{note}}', note)
    # Product-boundary disclaimer (claims-register mandatory block), site-wide.
    html = html.replace('{{boundary}}', footer.get('boundary_note', ''))
    return html

for page in ROOT.rglob('*.html'):
    if page.is_relative_to(TEMPLATE_DIR) or page.is_relative_to(BRAND_DIR):
        continue
    # Skip third-party or tool HTML trees, plus evidence snapshots and deploy artifacts:
    # files under output/ are committed evidence and must never be rewritten.
    if any(seg in page.parts for seg in ('vendor', 'node_modules', 'output', 'dist')):
        continue
    d = depth(page)
    block = render(d)
    s = page.read_text(encoding='utf-8')
    s = re.sub(r"<footer[\s\S]*?</footer>", block, s, count=1, flags=re.I)
    page.write_text(s, encoding='utf-8')
    print('[footer] synced', page)

print('Footer synced.')

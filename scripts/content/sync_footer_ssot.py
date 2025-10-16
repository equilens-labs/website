#!/usr/bin/env python3
import json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
footer = json.loads((ROOT/"docs/web/footer.json").read_text())
partial = (ROOT/"docs/web/partials/footer.html").read_text()

def depth(p: pathlib.Path) -> str:
    parts = p.relative_to(ROOT).parts
    return '' if len(parts) <= 1 else '../' * (len(parts)-1)

def make_href(href: str, d: str) -> str:
    return href if href.startswith('http') else (d + href.lstrip('/'))

def render(d: str) -> str:
    html = partial
    # expand columns
    cols_html = []
    for col in footer['columns']:
        links = ''.join([f'<li><a href="{make_href(l["href"], d)}">{l["label"]}</a></li>' for l in col['links']])
        cols_html.append(f'<section><h3>{col["title"]}</h3><ul>{links}</ul></section>')
    html = html.replace('{{#each columns}}', '').replace('{{/each}}', '')
    html = re.sub(r'<div class=\"container grid\">[\s\S]*?</div>', f'<div class="container grid">\n' + '\n'.join(cols_html) + '\n</div>', html, count=1)
    html = html.replace('{{note}}', footer.get('note',''))
    return html

for page in ROOT.rglob('*.html'):
    if any(seg in page.parts for seg in ('vendor','template')):
        continue
    d = depth(page)
    block = render(d)
    s = page.read_text(encoding='utf-8')
    s = re.sub(r"<footer[\s\S]*?</footer>", block, s, count=1, flags=re.I)
    page.write_text(s, encoding='utf-8')
    print('[footer] synced', page)

print('Footer synced.')


#!/usr/bin/env python3
import datetime
import json
import pathlib
import re
import subprocess

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

def git_info():
    def run(cmd):
        try:
            return subprocess.check_output(cmd, cwd=ROOT).decode().strip()
        except (subprocess.CalledProcessError, FileNotFoundError):
            return ''

    commit = run(['git', 'rev-parse', '--short', 'HEAD']) or 'unknown'
    commit_date_iso = run(['git', 'show', '-s', '--format=%cI', 'HEAD'])
    if commit_date_iso:
        try:
            deploy_date = datetime.datetime.fromisoformat(commit_date_iso).date()
        except ValueError:
            deploy_date = datetime.date.today()
    else:
        deploy_date = datetime.date.today()
    return commit, deploy_date.isoformat()

def render(d: str) -> str:
    html = partial
    column_html = []
    for col in footer['columns']:
        links = '\n'.join(
            [f'      <li><a href="{make_href(link["href"], d)}">{link["label"]}</a></li>' for link in col['links']]
        )
        column_html.append(f'    <section><h3>{col["title"]}</h3><ul>\n{links}\n    </ul></section>')
    html = html.replace('<!--FOOTER_COLUMNS-->', '\n'.join(column_html))
    commit, deploy_date = git_info()
    note = footer.get('note', '').format(
        year=datetime.date.today().year,
        commit=commit,
        deploy_date=deploy_date
    )
    html = html.replace('{{note}}', note)
    return html

for page in ROOT.rglob('*.html'):
    if page.is_relative_to(TEMPLATE_DIR) or page.is_relative_to(BRAND_DIR):
        continue
    # Skip third-party or tool HTML trees
    if any(seg in page.parts for seg in ('vendor', 'node_modules')):
        continue
    d = depth(page)
    block = render(d)
    s = page.read_text(encoding='utf-8')
    s = re.sub(r"<footer[\s\S]*?</footer>", block, s, count=1, flags=re.I)
    page.write_text(s, encoding='utf-8')
    print('[footer] synced', page)

print('Footer synced.')

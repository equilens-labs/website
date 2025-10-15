#!/usr/bin/env python3
import pathlib, re

root = pathlib.Path('.')

def depth_prefix(p: pathlib.Path) -> str:
    parts = p.relative_to(root).parts
    return '' if len(parts) <= 1 else '../' * (len(parts)-1)

THEME_HEAD = (
    '<link rel="preload" href="{D}themes/appline/style.css" as="style">\n'
    '<link rel="stylesheet" href="{D}themes/appline/style.css">\n'
    '<link rel="stylesheet" href="{D}assets/brand/overrides.css">\n'
)

CSP_META = (
    '<meta http-equiv="Content-Security-Policy" '
    'content="default-src \'self\'; img-src \'self\' data:; style-src \'self\'; script-src \'self\'; connect-src \'self\'; base-uri none; form-action none">'
)

for html in root.rglob('*.html'):
    s = html.read_text(encoding='utf-8')
    D = depth_prefix(html)
    # Inject theme links before </head> if not present
    if 'themes/appline/style.css' not in s:
        s = re.sub(r'</head>', THEME_HEAD.replace('{D}', D) + '</head>', s, count=1, flags=re.I)
    # Replace any existing CSP meta with stricter one
    s = re.sub(r'<meta[^>]+http-equiv=["\']Content-Security-Policy["\'][^>]*>', CSP_META, s, flags=re.I)
    html.write_text(s, encoding='utf-8')
    print('[head] updated', html)


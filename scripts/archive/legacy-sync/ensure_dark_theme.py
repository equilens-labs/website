#!/usr/bin/env python3
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]

def fix_file(p: pathlib.Path) -> bool:
    s = p.read_text(encoding='utf-8')
    orig = s
    # 1) Remove appline theme CSS includes
    s = re.sub(r'\n\s*<link[^>]+href="[^"]*themes/appline/style.css"[^>]*>','', s)
    s = re.sub(r'\n\s*<link[^>]+rel="preload"[^>]+href="[^"]*themes/appline/style.css"[^>]*>','', s)
    # 2) Ensure overrides + base are present (do not duplicate)
    if 'assets/brand/overrides.css' not in s:
        s = s.replace('</head>', '\n<link rel="stylesheet" href="/assets/brand/overrides.css">\n</head>')
    if 'assets/base.css' not in s:
        s = s.replace('</head>', '\n<link rel="stylesheet" href="/assets/base.css">\n</head>')
    # 3) Ensure site-wide dark theme is included
    if 'assets/eql/site-dark.css' not in s:
        s = re.sub(r'(assets/base.css"[^>]*>\s*)', r'\1\n<link rel="stylesheet" href="/assets/eql/site-dark.css">\n', s, count=1)
        if 'assets/eql/site-dark.css' not in s:
            s = s.replace('</head>', '\n<link rel="stylesheet" href="/assets/eql/site-dark.css">\n</head>')
    # 4) Ensure body has class eql (preserve others)
    if re.search(r'<body(?![^>]*\bclass=)', s):
        s = s.replace('<body', '<body class="eql"', 1)
    else:
        s = re.sub(r'<body([^>]*class=")([^"]*)"', lambda m: f'<body{m.group(1)}' + ('eql ' if 'eql' not in m.group(2) else '') + f'{m.group(2)}"', s, count=1)
    if s != orig:
        p.write_text(s, encoding='utf-8')
        print('[fixed]', p)
        return True
    return False

def main():
    updated = 0
    for p in ROOT.rglob('*.html'):
        if any(seg in p.parts for seg in ('vendor','template','dist','output')):
            continue
        if p.name in ('header.html','footer.html') and 'docs' in p.parts:
            continue
        try:
            if fix_file(p):
                updated += 1
        except Exception as e:
            print('[warn] could not fix', p, e)
    print('Updated', updated, 'files')

if __name__ == '__main__':
    main()


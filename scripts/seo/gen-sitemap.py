#!/usr/bin/env python3
"""Generate sitemap.xml from site structure using CNAME as canonical domain."""
from __future__ import annotations

import datetime
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
CNAME = ROOT / "CNAME"

if not CNAME.exists():
    raise SystemExit("CNAME file is required to generate sitemap")

domain = CNAME.read_text(encoding="utf-8").strip()
if not domain:
    raise SystemExit("CNAME is empty; cannot build sitemap")

base_url = f"https://{domain}"
today = datetime.date.today().isoformat()

urls: list[str] = []
for html_file in sorted(ROOT.rglob("index.html")):
    rel = html_file.parent.relative_to(ROOT)
    if rel == pathlib.Path('.'):
        path = '/'
    else:
        path = f"/{rel.as_posix().rstrip('/')}/"
    urls.append(
        "    <url>\n"
        f"      <loc>{base_url}{path}</loc>\n"
        f"      <lastmod>{today}</lastmod>\n"
        "    </url>"
    )

sitemap = "\n".join([
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
    "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    *urls,
    "</urlset>",
])

(ROOT / "sitemap.xml").write_text(sitemap + "\n", encoding="utf-8")
print(f"[OK] sitemap.xml with {len(urls)} URLs @ {base_url}")

#!/usr/bin/env python3
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
CONFIG = ROOT / "config/web/flbsa_subnav.json"
TEMPLATE = ROOT / "templates/flbsa_subnav.html"
FLBSA_DIR = ROOT / "fl-bsa"


def load_links():
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    return cfg.get("links", [])


def page_url(page: pathlib.Path) -> str:
    rel = page.relative_to(ROOT)
    parts = rel.parts
    if parts[-1].lower() == "index.html":
        url = "/" + "/".join(parts[:-1]) + "/"
    else:
        url = "/" + "/".join(parts)
    url = url.replace("//", "/")
    return url


def build_subnav_html(links, current_url: str) -> str:
    template = TEMPLATE.read_text(encoding="utf-8")
    link_markup = []
    for link in links:
        href = link["href"]
        # Do not set aria-current in static markup; JS will manage state
        attrs = ['class="subnav-link"', f'href="{href}"']
        link_markup.append(f'      <a {" ".join(attrs)}>{link["label"]}</a>')
    block = "\n".join(link_markup)
    return template.replace("<!--FLBSA_LINKS-->", block)


def replace_subnav(content: str, block: str) -> str:
    pattern = r'<nav class="product-subnav"[\s\S]*?</nav>\s*'
    if re.search(pattern, content):
        return re.sub(pattern, block + "\n", content, count=1)
    injection_point = '</nav>\n  <script src="/assets/eql/nav.js" defer></script>\n'
    if injection_point in content:
        return content.replace(injection_point, injection_point + "\n" + block + "\n", 1)
    raise ValueError("Could not locate insertion point for FL-BSA subnav.")


def main():
    links = load_links()
    for page in FLBSA_DIR.rglob("*.html"):
        if page.is_dir():
            continue
        if "vendor" in page.parts or "templates" in page.parts:
            continue
        html = page.read_text(encoding="utf-8")
        block = build_subnav_html(links, page_url(page))
        try:
            updated = replace_subnav(html, block)
        except ValueError:
            print("[flbsa_subnav] skipped", page)
            continue
        page.write_text(updated, encoding="utf-8")
        print("[flbsa_subnav] synced", page)


if __name__ == "__main__":
    main()

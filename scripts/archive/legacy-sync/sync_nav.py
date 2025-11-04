#!/usr/bin/env python3
"""Synchronise site navigation to use FL-BSA primary link."""

from __future__ import annotations

import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
SKIP_DIRS = {"output", "ops"}
HEADER_PATTERN = re.compile(r"<header class=\"site-header\">.*?</header>", re.S)

HEADER_TEMPLATE = """<header class=\"site-header\">\n  <div class=\"wrap\">\n    <a class=\"brand\" href=\"{home_href}\">\n      <img class=\"brand-logo\" src=\"{asset_prefix}assets/brand/logo-mark.svg\" srcset=\"{asset_prefix}assets/brand/logo-mark.png 1x, {asset_prefix}assets/brand/logo-mark@128.png 4x\" width=\"32\" height=\"32\" alt=\"\">\n      <span class=\"brand-name\">Equilens</span>\n      <span class=\"brand-pill\" aria-label=\"product line\">FL-BSA</span>\n    </a>\n    <button class=\"menu-toggle\" type=\"button\" aria-label=\"Toggle menu\" aria-expanded=\"false\" aria-controls=\"primary-nav\">\n      <svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" aria-hidden=\"true\">\n        <line x1=\"3\" y1=\"12\" x2=\"21\" y2=\"12\"></line>\n        <line x1=\"3\" y1=\"6\" x2=\"21\" y2=\"6\"></line>\n        <line x1=\"3\" y1=\"18\" x2=\"21\" y2=\"18\"></line>\n      </svg>\n    </button>\n    <nav class=\"site-nav\" aria-label=\"Primary\" id=\"primary-nav\">\n      <a href=\"{home_href}\"{home_current}>Home</a>\n      <a href=\"{product_href}\"{product_current}>FL-BSA</a>\n      <a href=\"{trust_href}\"{trust_current}>Trust Center</a>\n      <a href=\"{pricing_href}\"{pricing_current}>Pricing</a>\n      <a href=\"{contact_href}\"{contact_current}>Contact</a>\n      <a href=\"{legal_href}\"{legal_current}>Legal</a>\n    </nav>\n  </div>\n</header>"""


def depth_prefix(path: pathlib.Path) -> str:
    rel = path.relative_to(ROOT)
    depth = len(rel.parts) - 1
    if depth <= 0:
        return "./"
    return "../" * depth


def current_slug(path: pathlib.Path) -> str | None:
    rel = path.relative_to(ROOT)
    parts = rel.parts
    if rel == pathlib.Path("index.html"):
        return "home"
    if parts[0] == "fl-bsa":
        return "product"
    if parts[0] == "trust-center":
        return "trust"
    if parts[0] == "pricing":
        return "pricing"
    if parts[0] == "contact":
        return "contact"
    if parts[0] == "legal":
        return "legal"
    return None


def should_skip(path: pathlib.Path) -> bool:
    rel = path.relative_to(ROOT)
    return any(part in SKIP_DIRS for part in rel.parts)


def build_header(path: pathlib.Path) -> str:
    prefix = depth_prefix(path)
    asset_prefix = prefix
    current = current_slug(path)
    def attr(slug: str) -> str:
        return " aria-current=\"page\"" if current == slug else ""
    return HEADER_TEMPLATE.format(
        home_href=prefix,
        home_current=attr("home"),
        asset_prefix=asset_prefix,
        product_href=f"{prefix}fl-bsa/",
        product_current=attr("product"),
        trust_href=f"{prefix}trust-center/",
        trust_current=attr("trust"),
        pricing_href=f"{prefix}pricing/",
        pricing_current=attr("pricing"),
        contact_href=f"{prefix}contact/",
        contact_current=attr("contact"),
        legal_href=f"{prefix}legal/",
        legal_current=attr("legal"),
    )


def sync_file(path: pathlib.Path) -> bool:
    content = path.read_text(encoding="utf-8")
    new_header = build_header(path)
    new_content, count = HEADER_PATTERN.subn(new_header, content)
    if count:
        path.write_text(new_content, encoding="utf-8")
        print(f"[OK] header updated: {path.relative_to(ROOT)}")
        return True
    return False


def main() -> None:
    updated = 0
    for html in ROOT.rglob("*.html"):
        if should_skip(html):
            continue
        if sync_file(html):
            updated += 1
    print(f"Done. Updated {updated} file(s).")


if __name__ == "__main__":
    main()

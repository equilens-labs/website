#!/usr/bin/env python3
"""Render HTML to plain body text for claims linting.

Entities are decoded and tags dropped, so wording tripwires fire on what a
reader actually sees (catching `audit&#8209;ready` and markup-split forms like
`regulator-</span>approved`). Content of <head>, <script>, <style>,
<template>, <noscript>, and <svg> is excluded: titles/meta keep their own
exemptions in content_lint, and code is not prose.

Usage: normalize_html_text.py SRC_DIR OUT_DIR
Writes one .txt per .html, mirroring the source tree.
"""
import pathlib
import sys
from html.parser import HTMLParser

SKIP_TAGS = {"script", "style", "template", "head", "noscript", "svg"}


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in SKIP_TAGS:
            self.skip_depth += 1

    def handle_endtag(self, tag):
        if tag in SKIP_TAGS and self.skip_depth:
            self.skip_depth -= 1

    def handle_data(self, data):
        if not self.skip_depth:
            self.parts.append(data)


def extract_text(html: str) -> str:
    parser = TextExtractor()
    parser.feed(html)
    parser.close()
    text = "".join(parser.parts)
    lines = (line.strip() for line in text.splitlines())
    return "\n".join(line for line in lines if line)


def main(src_root: str, out_root: str) -> None:
    src = pathlib.Path(src_root)
    out = pathlib.Path(out_root)
    count = 0
    for html_file in sorted(src.rglob("*.html")):
        rel = html_file.relative_to(src)
        dest = (out / rel).with_suffix(".txt")
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(extract_text(html_file.read_text(encoding="utf-8")) + "\n", encoding="utf-8")
        count += 1
    if count == 0:
        raise SystemExit(f"[FAIL] no .html files under {src}")
    print(f"[OK] normalized {count} HTML files -> {out}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])

#!/usr/bin/env python3
"""Normalize public HTML text and metadata so claims lint sees encoded wording."""

import pathlib
import sys
from html.parser import HTMLParser

SKIP_TAGS = {"script", "style", "template", "noscript", "svg"}


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag == "meta":
            content = dict(attrs).get("content")
            if content:
                # Search and social metadata are public claims surfaces even
                # though they are not visible in the rendered body.
                self.parts.extend(("\n", content, "\n"))
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
    lines = (line.strip() for line in "".join(parser.parts).splitlines())
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
        raise SystemExit("usage: normalize_html_text.py SRC_DIR OUT_DIR")
    main(sys.argv[1], sys.argv[2])

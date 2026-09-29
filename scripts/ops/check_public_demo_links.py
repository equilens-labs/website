#!/usr/bin/env python3
"""Enforce the approved public-demo release split in deployable HTML."""

from __future__ import annotations

import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


BASE = "https://github.com/equilens-labs/fl-bsa-pub/releases"
RC9 = "v5.0.0-rc9-public-fix-2724455"

EXPECTED_COUNTS = {
    f"{BASE}/download/v5.0.8/customer_report.pdf": 7,
    f"{BASE}/download/{RC9}/whitepaper.pdf": 2,
    f"{BASE}/download/{RC9}/WhitePaper_Intake_Bundle_v4.zip": 2,
    f"{BASE}/download/{RC9}/SHA256SUMS.txt": 2,
    f"{BASE}/download/{RC9}/manifest.json": 2,
    f"{BASE}/tag/{RC9}": 2,
}

FORBIDDEN = (
    f"{BASE}/download/v5.0.8/gold_bundle.zip",
    f"{BASE}/download/{RC9}/customer_report.pdf",
    f"{BASE}/download/{RC9}/gold_bundle.zip",
    f"{BASE}/latest/",
)


class HrefCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.hrefs: list[str] = []

    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.hrefs.extend(value for name, value in attrs if name == "href" and value is not None)


def main() -> int:
    deploy_root = Path(sys.argv[1] if len(sys.argv) > 1 else "dist")
    html_files = sorted(deploy_root.rglob("*.html"))
    if not html_files:
        print(f"[FAIL] no deployed HTML found under {deploy_root}", file=sys.stderr)
        return 1

    collector = HrefCollector()
    for path in html_files:
        collector.feed(path.read_text(encoding="utf-8"))
    href_counts = Counter(collector.hrefs)
    failures: list[str] = []

    for url, expected in EXPECTED_COUNTS.items():
        actual = href_counts[url]
        if actual != expected:
            failures.append(f"expected {expected} occurrence(s), found {actual}: {url}")

    for url_fragment in FORBIDDEN:
        actual = sum(count for href, count in href_counts.items() if url_fragment in href)
        if actual:
            failures.append(f"expected 0 occurrences, found {actual}: {url_fragment}")

    if failures:
        for failure in failures:
            print(f"[FAIL] {failure}", file=sys.stderr)
        return 1

    print(f"[OK] public-demo link contract checked in {len(html_files)} deployed HTML files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

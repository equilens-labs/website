#!/usr/bin/env python3
"""Enforce the approved public-demo release split in deployable HTML."""

from __future__ import annotations

import hashlib
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


BASE = "https://github.com/equilens-labs/fl-bsa-pub/releases"
LEGACY_RC9 = "v5.0.0-rc9-public-fix-2724455"
TECHNICAL_WHITEPAPER_TAG = "v5.0.8-technical-whitepaper-20260930"
EXPECTED_PREVIEW_SHA256 = (
    "bf1ce45299b4f9659f25c34e9413b2b6e96e4ec42751e088ddc4f970996560b1"
)
REPORT_URL = f"{BASE}/download/v5.0.8-report-fix-20260929/customer_report.pdf"
REPORT_COUNTS_BY_PAGE = {
    "index.html": 2,
    "fl-bsa/index.html": 3,
    "fl-bsa/evidence/index.html": 1,
    "procurement/index.html": 1,
}

EXPECTED_COUNTS = {
    REPORT_URL: sum(REPORT_COUNTS_BY_PAGE.values()),
    f"{BASE}/download/{TECHNICAL_WHITEPAPER_TAG}/whitepaper.pdf": 2,
    f"{BASE}/download/{TECHNICAL_WHITEPAPER_TAG}/fl-bsa-v5.0.8-technical-companion.zip": 2,
    f"{BASE}/download/{TECHNICAL_WHITEPAPER_TAG}/SHA256SUMS.txt": 2,
    f"{BASE}/download/{TECHNICAL_WHITEPAPER_TAG}/whitepaper_release.json": 2,
    f"{BASE}/tag/{TECHNICAL_WHITEPAPER_TAG}": 2,
}

FORBIDDEN = (
    f"{BASE}/download/v5.0.8/customer_report.pdf",
    f"{BASE}/download/{LEGACY_RC9}/customer_report.pdf",
    LEGACY_RC9,
    "gold_bundle.zip",
    f"{BASE}/latest",
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

    preview_path = deploy_root / "brand/product/report-screening.png"
    if not preview_path.is_file():
        print(f"[FAIL] report preview missing: {preview_path}", file=sys.stderr)
        return 1
    preview_sha256 = hashlib.sha256(preview_path.read_bytes()).hexdigest()
    if preview_sha256 != EXPECTED_PREVIEW_SHA256:
        print(
            f"[FAIL] report preview SHA-256 {preview_sha256}; "
            f"expected {EXPECTED_PREVIEW_SHA256}",
            file=sys.stderr,
        )
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

    for relative_path, expected in REPORT_COUNTS_BY_PAGE.items():
        page_path = deploy_root / relative_path
        page_collector = HrefCollector()
        page_collector.feed(page_path.read_text(encoding="utf-8"))
        actual = Counter(page_collector.hrefs)[REPORT_URL]
        if actual != expected:
            failures.append(
                f"expected {expected} report link(s), found {actual}: {relative_path}"
            )

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

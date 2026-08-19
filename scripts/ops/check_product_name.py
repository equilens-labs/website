#!/usr/bin/env python3
"""Product-name consistency gate.

Rule: in prose (<p>, <li>, <figcaption>, <td>, <dd>) the product name FL-BSA
must always be wrapped in <span class="product-name">FL-BSA</span> so it
renders with one consistent treatment. Headings, buttons, links, nav, meta,
JSON-LD, and <code> are exempt and stay plain by rule.

Usage:
  check_product_name.py          # report violations, exit 1 if any
  check_product_name.py --fix    # wrap unwrapped occurrences in place
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
FIX = "--fix" in sys.argv

PAGES = [p for p in ROOT.rglob("*.html")
         if not any(part in ("node_modules", "output", "dist", "templates", "tasks", "tests", "vendor", ".lighthouseci")
                    for part in p.relative_to(ROOT).parts)]

WRAPPED = re.compile(r'<span class="product-name">FL[-‑]BSA</span>')
# h2/h3 included per founder rule: FL-BSA is accent-colored in section headings
# too. h1, nav, buttons, and summaries stay exempt chrome.
PROSE = re.compile(r"<(p|li|figcaption|td|dd|h2|h3)(\s[^>]*)?>(.*?)</\1>", re.S)
EXEMPT_INNER = re.compile(r"<(a|code|button|strong|span)(\s[^>]*)?>.*?</\1>", re.S)

violations = []
for page in PAGES:
    text = page.read_text()
    # drop script/style blocks entirely
    stripped = re.sub(r"<(script|style)\b.*?</\1>", "", text, flags=re.S)
    changed = text
    for m in PROSE.finditer(stripped):
        seg = m.group(0)
        # ignore occurrences already wrapped or inside exempt inline elements
        probe = WRAPPED.sub("", seg)
        probe = EXEMPT_INNER.sub("", probe)
        if "FL-BSA" in probe:
            violations.append((page.relative_to(ROOT), seg.strip().replace("\n", " ")[:90]))
            if FIX:
                fixed_seg = re.sub(
                    r"(?<!product-name\">)FL-BSA(?!</span>)",
                    '<span class="product-name">FL-BSA</span>',
                    seg,
                )
                changed = changed.replace(seg, fixed_seg)
    if FIX and changed != text:
        page.write_text(changed)

if FIX:
    print(f"[OK] wrapped {len(violations)} occurrence(s)" if violations else "[OK] nothing to fix")
    sys.exit(0)

if violations:
    for path, snippet in violations:
        print(f"VIOLATION {path}: {snippet}")
    print(f"ERROR: {len(violations)} unwrapped FL-BSA occurrence(s) in prose "
          f"(rule: wrap in .product-name in prose and h2/h3)")
    sys.exit(1)
print("[OK] product-name treatment consistent")

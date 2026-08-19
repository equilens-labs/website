#!/usr/bin/env python3
"""Prove every known-bad claims probe is rejected by Vale."""

import json
import pathlib
import re
import subprocess
import sys
import tempfile

REPO = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from normalize_html_text import extract_text  # noqa: E402

MD_FIXTURE = REPO / "tests/fixtures/claims-known-bad.md"
HTML_FIXTURE = REPO / "tests/fixtures/claims-known-bad.html"


def vale_fired_lines(vale: str, target: pathlib.Path) -> set[int]:
    result = subprocess.run(
        [vale, "--config", str(REPO / ".vale.ini"), "--output=JSON", "--no-exit", str(target)],
        capture_output=True,
        text=True,
        check=False,
    )
    try:
        data = json.loads(result.stdout or "{}")
    except json.JSONDecodeError as exc:
        raise SystemExit(f"[FAIL] Vale emitted invalid JSON for {target}: {exc}") from exc
    return {issue["Line"] for issues in data.values() for issue in issues}


def check(name: str, expected: dict[int, str], fired: set[int]) -> list[str]:
    missed = [f"  {name}:{line}: {text}" for line, text in sorted(expected.items()) if line not in fired]
    status = "OK" if not missed else f"MISSED {len(missed)}/{len(expected)}"
    print(f"[{status}] {name}: {len(expected) - len(missed)}/{len(expected)} probes fired")
    return missed


def main(vale: str) -> None:
    failures: list[str] = []
    md_expected = {
        i: line.strip()
        for i, line in enumerate(MD_FIXTURE.read_text(encoding="utf-8").splitlines(), start=1)
        if re.match(r"^\d+\.\s", line)
    }
    failures += check("claims-known-bad.md", md_expected, vale_fired_lines(vale, MD_FIXTURE))

    normalized = extract_text(HTML_FIXTURE.read_text(encoding="utf-8"))
    with tempfile.TemporaryDirectory() as tmp:
        txt = pathlib.Path(tmp) / "claims-known-bad.txt"
        txt.write_text(normalized + "\n", encoding="utf-8")
        html_expected = {
            i: line for i, line in enumerate(normalized.splitlines(), start=1) if line.strip()
        }
        failures += check("claims-known-bad.html (rendered)", html_expected, vale_fired_lines(vale, txt))

    if failures:
        print("[FAIL] probes the claims gate no longer catches:")
        print("\n".join(failures))
        raise SystemExit(1)
    print("[OK] claims gate alive: every probe fired")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: check_claims_gate.py /path/to/vale")
    main(sys.argv[1])

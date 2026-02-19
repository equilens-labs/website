#!/usr/bin/env python3
"""Verify LHCI config parity between local and CI variants.

We keep two configs:
- ops/lighthouserc.json: includes startServerCommand for local convenience.
- ops/lighthouserc.ci.json: excludes startServerCommand to avoid double-starting
  the server in CI (audit workflow starts python http.server).

This script ensures URL coverage + assertions stay aligned.
"""

from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
LOCAL = ROOT / "ops" / "lighthouserc.json"
CI = ROOT / "ops" / "lighthouserc.ci.json"


def load(path: pathlib.Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"error: missing {path}")
    except json.JSONDecodeError as e:
        raise SystemExit(f"error: invalid JSON in {path}: {e}")


def canonical(cfg: dict) -> dict:
    ci = cfg.get("ci", {})
    collect = ci.get("collect", {})
    assertions = ci.get("assert", {}).get("assertions", {})
    return {
        "url": collect.get("url", []),
        "numberOfRuns": collect.get("numberOfRuns"),
        "assertions": assertions,
    }


def main() -> int:
    local = load(LOCAL)
    ci = load(CI)

    loc = canonical(local)
    cic = canonical(ci)

    if loc != cic:
        print("error: LHCI config mismatch between local and CI variants")
        print(f"local: {LOCAL}")
        print(f"ci:    {CI}")
        print()
        print("local canonical:", json.dumps(loc, indent=2, sort_keys=True))
        print("ci canonical:   ", json.dumps(cic, indent=2, sort_keys=True))
        return 1

    # Guard against accidental server-start keys in CI config.
    ci_collect = ci.get("ci", {}).get("collect", {})
    forbidden = [k for k in ("startServerCommand", "startServerReadyPattern") if k in ci_collect]
    if forbidden:
        print(f"error: CI LHCI config should not set {', '.join(forbidden)}: {CI}")
        return 1

    print("[OK] lhci configs in sync")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

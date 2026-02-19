#!/usr/bin/env python3
"""Generate website icon outputs from the canonical 1024px symbol raster."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

DEFAULT_SOURCE = Path("brand/symbol/equilens-symbol-light-1024.png")
DEFAULT_DEST = Path("brand/icons")
PNG_SIZES = {
    "apple-touch-icon-180.png": 180,
    "icon-192-maskable.png": 192,
    "icon-512-maskable.png": 512,
}
FAVICON_NAME = "favicon.ico"


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True)


def build_with_sips(source: Path, dest: Path) -> None:
    for name, size in PNG_SIZES.items():
        run(
            [
                "sips",
                "-s",
                "format",
                "png",
                "-z",
                str(size),
                str(size),
                str(source),
                "--out",
                str(dest / name),
            ]
        )


def build_with_magick(source: Path, dest: Path) -> None:
    for name, size in PNG_SIZES.items():
        run(["magick", str(source), "-resize", f"{size}x{size}", str(dest / name)])


def build_favicon_ico(source: Path, dest: Path) -> None:
    run(
        [
            "magick",
            str(source),
            "-define",
            "icon:auto-resize=16,32,48",
            str(dest / FAVICON_NAME),
        ]
    )


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Generate Equilens website icons in brand/icons/."
    )
    parser.add_argument(
        "--source",
        type=Path,
        default=DEFAULT_SOURCE,
        help=f"Source 1024px PNG (default: {DEFAULT_SOURCE})",
    )
    parser.add_argument(
        "--dest",
        type=Path,
        default=DEFAULT_DEST,
        help=f"Destination directory (default: {DEFAULT_DEST})",
    )
    args = parser.parse_args()

    source = args.source
    dest = args.dest

    if not source.exists():
        print(f"[ERROR] source image not found: {source}", file=sys.stderr)
        return 1

    dest.mkdir(parents=True, exist_ok=True)

    if shutil.which("sips"):
        build_with_sips(source, dest)
    elif shutil.which("magick"):
        build_with_magick(source, dest)
    else:
        print("[ERROR] requires either 'sips' or 'magick' to generate PNG icons.", file=sys.stderr)
        return 1

    if shutil.which("magick"):
        build_favicon_ico(source, dest)
    else:
        print("[WARN] 'magick' not found; skipping favicon.ico generation.", file=sys.stderr)

    written = [*(dest / n for n in PNG_SIZES), dest / FAVICON_NAME]
    print("[OK] wrote:")
    for path in written:
        state = "present" if path.exists() else "missing"
        print(f"  - {path} ({state})")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())

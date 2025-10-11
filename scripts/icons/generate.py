#!/usr/bin/env python3
"""Generate Apple touch icon and PWA icons from existing 1024px logo."""
from pathlib import Path

from PIL import Image

SRC = Path("docs/brand/equilens_logo_mark_pack_v1_1/equilens_logo_mark_v1_1_white_1024.png")
DEST = Path("assets/brand")
SIZES = {
    "apple-touch-icon.png": 180,
    "icon-192.png": 192,
    "icon-512.png": 512,
}

if not SRC.exists():
    raise SystemExit(f"source image not found: {SRC}")

DEST.mkdir(parents=True, exist_ok=True)

image = Image.open(SRC).convert("RGBA")
for name, size in SIZES.items():
    image.resize((size, size), Image.LANCZOS).save(DEST / name)

print("[OK] wrote", ", ".join(SIZES.keys()))

#!/usr/bin/env python3
"""
Normalize design exports to repo conventions.

This script is intentionally conservative: it only normalizes a few known
patterns (payment-details, chip, expander) and refuses to guess for unknown
folders.

Usage:
  python3 designs/scripts/normalize_design_exports.py
"""

from __future__ import annotations

import shutil
from pathlib import Path


REPO = Path(__file__).resolve().parents[2]
DESIGNS = REPO / "designs"


def ensure_dir(p: Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def mv(src: Path, dest: Path) -> None:
    if not src.exists():
        return
    ensure_dir(dest.parent)
    dest_exists = dest.exists()
    if dest_exists:
        raise RuntimeError(f"Refusing to overwrite: {dest}")
    shutil.move(str(src), str(dest))


def normalize_payment_details() -> None:
    root = DESIGNS / "screens" / "payment-details"
    if not root.exists():
        return

    domestic_svg = root / "Domestic Payment Details - mobile.svg"
    domestic_png = root / "Domestic Payment Details - mobile.png"
    internal_svg = root / "Internal Account Transfer Details - mobile.svg"
    internal_png = root / "Internal Account Transfer Details - mobile.png"

    mv(
        domestic_svg,
        root / "variants" / "domestic-payment-details" / "mobile-default" / "default.svg",
    )
    mv(
        domestic_png,
        root / "variants" / "domestic-payment-details" / "mobile-default" / "default.png",
    )
    mv(
        internal_svg,
        root / "variants" / "internal-account-transfer-details" / "mobile-default" / "default.svg",
    )
    mv(
        internal_png,
        root / "variants" / "internal-account-transfer-details" / "mobile-default" / "default.png",
    )


def normalize_chip() -> None:
    root = DESIGNS / "components" / "chip"
    if not root.exists():
        return

    mv(
        root / "Type=Regular, Case=Primary, State=Default.svg",
        root / "variants" / "regular-primary" / "default.svg",
    )
    mv(
        root / "Type=Regular, Case=Primary, State=Default.png",
        root / "variants" / "regular-primary" / "default.png",
    )
    mv(
        root / "Type=Small, Case=Primary, State=Default.svg",
        root / "variants" / "small-primary" / "default.svg",
    )
    mv(
        root / "Type=Small, Case=Primary, State=Default.png",
        root / "variants" / "small-primary" / "default.png",
    )


def normalize_expander() -> None:
    root = DESIGNS / "components" / "expander"
    if not root.exists():
        return

    mv(
        root / "Type=Regular, State=Default.svg",
        root / "variants" / "regular" / "default.svg",
    )
    mv(
        root / "Type=Regular, State=Default.png",
        root / "variants" / "regular" / "default.png",
    )
    mv(
        root / "Type=Regular, State=Hover.svg",
        root / "variants" / "regular" / "hover.svg",
    )
    mv(
        root / "Type=Regular, State=Hover.png",
        root / "variants" / "regular" / "hover.png",
    )
    mv(
        root / "Type=Regular, State=Pressed.svg",
        root / "variants" / "regular" / "pressed.svg",
    )
    mv(
        root / "Type=Regular, State=Pressed.png",
        root / "variants" / "regular" / "pressed.png",
    )


def main() -> None:
    normalize_payment_details()
    normalize_chip()
    normalize_expander()
    print("Done.")


if __name__ == "__main__":
    main()


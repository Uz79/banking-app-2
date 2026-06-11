#!/usr/bin/env python3
"""
Build assets/icons-sprite.svg from assets/icons/icon24-*.svg, migrate legacy
<img> icons, embed the sprite into each shell HTML page (same-document <use>),
and bump storage keys when migrating from _07.

Run from apps/web:
  python3 scripts/sync_icons_sprite.py

Or from the banking-app monorepo root:
  python3 apps/web/scripts/sync_icons_sprite.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ICONS_DIR = ROOT / "assets" / "icons"
SPRITE_PATH = ROOT / "assets" / "icons-sprite.svg"

IMG_RE = re.compile(
    r'<img\s+class="([^"]+)"\s+src="assets/icons/(icon24-[^"]+\.svg)"\s+alt="([^"]*)"\s*/?\s*>',
    re.IGNORECASE,
)


def slug_from_filename(name: str) -> str:
    """icon24-home.svg -> home; icon24-edit-2.svg -> edit-2"""
    base = Path(name).stem
    if base.startswith("icon24-"):
        base = base[len("icon24-") :]
    return base


def symbol_id(slug: str) -> str:
    return "i-" + slug


def namespace_fragment_ids(fragment: str, sym_id: str) -> str:
    """Avoid id / url(#…) collisions when merging SVGs into one sprite."""
    ids = set(re.findall(r'\bid="([^"]+)"', fragment))
    if not ids:
        return fragment
    mapping = {old: f"{sym_id}-{old}" for old in ids}
    for old, new in sorted(mapping.items(), key=lambda x: -len(x[0])):
        fragment = fragment.replace(f"url(#{old})", f"url(#{new})")
    for old, new in sorted(mapping.items(), key=lambda x: -len(x[0])):
        fragment = re.sub(
            r'\bid="' + re.escape(old) + r'"', f'id="{new}"', fragment
        )
    return fragment


def build_sprite() -> None:
    parts: list[str] = [
        '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="0" height="0" '
        'style="position:absolute;overflow:hidden;pointer-events:none">',
    ]
    for path in sorted(ICONS_DIR.glob("icon24-*.svg")):
        raw = path.read_text(encoding="utf-8")
        m = re.search(r'viewBox="([^"]+)"', raw, re.I)
        viewbox = m.group(1) if m else "0 0 24 24"
        inner = re.sub(r"<svg[^>]*>", "", raw, count=1, flags=re.I)
        inner = re.sub(r"</svg>\s*$", "", inner, flags=re.I | re.S)
        inner = re.sub(r"#00157[Ee]", "currentColor", inner)
        slug = slug_from_filename(path.name)
        sid = symbol_id(slug)
        inner = namespace_fragment_ids(inner.strip(), sid)
        parts.append(f'<symbol id="{sid}" viewBox="{viewbox}">')
        parts.append(inner)
        parts.append("</symbol>")
    parts.append("</svg>")
    SPRITE_PATH.write_text("\n".join(parts) + "\n", encoding="utf-8")
    print(f"Wrote {SPRITE_PATH.relative_to(ROOT)} ({len(list(ICONS_DIR.glob('icon24-*.svg')))} symbols)")


def img_to_svg_use(m: re.Match[str]) -> str:
    classes, filename, alt = m.group(1), m.group(2), m.group(3)
    slug = slug_from_filename(filename)
    sid = symbol_id(slug)
    href = f"#{sid}"
    if alt.strip():
        return (
            f'<svg class="{classes}" role="img" aria-label="{alt}" focusable="false">'
            f'<use href="{href}"/></svg>'
        )
    return (
        f'<svg class="{classes}" aria-hidden="true" focusable="false">'
        f'<use href="{href}"/></svg>'
    )


def migrate_html_files() -> None:
    n = 0
    for html in ROOT.rglob("*.html"):
        text = html.read_text(encoding="utf-8")
        if "assets/icons/icon24-" not in text:
            continue
        new_text, count = IMG_RE.subn(img_to_svg_use, text)
        if count:
            html.write_text(new_text, encoding="utf-8")
            n += count
            print(f"  {html.relative_to(ROOT)}: {count} icon(s)")
    print(f"Migrated {n} <img> icon(s) total.")


def bump_storage_keys() -> None:
    """Migrate legacy WebApp_* localStorage keys to uzBankWeb* names."""
    subs = [
        ("uzBankWebApp03Theme", "uzBankWebTheme"),
        ("uzBankWebApp10Theme", "uzBankWebTheme"),
        ("uzBankWebApp11Theme", "uzBankWebTheme"),
        ("uzBankWebApp10ColorOverride", "uzBankWebColorOverride"),
        ("uzBankWebApp11ColorOverride", "uzBankWebColorOverride"),
        ("uzBankWebApp11Appearance", "uzBankWebAppearance"),
        ("uzBankWebApp11PaymentState", "uzBankWebPaymentState"),
        ("uzBankWebApp11SavedColorThemes", "uzBankWebSavedColorThemes"),
        ("E-Banking WebApp 11", "UZ Bank Web"),
        ("E-Banking WebApp 10", "UZ Bank Web"),
        ("WebApp 11", "UZ Bank Web"),
        ("WebApp 10", "UZ Bank Web"),
    ]
    exts = {".html", ".js", ".py", ".json", ".md"}
    for path in ROOT.rglob("*"):
        if path.suffix.lower() not in exts:
            continue
        if "sync_icons_sprite.py" in str(path):
            continue
        text = path.read_text(encoding="utf-8")
        orig = text
        for a, b in subs:
            text = text.replace(a, b)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            print(f"  keys: {path.relative_to(ROOT)}")


def embed_sprite_inline() -> None:
    """Cross-document <use href=file.svg#id> is unreliable (file://, Safari). Inline
    the sprite once per HTML page and switch <use> to same-document href=\"#…\".
    The sprite root must not use display:none — that breaks same-document <use>
    in WebKit; use zero-sized off-screen SVG instead."""
    if not SPRITE_PATH.is_file():
        return
    svg_text = SPRITE_PATH.read_text(encoding="utf-8").strip()
    block = f'<div id="uzbank-icon-defs" aria-hidden="true" class="uzbank-icon-defs">\n{svg_text}\n</div>'
    html_paths = sorted({*ROOT.glob("*.html"), ROOT / "spa-source.html"})
    for html_path in html_paths:
        text = html_path.read_text(encoding="utf-8")
        if "icons-sprite.svg#" not in text and 'href="#i-' not in text:
            continue
        if 'id="uzbank-icon-defs"' in text:
            text = re.sub(
                r'<div id="uzbank-icon-defs"[^>]*>[\s\S]*?</div>\s*',
                "",
                text,
                count=1,
            )
        if "</body>" in text:
            m = re.search(r"<body[^>]*>", text)
            if m:
                text = text[: m.end()] + "\n" + block + text[m.end() :]
            else:
                text = text.replace("</body>", f"{block}\n</body>", 1)
        text = text.replace('href="assets/icons-sprite.svg#', 'href="#')
        text = text.replace("href='assets/icons-sprite.svg#", "href='#")
        html_path.write_text(text, encoding="utf-8")
        print(f"  embed: {html_path.relative_to(ROOT)}")


def main() -> int:
    if not ICONS_DIR.is_dir():
        print("Missing assets/icons", file=sys.stderr)
        return 1
    build_sprite()
    migrate_html_files()
    embed_sprite_inline()
    bump_storage_keys()
    print("Done. Sprite built, HTML migrated, sprite embedded for same-document <use>.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""
Normalize design exports to repo conventions.

Usage:
  python3 designs/scripts/normalize_design_exports.py [--dry-run]

What it does:
  - Screens: normalize raw "* - mobile|desktop*.svg|png" exports into
      designs/screens/<screen>/variants/<variant>/<breakpoint>/default.(svg|png)
  - Components: normalize raw "Type=..., Case=..., State=..." exports into
      designs/components/<component>/variants/<variant>/(default|hover|pressed|focus).(svg|png)
  - Updates <name>.json (when present) so `assets.variants` points at the
    normalized `variants/...` paths.
  - Archives legacy top-level variant folders (default/, readonly/) when
    variants/ already contains the normalized copy; syncs JSON to drop old paths.

Inbox mode (also runs automatically when designs/_inbox/ has exports):
  - Prefix filenames with the destination folder name so the script can route them.
    Examples:
      - Figma attrs: chip - Type=Regular, Case=Primary, State=Default.svg
      - Category + label: Card - Accounts & investment.svg -> card/section-card/variants/...
      - Menu label: Menu - Details of an account - More functions.svg
      - screens: payment-details - Domestic Payment Details - mobile.svg
  - Run inbox only:  --inbox
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
from datetime import date
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Set, Tuple


REPO = Path(__file__).resolve().parents[2]
DESIGNS = REPO / "designs"

STATE_MAP = {
    "default": "default",
    "hover": "hover",
    "pressed": "pressed",
    "focus": "focus",
    "selected": "selected",
}

ARCHIVE_ENABLED = True
ARCHIVE_TAG = date.today().isoformat()


def ensure_dir(p: Path) -> None:
    p.mkdir(parents=True, exist_ok=True)


def kebab(s: str) -> str:
    s = s.strip()
    s = re.sub(r"[\s_]+", "-", s)
    s = re.sub(r"[^a-zA-Z0-9\-]+", "-", s)
    s = re.sub(r"-{2,}", "-", s)
    return s.strip("-").lower()


def mv(src: Path, dest: Path, *, dry_run: bool) -> bool:
    if not src.exists():
        return False
    ensure_dir(dest.parent)
    if dest.exists():
        raise RuntimeError(f"Refusing to overwrite: {dest}")
    if dry_run:
        return True
    shutil.move(str(src), str(dest))
    return True


def unique_path(p: Path) -> Path:
    """Return a non-existing path by appending -N before suffix."""
    if not p.exists():
        return p
    stem = p.stem
    suffix = p.suffix
    i = 2
    while True:
        candidate = p.with_name(f"{stem}-{i}{suffix}")
        if not candidate.exists():
            return candidate
        i += 1


def archive_existing(dest: Path, *, base_dir: Path, archive_tag: str, dry_run: bool) -> Optional[Path]:
    """
    If dest exists, move it into:
      <base_dir>/_archive/<archive_tag>/<relative path from base_dir>/<filename>

    Returns archive target path if something was archived.
    """
    if not dest.exists():
        return None
    rel = dest.relative_to(base_dir)
    target = base_dir / "_archive" / archive_tag / rel
    target = unique_path(target)
    ensure_dir(target.parent)
    if dry_run:
        return target
    shutil.move(str(dest), str(target))
    return target


def move_with_archive(
    src: Path,
    dest: Path,
    *,
    base_dir: Path,
    archive_tag: str,
    dry_run: bool,
    archive: bool,
) -> bool:
    if not src.exists():
        return False
    if dest.exists():
        if not archive:
            raise RuntimeError(f"Refusing to overwrite (archive disabled): {dest}")
        archive_existing(dest, base_dir=base_dir, archive_tag=archive_tag, dry_run=dry_run)
    ensure_dir(dest.parent)
    if dry_run:
        return True
    shutil.move(str(src), str(dest))
    return True


def read_json(p: Path) -> Optional[Dict[str, Any]]:
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text())
    except Exception:
        return None


def write_json(p: Path, obj: Dict[str, Any], *, dry_run: bool) -> None:
    if dry_run:
        return
    p.write_text(json.dumps(obj, indent=2) + "\n")


def upsert_assets_variants(
    json_path: Path,
    variant_key: str,
    state_or_breakpoint: str,
    rel_path: str,
    *,
    dry_run: bool,
) -> None:
    obj = read_json(json_path)
    if obj is None:
        return
    assets = obj.setdefault("assets", {})
    variants = assets.setdefault("variants", {})
    entry = variants.setdefault(variant_key, {})
    entry[state_or_breakpoint] = rel_path
    write_json(json_path, obj, dry_run=dry_run)

def collect_variants_from_variants_dir(base_dir: Path) -> Dict[str, Dict[str, str]]:
    """
    Read normalized exports under base_dir/variants/** and return:
      { variant_key: { state_or_breakpoint: "variants/<...>" } }

    For components: expects variants/<variant>/(default|hover|pressed|focus).(svg|png)
    For screens:    expects variants/<variant>/<breakpoint>/default.(svg|png)

    We only index SVGs, since Storybook and the design system primarily reference SVG.
    """
    variants_dir = base_dir / "variants"
    out: Dict[str, Dict[str, str]] = {}
    if not variants_dir.exists():
        return out

    for f in variants_dir.rglob("*.svg"):
        try:
            rel = f.relative_to(base_dir)
        except Exception:
            continue
        parts = rel.parts
        # components: variants/<variant>/<state>.svg
        if len(parts) == 3 and parts[0] == "variants":
            variant_key = parts[1]
            state_key = Path(parts[2]).stem
            out.setdefault(variant_key, {})[state_key] = str(rel).replace("\\", "/")
            continue
        # screens: variants/<variant>/<breakpoint>/default.svg
        if len(parts) == 4 and parts[0] == "variants" and Path(parts[3]).stem == "default":
            variant_key = parts[1]
            breakpoint_key = parts[2]
            out.setdefault(variant_key, {})[breakpoint_key] = str(rel).replace("\\", "/")
            continue
    return out


def ensure_component_metadata(component_dir: Path, *, dry_run: bool) -> None:
    """
    Ensure <component>.json and <component>.md exist for a component root.
    If missing, create skeleton metadata with assets populated from variants/.
    """
    name = component_dir.name
    json_path = component_dir / f"{name}.json"
    md_path = component_dir / f"{name}.md"

    variants = collect_variants_from_variants_dir(component_dir)
    if variants and not json_path.exists():
        rel = component_dir.relative_to(DESIGNS / "components")
        category = rel.parts[0] if len(rel.parts) > 1 else "component"

        interaction_states: Set[str] = set()
        for states in variants.values():
            interaction_states.update(states.keys())
        # Ensure stable order
        state_order = ["default", "hover", "pressed", "focus", "selected"]
        ordered_states = [s for s in state_order if s in interaction_states] + sorted(interaction_states - set(state_order))

        obj: Dict[str, Any] = {
            "name": name,
            "category": category,
            "description": f"{name} component (auto-generated metadata).",
            "interactionStates": ordered_states or ["default"],
            "assets": {"variants": variants},
            "tokens": {
                "modes": {
                    "light": {"foreground": "mapped/light.foreground.foreground"},
                    "dark": {"foreground": "mapped/dark.foreground.foreground"},
                }
            },
            "notes": [
                "Auto-generated by designs/scripts/normalize_design_exports.py from variants/* exports.",
                "Edit description/notes as needed; rerunning the script will not overwrite this file.",
            ],
        }
        write_json(json_path, obj, dry_run=dry_run)

    if variants and not md_path.exists():
        md = "\n".join(
            [
                f"## {name}",
                "",
                "_Auto-generated metadata placeholder._",
                "",
                "### Variants",
                "",
                *[f"- `{k}`" for k in sorted(variants.keys())],
                "",
                "### Notes",
                "",
                "- Generated by `designs/scripts/normalize_design_exports.py`.",
                "",
            ]
        )
        if not dry_run:
            md_path.write_text(md)


def ensure_screen_metadata(screen_dir: Path, *, dry_run: bool) -> None:
    """
    Ensure <screen>.json and <screen>.md exist for a screen folder.
    If missing, create skeleton metadata with assets populated from variants/.
    """
    name = screen_dir.name
    json_path = screen_dir / f"{name}.json"
    md_path = screen_dir / f"{name}.md"

    variants = collect_variants_from_variants_dir(screen_dir)
    if variants and not json_path.exists():
        obj: Dict[str, Any] = {
            "name": name,
            "category": "shell",
            "description": f"{name} screen exports (auto-generated metadata).",
            "interactionStates": ["default"],
            "assets": {"variants": variants},
            "tokens": {
                "radius": "alias.radius.regular",
                "modes": {
                    "light": {"foreground": "mapped/light.foreground.foreground"},
                    "dark": {"foreground": "mapped/dark.foreground.foreground"},
                },
            },
            "notes": [
                "Auto-generated by designs/scripts/normalize_design_exports.py from variants/* exports.",
                "Edit description/notes as needed; rerunning the script will not overwrite this file.",
            ],
        }
        write_json(json_path, obj, dry_run=dry_run)

    if variants and not md_path.exists():
        md = "\n".join(
            [
                f"# {name}",
                "",
                "_Auto-generated metadata placeholder._",
                "",
                "## Variants",
                "",
                *[f"- `{k}`" for k in sorted(variants.keys())],
                "",
                "## Notes",
                "",
                "- Generated by `designs/scripts/normalize_design_exports.py`.",
                "",
            ]
        )
        if not dry_run:
            md_path.write_text(md)


def archive_finder_duplicate_sidecars(base_dir: Path, *, dry_run: bool) -> List[Tuple[Path, Path]]:
    """
    Finder can create duplicates like:
      chip 2.json, chip 2.md
    when copying/merging folders. If a canonical file exists (chip.json),
    archive the numbered duplicates into base_dir/_archive/<tag>/... .
    """
    moved: List[Tuple[Path, Path]] = []
    if not base_dir.exists():
        return moved

    for f in base_dir.iterdir():
        if not f.is_file():
            continue
        m = re.match(r"^(?P<stem>.+?)\s+\d+\.(?P<ext>json|md)$", f.name, flags=re.IGNORECASE)
        if not m:
            continue
        canonical = base_dir / f"{m.group('stem')}.{m.group('ext').lower()}"
        if not canonical.exists():
            continue
        dest = base_dir / "_archive" / ARCHIVE_TAG / "_finder-duplicates" / f.name
        dest = unique_path(dest)
        ensure_dir(dest.parent)
        if dry_run:
            moved.append((f, dest))
            continue
        shutil.move(str(f), str(dest))
        moved.append((f, dest))
    return moved


COMPONENT_ROOT_SKIP_DIRS = {"variants", "_archive", "_inbox"}
KNOWN_STATE_STEMS = {"default", "hover", "pressed", "focus", "selected", "error", "informative"}


def is_legacy_variant_folder(d: Path) -> bool:
    """Top-level folders like default/ or readonly/ holding state SVGs (pre-variants/ layout)."""
    if not d.is_dir() or d.name in COMPONENT_ROOT_SKIP_DIRS or d.name.startswith("."):
        return False
    if any(c.is_dir() for c in d.iterdir()):
        return False
    files = [c for c in d.iterdir() if c.is_file()]
    if not files:
        return d.name in {"default", "readonly"}
    if not all(f.suffix.lower() in {".svg", ".png"} for f in files):
        return False
    return all(f.stem in KNOWN_STATE_STEMS for f in files)


def legacy_folder_variant_key(folder_name: str, component_dir: Path) -> str:
    variants_dir = component_dir / "variants"
    if folder_name == "default":
        for candidate in ("default-default", "default"):
            if (variants_dir / candidate).is_dir():
                return candidate
        return "default-default"
    if folder_name == "readonly":
        if variants_dir.exists():
            readonly_dirs = sorted(
                d.name for d in variants_dir.iterdir() if d.is_dir() and d.name.startswith("readonly-")
            )
            if len(readonly_dirs) == 1:
                return readonly_dirs[0]
        for candidate in ("readonly-default", "readonly"):
            if (variants_dir / candidate).is_dir():
                return candidate
        return "readonly-default"
    name = kebab(folder_name)
    if (variants_dir / name).is_dir():
        return name
    return name


def migrate_legacy_variant_folders(component_dir: Path, *, dry_run: bool) -> List[Tuple[Path, Path]]:
    """
    Move pre-convention variant folders (default/, readonly/) into variants/,
    or archive them when variants/ already has the normalized copy.
    """
    moves: List[Tuple[Path, Path]] = []
    for child in list(component_dir.iterdir()):
        if not is_legacy_variant_folder(child):
            continue

        variant_key = legacy_folder_variant_key(child.name, component_dir)
        target = component_dir / "variants" / variant_key
        files = [f for f in child.iterdir() if f.is_file() and f.suffix.lower() in {".svg", ".png"}]

        if not files:
            dest = unique_path(component_dir / "_archive" / ARCHIVE_TAG / "legacy-empty" / child.name)
            if dry_run:
                moves.append((child, dest))
                continue
            ensure_dir(dest.parent)
            shutil.move(str(child), str(dest))
            moves.append((child, dest))
            continue

        if target.exists():
            dest_dir = unique_path(component_dir / "_archive" / ARCHIVE_TAG / "legacy" / child.name)
            if dry_run:
                moves.append((child, dest_dir))
                continue
            ensure_dir(dest_dir.parent)
            shutil.move(str(child), str(dest_dir))
            moves.append((child, dest_dir))
            continue

        for f in files:
            dest = target / f.name
            if move_with_archive(
                f,
                dest,
                base_dir=component_dir,
                archive_tag=ARCHIVE_TAG,
                dry_run=dry_run,
                archive=ARCHIVE_ENABLED,
            ):
                moves.append((f, dest))
        if not dry_run and child.exists():
            try:
                child.rmdir()
            except OSError:
                pass
    return moves


def archive_redundant_raw_exports(component_dir: Path, *, dry_run: bool) -> List[Tuple[Path, Path]]:
    """
    Archive raw Figma exports left at component root when variants/ already
    contains the normalized destination (avoids swapping good exports).
    """
    moves: List[Tuple[Path, Path]] = []
    for f in iter_raw_component_exports(component_dir):
        if "=" not in f.stem:
            continue
        parsed = parse_component_export_filename(f.stem)
        if not parsed:
            continue
        variant_key, state_key = parsed
        dest = component_dir / "variants" / variant_key / f"{state_key}{f.suffix.lower()}"
        if not dest.exists():
            continue
        archive_dest = unique_path(
            component_dir / "_archive" / ARCHIVE_TAG / "raw-exports" / f.name
        )
        ensure_dir(archive_dest.parent)
        if dry_run:
            moves.append((f, archive_dest))
            continue
        shutil.move(str(f), str(archive_dest))
        moves.append((f, archive_dest))
    return moves


def archive_empty_replaced_folder(component_dir: Path, *, dry_run: bool) -> List[Tuple[Path, Path]]:
    """Remove legacy empty _replaced staging folders into _archive."""
    moves: List[Tuple[Path, Path]] = []
    replaced = component_dir / "_replaced"
    if not replaced.is_dir():
        return moves
    if any(replaced.iterdir()):
        return moves
    dest = unique_path(component_dir / "_archive" / ARCHIVE_TAG / "stale" / "_replaced")
    if dry_run:
        moves.append((replaced, dest))
        return moves
    ensure_dir(dest.parent)
    shutil.move(str(replaced), str(dest))
    moves.append((replaced, dest))
    return moves


def sync_component_assets_json(component_dir: Path, *, dry_run: bool) -> bool:
    """Drop legacy assets.default paths; keep only assets.variants (+ overview)."""
    json_path = component_dir / f"{component_dir.name}.json"
    obj = read_json(json_path)
    if obj is None or not isinstance(obj.get("assets"), dict):
        return False

    assets: Dict[str, Any] = obj["assets"]
    variants_on_disk = collect_variants_from_variants_dir(component_dir)
    legacy_keys = set(assets.keys()) - {"variants", "overview"}
    if not legacy_keys and assets.get("variants") == variants_on_disk:
        return False

    new_assets: Dict[str, Any] = {"variants": variants_on_disk}
    if "overview" in assets:
        new_assets["overview"] = assets["overview"]
    obj["assets"] = new_assets
    write_json(json_path, obj, dry_run=dry_run)
    return True


def iter_dirs(p: Path) -> Iterable[Path]:
    if not p.exists():
        return []
    return (d for d in p.iterdir() if d.is_dir())


def iter_files_recursive(p: Path) -> Iterable[Path]:
    if not p.exists():
        return []
    return (f for f in p.rglob("*") if f.is_file())


def screen_breakpoint_from_suffix(suffix: str) -> Optional[str]:
    s = suffix.lower()
    if "mobile" in s:
        return "mobile-default"
    if "full" in s and "desktop" in s:
        return "desktop-full-screen"
    if "full-screen" in s:
        return "desktop-full-screen"
    if "desktop" in s:
        return "desktop-default"
    return None


def parse_screen_size_variant_export(stem: str) -> Optional[Tuple[str, str]]:
    """
    Parse Figma screen exports like:
      "Screen Size=desktop, Variant=A"
      "Screen Size = mobile, Variant = B"
    Returns: (variant_key, breakpoint_key) e.g. ("a", "desktop-default")
    """
    parts = [p.strip() for p in stem.split(",")]
    if len(parts) < 2:
        return None
    attrs: Dict[str, str] = {}
    for p in parts:
        m = re.match(r"^\s*([^=]+?)\s*=\s*(.+?)\s*$", p)
        if not m:
            return None
        attrs[m.group(1).strip().lower()] = m.group(2).strip()
    size_raw = attrs.get("screen size") or attrs.get("size")
    variant_raw = attrs.get("variant")
    if not size_raw or not variant_raw:
        return None
    breakpoint = screen_breakpoint_from_suffix(size_raw)
    if breakpoint is None:
        return None
    return (kebab(variant_raw), breakpoint)


def parse_component_export_filename(name: str) -> Optional[Tuple[str, str]]:
    """
    Parse filenames like:
      "Type=Regular, Case=Primary, State=Default.svg"
      "Type = Default, Case = Informative, State = Hover.png"
    Returns: (variant_key, state_key)
    """
    # Strip extension outside.
    parts = [p.strip() for p in name.split(",")]
    if len(parts) < 2:
        return None

    attrs: Dict[str, str] = {}
    for p in parts:
        m = re.match(r"^\s*([^=]+?)\s*=\s*(.+?)\s*$", p)
        if not m:
            return None
        k = m.group(1).strip()
        v = m.group(2).strip()
        attrs[k.lower()] = v

    state_raw = attrs.get("state")
    if state_raw:
        state_key = STATE_MAP.get(kebab(state_raw), kebab(state_raw))
    else:
        state_key = "default"

    # Build variant key from all non-state attrs in a stable order.
    order = ["type", "size", "case", "variant", "kind", "tone"]
    bits: List[str] = []
    for k in order:
        if k in attrs and k != "state":
            bits.append(kebab(attrs[k]))
    # Include any other attributes (except state) deterministically.
    for k in sorted(attrs.keys()):
        if k in order or k in {"state", "name"}:
            continue
        bits.append(kebab(attrs[k]))

    if not bits:
        # If everything was filtered out, fall back to type value
        bits = [kebab(attrs.get("type", "default"))]
    variant_key = "-".join(bits)
    return (variant_key, state_key)


def parse_inbox_prefix(filename: str) -> Optional[Tuple[str, str]]:
    """Extract '<target> - <rest>' prefix used in designs/_inbox."""
    if " - " not in filename:
        return None
    left, right = filename.split(" - ", 1)
    target = kebab(left)
    rest = right.strip()
    if not target or not rest:
        return None
    return (target, rest)


def parse_inbox_name_routed_component(stem: str) -> Optional[Tuple[str, str]]:
    """
    Support inbox exports that include a Name attribute instead of a filename prefix:
      "Name=Chip, Type=Regular, Case=Primary, State=Default"

    Returns (target_component_folder, stem_without_name=...) where the second
    value can be fed into parse_component_export_filename.
    """
    parts = [p.strip() for p in stem.split(",")]
    if len(parts) < 2:
        return None
    attrs: Dict[str, str] = {}
    for p in parts:
        m = re.match(r"^\s*([^=]+?)\s*=\s*(.+?)\s*$", p)
        if not m:
            return None
        attrs[m.group(1).strip().lower()] = m.group(2).strip()

    name = attrs.get("name")
    if not name:
        return None

    # Remove the leading "Name=..." part so the remainder matches our usual parser.
    remainder_parts = []
    for p in parts:
        if re.match(r"^\s*name\s*=", p, flags=re.IGNORECASE):
            continue
        remainder_parts.append(p)
    remainder = ", ".join(remainder_parts).strip()
    if not remainder:
        return None
    return (kebab(name), remainder)


def is_component_root_dir(d: Path) -> bool:
    """
    A 'component root' is any folder under designs/components that represents a
    real component, not just a category bucket.

    Heuristics:
      - contains a 'variants' directory, OR
      - contains '<folder>.json' (exact match)
    """
    if not d.is_dir():
        return False
    if (d / "variants").is_dir():
        return True
    if (d / f"{d.name}.json").is_file():
        return True
    return False


def iter_component_root_dirs() -> Iterable[Path]:
    base = DESIGNS / "components"
    if not base.exists():
        return []
    # Walk depth-first; yield only leaf-ish component roots.
    for d in (p for p in base.rglob("*") if p.is_dir()):
        if d.name in {"_archive", "_inbox"}:
            continue
        if is_component_root_dir(d):
            yield d


# Category buckets (e.g. designs/components/card/) route "<Category> - <label>" to a leaf component.
INBOX_CATEGORY_DEFAULT_CHILD: Dict[str, str] = {
    "card": "section-card",
    "list-item": "list-item",
}

# Figma screen frame titles → designs/screens/<folder> (when kebab(title) ≠ folder name).
INBOX_SCREEN_ALIASES: Dict[str, str] = {
    "details-of-investment-product": "investment-product-details",
    "screen-overview": "overview",
    "payment": "payments",
}


def resolve_inbox_screen_dir(screens_root: Path, target: str) -> Optional[Path]:
    """Map inbox prefix slug to an existing designs/screens/<folder>."""
    direct = screens_root / target
    if direct.is_dir():
        return direct
    alias = INBOX_SCREEN_ALIASES.get(target)
    if alias:
        aliased = screens_root / alias
        if aliased.is_dir():
            return aliased
    return None


def parse_inbox_screen_rest(rest_name: str) -> Optional[Tuple[str, Optional[str]]]:
    """
    Parse screen export remainder after '<screen> - '.

    Supports:
      - '<variant> - <breakpoint>.ext'  → variant folder + breakpoint subfolder
      - '<breakpoint>.ext' only         → single folder (e.g. desktop.svg → desktop-default/)
    """
    if " - " in rest_name:
        base, suffix_ext = rest_name.split(" - ", 1)
        variant_key = kebab(base)
        breakpoint = screen_breakpoint_from_suffix(suffix_ext)
        if breakpoint is None:
            return None
        return (variant_key, breakpoint)

    breakpoint = screen_breakpoint_from_suffix(rest_name)
    if breakpoint is None:
        return None
    # Shell screens: variants/desktop-default/default.svg (no nested variant folder).
    return (breakpoint, None)


def find_child_component_by_label(category_dir: Path, label: str) -> Optional[Path]:
    """Pick nested component folder whose name best matches a human export label."""
    label_slug = kebab(label)
    label_tokens = set(label_slug.split("-"))
    best: Optional[Path] = None
    best_score = 0
    for child in category_dir.iterdir():
        if not child.is_dir() or child.name.startswith(".") or child.name in COMPONENT_ROOT_SKIP_DIRS:
            continue
        if not is_component_root_dir(child):
            continue
        name_tokens = set(child.name.split("-"))
        score = len(label_tokens & name_tokens)
        if score > best_score:
            best_score = score
            best = child
    return best if best_score >= 2 else None


def resolve_inbox_component_target(
    components_root: Path,
    target: str,
    variant_label: str,
    *,
    bare_component: bool,
) -> Optional[Tuple[Path, str, str]]:
    """
    Resolve inbox routing to (component_root, variant_key, state_key).

    Supports:
      - bare names: Action Bar.svg -> components/action-bar/variants/default/default.*
      - Figma attrs: Type=..., State=...
      - category + label: Card - Accounts & investment -> card/section-card/variants/accounts-investment/...
      - menu label: Menu - Details of an account - More functions -> menu/menu-details-more-functions/...
    """
    if bare_component:
        return (components_root / target, "default", "default")

    parsed = parse_component_export_filename(variant_label)
    if parsed:
        variant_key, state_key = parsed
        direct = components_root / target
        if is_component_root_dir(direct):
            return (direct, variant_key, state_key)
        return None

    variant_key = kebab(variant_label)
    state_key = "default"
    category_dir = components_root / target
    if not category_dir.is_dir():
        return None

    if is_component_root_dir(category_dir):
        return (category_dir, variant_key, state_key)

    default_child = INBOX_CATEGORY_DEFAULT_CHILD.get(target)
    if default_child:
        child = category_dir / default_child
        if child.is_dir() and is_component_root_dir(child):
            return (child, variant_key, state_key)

    matched = find_child_component_by_label(category_dir, variant_label)
    if matched:
        variants_dir = matched / "variants"
        if variants_dir.is_dir():
            subdirs = sorted(d.name for d in variants_dir.iterdir() if d.is_dir())
            if len(subdirs) == 1:
                variant_key = subdirs[0]
        return (matched, variant_key, state_key)

    return None


def iter_raw_component_exports(component_dir: Path) -> Iterable[Path]:
    """
    Yield raw export files (svg/png) that are not already normalized, i.e.
    not in variants/ and not in _archive/.
    """
    for f in component_dir.rglob("*"):
        if not f.is_file() or f.suffix.lower() not in {".svg", ".png"}:
            continue
        # Skip normalized + archived paths.
        parts = set(f.parts)
        if "variants" in parts or "_archive" in parts or "_replaced" in parts:
            continue
        # Ignore Finder duplicates
        if f.name.endswith(".json") and re.search(r"\s\d+\.json$", f.name):
            continue
        yield f


def normalize_components(*, dry_run: bool) -> List[Tuple[Path, Path]]:
    moves: List[Tuple[Path, Path]] = []
    for component_dir in iter_component_root_dirs():
        moves.extend(archive_finder_duplicate_sidecars(component_dir, dry_run=dry_run))
        moves.extend(migrate_legacy_variant_folders(component_dir, dry_run=dry_run))
        moves.extend(archive_empty_replaced_folder(component_dir, dry_run=dry_run))
        moves.extend(archive_redundant_raw_exports(component_dir, dry_run=dry_run))
        sync_component_assets_json(component_dir, dry_run=dry_run)
        ensure_component_metadata(component_dir, dry_run=dry_run)
        for f in iter_raw_component_exports(component_dir):
            stem = f.stem
            parsed = parse_component_export_filename(stem)
            if not parsed:
                continue
            variant_key, state_key = parsed
            dest = component_dir / "variants" / variant_key / f"{state_key}{f.suffix.lower()}"
            if move_with_archive(
                f,
                dest,
                base_dir=component_dir,
                archive_tag=ARCHIVE_TAG,
                dry_run=dry_run,
                archive=ARCHIVE_ENABLED,
            ):
                moves.append((f, dest))
                # Update json if present (only if the component has a canonical json file)
                json_path = component_dir / f"{component_dir.name}.json"
                upsert_assets_variants(
                    json_path,
                    variant_key=variant_key,
                    state_or_breakpoint=state_key,
                    rel_path=str(dest.relative_to(component_dir)).replace("\\", "/"),
                    dry_run=dry_run,
                )
    return moves


def normalize_screens(*, dry_run: bool) -> List[Tuple[Path, Path]]:
    moves: List[Tuple[Path, Path]] = []
    screens_root = DESIGNS / "screens"
    for screen_dir in iter_dirs(screens_root):
        moves.extend(archive_finder_duplicate_sidecars(screen_dir, dry_run=dry_run))
        # If a screen already has variants but is missing metadata, create it.
        ensure_screen_metadata(screen_dir, dry_run=dry_run)
        # Only normalize raw exports dropped into the screen root folder.
        # Normalize only files that match "* - <suffix>.svg|png" and are in the screen root.
        for f in list(screen_dir.iterdir()):
            if not f.is_file() or f.suffix.lower() not in {".svg", ".png"}:
                continue
            variant_key: Optional[str] = None
            breakpoint: Optional[str] = None
            parsed_attrs = parse_screen_size_variant_export(f.stem)
            if parsed_attrs:
                variant_key, breakpoint = parsed_attrs
            elif " - " in f.name:
                base, suffix_ext = f.name.split(" - ", 1)
                variant_key = kebab(base)
                breakpoint = screen_breakpoint_from_suffix(suffix_ext)
            if variant_key is None or breakpoint is None:
                continue
            dest = screen_dir / "variants" / variant_key / breakpoint / f"default{f.suffix.lower()}"
            if move_with_archive(
                f,
                dest,
                base_dir=screen_dir,
                archive_tag=ARCHIVE_TAG,
                dry_run=dry_run,
                archive=ARCHIVE_ENABLED,
            ):
                moves.append((f, dest))
                json_path = screen_dir / f"{screen_dir.name}.json"
                upsert_assets_variants(
                    json_path,
                    variant_key=variant_key,
                    state_or_breakpoint=breakpoint,
                    rel_path=str(dest.relative_to(screen_dir)).replace("\\", "/"),
                    dry_run=dry_run,
                )
    return moves


def normalize_inbox(*, dry_run: bool) -> List[Tuple[Path, Path]]:
    """
    Route exports from designs/_inbox into the right screen/component folder.

    Preferred: filename starts with "<folder-name> - ".
      - If <folder-name> matches designs/components/<folder-name>, treat as component export
      - If <folder-name> matches designs/screens/<folder-name>, treat as screen export

    Also supported for components: filenames that include a Name attribute, e.g.
      "Name=Chip, Type=Regular, Case=Primary, State=Default.svg"

    Also supported for components: bare names like "Action Bar.svg" meaning
    component=<action-bar>, variant=default, state=default.
    """
    inbox = DESIGNS / "_inbox"
    if not inbox.exists():
        return []

    moves: List[Tuple[Path, Path]] = []
    components_root = DESIGNS / "components"
    screens_root = DESIGNS / "screens"

    for f in iter_files_recursive(inbox):
        if f.suffix.lower() not in {".svg", ".png"}:
            continue
        target: Optional[str] = None
        rest_name: Optional[str] = None
        bare_component = False

        parsed = parse_inbox_prefix(f.name)
        if parsed:
            target, rest_name = parsed
        else:
            name_routed = parse_inbox_name_routed_component(f.stem)
            if name_routed:
                target, remainder_stem = name_routed
                rest_name = f"{remainder_stem}{f.suffix}"
            else:
                # Bare component name only (no attrs, no screen-like suffix).
                if any(x in f.stem for x in {",", "=", " - "}):
                    continue
                target = kebab(f.stem)
                rest_name = f.stem + f.suffix
                bare_component = True

        assert target is not None and rest_name is not None

        variant_label = Path(rest_name).stem
        resolved = resolve_inbox_component_target(
            components_root,
            target,
            variant_label,
            bare_component=bare_component,
        )
        if resolved:
            component_dir, variant_key, state_key = resolved
            if bare_component and not component_dir.exists():
                ensure_dir(component_dir)
            if not component_dir.exists():
                pass
            elif is_component_root_dir(component_dir) or bare_component:
                dest = component_dir / "variants" / variant_key / f"{state_key}{f.suffix.lower()}"
                if move_with_archive(
                    f,
                    dest,
                    base_dir=component_dir,
                    archive_tag=ARCHIVE_TAG,
                    dry_run=dry_run,
                    archive=ARCHIVE_ENABLED,
                ):
                    moves.append((f, dest))
                    ensure_component_metadata(component_dir, dry_run=dry_run)
                    json_path = component_dir / f"{component_dir.name}.json"
                    upsert_assets_variants(
                        json_path,
                        variant_key=variant_key,
                        state_or_breakpoint=state_key,
                        rel_path=str(dest.relative_to(component_dir)).replace("\\", "/"),
                        dry_run=dry_run,
                    )
                continue

        screen_dir = resolve_inbox_screen_dir(screens_root, target)
        if screen_dir:
            parsed_screen = parse_inbox_screen_rest(rest_name)
            if parsed_screen is None:
                continue
            variant_key, breakpoint = parsed_screen
            if breakpoint is None:
                dest = screen_dir / "variants" / variant_key / f"default{f.suffix.lower()}"
                json_breakpoint = "default"
            else:
                dest = (
                    screen_dir
                    / "variants"
                    / variant_key
                    / breakpoint
                    / f"default{f.suffix.lower()}"
                )
                json_breakpoint = breakpoint
            if move_with_archive(
                f,
                dest,
                base_dir=screen_dir,
                archive_tag=ARCHIVE_TAG,
                dry_run=dry_run,
                archive=ARCHIVE_ENABLED,
            ):
                moves.append((f, dest))
                json_path = screen_dir / f"{screen_dir.name}.json"
                upsert_assets_variants(
                    json_path,
                    variant_key=variant_key,
                    state_or_breakpoint=json_breakpoint,
                    rel_path=str(dest.relative_to(screen_dir)).replace("\\", "/"),
                    dry_run=dry_run,
                )
            continue

    # Clean up empty subfolders (keep designs/_inbox itself).
    if not dry_run and inbox.exists():
        for d in sorted((p for p in inbox.rglob("*") if p.is_dir()), reverse=True):
            try:
                d.rmdir()
            except OSError:
                pass
    return moves


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print actions without changing files")
    parser.add_argument("--inbox", action="store_true", help="Process designs/_inbox (routing by filename prefix)")
    parser.add_argument(
        "--no-archive",
        action="store_true",
        help="Disable swap+archive; refuse when a normalized dest already exists.",
    )
    parser.add_argument(
        "--archive-tag",
        default=date.today().isoformat(),
        help="Archive folder name under _archive/ (default: YYYY-MM-DD).",
    )
    args = parser.parse_args()

    global ARCHIVE_ENABLED, ARCHIVE_TAG
    ARCHIVE_ENABLED = not args.no_archive
    ARCHIVE_TAG = args.archive_tag

    moves: List[Tuple[Path, Path]] = []
    if args.inbox:
        moves.extend(normalize_inbox(dry_run=args.dry_run))
    else:
        moves.extend(normalize_screens(dry_run=args.dry_run))
        moves.extend(normalize_components(dry_run=args.dry_run))
        moves.extend(normalize_inbox(dry_run=args.dry_run))

    if args.dry_run:
        print(f"Dry run: {len(moves)} move(s) planned.")
    else:
        print(f"Done: {len(moves)} move(s).")


if __name__ == "__main__":
    main()


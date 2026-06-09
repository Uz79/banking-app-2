# Segmented control

A selection control for switching between a small number of related views or modes.

## Variants

| Variant | Figma export | Track | Notes |
|---------|--------------|-------|-------|
| `regular-left-active` | `Type=Regular`, `Case=Left Active` | 44dp | Left segment selected |
| `regular-right-active` | `Type=Regular`, `Case=Right Active` | 44dp | Right segment selected |
| `small-left-active` | `Type=Small`, `Case=Left Active` | 36dp | Left segment selected — **app default** |
| `small-right-active` | `Type=Small`, `Case=Right Active` | 36dp | Right segment selected |

Assets live under `variants/<variant>/default.svg`.

## States

- `default` — exported snapshots for the active segment (no hover/pressed exports yet)

## Usage notes

- Use for 2–5 options; prefer tabs or a select for larger sets.
- Keep segment labels short to prevent truncation.
- Web implementation: `.segmented` + `.segmented__option` in `apps/web/css/styles.css`.
- Sizes: `.segmented--sm` (36dp track, default for toolbars) · `.segmented--regular` (44dp track).

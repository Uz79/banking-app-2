# Tile

Compact content tile: eyebrow label, primary name, and a secondary detail line (e.g. IBAN).

## Variants

| Variant | Figma | Path |
|---------|-------|------|
| `default` | Case=Default | `variants/default/default.svg` (+ `default.png`) |
| `selected` | Case=Selected | `variants/selected/default.svg` (+ `default.png`) |

## States

- `default` — resting (only state exported currently)

## Structure

- Rounded surface (`radius.regular`) with subtle border
- Label (secondary / muted)
- Name (primary / bold)
- Detail line (e.g. account number)

## Notes

- Use as a selectable surface (e.g. account picker) when `selected` is needed.
- Wrap in a button/link when interactive; expose an accessible name.

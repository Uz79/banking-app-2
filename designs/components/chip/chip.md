## Chip

Pill-shaped status/selection surface with optional leading/trailing icons.

### Variants

- `regular / primary` — 32px height
- `small / primary` — 24px height
- `tonal`: a colour variant for either size: a quiet status label, not a control

### States

- `default`

### Notes

- Primary chip uses the same colors as the primary button: `color-btn-primary-*`.
- Tonal chip uses the tonal button's colors: `color-btn-tonal-bg`, `-fg` and `-border` (`.chip--tonal` in `apps/web/css/styles.css`). The app shows it small after a booking's name: "Pending", or a standing order's frequency ("Monthly"). It has no SVG export yet.
- SVG exports live next to this doc; the web implementation should be a semantic button/anchor when interactive.


# List item

Reusable list item patterns (e.g. accounts, services, users, cards).

## Variants

| Figma export | Variant slug | Notes |
|--------------|--------------|-------|
| `Type=Group`, `Case=Account` | `group-account` | Single group row (e.g. account information summary) |
| `Type=Group`, `Case=Credit Card` | `group-credit-card` | Card product row |
| `Type=Grouped-Top`, `Case=Account` | `grouped-top-account` | First row in grouped account list |
| `Type=Grouped-Mid`, `Case=Account` | `grouped-mid-account` | Middle row in grouped account list |
| `Type=Grouped-Bottom`, `Case=Account` | `grouped-bottom-account` | Last row in grouped account list |
| `Type=Grouped-Top`, `Case=Service` | `grouped-top-service` | Grouped service row (top) |
| `Type=Grouped-Top`, `Case=User` | `grouped-top-user` | Grouped user row (top) |
| `Type=Grouped-Mid`, `Case=User2` | `grouped-mid-user2` | Grouped user row (mid) |
| `Type=Wealth Overview`, `Case=Account` | `wealth-overview-account` | Wealth overview account row (default / hover / focus) |

Place new exports under `variants/<slug>/` as `default.svg` + `default.png` (+ `hover` / `focus` when exported). Do not leave `Type=…` files at `list-item/` root.

## States

- `default`
- `hover` (when exported)
- `focus` (exported as `Pressed` in Figma)

## Spacing (account rows)

Grouped-top and wealth-overview account rows in Figma use **56dp hug height** with **space/3 (16dp)** vertical padding and horizontal insets on the leading/trailing sides.

| Token alias | CSS variable | Default | Used by |
|-------------|--------------|---------|---------|
| `component.list-row.padding-y` | `--list-row-pad-y` | `{space.3}` → 16dp | `.product-item`, `.list-item`, `.booking-row`, `.list-item--group-account` |
| `component.list-row.padding-x` | `--list-row-pad-x` | `{space.3}` → 16dp | same |
| `component.list-row.gap` | `--list-row-gap` | `{space.3}` → 16dp | icon ↔ text ↔ amount |

Override in `designs/tokens/extensions.json` (survives Figma re-import), then `npm run tokens:build`. Storybook **Live → Components → List item → List row spacing** reads computed values from the DOM.

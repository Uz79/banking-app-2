# Radio button

A selection control that represents a single choice within a mutually exclusive group.

## Variants

| Variant | Figma | Description |
|---------|-------|-------------|
| `regular-inactive` | Type=Regular, Case=Inactive | Unselected, regular size |
| `regular-active` | Type=Regular, Case=Active | Selected, regular size |
| `small-inactive` | Type=Small, Case=Inactive | Unselected, small size |
| `small-active` | Type=Small, Case=Active | Selected, small size |

## States

- `default` — resting
- `hover` — pointer hover (web)
- `pressed` — pressed / active feedback

Asset paths: `variants/<variant>/<state>.svg`

## Usage notes

- Use when only one option in a set can be selected.
- Provide a group label and keep option labels short and unambiguous.

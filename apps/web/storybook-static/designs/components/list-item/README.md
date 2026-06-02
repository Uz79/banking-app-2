# List item components

Grouped list row patterns under `designs/components/list-item/`:

| Folder | Manifest | Role |
|--------|----------|------|
| `list-item/` | `list-item.json` | Standard list rows (accounts, services, users, cards) |
| `row-item/` | `row-item.json` | Row-level patterns (bookings, section headers) |
| `selection-list-item/` | `selection-list-item.json` | Selection lists (e.g. country picker) |

Each subfolder follows the shared convention: `<slug>.json`, `<slug>.md`, optional `overview.png`, and `variants/<variant-kebab>/{default,hover,focus}.{svg,png}`.

Figma `Type=…, Case=…, State=…` exports map to `variants/<type-kebab>-<case-kebab>/`. `Pressed` → `focus`.

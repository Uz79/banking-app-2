# Screen design manifests

Screens under `designs/screens/` mirror the **`designs/components/`** convention:

```
<screen-kebab-slug>/
  <slug>.json      # Manifest (same asset shape as component JSON).
  <slug>.md        # Brief description + variants.
  overview.png    # Thumb / reference raster (paired with manifests like components).
  variants/
    <variant-kebab-slug>/
      default.svg | default.png
```

Variant folders encode **breakpoint / context**. Common values:

| Variant slug       | Typical use                         |
|--------------------|-------------------------------------|
| `desktop-default`  | Desktop export                      |
| `mobile-default`   | Mobile export                       |
| `default-default`  | Single-size vector / one-off raster |

Raster uses **`default.png`**, vector **`default.svg`**, matching **`carousel`**, **`menu-accounts`**, etc.

The **`category`** field in JSON groups screens logically: **`shell`**, **`payment`**, **`menu`**, **`dialog`**, **`profile`**, **`composite`** — analogous to components’ taxonomy.

## Screen folders

| Folder | Topic |
|--------|-------|
| `overview` | Home / dashboard |
| `account-details` | Account surface |
| `account-information` | Account information disclosure (desktop / mobile) |
| `payments` | Payments landing |
| `payment-flow-*` | Multi-step payment flow steps |
| `dialog-basic`, `dialog-confirmation` | Dialog patterns |
| `menu-*` | Sheet menus |
| `profile-*` | Profile settings |
| `flow-screens` | Composite journey raster (see `notes` in manifest until `variants/` export exists) |

## Payment flow ↔ implementation

| Screen folder | `data-step` / hash segment |
|---------------|----------------------------|
| `payment-flow-type-ahead-search-active` | `recipient-search` |
| `payment-flow-type-ahead-search-inactive` | `recipient-search` |
| `payment-flow-recipient` | `recipient` |
| `payment-flow-amount` | `amount` |
| `payment-flow-time-schedule` | `schedule` |
| `payment-flow-summary` | `summary` |

Route pattern: **`#pay/<segment>`** — see **`apps/web/js/payment-overlay.js`**.

Legacy Title Case filenames (“Payment Flow … - mobile”) have been relocated into **`variants/`**; each screen **`*.md`** describes the mapping.

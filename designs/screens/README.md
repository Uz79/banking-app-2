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
| `desktop-full-screen` | Second desktop frame (e.g. full-width comp; optional) |
| `mobile-default`   | Mobile export                       |
| `default-default`  | Single-size vector / one-off raster |

Raster uses **`default.png`**, vector **`default.svg`**, matching **`carousel`**, **`menu-accounts`**, etc.

The **`category`** field in JSON groups screens logically: **`shell`**, **`payment`**, **`menu`**, **`dialog`**, **`profile`**, **`composite`** — analogous to components’ taxonomy.

## Screen folders

| Folder | Topic |
|--------|-------|
| `overview` | Home / dashboard |
| `account-details` | Account surface |
| `all-bookings-and-payments` | Full bookings list (`mobile-default`, `mobile-content-indication`, `desktop-default`, `desktop-content-indication`, `desktop-sticky-nav-bar`; entry from account details) |
| `account-information` | Account information disclosure (`desktop-default`, `desktop-full-screen`, `mobile-default`, `mobile-content-indication`) |
| `share-information` | Share information screen (`desktop-default`, `desktop-full-screen`, `mobile-default`) |
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

Legacy Title Case filenames (“Payment Flow … - mobile”, “Screen Overview - desktop”, etc.) belong in **`variants/<slug>/default.svg`** — never at `designs/screens/` root. Each screen **`*.md`** describes the Figma → folder mapping.

| Loose export (root) | Target |
|---------------------|--------|
| `Screen Overview - desktop` | `overview/variants/desktop-default/` |
| `Payment - desktop` / `Payment - mobile` | `payments/variants/desktop-default/` / `mobile-default/` |
| `Account Details - *` | `account-details/variants/` |
| `All Bookings - mobile` / `Size=Mobile, Type=Default` | `all-bookings-and-payments/variants/mobile-default/` |
| `Size=Mobile, Type=Sticky TopBar` | `all-bookings-and-payments/variants/mobile-content-indication/` |
| `Size=Desktop, Type=Default` | `all-bookings-and-payments/variants/desktop-default/` |
| `Size=Desktop, Type=Sticky TopBar` | `all-bookings-and-payments/variants/desktop-content-indication/` |
| `Size=Desktop, Type=Sticky NavBar` | `all-bookings-and-payments/variants/desktop-sticky-nav-bar/` |
| `Account Information - *` | `account-information/variants/` (use `mobile-content-indication` for Content Indication Effect frames) |

# All bookings and payments

Full transaction history for a single account — entered from **Account details → Show all bookings** (card CTA or **More functions** menu).

## Flow

Journey raster: `designs/flows/all-bookings-and-payments.png`

| Step | Screen | Notes |
|------|--------|-------|
| Entry | `account-details` | Recent bookings card + **Show all bookings** CTA |
| Executed (default) | `all-bookings-and-payments` / `mobile-default` | Status tabs, month filter, grouped list |
| After scroll | `mobile-content-indication` / `desktop-content-indication` | Account summary + status tabs scroll away; **title + month chips** stick together in one elevated card (Sticky TopBar) |
| Deep scroll (desktop) | `desktop-sticky-nav-bar` | Title scrolled away; **account summary + month chips** stick together in one elevated card (Sticky NavBar) |

## Variants

| Variant | Figma export | Assets |
|---------|--------------|--------|
| `mobile-default` | `Size=Mobile`, `Type=Default` | `variants/mobile-default/default.svg`, `default.png` |
| `mobile-content-indication` | `Size=Mobile`, `Type=Sticky TopBar` | `variants/mobile-content-indication/default.svg`, `default.png` |
| `desktop-default` | `Size=Desktop`, `Type=Default` | `variants/desktop-default/default.svg`, `default.png` |
| `desktop-content-indication` | `Size=Desktop`, `Type=Sticky TopBar` | `variants/desktop-content-indication/default.svg`, `default.png` |
| `desktop-sticky-nav-bar` | `Size=Desktop`, `Type=Sticky NavBar` | `variants/desktop-sticky-nav-bar/default.svg`, `default.png` |

## Sticky behaviour

Design uses **one sticky container** per scroll phase — never separate sticky bars for title and month:

1. **Sticky TopBar** (`*-content-indication`) — combined title row + month chips; 16dp top inset and side bleed when pinned; content-indication drop shadow while list continues below.
2. **Sticky NavBar** (`desktop-sticky-nav-bar`) — combined account summary row + month chips after title has scrolled off (desktop deep-scroll state; not yet implemented in the web app).

App implementation (`all-bookings-and-payments.html`): `.all-bookings__sticky-header` wraps nav + month as a single sticky unit matching Sticky TopBar.

## States

- `default` — executed tab, current month selected; full intro (account card + status tabs) visible
- `scroll` — title + month filter pinned in one card; content-indication shadow on the combined header

## Related

- `designs/screens/account-details` — entry point
- `designs/components/chip` — month filter pills
- `designs/components/card/section-card/variants/bookings/` — recent bookings on account details
- `designs/components/menu/menu-details-more-functions` — **Show all bookings** in More functions menu

## App route

`all-bookings-and-payments.html?account=<key>` — `<key>` matches carousel `data-account-key` on account details (`household`, `savings`, `deposit`).

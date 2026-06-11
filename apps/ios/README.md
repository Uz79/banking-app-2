# iOS app

Native **SwiftUI** implementation of the UZ Bank e‑banking prototype, mirroring
`apps/web` while leaning into native platform strengths (real navigation stacks,
a custom tab bar, gesture-driven carousel, type‑ahead search with a focused
keyboard, live light/dark theming, and Dynamic-Type-style legibility scaling).

## Requirements

- Xcode 15+
- iOS 17.0+ deployment target

## Run

Open `EBanking.xcodeproj` in Xcode, select an iOS Simulator, and run. The
`EBanking` scheme builds the app target. (`Package.swift` is provided for
tooling/SPM inspection; the Xcode project is the canonical build because it
bundles the asset catalog and Profile Pro fonts.)

## Screens (core set)

| Screen | File(s) |
| --- | --- |
| Overview (accounts, products, offers) | `Views/Overview/OverviewView.swift` |
| Account details (carousel + bookings) | `Views/Overview/AccountDetailView.swift` |
| Account information (info / conditions, share) | `Views/Overview/AccountInformationView.swift` |
| Payment details (tap a booking) | `Views/Payments/PaymentDetailView.swift` |
| Payments (pending, recurring, recipients) | `Views/Payments/PaymentsView.swift` |
| All bookings & payments | `Views/Bookings/AllBookingsView.swift` |
| Investment product details (Deposit + chart) | `Views/Investment/InvestmentProductDetailsView.swift` |
| Details of position | `Views/Investment/DetailsOfPositionView.swift` |
| Share information (QR) | `Views/Overview/ShareInformationView.swift` |
| Profile (colour theme / legibility / persona) | `Views/Profile/*` |
| Payment flow modal | `Views/PaymentFlow/*` |
| Internal Account Transfer modal | `Views/Transfer/InternalTransferView.swift` |

The **payment flow** matches the web `#pay/*` steps:
`recipient-search → recipient → amount → schedule → summary → confirmation`.
Tapping **Pay** opens the type‑ahead search; choosing a recent recipient on the
Payments screen skips straight to the recipient form.

The **Internal Account Transfer** flow (the *Internal Transfer* action) matches
the web `#iat/*` overlay: amount + from/to account pickers → schedule → summary →
confirmation.

The Profile **Colour theme** is a native port of the web contrast checker: pick a
background and foreground (hex + RGB sliders); the whole app re‑skins live, with
the WCAG contrast ratio and AA/AAA Large & Normal pass/fail badges, persisted, and
a *Reset to theme* button. See `DesignSystem/ColorOverride.swift` (derivation +
WCAG math, ported from `apps/web/js/contrast-checker.js`).

## Design system

Generated from the shared tokens in `designs/tokens/*` (the same source as
`apps/web/css/tokens.css`).

- `DesignSystem/Colors.swift` — semantic colours that resolve **dynamically**
  to their light/dark token values, so the whole app re-themes with the system
  setting or the in‑app Theme toggle.
- `DesignSystem/Theme.swift` — `AppSettings` (theme mode, legibility, persona),
  persisted in `UserDefaults`, plus the dynamic-colour helpers.
- `DesignSystem/Typography.swift` — Profile Pro type scale; point sizes scale
  with the chosen Legibility preset.
- `DesignSystem/Spacing.swift` — spacing / radius tokens.

## Assets

`EBanking/Assets/xcassets` holds the 24px icon set as template-rendered vector
imagesets (tinted via `currentColor`), sourced from `apps/web/assets/icons`.
Fonts live in `EBanking/Fonts` and are registered in `Info.plist`.

## Parity notes & next steps

All the main web screens are now ported: Overview, Payments, Account details,
Account information, Payment details, the payment flow, Internal Account
Transfer, the "More" action sheet, Profile (colour theme / legibility /
persona), All bookings & payments, Investment product details (with a
natively-drawn performance chart), Details of position, and Share information
(with a generated QR code).

Investment prices/series and bookings use static sample data (the web fetches
live quotes); swap in a data source when wiring a real backend.

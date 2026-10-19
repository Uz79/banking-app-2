# Baseline

The state of `apps/web` when the spec-driven process was adopted (2026-10-19), tagged `v1-presentable`. This folder predates the dated-folder rule and is not a feature spec: it records what exists, so every later feature can be checked against it (`validation.md` here is the regression smoke test).

## What exists

**Banking (customer-facing)**

- Overview: accounts and investments with totals, other products, offers, quick actions (Scan, Pay, Internal transfer)
- Payments: the pay flow (recipient search, recipient, amount, schedule, summary, confirmation), internal transfer, payment details and sharing overlays, payment exit confirmation
- Account details, all bookings and payments (Executed, Pending, Recurring, month chips, search)
- Custody account (investment product details), positions, details of a position with chart and Buy/Sell trade flow
- Status message: the "Open payment!" demo message on main views
- Profile: User Type (three sliders, profile, story, UI preview, 3D character), Legibility (presets, typeface, font and padding sliders), Theme (colour themes, Monochrome or Multi-color, saved themes), admin access, demo data reset

**Shell and system**

- Sidebar (desktop) and tab bar (mobile), Light/Dark toggle, page transitions (tectonics), scroll-edge header shadows, nav button motion, CTA pulse, wiggle cues
- The 3D character at 1× on Overview, Payments, Account details, Custody account and Position details
- Design system (admin): hub, Motion specimens, Components, Character kit

## Known gaps and quirks (accepted)

- `spa-source.html` is an older single-page reference, not kept in sync (it still refers to the old contrast checker)
- `js/contrast-checker.js` remains only for `spa-source.html`
- Custom colour themes saved before the theme port (old `uzBankWebColorOverride` key) were dropped
- Some files have Finder duplicates (`js/payment-details 2.js`, `scripts/generate-tokens-css 2.mjs`); unused, left alone until a spec removes them

# Section card

Section header (title, optional trailing amount) plus a bordered body card. Matches `.section-card` in the web app.

## Variants

| Figma export | Variant slug | Typical screen |
|--------------|--------------|----------------|
| Card - Accounts & investment | `accounts-investment` | Overview (main) |
| Card - Other products | `other-products` | Overview (main) |
| Card - Offers | `offers` | Overview (sidebar) |
| Card - Pending payments | `pending-payments` | Payments (main) |
| Card - Recurring payments | `recurring-payments` | Payments (sidebar) |
| Card - Recipients | `recipients` | Payments — “Most recent recipients” (sidebar) |
| Card - Bookings | `bookings` | Account details |
| Card - Performance | `performance` | Investment account details (performance chart) |
| Card - Positions | `positions` | Investment account details — preview list (5 rows desktop / 3 mobile + Show all) |
| Card - My Positions | `my-positions` | Details of position — full holdings list with Show all |
| Card - Key Figures | `key-figures` | Details of position — summary metrics card |
| Card - Position item | `position-item` | Single holdings row (used inside `positions`; export separately) |

Place new exports under `variants/<slug>/` as `default.svg` and `default.png`. Do not leave `Card - …` files at `card/` root.

## States

- `default`: exported snapshot from Figma (see `interactionStates` in JSON).

## Structure

- **Header** — `.section-card__header` / `__title` / optional `__amount`.
- **Body** — `.section-card__body` (bordered container); rows use `product-item`, `list-item`, dates (`.section-card__date`), or CTAs (`show-all-btn`).

### Performance variant (`variants/performance/`)

Single bordered card (420×480) with toolbar, balance, chart, range chips, and invested/cash rows inside `.section-card__body`:

- **Toolbar** — `.performance-card__toolbar`: coffee icon + `Deposit - …` product label + tonal **Details** (top-right).
- **Balance** — `.performance-card__header` / `__balance` (Details is not beside the balance).
- **Chart** — fluid width; tooltip fixed size; range chips left-aligned with `space/2` (8dp) gap.

## Spacing (Figma)

| Context | Figma | Web token |
|---------|-------|-----------|
| Gap between stacked section cards (mobile) | `space/4` (16dp) | `--space-3` |
| Gap between stacked section cards (desktop columns) | `space/6` (32dp) | `--space-5` |
| Header → bordered body (inside one card) | `space/1` (4dp) | `--section-card-header-gap-to-body` |

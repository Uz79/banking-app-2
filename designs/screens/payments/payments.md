# Payments landing

Payments entry shell before stepping into sender flow.

## Variants

| Variant | Figma export | Assets |
|---------|--------------|--------|
| `desktop-default` | Payment - desktop | `variants/desktop-default/default.svg`, `default.png` |
| `mobile-default` | Payment - mobile | `variants/mobile-default/default.svg`, `default.png` |

Place new Figma exports in the variant folders as `default.svg` / `default.png` (do not leave Title Case files at screen root).

**Payment** frames only (`Payment - desktop` / `Payment - mobile`). **Account Details** exports belong under `designs/screens/account-details/`, not here.

## States

- `default`: exported snapshot from Figma (see also `interactionStates` in JSON).

## Layout — mobile vs desktop

Rasters + component structure match `variants/mobile-default/` and `variants/desktop-default/`:

### Mobile

- Vertical stack: nav title **Payments** → **quick actions** → **three section cards**.
- **Pending payments** — one bordered card (`section`-level container). Inside:
  - Small date line + row per scheduled payment (clock / pending affordance).
  - Two sample rows (`Rent`, `Healthcare`) then **Show all pending payments** spanning the bottom of that card (tonal chip + trailing arrow).
- **Recurring payments** — separate bordered card listing recurring items + chevron.
- **Most recent recipients** — separate bordered card (icons, optional subtitle on a row).

Quick actions include an optional fourth **More** circular action (ellipsis) beside Scan / Pay / Internal transfer in mobile reference art.

### Desktop / wide

- Pending card sits in the **primary column** as the combined card above (same inner rows + CTA).
- **Recurring** and **Most recent recipients** sit in the **secondary column** (narrow rail), stacked.
- Narrow viewports reuse the desktop markup: the rail is stacked **below** pending via responsive layout (see `.view__sidebar` on `payments`).

### Spacing (Figma → CSS)

| Breakpoint | Figma token | Gap between section cards |
|------------|-------------|---------------------------|
| Mobile | `space/4` (16dp) | `var(--space-3)` |
| Desktop columns | `space/6` (32dp) | `var(--space-5)` |

Within each card, header-to-body gap stays `space/1` (4dp) — `.section-card__header` `margin-bottom`.

### Implementation pointers

Source: `apps/web/payments.html` (and SPA slice `apps/web/spa-source.html`): `.view__main` holds pending only; `.view__sidebar` holds recurring + recipients. Below `1024px`, `#payments` activates flex column stacking so sidebar cards are visible (see `css/styles.css`).

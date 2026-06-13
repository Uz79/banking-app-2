# Scroll boundary indication

Indicate whether scrollable content continues **above** or **below** a fixed surface (top bar, bottom navigation, sticky action bar, modal header/footer, or scrollable panel edge).

## Purpose

Users should know at a glance that more content is hidden without scrolling. A subtle elevation shadow on the fixed chrome signals that list or body content extends past the viewport edge.

## Rule

| Condition | Top chrome (content above) | Bottom chrome (content below) |
|-----------|---------------------------|------------------------------|
| At scroll boundary — nothing hidden | No top shadow | No bottom shadow |
| Content continues above the top bar | Top shadow visible | — |
| Content continues below the bottom bar | — | Bottom shadow visible |
| Content does not overflow | No shadow on either edge | No shadow on either edge |

Shadows are **functional**, not decorative. Remove them when the user has reached the corresponding scroll boundary.

## States

| State ID | Top bar | Bottom bar | When |
|----------|---------|------------|------|
| `at-top` | No shadow | — | `scrollTop ≤ 1` or content does not overflow |
| `scrolled` | Shadow | — | Content scrolled under sticky top chrome |
| `mid-scroll` | Shadow (if top pinned) | Shadow | Content hidden above and below |
| `at-bottom` | Shadow (if top pinned) | No shadow | `scrollTop` at maximum; nothing below |
| `no-overflow` | No shadow | No shadow | `scrollHeight ≤ clientHeight` |

Figma exports this as **Content Indication Effect** / **Sticky TopBar** frames.

## Annotated spec (`overview.png`)

`overview.png` is the **master reference screen** — not a single app state. It documents:

- All four scroll states side by side (`content beneath` / `content above` rows)
- Swipe gesture legend (up, down, vertical, horizontal)
- Shadow dimensions and Figma CSS snippets on the chrome edges (e.g. offset, blur, opacity)
- Which bar receives the shadow in each scenario

Read `overview.png` first for intent and measurements; use `examples/` for isolated per-state frames without annotations.

## Applies to

- Mobile top app bars (`.view__nav`, `[data-scroll-edge-nav]`)
- Mobile bottom tab bar (`.tab-bar`)
- Sticky section headers (e.g. all-bookings combined title + month bar)
- Modal headers and footers (`.modal__nav`, `.modal__footer`)
- Account-information disclosure footer
- Scrollable dialog bodies and panels with fixed chrome

## Do not

- Apply a permanent shadow on tab bars or nav bars regardless of scroll position
- Show elevation when there is no hidden content
- Use ad-hoc shadow values — use `--shadow-content-indication-after` / `--shadow-content-indication-before`
- Split sticky chrome into multiple independent sticky layers when design specifies one combined sticky unit (see all-bookings)

## Asset layers

| Asset | Role |
|-------|------|
| `overview.png` | Annotated pattern board — dimensions, gestures, shadow code |
| `states.svg` | In-context screen reference (all-bookings sticky top bar) |
| `examples/*` | Clean per-state mobile frames (no annotation overlays) |

## Example assets

Isolated state frames live under `examples/`:

| Variant | Meaning |
|---------|---------|
| `mobile-top-indication` | Top shadow — content hidden above |
| `mobile-top-at-boundary` | No top shadow — scrolled to top |
| `mobile-bottom-indication` | Bottom shadow — content hidden below |
| `mobile-bottom-at-boundary` | No bottom shadow — scrolled to bottom |

See [`examples/README.md`](./examples/README.md) for paths and Figma → folder mapping.

## Related design assets

| Asset | Role |
|-------|------|
| `designs/screens/all-bookings-and-payments` variants `*-content-indication` | Top sticky bar with shadow while list continues |
| `designs/screens/account-information` variant `mobile-content-indication` | Modal scroll + top indication |
| `designs/components/nav-bar` | Top chrome component |
| `designs/components/menu/menu-bottom-navigation` | Bottom tab chrome |

## App implementation

See [`implementation-notes.md`](./implementation-notes.md) for selectors, classes, and `UZBankScrollEdgeChrome`.

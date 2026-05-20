# Menu — More functions (main view contextual)

Overflow actions from the primary action row on **Overview** and **Account details**: opens the shared `form-sheet` dialog (bottom sheet under 1280px viewport width, anchored pop-over at 1280px and above).

## Journey reference

- Raster flow: [`../../../screens/flows/main-view-contextual-menu-navigation-flow.png`](../../../screens/flows/main-view-contextual-menu-navigation-flow.png)  
- Related composite catalog entry: [`../../../screens/flow-screens/`](../../../screens/flow-screens/) (desktop payment-flow composites).

## Menu content (default)

| Order | Label | Icon id |
| ----- | ----- | ------- |
| 1 | Internal account transfer | `i-repeat` |
| 2 | Change category | `i-edit-2` |
| 3 | Show account information | `i-eye` |

## Behaviour

- **Trigger:** `button[data-more-functions-trigger]` inside `.view--overview` or `.view--account-details` (only while `.view--active` in the SPA).
- **Selection:** dispatches `uz:more-functions-action` with `{ action, sourceView }` after the sheet closes. Host apps wire navigation or payment entry from that event.

## Variants

- `default-default` — Vector snapshot (`variants/default-default/default.svg`).

## States

- `default`: exported snapshot from design tools (see `interactionStates` in JSON).

# Details of position

Position detail surface — key figures summary, performance chart, and holdings list.

Two **persona layout variants** reflect different Buy/Sell control patterns (Profile → Persona):

| Persona | Buy/Sell (A) | Buy/Sell (B) |
|---------|--------------|--------------|
| Beatrice (A) | Circular action buttons — **search** (Buy), **eye** (Sell) | — |
| Max (B) | — | Secondary pill buttons — **plus** (Buy), **minus** (Sell, filled primary) |

## Variants

| Variant | Persona | Desktop | Mobile |
|---------|---------|---------|--------|
| `a` | Persona A — Beatrice Mueller (`data-persona="beatrice"`) | `variants/a/desktop-default/default.svg` | `variants/a/mobile-default/default.svg` |
| `b` | Persona B — Max Maximus (`data-persona="max"`) | `variants/b/desktop-default/default.svg` | `variants/b/mobile-default/default.svg` |

Figma frame attrs: `Screen Size=desktop|mobile, Variant=A|B` → normalized as above.

## States

- `default`: exported snapshot from Figma (see also `interactionStates` in JSON).

## Related components

- `designs/components/card/section-card/variants/key-figures/` — summary metrics card.
- `designs/components/card/section-card/variants/my-positions/` — full holdings list card.
- `designs/screens/investment-product-details` — parent investment product shell.

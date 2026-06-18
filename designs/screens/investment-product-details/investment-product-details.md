# Investment product details

Investment account details surface — performance chart, positions table, and product actions.

Two **persona layout variants** reflect different information density / action patterns selected in Profile → Persona.

## Variants

| Variant | Persona | Desktop | Mobile |
|---------|---------|---------|--------|
| `a` | Persona A — Beatrice Mueller (`data-persona="beatrice"`) | `variants/a/desktop-default/default.svg` | `variants/a/mobile-default/default.svg` |
| `b` | Persona B — Max Maximus (`data-persona="max"`) | `variants/b/desktop-default/default.svg` | `variants/b/mobile-default/default.svg` |

Figma frame attrs: `Screen Size=desktop|mobile, Variant=A|B` → normalized as above.

## States

- `default`: exported snapshot from Figma (see also `interactionStates` in JSON).

## Related components

- `designs/components/card/section-card/variants/performance/` — performance chart card.
- `designs/components/card/section-card/variants/positions/` — holdings / positions card.
- `designs/screens/account-details` — private account details (parallel shell pattern).

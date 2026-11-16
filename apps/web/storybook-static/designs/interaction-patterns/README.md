# Interaction patterns

`designs/interaction-patterns/` documents **how UI behaves over time** — scroll affordances, sticky transitions, overlay focus traps, and other cross-cutting rules that components alone do not capture.

Components define **what** exists. Tokens define **values**. Patterns define **when and why** behavior changes.

## Before implementing a screen

Check, in order:

1. **`designs/components/`** — markup, variants, interaction states
2. **`designs/tokens/`** — color, spacing, typography, shadows
3. **`designs/interaction-patterns/`** — behavioral rules (this folder)

Also consult **`designs/screens/`** for layout variants and **`designs/flows/`** for multi-step journeys.

### When to read patterns

Open this folder when the screen uses any of:

- Sticky headers or footers
- Bottom tab navigation
- Scrollable main content behind fixed chrome
- Modals, sheets, or disclosure panels with internal scroll
- Segmented controls or filters that pin while content scrolls
- Carousels or horizontally scrollable regions with edge affordances

## Folder convention

Each pattern lives in its own kebab-case folder:

```
interaction-patterns/
  <pattern-kebab-slug>/
    <slug>.json              # Manifest (metadata, states, related assets)
    <slug>.md                # Human-readable rules for designers and models
    implementation-notes.md  # App wiring: JS hooks, CSS classes, selectors
    overview.png             # Annotated spec board (dimensions, gestures, code snippets)
    states.svg | states.png  # Visual summary of states (optional)
    examples/                # Per-state frames; clean exports without annotation overlays
```

JSON shape mirrors `designs/components/` and `designs/screens/` manifests: `name`, `category`, `description`, `interactionStates`, `assets`, `tokens`, `notes`.

## Patterns catalog

| Pattern | Summary |
|---------|---------|
| [`scroll-boundary-indication`](./scroll-boundary-indication/scroll-boundary-indication.md) | Drop shadow on fixed top/bottom chrome when scrollable content continues above or below |

Add new rows here when you introduce a pattern folder.

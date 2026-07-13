# Slider

Slider input for selecting a value from a bounded range.

## Variants

| Variant | Path | Description |
|---------|------|-------------|
| `default` | `variants/default/default.svg` | Track + filled range + pill thumb + value label |

## States

- `default` — resting (only state exported currently)

## Visual notes

- Thumb is a **pill** (rounded rectangle), not a circle.
- Track uses primary foreground at reduced opacity; filled range and thumb use solid primary.

## Accessibility

- Expose an accessible name.
- Expose min, max, and current value.
- Support keyboard focus and arrow-key changes in implementation.

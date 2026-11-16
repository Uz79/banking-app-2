# Select field

A form field for choosing a value from a predefined list.

## Variants

- `default`: regular interactive size (`default-default`)
- `small`: compact interactive size (`small-default`)
- `readonly`: non-editable display (export pending)

## States

Current exports available:

- `default-default`: `default`, `hover`, `focus`
- `small-default`: `default`, `hover`, `focus`

Planned (export pending):

- `error`, `informative`
- `readonly` variants

## Usage notes

- Use when the valid set of values is known and constrained.
- Keep option labels short; consider search for long lists.
- Prefer `small` in dense layouts (tables, toolbars); use `default` in forms.

# Dialog

A modal dialog used to confirm or complete a focused task.

## Variants

- `default-default`: baseline layout
- `basic`: simple dialog shell (`basic-dialog` export) — discard / exit confirmations
- `confirmation`: payment confirmation content (`confirmation-dialog` export)

## Layout (basic + confirmation)

- **Mobile bottom sheet** (`≤1279px`): `--space-3` (16dp) inner padding; actions sit in a compact footer band.
- **Desktop centered card** (`≥1280px`): `--space-4` (24dp) inner padding.
- Corner radius: `alias.radius.regular` (8dp).

## States

- `default`: exported snapshot (no hover/pressed exports yet)


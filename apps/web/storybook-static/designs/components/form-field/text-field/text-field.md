# Text field

A single-line text input used to capture user-entered data (e.g. names, references, notes).

## Variants

Variants are organized as `variants/<type>-<case>/default.svg` (and `hover.svg` / `focus.svg` when exported).

| Figma | Folder slug |
|-------|-------------|
| `Type=Default`, `Case=Default` | `default-default` |
| `Type=Default`, `Case=Informative` | `default-informative` |
| `Type=Default`, `Case=Error` | `default-error` |
| `Type=ReadOnly`, `Case=Default` | `readonly-default` |
| `Type=ReadOnly`, `Case=Informative` | `readonly-informative` |

## States (interactive variants)

- `default`: resting
- `hover`: pointer hover (web)
- `focus`: active focus / text entry (exported as `Pressed` in Figma)

## Usage notes

- Use **default-error** only when you have a clear validation message and a way to recover.
- Prefer **default-informative** for hints and contextual guidance; avoid competing with error styling.
- **readonly-** variants display submitted or derived values; keep values selectable/copyable where possible.

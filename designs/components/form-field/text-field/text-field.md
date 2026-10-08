# Text field

A single-line text input used to capture user-entered data (e.g. names, references, notes).

## Variants

Regular size uses `variants/<type>-<case>/`. Non-regular sizes use `variants/<size>-<type>-<case>/`.

| Figma | Folder slug |
|-------|-------------|
| `Size=Regular`, `Type=Default`, `Case=Default` | `default-default` |
| `Size=Regular`, `Type=Default`, `Case=Informative` | `default-informative` |
| `Size=Regular`, `Type=Default`, `Case=Error` | `default-error` |
| `Size=Regular`, `Type=ReadOnly`, `Case=Default` | `readonly-default` |
| `Size=Regular`, `Type=ReadOnly`, `Case=Informative` | `readonly-informative` |
| `Size=Regular`, `Type=ReadOnly`, `Case=Multiple Text Rows` | `readonly-multiple-text-rows` |
| `Size=Small`, `Type=Default`, `Case=Default` | `small-default-default` |

## States (interactive variants)

- `default`: resting
- `hover`: pointer hover (web)
- `focus`: active focus / text entry (exported as `Pressed` in Figma)

Currently exported with hover/focus: `default-default`, `small-default-default`.

## Usage notes

- Use **default-error** only when you have a clear validation message and a way to recover.
- Prefer **default-informative** for hints and contextual guidance; avoid competing with error styling.
- **readonly-** variants display submitted or derived values; keep values selectable/copyable where possible.
- Prefer **small-default-default** in dense layouts; use regular size in forms.

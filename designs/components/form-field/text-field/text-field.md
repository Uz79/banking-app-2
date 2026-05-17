# Text field

A single-line text input used to capture user-entered data (e.g. names, references, notes).

## Variants

- `default`: interactive input
- `readonly`: non-editable input for displaying submitted/derived values

## States (default variant)

- `default`: resting
- `hover`: pointer hover (web)
- `focus`: active focus / text entry
- `error`: invalid value or failed validation
- `informative`: neutral helper/info styling (e.g. hint or guidance)

## States (readonly variant)

- `default`: resting
- `informative`: readonly with informational emphasis

## Usage notes

- Use **error** only when you have a clear validation message and a way to recover.
- Prefer **informative** for hints and contextual guidance; avoid competing with error styling.
- Readonly fields should remain selectable/copyable where possible, but not editable.


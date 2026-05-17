# Amount field

A composite form field for monetary amounts (numeric input + currency selector).

## Variants

- `default`: interactive
- `readonly`: non-editable display (export pending)

## States

Current exports available:

- `default`: `default`, `hover`, `focus`

Planned (export pending):

- `error`, `informative`

## Usage notes

- Use when a value represents money; prefer pairing with a currency selector when multiple currencies are possible.
- Use **error** only with a clear validation message (e.g. “Amount must be greater than 0”).


# Account picker

A selection control used to choose a source or destination account (e.g. in payment flows).

## Variants

- `default-default`: standard appearance
- `default-informative`: informational emphasis (e.g. helper context)
- `default-error`: validation error styling

## States

- `default`: resting
- `hover`: pointer hover (web)
- `focus`: pressed/active feedback (exported as `Pressed` in Figma)

## Usage notes

- Use when the user must pick one account from a list; pair with clear account labels and balances.
- Show **error** only with a recovery path (e.g. “Select an account to continue”).


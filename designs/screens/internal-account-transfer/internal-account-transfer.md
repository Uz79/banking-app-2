# Internal account transfer

4-step modal flow for transferring between the user's own accounts. Triggered by the "Internal Transfer" action button on the account-details screen.

Flow diagram: `designs/flows/internal-account-transfer-flow.png`
Figma: https://www.figma.com/design/IKZcKBuZfweNRvRI0Ji6X3/Des-Sys-Test?node-id=697-93014

## Variants (mobile)

| Variant | File | Step | Description |
|---|---|---|---|
| `iat-amount-recipient` | `variants/iat-amount-recipient/mobile-default/default.svg` | 1 — Recipient | "I want to transfer internally" subtitle, CHF amount input with currency dropdown, **from** debit-account card, **to** debit-account card (both with chevron). Primary action: Confirm → time schedule. |
| `iat-time-schedule` | `variants/iat-time-schedule/mobile-default/default.svg` | 2 — Time schedule | Segmented control (Single / Recurring execution), Immediately toggle (ON by default collapses date field), Execute on date field (calendar icon). Primary action: Confirm → summary. |
| `iat-summary` | `variants/iat-summary/mobile-default/default.svg` | 3 — Summary | Read-only Amount + Execute on rows (each with edit pencil back to step 1 / 2), Recipient debit-account card, Debit account card. Primary action: Execute → confirmation dialog. |
| `iat-confirmation-dialog` | `variants/iat-confirmation-dialog/mobile-default/default.svg` | 4 — Confirmation | Card overlay with check-circle icon, "Your payment of CHF X to Y will be executed now". Primary action: Confirm → closes flow. |

## Component structure (app)

```
modal-overlay#uz-iat-overlay
  modal-shell
    modal.modal--iat-flow
      modal__nav          ← ← back · title · × close
      modal__body
        modal__step[data-iat-step="recipient"]   ← amount input + from/to cards
        modal__step[data-iat-step="schedule"]    ← segmented + toggle + date field
        modal__step[data-iat-step="summary"]     ← readonly rows + account cards
  iat-confirmation-dialog#uz-iat-confirmation    ← fades in over modal
    iat-confirmation-dialog__card
```

Hash routing: `#iat/recipient` · `#iat/schedule` · `#iat/summary`

## Key design decisions

- **Debit-account card**: same component as the payment flow (border `1px solid var(--color-fg)`, no background fill, `radius-regular`). Used for both the from/to selectors and the summary account rows.
- **Immediately toggle**: when ON the Execute on date field is hidden and `live.dateLabel` snaps to today's date; when OFF the field is revealed for date entry.
- **Confirm vs Execute**: steps 1–2 use "Confirm" as the primary label; step 3 (Summary) uses "Execute" to signal the irreversible action.
- **Debit account defaults** to the currently active carousel account (`window.__UZ_ACTIVE_ACCOUNT__`); credit defaults to the next account in the catalogue (self-transfer guard).

## Notes

- Place new Figma exports in the variant folder as `default.svg` / `default.png`. Do not leave Title Case files at the screen root.
- Reuses `designs/components/button/debit-account` (not yet in component library as of 2026-06-01).
- Segmented control uses `.segmented.segmented--full` (full-width variant).

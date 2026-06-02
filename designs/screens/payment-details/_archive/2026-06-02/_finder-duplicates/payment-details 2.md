## Payment details

Modal overlay displayed when tapping any booking row in the account-details bookings card.
Two variants driven by the payment type.

### Variants (mobile)

| Variant | File | Description |
|---|---|---|
| `domestic-payment-details` | `variants/domestic-payment-details/mobile-default/default.svg` | Domestic outgoing payment. Shows amount (editable), "to" TextField with recipient address (edit opens payment flow at amount step for now), function bar, info rows, Further options expander. |
| `internal-account-transfer-details` | `variants/internal-account-transfer-details/mobile-default/default.svg` | Internal account-to-account transfer. Shows amount (read-only), debit + credit account cards, function bar, info rows, Further options expander (starts expanded when a message is present). |

### Component structure (app)

```
modal-overlay#uz-payment-details-overlay
  modal-shell
    modal.modal--payment-details  (.pd--domestic | .pd--internal)
      modal__nav          ← title + close ×
      modal__body
        payment-details
          amount-hero           ← large amount + edit btn (domestic only)
          payment-details__to   ← "to" label + address + edit btn  [pd-domestic-only]
          payment-details__accounts  ← debit + credit cards         [pd-internal-only]
          payment-details__function-bar  ← named separator (1px, --color-separator)
          payment-details__info-rows     ← Status / Booking confirmation / Signed
          expander#uz-pd-further-toggle  ← Further options
          payment-details__further-content  ← Message (hidden by default)
      modal__footer        ← Confirm button
```

### Key design decisions

- **Function bar** (`.payment-details__function-bar`): a named section between the TextField / accounts area and the info-rows group. Contains a 1 px separator rule (`__rule`) followed by a row of three action buttons (`__actions`): **Edit** → opens payment flow at amount step (`data-pd-edit="amount"`), **Delete** (placeholder), **Copy** (placeholder). The button row is hidden on executed payments — only visible when `pd--pending` is present.
- **"to" section**: shows recipient label + address value only — no inline edit pencil. Editing is handled by the function bar's Edit button.
- **Status visibility**: edit buttons shown only when `pd--pending` class is present (CSS toggle). Executed payments show no edit buttons.
- **Info-rows spacing**: 8 dp gap between rows; 16 dp padding-top (from function bar) and padding-bottom (to expander).

### Notes

- Folder follows the same convention as other screens: `variants/<variant>/<breakpoint>/default.svg` (and `default.png`).
- New design-system components used: `chip` (Status), `expander` (Further options).


Branch: `feature/display-rows-and-account-cards`

# Display-only rows and account cards against the field anatomy (71): requirements

Roadmap item 71 (`specs/roadmap.md`), found in the audit of `specs/2026-11-08-field-anatomy-and-band-ink/` (64). Two kinds of `.form-field` are not text fields and so were left out of the 24 / 4 / control / 4 / 16 anatomy:

- **Display-only value rows:** `.form-field__row` without `--bordered` inside a field that is not `.form-field--readonly`: IBAN and Bank Name on Pay's recipient step and the value rows of the transfer's recipient step. They measure 89dp, or 81dp for a single line.
- **Account picker cards:** `.debit-account` (Debit account, Credit account, From, To, Custody account): 101dp, with no reserved text row, because the `::after` spacer rule excludes `:has(.debit-account)`.

Neither shows a helper or an error today, so nothing jumps. The aim is that every field in a form lines up on the same anatomy and can show a message later without moving what is below it.

## Scope

In:

- The display-only value rows become Figma's ReadOnly TextField: 88dp.
- The account picker cards keep their own height and get the anatomy around them: the 24dp label row, a 4dp gap, the card, a 4dp gap and a reserved 16dp text row.
- The Components page's Form field specimen gains the two cases.

Out:

- Account information and Share information (`.form-field--readonly` with their own 88dp grid, left as they were in 64).
- The Figma ReadOnly "Multiple Text Rows" case (94dp); the multiline values keep their layout.
- Showing a helper or an error on either kind: only the room is reserved.
- Any markup or ARIA change.

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | A display-only value row (a `.form-field__row` that is neither `--bordered` nor `--multiline`, in a field that is not `--readonly`) is a 40dp row with its underline inside the 40dp and no bottom padding. The field is then 24 + 4 + 40 + 4 + 16 = 88dp, the `::after` spacer already supplying the last 16dp | Figma's ReadOnly Default (`designs/components/form-field/text-field/variants/readonly-default`) is 88dp. Asked and answered in the interview |
| D2 | The row's value and edit button are centred in the 40dp; the edit button stays its 32dp target, so nothing is cropped | The same as the existing ReadOnly rows |
| D3 | An account picker card (`.debit-account`) keeps its own size. Its field gets the anatomy around it: the label is the 24dp row, the gap 4dp, and a 16dp text row is reserved under the card, by the same CSS-only `::after` spacer as other fields (the `:has(.debit-account)` exclusion is dropped) | The card is richer than a 40dp control (icon, name, IBAN, balance, chevron), so it is not resized; reserving the row means a future error cannot push the next control. Asked and answered in the interview |
| D4 | A field marked `.form-field--no-footer` still reserves nothing, as before, card or not | The opt-out exists for a reason (a field with something directly under it). See the open question on the sheets |
| D5 | No markup, ARIA, script or storage change; all through `css/styles.css` | Small contained diff (AGENTS.md); the rule of 64 (D6, D11) holds, so no VoiceOver gate |
| D6 | The Components specimen (roadmap 64's Form field section) shows the display-only row and the account card, each with its anatomy marks, at the same field rhythm | The design system documents the rule |
| D7 | Nothing new in the "Not using" list, no dependency, no page, no new token: it reuses `--form-field-gap`, `--form-field-label-row` and `--form-field-note-row` | Conventions |

## Context

- `.form-field__row` (`css/styles.css:3305`) is `display: flex; padding-bottom: var(--space-1); border-bottom: 0.0625rem solid var(--color-separator)`. 81dp = 24 + 4 + 33 (a 24dp line, 8dp padding, the 1px underline) + 4 + 16.
- `.form-field--readonly .form-field__row` (line 3434) already drops the padding; Account and Share information override to their own grid (lines 5913 and 6088).
- The `::after` spacer rule is at line 3272 and excludes readonly, `--no-footer`, an existing helper, an error and a footer, and `:has(.debit-account)`.
- Pickers: the transfer's From and To, Pay's Debit account, the trade sheet's Custody and Debit or Credit account (`form-field--no-footer` is used in `details-of-position.html`), and the copies on Payments, Overview, Account details and All bookings.
- Found while looking: `form-field--no-footer` appears twice, both in `details-of-position.html` (the trade sheet's two account fields, which opt out by D4); no Pay or transfer field uses it. So the cards that gain a reserved row are Pay's and the transfer's, and Buy and Sell are unchanged.

## Open questions

- Reserving 20dp under every card that is not `--no-footer` makes Pay's and the transfer's sheets taller. They must still fit without a new scroll; measured in the build, and if one does not, the spec is revisited with Klaudiusz, not widened.
- Whether the display-only rows of the transfer's recipient step are the same markup as Pay's. Expected yes.

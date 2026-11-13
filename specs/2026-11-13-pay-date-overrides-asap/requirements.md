Branch: `feature/pay-date-overrides-asap`

# The schedule step's date overrides the toggle (40): requirements

Roadmap item 40 (`specs/roadmap.md`), widened in the interview on 2026-11-13 to cover the internal transfer. Today, while "As soon as possible" (Pay) is on, "Execute on" opens nothing; in the transfer, "Immediately" hides the field until it is off (`28`'s D4, D5). One pattern replaces both: the toggle, with "Execute on" always visible under it, and the field always opens the calendar.

## Scope

**In:**

1. Pay (all three modes) and the internal transfer (both modes): the toggle plus an always-visible, always-enabled "Execute on" field that opens the calendar (D1)
2. What the field shows while the toggle is on: Pay the next working day, the transfer today (D2)
3. The calendar's range: Pay unchanged; the transfer offers today and weekends (D3)
4. How the toggle and the date follow each other (D4)
5. Pay's summary and confirmation name the next working day for "As soon as possible" (D5)
6. Screen readers hear the toggle's change (D7)

**Out (not in this branch):**

- Pending bookings executing on their date, and what an "As soon as possible" payment dated in the future means for the balance: roadmap 37 (D5)
- Public holidays (28's D3)
- The booking sheet's dates, Buy and Sell, the opening's appointment booking
- `js/app.js` and `spa-source.html`
- Other roadmap items

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **One pattern in Pay and the transfer:** the toggle row, and under it "Execute on", always visible, never disabled or greyed, always opening the calendar. The transfer's field is no longer hidden while "Immediately" is on (`iat-overlay.js` `executeOnField.hidden`). Pay keeps the label "As soon as possible", the transfer "Immediately" | Interview. Roadmap 40; the transfer follows it |
| D2 | **The toggle's own date ("the next possible day"):** Pay, the next working day (in Switzerland "as soon as possible" is that); the transfer, today (it executes within minutes). While the toggle is on the field shows that date | Interview. Supersedes 28's D4 (field shows today and opens nothing) |
| D3 | **The calendar's range:** Pay unchanged (Monday to Friday, next working day to twelve months ahead; today stays unpickable, 28's D2). The transfer: today to twelve months ahead, weekends pickable, because it runs within minutes. `UZBankDatePicker.executionRange` takes a flag for the transfer's range | Interview. Supersedes 28's D2 and D3 for the transfer only |
| D4 | **Toggle and date follow each other.** Picking the toggle's own date (D2) keeps or turns the toggle on; any other date turns it off. Turning the toggle on resets the date to the toggle's own date. Turning it off while the date is the toggle's own date moves the date to the next day that differs (Pay: the working day after; transfer: the next working day), so an "off" toggle never shows the "now" date | Interview, first three sentences. The last sentence is mine: an off toggle on its own date would contradict "picking the toggle's own date keeps it on". Check at review |
| D5 | **Pay "As soon as possible" on stays executed now:** the booking is `executed` and the money leaves at confirm, as today and as 23's D2. Only what it says changes: the summary's date is the next working day, and the confirmation reads "Your payment to X will be executed on 16.11.2026." instead of "is done." The transfer keeps "is done." | Interview. The copy and the balance disagree for a weekend payment until roadmap 37 makes "executes on its day" real. Flagged, not fixed here |
| D6 | **Recurring, Standing order and Recurring execution** use the same pair. The date is when it starts; with the toggle on, that is the toggle's own date (D2). Status stays `recurring` | Interview. 28's D5 already gave them one rule |
| D7 | **Screen readers:** a visually hidden `aria-live="polite"` line next to each toggle says "As soon as possible on, executes on 16.11.2026" / "off, executes on 18.11.2026" (the transfer: "Immediately on, executes today"). It speaks on a change of the toggle or the date, not on first paint. The field's label stays "Execute on, 16 November 2026, change date" in every state (the "change" suffix no longer depends on the toggle) | Interview. A date pick can flip the toggle silently |
| D8 | **An edited booking (23):** a pending booking opens with the toggle off and its date; an executed one with the toggle on and the toggle's own date. A date that is no longer allowed becomes the next allowed day, as 28 did | One rule on entry too |
| D9 | **Storage unchanged:** the date stays the `DD.MM.YYYY` label in `live.dateLabel` and `executeOn`; no new key | 28's D6 |
| D10 | **Copy and motion:** English, no em dashes; no new animation, so no new reduced-motion path | AGENTS.md |
| D11 | **The merge gate** (interview): `npm run build`; this `validation.md` in a real browser (Light and Dark, desktop and 390, keyboard, reduced motion), covering Pay and the transfer's schedule step; the baseline smoke test | Standard gate |

## Context

- Pay: `js/payment-overlay.js`: `paintScheduleStep` (231), `seedScheduleFromBooking` (266), `scheduleStatus` (177), the toggle's deferred repaint (725), the field's click (738), the confirmation copy (310 to 313). The date picker's `syncField` disables the field while the toggle is on (`js/date-picker.js` 78).
- Transfer: `js/iat-overlay.js`: `paintScheduleStep` (291), the Immediately click (622), the field's click (633), the confirmation copy (329). Markup in `overview.html`, `payments.html`, `account-details.html` (`#uz-iat-execute-on-field`, `data-step="schedule"`).
- The calendar: `js/date-picker.js` (`executionRange`, `laterLabel`, `render`), `js/form-field-sheet.js` `openDateSheet`.
- Earlier specs this revises: `specs/2026-11-04-execution-date/` (D2, D3, D4), `specs/2026-11-04-edit-pending-payment/` (D3).

## Open questions

- Does `openDateSheet` need to pass a range through to `render`? (Read it in group 1.)
- Where D4's "next day that differs" lands when the toggle is turned off on a Friday (the working day after is Monday).

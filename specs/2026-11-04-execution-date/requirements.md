Branch: `feature/execution-date`

# The execution date can be picked (28): requirements

Roadmap item 28 (`specs/roadmap.md`): in Pay and the internal transfer, turning off "As soon as possible" (Pay) or "Immediately" (transfer) shows an "Execute on" field, but nothing opens a date picker. The date stays today, so a "later" payment or transfer is pending for today and a recurring one starts today, and the confirmation says "will be made on" or "starts on" with today's date.

## Scope

**In:**

1. A calendar the app draws itself, opened from "Execute on" in Pay and in the transfer, as a sheet like the account and currency pickers (D1, D2)
2. Which dates can be picked: working days (Monday to Friday) from the next working day to twelve months ahead (D3)
3. How the field behaves around the toggle: off picks the next working day and makes the field open the calendar; on goes back to today (D4, D5)
4. The picked date flows through the summary, the confirmation and the stored booking, as the date does today (D6)

**Out (not in this branch):**

- What happens when a pending booking's date arrives (it executing, its money moving, a recurring one repeating): roadmap 37, added with this spec (D7)
- Public holidays (D3)
- The booking sheet's own dates, Buy and Sell (no execution date), the opening's appointment booking
- `js/app.js` and `spa-source.html`
- Other open roadmap items (29 and on)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The app's own calendar** (interview), not `<input type="date">`. It opens in the existing form sheet of `js/form-field-sheet.js` as a new sheet type (`date`): an anchored pop-up under the field from 1280 px, a bottom sheet below, with that sheet's motion, scrim, Escape and reduced-motion path. The grid itself is built by a new `js/date-picker.js` (`UZBankDatePicker`), so the sheet code stays about opening and closing. `form-field-sheet.js` gains a small `openDateSheet(anchor, options)` on `UZBankFormSheet` | Interview. It looks and works the same in every browser and takes the theme; reusing the form sheet keeps one way of opening a picker. No Figma design exists, so it follows the menu component's look |
| D2 | **The calendar:** a header with the month and year and Previous month / Next month icon buttons (`#i-chevron-left` / `#i-chevron-right`, already in the sprite); a row of weekday initials (Mo to Su, Monday first); a 7-column grid of day buttons. The selected day is filled with `--color-fg-interactive`; today has a ring but can't be picked (that is "as soon as possible"); days that can't be picked are dimmed and `aria-disabled`. Picking a day closes the sheet and writes the date. The month buttons disable at the range's ends. Colours only through `--color-*` tokens | A plain month grid is what people expect from a banking app; the selected state follows the app's interactive colour |
| D3 | **Allowed dates** (interview): Monday to Friday, from the next working day after today up to the same date twelve months ahead. Weekends can't be picked. No public holidays | Interview. Like a real bank without keeping a holiday table |
| D4 | **The toggle and the field:** turning "As soon as possible" / "Immediately" off sets the date to the next working day (not today) and makes "Execute on" a button that opens the calendar. Turning it on sets today again; in Pay the field then shows today and does not open anything (the transfer already hides it). A date carried in from an edited booking (roadmap 23) that is no longer allowed (past, or a weekend) becomes the next working day when the schedule step paints | Today is never a "later" date, so the default must move; the field opening only when it means something keeps "as soon as possible" honest |
| D5 | **Recurring and Standing order** (Pay) and Recurring execution (transfer) use the same field and rules: the date is when it starts. With the toggle on they start today, as now | One rule for every mode |
| D6 | **Storage unchanged:** the date stays the `DD.MM.YYYY` label in `live.dateLabel` and the booking's `executeOn`, as today. No new storage key. Bookings lists already order by it (`all-bookings.js` `dateSortKey`) | Smallest change; nothing that reads `executeOn` changes |
| D7 | **When the date arrives** (interview): out of this branch. A pending booking stays pending, as now. Its execution (money moving on the day, recurring repeats) is roadmap 37 | Interview. Keeps this branch to the picker |
| D8 | **Keyboard and screen readers:** the grid is a `role="grid"` with one focusable day (roving `tabindex`): arrow keys move a day or a week, Page Up / Page Down a month, Home / End the start or end of the week; Enter or Space picks; Escape closes without changing the date. Focus opens on the selected day; after a pick or Escape it goes back to "Execute on". Each day's label is the full date ("Monday, 9 November 2026"); the month header is a live region so moving months is announced. The field button reads "Execute on, 9 November 2026, change date" | The pickers' own keyboard rules (form sheet) plus what a grid needs |
| D9 | **Motion:** the sheet opens and closes like the other pickers (its existing reduced-motion path). Changing month has no animation | Nothing new to animate, so nothing new to reduce |
| D10 | **Copy:** the sheet title is "Execute on"; buttons "Previous month", "Next month". English, no em dashes | Matches the field |
| D11 | **Pages:** `js/date-picker.js` loads before `js/form-field-sheet.js` on the pages with Pay or the transfer: Overview, Payments, Account details. Not registered elsewhere (no new page) | Only those pages have the flows |
| D12 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (Light and Dark, a Multi-color theme, desktop and 390, keyboard, reduced motion); the baseline smoke test | Standard gate |
| D13 | **The transfer's Immediately switch paints last** (found in the build, also on `main`): its click defers `paintScheduleStep` with `setTimeout(…, 0)`, as Pay's toggle already does, so the paint runs after `app-mp.js`'s app-wide toggle handler has flipped the class. Before, the switch showed the opposite of its state (off while immediate) | The field this branch adds shows and hides with the switch, so a switch that shows the wrong state breaks it |

## Context

- Pay's schedule step: `overview.html` (also `payments.html`, `account-details.html`), `data-step="schedule"`: Single / Recurring / Standing order, the "As soon as possible" toggle and "Execute on" (`.form-field__date-wrap` with a calendar icon, a plain `span`). `js/payment-overlay.js`: `paintScheduleStep` (line 202) writes `live.dateLabel`, today while the toggle is on; `seedScheduleFromBooking` (227) carries an edited booking's date; `scheduleStatus` (141) gives `pending` / `recurring` / `executed`; `formatTodayDate` (82). The toggle's click is generic (`js/app-mp.js` around line 410).
- The transfer's schedule step: `#uz-iat-exec-type`, `#uz-iat-immediately-toggle`, `#uz-iat-execute-on-field` (hidden while Immediately is on), `#uz-iat-date-value`. `js/iat-overlay.js`: the toggle's click (541), the paint (291 to 301), `scheduleStatus` (227), `formatTodayDate` (164).
- The confirmation's "will be made on" / "starts on": `payment-overlay.js` 277, `iat-overlay.js` 323 (roadmap 15).
- The form sheet: `js/form-field-sheet.js`, `openDialog(title, anchor, flags)` (383) shows a native `<dialog>`, anchors from 1280 px (`positionFormSheet`), closes with an animation and has a reduced-motion path. The sheets over a sheet keep focus with roadmap 27's helper (it waits for the dialog's `close`).
- Stored bookings: `js/payment-state.js` copies `executeOn` from the flow (`applySchedule`, line 464).

## Open questions

None.

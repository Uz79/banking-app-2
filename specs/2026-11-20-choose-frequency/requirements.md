# Pay and the transfer: choose a frequency (45): requirements

Branch: `feature/choose-frequency`

## Scope

In: a "Repeats" choice (Weekly, Monthly, Quarterly, Yearly) in the schedule step of Pay (modes Recurring and Standing order) and of the transfer (Recurring execution); the booking stores it; `nextDueDate` in `js/payment-state.js` handles all four; the confirmation names it; Edit opens on the rule's own frequency.

Out: Single mode; changing the frequency of a rule from its sheet; built-in standing orders (they stay monthly); skipping one occurrence; end dates. Roadmap item 45 (Later), follows 44, whose "Standing order: <frequency>" line now has more than Monthly to show.

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | Four choices: Weekly, Monthly, Quarterly, Yearly. Default Monthly. | The labels already exist (`frequencyLabel`); Monthly is what every rule stored so far. |
| D2 | A "Repeats" choice sits under the mode switch, shown only when the mode is Recurring or Standing order, hidden on Single. Same control and wording in Pay and the transfer. | Answers "where in the schedule step"; no disabled control on the common path. |
| D3 | The control is a segmented control of four options, reusing `.segmented` (tokens only). On a phone it wraps or scrolls cleanly rather than truncating labels. | Existing component, no new dependency; four short words fit one row at 390px. |
| D4 | Dates: Weekly = every 7 days from the start date; Monthly as now (the anchor day, clamped to month end); Quarterly = the anchor day every 3 months; Yearly = the anchor day each year. Weekend results move to the next Monday as monthly does. A 31st or 29 February anchor clamps to the month's last day. | One rule for the weekend and month end across all four, as 37 settled for monthly. |
| D5 | Weekly keeps the start date's weekday as its anchor (not a day of month); `anchorDay` stays the day of month for the other three. | A weekly rule must not drift to a day of month. |
| D6 | The booking stores `frequency` as now; Pay and the transfer pass the chosen value instead of the fixed 'monthly' (`payment-state.js` about 474 and 627). Nothing new in `localStorage`, so no new key. | The field already exists end to end (43, 47). |
| D7 | The confirmation sentence gains the frequency: "Your recurring payment to X starts on 01.12.2026, repeating monthly." Same shape for a standing order and the transfer. | Says how often, which the old sentence did not. |
| D8 | Edit and Copy open the schedule step on the booking's own frequency. An edit of a standing order's next payment (one instance) shows no Repeats choice, as it is not the rule. | A rule edit must not silently reset to Monthly. |
| D9 | Accessibility: the choice is a radio group named "Repeats" (arrow keys, visible focus ring in `--color-fg-interactive`); the confirmation reads the same words. Nothing animates. | Conventions: keyboard, focus, reduced motion. |
| D10 | Copy: no em dashes, short, plain; "Repeats", "Weekly", "Monthly", "Quarterly", "Yearly". | Project copy rule. |

## Context

- `js/payment-overlay.js`: `scheduleStatus()` (about 181), `seedScheduleFromBooking()` (about 291, says the booking does not store Standing order), `paintConfirmationDialog()` (about 329).
- `js/iat-overlay.js`: recurring segmented control (about 676), confirmation sentence (about 340).
- `js/payment-state.js`: `monthlyOccurrence` (799), `nextDueDate` (807, throws for anything but monthly), `runDueRules` (about 862 to 891), `commit` and `update` pass `source.frequency || 'monthly'`.
- Schedule markup is repeated per page: `payments.html`, `account-details.html`, `all-bookings-and-payments.html`, `overview.html`, `spa-source.html`, `partials/iat-overlay.html`.
- No conflict with `tech-spec.md`'s "Not using" list.

## Open questions

- Whether a Weekly rule starting on a weekend moves to Monday and then stays on Mondays (build and check against D4/D5).
- Whether `bookingRowLook` chips (Monthly only in `built-in-bookings.js` about 395) need the other labels: check in the build.

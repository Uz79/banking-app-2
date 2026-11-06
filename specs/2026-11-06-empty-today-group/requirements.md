Branch: `feature/empty-today-group`

# No empty "Today" group (61): requirements

Roadmap item 61 (`specs/roadmap.md`), found in Klaudiusz's manual check on 2026-11-06. Household's All bookings shows a "Today" header with its balance and no rows: 56's D5 put the group there for payments made in the app.

## Scope

**In:**

1. A booking group shows only while it has a row: Household's Today on All bookings until a payment is made in the app, and any group left without rows (D1, D2)
2. The month band of a hidden group's month moves to the first group shown (D3)

**Out (not in this branch):**

- Demo data moving with the real date (62)
- What a group's header shows

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **A group with no visible row is hidden, with one divider next to it**, whatever made it empty: `syncBuiltInRows` in `js/data-render.js` widens from "emptied of built-in rows" to "no row shown"; it runs after the in-app rows are drawn, so the group shows again once one is (interview) | One rule for every list; 42's sync already hides a group a Delete empties |
| D2 | **On All bookings and Account details alike** | Both run the same sync |
| D3 | **A hidden group still hands on its month**: `renderMonthSeparators` in `js/all-bookings.js` carries `data-bookings-month-start` from hidden groups too, and puts the band before the first group shown | Household's June starts at the Today group; hiding it would drop June's band |
| D4 | **No new storage key, no markup change** | |

## Context

- `all-bookings-and-payments.html`: Household's Today group (`data-day="today"`, `data-bookings-month-start="2026-06"`) has a header and no rows; in-app executed bookings are added to it by `renderBookings` (`js/all-bookings.js`).
- `js/data-render.js` `syncBuiltInRows` (about line 184): hides a group that has a built-in row and no row shown, and a divider next to it; marks them `data-builtin-emptied` so the next sync can show them again.
- `js/all-bookings.js` `renderMonthSeparators` (about line 547): Executed groups take their month from `data-bookings-month-start`, carried down over visible groups only.

Branch: `feature/booking-rows-keyboard`

# Booking rows by keyboard (33, 52): requirements

Roadmap items 33 and 52 (`specs/roadmap.md`), the same bug found twice: a booking row is a `div` with a click handler (`js/payment-details.js`), with no tab stop, no role and no Enter or Space. A keyboard or screen reader user can't open a booking's sheet, so its Edit, Delete and Copy are out of reach, and after a Delete focus has nowhere to land (42 announces "Payment deleted." instead). 52 is closed as 33's duplicate; its asks (how a row reads, focus after the sheet and after a Delete) are in this spec.

## Scope

**In:**

1. Every booking row is a `<button>`: the built-in rows on Account details and All bookings, and the rows built by script (payments made in the app, a standing order's next payment) (D1, D2)
2. A row reads as its visible text (D3)
3. A row looks as it does today, with the app's focus ring for the keyboard (D4)
4. Focus after the sheet closes: back on the row; after a Delete, or an edit that replaces the row, on the next row (D5, D6)

**Out (not in this branch):**

- Groups read with their date (a `role="group"` named by the date heading); the date is heard as the heading before the rows
- Arrow keys between rows or between the status tabs (the tabs take Tab and Enter, as before)
- `spa-source.html`, the old reference page (tech-spec: "Do not extend")
- Overview, which lists no booking rows

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **A booking row is a `<button type="button">`** with the class it has (`booking-row`), its data attributes and its children (icon, name, chip, amount) unchanged (interview) | Native Tab, Enter and Space and a role, with no script of its own. It opens a sheet in place; `product-item` is an `<a>` because it goes to a page |
| D2 | **Every place that makes a row**: the static rows in `account-details.html` and `all-bookings-and-payments.html`, `buildBookingRow` in `js/data-render.js`, `buildRow` and `instanceRow` in `js/all-bookings.js` | One row, one element, wherever it comes from |
| D3 | **A row's name is its visible text** (interview): "Apple Pending CHF -100.00". No `aria-label`. The icon stays `aria-hidden` | Nothing to keep in sync; the date is the group's heading, heard before the rows |
| D4 | **The row keeps its look**: a reset for the button's own styles (font, colour, background, border, full width, text left) in the `.booking-row` rule, so the hover and pressed layer stay as they are. The ring is the app's base rule (`:where(:focus-visible)`, 25) | Only the element changes, not the design |
| D5 | **Closing the sheet puts focus back on the row**, through the sheet's focus helper (`UZBankSheetFocus`, 27), which keeps what was focused when the sheet opened. The ring shows only after a keyboard close, as on every sheet | The helper does this already for any opener that can take focus |
| D6 | **After a Delete, or an edit that replaces the row, focus moves to the next row in the list, else the one before, else the tab of the list (All bookings) or the Show all button (Account details).** "Payment deleted." is still announced | The row is gone; 52 asks for the next row. A row that can't take focus leaves focus on the page body, and the next Tab starts from the top |
| D7 | **Hidden rows can't be reached**: a row hidden by search or by a delete has `hidden`, which takes it out of the tab order | `[hidden] { display: none !important; }` already applies |

## Context

- Rows: 34 in `all-bookings-and-payments.html`, 7 in `account-details.html`; built in `js/data-render.js` (`buildBookingRow`, about line 100) and `js/all-bookings.js` (`buildRow` line 510, `instanceRow` line 586).
- The click handler: `js/payment-details.js` line 961 (`e.target.closest('.booking-row')`), which `currentRow` keeps for the edit and delete. A button's Enter and Space fire `click`, so the handler stays.
- Row styles: `css/styles.css` line 55 (the shared hover and pressed layer, `::before`) and line 2058 (`.booking-row`: flex, padding, radius, pointer); line 8025 repeats `cursor: pointer`.
- The sheet's focus: `js/dialog-focus.js` (`openers`, `focusOpener`, `canTakeFocus`). The Delete: `js/payment-details.js` line 924. An edit hides its built-in row (`data-replaced`, `removedBuiltIns`, 42).

## Open questions

- Whether an edit's focus can land on the edited payment's new row instead of the next one (D6), if the new row is listed at once.

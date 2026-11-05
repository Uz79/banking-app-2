Branch: `feature/bookings-edit`

# All bookings: the sheet's Edit buttons open Pay (31): requirements

Roadmap item 31 (`specs/roadmap.md`). A pending or recurring payment's sheet on All bookings shows "Edit amount" and "Edit payment". Both close the sheet and set `#pay/amount`, but the page has no Pay sheet, so nothing opens. On Account details the same buttons open Pay on the amount step with the booking's details.

## Scope

**In:**

1. All bookings carries the Pay sheet: its markup and the scripts it needs, as Account details does (D1, D2, D3)
2. Edit amount and Edit payment open Pay on the amount step with the booking's recipient, amount and schedule, as on Account details (D4)
3. Confirming the edit updates the booking; the list redraws in place, on the same tab, with search and the month chips as they were (D5)
4. Closing Pay without confirming asks "Discard changes?" with "Continue editing", as on Account details (D6)

**Out (not in this branch):**

- A Pay button or a new payment from All bookings: the sheet is reached only through Edit (D7)
- Editing one of the page's built-in example rows (Swisscom, Tax office Zurich and others) hides that row only until a reload, then it shows again next to the edited copy. The same happens on Account details today. New roadmap item 42 (D8)
- Booking rows reachable by keyboard (33), the confirmation dialog's focus (41), a pending transfer's status (32)
- Making the Pay markup shared instead of copied per page
- The page's built-in rows always open as "Executed" with no Edit, Pending and Recurring ones too (`buildAllBookingsRowData` in `js/payment-details.js` ignores the row's `data-status`). Found in the build; new roadmap item 43. Until then only payments made in the app can be edited on All bookings

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Give All bookings the Pay sheet** (interview), rather than hiding Edit there or sending the user to Account details | Interview. Editing works where the payment is found, and the list redraws by itself |
| D2 | **Copy the Pay markup from `account-details.html`** (the `.modal-overlay` with `.modal--payment-flow` and its `.confirmation-dialog`, lines 2632 to 2890) into `all-bookings-and-payments.html`, before the booking sheet (D11). A fourth copy, like Overview, Payments and Account details. The icons it uses are in the page's inline sprite already | The project's pattern: each page carries its own sheet markup. A shared template would be a new pattern and touch three pages that work |
| D3 | **Load the scripts Pay needs, in Account details' order**: `date-picker.js`, `form-field-sheet.js`, `payment-exit-confirm.js`, `data-render.js` and `payment-overlay.js`, with `payment-state.js` before `payment-overlay.js` and `payment-details.js` after it. The internal transfer and Account information are not loaded | Same order as the page where editing works. Nothing else on All bookings needs the transfer |
| D4 | **No change to `payment-details.js` or `payment-overlay.js` unless the check shows one is needed.** The edit hand-off (`__UZ_PD_EDIT_CONTEXT__`, then `#pay/<step>`) has nothing page-specific; any change found in the build is recorded here as a new decision | Small diff. The code already works on Account details |
| D5 | **After Done, the user stays on All bookings** (interview): Pay closes, the list redraws through `uzbank:state-changed` (already wired in `js/all-bookings.js`), the active tab, search text and month chip stay. Focus goes back as it does on Account details | Interview. Matches the other pages |
| D6 | **The exit prompt is Pay's**: "Discard changes?" with "Continue editing" and "Discard" (roadmap 30) | Already Pay's behaviour; nothing to add |
| D7 | **No new way into Pay on All bookings.** Only Edit opens it. A `#pay/...` address typed by hand opens it too, as on any page that carries the sheet | Not asked for; the page is a list, not a place to start payments |
| D8 | **Example rows that come back after a reload go to the roadmap** (interview) as item 42, for both pages | Interview. Fixing it needs storage and touches the reset |
| D9 | **No motion, token or layout change.** The sheet uses the shared `.modal-overlay` styles, which have no `data-screen` rules for Account details | Nothing new to animate or style |
| D10 | **The merge gate** (interview): `npm run build`; this branch's `validation.md` in a real browser (Light and Dark, desktop and 390, keyboard, reduced motion); the baseline smoke test | Standard gate |
| D11 | **The Pay markup comes before the booking sheet** (found in the build). `js/payment-overlay.js` takes the first `.modal-overlay` and `.modal-shell` on the page (lines 15 and 20); placed after the booking sheet, Pay bound to the booking sheet and never opened. Account details has the same order. The JS stays as it is (D4) | Smallest fix, no change to code that three pages share |

## Context

- The Edit buttons: `all-bookings-and-payments.html` 2957 ("Edit amount") and 3003 ("Edit payment"), both `data-pd-edit="amount"`. The handler is in `js/payment-details.js` (around 800): it stores the step and closes the sheet, then sets the edit context and `location.hash = '#pay/' + step` (around 740 to 773).
- `js/payment-overlay.js` reads the context (around 915) and, for an example row, hides it after the commit (1005 to 1007, `hidden` and `data-replaced`). That hide is not stored, which is item 42.
- All bookings today loads: `storage-migrate`, `theme-boot`, `admin-boot`, `section-build-boot`, `document-ready`, `section-build-motion`, `shell-nav`, `analytics`, `scroll-edge-chrome`, `dialog-focus`, `payment-details`, `app-mp`, `payment-state`, `all-bookings`, `nav-button-motion`, `cta-pulse`, `step-indicator`, `wiggle`, `admin`. Note `payment-details.js` loads before `payment-state.js` here; on Account details it loads after.
- `date-picker.js` and `form-field-sheet.js` build their own DOM, so they need no markup.
- The list redraws on `uzbank:state-changed` (`js/all-bookings.js` 646 and 660).
- Only Account details, Overview and Payments load `payment-overlay.js` today.

## Open questions

- Where focus lands after Done. Answered in the build: on the page itself (`body`), since the Edit button that opened Pay sits in the closed booking sheet; the next Tab starts at the top of the page. Left as it is; item 41 covers focus around the confirmation.
- Whether hiding an example row inside a month leaves an empty month band. Not reachable until 43 gives built-in rows their Edit; left to 42 and 43.

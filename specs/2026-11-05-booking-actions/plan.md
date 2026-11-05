# Booking actions: Edit, Delete, Copy and Done on every booking (42): plan

Branch: `feature/booking-actions`. Decisions are cited as D1 to D17 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. Removed built-in rows survive a reload (D1 to D5, D9, D12)

- [x] `apps/web/all-bookings-and-payments.html`, `account-details.html`: `data-builtin-id` on every built-in row that can be edited, deleted or copied (D1). Only the pending rows need one; Copy works without
- [x] `apps/web/js/payment-state.js`: `removedBuiltIns` in the state, loaded, saved and normalised; `removeBuiltIn(id)`; Apple's `STATIC_TODAY_OUTFLOW` counts only while `ad-household-apple` is listed (D2, D12)
- [x] `apps/web/js/data-render.js`: hide and show built-in rows from the list on load and on state change; hide an emptied group with its divider (D3, D5)
- [x] `apps/web/js/all-bookings.js`: a month band with no visible row hides; "No pending payments." for an empty tab (D5)
- [x] `apps/web/js/payment-details.js`, `js/payment-overlay.js`: the edit context carries the row's id; Pay's commit records it instead of hiding the row in the page (D4); Edit keeps the row's date, Apple today's (D9)
- [x] Check: edit Swisscom on All bookings and Apple on Account details, reload: the example row stays hidden, the edited booking shows; Household after Apple's edit counts 100 once; Profile reset brings both rows back

## 2. The function bar and Done (D6 to D8, D16, D17)

- [x] `apps/web/js/payment-details.js`: one function decides the actions per booking; each button and the amount's pencil show by it; the bar hides when there is none (D6 to D8)
- [x] `apps/web/css/styles.css`: replace the `pd--editable` / `pd-pending-only` gating of the bar; the bar on the transfer variant (D6)
- [x] `partials/payment-details-overlay.html`, `account-details.html`, `all-bookings-and-payments.html`: footer "Done"; bar markup as needed (D16, D17)
- [x] Check every row type on both pages: built-in and app-made pending payments (Edit, Delete, Copy), executed payments out (Copy), pending transfer (Delete), standing orders (as before), trades and money in (no bar); the footer reads "Done"

## 3. Delete (D10 to D13)

- [x] `apps/web/js/payment-state.js`: `deleteBooking(id)`, both legs of a transfer (D11)
- [x] `apps/web/js/payment-details.js`: Delete asks with the shared prompt, then removes and closes; a polite status line; focus follows the sheet's close, as rows can't take focus (52) (D10, D11, D13)
- [x] Check: delete a built-in pending row, an app-made pending payment, a pending transfer (both legs, both accounts' lists), and Apple (Household back to 10'000); Keep and Escape change nothing; reload keeps them gone; reset brings built-ins back

## 4. Copy (D14, D15)

- [x] `apps/web/js/payment-details.js`: Copy writes an edit context with no booking id or row id, and a fresh schedule; Pay opens at the amount step (D14)
- [x] Check: copy an executed payment (Migros on All bookings): Pay opens with the recipient and amount, As soon as possible on; Execute adds a new booking; the original is unchanged

## 5. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`), the baseline smoke test and the dated "Checked on" line (reduced motion left for Klaudiusz)
- [x] Docs: `specs/roadmap.md` 42 marked done, plus new items 51 to 53; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md`: a Decisions row for the booking sheet's actions; `apps/web/README.md`: `removedBuiltIns` in `uzBankWebPaymentState`'s shape

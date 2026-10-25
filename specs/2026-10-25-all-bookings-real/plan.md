# All bookings: make the page real, with an always-visible search: plan

Branch: `feature/all-bookings-real`. Decisions are cited as D1 to D14 from `requirements.md`. The groups run through to validation without stopping, unless a review stop is asked for.

## 1. The always-visible search field (D1 to D4, D12, D14)

What you see: on All bookings the field is in the toolbar next to the tabs (desktop and tablet) or on its own row under them (phone); there is no Search button; typing filters the list at once; clear and Escape empty it.

- [x] `all-bookings-and-payments.html`: remove the Search button and the expandable bar; add the field (`recipient-search__*` classes, `role="search"`, empty state and live region) in the toolbar
- [x] `css/styles.css`: replace the `.all-bookings__search*` rules (including the open transition and its reduced-motion rule) with toolbar rules: one row with the field filling the width, the field on its own row at phone width; narrow selectors, tokens only
- [x] `js/all-bookings.js`: `bindSearch` without the toggle (no open or close, no focus return); Escape clears; month chips dimmed and inert only for months with no match (D2)
- [x] Check in the browser: Light and Dark, desktop, 768px and 390px, keyboard

## 2. The tabs (D5, D6)

What you see: Pending and Recurring show their own lists, Executed shows the full list; the month bar appears only on Executed; a query narrows the active tab only.

- [x] `all-bookings-and-payments.html`: `data-status="executed"` on the existing rows; three `role="tabpanel"` lists with `aria-controls` on the tabs; mock rows grouped under date labels for Pending and Recurring
- [x] `js/all-bookings.js`: tab switching shows one panel, hides the month bar and the dock on Pending and Recurring, scrolls to the top; the search index follows the active panel
- [x] `css/styles.css`: group label for the date headers of the two new lists (existing booking-group tokens)
- [x] Check: the sticky header, month dock and merge on Executed still work after switching back and forth; a query is kept when the tab changes

## 3. Booking status in the state (D7 to D9, D11)

What you see: pay with a later date and the booking is pending: the balance does not change and it is not in the Today lists elsewhere; pay now and everything is as before.

- [x] `js/payment-state.js`: `status` and an execute-on date on bookings; `accountRunningBalance`, sums and Today balances count executed only; one limit of 100 bookings; comment block updated
- [x] `js/payment-overlay.js`, `js/iat-overlay.js`: pass the status and date from the schedule step to the commit (D8); `commitTradeOrder` stays executed
- [x] `js/data-render.js`: Today lists on Account details render executed bookings only
- [x] Check: pay now, pay later (pending), pay with a recurring schedule, then Overview, Account details and the sheets; Reset demo data

## 4. In-app bookings on All bookings (D10)

What you see: pay or transfer, open All bookings: the booking is at the top of Today in Executed (or in Pending or Recurring), the Today header follows, and a search finds it.

- [x] `js/all-bookings.js`: render the viewed account's bookings from `UZBankPayState` into the right panel and refresh on `uzbank:state-changed`; Today header rule; rebuild the search index after each render
- [x] `all-bookings-and-payments.html`: a Today group in the Executed list that the render can fill (the static Today group already exists); an empty-state element per panel
- [x] Check: the three accounts (`?account=household`, `savings`, `deposit`), both legs of a transfer, a trade, 101 bookings drop the oldest

## 5. Wrap-up

- [x] `specs/tech-spec.md`: the Decisions row for the search pattern (written with the spec)
- [x] `specs/tech-spec.md`: the All bookings pages row says the tabs are real (D13)
- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`), including the baseline smoke test, with the dated "Checked on" line filled in
- [x] Docs: `specs/roadmap.md` item 12 marked done with the spec link; `CHANGELOG.md` under Unreleased; `apps/web/README.md` unchanged (no new key or file)

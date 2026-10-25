# All bookings: make the page real, with an always-visible search: validation

Branch: `feature/all-bookings-real`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5175/overview.html`; agents use 5199). Unless a line says otherwise: desktop, Light and Dark.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

## 2. The search field (D1 to D4, D12)

- [x] No Search button on any size; the field is visible on load with the placeholder "Search bookings"
- [x] Desktop: one row, tabs on the left, the field filling the rest; at 768px the same
- [x] 390px: the field on its own full-width row directly under the tabs
- [x] The search icon is inside the field; the clear button shows only once there is text and empties the field, keeping focus in it
- [x] Typing "coop" leaves only Coop rows and their day groups; "1800" matches `1'800.00`; case and surrounding spaces ignored; a date such as "28.05" matches nothing
- [x] No match shows `No bookings match “query”`; clearing restores the list
- [x] Escape empties the field; the live region announces the match count
- [x] Month chips: dimmed and inert for months with no match, the rest still jump; the dock and the merge work with a query typed
- [x] The query stays when the tab changes and filters the new tab only
- [ ] Keyboard: Tab reaches the tabs, the field, the clear button, then the month chips, each with a visible focus ring
- [ ] Light, Dark, a Multi-color theme; reduced motion (nothing animates on the field)
- [x] No em dashes in the new copy

## 3. The tabs (D5, D6)

- [x] Executed shows the full list as before; Pending and Recurring show their own rows under date labels
- [x] The month bar and the dock show on Executed only; the sticky header returns to the title on the other tabs; switching back restores them
- [x] Switching tabs scrolls to the top; the tabs have `aria-controls`, the panels are `role="tabpanel"`
- [x] The page works for `?account=household`, `savings` and `deposit`

## 4. In-app bookings and status (D7 to D11)

- [x] First visit (nothing in `localStorage`): the page looks as before, apart from the toolbar
- [x] Pay now (as soon as possible): the booking is at the top of Today in Executed on Household, the Today header follows, the balance falls, and the search finds it
- [x] Pay with a later date: it appears in Pending, the balance and the Today lists on Account details and Overview do not change
- [x] Pay with a recurring or standing order schedule: it appears in Recurring, no balance change
- [ ] Internal transfer now: both legs appear, one on each account's page; a later or recurring transfer lands in Pending or Recurring and moves no money
- [ ] A trade order appears in Executed for its account
- [x] Reload: everything persists; Reset demo data clears the in-app rows and restores 9'900 and the original totals
- [x] 101 bookings drop the oldest (checked by script, not by hand)
- [x] Account details and Overview still agree with the page (balances, sums, Today lists)
- [ ] The edit flow for a pending payment on Account details still works

## 5. Baseline smoke test

Run 2026-10-25 on port 5199 (desktop, Chrome), after the changes of this branch. Full list run the day before for the previous branch; this run repeats the parts this branch can touch.

- [x] `npm run build` succeeds; no console errors on the pages visited
- [x] ★ Pay, full flow through the UI: a Single payment now is executed, the balance falls (9'400); a Recurring one is recorded without moving money
- [x] Internal transfer through the UI completes (a pending one records both legs, balances unchanged)
- [x] Custody account, a position, Buy opens the trade flow and is dismissed with Discard
- [x] All bookings: tabs, month chips and search work (Light and Multi-color)
- [x] ★ Theme: Custom 08 recolours All bookings and its search field; the UZ Bank card restores the default
- [x] Demo data reset restores 9'900, 64'900 and the original Today header
- [x] Design system hub loads
- [ ] Overview toggle and reload, the status message, User Type slider, Legibility and the Design system sub pages were not repeated (code untouched by this branch; checked the day before on the previous branch)
- [ ] Reduced motion: not checked (system setting not toggled)

Checked on 2026-10-25 against `feature/all-bookings-real`, Chrome on port 5199, desktop width (2391px), 768px and 390px in an iframe for the toolbar, Light, Dark (navy) and one Multi-color theme (Custom 08). Balance, status and cap checks were run partly through `UZBankPayState` calls (three bookings of each status, 105 payments for the limit) and partly through the real Pay and transfer sheets. Build passes.
Not checked: a pending payment (Pay with "as soon as possible" off) through the UI, a trade order appearing on the Custody page, the edit flow for a pending payment on Account details, a screen reader reading the field and the match count, reduced motion, the baseline items listed above, the transfer's both-legs rows on the other account's page through the UI (checked through the state), and keyboard order beyond the page controls (the tab stop before Executed is a pre-existing "Month" group).

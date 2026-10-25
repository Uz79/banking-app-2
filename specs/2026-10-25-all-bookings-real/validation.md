# All bookings: make the page real, with an always-visible search: validation

Branch: `feature/all-bookings-real`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5175/overview.html`; agents use 5199). Unless a line says otherwise: desktop, Light and Dark.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

## 2. The search field (D1 to D4, D12)

- [ ] No Search button on any size; the field is visible on load with the placeholder "Search bookings"
- [ ] Desktop: one row, tabs on the left, the field filling the rest; at 768px the same
- [ ] 390px: the field on its own full-width row directly under the tabs
- [ ] The search icon is inside the field; the clear button shows only once there is text and empties the field, keeping focus in it
- [ ] Typing "coop" leaves only Coop rows and their day groups; "1800" matches `1'800.00`; case and surrounding spaces ignored; a date such as "28.05" matches nothing
- [ ] No match shows `No bookings match “query”`; clearing restores the list
- [ ] Escape empties the field; the live region announces the match count
- [ ] Month chips: dimmed and inert for months with no match, the rest still jump; the dock and the merge work with a query typed
- [ ] The query stays when the tab changes and filters the new tab only
- [ ] Keyboard: Tab reaches the tabs, the field, the clear button, then the month chips, each with a visible focus ring
- [ ] Light, Dark, a Multi-color theme; reduced motion (nothing animates on the field)
- [ ] No em dashes in the new copy

## 3. The tabs (D5, D6)

- [ ] Executed shows the full list as before; Pending and Recurring show their own rows under date labels
- [ ] The month bar and the dock show on Executed only; the sticky header returns to the title on the other tabs; switching back restores them
- [ ] Switching tabs scrolls to the top; the tabs have `aria-controls`, the panels are `role="tabpanel"`
- [ ] The page works for `?account=household`, `savings` and `deposit`

## 4. In-app bookings and status (D7 to D11)

- [ ] First visit (nothing in `localStorage`): the page looks as before, apart from the toolbar
- [ ] Pay now (as soon as possible): the booking is at the top of Today in Executed on Household, the Today header follows, the balance falls, and the search finds it
- [ ] Pay with a later date: it appears in Pending, the balance and the Today lists on Account details and Overview do not change
- [ ] Pay with a recurring or standing order schedule: it appears in Recurring, no balance change
- [ ] Internal transfer now: both legs appear, one on each account's page; a later or recurring transfer lands in Pending or Recurring and moves no money
- [ ] A trade order appears in Executed for its account
- [ ] Reload: everything persists; Reset demo data clears the in-app rows and restores 9'900 and the original totals
- [ ] 101 bookings drop the oldest (checked by script, not by hand)
- [ ] Account details and Overview still agree with the page (balances, sums, Today lists)
- [ ] The edit flow for a pending payment on Account details still works

## 5. Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when the branch reaches this step, and tick it.

Checked on: not yet.

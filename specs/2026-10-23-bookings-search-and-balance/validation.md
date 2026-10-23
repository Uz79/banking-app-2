# All bookings search and the Household balance: validation

Branch: `feature/bookings-search-and-balance`. Tick each item in a real browser (`cd apps/web && npm run dev`, `http://localhost:5175/overview.html`; agents use 5199). Unless a line says otherwise: desktop, Light and Dark.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

## 2. The balance rule (D1 to D4)

- [x] First visit (nothing in `localStorage`): Household 10'000 minus the static Apple 100 = 9'900 on Overview, and the same on the Account details card, the All bookings card and the payment sheet's debit row
- [x] After a payment of 500: 9'400 everywhere above, and the Overview total ("Accounts & investment") and the Account details total ("All accounts") equal the sum of their rows
- [x] After an internal transfer of 500 from Household to Savings: Household and Savings update on every page and sheet, and the totals stay consistent
- [ ] The transfer and trade flows show the running Household and Savings balances; Custody stays 20'000
- [x] The Account details carousel: Household (first slide) and Savings (second slide)
- [ ] All bookings with `?account=savings` and `?account=deposit` show the right balance
- [x] Reset demo data restores 9'900 and the original totals everywhere
- [x] Reload after a payment: the balances persist and still agree
- [ ] The Yesterday and day headers of the bookings lists are unchanged

## 3. Search (D5 to D10)

- [x] The Search button opens the bar, moves focus to the field, and sets `aria-expanded`; it closes with the button, with Escape, and focus returns to the button
- [x] Typing "coop" leaves only Coop rows and their day groups; "100" matches amounts; matching ignores case and surrounding spaces
- [x] No match shows the empty state with the query; clearing the field (clear button) restores the full list and keeps the bar open
- [x] Closing the bar restores every row and day group
- [x] The bar opens under the toolbar without moving the sticky header; the month bar and the merge into the dock still work with the bar open and closed; the month chips are inert and dimmed while a query is typed and work again after clearing
- [x] Switching the tabs (Executed, Pending, Recurring) with a search active keeps the filter
- [ ] The live region announces the match count; a screen reader reads the field's label (not checked unless a screen reader is run)
- [x] Keyboard: Tab reaches the button, the field and the clear button in order, with a visible focus ring
- [ ] Light, Dark, a Multi-color theme, desktop and 390px, with the on-screen keyboard height in mind on a phone
- [ ] Reduced motion: the bar opens and closes at once
- [x] No em dashes in the new copy

## 4. Baseline smoke test

Not run on this branch yet. Copy the checklist from `specs/baseline/validation.md` here and tick it before merging.

Checked on 2026-10-23 against `feature/bookings-search-and-balance`, Chrome on port 5199, desktop width (2391px) and a 390px iframe, Dark (navy default), Light not separately, one Multi-color theme (orange) for the search bar. The balance checks were run through the payment and transfer commit functions plus the Overview, Account details, All bookings and payment sheet pages; reset and reload persistence were checked on Overview and All bookings. Build passes.
Not checked: the real UI Pay and internal transfer summary steps, the trade flow balances, `?account=savings` and `?account=deposit` after a payment, Yesterday and day header values, Light mode of the search bar, the live region with a screen reader, reduced motion (CSS path read, system setting not toggled), the baseline smoke test (section 4).

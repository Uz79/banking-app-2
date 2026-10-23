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
- [x] The transfer and trade flows show the running Household and Savings balances; Custody stays 20'000
- [x] The Account details carousel: Household (first slide) and Savings (second slide)
- [x] All bookings with `?account=savings` and `?account=deposit` show the right balance
- [x] Reset demo data restores 9'900 and the original totals everywhere
- [x] Reload after a payment: the balances persist and still agree
- [x] The Yesterday and day headers of the bookings lists are unchanged

## 3. Search (D5 to D10)

- [x] The Search button opens the bar, moves focus to the field, and sets `aria-expanded`; it closes with the button, with Escape, and focus returns to the button
- [x] Typing "coop" leaves only Coop rows and their day groups; "100" matches amounts; matching ignores case and surrounding spaces
- [x] No match shows the empty state with the query; clearing the field (clear button) restores the full list and keeps the bar open
- [x] Closing the bar restores every row and day group
- [x] The bar opens under the toolbar without moving the sticky header; the month bar and the merge into the dock still work with the bar open and closed; the month chips are inert and dimmed while a query is typed and work again after clearing
- [x] Switching the tabs (Executed, Pending, Recurring) with a search active keeps the filter
- [ ] The live region announces the match count; a screen reader reads the field's label (not checked unless a screen reader is run)
- [x] Keyboard: Tab reaches the button, the field and the clear button in order, with a visible focus ring
- [x] Light, Dark, a Multi-color theme, desktop and 390px, with the on-screen keyboard height in mind on a phone
- [ ] Reduced motion: the bar opens and closes at once
- [x] No em dashes in the new copy

## 4. Baseline smoke test

Run 2026-10-23 on port 5199 (desktop, Chrome). ★ items repeated in Dark only; the phone width was checked for the search bar only.

- [x] `npm run build` succeeds; no console errors on the pages visited
- [x] ★ Overview loads with sidebar and the 3D character lower right
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Page transitions in the right directions (seen only in passing, not judged)
- [x] The "Open payment!" message appears after about 12 s; tapping it dismisses it
- [x] ★ Pay, full flow through the UI (recipient, amount 500, schedule, summary, confirm): balances 9'400, total 64'400
- [x] Internal transfer completes through the UI (summary shows 9'400 and 25'000, then 8'900 and 25'500)
- [x] Custody account, a position, Buy opens the trade flow (Household 8'900) and is dismissed with Discard
- [x] All bookings: tabs (Pending selected), month chips and search work
- [x] ★ User Type: a slider changes the character and title
- [x] Legibility: Compact and Default presets change type and spacing (Typeface, Font and Paddings not exercised)
- [x] ★ Theme: Custom 08 recolours Overview and All bookings; the UZ Bank card restores the navy default
- [x] Demo data reset restores 9'900 and 64'900
- [x] Design system hub, Motion, Components and Character kit open; a profile button changes the figure (back arrows and the trailing-arrow motion not checked)
- [x] Tab through Overview: focus is visible
- [ ] Reduced motion: not checked (system setting not toggled)

Checked on 2026-10-23 against `feature/bookings-search-and-balance`, Chrome on port 5199, desktop width (2391px) and a 390px iframe, Dark (navy default), Light not separately, one Multi-color theme (orange) for the search bar. The balance checks were run through the payment and transfer commit functions plus the Overview, Account details, All bookings and payment sheet pages; reset and reload persistence were checked on Overview and All bookings. Build passes.
The Pay and internal transfer flows, the trade flow balances, `?account=savings` and `?account=deposit`, the day headers, and the search bar in Light and a Multi-color theme were then checked in a second run on 2026-10-23 (same setup), together with the baseline smoke test in section 4.
Not checked: the live region with a screen reader, reduced motion (CSS path read, system setting not toggled, so the two reduced-motion boxes stay open), page transition directions, the baseline at 390px, Typeface/Font/Paddings controls.

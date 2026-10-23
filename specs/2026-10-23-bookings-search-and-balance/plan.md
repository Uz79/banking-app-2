# All bookings search and the Household balance: plan

Branch: `feature/bookings-search-and-balance`. Decisions are cited as D1 to D11 from `requirements.md`. The groups run through to validation without stopping, unless a review stop is asked for.

## 1. One balance rule (D1 to D4)

What you see: pay CHF 500 from Overview; Overview, Account details (card, carousel and total), All bookings and the payment and transfer sheets all show the same running Household balance, and the totals add up to the rows.

- [ ] `js/payment-state.js`: `overviewAccountsTotal` and `accountDetailsAccountsTotal` from the running balances (D2); rewrite the comment block about the fixed displayed balance (D1)
- [ ] `js/data-render.js`: the Account details carousel slides (Household and Savings) and the payment modal's debit rows use the running balance
- [ ] `js/iat-overlay.js`, `js/trade-flow-overlay.js`: Household and Savings balances from `UZBankPayState` instead of the constant strings; Custody unchanged
- [ ] `all-bookings-and-payments.html`: load `js/payment-state.js` before `js/all-bookings.js`; `js/all-bookings.js`: the summary card from the state, refreshed on `uzbank:state-changed`, with the constants as fallback
- [ ] Check in the browser: a payment and a transfer, then each page and sheet above, and Reset demo data

## 2. The search bar: markup and styles (D5 to D10)

What you see: the Search button opens a field under the toolbar (not yet filtering), in Light and Dark, with the sticky header and the month bar still correct.

- [ ] `all-bookings-and-payments.html`: the search field row inside `[data-all-bookings-sticky-header]` (label, `type="search"` input, clear button), an empty-state line and a polite live region next to the list
- [ ] `css/styles.css`: `.all-bookings__search*` rules (tokens only, narrow selectors, the open transition with a `prefers-reduced-motion` path, focus ring)
- [ ] `js/all-bookings.js`: toggle open and close (`aria-expanded`, focus in and back out), `syncStickyHeights` after each change (D7)

## 3. The search behaviour (D5, D6)

What you see: typing narrows the list, empty day groups disappear, a no-match line shows, Escape closes and restores the list.

- [ ] `js/all-bookings.js`: filter the static rows by name or amount text across all months, hide empty day groups, the empty state, the live region count, clear button, Escape (D5, D6, D8)
- [ ] Check the month chips and the month merge while a search is active (D7 and the open question)

## 4. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] Run `validation.md`, including the baseline smoke test copied there; fill in the "Checked on" line
- [ ] Docs: `specs/roadmap.md` (items 10 and 11 done with the spec link, item 12 added); `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` only if its Decisions table or the payment-state notes mention the fixed balance; `apps/web/README.md` only if a file or key changed (none expected)

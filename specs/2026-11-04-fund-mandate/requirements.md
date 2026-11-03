# Fund the asset management mandate (18): requirements

Branch: `feature/fund-mandate`

Roadmap item 18 (`specs/roadmap.md`), found during 9a (D22). Completing the investment opening stores a mandate, and Overview shows it after Retirement savings 3a as "Pending: CHF …", outside the Accounts & investment total (tech-spec, "Opened products"). Nothing can fund it: the completion screen says "Next: transfer {amount} to your custody account", but the internal transfer has no mandate as a target. Its "Custody account" target has a fixed balance, so a transfer there leaves Household and arrives nowhere.

The interview settled:

- each opened mandate is a transfer target, and completion gets a "Transfer now" button that opens the transfer prefilled;
- funded money shows as the row's balance at once and counts in the total; the "three working days" stay in the words only;
- any amount, any number of times; the opening's amount is a suggestion;
- "Custody account" leaves the transfer's targets.

## Scope

**In:**

1. A mandate as a transfer target, in the transfer's credit account list (D1 to D4)
2. What a transfer to a mandate stores, and how the Overview row and total show it (D5 to D8)
3. "Transfer now" on the opening's completion screen, in the Overview sheet and on its own page (D9, D10)
4. "Custody account" out of the transfer's account lists (D11)

**Out (not in this branch):**

- Taking money out of a mandate, or a mandate as a debit account
- Simulated time: the "three working days", a "being invested" state, performance
- The custody account as a real balance (it stays fixed at 20'000, as the trade's account)
- Picking a later execution date (roadmap 28)
- Other open roadmap items

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Each mandate is a credit account** in the transfer, keyed by its id: name "Asset management", the strategy as the second line (where an account shows its IBAN), and its funded balance. It appears only in the "to" list (Credit account), never in the "from" list | Interview. Money goes into a mandate; nothing takes it out in this prototype |
| D2 | **Every mandate is listed**, in the order opened, after Household and Savings; with no mandates the lists are Household and Savings only | Several openings make several mandates (9a); each can be funded |
| D3 | **The lists come from the payment state** when the picker opens, on every page with the transfer (Overview, Account details, Payments), so a mandate opened in the Overview sheet is there without a reload | The opening runs in an iframe and writes the state; `storage` events already keep the parent current |
| D4 | **The debit account for a mandate** defaults to Household; Savings is allowed too | Household is where the money is in this prototype; nothing stops funding from Savings |
| D5 | **An executed transfer to a mandate** books its out-leg on the debit account as today ("Transfer to Asset management") and adds the amount to the mandate's `funded` field; it books no in-leg | The mandate isn't a bookings account (no list, no Today header); a stored sum survives the 100-booking limit, which only carries Household and Savings (roadmap 14) |
| D6 | **A pending or recurring transfer to a mandate** books as today (pending or recurring out-leg) and funds nothing, just as such a transfer adds nothing to Savings today | Consistent with how every balance treats pending and recurring bookings; nothing executes them later in this prototype (roadmap 28) |
| D7 | **The Overview row:** with nothing funded, "Pending: CHF {amount}" in the secondary style, as now; once funded, the funded balance in the regular amount style (like the rows above it), the sub-line still the strategy | Interview: the balance shows at once. The pending style stays the signal that nothing has arrived yet |
| D8 | **The Accounts & investment total counts every mandate's `funded`**; Account details' total (Household and Savings only) is unchanged. So a transfer to a mandate leaves Overview's total the same: the money moves between two rows it counts | Interview. Overview's total sums the rows on Overview |
| D9 | **"Transfer now" on completion:** a primary button above "Done" (which becomes secondary). The copy becomes "Next: transfer {amount} to your asset management. We invest it within about three working days." In the Overview sheet it closes the sheet without asking, as completion does, and opens the transfer prefilled: from Household, to this mandate, the opening's amount, "Immediately" on | Interview. Completion already closes without "Leave for now?" (21) |
| D10 | **On the opening's own page** (not in a sheet), "Transfer now" goes to `overview.html#iat/fund/{mandateId}`, which opens the transfer prefilled the same way; an unknown id opens the transfer as usual | The page can be opened on its own; a hash keeps it to the existing route pattern (`#iat/…`) and needs no new storage key |
| D11 | **"Custody account" leaves the transfer's lists** (debit and credit) | Interview. Its balance is fixed, so a transfer to or from it lost or made money. The trade keeps it as its account |
| D12 | **Stored shape:** a mandate gains `funded` (a number, default 0); a missing or broken `funded` loads as 0. No new key, no schema version change; the demo reset clears mandates as now | Old stored states keep loading; `normalizeMandates` already filters broken entries |
| D13 | **The merge gate** (not asked in the interview, the project's default): `npm run build`; this branch's `validation.md` in a real browser, desktop and 390, Light and Dark, keyboard; the baseline smoke test | Standard |
| D14 | **Copy:** English, short, no em dashes; amounts as the app formats them | AGENTS.md |

## Context

- `js/payment-state.js`: `commitMandate()` near line 608 stores `{ id, strategy, strategyName, amount, dateISO }`; `normalizeMandates()` near line 207; `commitInternalTransfer()` near line 482 books both legs by `fromKey`/`toKey`; `getState()` near line 345 builds `overviewAccountsTotal` (Household + Savings running + `DEPOSIT` + `RETIREMENT`); `trimBookings()` carries only Household and Savings.
- `js/iat-overlay.js`: `ACCOUNTS` near line 21 (household, savings, deposit = Custody account, fixed balance); `openAccountPicker()` near line 168 lists all of them for both roles; `openOverlay()` near line 370 picks from and to; `window.__UZ_IAT_OPEN`. The transfer is on Overview, Account details and Payments.
- `js/data-render.js`: `renderMandates()` near line 164 draws the rows into `[data-mandates]` on Overview.
- `js/investment-opening.js`: `complete()` near line 986; `openMandate()` near line 1070 calls `commitMandate`; `send()` posts to the sheet (`js/fridge-advisor-sheet.js`, `message` handler near line 215). `js/investment-opening-config.js`: `COMPLETE.next` near line 276.
- `specs/tech-spec.md`, Decisions, "Opened products": to be updated (funding no longer roadmap).

## Open questions

1. Whether the completion's mandate id is known to the page when "Transfer now" is pressed: `commitMandate` doesn't return it today. The build settles it (return the id, or take the last mandate).

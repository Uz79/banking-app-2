# Booking balance: a dropped booking keeps its money (14): requirements

Branch: `feature/booking-balance`

Roadmap item 14 (`specs/roadmap.md`). The demo keeps at most 100 bookings and drops the oldest past that (`specs/2026-10-25-all-bookings-real/` D11). Every balance is worked out from the bookings still stored, so a dropped booking takes its effect with it: an old payment of CHF 500 leaves the list and Household is CHF 500 richer. That spec already noted it (Context, last line). A balance must not change when a booking only leaves the list.

The interview settled: the money of a dropped booking is carried per account in the stored state; the bug in editing a pending payment found while reading the code becomes its own roadmap item; the merge gate is the standard one plus a scripted check past the limit, without VoiceOver, since nothing visible changes.

## Scope

**In:**

1. A carried amount per account for executed bookings dropped by the limit (D1 to D4)
2. The same rule when stored data is loaded (D5)
3. The demo reset clears it (D6)

**Out (not in this branch):**

- Editing a pending payment turning it executed (`updatePayment` rebuilds the booking without its status): roadmap item 23 (interview)
- A different limit, or showing anywhere that older bookings were dropped
- Any change to how the bookings lists, the day headers or the totals look
- The fixed accounts (Deposit, Retirement) and the mandates (9a D21), which bookings do not move

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Carry, don't recompute:** the stored state gets `carried: { household, savings, householdOut }`, all CHF numbers starting at 0. When the limit drops a booking, an executed one adds its signed amount to `carried[accountKey]` (in adds, out subtracts) and, for a Household outflow, its amount to `householdOut`. Pending and recurring bookings carry nothing: they never moved money | Chosen in the interview. The balance stays "opening + what happened", without storing every booking forever |
| D2 | **The running balances add the carry:** `accountRunningBalance(key)` = the opening balance + `carried[key]` + the bookings still listed. Household, Savings and both page totals (Overview, Account details) follow, since they are sums of these | One place, so no page can disagree with another (the rule `payment-state.js` already states) |
| D3 | **The Today header too:** `todayBalance` subtracts `householdOut` along with the listed Household outflows, so the Today header on Account details does not jump back either. It keeps its present rule (outflows only) | The header shows the same kind of number as before; only the dropped part is kept |
| D4 | **One trimming function** replaces the three copies of the limit in `commitPayment`, `commitInternalTransfer` and `commitTradeOrder`: it drops the oldest past `MAX_BOOKINGS` (by order of booking, as now) and carries each one. Both legs of a transfer are carried to their own accounts, so a transfer whose legs are dropped one at a time still adds up | Three copies of the same rule is how one of them gets missed |
| D5 | **Loading:** a stored `carried` is read when its three fields are numbers, else it starts at 0; a stored list longer than the limit is trimmed by the same function, so it carries too. No schema version change (an old state simply has nothing carried) | Old states stay readable; the commits already kept lists within the limit, so this is a safeguard |
| D6 | **The demo reset** clears `carried` with the bookings (`defaultState()`) | A reset restores the opening balances exactly (baseline item) |
| D7 | **No new storage key:** `carried` lives in `uzBankWebPaymentState`. Its line in `apps/web/README.md` and the comment block in `js/payment-state.js` describe it | AGENTS.md: storage keys are listed in the README |
| D8 | **What is lost, accepted:** a dropped pending or recurring booking disappears from the Pending tab with nothing to show it; a state already trimmed before this fix has lost its money for good, until the demo reset | Pending bookings past 100 are a very long session; the reset fixes old states |
| D9 | **The merge gate:** `npm run build`; this branch's `validation.md` in a real browser (past the limit by script through `UZBankPayState`, then a real payment and a real transfer through their sheets); Light and Dark, desktop and 390; the baseline smoke test. No VoiceOver pass: nothing visible changes | Chosen in the interview |
| D10 | **All bookings' Today header too** (found in the build): it shows a static figure plus the listed executed bookings of its account (`js/all-bookings.js`, `renderBookings`), so it also jumped back when a booking was dropped. `getState()` now returns `carried`, and the header adds `carried[accountKey]` | The same bug on one more reader; the Context above had missed it |

## Context

- `js/payment-state.js`:
  - `MAX_BOOKINGS = 100` (line 33).
  - The limit is applied in three places: `commitPayment` (line 428), `commitInternalTransfer` (482) and `commitTradeOrder` (545). Each does `splice(0, length - cap)` and drops the bookings without a trace.
  - `loadState` slices to the limit (lines 233 and 242).
  - `accountRunningBalance` (297) and `getState().todayBalance` (324 to 330) sum the listed executed bookings.
  - `saveState` (253) writes `{ schemaVersion, bookings, positions, mandates }`.
- `todayBalance` subtracts only Household outflows. A transfer into Household does not raise the Today header, though it does raise the running balance. That predates this branch and stays as it is (D3).
- Readers of the balances: `js/data-render.js` (Overview, Account details, the day headers), `js/all-bookings.js` (the account header, and its own Today header from the listed bookings, D10), `js/iat-overlay.js` and `js/trade-flow-overlay.js` (available balance), `js/fridge-advisor.js` (the prefill). None of them change; they read `getState()`.

## Open questions

None.

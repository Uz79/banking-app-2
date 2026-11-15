Branch: `feature/pending-items-execute-on-date`

# Pending payments and transfers execute on their date (37): requirements

Roadmap item 37 (`specs/roadmap.md`), split from 28. A payment or transfer set for a later date stays pending forever: nothing executes it when its date arrives, so its money never moves, and a recurring one never repeats. Settled in the interview on 2026-11-15; the build follows these decisions.

## Scope

**In:**

1. When a stored pending item runs: on load and when the tab comes back, against the device date (D1)
2. What a run item is in the bookings and the balances (D2, D3)
3. How a Recurring payment, a Standing order and a Recurring transfer repeat: monthly, each due period, with the frequency as one parameter so item 45 can add the others (D4, D5, D6)
4. The status message when something ran (D8)
5. A way to see it without waiting: the `?today=` dev parameter that already exists (D11)

**Out (not in this branch):**

- Other frequencies (daily, weekly, every two weeks): roadmap 45, which plugs into D4
- A payment that fails for lack of money, a retry, a waiting state (D7)
- The built-in example items: they are dated from today each load, so none ever comes due
- Pay's "As soon as possible" staying executed now with its next-working-day copy (D9)
- A background timer: nothing runs while the app is closed or while a page stays open and focused across midnight
- `js/app.js`, `spa-source.html`

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **When it runs:** a function in `js/payment-state.js` runs every stored item that is due (its date is today or earlier) when the module loads, on `pageshow` and when `visibilitychange` shows the tab again. "Today" is the device date, or the `?today=YYYY-MM-DD` parameter on a dev host | Interview. Load plus return covers a demo that is left open; the dev parameter is how every other date-dependent feature is tested (`built-in-bookings.js` `today()`, 62's D16) |
| D2 | **A one-off item that has run** becomes an executed booking: `status` and `executeOn` are removed, `dateISO` is its execute date (local noon, so the day cannot slip across a time zone), so it sits under that day in All bookings and its money counts from that day. A transfer runs both legs together, and one to a mandate adds to what the mandate holds (as `commitInternalTransfer` does for an immediate one) | Interview (dated its own day). Nothing else about a booking changes |
| D3 | **Balances are not touched by hand.** `accountRunningBalance` already counts executed bookings, so a run item moves the money by being executed. Pending still counts nowhere (69) | No second source of truth |
| D4 | **Repeating:** each period of a stored rule (Recurring, Standing order, Recurring transfer) that has come due becomes its own executed booking, up to 12 caught up at once; the rule stays, and its next date moves on, so Pending shows the next payment. One function, `nextDueDate(frequency, anchorDay, after)`, gives the date after a given one; only `'monthly'` is implemented and any other frequency is a clear error, so item 45 adds its cases there | Interview, including the parameter for 45 |
| D5 | **Month rule:** the same day of the month as the rule's first date (its anchor); an anchor of 29 to 31 uses the month's last day when the month is shorter; a day that falls on a weekend moves to the Monday, as the built-in standing orders do | Interview |
| D6 | **Where an executed occurrence is stored:** a new executed booking carrying `ranOf` (the rule's id) and `occurrence` (the date label it ran for). Not `ruleId`: that marks an edited next payment and is dropped with its rule (68), which would erase history. The rule gets `anchorDay` the first time it runs (read from its first date), so a 31st survives a short month. No storage key changes, no schema bump (added fields, read when present) | Keeps 47's and 68's rules intact: editing or deleting a standing order must not remove what already ran |
| D7 | **A due payment bigger than the balance runs anyway;** the balance may go below zero, like any booked payment. No new status, chip or failure copy | Interview. Anything else needs its own design |
| D8 | **The status message:** when a load or a return ran something, one info message names it ("Your payment to Hans Meyer ran on 16.11.2026."; for several, "3 payments ran."). It shows on the views that have the status message (Overview, Payments, Profile, Account details), never when nothing ran | Interview. Without it a catch-up changes the balance with no explanation |
| D9 | **Pay's "As soon as possible" stays executed now** (money leaves at confirm), with the confirmation naming the next working day, as 40 left it. A weekend payment is therefore booked a weekday early; making it truly pending until Monday is a separate decision | Not asked in the interview; keeps the demo's "pay, then see the balance move". Flagged for review |
| D10 | **An edit or a delete of a rule or a pending item** works as before (23, 42, 47, 68); a rule deleted after it ran keeps its executed occurrences | D6 |
| D11 | **Testing:** `?today=` on `localhost` and `*.local`, as for the example bookings. A run changes the stored state, so the validation clears `localStorage` between cases | One mechanism for every date |
| D12 | **The merge gate** (interview, standard): `npm run build`; this `validation.md` in a real browser (Light and Dark, 390px, keyboard, reduced motion, reduced motion and VoiceOver checked by Klaudiusz on 5175); the baseline smoke test | AGENTS.md |

## Context

- `js/payment-state.js`: `commitPayment` and `commitInternalTransfer` store a later item with `status: 'pending'` or `'recurring'` and `executeOn` (the `DD.MM.YYYY` label), via `applySchedule` (464); `updatePayment` (596); `isExecuted` (345) and `accountRunningBalance` (349) decide what counts; `isStoredRule` (586); `loadState` (266). A transfer is two bookings (`iat_out_…`, `iat_in_…`) sharing a suffix; to a mandate it is one (`commitInternalTransfer`, 18's D5, D6).
- `js/built-in-bookings.js`: `today()` (143) with `?today=`; `nextPayments` (324) derives a stored rule's next payment from `executeOn` and hides it when a booking carries its `ruleId` and `occurrence`; `pendingTotal` (354); the built-in standing orders take a weekday from `dayOfMonth` (`nextDate`).
- `js/all-bookings.js` and `js/data-render.js` redraw from `UZBankPayState`'s change event, so a run that dispatches it updates the lists.
- `js/status-message.js` (`UZStatusMessage.show({ id, state, title, text, since, icon })`) and `js/status-feed.js` (the demo message after 12 s) load on Overview, Payments, Profile and Account details only.
- Item 45 (choose a frequency) will add the other cases to D4's function.

## Open questions

- How `UZStatusMessage.show` shares the one slot with the demo "Open payment!" feed (replace, queue, or show after it). Read it in the build; D8 says only that the message shows.
- Whether `payment-state.js` can read the same `today()` the built-in list uses, or whether the helper moves (the scripts load in some order; read it first).
- Where a page that has no status message tells the person (All bookings, Details of position): D8 leaves it silent there.

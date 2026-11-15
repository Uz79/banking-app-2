# Pending payments and transfers execute on their date (37): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`. Date cases use `?today=YYYY-MM-DD` (dev host only) and a cleared `localStorage` between cases.

## Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Account details, Payments, All bookings

## One-off items

- [ ] A payment set for a later date stays pending the day before, and runs on its date: executed, dated that day, the balance drops by its amount
- [ ] The same for an internal transfer: both legs run, both balances move; one to the asset management mandate adds to what it holds
- [ ] A payment set for a Friday, opened on the Monday after: dated the Friday
- [ ] Opening again does not run it twice
- [ ] A due payment larger than the balance runs and the balance goes below zero, with nothing else new on screen

## Repeating

- [ ] A Recurring payment started on a past date shows one executed booking per month due and its next payment in Pending
- [ ] A rule on the 31st: February uses the 28th (29th in a leap year), a Saturday moves to Monday
- [ ] A catch-up of more than 12 periods runs 12
- [ ] Edit the rule: what already ran stays; delete the rule: what ran stays, nothing pending is left
- [ ] An edited next payment (47, 68) still replaces the rule's derived one, and still goes with its rule
- [ ] Standing order and Recurring transfer behave the same

## Status message

- [ ] One run: "Your payment to <name> ran on <date>."; several: "3 payments ran."
- [ ] A plain load, and a load after everything has run, show no new message
- [ ] The demo "Open payment!" message still comes as before
- [ ] The message reads in VoiceOver (Klaudiusz) and moves no more than the existing status message with reduced motion

## Cross-cutting

- [ ] First visit (nothing in `localStorage`): nothing runs, nothing breaks
- [ ] Built-in pending and recurring rows (Apple, Swisscom, Netflix and so on) are unchanged
- [ ] Light and Dark, desktop and 390px (lists and the message)
- [ ] Keyboard: the lists and the booking sheet of a run item
- [ ] Reduced motion (Klaudiusz, macOS setting)

## Baseline smoke test

(Copy `specs/baseline/validation.md` here and tick it. Leave that file unticked.)

Checked on: not yet run.

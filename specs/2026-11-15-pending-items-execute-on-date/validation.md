# Pending payments and transfers execute on their date (37): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`. Date cases use `?today=YYYY-MM-DD` (dev host only) and a cleared `localStorage` between cases.

## Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on Overview, Account details, Payments, All bookings

## One-off items

- [x] A payment set for a later date stays pending the day before, and runs on its date: executed, dated that day, the balance drops by its amount
- [x] The same for an internal transfer: both legs run, both balances move; one to the asset management mandate adds to what it holds
- [x] A payment set for a Friday, opened on the Monday after: dated the Friday
- [x] Opening again does not run it twice
- [x] A due payment larger than the balance runs and the balance goes below zero, with nothing else new on screen

## Repeating

- [x] A Recurring payment started on a past date shows one executed booking per month due and its next payment in Pending
- [x] A rule on the 31st: February uses the 28th (29th in a leap year), a Saturday moves to Monday
- [x] A catch-up of more than 12 periods runs 12
- [x] Edit the rule: what already ran stays; delete the rule: what ran stays, nothing pending is left
- [x] An edited next payment (47, 68) still replaces the rule's derived one, and still goes with its rule
- [x] Standing order and Recurring transfer behave the same

## Status message

- [x] One run: "Your payment to <name> ran on <date>."; several: "3 payments ran."
- [x] A plain load, and a load after everything has run, show no new message
- [ ] The demo "Open payment!" message still comes as before
- [ ] The message reads in VoiceOver (Klaudiusz) and moves no more than the existing status message with reduced motion

## Cross-cutting

- [x] First visit (nothing in `localStorage`): nothing runs, nothing breaks
- [x] Built-in pending and recurring rows (Apple, Swisscom, Netflix and so on) are unchanged
- [ ] Light and Dark, desktop and 390px (lists and the message)
- [ ] Keyboard: the lists and the booking sheet of a run item
- [ ] Reduced motion (Klaudiusz, macOS setting)

## Baseline smoke test

Not run in full on this branch. Run on 2026-11-15 (see the "Checked on" line): `npm run build`; console clean on Overview, Account details, All bookings, Payments, Profile and Details of position; Pay (confirmation names the next working day, Household 10'000 to 9'500) and the internal transfer (500 to Savings) complete; Account details and All bookings (38 executed, 5 pending, 1 recurring rows) draw; reset restores 10'000 and 25'000. Not run: Buy and Sell, the month chips and search, User Type, Legibility, Theme, the design system pages, page transitions, the status message's 12 s timing, Tab through Overview, reduced motion.

Checked on 2026-11-15 against `feature/pending-items-execute-on-date`, Chrome on the agent's server (5199), Dark desktop (about 1530px), one 386px-wide Light frame; the device date was 15.11.2026, moved with `?today=` and a cleared `localStorage` between cases. Checked: a pending payment and transfer staying pending on 16.11 and running on 17.11 (balances 9'650 and 25'200, both legs, dated 17.11); a Recurring payment running its first period on 16.11 and three more by 20.02.2027 (16.12, 18.01 for a Saturday, 16.02), each shown with the Monthly chip on All bookings, its next payment in Pending and the rule in Recurring, the booking sheet of an occurrence reading Executed; no second run on a repeat load; editing and deleting the rule keeping the four occurrences; a recurring transfer running both legs three times; a rule from 03.01.2025 opened on 20.01.2027 running 12 and continuing from 03.02.2027; a 20'000 payment running and the balance going to -10'420; an edited next payment of the built-in Netflix standing order running and staying after the rule was removed; the date function in Node (31 January, a leap February, an unknown frequency throwing); the message "Your payment to Lena Fischer ran on 16.11.2026." for one, "2 payments ran." and "3 payments ran." for several, and none on a plain load or after everything had run; the message in a 386px frame in Light; a first visit running nothing; the built-in Pending and Recurring rows unchanged. Not checked: Light on desktop and a Multi-color theme; keyboard through the lists and the sheet; reduced motion and VoiceOver (Klaudiusz); a transfer to the asset management mandate (the funding code was not run); a rule edited by Pay's edit flow after it ran; 12 s timing of the demo message after a run note replaces it; the Pending tab and booking sheet at 390px; the baseline smoke test beyond what its section lists. The 5199 `localStorage` was cleared afterwards.

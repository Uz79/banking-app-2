# An edited next payment goes with its standing order's edit or delete (68): validation

Branch: `feature/standing-order-edit-exception`. Run on the agent's server (port 5199), then the baseline smoke test. Start after Profile's "Reset demo data" unless it says otherwise.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (built 2026-11-08)
- [ ] No console errors on All bookings (all tabs, both accounts), Pay, the booking sheet and Profile (read, extension notice filtered out, after Profile, the design pages and All bookings on Savings; Pay, the booking sheet and Household were used before the read started)

## 2. Edit the rule after editing its next payment (D1, D2)

- [x] Savings, Recurring tab: Rent. Edit its next payment (Pending) to 1'700, Execute. Pending shows Rent at 1'700 (Pending showed Rent -1'700.00)
- [x] Edit the Rent standing order itself to 1'750, Execute: Pending lists one Rent payment on that date, 1'750, and no 1'700 (one Rent payment, 1'750.00 on 01.12.2026; the stored booking list had the rule only)
- [x] The same on Household with its standing order (Netflix: next payment edited to 333, the order edited to 444: one Netflix payment, 444.00 on 07.12.2026)
- [x] A standing order made in the app (Pay, Standing order, later date): edit its next payment, then edit the order in place: one payment, the order's new amount (the Rent order made by the edit above is stored; its next payment edited to 1'600, the order edited in place to 1'650: one payment, 1'650.00)
- [x] After a reload the Pending tab is the same (the booking is stored) (Household, Netflix 555.00 after a reload)
- [ ] Editing the next payment alone still hides the derived one and leaves the rule untouched (47 D10) (Rent 1'800 to 1'700 and Netflix to 333: the edited payment listed once, the rule untouched)
- [ ] Deleting an edited next payment still brings the derived one back (47 D11) (not run; deleteBooking for a one-off is unchanged)

## 3. Delete the rule (D3)

- [x] A standing order with an edited next payment: Delete asks "Delete payment?"; after Delete the Recurring row and the edited one-off are both gone from Pending (not applicable: the app offers no Delete for a standing order, so the prompt was not built (D3); tested through the state: deleting a stored order removed its edited payment, removing a built-in order removed its edited payment, and an unrelated pending payment stayed)
- [ ] A standing order with no edited payment: Delete as before, no extra text (no Delete is offered for a standing order)
- [ ] "Payment deleted." is still announced and focus lands on the next row (roadmap 60, 33) (not run; the Delete code is unchanged)

## 4. Telling the customer (D4)

- [x] After editing a rule that had an edited next payment, the confirmation's note reads "The earlier change to the payment on <date> was replaced."; the date is the dropped payment's ("The earlier change to the payment on 01.12.2026 was replaced." (Rent), "... on 07.12.2026 ..." (Netflix))
- [ ] (not built, D3) The Delete prompt of such an order reads "This payment will not be made. Its changed payment on <date> will not be made either. You can't undo it."
- [x] Neither line shows when nothing was dropped; the note is hidden and not read (a rule edit with no edited payment and a plain edit of a payment: the note stayed hidden and empty)
- [ ] The text has no em dashes; it fits on a 390px phone and at Large type (no em dash; on a 390px frame at Large it wraps to two lines inside the dialog, no overflow)

## 5. Cross-cutting

- [ ] Light and Dark, desktop and 390px (Dark desktop and a 390px frame at Large seen; Light not looked at)
- [ ] Keyboard: the flow and the prompt work with Tab, Enter and Escape (not run)
- [ ] Reduced motion: nothing new animates (nothing animated was added; the macOS setting was not switched)
- [ ] First visit (nothing in `localStorage`) and a Multi-color theme (a reset state was the start of each run; the default sage theme only)

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`.

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited (the Profile, design pages and All bookings read; Overview, Pay and the transfer used before the read started)
- [x] Overview loads with sidebar; the 3D canvas is present (the character itself was not looked at)
- [x] Light/Dark toggle switches (Dark to Light; no reload in this spec)
- [ ] Navigating Overview, Account details, All bookings and back plays the page transitions in the right directions (not checked)
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (not run in this spec)
- [x] Pay: recipient, amount, schedule, summary, execute: Household 10'000 to 9'880, focus on Done
- [x] Internal transfer completes (500 to Savings: 9'380 and 25'500)
- [x] Custody account, a position, Buy opens the trade flow and can be dismissed (Discard order? with Continue order and Discard)
- [x] All bookings: the Pending and Recurring tabs list and open their rows on both accounts (the month chips and search were not used in this spec)
- [x] User Type: the knowledge slider to 100 was stored (the character, title and preview were not looked at)
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Large, Small and Regular set `--fs-text-sm` to 1.015, 0.7875 and 0.875rem; Typeface, Font and Paddings not run)
- [x] Theme: the UZ Bank card cleared the 38 inline colour tokens and Custom 10 restored them (not walked page by page)
- [x] Demo data reset restores 10'000 and 25'000
- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move (the hub was visited; the arrows were not watched)
- [x] Motion specimens, Components and Character kit open
- [ ] The Character kit specimen loads and the profile buttons change the figure (loaded, not looked at)
- [ ] Tab through Overview: focus is always visible (not run)
- [ ] With reduced motion on, page transitions and the character are still (the macOS setting was not switched)

Checked on 2026-11-08 against `feature/standing-order-edit-exception`, Chrome on the agent's server (5199), desktop 1728px and one 390px frame at Large, Dark and Light (the toggle left it on Light), the default sage Multi-color theme, Custom 10 and the UZ Bank look; demo admin switched on in `localStorage` for the design pages and cleared again. Not checked: Delete of a standing order (not offered by the app, D3); Delete of an edited payment bringing the derived one back; the "Payment deleted." announcement; keyboard through the flow; Light in the 390px frame; the first visit; a screen reader on the note; reduced motion with the macOS setting; page transitions; the status message's timing; Tab through Overview; the month chips and search; Legibility's Typeface, Font and Paddings; the 3D figure and the character kit's buttons by eye.

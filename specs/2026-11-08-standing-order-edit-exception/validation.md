# An edited next payment goes with its standing order's edit or delete (68): validation

Branch: `feature/standing-order-edit-exception`. Run on the agent's server (port 5199), then the baseline smoke test. Start after Profile's "Reset demo data" unless it says otherwise.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on All bookings (all tabs, both accounts), Pay, the booking sheet and Profile

## 2. Edit the rule after editing its next payment (D1, D2)

- [ ] Savings, Recurring tab: Rent. Edit its next payment (Pending) to 1'700, Execute. Pending shows Rent at 1'700
- [ ] Edit the Rent standing order itself to 1'750, Execute: Pending lists one Rent payment on that date, 1'750, and no 1'700
- [ ] The same on Household with its standing order
- [ ] A standing order made in the app (Pay, Standing order, later date): edit its next payment, then edit the order in place: one payment, the order's new amount
- [ ] After a reload the Pending tab is the same (the booking is stored)
- [ ] Editing the next payment alone still hides the derived one and leaves the rule untouched (47 D10)
- [ ] Deleting an edited next payment still brings the derived one back (47 D11)

## 3. Delete the rule (D3)

- [ ] A standing order with an edited next payment: Delete asks "Delete payment?"; after Delete the Recurring row and the edited one-off are both gone from Pending
- [ ] A standing order with no edited payment: Delete as before, no extra text
- [ ] "Payment deleted." is still announced and focus lands on the next row (roadmap 60, 33)

## 4. Telling the customer (D4)

- [ ] After editing a rule that had an edited next payment, the confirmation's note reads "The earlier change to the payment on <date> was replaced."; the date is the dropped payment's
- [ ] The Delete prompt of such an order reads "This payment will not be made. Its changed payment on <date> will not be made either. You can't undo it."
- [ ] Neither line shows when nothing was dropped; the note is hidden and not read
- [ ] The text has no em dashes; it fits on a 390px phone and at Large type

## 5. Cross-cutting

- [ ] Light and Dark, desktop and 390px
- [ ] Keyboard: the flow and the prompt work with Tab, Enter and Escape
- [ ] Reduced motion: nothing new animates
- [ ] First visit (nothing in `localStorage`) and a Multi-color theme

## 6. Baseline smoke test

Copy the items from `specs/baseline/validation.md` here when the wrap-up group starts, and run them.

Checked on: (not yet run)

# Display-only rows and account cards against the field anatomy (71): validation

Branch: `feature/display-rows-and-account-cards`. Run on the agent's server (port 5199), then the baseline smoke test. Start after Profile's "Reset demo data" unless it says otherwise.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (built 2026-11-08)
- [ ] No console errors on Overview, Payments, Account details, All bookings, the position page (with Buy and Sell opened), Profile and Components (read with the extension's notice filtered out, after visiting the design hub, Components, Motion specimens, Character kit, Payments with Pay open, Account details and Overview; Profile, All bookings and the position page were visited before the console read started and are not covered)

## 2. Display-only value rows (D1, D2)

- [x] Pay's recipient step: IBAN and Bank Name are 88dp each; Recipient name (a text field) is 88dp too, so the step is an even rhythm (IBAN 88, Bank Name 88, Recipient name 88, Street 88, City 88, Country 88; the value rows are 40dp)
- [x] The transfer's recipient step: its value rows are 88dp (the transfer has no value rows on its recipient step (Amount, From, To); the value rows on its summary are 88dp)
- [ ] A value that wraps to two lines (a long IBAN at Large type or at 390px) does not push the row past 88dp, or the exception is listed here (not seen: no value wrapped on a 390px frame at Regular or at Large, so the case was not exercised)
- [x] The edit button keeps its 32dp target and its focus ring is not clipped (32dp inside the 40dp row; the 2px outline with 2px offset sits inside the row; Tab reached it with a visible ring)
- [ ] Account information and Share information look as before (88dp grid, 4px gap) (not looked at again; the rule excludes `.form-field--readonly`)
- [ ] Light and Dark: the underline is the separator colour, one pixel, at the bottom of the 40dp (Light seen in a screenshot; the colour token is unchanged, Dark not looked at)

## 3. Account cards (D3, D4)

- [x] Pay's Debit account, the transfer's From and To, and the trade sheet's accounts: label 24dp, 4dp, the card at its own height, 4dp, a 16dp reserved row (a script reads the boxes) (Pay Debit account 121 = 24 + 4 + 73 + 4 + 16; the transfer's From and To 121 each; at Large 128.3 with a 79.7 card; the trade sheet's two account fields (no-footer) stay 101)
- [x] A field marked `--no-footer` reserves nothing, as before (Buy: Custody and Debit account fields are 101, as before)
- [x] Pay, the transfer, Buy and Sell: the action button is still visible without a new scroll at desktop and at 390px (measure the sheet's content height against its box, before and after) (Pay and the transfer on a 390px frame, Regular and Large: no step scrolls because of the cards, the action sits at 762 to 764 of 780; Pay's recipient step scrolls 659/627 at Large, the same with the old rule restored; Buy and Sell are unchanged, Sell not opened)
- [ ] The card's hover, pressed and focus states are unchanged; Tab reaches it and Enter opens the picker (not looked at; the CSS for them is untouched)
- [ ] The picker still opens and chooses an account; the balance and name stamp as before (the transfer's From and To were not driven by the picker in this spec; the Buy and Sell pickers were not touched)

## 4. The Components specimen (D6)

- [x] The Form field section shows the display-only row and the account card with their marks, in Light and Dark, desktop and 390px; no em dashes (88 and 121 at Regular, marks 24 / 40 / 16 and 24 / 73 / 16; at Large 88.6 and 128.3, marks follow; Light desktop seen in a screenshot; a 390px frame: no overflow; Dark not looked at)

## 5. Cross-cutting

- [ ] Legibility Large and Small: nothing overlaps; the reserved rows follow the small text size (Large on Pay and the transfer (390px frame) and on the specimen; Small not looked at)
- [ ] Keyboard: Tab order unchanged on every flow touched (Tab on the recipient step: back, close, then the edit button, as before)
- [ ] Reduced motion: nothing new animates (nothing animated was added; the macOS setting was not switched)
- [ ] First visit (nothing in `localStorage`) and a Multi-color theme: the same heights (not run; the default sage theme was the one in use)

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`.

- [x] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited (see section 1 for what the console read covered)
- [x] Overview loads with sidebar; the 3D canvas is present (the character itself was not looked at)
- [x] Light/Dark toggle switches (Light to Dark; the reload was not repeated in this spec)
- [ ] Navigating Overview, Account details, All bookings and back plays the page transitions in the right directions (not checked)
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (a tap dismissed it, but it was already shown at the first look, 4.3 s after load, so its timing was not measured; roadmap 67)
- [x] Pay: recipient, amount, schedule, summary, execute: Household 10'000 to 9'880, focus on Done
- [x] Internal transfer completes (500 to Savings: 9'380 and 25'500)
- [x] Custody account, a position, Buy opens the trade flow and can be dismissed (Discard order? with Continue order and Discard)
- [x] All bookings: tabs, month chips and search work (Executed 5 bands, Pending 1, Recurring 1, 10 chips; "Rent" left 5 rows; "Hans" left none on this account)
- [x] User Type: the knowledge slider to 100 was stored (the character, title and preview were not looked at)
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Large, Small and Regular set `--fs-text-sm` to 1.015, 0.7875 and 0.875rem; Typeface, Font and Paddings not run)
- [x] Theme: the UZ Bank card cleared the 38 inline colour tokens and Custom 10 restored them (not walked page by page)
- [x] Demo data reset restores 10'000 and 25'000
- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move (the hub was visited; the arrows were not watched)
- [x] Motion specimens, Components and Character kit open
- [ ] The Character kit specimen loads and the profile buttons change the figure (loaded, not looked at; the buttons were not pressed in this spec)
- [ ] Tab through Overview: focus is always visible (not run on Overview)
- [ ] With reduced motion on, page transitions and the character are still (the macOS setting was not switched)

Checked on 2026-11-08 against `feature/display-rows-and-account-cards`, Chrome on the agent's server (5199), desktop 1728px and 390px in same-origin frames, Light and Dark, the default sage Multi-color theme, Custom 10 and the UZ Bank look; demo admin switched on in `localStorage` for the design pages and cleared again. Not checked: a wrapped value row; Account and Share information by eye; Dark on the rows, cards and specimen; Small type; Sell; the card's hover, pressed and focus states; the picker on the transfer's From and To; the first visit; reduced motion with the macOS setting; page transitions; the status message's timing; Tab through Overview; the console on Profile, All bookings and the position page; Legibility's Typeface, Font and Paddings; the 3D figure and the character kit's buttons by eye.

# The schedule step's date overrides the toggle (40): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`.

## Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Payments, Account details

## Pay: schedule step (Single)

- [x] First visit (nothing in `localStorage`): the toggle is on, the field shows the next working day and is not greyed
- [x] Tapping the field opens the calendar while the toggle is on; today and weekends are dimmed
- [x] Picking the next working day keeps the toggle on; the summary shows that day and the confirmation reads "will be executed on …"
- [x] Picking a later day turns the toggle off; the booking is pending on that day
- [x] Turning the toggle back on resets the date to the next working day
- [x] Turning the toggle off on its own date moves the date to the working day after (D4); on a Friday that is Monday
- [ ] On a weekend (set the device date) the next working day is Monday

## Pay: Recurring and Standing order

- [x] Same controls and rules; the booking is recurring and starts on the shown date
- [ ] An edited pending payment opens with the toggle off and its date; an edited executed one with the toggle on

## Internal transfer

- [x] "Immediately" is on: the field is visible, shows today and opens the calendar
- [x] Today and weekends are pickable; picking today keeps the toggle on; a Saturday turns it off and the transfer is pending on that date
- [x] Turning the toggle on again resets the date to today
- [x] Recurring execution uses the same pair; an immediate transfer still confirms with "is done."
- [ ] Money moves only for an immediate transfer (balances 9'380 / 25'500 after 500 to Savings)

## Screen readers and keyboard

- [x] The live line follows the toggle and a date pick ("… on, executes on …"); it is silent on first paint
- [x] Tab reaches the toggle and the field; Enter opens the calendar; focus returns to the field after a pick or Escape
- [x] The field's label reads "Execute on, <date>, change date" in every state
- [ ] A screen reader (VoiceOver) hears the toggle's change

## Looks

- [x] Light and Dark, desktop and 390px: the field never looks disabled; no em dashes in new copy (Light: desktop only; 390px was seen in Dark only)
- [ ] Reduced motion: nothing new moves

## Baseline smoke test

### 1. Build

- [x] `npm run build` succeeds with no new warnings (the five `js/field-error.js` "can't be bundled without type=module" lines are old: this branch changes only `date-picker.js`, `form-field-sheet.js`, `payment-overlay.js` and `iat-overlay.js`)
- [x] The browser console shows no errors on any page visited (one exception, "A listener indicated an asynchronous response ... message channel closed", comes from the Chrome extension, not the app)

### 2. Shell

- [x] Overview loads with sidebar (desktop); the 3D character appears in the lower right (the phone tab bar was not looked at)
- [x] Light/Dark toggle switches instantly and survives a reload (Dark to Light by the sidebar button, Light kept after a reload)
- [ ] Navigating Overview, Account details, All bookings and back plays the page transitions in the right directions (the pages opened; the transitions were not watched)
- [ ] The "Open payment!" status message appears after about 12 s on a main view (it was on screen at every load after the first; its timing was not measured, see roadmap 67)

### 3. Banking flows

- [x] Pay: recipient search to confirm; the balance and bookings update (Household 10'000 to 9'500)
- [x] Internal transfer completes (500 to Savings)
- [x] Custody account, a position (Apple), Buy opens the trade flow and can be dismissed ("Discard order?" then Discard; Escape does nothing, roadmap 49)
- [x] All bookings: tabs (Executed, Pending, Recurring), month chips (Aug) and search (Netflix: 5 rows) work

### 4. Profile

- [x] User Type: moving the sliders snaps to an anchor and changes the character (hat, cape), title (All-rounder) and preview
- [x] Legibility: Small, Regular and Large set `--fs-text-sm` to 0.7875, 0.875 and 1.015rem; Typeface (DM Sans), Font and Paddings changed the font family, 1.05rem and `--space-3` 1.19rem
- [x] Theme: Custom 11 turned the accent blue (#0022b8); the UZ Bank card dropped to 27 inline tokens (#00157E); Custom 10 restored #6b7e63 (checked by computed colour, not page by page)
- [x] Demo data reset restores Household 10'000 and Savings 25'000

### 5. Design system (admin by the `uzBankAdmin` flag set in `localStorage`, no password typed; cleared again)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move (the hub showed all three; the arrows were not watched)
- [x] Motion specimens, Components and Character kit open
- [x] The Character kit specimen loads and the profile buttons change the figure (Max put on hat, knight and cape)

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (six Tab stops; the sixth had a solid 2px outline; not the whole page)
- [ ] With reduced motion on, page transitions and the character are still (not run: the setting could not be switched)

Baseline run on 2026-11-13 against `feature/pay-date-overrides-asap`, Chrome on the agent's server (5199), Light at desktop width for most of it (Dark for the earlier Pay and transfer runs); phone width and the starred items in Dark were not repeated. `localStorage` on 5199 was reset to Dark, the default appearance and no admin flag afterwards.

Checked on 2026-11-13 against `feature/pay-date-overrides-asap`, Chrome on the agent's server (5199), Dark theme, desktop (about 1660px) and a 390px window, the device date a Friday (13.11.2026, so Pay's next working day was Monday 16.11). Checked: Pay Single, Recurring and Standing order on the toggle on (the field shows 16.11 and opens the calendar; today and weekends dimmed); a pick of 16.11 kept the toggle on; a pick of 18.11 turned it off; toggling on reset to 16.11 and off moved it to 17.11; the summary showed 16.11, the confirmation read "will be executed on 16.11.2026" and Household went to 9'500; the transfer showed today with the field visible, today and Saturday pickable, a Saturday turned it off, on reset to today, off on today moved to 16.11, an immediate transfer confirmed with "is done."; the live lines read as specified in both flows; at 390px the calendar opened as a bottom sheet, ArrowDown plus Enter picked 23.11 and focus returned to the field. Checked again later the same day, Light (the sidebar's theme button), desktop 1440px: Pay's schedule step (toggle on shows 16.11.2026 in a normal-looking field, the calendar opened with 16 selected and today ringed, ArrowRight twice plus Enter picked 18.11 and turned the toggle off) and the transfer's schedule step (Immediately on, field visible with 13.11.2026). The browser's `localStorage` theme on port 5199 was left on Light. Not checked: Light at 390px; reduced motion with the real setting (the extension cannot emulate it and the macOS setting was not switched; only a static look: the new live lines have no transition or animation, the field and toggle keep their existing 0.15s hover transitions and the calendar's own reduced-motion rule for its buttons is unchanged, so nothing new moves, but this is not a pass); a weekend device date; an edited pending or executed payment opening the schedule step; a Multi-color theme; the first visit with empty `localStorage`; VoiceOver; the baseline smoke test (only the Pay and transfer flows ran); the pending transfer's "will be made on" copy.

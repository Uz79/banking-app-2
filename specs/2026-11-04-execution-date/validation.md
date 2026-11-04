# The execution date can be picked (28): validation

Branch: `feature/execution-date`. Tick each item in a real browser on the agent's test server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. The calendar

- [x] Desktop (1440): it opens as a pop-up anchored under "Execute on"; at 390 as a bottom sheet (desktop window 1605 px wide; 390 in an iframe, Pay and the transfer)
- [x] It opens on the selected date's month, with that day selected and today ringed
- [x] Weekends, today, past days and days past twelve months ahead can't be picked; Previous month disables on the first allowed month, Next month on the last (on Wed 4 Nov 2026: first day Thu 5 Nov 2026, last Thu 4 Nov 2027)
- [x] Picking a day closes the sheet and the field shows the date
- [x] Escape and a click outside close it without changing the date
- [x] Keyboard: focus opens on the selected day; arrows, Page Up / Page Down, Home / End move as D8 says and skip nothing; Enter picks; focus goes back to "Execute on" with its ring
- [x] Labels (by inspection): each day reads its full date, the month header is a live region, the field reads "Execute on, …, change date"
- [x] Light and Dark, and a Multi-color theme: the selected day takes the accent, the dimmed days stay readable (Multi-color: Custom 10)
- [x] Reduced motion: the sheet opens and closes at once; changing month never animates (emulated by the agent by stubbing `matchMedia`; then checked by Klaudiusz with the real macOS setting on localhost: the calendar opens and closes, the page responds after Done and after Leave)

## 3. Pay

- [x] "As soon as possible" off: "Execute on" shows the next working day (a Friday afternoon gives Monday) and opens the calendar (checked on a Wednesday, giving Thursday; the weekend skip is checked through the grid and `nextWorkingDay`, not on a real Friday)
- [x] Toggle back on: today, and the field opens nothing
- [x] A picked date shows in the summary and the confirmation ("will be made on <date>"); the booking is pending on that date in All bookings (Pending tab, in date order; Account details lists only executed bookings, as since 23); Household does not change
- [x] Recurring and Standing order: the picked date is the start ("starts on <date>")
- [x] Editing a pending payment (roadmap 23) opens on its own date; one whose date is now past opens on the next working day (Edit on All bookings does nothing, roadmap 31, so checked through the edit context on Account details: 18.11 kept, a past date gave 05.11)
- [x] As soon as possible on: the payment executes today as before

## 4. The transfer

- [x] "Immediately" off: the field appears with the next working day and opens the calendar; on hides it again (the switch showed the opposite state, also on `main`; fixed, D13)
- [x] A picked date shows in the summary and the confirmation; the transfer is pending on that date; no balance changes
- [x] Recurring execution starts on the picked date
- [x] Immediately on: the transfer executes today as before

## 5. Unchanged

- [x] The other pickers (debit account, currency, country, More functions) open and close as before
- [x] Sheet focus (27) and sheet close (35): after the calendar closes, Tab stays in Pay or the transfer; closing the flow returns focus to its opener

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (seen on Overview, a tap dismissed it and it came back about 8 s later as designed; the first 12 s were not timed, it was already showing from earlier in the session)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (Light desktop and Dark 390; the schedule step names Hans Meyer whoever is picked, also on `main`: roadmap 38)
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [x] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation (checked by Klaudiusz with the real setting on localhost, 2026-11-04: the calendar opens and closes, the page responds after Done and after Leave)

Checked on 2026-11-04 against `feature/execution-date`, Chrome on macOS through Claude in Chrome on the test server (port 5199): desktop (1605 px window) in Light, Dark and a Multi-color theme (Custom 10); 390 px in an iframe in Light and Dark; keyboard. The real macOS Reduce motion setting was checked by Klaudiusz on localhost (the calendar, and the page after Done and Leave). Not checked: a real Friday for the next working day, the status message's first 12 s, Safari and Firefox.

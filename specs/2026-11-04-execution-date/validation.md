# The execution date can be picked (28): validation

Branch: `feature/execution-date`. Tick each item in a real browser on the agent's test server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. The calendar

- [ ] Desktop (1440): it opens as a pop-up anchored under "Execute on"; at 390 as a bottom sheet
- [ ] It opens on the selected date's month, with that day selected and today ringed
- [ ] Weekends, today, past days and days past twelve months ahead can't be picked; Previous month disables on the first allowed month, Next month on the last
- [ ] Picking a day closes the sheet and the field shows the date
- [ ] Escape and a click outside close it without changing the date
- [ ] Keyboard: focus opens on the selected day; arrows, Page Up / Page Down, Home / End move as D8 says and skip nothing; Enter picks; focus goes back to "Execute on" with its ring
- [ ] Labels (by inspection): each day reads its full date, the month header is a live region, the field reads "Execute on, …, change date"
- [ ] Light and Dark, and a Multi-color theme: the selected day takes the accent, the dimmed days stay readable
- [ ] Reduced motion: the sheet opens and closes at once; changing month never animates

## 3. Pay

- [ ] "As soon as possible" off: "Execute on" shows the next working day (a Friday afternoon gives Monday) and opens the calendar
- [ ] Toggle back on: today, and the field opens nothing
- [ ] A picked date shows in the summary and the confirmation ("will be made on <date>"); the booking is pending on that date in Account details and All bookings (Pending tab, in date order); Household does not change
- [ ] Recurring and Standing order: the picked date is the start ("starts on <date>")
- [ ] Editing a pending payment (roadmap 23) opens on its own date; one whose date is now past opens on the next working day
- [ ] As soon as possible on: the payment executes today as before

## 4. The transfer

- [ ] "Immediately" off: the field appears with the next working day and opens the calendar; on hides it again
- [ ] A picked date shows in the summary and the confirmation; the transfer is pending on that date; no balance changes
- [ ] Recurring execution starts on the picked date
- [ ] Immediately on: the transfer executes today as before

## 5. Unchanged

- [ ] The other pickers (debit account, currency, country, More functions) open and close as before
- [ ] Sheet focus (27) and sheet close (35): after the calendar closes, Tab stays in Pay or the transfer; closing the flow returns focus to its opener

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on: not yet run.

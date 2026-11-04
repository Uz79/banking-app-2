# Editing a pending payment keeps it pending (23): validation

Branch: `feature/edit-pending-payment`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

Set up: start from a demo reset. On Account details, make three payments in the Pay sheet: one "as soon as possible" (executed), one with "As soon as possible" off (pending), one "Recurring". Read each stored booking (`uzBankWebPaymentState`) before and after an edit.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. The booking sheet (D5 to D7)

- [ ] The executed payment's sheet shows "Executed" with the check, and no Edit buttons
- [ ] The pending and the recurring payment's sheets show "Pending" with the clock, and both Edit buttons
- [ ] The Apple sample still shows "Pending" with Edit; the executed samples (Café and the others) show "Executed" with none
- [ ] A row in the yesterday group still reads "Executed"
- [ ] First visit (nothing in `localStorage`): Account details opens with the samples only, and their sheets read as before

## 3. Editing (D1 to D4, D7)

- [ ] Pending, amount changed, schedule untouched: the schedule step opens with "Single", "As soon as possible" off and the booking's date; after Execute the booking is still `pending` with the same `executeOn`, `dateISO`, `accountKey`, `icon` and `direction`, the new amount, and Household is unchanged
- [ ] Pending, edited to "As soon as possible": the booking becomes `executed`, `executeOn` is gone, `dateISO` is now, and Household drops by the amount; its sheet then shows "Executed" with no Edit
- [ ] Recurring: the schedule step opens on "Recurring" with the toggle off; after Execute the booking is still `recurring`, the confirmation reads "Your recurring payment of … starts on …"
- [ ] Recurring, edited to "Single" with the toggle off: it becomes `pending`
- [ ] The Apple sample, amount changed: the schedule step opens with "As soon as possible" off; Execute adds a `pending` booking and hides the sample row
- [ ] A new payment from the Pay button after an edit still starts at "Single", "As soon as possible" on (no schedule left over from the edit)
- [ ] Keyboard: the sheet's Edit button by Enter opens the flow with focus on the amount; Tab and Enter reach the schedule step's controls, and their focus rings show

## 4. Everywhere

- [ ] Light and Dark, and a Multi-color theme: the chip and the schedule step read clearly
- [ ] Phone width (390): the edit runs end to end; no sideways scroll
- [ ] Reduced motion: the sheet and the Pay flow open and close without animation (the shared paths, unchanged)

## 5. Baseline smoke test

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

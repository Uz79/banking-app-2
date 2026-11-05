# Booking sheet: a transfer shows its real type and status (32, 46): validation

Branch: `feature/transfer-status`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on All bookings and Account details, on load and with a transfer's sheet open

## 2. The status (32)

- [ ] A transfer made with "Immediately" off (Household to Savings): its sheet reads "Pending" with the clock icon, on Account details and on All bookings (Pending tab)
- [ ] A standing order transfer: its sheet reads "Pending" (D2), in the Recurring tab
- [ ] An immediate transfer: its sheet reads "Executed" with the check icon
- [ ] The in-leg on Savings ("Transfer from Household") reads the same status as the out-leg (D5)
- [ ] No Edit button and no Edit action on a pending or recurring transfer's sheet (D6)
- [ ] A pending payment's sheet is unchanged: "Pending" with its Edit; a trade's sheet still reads "Executed" (D7)
- [ ] The first visit (nothing in `localStorage`): the built-in transfer rows (Transfer to Household, Transfer to Savings) open as before

## 3. The type on All bookings (46)

- [ ] A transfer made in the app opens as "Internal Account Transfer" with its debit and credit accounts, names, IBANs and balances matching Account details' sheet of the same booking
- [ ] The page has no transfer sheet: a typed `#iat/…` address opens nothing and leaves no error
- [ ] Opening and closing the sheet, the tabs, the month chips and search work as before

## 4. Layouts, keyboard and motion

- [ ] Desktop (1440px) and 390px, Light and Dark: a pending transfer's sheet on All bookings looks as on Account details
- [ ] A Multi-color theme: the sheet takes the theme
- [ ] Keyboard: the sheet's focus stays in it and goes back on close, as before (rows themselves can't be reached by keyboard, 33)
- [ ] Reduced motion on (the real macOS setting): the sheet opens and closes without sliding, and the page responds afterwards

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (measured at about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page; the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on: not yet.

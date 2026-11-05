# Booking rows: real status, counterparty icons and a status chip (43): validation

Branch: `feature/booking-chips`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on All bookings and Account details

## 2. The sheet

- [ ] All bookings, Pending: Swisscom, Helvetia Insurance and Tax office Zurich open "Pending" with their Execute on date, and no Edit (D1 to D3)
- [ ] All bookings, Recurring: Rent, Netflix and Internet & Phone open as payments (not transfers), with their next date, and no Edit
- [ ] All bookings, Executed: Transfer to Household opens as a transfer; Rent opens as a payment
- [ ] Account details: Pizza opens as a payment; Transfer to Household as a transfer; Apple as decided in the open question
- [ ] A pending and a recurring payment made in the app still show Edit, and Edit still opens Pay (31)

## 3. Icons and chips

- [ ] No booking row on either page shows `#i-repeat`
- [ ] Payments out show the out icon, money in the in icon; Transfer to Household shows the home icon, Transfer to Savings the anchor
- [ ] A transfer made in the app: the out leg shows the other account's icon on the sending account's list, the in leg likewise on the receiving one's
- [ ] Pending tab: every row has "Pending"
- [ ] Recurring tab: Rent, Netflix and Internet & Phone have "Monthly"; none says "Recurring"
- [ ] Executed tab: Rent's and Internet & Phone's executed instances have "Monthly"; one-off payments and incoming money have no chip
- [ ] Account details: Rent has "Monthly"; the others no chip (Apple per the open question)
- [ ] A recurring payment made in the app reads "Monthly"; one stored before this branch (no `frequency`) reads "Monthly" too
- [ ] Search still finds rows by name and amount; the chip doesn't change what matches

## 4. Layouts, themes, keyboard and motion

- [ ] Desktop (1440px) and 390px, Light and Dark: the chip sits after the name; at 390 a long name is cut before the chip, which stays whole with the amount
- [ ] A Multi-color theme: the chip takes the theme's tonal colours, readable in Light and Dark
- [ ] The first visit (nothing in `localStorage`): both pages show the built-in rows with their icons and chips
- [ ] Keyboard: the sheet's focus behaviour is unchanged (rows themselves are 33)
- [ ] Reduced motion on: nothing new moves

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

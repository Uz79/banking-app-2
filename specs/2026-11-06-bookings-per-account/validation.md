# Bookings per account: each account lists its own built-in rows (56): validation

Branch: `feature/bookings-per-account`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on All bookings (both accounts) and Account details

## 2. Rows by account (D1 to D5, D8, D10)

- [ ] First visit (after the reset), Savings' All bookings (from Account details' Savings "Show all", and with no query): Executed as before; Pending "No pending payments."; Recurring "No standing orders."
- [ ] Household's All bookings: Executed Today and Yesterday (Café, Pizza, Railway); Pending Apple, Swisscom, Helvetia Insurance, Tax office Zurich and the three standing orders' next payments, in date order; Recurring Rent, Netflix, Internet & Phone
- [ ] Month bands and month chips right on both accounts; search finds only the viewed account's rows
- [ ] Edit Swisscom on Household's view: the edited payment shows there, Swisscom's example row gone; Savings' view unchanged
- [ ] Delete Apple on All bookings: gone on Account details too, and the reverse after the reset
- [ ] A payment made in the app shows in Household's Today, not in Savings'

## 3. Figures and sheets (D6, D7, D9)

- [ ] Household's Today and Yesterday headers match Account details, before and after a payment
- [ ] Café, Pizza and Railway on All bookings open the same sheets as on Account details
- [ ] Copy of a Savings row (Migros): Pay opens; Execute books on Household

## 4. Look and access

- [ ] Desktop (1440px) and 390px, Light and Dark: both accounts' tabs, the empty lines
- [ ] A Multi-color theme: the empty lines take the theme
- [ ] Keyboard: tabs and month chips as before on both accounts
- [ ] Reduced motion: nothing new moves

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

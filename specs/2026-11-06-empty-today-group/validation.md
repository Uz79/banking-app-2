# No empty "Today" group (61): validation

Branch: `feature/empty-today-group`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on All bookings (both accounts) and Account details

## 2. Household's All bookings (D1, D3)

- [x] First visit (no payment state): no Today group; the June band sits over Yesterday, flush at the top; no stray divider
- [x] After a payment executed now (made through `UZBankPayState.commitPayment`, Pay itself not opened): Today is back with the payment and its balance, under June's band
- [x] After deleting that payment again: no Today group (by the payment state; in the app an executed payment has no Delete, so Klaudiusz checked the demo reset instead)
- [x] Pending and Recurring as before; the month chips scroll to June

## 3. Elsewhere (D2)

- [x] Savings' All bookings as before (Today with Salary)
- [x] Account details, both accounts: as before; Household's Today hides once Apple is deleted, as before

## 4. Look and access

- [x] Light and Dark, desktop and 390px (Light at desktop, Dark at 390px)
- [x] Search on Household: results and no-results line as before

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (measured at about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work (tabs and chips)

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



Checked on 2026-11-06 against `feature/empty-today-group`, Chrome on the agent's server (5199), desktop (1456px) and 390px in a same-origin frame, Light and Dark; lists read by script. Household: June's band (flush, first) over Yesterday with no Today and no stray divider; a payment of 120 executed now brought Today back (balance 9'780.00) under June, its Delete took it away again; Pending, Recurring, search ("Pizza": 1 booking; "zzz": nothing) and the Jun chip as before. Savings: Today (Salary), Yesterday and the months June to February as before. Account details: both accounts as before; Apple removed hides Household's Today as before. No console errors; the build passes. Not checked: the payment made through Pay's own sheet, a Multi-color theme, the real macOS Reduce motion setting (no motion added), VoiceOver, and in the baseline Pay, the transfer, Buy, page transitions, the status message, Profile, the Design system pages and Tab through Overview.

Checked on 2026-11-06 by Klaudiusz on 5175: a payment made through Pay, executed immediately, brought Today back on Household's All bookings with June's band above Today; after the demo reset Today was gone, June sat above Yesterday and no divider was left over. An executed payment has Copy only, no Delete, so the reset stood in for it (the agent's "Delete" above went through `UZBankPayState.deleteBooking`). VoiceOver and Reduce motion skipped: nothing new moves or is announced. Found: Household's card and the list's last balance disagree (roadmap 69).


# Savings' standing orders (59, with 57): validation

Branch: `feature/savings-standing-orders`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on All bookings (both accounts), Account details, Overview

## 2. The lists (D1, D2, D9)

- [ ] First visit (nothing in `localStorage`): Savings' Recurring shows Rent and Internet & Phone, Pending their next payments with the "Pending" chip
- [ ] Household's Recurring shows Netflix, Pending its next payment and Swisscom, Helvetia Insurance, Tax office Zurich, Apple
- [ ] Neither account shows a rule or payment twice; the empty lines show only on an empty tab
- [ ] After the demo reset: the same

## 3. The sheets (D8, 57)

- [ ] Rent's and Internet & Phone's rule and next payment read "Savings account"; Netflix's read "Household"
- [ ] Executed rows on both accounts read as before

## 4. Edit and Copy (D3 to D7)

- [ ] Edit of Rent's next payment on Savings: Pay shows Savings as Debit account; after Execute the edit is in Savings' Pending, not in Household's
- [ ] Edit of the Rent rule: the changed rule stays in Savings' Recurring
- [ ] Copy of a Savings executed payment: Pay shows Savings; the new payment is Savings' (list and balance)
- [ ] An amount over Savings' balance, executed now: the error names the amount against Savings' balance, not Household's
- [ ] Netflix's Edit and a fresh Pay from Overview: Household, as before
- [ ] After a reload, every edit is still on its account

## 5. Look and access

- [ ] Light and Dark, desktop and 390px
- [ ] Keyboard: the moved rows open by Enter, focus returns to them

## 6. Baseline smoke test

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



Checked on: not yet.

# Savings' standing orders (59, with 57): validation

Branch: `feature/savings-standing-orders`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on All bookings (both accounts), Account details, Overview

## 2. The lists (D1, D2, D9)

- [x] First visit (nothing in `localStorage`): Savings' Recurring shows Rent and Internet & Phone, Pending their next payments with the "Pending" chip
- [x] Household's Recurring shows Netflix, Pending its next payment and Swisscom, Helvetia Insurance, Tax office Zurich, Apple
- [x] Neither account shows a rule or payment twice; the empty lines show only on an empty tab
- [x] After the demo reset: the same

## 3. The sheets (D8, 57)

- [x] Rent's and Internet & Phone's rule and next payment read "Savings account"; Netflix's read "Household" (revised, D8: the payment sheet shows no debit account at all; Pay's card names the right account for each)
- [ ] Executed rows on both accounts read as before

## 4. Edit and Copy (D3 to D7)

- [x] Edit of Rent's next payment on Savings: Pay shows Savings as Debit account; after Execute the edit is in Savings' Pending, not in Household's
- [x] Edit of the Rent rule: the changed rule stays in Savings' Recurring
- [x] Copy of a Savings executed payment: Pay shows Savings; the new payment is Savings' (list and balance)
- [x] An amount over Savings' balance, executed now: the error names the amount against Savings' balance, not Household's
- [x] Netflix's Edit and a fresh Pay from Overview: Household, as before
- [x] After a reload, every edit is still on its account

## 5. Look and access

- [x] Light and Dark, desktop and 390px (Light at desktop, Dark at 390px)
- [x] Keyboard: the moved rows open by Enter, focus returns to them

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (measured at about 8 s on 2026-11-05, see `specs/2026-11-05-exit-prompt-labels/validation.md`)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
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



Checked on 2026-11-06 against `feature/savings-standing-orders`, Chrome on the agent's server (5199), desktop (1456px) and 390px in a same-origin frame, Light and Dark; flows driven by script, keyboard by real Enter. Both accounts' Pending and Recurring on a first visit (payment state removed) and after the demo reset; on Savings: Edit of Rent's next payment (1'700, on Savings, in place of the planned one), Edit of the Rent rule (1'750, the built-in hidden), Copy of Rent and of Manor (Savings, balance 25'000 to 24'900), 30'000 executed now ("You have CHF 24'900.00 in Savings account."); on Household: Netflix's Edit and a fresh Pay from Overview (Household, 9'900 to 9'400); Account details' Copy from each account's panel; all after a reload. Not checked: executed rows' sheets one by one, a Multi-color theme, Light at 390px, Dark at desktop, the real macOS Reduce motion setting (no animation added), VoiceOver, and in the baseline the transfer, Buy, All bookings' search, page transitions, the status message, Profile, the Design system pages and Tab through Overview.

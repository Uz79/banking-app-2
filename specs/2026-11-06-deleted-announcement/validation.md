# "Payment deleted." reaches VoiceOver (60): validation

Branch: `feature/deleted-announcement`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on All bookings, Account details and Profile

## 2. Timing (agent, by script; D1, D2)

- [ ] The status region is in the page before any Delete
- [ ] Delete of a pending payment on All bookings: the region stays empty while the confirmation is open, and reads "Payment deleted." after it closed, with focus on the next row
- [ ] The same for a pending transfer ("Transfer deleted."), and on Account details
- [ ] A second Delete is announced again (emptied first)
- [ ] With reduced motion: the same order
- [ ] Profile's Reset demo data: the line fills only after the confirmation closed; its icon shows as before

## 3. VoiceOver (Klaudiusz, D5)

- [ ] Delete a pending payment: VoiceOver says "Payment deleted." (with or after the next row)
- [ ] Delete a pending transfer: "Transfer deleted."
- [ ] Profile, Reset demo data: "Demo data reset."

## 4. Look

- [ ] Nothing changes on screen: Light and Dark, desktop and 390px

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

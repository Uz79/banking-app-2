# "Payment deleted." reaches VoiceOver (60): validation

Branch: `feature/deleted-announcement`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on All bookings, Account details and Profile

## 2. Timing (agent, by script; D1, D2)

- [x] Delete of a pending payment on All bookings, by keys: the next row takes focus described by the note "Payment deleted." (D7)
- [x] The note leaves the row once it loses focus; no other element keeps it
- [x] A pending transfer as the last row in Pending: the Pending tab takes focus described by "Transfer deleted."
- [x] Account details: the next row, "Payment deleted."
- [ ] With reduced motion: the same
- [x] Profile's Reset demo data: the line fills only after the confirmation closed; its icon shows as before

## 3. VoiceOver (Klaudiusz, D5): Chrome, then once in Safari

- [ ] Delete a pending payment: VoiceOver says the next row, then "Payment deleted."
- [ ] Delete a pending transfer: "Transfer deleted."
- [ ] One of these with Reduce motion on
- [x] Profile, Reset demo data: "Demo data reset." (Klaudiusz, Chrome, after group 1)

## 4. Look

- [ ] Nothing changes on screen: Light and Dark, desktop and 390px

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
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



Checked on 2026-11-06 by the agent against `feature/deleted-announcement`, Chrome on the agent's server (5199), desktop width, Light: the region and the focus sampled every 20 to 40 ms. By real keys on All bookings (Household, Helvetia Insurance): the confirmation closed at about 320 ms, focus moved to the next row (Tax office Zurich) at about 340 ms, "Payment deleted." was set at about 600 ms. By script: a pending transfer ("Transfer deleted."), a second Delete (emptied, then set again), Account details (Apple), Profile's reset twice (the line and its icon after the confirmation closed). No console errors; the build passes. Not checked: VoiceOver (section 3, Klaudiusz's), the macOS Reduce motion setting, the look in Dark and at 390px (no markup or CSS changed), the baseline beyond the build. Seen, not from this branch: with clicks made by script (no focus on the clicked buttons), focus after Delete ended on the page instead of the next row; with real keys it lands on the next row.

Checked on 2026-11-06 by Klaudiusz, VoiceOver in Chrome on 5175, after group 1: "Payment deleted." and "Transfer deleted." not heard (the next row was read, then nothing); "Demo data reset." heard; Reduce motion not run.

Checked on 2026-11-06 by the agent after group 2 (D7), Chrome on 5199, desktop, real keys: on All bookings (Household) Delete of Swisscom put focus on Helvetia Insurance described by "Payment deleted.", gone after Tab; on Savings, the only pending row (a transfer) deleted put focus on the Pending tab described by "Transfer deleted."; on Account details Delete of Apple put focus on Cafe with "Payment deleted.". No console errors; the build passes. Not checked: VoiceOver (Klaudiusz's, next), Reduce motion, the baseline beyond the build.

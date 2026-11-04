# 3D stages read the latest visibility entry (20): validation

Branch: `feature/observer-latest-entry`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). The Character kit is admin only: sign in through Profile's admin access first.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited

## 2. The forced case (D5)

- [ ] The helper specimen: a callback handed `[on screen, off screen]` stops the drawing; `[off screen, on screen]` starts it
- [ ] The persona stage (the kit's live specimen): the same two pairs behave the same way
- [ ] Before the fix, the same pairs show the bug (drawing follows the first entry), so the check really exercises it

## 3. Real scrolling

- [ ] Character kit, desktop: a fast scroll past the helper, the live specimen and the Vehicles stage and back; each moves when on screen (the helper's idle, the specimen turning, the vehicles' idle) and none is frozen
- [ ] Character kit at 390: the same
- [ ] Profile > User Type: the persona draws on load and after scrolling the panel away and back, desktop and 390
- [ ] Overview, desktop: the ambient figure draws in the corner; Payments and Account details too
- [ ] After a fast scroll the figure does not jump (the clock is reset when it comes back into view)

## 4. Everywhere

- [ ] Light and Dark, and a Multi-color theme: the stages look as before
- [ ] Reduced motion: the stages stay still as before

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

Checked on: not yet.

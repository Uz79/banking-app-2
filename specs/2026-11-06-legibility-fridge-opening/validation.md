# Legibility in the fridge and the opening (34): validation

Branch: `feature/legibility-fridge-opening`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors in the fridge, the opening, Profile and Overview

## 2. Legibility reaches both (D1 to D3, D6)

- [ ] First visit (nothing in `localStorage`): the fridge and the opening look as before (Regular, Profile Pro)
- [ ] Profile > Legibility Large: the fridge and the opening, in Overview's sheet and on their own pages, show the larger type and spacing
- [ ] Small: the same, smaller
- [ ] Typeface (for example Source Serif 4): both pages use it
- [ ] User Type to Newbie sets Large on every page, the fridge and the opening included
- [ ] Every other page (Overview, Account details, All bookings, Profile, the Design system pages) behaves as before at Small, Regular and Large

## 3. Layouts (D4, D5)

- [ ] The fridge, steps 1 to 7, at Large and Small, desktop and 390px: the floating panel, the sliders, the result ring ("You could invest" and the amount inside it), the buttons
- [ ] The opening, every screen at Large and Small, desktop and 390px: the progress indicator, the risk experience, the strategy carousel, the summary, the assistant column and its phone layer, the handoff
- [ ] Nothing overflows, clips or crosses an edge; long amounts (six digits) still fit

## 4. Look and access

- [ ] Light and Dark, and a Multi-color theme, at Large
- [ ] Keyboard: focus rings visible at Large in both
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

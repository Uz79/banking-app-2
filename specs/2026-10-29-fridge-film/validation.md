# The fridge as a film (8d): validation

Branch: `feature/fridge-film`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Start from a demo data reset and a fresh tab unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on Overview, the fridge, the opening and the Components page

## 2. The floating panel component (D5 to D7, D13)

- [ ] Components > "Floating panel": the panel floats over the striped background, which shows blurred through it; the docked form is shown too
- [ ] Light and Dark: the fill follows the page background, the rim reads, the drop shadow only in Light
- [ ] A Multi-color theme: the panel follows the theme with no raw colour (the fill, rim and shadow change with it)
- [ ] Reduced transparency (emulated in DevTools) and more contrast: the panel is solid, no blur
- [ ] No colour in the new CSS that is not a `--color-*` token or a `color-mix()` of them

## 3. The sheet and the layout (D1 to D4, D10, D14)

- [ ] Desktop (from 1024px): Overview > Offers > Investment opens a 960 sheet at `clamp(480px, 60vh, 640px)`, never taller than the window; the header is solid and unchanged
- [ ] The scene fills the sheet body; the panel floats on the right, inset from the edges, about 20rem wide, anchored at the bottom: Next is in the same place on all seven steps
- [ ] No step scrolls inside the panel at a 640 sheet, including step 5 with the assets note and the result
- [ ] "Show suitable products": the sheet narrows from 960 to 640 and the height does not move; "Start over" widens it again
- [ ] Phone (390 x 844): the sheet is full screen, the scene fills it, the panel is docked at the bottom with rounded top corners and the safe-area inset; no step scrolls
- [ ] The tablet range (a full-screen sheet between 640 and 1023 wide): the panel floats on the right, as on desktop (D4)
- [ ] Close, Escape, Back and the exit prompt work as before ("Leave this guide?" only after an entry)

## 4. The camera (D8, D9)

- [ ] Desktop: on every step the subject (the whole fridge, the drawers, the freezer) sits in the middle of the area left of the panel, nothing of it under the panel; the intro shows the fridge and the persona
- [ ] Phone: on every step the subject sits in the area above the docked panel, also on step 5 where the panel is tallest
- [ ] The glide between steps is as before (about 0.8 s, eased), the reframe for a different panel height rides on it; resizing the window reframes at once
- [ ] Reduced motion (`?reduced`, and the system setting if Klaudiusz switches it): every pose and reframe snaps, the doors and food snap, no cooling animation
- [ ] The food fills and the freezer result as before (salary 7'000, left 1'000, unplanned 21'000, assets 34'900: CHF 7'900)

## 5. Look, keyboard, accessibility (D7, D11, D12)

- [ ] Light, Dark, a Monochrome theme and a Multi-color theme: the panel text readable over the scene on every step, at 960 and at 390
- [ ] Keyboard only through the seven steps: header, then the panel's controls in order; the focus ring visible on the panel; the heading focused on each step; the sliders' keys and the number fields as before
- [ ] The live region still announces each step; the canvas stays `aria-hidden`
- [ ] No em dashes in any new copy (the Components caption)

## 6. Baseline smoke test

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

Checked on: not run yet. When it is, a dated line goes here saying when, where and how, and what was not checked.

# The fridge as a film (8d): validation

Branch: `feature/fridge-film`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Start from a demo data reset and a fresh tab unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (the 241 "can't be bundled without type=module" notices are the same classic-script notices every page prints)
- [x] The browser console shows no errors on Overview, the fridge, the opening and the Components page (only the browser extension's "message channel closed" noise)

## 2. The floating panel component (D5 to D7, D13)

- [x] Components > "Floating panel": the panel floats over the striped background, which shows blurred through it; the docked form is shown too
- [x] Light and Dark: the fill follows the page background, the rim reads, the drop shadow only in Light
- [x] A Multi-color theme: the panel follows the theme with no raw colour. Seen on the fridge's panel (Custom 06, Light and Dark), not on the Components page itself
- [ ] Reduced transparency (emulated in DevTools) and more contrast: the panel is solid, no blur. Not run: DevTools emulation is not reachable from the agent's browser tools; the rule is in the loaded stylesheet
- [x] No colour in the new CSS that is not a `--color-*` token or a `color-mix()` of them (the branch's diff has no hex, `rgb()` or `hsl()` value)

## 3. The sheet and the layout (D1 to D4, D10, D14)

- [x] Desktop (from 1024px): Overview > Offers > Investment opens a 960 sheet at `clamp(480px, 60vh, 640px)`, never taller than the window; the header is solid and unchanged (960 x 640 in a 1179px high window)
- [x] The scene fills the sheet body; the panel floats on the right, inset from the edges, 20rem wide, anchored at the bottom: Next is in the same place on all seven steps
- [x] No step scrolls inside the panel at a 640 sheet, including step 5 with the assets note and the hint (532 of 541px) and the result
- [x] "Show suitable products": the sheet narrows from 960 to 640 and the height does not move; "Start over" widens it again (960 x 640, step 1)
- [x] Phone (390 x 844): the sheet is full screen, the scene fills it, the panel is docked at the bottom with rounded top corners and the safe-area inset; no step scrolls (step 5 the tallest at 487px)
- [x] The tablet range (a full-screen sheet between 640 and 1023 wide): the panel floats on the right, as on desktop (D4; checked at 820)
- [x] Close, Escape, Back and the exit prompt work as before ("Leave this guide?" only after an entry; Escape with no entry closes; Leave returns focus to Investment)

## 4. The camera (D8, D9)

- [x] Desktop: on every step the subject (the whole fridge, the drawers, the freezer) sits in the middle of the area left of the panel, nothing of it under the panel; the intro shows the fridge and the persona
- [x] Phone: on every step the subject sits in the area above the docked panel, also on step 5 where the panel is tallest
- [x] The glide between steps is as before (about 0.8 s, eased), the reframe for a different panel height rides on it (sampled on the phone, step 4 to 5: the free height eases from 395 to 301 over the glide)
- [ ] Resizing the window reframes at once. Not run as its own check: the resize path snaps by construction (`resize()` calls `snap()` when no glide runs), but no window was resized with the camera code in place
- [x] Reduced motion (`?reduced`): every pose and reframe snaps. The system setting was not switched on
- [x] The food fills and the freezer result as before (salary 7'000, left 1'000, unplanned 21'000, assets 34'900: CHF 7'900)

## 5. Look, keyboard, accessibility (D7, D11, D12)

- [x] Light, Dark, the UZ Bank Monochrome theme and a Multi-color theme (Custom 06): the panel text readable over the scene, at 960 (steps 1, 5 and 7 looked at in each). At 390 only in the default theme
- [x] Keyboard only through steps 1 to 5: header, then the panel's controls in order; the focus ring visible on the panel; the heading focused on each new step; the number field takes typing and the slider the arrow keys. Steps 6 and 7 by keyboard not run
- [x] The live region still announces each step (its text read from the page, "Step 2 of 7. The main compartment. …"; not with a screen reader); the canvas stays `aria-hidden`
- [x] No em dashes in any new copy (the Components caption)

## 6. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload (sidebar on desktop, the top bar glyph at 390px)
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions (recorded: forward, then back; one back step was taken before the recorder was set)
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (Household 9'900 to 9'400, the booking in Executed; desktop in Dark and 390px in Dark)
- [x] Internal transfer completes (Household to Savings, CHF 500)
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed (the close button and "Discard"; Escape and a backdrop click did not close it)
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview (desktop and 390px; set back to Newbie)
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (each set back)
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly (desktop and 390px)
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit (and Payday run); only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not run: the system setting is Klaudiusz's to switch

Checked on 2026-10-30 against `feature/fridge-film`, Chrome on macOS, the agent's server on 5199: desktop (the 960 x 640 fridge sheet in a 2391 x 1179 window), 820 and 390 x 844 (injected frames), Light and Dark, the UZ Bank Monochrome theme and a Multi-color theme (Custom 06). Sections 2 to 5 were run across the task groups' checks (2026-10-29 and 2026-10-30); the build and the baseline ran in the wrap-up pass, the ★ items repeated in Dark at desktop and 390px. Not checked: reduced transparency and more contrast (DevTools emulation); reduced motion with the system setting on (only `?reduced`); a window resize with the new camera code; keyboard on steps 6 and 7; the colour themes at 390px on the fridge; a screen reader; a window short enough for the 480 minimum height. Seen during the pass, not caused by this branch: on a phone the result ring's amount wraps ("CHF" over the number) and "You could invest" touches the ring (the ring's rules are unchanged from `main`); the trade sheet does not close on Escape or a backdrop click (its close button does); the trade exit prompt says "Continue payment"; on Profile at 390px the character overlaps the sliders.

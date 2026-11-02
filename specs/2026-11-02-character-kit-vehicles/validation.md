# Vehicles in the Character kit (9c): validation

Branch: `feature/character-kit-vehicles`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175), on `character-kit.html` signed in as admin, unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the Character kit page, Overview and the opening
- [ ] Only the five models are in `assets/3d/vehicles/`, with `CREDITS.md`; nothing else from the Poly Pizza folder is in the repo

## 2. The vehicles (D1 to D4, D8, D10)

- [ ] The "Vehicles" section sits after "The helper"; the stage shows the Income tent first
- [ ] Each of the five picks shows the right vehicle: Income tent, Conservative tricycle, Balanced Vespa, Growth parachute, Dynamic jetpack
- [ ] Each vehicle is sized to the persona (none toy-small or giant unless the spec records why), whole in the frame, with its shadow on the floor
- [ ] The entry `pre` and the table match the pick
- [ ] Light, Dark and a Multi-color theme: the vehicles in the theme's monochrome, no original colours left (no red tricycle, no orange jetpack flame), the persona's accent the only colour

## 3. The persona (D5, D6, D9)

- [ ] Tent: standing beside it in the idle
- [ ] Tricycle and Vespa: seated, hands near the handlebars, no leg through the body
- [ ] Parachute: hanging under the canopy in the jump pose; jetpack: on the back, in the jump pose
- [ ] With each profile (Beat, Lena, Max, picked in the live specimen above): headwear and capes do not cut badly through the vehicles
- [ ] Switching plays the squash and spring on the whole group; fast picks end on the last one, never on a mix of two

## 4. Motion and access (D7)

- [ ] The jetpack hovers and the parachute sways; the tent, tricycle and Vespa stand still
- [ ] Reduced motion (`?reduced`, and the system setting if Klaudiusz switches it): no hover, no sway, the persona still in its pose (seated on the tricycle and the Vespa), switches instant
- [ ] Keyboard: Tab reaches each strategy button, the focus ring is visible, a pick works with Enter or Space
- [ ] A pick made while the 3D is still loading is shown once it is ready
- [ ] The stage stops drawing when scrolled off screen (no frames in the Performance panel while it is out of view)
- [ ] Desktop and phone width (390): the picker wraps without overflow, the stage fits above it

## 5. Credits (D11, D12)

- [ ] The credit links take the interactive colour (not the browser's blue) and show the focus ring
- [ ] A "Credits" section after "Assets" lists Tricycle and Parachute (Poly by Google), Jetpack (Roman Miller) and Vespa (Jasmine Roberts), each CC-BY via Poly Pizza with a working link, and the tent (Quaternius, CC0)
- [ ] "Assets" mentions `assets/3d/vehicles/`
- [ ] No em dashes in the new copy

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

Checked on: not yet run.

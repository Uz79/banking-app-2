# Fridge: the persona exits and returns (8e): validation

Branch: `feature/fridge-persona-walk`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Start from a demo data reset and a fresh tab (no `uzBankWebOpeningDraft`) unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on Overview, the fridge and the opening

## 2. The walk (D1 to D3, D7)

- [ ] Next on step 1: the persona turns right and walks out of the frame in about a second, feet not sliding, while the camera glides to the main compartment
- [ ] Steps 2 to 6: no persona anywhere in the frame (also while the camera glides between them)
- [ ] Back from step 2: it walks back in from the right to its intro spot and turns as on load
- [ ] Fast clicks (Next, Back, Next within a second, and with the keyboard): it never stops halfway, faces the wrong way or walks on the spot (D9)

## 3. The result (D4 to D6)

- [ ] Next on step 6: during the door, the frost and the freezer opening, the persona walks in from the right and stands next to the open freezer as the amount appears, then turns toward the viewer and idles
- [ ] The result frame: the freezer's food readable and the persona's head and upper body beside it, on desktop (960 sheet) and at 390 (above the docked panel)
- [ ] Back from step 7: it walks out to the right; step 6 shows no persona
- [ ] Step 4 (the tour's freezer) keeps its close-up and has no persona
- [ ] "Show suitable products" hands over to the opening as before; "Start over" from the opening's intro brings the fridge back at step 1 with the persona at its spot

## 4. Look and motion (D8)

- [ ] Light, Dark and a Multi-color theme: the persona recoloured as before, its shadow on the floor while it walks
- [ ] Reduced motion (`?reduced`, and the system setting if Klaudiusz switches it): no walk and no turn; the persona is at its spot on steps 1 and 7 and absent on 2 to 6, at once
- [ ] Desktop (the 960 sheet) and phone width (390 x 844)

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

Checked on: not yet run.

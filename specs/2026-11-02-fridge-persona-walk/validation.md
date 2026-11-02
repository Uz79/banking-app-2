# Fridge: the persona exits and returns (8e): validation

Branch: `feature/fridge-persona-walk`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Start from a demo data reset and a fresh tab (no `uzBankWebOpeningDraft`) unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on Overview, the fridge and the opening

## 2. The walk (D1 to D3, D7)

- [x] Next on step 1: the persona turns right and walks out of the frame in about a second, feet not sliding, then the camera glides to the main compartment (D3 amended)
- [x] Steps 2 to 6: no persona anywhere in the frame (also while the camera glides between them)
- [x] Back from step 2: it walks back in from the right to its intro spot and turns as on load
- [x] Fast clicks (Next, Back, Next within a second, and with the keyboard): it never stops halfway, faces the wrong way or walks on the spot (D9)

## 3. The result (D4 to D6)

- [x] Next on step 6: during the door, the frost and the freezer opening, the persona walks in from the right and stands next to the open freezer as the amount appears, then turns toward the viewer and idles
- [x] The result frame: the freezer's food readable and the persona's head and upper body beside it, on desktop (960 sheet) and at 390 (above the docked panel)
- [x] Back from step 7: it walks out to the right; step 6 shows no persona
- [x] Step 4 (the tour's freezer) keeps its close-up and has no persona
- [x] "Show suitable products" hands over to the opening as before; "Start over" from the opening's intro brings the fridge back at step 1 with the persona at its spot

## 4. Look and motion (D8)

- [x] Light, Dark and a Multi-color theme: the persona recoloured as before, its shadow on the floor while it walks
- [x] Reduced motion (`?reduced` only; the system setting was not switched): no walk and no turn; the persona is at its spot on steps 1 and 7 and absent on 2 to 6, at once
- [x] Desktop (the 960 sheet) and phone width (390 x 844)

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions. Forward seen mid-transition; back works, its direction not seen by eye
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it. Seen and dismissed; it was already up on load in this session, so the 12 s delay was not timed

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on 2026-11-02 against `feature/fridge-persona-walk` (after `c8d67b7`), on the agent's server (port 5199) in Chrome: desktop at a 2391 x 1179 viewport (the 960 sheet; not resized to 1440), phone width as a 390 x 844 frame of the app; Light and Dark; the UZ Bank (Monochrome) and Custom 06 (Multi-color) themes; reduced motion with `?reduced`. The walk was judged by eye in frames slowed through the page clock (`performance.now` scaled) and by sampled positions at real speed; fast Next and Back by script within 150 to 300 ms. Build passes; no console errors on the pages visited. Not checked: the system reduced-motion setting (Klaudiusz's to switch); the direction of the back page transitions by eye; the Design system hub's arrow nudge on hover; a throttled CPU; a real screen reader (nothing in this change is announced). Found and put on the roadmap (item 19): the result ring's text spills over the ring at 390, from before this branch. Known issues from before this branch, unchanged: the Pay schedule shows Hans Meyer whatever the recipient; the trade and transfer exit prompts say "Continue payment"; the Profile character overlaps the sliders at 390.

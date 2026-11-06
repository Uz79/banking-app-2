# Arrow nudge with reduced motion (36): validation

Branch: `feature/arrow-nudge-reduced-motion`. Run on the agent's server (port 5199), then the baseline smoke test.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] No console errors on the pages visited below

## 2. Reduced motion on (macOS Reduce motion, D1, D4)

- [x] Overview: Details and Show all are still; nothing is stuck mid-nudge (the arrow sits at rest)
- [x] Account details: Show all bookings is still; the page back arrow is still
- [x] Pay, the transfer, Buy: the flow's back arrow and the proceed arrow are still; the last step doesn't pulse (D5)
- [x] The fridge and the opening: their forward and back arrows are still
- [x] Profile and the Design system pages, Motion specimens No. 009 included: every arrow is still
- [x] Phone width (390px): the same on Overview and a flow step (Overview and Account details at 390px; the flows at desktop width, as the rule doesn't depend on width)

## 3. Reduced motion off

- [x] Every arrow above nudges as before (forward right, back left), and pauses while pointed at
- [x] The proceed arrow nudges and the last step pulses as before
- [x] The Playground's steer button doesn't nudge (as before)

## 4. Disabled (D3)

- [x] A forward arrow on a disabled or `aria-disabled="true"` control is still, with reduced motion off

## 5. Look and access

- [x] Light and Dark, and a Multi-color theme: nothing changes in look (the change sets no colour or size; Light and Dark switched on Overview)
- [ ] Keyboard: focus rings on the arrow buttons as before

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



Checked on 2026-11-06 against `feature/arrow-nudge-reduced-motion`, Chrome on the agent's server (5199), desktop (1512px) and 390px in same-origin frames, with the real macOS Reduce motion setting switched on and then off by Klaudiusz. By script on 14 pages (every arrow's computed animation and the running animations), plus Pay, the transfer and Buy stepped through to their last step: with the setting on nothing nudges or pulses; with it off every arrow nudges as before, the proceed arrow nudges and the last step pulses, the Playground's steer button and the trade's last step (its arrow is hidden) stay still, and hover pauses the nudge. Disabled and `aria-disabled` arrows set in the browser stay still. Baseline: Overview, Pay to Hans Meyer through to Done, Light and Dark, the build. Not checked: the arrows watched by eye with the setting on (by computed style only), keyboard focus rings, a Multi-color theme, Dark surviving a reload, the transfer and Buy executed, All bookings' tabs and search, Profile, the Design system's own checks, the page transitions and the character with reduced motion, VoiceOver.

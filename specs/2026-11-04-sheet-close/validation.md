# Sheets close without waiting for an animation (35): validation

Branch: `feature/sheet-close`. Tick each item in a real browser on the agent's test server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

Reduced motion here means the macOS setting (System Settings > Accessibility > Display > Reduce motion), switched by Klaudiusz when asked (D7). "Click behind" means: after the close, click a control on the page (for example Pay or a tab) and see it respond.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. The sweep, reduced motion ON (D7)

Desktop:

- [ ] Pay (Overview): open, close, click behind
- [ ] The internal transfer (Overview): open, close, click behind; and closed through "Discard transfer?"
- [ ] Buy and Sell (a position's page): open, close through "Discard order?", click behind
- [ ] The booking sheet (Account details, All bookings): open, close, click behind
- [ ] Account information, then Share information over it (Account details): close Share, click in Account information; close it, click behind
- [ ] The fridge (Overview > Investment): open, close through "Leave for now?", click behind
- [ ] The opening in the fridge's sheet ("Show suitable products"): close, click behind
- [ ] The Playground sheet (Design system, admin): open, close, click behind

Phone (390):

- [ ] Pay, the transfer, the booking sheet: open, close, tap behind
- [ ] The opening's assistant layer (Help?): open, close with its X, tap in the step; then close the sheet and tap behind

## 3. The sweep, reduced motion OFF (D2)

- [ ] Each sheet above still slides out as before and the page behind takes a click after it
- [ ] Closing a sheet and opening another straight after (Pay, then the transfer) works

## 4. Unchanged

- [ ] Sheet focus (27): after a keyboard close, focus is back on the opener with the ring; nothing is left `inert`
- [ ] The Discard prompts, the picker sheets and the Playground settings dialog open and close with reduced motion on and off
- [ ] Light and Dark, and a Multi-color theme: no change in how the sheets look

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

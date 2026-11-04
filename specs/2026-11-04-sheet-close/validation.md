# Sheets close without waiting for an animation (35): validation

Branch: `feature/sheet-close`. Tick each item in a real browser on the agent's test server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run, not before.

Reduced motion here means the macOS setting (System Settings > Accessibility > Display > Reduce motion), switched by Klaudiusz when asked (D7). "Click behind" means: after the close, click a control on the page (for example Pay or a tab) and see it respond.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (the browser extension's entries aside)

## 2. The sweep, reduced motion ON (D7)

Desktop:

- [x] Pay (Overview): open, close, click behind
- [x] The internal transfer (Overview): open, close, click behind; and closed through "Discard transfer?" (with real mouse clicks: X, Discard, then Pay opens)
- [x] Buy and Sell (a position's page): open, close through "Discard order?", click behind
- [x] The booking sheet (Account details, All bookings): open, close, click behind
- [x] Account information, then Share information over it (Account details): close Share, click in Account information; close it, click behind
- [x] The fridge (Overview > Investment): open, close through "Leave for now?", click behind
- [x] The opening in the fridge's sheet ("Show suitable products"): close, click behind
- [x] The Playground sheet (Design system, admin): open, close, click behind

Phone (390):

- [x] Pay, the transfer, the booking sheet: open, close, tap behind
- [x] The opening's assistant layer (Help?): open, close with its X, tap in the step; then close the sheet and tap behind

## 3. The sweep, reduced motion OFF (D2)

- [x] Each sheet above still slides out as before and the page behind takes a click after it
- [x] Closing a sheet and opening another straight after (Pay, then the transfer) works

## 4. Unchanged

- [x] Sheet focus (27): after a keyboard close, focus is back on the opener with the ring; nothing is left `inert`
- [x] The Discard prompts, the picker sheets and the Playground settings dialog open and close with reduced motion on and off
- [x] Light and Dark, and a Multi-color theme: no change in how the sheets look

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

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
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub (Motion and Character kit checked, back returns to the hub; Components not opened this run)
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [x] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. One exception, not from this branch: the forward arrows (Show all bookings) keep their nudge; logged as roadmap 36

## Notes

- **During the build** (groups 1 and 2), reduced motion was emulated: the reduced-motion sheet rules injected and `MediaQueryList.matches` stubbed for the reduce query. With it every sheet's close cleared the overlay and the page took the click; the booking sheet's Edit still opened Pay with the close now finishing at once.
- **The sweep with the real setting** (Klaudiusz switched it on, then off): `matchMedia('(prefers-reduced-motion: reduce)')` read `true`, then `false`. The transfer was closed with real mouse clicks (X, Discard) and a real click on Pay opened Pay. Most other opens, closes and "click behind" checks were scripted clicks plus `elementFromPoint` on the control behind, to confirm no layer covers it; the Playground (settings, X, then the Motion card) used real clicks.
- **Phone width** was a 390 × 760 frame inside the desktop tab, so the real setting applied; taps were clicks, not touch.
- **Off:** a mid-close read of each shell's transform (around 100 to 320 px down, 100 ms in) confirmed the slide still runs; overlays clear after it. The Discard dialogs keep their own close animation as before.
- **Page transitions:** the back step's animation (`uz-back-step`, `section-build-leaving`) was seen running when leaving All bookings; the forward direction was seen only as the navigation completing, since screenshots time out while the transition runs.
- **Status message:** in a fresh tab it appeared after 12.2 s; in a tab that had seen it before, the session keeps it showing at once, as designed.
- Console: only the browser extension's "message channel closed" entries; no errors from the app.
- **Found:** roadmap 36 (forward arrows keep their nudge with reduced motion), committed on this branch on its own.
- State after testing: demo data reset, `uzBankWebAppearance` restored exactly, persona sliders back at 0, UZ Bank theme (no colour override), Light.

Checked on 2026-11-04 against `feature/sheet-close`, Chrome (Claude in Chrome) on macOS, desktop (1605 px wide window) and 390 × 760, Light and Dark, the UZ Bank theme and one Multi-color theme, with the macOS Reduce motion setting on and off (switched by Klaudiusz). Not checked: Safari and Firefox; a real phone or touch input; a screen reader; the Components specimen page (not opened this run).

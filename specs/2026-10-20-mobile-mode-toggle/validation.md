# Mobile Light/Dark toggle: validation

Branch: `feature/mobile-mode-toggle`. Tick each item in a real browser (`cd apps/web && npm run dev`). Unless a line says otherwise, check at phone width (390px).

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

## 2. The button

- [x] Overview, Payments, Profile and Design system (as admin) show the button in the top left of the bar; the title stays centred
- [x] In Light it shows the sun, in Dark the moon
- [x] Tapping it switches the mode instantly; the icon changes, the page recolours, and the mode survives a reload
- [x] First visit (nothing in `localStorage`): the icon matches the mode the app opens in (Dark)
- [x] With a Multi-color theme picked in Profile > Theme, the toggle switches that theme's Light and Dark; the UZ Bank default theme restores exactly
- [x] Changing the mode from Profile > Theme, or with the sidebar at a wider window, changes the icon to match
- [x] The button is 32 × 32 dp with a 24 dp glyph and no border or fill (measure it); hover and pressed come from the icon-only button component; the focus ring uses `--color-fg-interactive`
- [x] The accessible name reads "Switch to Dark mode" in Light and "Switch to Light mode" in Dark, and updates after a tap
- [x] The button is not on the deeper screens: Account details, All bookings, Details of position, the specimen pages (their back arrow is unchanged)
- [x] At 1280px and wider the button is hidden and the sidebar's Light/Dark still works
- [ ] On a phone, the button does not keep its hover fill after a tap (it shows the pressed fill only while the finger is down)
- [ ] Reduced motion: nothing animates because of the toggle
- [x] Legibility presets (Profile > Legibility), including the largest, do not push the button or the title out of the bar
- [x] The status message ("Open payment!") appearing above the bar does not cover or shift the button

## 3. Baseline smoke test

Copied from `specs/baseline/validation.md`. Run after the checks above. Setup: `cd apps/web && npm run build`, then `npm run dev` and open `http://localhost:5175/overview.html`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview > Account details > All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### Banking flows

- [ ] ★ Pay: recipient search > recipient > amount > schedule > summary > confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account > a position > Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on, page transitions and the character are still, and nothing is stuck mid-animation

---

Checked on 2026-10-20 against `feature/mobile-mode-toggle` (after group 2), Chrome on macOS (Apple M4), served by `npm run dev` on a scratch port (5177) with its own storage; 390px and 1440px through same-origin iframes of that size (the window could not be resized); taps by script or dispatched clicks; keyboard focus by calling `focus()`, not by a real Tab press. Light, Dark, a green Multi-color theme and the default UZ Bank theme were looked at. `npm run build` is clean.

Seen working: the button on all four main screens (32 × 32 dp, 24 dp icon, title centred, sun in Light and moon in Dark); the first visit shows the moon; a tap switches, saves and survives a reload; the sidebar's Light and Dark (at 1440px, where the button is hidden) keep the button's icon and name in step; the toggle on a Multi-color theme keeps the theme's accent in both modes, and the UZ Bank card restores the default colours; the largest Legibility preset does not push the button into the title; the status message sits below the bar; the focus ring shows (2 px outline); no toggle on Account details, All bookings, Details of position or Investment product details.

Not checked, and so not ticked:
- A phone: the no-hover-after-tap behaviour (D9), the 32 dp tap target, and the feel of the button next to the 44 dp bar buttons.
- The reduced-motion setting (the switch is instant and the button adds no animation, but the system setting was not turned on).
- The console on each page (no errors came up in the scripts, but it was not read).
- Baseline: Pay and Internal transfer, Custody > Buy, All bookings tabs, chips and search, User Type, Legibility effects, Demo data reset, the page transitions, Design system sub-pages, the Overview focus pass and the baseline's reduced-motion pass. This change only touches the top bar of four pages, but a check that wasn't run is not a pass.

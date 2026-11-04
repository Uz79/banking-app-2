# 3D stages read the latest visibility entry (20): validation

Branch: `feature/observer-latest-entry`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). The Character kit is admin only: sign in through Profile's admin access first.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on the pages visited (the browser extension's "message channel closed" entries aside)

## 2. The forced case (D5)

The page was loaded in a same-origin frame and patched while still parsing, so every stage's observer callback was recorded, and WebGL draw calls were counted per canvas over 800 ms.

- [x] The helper specimen: `[on screen, off screen]` stops the drawing (0 draws); `[off screen, on screen]` starts it (891)
- [x] The persona stage (the kit's live specimen): the same, 0 and 1442 draws
- [x] Before the fix, the same pairs showed the bug: the helper drew 891 times on `[on, off]` and 0 on `[off, on]`, the specimen 1386 and 0. The Vehicles stage, already fixed in 9c, was right before and after (0 and about 2200)

## 3. Real scrolling

- [x] Character kit, desktop: three fast sweeps top to bottom and back, then each stage in turn; only the stage on screen draws (helper 459, specimen 714, vehicles 1122 draws in 400 ms) and the other two are still
- [x] Character kit at 390 (a 390x760 frame): the same
- [ ] Profile > User Type: the persona draws on load and after scrolling the panel away and back. It draws on load and throughout; at 1456 wide the figure never left the view while the panel scrolled, so "off screen" was not reached there. Not checked at 390
- [x] Overview, desktop: the ambient figure draws in the corner; Payments and Account details too
- [ ] After a fast scroll the figure does not jump (the clock is reset when it comes back into view). Not judged separately; the line that resets the clock is unchanged

## 4. Everywhere

- [ ] Light and Dark, and a Multi-color theme: the stages look as before. Light and Dark checked on the Character kit; the Multi-color theme was checked on Overview (the ambient figure), not on the kit
- [ ] Reduced motion: the stages stay still as before. Not checked: a system setting the agent cannot change

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (extension entries only)

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop. Light desktop, Dark at 390 (tab bar)
- [x] ★ Light/Dark toggle switches instantly and survives a reload (Dark at 390, reloaded)
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions: forward pages arrive from the right, back from the left (read from the page's entry class during each navigation)
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (with its session keys cleared: absent at 7 s, there at 15 s; gone after a tap)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update. Desktop Light with a typed search (Lena Fischer, Household 9'900 to 9'400); Dark at 390 with a recommended recipient (Hans Meyer, 9'900 to 9'400)
- [x] Internal transfer completes (Household to Savings, CHF 500)
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed ("Discard order?", Discard)
- [x] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview. Desktop Light by keyboard (Power user: hat, title, preview); Dark at 390 the slider snapped 70 to 50. The title at 390 was not read
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work. Compact applied; Typeface changed the page font to DM Sans; Font and Paddings moved their stored scales (the rendered size not measured); the stored setting restored after
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly. Custom 01 on Overview in Light desktop and Dark at 390; UZ Bank card restored, no colour override left
- [x] Demo data reset restores the Household balance (9'900: 10'000 less today's fixed 100)

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move (on hover only the arrow runs `uz-arrow-nudge`, the leading icon does not)
- [x] Motion specimens, Components and Character kit open, and back returns to the hub (each page's back button)
- [x] The Character kit specimen loads and the profile buttons change the figure (Max, Power user: hat, knight, cape)

### 6. Accessibility

- [x] Tab through Overview: focus is always visible (the first seven stops; the ring shows on the theme toggle)
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not checked: a system setting the agent cannot change

Checked on 2026-11-04 against `feature/observer-latest-entry` (c1122c8), Chrome on the agent's server (5199), desktop 1456 wide and a 390x760 frame, Light and Dark, the UZ Bank theme and Custom 01, by script (recorded observer callbacks, WebGL draw counts) and by hand. Not checked: reduced motion; Profile's persona off screen (it never left the view) and at 390; the jump after a fast scroll as its own check; the Multi-color theme on the kit itself; the User Type title at 390; the rendered size for Font and Paddings. Test data cleared with the demo reset; legibility, Light mode, the UZ Bank theme and User Type restored.

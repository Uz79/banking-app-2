# The fridge as a film (8d): plan

Branch: `feature/fridge-film`. Decisions are cited as D1 to D15 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The floating panel component (D5 to D7, D13)

What you see: a "Floating panel" section on the Components page, with the panel floating and docked over a striped background, frosted in Light and Dark.

- [x] `css/styles.css`: the `.float-panel` section (the `::before` glass layer, the rim, the Light shadow, the custom properties, `.float-panel--docked`), the reduced-transparency and high-contrast fallback, the `@supports not (backdrop-filter)` fallback; colours only from the tokens (D6)
- [x] `components.html`: the "Floating panel" section with the live example and the caption (D13)
- [x] Check: Light and Dark, the striped background visibly blurred, the rim and shadow (none in Dark), the docked form; both fallback rules present in the loaded stylesheet. Not yet: a Multi-color theme and the fallback seen with `prefers-reduced-transparency` emulated (DevTools emulation is not reachable from the agent's browser tools); both move to group 4

## 2. The sheet and the layout (D1 to D4, D10)

What you see: the fridge in a 960 x 640 sheet, the scene filling the body, the steps in a frosted panel on the right; on a phone the panel docked at the bottom over the scene; the hand-over to the opening only narrowing the sheet.

- [x] `js/fridge-advisor-sheet.js`: `setWide` keeps the fixed height for the fridge (D1)
- [x] `css/styles.css`: the panel floats on the right, bottom-anchored, 20rem (D3), or docked on a phone (D4); the two-column grid and the stacked layout removed; `.fridge__actions` without its own background (D10). The stage fills the page below its own header (the fridge's nav when unframed), so the canvas spans the whole sheet body
- [x] `fridge-advisor.html`: the panel has `.float-panel`; `js/fridge-advisor.js` adds `.float-panel--docked` below a 640px page
- [x] Measure every step at a 640 sheet and at 390 x 844: no scrolling inside the panel; open questions 1 and 2 settled (spacing tightened at 20rem; the docked panel scrolls only on short phones)
- [x] Check: each step on desktop and phone, the hand-over to the opening (960 to 640, height stays 640) and "Start over" (back to 960 x 640), Escape with no entry closes, the tablet range by eye at 820 (open question 3: floats from 640)

## 3. The camera and the free area (D8, D9)

What you see: on every step the subject sits in the middle of the space the panel leaves free, on desktop and on a phone, with the glide as before.

- [x] `js/fridge-advisor-scene.js`: the free area (`setFree`), `setViewOffset` to its centre, the fit measured in it; the view (and the lens) glides to a new free area with the camera, a resize snaps, reduced motion snaps (D8)
- [x] `js/fridge-advisor.js`: a `ResizeObserver` on the panel and the stage tells the scene the free area
- [x] `js/fridge-advisor-config.js`: the poses retuned: intro `width` 4.1 to 4.6, reserve 1.0 to 1.2, freezer 1.2 to 1.5 (the free area is wider than the old column, so the height fit had brought them too close); main unchanged (D9)
- [x] Check: every step at 960 x 640 and at 390 x 844, the doors and food in view, nothing under the panel; the phone's step 4 to 5 reframe eases with the glide (sampled); `?reduced` on the page on its own snaps at once; no console errors

## 4. Themes, keyboard and fallbacks (D7, D11, D12)

- [x] Light, Dark, the UZ Bank Monochrome theme and a Multi-color theme (Custom 06, orange accent) in Light and Dark: the panel's text readable over the scene (steps 1, 5 and 7 looked at in each); the fill follows each theme's background. No code change was needed
- [x] Keyboard from Overview (Enter on Investment) through steps 1 to 5: Tab reaches Next, the ring is visible on the glass, the heading takes focus on each new step, the live region carries the step; on step 5 the number field takes typing and the slider the arrow keys, both with a visible ring
- [x] Reduced motion (`?reduced`, in group 3)
- [ ] Reduced transparency emulated: not run. DevTools emulation is not reachable from the agent's browser tools; the rule is in the loaded stylesheet (group 1). For Klaudiusz: DevTools > Rendering > `prefers-reduced-transparency`
- [x] Check: the themes at 960; the phone width was covered in groups 2 and 3 in the default theme only

Seen, not caused by this branch: on a phone the result ring's amount wraps ("CHF" over "7'900") and "You could invest" touches the ring; the ring's rules are unchanged from `main`. On opening, focus stays on the frame's body until the first Tab (the heading is focused from step 2 on); this branch does not touch focus, but it was not compared with `main`.

## 5. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` item 8d marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the floating panel component, the fridge's sheet in the "Wide flow sheets" and "Fixed-height flow sheets" rows and in Other systems); the fridge spec's D16 and D21 marked as replaced by this spec's D2 and D3

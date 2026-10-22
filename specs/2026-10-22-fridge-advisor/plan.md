# Fridge advisor (8a): plan

Branch: `feature/fridge-advisor`. Decisions are cited as D1 to D20 from `requirements.md`.

Review stops (requested at review): after group 1, after group 2, and after group 4 (where the sliders first fill the shelves); otherwise the groups run through to validation. Each group ends with something to look at in the browser (`cd apps/web && npm run dev`, `http://localhost:5175/overview.html`; the agent uses port 5199, see AGENTS.md). On the feature branch each group is committed on its own once implementation is approved. Nothing is merged to `main` without an explicit ask.

## 1. Assets, the page and the sheet (stop here for review)

What you see: on Overview, Offers > Investment opens an empty full-screen sheet that slides up like the payment flow, with Back hidden and a close button; the close slides it down.

- [x] Copy `kitchenFridge.glb`, the 15 food models (D12), `Textures/colormap.png` and both `License.txt` into `apps/web/assets/3d/fridge/` (a `furniture` and a `food` folder, like the Playground's `town` and `forest`)
- [x] `fridge-advisor.html`: head and boot script as `playground.html` (title "UZ Bank – Fridge advisor", no `admin-boot.js`, no page-transition scripts), icon sprite, `body.body[data-screen="fridge-advisor"][data-page="fridge-advisor"]`, `h1`, stage, panel, Back and close buttons (D1, D3, D16)
- [x] Register the page (D1): `vite.config.js`, `NAV_DEPTH` in `js/section-build-boot.js` and `js/shell-nav.js`, `ROOT_TAB_BY_SCREEN` in `js/shell-nav.js`, the `.body[data-screen="fridge-advisor"]` rules in `css/styles.css`
- [x] `js/fridge-advisor-sheet.js` and the sheet markup and CSS on `overview.html` (copy the Playground's overlay, `.modal-overlay--playground`); `overview.html`: the Investment item links to `fridge-advisor.html` (D2)
- [x] `js/fridge-advisor.js`: close by `postMessage`, the exit dialog logic (D3), Escape
- [x] Check the build emits `fridge-advisor.html`

Note on group 1 (built 2026-10-22): to look and move exactly like the payment and trade flows, the sheet on `overview.html` is a real flow sheet (`.modal-overlay > .modal-shell > .modal.modal--trade-flow.modal--fridge-flow`, with `.modal__nav` for Back, title and close) and only the page content lives in the iframe in its body. So the header is the flows' own, not a copy; the page talks to the sheet by `postMessage` (state: can go back, has entries; Escape; Back) and shows the same header itself only when opened on its own (`html.fridge--framed` hides it). The sheet is the flows' 640px column on desktop and full screen on a phone, so the desktop two-column layout in D16 does not fit and is flagged for review.

## 2. The fridge and the figure in the theme (stop here for review: the hollow-or-boxes decision)

What you see: the closed fridge with the persona standing next to it, in the active theme, in Light, Dark and a Multi-color theme.

- [x] `js/fridge-advisor-config.js`: first version (scale, camera poses, door angles and durations, capacities, ranges, `maxPixelRatio`) (D7, D10, D11, D19)
- [x] `js/fridge-advisor-scene.js`: renderer, scene, camera, lights; load `kitchenFridge.glb`; theme recolour through the shared helpers; the figure from `createFigure()` in `Idle_A` (D5, D14)
- [x] Render the fridge open and decide D13 (hollow or boxes); build shelves and drawers as boxes in the theme colours; hinge the two doors and test their swing
- [x] Re-apply the theme on `data-theme` and token changes; resize with the stage; render only when something changed (D19)

Note on group 2 (built 2026-10-22): the kit fridge is hollow (D13), so its cavity is used and only shelves and drawers are boxes. The persona stands beside it in `Idle_A` with the recipe from `UZBankPersona`; the theme (the kit's four materials mapped to the theme neutrals, the boxes, the figure) re-applies on theme changes; `?open=1` shows both doors open, for inspection. The camera backs away on a narrow stage so the fridge and the figure fit inside the 640px sheet (D16). Group 2 does not animate the doors yet (group 3). The sound feature merged earlier is unaffected.

## 3. Intro and the tour

What you see: screens 1 to 4: the intro, then the camera glides to the main compartment, the reserve drawers and the freezer, each door opening with a short explanation card; Back and Next move through them.

- [x] `js/fridge-advisor.js`: the step list and state (screens 1 to 8, D4), the panel, Next, Back, progress, the live region (D18), focus to the heading on each step
- [x] `js/fridge-advisor-scene.js`: `goTo(stage)` with the eased glide and the door swing (D7); the accent outline on the active compartment (D5)
- [x] Copy for screens 1 to 4 in the config (English, no em dashes)
- [x] Reduced motion: stage poses applied at once, doors snap (D15)

## 4. Sliders and food (stop here for review of the food amounts)

What you see: screens 5 and 6: moving a slider updates its CHF value and fills shelves and drawers; the 3 times salary marker shows on the unplanned reserve; Next stays off until a salary is set.

- [ ] `js/fridge-advisor.js`: the five sliders on `.cc-color-slider` with a typable number field each, `aria-valuetext`, the non-linear assets track and the keyboard steps, the marker and its line, the clamps (D10, D10b), the Next rule on screen 5 (D4), a first-visit state of all zeros (D8)
- [ ] `js/fridge-advisor-scene.js`: slots and the food models fitted to them, `round(share x capacity)` items, fixed order, the 0.16 s scale-in (D11, D12)
- [ ] Check a very small and a very large salary, left at month end equal to the salary, and lowering the salary after setting the other values

## 5. The result and the closing screen

What you see: screen 7: the door closes, a short cooling moment, the freezer opens, a ring with the investable amount, the yearly amount, the note and "Show suitable products"; screen 8 follows and Done closes the flow.

- [ ] `js/fridge-advisor.js`: the formula as one function (D9), the result panel (ring, amount, yearly amount, note, button), the announcement of the result, the closing screen and Done (D6, D17)
- [ ] `js/fridge-advisor-scene.js`: close both doors, the cooling moment (a short frost tint and a pause, in the config), open the freezer, fill it by the investable share of total assets (D11)
- [ ] Reduced motion: no cooling, the freezer simply shows open (D15)
- [ ] Check an amount that would be negative (shows CHF 0), exactly 0 assets, and a large amount

## 6. Phone layout, keyboard and polish

What you see: the flow at 390px and by keyboard only, in Light and Dark.

- [ ] Phone layout (D16): the scene on top, the panel below, Next full width; landscape phone scrolls the panel if needed
- [ ] Keyboard through every step and every slider; focus rings; Escape and the exit dialog (D3); screen reader wording (D18)
- [ ] Contrast of text on the panel and of the value labels in Light, Dark and a Multi-color theme

## 7. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] Run `validation.md`, including the baseline smoke test copied there; fill in the "Checked on" line
- [ ] Docs: `specs/roadmap.md` (8a done, the spec link); `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the Pages table row for `fridge-advisor.html`, a Decisions row for the formula and the sheet, the assets); `apps/web/README.md` (the new files and assets, no new key); `AGENTS.md` only if a convention changed

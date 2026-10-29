# The fridge as a film (8d): plan

Branch: `feature/fridge-film`. Decisions are cited as D1 to D15 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The floating panel component (D5 to D7, D13)

What you see: a "Floating panel" section on the Components page, with the panel floating and docked over a striped background, frosted in Light and Dark.

- [ ] `css/styles.css`: the `.float-panel` section (the `::before` glass layer, the rim, the Light shadow, the custom properties, `.float-panel--docked`), the reduced-transparency and high-contrast fallback, the `@supports not (backdrop-filter)` fallback; colours only from the tokens (D6)
- [ ] `components.html`: the "Floating panel" section with the live example and the caption (D13)
- [ ] Check: Light and Dark, a Multi-color theme, the striped background visibly blurred, the rim and shadow, the docked form, the fallback with `prefers-reduced-transparency` emulated in DevTools

## 2. The sheet and the layout (D1 to D4, D10)

What you see: the fridge in a 960 x 640 sheet, the scene filling the body, the steps in a frosted panel on the right; on a phone the panel docked at the bottom over the scene; the hand-over to the opening only narrowing the sheet.

- [ ] `js/fridge-advisor-sheet.js`: `setWide` keeps the fixed height for the fridge (D1)
- [ ] `css/styles.css`: the stage covers the body; the panel floats on the right, bottom-anchored, about 20rem (D3), or docked below 1024px (D4); the two-column grid and the stacked layout removed; `.fridge__actions` without its own background (D10)
- [ ] `js/fridge-advisor.js` (or `fridge-advisor.html`): the panel gets `.float-panel` and, below 1024px, `.float-panel--docked`
- [ ] Measure every step at a 640 sheet and at 390 x 844: no scrolling inside the panel; settle open questions 1 and 2 (the panel width, the docked fallback)
- [ ] Check: each step on desktop and phone, the hand-over to the opening and "Start over", the tablet range by eye (open question 3)

## 3. The camera and the free area (D8, D9)

What you see: on every step the subject sits in the middle of the space the panel leaves free, on desktop and on a phone, with the glide as before.

- [ ] `js/fridge-advisor-scene.js`: the free area (a setter for the panel's rectangle), `setViewOffset` to its centre, the fit measured in it; a reframe rides on the step's glide, a resize snaps, reduced motion snaps (D8)
- [ ] `js/fridge-advisor.js`: a `ResizeObserver` on the panel tells the scene its size and side
- [ ] `js/fridge-advisor-config.js`: the poses retuned for desktop and phone; the intro shows the fridge and the persona (D9)
- [ ] Check: every step at 960 x 640 and at 390 x 844, the doors and food in view, nothing hidden under the panel; a window resize; `?reduced`

## 4. Themes, keyboard and fallbacks (D7, D11, D12)

- [ ] Light, Dark, a Monochrome and a Multi-color theme: the panel's text readable over the scene on every step
- [ ] Keyboard through all seven steps: the order, the focus ring on the panel, the heading focused on each step
- [ ] Reduced motion (`?reduced`); reduced transparency emulated
- [ ] Check: the steps above in each theme, at 960 and at 390

## 5. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` item 8d marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the floating panel component, the fridge's sheet in the "Wide flow sheets" and "Fixed-height flow sheets" rows and in Other systems); the fridge spec's D16 and D21 marked as replaced by this spec's D2 and D3

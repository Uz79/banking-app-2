# Opening review after the phone test (78): plan

Branch: `feature/opening-mobile-review`. Decisions are cited as D1 to D10 from `requirements.md`. Each group ends with something visible in the browser (`npm run dev`, 390px and desktop).

## 1. Purpose and amount (D1, D2)

- [ ] `js/investment-opening.js`: `BUILD.purpose` drops the `opening-options--grid` class from both groups
- [ ] `js/investment-opening-config.js`: `AMOUNT.hint` ("Minimum {min}."); `js/investment-opening.js`: `BUILD.amount` adds the note under the field and puts it in `aria-describedby`
- [ ] Check: both lists are one column at 390 and on desktop; the minimum shows under the amount before anything is typed, and with the fridge's suggestion and the "more than the fridge suggests" note present

## 2. Risk (D3, D4)

- [ ] `js/investment-opening.js`: `BUILD.risk` builds the three questions only, all open; remove `open`, `firstOpen` state handling, the Change buttons, the chart and its look-up listener; keep the focus move after a click
- [ ] `css/styles.css`: remove `.opening-question__done`, `__answer`, `__change` and the `data-state` rules; leave `.opening-chart*` (for 79)
- [ ] `js/opening-assistant-config.js` (about 324): the risk step's hesitation signals become `['switch']`
- [ ] Check: all three questions are visible with the chosen answers marked; arrow keys move within a question; a click moves focus to the next unanswered question; Next with one unanswered shows "Answer all three questions." under it

## 3. Strategy (D6, D7, D8)

- [ ] `js/investment-opening.js`: `strategyCarousel` makes every card choosable (no `above()` branch for the action, no dimming), keeps the tag; remove `reconcile()` and its callers and the fell-back note; the step has no `missing` or `need`, and `render()` shows only Help? while no strategy is chosen, at its own width and left-aligned (D10; the `.opening__action-row > .uz-btn` rule makes buttons `flex: 1`, so Help? needs `flex: none` there)
- [ ] `css/styles.css`: remove the dimmed `[data-above]` card state and `.opening-carousel__reason`; keep the tag style and the markers' recommended state
- [ ] `js/investment-opening-config.js`: remove `STRATEGY.reason`, `STRATEGY.missing`, `STRATEGY.fellBack`; update the `STRATEGY.unavailable` comment (it is now only a tag)
- [ ] `js/opening-assistant-config.js`: reword the "cannot be chosen online" answers (about 163 to 164) and any risk-step line that points at the chart (D8)
- [ ] Check: five cards, all with Choose this strategy; no primary button on arrival; choosing one shows "Continue with {name}"; choosing Growth or Dynamic for the Balanced profile works and reaches the summary; going back and changing risk answers keeps the chosen strategy

## 4. Summary (D5)

- [ ] `js/investment-opening.js`: `BUILD.summary` builds the Edit buttons as glyph-only pencil buttons with `aria-label` "Edit {section}"; confirm the `#i-edit-2` symbol is in `investment-opening.html`'s sprite, add it if not (by the sprite script, not by hand)
- [ ] Check: the three sections show a pencil button, each opens its section's screens, the focus ring is visible, a screen reader says "Edit Strategy"

## 5. Roadmap and wrap-up

- [ ] `specs/roadmap.md`: 78 under Next (done) and 79 under Later (already added with this spec)
- [ ] `npm run build` in `apps/web`
- [ ] `validation.md`, then the baseline smoke test
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy); `specs/tech-spec.md` Decisions table if it cites 9a D27, 9e D10 or D16; `apps/web/README.md` only if a storage key changes (none expected)

# Investment opening (9a): plan

Branch: `feature/investment-opening`. Decisions are cited as D1 to D25 from `requirements.md`.

Review stops (interview): after group 1 (the shell) and after group 3 (risk and strategy, the scoring). Otherwise the groups run through to validation. Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. The page, the hand-over and the sheet (D1 to D4, D18, D19; stop here for review)

What you see: on the fridge's step 7, "Show suitable products" loads the opening in the same sheet, the sheet narrows to 640 and its title changes; placeholder screens 1 to 10 with the step indicator, Back, Next and close; closing asks "Leave the opening?"; reopening Investment resumes at the same screen.

- [x] `investment-opening.html` (from the fridge page's skeleton: boot script, header for the unframed case, the panel, the live region) and the five registrations (D4)
- [x] `js/investment-opening-config.js`: the screen list with titles (D5, D23)
- [x] `js/investment-opening.js`: screens, Back and Next, the step indicator, the state messages, the draft read and write (D18), the heading focus and the live region
- [x] `js/fridge-advisor-config.js` and `js/fridge-advisor.js`: step 7's button writes the fridge amount to the draft and loads the opening; screen 8 removed, `TOTAL` 7 (D1)
- [x] `js/fridge-advisor-sheet.js`: the `uzbank:sheet-layout` and `uzbank:sheet-title` messages, the width transition (instant with reduced motion), the exit prompt text per page, resume from a draft (D2, D3, D19)
- [x] `css/styles.css`: the page's layout rules, `.opening*` base styles, the sheet width transition
- [x] `apps/web/README.md`: `uzBankWebOpeningDraft` (sessionStorage)
- [x] Check: the hand-over (the amount in the draft), the narrowing on desktop and nothing on a phone, Back on every screen, close and the prompt, resume, "Start over", the page opened on its own

## 2. Intro, knowledge, purpose and horizon, amount (D5 to D9)

What you see: the intro with the four topics; knowledge preselected from the profile; the purpose limiting the horizon for a home; the amount prefilled from the fridge with the suggestion and the check.

- [x] Option groups (D6) as a small builder in `js/investment-opening.js`, styled in `.opening-option*`
- [x] Screens 1 to 4 with their copy and rules in the config
- [x] Check: each option group by mouse and keyboard, the knowledge preselect for the three User Types, "Buy a home" with each horizon, amounts under 5'000, at, above the suggestion, and with no fridge amount

## 3. Risk and strategy (D10 to D12; stop here for review of the scoring)

What you see: the three risk questions on one screen; the strategy cards with the recommended one tagged and preselected, riskier ones unavailable; changing an earlier answer moves the recommendation.

- [x] Screen 5 (three option groups) and the scoring in the config (D12)
- [x] Screen 6: the five cards (risk bar, return marks, tag), the unavailable state with its line, one column on a phone (D11)
- [x] The recompute when knowledge, horizon or risk change, with the fall-back note (D12)
- [x] Check: the lowest and highest answers, each band, both horizon caps and the knowledge cap, a change after choosing a strategy

## 3b. Review change after group 3: one sheet height (D26)

- [x] `css/styles.css`: `.modal-shell--fixed-height` (desktop only), the height easing with the width, instant with reduced motion and on a resumed open
- [x] `js/fridge-advisor-sheet.js`: the modifier on with the narrow width, off for the fridge
- [x] Check: the steps of groups 2 and 3 at the new height (short ones with Next at the bottom, the risk and strategy screens scrolling inside), the fridge unchanged, a resumed open, 390px full screen

## 3c. Review change: no scrolling inside the sheet (D27)

- [x] Compact option rows; purpose and horizon in two columns
- [x] Risk: one question open at a time, answered ones folded with "Change"
- [x] Strategy: one row per card, the line on the chosen card, "Above your risk profile" once; a stored draft is reconciled on load
- [x] Check: every built step and state measured at 640 (no overflow), and at 390px

## 4. Sustainability, tax, the exit, documents (D13 to D16)

What you see: the ESG choice; the tax screen leading to the exit for "No" or "US person"; the exit's two buttons; the documents in two groups with the required checkbox.

- [ ] Screens 7 to 9 and the Ineligible exit (D15), with "Book an appointment" simulated; US criteria behind "What counts?", the eleven information sheets as one row that opens their list (D27); each screen measured at 640
- [ ] Check: each tax combination, "Change my answers" back, the checkbox gating Next

## 5. Summary, completion and the new product (D17, D20 to D22)

What you see: the summary with edit buttons that jump and come back; "Open asset management" leads to completion; Overview shows the new row; demo data reset removes it.

- [ ] Screen 10 as grouped sections with one Edit each, "Back to summary" on edited screens, the recommendation-changed note (D17, D27); measured at 640
- [ ] Completion (D20); the draft cleared; no exit prompt
- [ ] `js/payment-state.js`: `mandates` in load and save, `commitMandate`, `getState()` returns them (D21)
- [ ] Overview: the row after Retirement savings 3a, not counted in the total; rendered from the state (D21)
- [ ] `specs/roadmap.md`: a new item for funding the mandate (D22), as its own commit, with a pointer in this spec's out-of-scope list
- [ ] Check: edit each line, a recommendation change via edit, completion, the Overview row in Light and Dark, a reload, demo data reset

## 6. Phone, keyboard, motion and polish (D24)

- [ ] 390px: full screen sheet, the cards in one column, nothing overflows
- [ ] Keyboard through every screen; focus ring; arrow keys in the option groups
- [ ] Reduced motion: the step change and the width change are instant
- [ ] Light, Dark, a Monochrome and a Multi-color theme

## 7. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` item 9a marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the page in the pages table, the draft key, a Decisions row for the scoring and the mandate in the payment state); the fridge spec's D6 marked as replaced by this spec's D1

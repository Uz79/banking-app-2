# Personalise your strategy (9g): plan

Branch: `feature/personalise-strategy`. Decisions are cited as D1 to D14 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`), through Overview > Offers > Investment into the opening, or on the user's server on 5175 when asked.

## 1. The screen and its answers (D1, D3, D5, D6, D8)

What you see: the personalise screen, reached by setting the step in the console or from group 2's button; choices kept after a reload.

- [ ] `js/investment-opening-config.js`: `PERSONALISE` (labels, theme, alternatives and region options, the risk line, intro, "Clear my choices"), the `personalise` entry in `SCREENS` (uncounted, after `summary`)
- [ ] `js/investment-opening.js`: the `personalise()` screen builder (checkbox group, two radio groups), `answers.personalise` with the lenient read from the draft, "Clear my choices"
- [ ] Check: ticking, picking and clearing; reload keeps them; unknown ids in a hand-edited draft are dropped

## 2. The summary and the way back (D2, D3, D4, D7, D9)

What you see: the "Personalise your strategy (optional)" section on the summary, the screen opening from it, and the summary showing the choices.

- [ ] `js/investment-opening-config.js`: the section in `SUMMARY`, its empty line and rows
- [ ] `js/investment-opening.js`: render the section (text button when empty, pencil and rows when filled), `startEdit` for it, Back and the primary button return to the summary, the step indicator on the uncounted screen
- [ ] Check: skipping it changes nothing (Open product works, the flow has no extra step); opening, choosing and returning shows the values; "Not included" alone reads "Not personalised"; the recommendation and the vehicle do not change

## 3. The assistant (D10, D11)

What you see: the chips on the personalise screen, desktop column and the phone's Help?.

- [ ] `js/opening-assistant-config.js`: `CHIPS.personalise` (four chips with `short` and `more`), no entry in `NUDGES.screens`
- [ ] `js/opening-assistant.js`, `js/opening-hesitation.js`: only if a screen missing from `NUDGES.screens` needs handling
- [ ] Check: each User Type sees the same wording at its length; no nudge on the screen; every answer explains and does not advise

## 4. Look and fit (D12, D13)

What you see: the screen in Light, Dark and a Multi-color theme, desktop and 390px.

- [ ] `css/styles.css`: only what the screen needs beyond the existing option and checkbox styles (tokens only); the compact layout on the fixed-height sheet, content opening in place if it does not fit
- [ ] Check: contrast of every new text and selected state, measured, Light, Dark and a Multi-color theme; 390px; keyboard; reduced motion

## 5. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] `validation.md`: the feature's checks, then the baseline smoke test; fill the "Checked on" line
- [ ] Docs: roadmap 9g to Done, `CHANGELOG.md` under Unreleased, `specs/tech-spec.md` (a Decisions row; the opening's description if it lists the screens)

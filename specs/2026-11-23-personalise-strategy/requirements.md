# Personalise your strategy (9g): requirements

Branch: `feature/personalise-strategy`

## Scope

In: an optional "Personalise your strategy (optional)" on the opening's summary (`js/investment-opening.js`, `js/investment-opening-config.js`). It opens one screen with three groups: thematic focus, alternative investments, regional focus. The choices are stored in the session draft and shown on the summary. The assistant gets scripted answers for the screen (`js/opening-assistant-config.js`). Roadmap item 9g (Later), `designs/conversation/investment-opening/intervention-map.md` row 9g.

Out:
- Any effect on the recommendation, the chosen strategy, the vehicle or the scoring. The choices are preferences, like the sustainability answer in 9a (D13 there).
- A new step in the main flow. People found the flow too long, so a customer who skips this sees nothing extra.
- Carrying the choices into the stored mandate, the completion screen or Overview (nothing in the app consumes them).
- Nudges for the screen (D11).
- The German translation (a note only, see Context).
- 8b, the avatar acting in the fridge.

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | The choices are preferences only. The recommended strategy, the chosen strategy, the vehicle and `recommendation()` never read them. | Settled in the interview. Same as ESG in 9a; the app has no allocation model, and a tilt would read as advice. |
| D2 | The summary gets a fourth section, "Personalise your strategy (optional)", below "Your answers". Empty, it shows a quiet text button "Personalise". Filled, it lists the chosen values and has the pencil Edit like the other sections. | The roadmap says an opt-in from the summary. Same pattern as the other sections (`SUMMARY.sections`, `startEdit`), so no new navigation. |
| D3 | One screen, id `personalise`, `counted: false`, placed last in `SCREENS` (so the step numbers of a saved draft do not shift; a draft saved on it resumes on the summary). It is reached only from the summary; its primary button and Back return to the summary (`backToSummary`), never on to completion. | Settled in the interview (one screen). Not counted, so the step indicator still reads as the flow the customer knows. |
| D4 | Nothing on the screen is required. The primary button always works, and "Open product" on the summary is unaffected whether or not the screen was opened. A quiet "Clear my choices" resets the three groups. | The feature is optional; no gate, no error state. Radios cannot be unselected, so a customer needs a way back to "no preference". |
| D5 | Three groups, nothing preselected except alternatives. **Thematic focus**: checkboxes, any number, none ticked: Climate and energy, Health care, Technology, Water, Education. **Alternative investments**: two options, "Not included" (the default) and "Included". **Regional focus**: one choice, none selected: Global, Switzerland, Europe, North America, Emerging markets. | Interview answers. The theme and region lists are authored placeholders in `investment-opening-config.js`, like the strategy numbers (9a D12). |
| D6 | Copy is neutral: no recommendation, no promise of return. The alternatives group states the extra risk plainly under its label: "Alternative investments, such as gold or real estate funds, can swing more in price and can be harder to sell quickly than shares and bonds." The screen's intro says the choices do not change the strategy. No em dashes. | Interview answers; AGENTS.md copy rule; the intervention map's rules (explain, never advise). |
| D7 | The default "Not included" is not a choice. The summary section reads "Not personalised" until a theme is ticked, a region is picked or "Included" is chosen. | The summary should show what the customer did, not the defaults. |
| D8 | The answers live in the session draft as `answers.personalise = { themes: [], alternatives: 'no', region: '' }`, read leniently (unknown ids dropped, a missing key means the defaults). No new storage key; cleared with the draft on completion and by the demo reset. They are not written into the mandate. | `tech-spec.md`: nothing new. The draft is the opening's one store (9a D18). |
| D9 | Done as built: the summary shows the chosen values in one line ("Water · Alternatives included · Europe", "3 themes" from the third theme), only for what was chosen, not as rows. Completion is unchanged. | Three rows pushed the desktop sheet's summary 29px past its fixed height (it fits exactly without them); one line keeps the empty and the filled summary the same height. |
| D10 | The assistant gets a `personalise` entry in `CHIPS`: what thematic focus means, what alternative investments are and their risk, whether the choices change the strategy or the return, whether it is required. Same wording for every User Type; only the length differs through the existing `short` and `more` fields. They explain and never say what to pick. Each answer passes the map's rules 1 to 3. | Interview answers. |
| D11 | The screen is not in `NUDGES.screens`, so it never nudges. | It is optional and the customer chose to open it; a hesitation nudge on an opt-in would push. |
| D12 | The selected states and text use the existing option and checkbox styles and `--color-*` tokens only (`--color-fg-interactive` for selection). Contrast of every new text and selected state is 4.5:1 or more in Light, Dark and a Multi-color theme, measured, not assumed. Done as built: the intro, the risk line and the summary line use `--color-fg`, not the secondary colour, which measured 3.89:1 in Light on the default theme (existing notes and screen texts do the same; see roadmap 85). | Interview answer; AGENTS.md colour rule. |
| D13 | No new animation. The screen change uses the opening's existing transition and its reduced-motion path. | AGENTS.md: every animation has a reduced-motion path; adding none avoids a new one. |
| D14 | No new page, dependency or storage key. A `tech-spec.md` Decisions row is added at wrap-up. | `tech-spec.md` "Not using" list: no conflict. |

## Context

- `SCREENS` in `js/investment-opening-config.js` is an ordered list; `go(index + 1)` and Back walk it, so the new screen is positioned after `summary` and must only be entered through `startEdit`. `forward()` already returns an edit to the summary when the screen is in `edit.screens`.
- `SUMMARY.sections` holds `screens` per section; the Edit button calls `startEdit(section)`. The "Personalise" text button reuses `startEdit` with `screens: ['personalise']`.
- The sustainability screen (`esg()` and `optionGroup`) is the model for the radio groups. `opening-options--grid` is the compact layout the tax screen uses.
- The draft key is `uzBankWebOpeningDraft` (sessionStorage), written by `changed()`.
- Assistant copy sits in `CHIPS` by screen id; `NUDGES.screens` lists the screens that can nudge.
- German terms for the later translation pass (the intervention map only has "Personalisierung"; the others are proposals to confirm): Personalisierung (optional); Thematische Schwerpunkte; Alternative Anlagen; Regionaler Fokus.
- The sheet is fixed-height from 1024px (9d D14, up to 800px): the screen holds 5 + 2 + 5 options, so it must be compact there.

## Open questions (settled in the build)

- The step indicator hides on the uncounted screen (as on completion) and comes back on the summary.
- The hesitation module copes with a screen missing from `NUDGES.screens` (`screen` is null, so it never fires).
- The three groups fit the sheet's height without scrolling (themes in two columns); the summary needed the one-line values (D9).
- The primary button reads "Back to summary", as in the other edits; Back returns the same way.

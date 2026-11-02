# Strategy choice with the vehicles (9d): requirements

Branch: `feature/strategy-vehicles`

Roadmap item 9d (`specs/roadmap.md`). The opening's strategy screen (9a) gets the vehicles shown in the Character kit (9c): the customer's own persona travels with the chosen strategy's vehicle on a small 3D stage above the five strategy cards, so risk reads as clearly as return (tent, tricycle, Vespa, parachute, jetpack: faster and riskier as it goes up). The cards, the recommendation, the scoring and what is stored stay exactly as in 9a. Since customers now see the CC BY models, the step gets a "Model credits" link (9c D12).

## Scope

**In:**

1. A 3D stage above the strategy cards on the opening's strategy screen, desktop (in the 960 sheet next to the assistant's column) and phone (full screen), showing the persona with the chosen strategy's vehicle; a pick swaps it (D1, D2, D5)
2. The two strategies above the risk profile: their vehicle previewed on hover or focus, dimmed, without becoming choosable (D6, D7)
3. A short caption under the stage naming the vehicle, which is also what a screen reader gets (D8)
4. "Model credits": a text link on the step that shows the credits in place of the stage (D9)
5. The vehicles loaded ahead of the step so the stage is ready on arrival, and a plain fallback when 3D is not available (D3, D4)
6. One new assistant question on the strategy step about what the vehicles mean (D10)

**Out (not in this branch):**

- Any change to the scoring, the recommendation, the caps, the fall-back note, the cards' copy and meters, or the stored answers (9a D11, D12)
- The vehicles on the summary or the completion screen
- Travel motion beyond 9c's idles (turning wheels, a moving ground, flames)
- A public credits page (the link on the step is where the work is used, D9)
- Changes to `character-kit.html` other than what the shared module needs (the Character kit keeps its own picker and stage)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **One stage above the cards** (interview): the strategy screen keeps 9a's five compact cards as the control, unchanged, and gains one 3D stage card between the intro text and the cards, full width of the step. It shows the persona with the chosen strategy's vehicle (on arrival: the chosen one, which defaults to the recommendation). Picking a card plays 9c's swap (D9 there). Stage height: about 200px on desktop, about 150px on a phone, tuned in the build so the whole step still fits the fixed-height sheet (9a D26) and a 390×844 screen without scrolling | Interview. Least change to a form that already works; the cards stay comparable at a glance |
| D2 | **Reuse 9c's module and config** (`js/character-vehicles.js`, `js/character-vehicles-config.js`), as 9c D4 planned. Additions only where the opening needs them: a way to set the recipe from outside (the opening has no live specimen), a `preview(strategy)` / `unpreview()` pair (D6), and a `dim` state. The Character kit keeps working as before. If a strategy's `view` frames badly in the wide, short stage, the config gains a per-strategy override for this stage rather than changing the Character kit's framing | One module, one set of tuned numbers; the opening and the design system show the same thing |
| D3 | **Loading:** the opening loads the module and the five models when the risk screen shows (the step before), so the stage is usually ready on arrival; arriving earlier (a resumed draft, an edit from the summary) loads it then. Until it is ready the stage card shows its empty background at its final size, so nothing jumps; it fades in when ready (instant with reduced motion). The module is not loaded at all before the risk screen | About 2.8 MB of models: not worth paying on the intro, but the customer spends some time on the risk questions |
| D4 | **Fallback:** if WebGL, three.js or a model fails, the stage card is removed and the step is 9a's plain cards, with a console warning as the helper's (9b). The flow never depends on the stage | The form is the record (roadmap 9); a decorative module must not block an opening |
| D5 | **The persona is the customer's:** the recipe from the saved profile (`window.UZBankPersona.read().recipe`, without its loop: the pose decides the clip, 9c D4), Beat when nothing is stored. Read once when the stage mounts; the opening has no sliders to follow | The avatar stays the customer (roadmap 9, "Two characters"); it reacts, it does not advise |
| D6 | **Riskier strategies previewed, not chosen** (interview): hovering or focusing a card above the risk profile shows its vehicle on the stage, dimmed, with the caption "Above your risk profile"; leaving it (pointer out, focus moves on) returns to the chosen strategy. The same swap plays, and fast moves end on the last one (9c D9). Clicking it still does nothing, as in 9a | Shows that the jetpack is the fast and risky one without making it choosable. FinSA's balanced presentation is about showing risk, which this does |
| D7 | **Keyboard reach of the unavailable cards:** 9a's option group marks them `aria-disabled` and its arrow keys skip them. For D6 they become reachable by the arrow keys (still `aria-disabled`, still not selectable: Space and Enter on them do nothing), so a keyboard user can preview them too; Tab still enters the group on the chosen card. To check against the option group's other users (knowledge, purpose, horizon) during the build: the change applies to the strategy group only if the shared behaviour would change elsewhere | D6 must not be mouse-only (AGENTS.md: keyboard). Kept narrow (AGENTS.md: shared rules, narrow selectors) |
| D8 | **Caption:** one short line under the stage, in the step's small text style, naming the vehicle in words, e.g. "Balanced travels by Vespa: quicker, with some bumps." (one line per strategy, in `js/investment-opening-config.js` with the other strategy copy, final wording in the build); while previewing, "Above your risk profile" is added. The canvas is `aria-hidden`; the caption is the text alternative and is updated politely (`aria-live="polite"`) | A picture without words says nothing to a screen reader; the cards' meters stay the real information |
| D9 | **Model credits** (interview): a small text link "Model credits" under the caption. It shows the credits in place of the stage (same card, same height: Tricycle and Parachute by Poly by Google, Jetpack by Roman Miller, Vespa by Jasmine Roberts, each CC BY 3.0 with links to Poly Pizza and the licence; the tent by Quaternius, CC0) with a "Back to the vehicles" link; the link's name flips. Opening in place keeps the sheet's one height (9a D26). The links open in a new tab, take `--color-fg-interactive` and its focus ring, like 9c D14 | CC BY needs attribution where the work is used, now a customer-facing step (9c D12). No new page to register |
| D10 | **One assistant question** on the strategy step in `js/opening-assistant-config.js`: "What do the vehicles mean?", answered without advice (more risk travels faster, with bigger bumps; the vehicles do not change the recommendation). Written in the existing `short` and `more` form, so the User Type sets its length (9b) | The intervention map lists the strategy step as knowledge-heavy; a new picture brings a new question |
| D11 | **Drawing only when seen:** the stage draws only while the strategy screen is on show and the page is visible (`active()`), and stops on every other screen; it is mounted once and kept for the session, so going back to the step does not load again. With the assistant's helper that makes two WebGL contexts in the sheet at most | 9c D1 (drawn only while on screen); the sheet already runs the helper's stage |
| D12 | **Reduced motion:** the stage shows a still frame (the sit applied, 9c D7), switches and previews are instant, the fade-in is skipped, no hover or sway | AGENTS.md: every animation has a reduced-motion path |
| D13 | **Files:** `js/investment-opening.js` (the stage on the strategy screen, the preview wiring, loading on the risk screen), `js/investment-opening-config.js` (captions, the credits copy, the link names), `investment-opening.html` (the stage, caption and credits styles), `js/character-vehicles.js` and `js/character-vehicles-config.js` (D2 additions), `js/opening-assistant-config.js` (D10). No new page, storage key or runtime dependency | Small, contained diff |

## Context

- The strategy screen is `screens.strategy()` in `js/investment-opening.js` (about line 407): an `optionGroup` of `STRATEGIES` with `disabled: above`, cards from `strategyCard()` (about line 616), and the "Above your risk profile" line before the first unavailable card. `optionGroup` (about line 154) sets `aria-disabled` on unavailable options and its arrow-key handling uses `enabled()`, so they are skipped today (relevant to D7).
- In-place content elsewhere in the opening uses `<details class="opening-more">` (the tax screen's "What counts?"); D9 swaps the stage instead, because the credits are taller than one line and the sheet must not grow.
- `investment-opening.html` loads `js/profile-persona.js` (so `window.UZBankPersona` exists) and `js/investment-opening.js` as a module; the assistant's helper (`js/opening-assistant-helper.js`) already imports `profile-persona-character.js`, so three.js is shared.
- `mountVehicles(box, { reduced, active, strategy, recipe })` in `js/character-vehicles.js` loads all five models up front, returns `{ show, wake }`, and listens to `uzbank:persona-change` (harmless in the opening, where nothing sends it). Its `frameCamera()` fits each strategy's `view` by height or width, so a wide, short stage should mostly work by itself (D2).
- In the sheet on desktop the step column is about 600 wide and the sheet 640 high; the strategy screen today uses about 330px of it for the intro and cards, leaving roughly 220px for the stage, the caption and the link (measured on the standalone page, to confirm in the sheet).

## Open questions

1. The stage heights (D1): 200 and 150 are estimates; the step must fit the sheet and 390×844 without scrolling, with the "Above your risk profile" line and the fall-back note (the note adds a line when it shows).
2. Whether the parachute (the tallest view) reads in a 200px stage, or needs its own framing for this stage (D2).
3. D7's keyboard change: whether it is safe in the shared option group or has to be scoped to the strategy group.

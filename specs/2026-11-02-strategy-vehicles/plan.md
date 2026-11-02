# Strategy choice with the vehicles (9d): plan

Branch: `feature/strategy-vehicles`. Decisions are cited as D1 to D13 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`), in the opening (Overview > Offers > Investment > Show suitable products, or `investment-opening.html` with a draft at the strategy screen).

## 1. The stage on the strategy screen (D1, D2, D3, D4, D5, D11, D12)

What you see: the customer's persona with the chosen strategy's vehicle above the cards; picking a card swaps it.

- [ ] `js/character-vehicles.js`: set the recipe from outside (the saved profile), keep the Character kit's behaviour; per-stage framing overrides in `js/character-vehicles-config.js` only if needed (D2)
- [ ] `js/investment-opening.js`: load the module on the risk screen (or on arrival), mount the stage once, place it on the strategy screen, `show()` on a pick, draw only while the screen is on show; the fallback without 3D (D3, D4, D11)
- [ ] `investment-opening.html`: the stage card's styles (height on desktop and phone, the empty state, the fade-in with its reduced-motion path)
- [ ] Check: desktop sheet and 390 in Light; the step fits without scrolling; arriving from the risk screen, from a resumed draft and from a summary edit; no console errors

## 2. Preview, caption, credits (D6, D7, D8, D9)

What you see: hovering or arrowing to Growth or Dynamic previews them dimmed; a caption names the vehicle; "Model credits" swaps the stage for the credits.

- [ ] `js/character-vehicles.js`: `preview()` / `unpreview()` and the dimmed state (D6)
- [ ] `js/investment-opening.js`: hover and focus on the unavailable cards; the option group's arrow keys reach them on the strategy group without making them selectable (D7); the caption with `aria-live`; the credits swap and its link
- [ ] `js/investment-opening-config.js`: the five captions, "Above your risk profile" on the caption, the credits copy and the link names (no em dashes)
- [ ] `investment-opening.html`: caption, link and credits styles (`--color-fg-interactive`, focus ring)
- [ ] Check: mouse and keyboard previews return to the chosen strategy; Space or Enter on an unavailable card does nothing; the other option groups (knowledge, purpose, horizon) behave as before; the credits fit the stage's height

## 3. The assistant's question (D10)

What you see: "What do the vehicles mean?" among the strategy step's questions.

- [ ] `js/opening-assistant-config.js`: the question with `short` and `more`
- [ ] Check: as Newbie, All-rounder and Power user

## 4. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` item 9d marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the opening's strategy screen uses the vehicles; the credits now customer-facing); `apps/web/README.md` if files change

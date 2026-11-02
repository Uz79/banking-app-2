# Strategy choice with the vehicles (9d): plan

Branch: `feature/strategy-vehicles`. Decisions are cited as D1 to D15 from `requirements.md`. Groups 1 and 2 were built and committed together: the stage's place and size depended on the cards' layout (D14, D15).

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`), in the opening (Overview > Offers > Investment > Show suitable products, or `investment-opening.html` with a draft at the strategy screen).

## 1. The stage on the strategy screen (D1, D2, D3, D4, D5, D11, D12)

What you see: the customer's persona with the chosen strategy's vehicle above the cards; picking a card swaps it.

- [x] `js/character-vehicles.js`: set the recipe from outside (the saved profile), keep the Character kit's behaviour; per-stage framing overrides in `js/character-vehicles-config.js` only if needed (D2). Not needed: the module already takes the recipe, and every view frames in both stages
- [x] `js/investment-opening.js`: load the module on the risk screen (or on arrival), mount the stage once, place it on the strategy screen, `show()` on a pick, draw only while the screen is on show; the fallback without 3D (D3, D4, D11)
- [x] `css/styles.css`: the stage card's styles (the empty state, the fade-in with its reduced-motion path); the stage beside the cards on desktop and above them on a phone, filling the height the cards leave (D15); the taller sheet (D14)
- [x] Check: desktop sheet (677 and 800 high) and 390 in Light; the step fits without scrolling; arriving from the risk screen, from a resumed draft and from a summary edit; no console errors; every fridge and opening screen without scrolling in the taller sheet, the fridge's poses at 677 and 800

## 2. Preview, caption, credits (D6, D7, D8, D9)

What you see: hovering or arrowing to Growth or Dynamic previews them dimmed; a caption names the vehicle; "Model credits" swaps the stage for the credits.

- [x] The preview and the dimmed state (D6): in the opening (`show()` and the canvas's opacity), no module change
- [x] `js/investment-opening.js`: hover and focus on the unavailable cards; the option group's arrow keys reach them on the strategy group without making them selectable (D7); the caption with `aria-live`; the credits swap and its link
- [x] `js/investment-opening-config.js`: the five captions, "Above your risk profile" on the caption, the credits copy and the link names (no em dashes)
- [x] `css/styles.css`: caption, link and credits styles (`--color-fg-interactive`, focus ring); the column headings over the one-line cards (D15), only while the stage is there
- [x] Check: mouse and keyboard previews return to the chosen strategy; Space or Enter on an unavailable card does nothing; the other option groups (knowledge, purpose, horizon) behave as before; the credits fit the stage's height

## 3. The assistant's question (D10)

What you see: "What do the vehicles mean?" among the strategy step's questions.

- [x] `js/opening-assistant-config.js`: the question with `short` and `more`
- [x] Check: as Newbie, All-rounder and Power user

## 4. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line (VoiceOver, the system reduced-motion setting and the tab hidden left open, named there)
- [x] Docs: `specs/roadmap.md` item 9d marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the opening's strategy screen uses the vehicles; the credits now customer-facing; the sheet's new height); `apps/web/README.md` not needed (no new files or keys)

## 5. The strategy carousel (review, D16 to D19)

What you see: one strategy card at a time with the persona and its vehicle large, the neighbours peeking in, markers below; "Choose this strategy" makes Next read "Continue with <name>".

- [ ] `js/character-vehicles.js`: `attach(box, strategy)`, `snapshot(strategy)`, an `onTheme` callback (D19)
- [ ] `js/investment-opening-config.js`: the short lines, the carousel's copy (choose, chosen, the reason, Continue with, the arrows' names)
- [ ] `js/investment-opening.js`: the carousel replaces the stage card and the list (D16); the arrows, markers, keys and swipe, the names and announcements (D17); the explicit choice and Next's label (D18); the live stage moved between cards and the snapshots (D19); the list's code and `reach` removed
- [ ] `css/styles.css`: the carousel, the cards, the markers, the credits in the carousel's place; the stage and column-heading rules of D1 and D15 removed
- [ ] Check: desktop (677 and 800) and 390 without scrolling; Light, Dark, Custom 06; keyboard; the names and announcements; reduced motion (forced in the browser); without 3D; the summary edit and a resumed draft
- [ ] Docs: CHANGELOG, tech-spec, roadmap 9d's line

# Playground settings dialog: plan

Branch: `feature/playground-settings-dialog`. Decisions are cited as D1 to D12 from `requirements.md`. The groups run through to validation without stopping, unless a review stop is asked for.

## 1. The button and the dialog shell (D1 to D3, D10 to D12)

What you see: a settings button in the HUD where the sound button was; it pauses the run and opens an empty "Settings" dialog (title, three section headings, Resume), at the bottom on a phone and centred on desktop; Resume, Escape and the close return to the game.

- [ ] `playground.html`: the settings button (`i-settings`, `aria-haspopup="dialog"`) and the `dialog` markup with the three sections and the Resume button
- [ ] `css/styles.css`: `.playground__settings` button (the sound button's position), `.playground-settings*` dialog rules on the D25 card style, tokens only
- [ ] `js/playground.js`: open pauses a running run and resume restores it (D2); Escape means Resume; no quit dialog and settings dialog together; focus in and back to the button
- [ ] Check in the browser: start, running, paused, result and the still version; Light and Dark; desktop and 390px

## 2. Visual parameters (D4, D5, D8)

What you see: Quality, Camera distance, Effects and Fog change the paused scene at once, and are still set after a reload.

- [ ] `js/playground-config.js`: the `settings` block (caps and multipliers) with a comment like the other blocks
- [ ] `js/playground-settings.js` (new): read, validate and save `uzBankWebPlaygroundSettings`; defaults for anything missing or bad
- [ ] `js/playground.js` and the dialog: the four controls apply live (pixel ratio and resize, camera distance and height, effects off means no burst and full-size trees, fog); the still version applies them to the still frame and omits Effects
- [ ] `apps/web/README.md`: the new key
- [ ] Check: each control, reload, a bad value in storage, the defaults equal today's look

## 3. Sound and Theme (D6, D7, D9)

What you see: the HUD has only settings and close; Sound is a switch in the dialog; Light and Dark switch the world and the character behind the dialog and the Design system page behind the sheet follows.

- [ ] `playground.html`, `css/styles.css`, `js/playground.js`: remove the HUD sound button and its still-version rule; the Sound switch uses the same key and audio module
- [ ] `js/playground.js` (and a shared mode function, see the open question): the Theme control switches the mode like the sidebar toggle; the observer recolours behind the dialog
- [ ] `js/playground-sheet.js`: the parent page applies the mode the iframe reports (D9)
- [ ] Measure the recolour (`applyTheme`) with the CPU throttled and note the numbers in `validation.md` (D7)
- [ ] Check: mute and unmute, Light and Dark inside the sheet and opened directly, the hub page afterwards, a Multi-color theme stays in place

## 4. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`), including the baseline smoke test, with the dated "Checked on" line filled in
- [ ] Docs: `specs/roadmap.md` item 7 marked done with the spec link; `CHANGELOG.md` under Unreleased; `specs/tech-spec.md` Decisions row if the mode switch becomes shared

# Playground settings dialog: requirements

Branch: `feature/playground-settings-dialog`

Roadmap item 7. A settings button in the Payday run HUD pauses the run and opens a dialog with sections, so changes happen while nothing moves. It is the next roadmap item that can be specified now: items 3 and 8b are marked later and item 6 waits for a plot. It builds on `specs/2026-10-19-payday-run/` (the confirmation dialog D24, the card style D25, the theme-driven world D13) and `specs/2026-10-22-playground-sound/` (the HUD mute button and its key).

## Scope

**In:**

1. **A settings button and dialog** in the Playground HUD, with three sections: Visual parameters (render quality, camera distance, effects, fog distance), Sound, Theme (D1 to D4).
2. **The sound button moves into the dialog** (D6).
3. **Theme: Light and Dark** switched from the dialog, so the one-off recolour of the world and the character happens behind it (D7).
4. **The visual parameters are remembered** in one new storage key (D8).

**Out (not in this branch):**

- Multi-color themes in the dialog: they stay in Profile (interview)
- More parameters than the four in D4, a volume slider, per-profile settings, settings on other pages
- Gameplay changes (item 6), the easter egg (item 3)
- Any change to the confirmation dialog that quits a run (D24 of the Payday run spec), apart from the two dialogs never being open together

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **A settings button in the HUD**, a round icon button (`i-settings`) left of the close button, in the place the sound button has now. It is in every state of the page (start, running, paused, result, and the still version) and has `aria-haspopup="dialog"`. | Roadmap item 7. One predictable place; the sound button's slot is free once D6 moves it |
| D2 | **Opening it pauses the run.** From `running` the game goes to `paused` (audio suspended, as with the quit dialog), from the start and result screens nothing is running and nothing changes. Closing it returns to where it was: a paused run resumes at once, as "Keep playing" does. Escape inside the dialog means Resume. The tab-blur auto pause does nothing while it is open (the run is already paused), and the quit dialog and the settings dialog are never open together: Escape on the game opens the quit dialog as before, the settings button is the only way into settings. | Changes must happen while nothing moves; same pause rules as D24 of the Payday run spec |
| D3 | **The dialog:** a modal `dialog` that reuses the app's dialog surface, focus handling (`js/dialog-focus.js`) and the card style of D25: the same padding, border and title size but the width of the payment flow (640px, `--modal-payment-max-width`; changed from 22.5rem after review), at the bottom as a sheet under 1280px and centred at 1280px and up. Title "Settings"; three sections with a small heading each (Visual, Sound, Theme); one primary button "Resume" at the bottom (on the start and result screens it reads "Done"). Focus starts on the first control, its ring is visible (it is a form, not a prompt). Opening and closing use the existing slide, instant with reduced motion. | One dialog language. A form needs visible focus from the start; the quiet ring of D20 is for single-button prompts |
| D4 | **The four visual parameters**, each with the starting value equal to today's behaviour so nothing changes for anyone who never opens the dialog: **Quality** Low, Medium, High (High default): the render pixel ratio cap is 1, 1.5, 2 (today `maxPixelRatio` 2; the automatic lowering for slow frames still works down from the cap). **Camera distance** Close, Default, Far: the chase camera's `distance` and `height` times 0.8, 1, 1.25. **Effects** on or off: off means no coin burst and the trees stand full size instead of growing as the runner closes in. **Fog** Near, Default, Far: `fogNear` and `fogFar` times 0.7, 1, 1.4. The multipliers and caps live in `js/playground-config.js` in one `settings` block, with the other tuning numbers. | The parameters chosen in the interview. Defaults that equal today keep the tuned feel; one config block keeps tuning in one place |
| D5 | **Changes apply at once, behind the dialog.** The world is visible and paused, so the effect can be judged: quality resizes the renderer, camera distance and fog update and the next frame redraws (`dirty`), effects take effect from the next pickup or tree update. In the still (reduced motion) version the camera, quality and fog apply to the still frame; Effects and Sound are left out of the dialog there (no burst, no growth, no sound). | Roadmap item 7 wants changes to happen "while nothing moves" |
| D6 | **Sound moves into the dialog.** The round sound button leaves the HUD; the Sound section has one switch, "Sound" on or off, kept in the existing key `uzBankWebPlaygroundSound` and read the same way (missing means on). Its behaviour and the Web Audio module do not change. | Chosen in the interview: one place for every setting; the HUD keeps only settings and close. In the still version there is no Sound section, as there was no button |
| D7 | **Theme: Light and Dark.** A two-option segmented control (the app's `segmented--full`) in the Theme section, showing the active mode. Choosing one switches the app's mode the way the sidebar toggle does (saved in `uzBankWebTheme`, cached colour tokens for the active theme applied), and the existing `MutationObserver` in `js/playground.js` recolours the world and the character behind the dialog. Multi-color themes stay in Profile and are not listed. The page is full screen with no sidebar, so this is the only way to change the mode inside the Playground. The recolour is measured on a throttled CPU before it is called done (the Payday run spec measured about one extra frame on a desktop; a phone is untested). | Chosen in the interview. The paused run hides the one-off cost of the recolour |
| D8 | **Remembered:** the four visual parameters in one new key `uzBankWebPlaygroundSettings`, JSON `{ "quality": "high", "camera": "default", "effects": true, "fog": "default" }`. A missing key, bad JSON or an unknown value falls back to the default for that field. Listed in `apps/web/README.md`. Sound keeps its own key; Light and Dark is remembered by the app. | Chosen in the interview. A weak phone should not have to pick Low quality on every visit |
| D9 | **The Playground sheet and the parent page.** The hub opens `playground.html` in an iframe inside a full-screen sheet. A mode change in the iframe has to reach the Design system page behind the sheet, so that it is not in the wrong mode once the sheet closes: the page that opened the sheet applies the new mode when the iframe tells it (a `postMessage` of the chosen mode, like the existing close message, handled in `js/playground-sheet.js`). Opened directly, nothing extra is needed. | A mode change should not leave the page behind it out of step |
| D10 | **Copy:** English, short, no em dashes. Title "Settings"; headings "Visual", "Sound", "Theme"; labels "Quality" (Low, Medium, High), "Camera distance" (Close, Default, Far), "Effects" (switch), "Fog" (Near, Default, Far), "Sound" (switch), "Light" and "Dark"; buttons "Resume" and "Done". | AGENTS.md conventions |
| D11 | **Accessibility and motion:** the dialog is a native `dialog` opened with `showModal()`, labelled by its title; the controls are real buttons, switches (`role="switch"`, `aria-checked`) and a labelled `role="radiogroup"` for each segmented choice; every control has a visible focus ring in `--color-fg-interactive`; the opening animation has a `prefers-reduced-motion` path (none). Colours only through `--color-*` tokens; new rules use narrow `.playground-settings*` selectors. | AGENTS.md conventions |
| D12 | **No new page**, so nothing to register in the five places. `playground.html` gets the markup, `js/playground.js` the wiring (a small `js/playground-settings.js` module for the storage and the dialog if `playground.js` grows past a screen of additions), `css/styles.css` the rules. The Design system page does not document the dialog (it is a Playground control, not a component). | Smallest change that fits |

## Context

- `js/playground.js` (695 lines) owns the state machine (`ready`, `running`, `paused`, `stepping`, `finished`), the renderer (`setPixelRatio(min(devicePixelRatio, CONFIG.maxPixelRatio))`, the frame-time based lowering at the end of the file), the theme observer (`applyTheme`, a `MutationObserver` on `data-theme`, `style` and `class` of `<html>`), the sound button (`syncSoundButton`) and the quit dialog (`requestQuit`, built on `UZBankPaymentExitPrompt`).
- `js/playground-config.js` holds the tuning numbers: `camera` (`distance`, `height`, `fov`), `fogNear`, `fogFar`, `maxPixelRatio`, `forest.growFrom`, `growTo`, `seedling`, `burst`.
- `playground.html` does not load `js/app-mp.js`, whose `applyTheme` and `applyColorTokens` change the mode on the other pages; the Playground has no mode switch of its own today. The inline boot script only applies the saved mode and cached tokens at load. How D7 reaches the same function without loading all of `app-mp.js` is the open question below.
- The sound button has `data-playground-sound`, its CSS `.playground__sound` (and `.playground--stepped .playground__sound`, hidden in the still version), and `syncSoundButton`; D6 reuses the position and the audio module.
- The sheet: `js/playground-sheet.js` creates the iframe on open and removes it after the close; the page closes by `postMessage`.

## Open questions

- How the Playground switches Light and Dark: expose a small shared function, or load only the part of `app-mp.js` that applies the mode and the colour tokens. Decided while building; the rule is that it behaves exactly like the sidebar toggle.
- Whether the `MutationObserver` recolour is the right moment (it already runs on `data-theme` changes) or the dialog should call `applyTheme(true)` itself.
- The recolour cost on a throttled CPU and on a phone (D7): the roadmap asks for the measurement first.

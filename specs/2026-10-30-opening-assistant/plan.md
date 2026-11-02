# The assistant, first version (9b): plan

Branch: `feature/opening-assistant`. Decisions are cited as D1 to D19 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. Questions? and the panel (D1, D3 to D5, D13)

What you see: a "Questions?" button by every heading of the opening; on desktop it widens the sheet to 960 with an empty panel on the right, on a phone it opens an empty bottom sheet.

- [x] `js/opening-assistant.js`: the panel (`aside` on desktop, `dialog` below 900px), open and close, the layout switch through `uzbank:sheet-layout`, focus in and back, Escape, the scrim tap. The bottom sheet makes the rest of the page inert and keeps Tab inside it; a resize across the threshold reopens the panel in the other form
- [x] `js/investment-opening.js`: Questions? in `render()` with `aria-expanded` (and `.uz-btn--toggled` while open); the assistant told the current screen; the panel closed on completion's Done (`leave()`); an open panel takes the first Escape, so the sheet's Escape still comes second. Closing the sheet removes the page, so the panel goes with it
- [x] `investment-opening.html`: the panel's container (scrim, `aside` with title, close button and an empty body)
- [x] `css/styles.css`: an "Opening assistant" section: the heading row, the column, the bottom sheet, the motion and its reduced-motion path. The column and the page's right padding are `clamp(0px, 100% - 600px, 360px)`, so while the sheet widens the step keeps its 600 and the panel opens like a curtain; on closing it stays until the sheet has narrowed (0.3 s)
- [x] Check: desktop (960 x 640: step 600, panel 360, height unchanged open and closed; the narrowing sampled 702, 645, 640) and 390 x 844 (bottom sheet as a modal dialog, step inert, slides in and out, scrim tap and Escape close it); by mouse and keyboard (Tab from the heading to Questions?, Enter opens with focus on the title, Tab to the close button with a visible ring, focus back on Questions?); Next and Back keep it open and switch its screen; Escape closes only the panel; the sheet's X with the panel open asks first, Leave closes, and reopening starts closed at 640; the page on its own at 2391 wide (column 360, step centred) with `?reduced` (closes at once); the hand-over from the fridge (960 to 640, height 640, Questions? on the intro). No console errors; build passes. Not yet: Dark and the themes (the validation pass), completion and the exit screen by eye

## 2. Chips and answers (D6 to D10, D15)

What you see: each screen's chips; a tap adds the question and its answer, in the length the User Type sets; "Talk to an advisor" answers with the callback line.

- [x] `js/opening-assistant-config.js`: every screen's chips and answers (`short`, `more`, follow-ups), drafted from the intervention map and aligned with 9a (D7). Three or four chips per screen; follow-ups on strategy (bonds and shares) and tax (the substantial presence test); the risk answer uses the customer's amount (`setValues` from the page). The flagged items carry a comment in the file
- [x] `js/opening-assistant.js`: the conversation (`role="log"`, a new log per screen so a switch is not read out), chips removed once asked (focus stays on the chip in that place), follow-ups, More for All-rounder (focus moves to the added text), the conversation kept per screen in memory. No stored Profile counts as All-rounder: `UZBankPersona.read()` falls back to Newbie's values, so the key itself is checked
- [x] Copy review with Klaudiusz: every answer, the flagged items in D7 (open question 3). Approved as drafted on 2026-10-30, including the completion answer next to the completion screen's own line
- [x] Check: every screen's chips at 960 (set through the module) and the documents screen at 390 (the bottom sheet stops at 70% and scrolls inside, the step does not); the three User Types (Power user short only, All-rounder short and More, Newbie both; no stored Profile as All-rounder); Talk to an advisor answers with the callback line and disappears; coming back to a screen shows its lines; no em dashes or exclamation marks in the config; no console errors; build passes. Not yet: the line fade (group 4)

## 3. The helper (D11, D12)

What you see: the UZ Bank assistant as a small 3D figure at the top of the panel, in the theme's colours; a portrait in the phone's bottom sheet.

- [x] The parts were not in the repo (D18): `scripts/build_kaykit_helper.py` makes `assets/3d/kaykit/helper.glb` and `rig-medium-helper.glb` from the full pack
- [x] `js/profile-persona-character.js`: `SLOTS` gains `head: mage` and `outfit: mage` (from the `helper` source); `createFigure` takes `characters` and `clipFiles`, defaulting to what it loaded before; a part from a file not loaded is skipped
- [x] `js/opening-assistant.js`: the lazy import of the character module on the first open, the figure's stage (its own small renderer, the persona stage's lights and theme recolour, drawn only while the panel is open), the placeholder, the fallback when loading fails. `investment-opening.html`: the figure and the "UZ Bank assistant" label in the panel's head
- [x] Settle open question 1 (room for a long answer): no. Under the 120 figure a Newbie's first answer (tax, "Who counts as a US person?") scrolls by 48 px at a 640 sheet, so the figure drops to 64 (head and shoulders) once a question is asked and stays so until the sheet closes; that answer then fits exactly. More answers scroll inside the panel, as D3 allows
- [x] Check: Light, Dark and Custom 06 (Multi-color) at 960, the figure recoloured each time; the 390 portrait (56, round, head and shoulders); the placeholder before the first load and the figure at once on later opens; the fallback with `helper.glb` moved away (no figure, the panel works); the Character kit specimen still loads; no console errors; build passes and ships both files. Not run: the network throttled (no throttling in the agent's browser tools; the placeholder was seen during the normal load). `?reduced` covered by the code path only (`figure.update` skips the clip; the canvas cannot be compared frame to frame from the tools); seen by eye in group 4 with the wave

## 4. Motion and polish (D11, D14)

- [x] The line fade (0.2 s fade and rise, the answer 0.08 s after its question), the bottom sheet's slide (group 1), the helper's gesture (open question 2), each with its reduced-motion path. `createFigure` gains `playOnce(name)`: the clip once over the loop, then a cross-fade back, skipped with reduced motion
- [x] Open question 2: the free KayKit pack has no wave. `Interact` (1.3 s: a reach with the right arm, a head turn and a small lean) is the clip; in the shrunk column it reads as a short nod and lean toward the conversation, quiet but visible. To keep the arm in view the shrunk column figure is framed head to chest; the phone's round portrait stays head and shoulders, where only the head turn shows
- [x] Check: the fade's computed animation and delay on a new question and answer; the gesture sampled by eye four times over 1.5 s at 960; with `?reduced` the lines have no animation and the figure stays still when an answer arrives (three looks over a second). The slide and its `?reduced` path were checked in group 1. No console errors; build passes

## 5. Documentation (D16)

- [x] `components.html`: "Questions and answers" section (a static conversation: both line styles, an expanded answer, More, a chip and the advisor text button, in a 360 panel; the classes listed)
- [x] `character-kit.html`: "The helper" entry, after Profiles: the live figure next to its recipe, a "Play the answer gesture" button, and a note on its sizes, the gesture, reduced motion and its files. To show the same figure, the stage moved out of `js/opening-assistant.js` into `js/opening-assistant-helper.js` (`mountHelper(box, { reduced, active, frame })`), which the opening imports on the first open and the Character kit page as a module
- [x] Check: both pages in Light and Dark; the gesture on the Character kit; the persona specimen still loads; the opening's figure after the move (first open, close and reopen, the shrink on asking); no console errors; build passes

## 6. The Lorekeeper (D19)

Review change after group 5: the mage parts were too close to the persona's power-user wizard hat.

- [x] `assets/3d/kaykit-lorekeeper/lorekeeper.glb` and `LICENSE.txt`, copied from KayKit Mystery Monthly Series 6 (the texture is inside the file; tome and staff left out). `assets/3d/kaykit/helper.glb` removed; `scripts/build_kaykit_helper.py` builds only the clip
- [x] `js/opening-assistant-helper.js`: loads the model and the two clip files itself, recolours his one texture (monochrome, the robe cells (3, 2) and (3, 3) as the accent), plays `Idle_A` and `Interact` once on an answer. `js/profile-persona-character.js` back to main, plus the `oklchToRGB` export. Frames given room above his larger head (`js/opening-assistant.js`)
- [x] `character-kit.html`: "The helper" describes a model, not a recipe
- [x] Check: Character kit, the helper and the persona specimen in Light and Dark (clearly different figures, both recoloured); `Interact` plays on him (the reach and head turn); the opening at 960 in Dark (120 figure, then 64 after a question) and Light, the 390 portrait in Light; no console errors

## 7. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` item 9b marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the assistant in Other systems, the helper in the 3D character kit section, a Decisions row for the assistant's rules, the helper and his assets in the 3D character kit section); the intervention map's "Open" list updated (the helper's name, tone and look settled)

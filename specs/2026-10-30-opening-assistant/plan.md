# The assistant, first version (9b): plan

Branch: `feature/opening-assistant`. Decisions are cited as D1 to D17 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. Questions? and the panel (D1, D3 to D5, D13)

What you see: a "Questions?" button by every heading of the opening; on desktop it widens the sheet to 960 with an empty panel on the right, on a phone it opens an empty bottom sheet.

- [ ] `js/opening-assistant.js`: the panel (`aside` on desktop, `dialog` below 900px), open and close, the layout switch through `uzbank:sheet-layout`, focus in and back, Escape, the scrim tap
- [ ] `js/investment-opening.js`: Questions? in `render()` with `aria-expanded`; the assistant told the current screen; the panel closed on completion's Done and on close
- [ ] `investment-opening.html`: the panel's container
- [ ] `css/styles.css`: an "Opening assistant" section: the two-column page, the column, the bottom sheet, the motion and its reduced-motion path
- [ ] Check: desktop and 390px, open and close by mouse and keyboard, Next and Back with the panel open, the sheet's width, the hand-over from the fridge unchanged

## 2. Chips and answers (D6 to D10, D15)

What you see: each screen's chips; a tap adds the question and its answer, in the length the User Type sets; "Talk to an advisor" answers with the callback line.

- [ ] `js/opening-assistant-config.js`: every screen's chips and answers (`short`, `more`, follow-ups), drafted from the intervention map and aligned with 9a (D7)
- [ ] `js/opening-assistant.js`: the conversation (`role="log"`), chips removed once asked, follow-ups, More for All-rounder, the conversation kept per screen in memory
- [ ] Copy review with Klaudiusz: every answer, the flagged items in D7 (open question 3)
- [ ] Check: every screen's chips at 960 and 390, the three User Types, Talk to an advisor, a long answer in the panel

## 3. The helper (D11, D12)

What you see: the UZ Bank assistant as a small 3D figure at the top of the panel, in the theme's colours; a portrait in the phone's bottom sheet.

- [ ] `js/profile-persona-character.js`: `SLOTS` gains `head: mage` and `outfit: mage`
- [ ] `js/opening-assistant.js`: the lazy import of the character module, the figure's stage, the placeholder, the fallback when loading fails
- [ ] Settle open question 1 (room for a long answer)
- [ ] Check: Light, Dark, a Multi-color theme; the first open and later opens; the network throttled; `?reduced`

## 4. Motion and polish (D11, D14)

- [ ] The line fade, the bottom sheet's slide, the helper's wave (open question 2), each with its reduced-motion path
- [ ] Check: every motion with and without `?reduced`

## 5. Documentation (D16)

- [ ] `components.html`: "Questions and answers" section
- [ ] `character-kit.html`: "The helper" entry
- [ ] Check: both pages in Light and Dark

## 6. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` item 9b marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the assistant in Other systems, the helper in the 3D character kit section, a Decisions row for the assistant's rules); the intervention map's "Open" list updated (the helper's name, tone and look settled)

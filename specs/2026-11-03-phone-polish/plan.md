# Phone polish of the fridge and the opening: plan

Branch: `feature/phone-polish`. Decisions are cited as D1 to D15 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`), through Overview > Offers > Investment, at 390 unless a check says otherwise.

## 1. The fridge on a phone (D1, D7, D8)

What you see: regular sliders on a phone, a strong "Show suitable products", and the result's label above a ring that holds only the amount.

- [x] Find why "Show suitable products" looks pale and record the cause in D7 before fixing it
- [x] `js/fridge-advisor.js`: the compact class only in the floating panel's layout (D1); the result's label outside the ring in the docked layout (D8)
- [x] `css/styles.css`: the ring's phone rule (label above, the amount sized to fit CHF 999'999, stepping down for long amounts); the pale button's fix (D7)
- [x] Check: every fridge step at 390 without scrolling, Light and Dark; the ring with CHF 0, CHF 29'400 and CHF 999'999 at the default and the largest font size; 960 unchanged

## 2. Next is never disabled (D4, D5, D6)

What you see: Next always looks ready; tapping it with something missing puts a message under the field and the focus on it.

- [x] `js/fridge-advisor.js`: step 5's Next enabled; "Set your monthly salary to continue." under the salary, focus to its slider; the message goes once a salary is set
- [x] `js/investment-opening.js`: no `gated` disabling; the message under the first missing question and focus to its first control, on every screen; the strategy's case (D5: the current card's choose button, moving to the recommended card first when the current one is above the profile)
- [x] `js/investment-opening-config.js`: "Choose a strategy first."
- [x] `css/styles.css`: the field message's style (the step's small text, a clear but not alarming colour from the tokens)
- [x] List the other disabled call-to-actions in the app (D6) for `validation.md` and the roadmap
- [x] Check: each opening screen's Next with nothing answered, by tap and by keyboard; desktop and 390; summary edits ("Back to summary", "Next in this section")

## 3. The assistant's layer on a phone (D2, D3)

What you see: Help? opens a layer with "Questions about this step" and its own X over the whole flow; closing it returns to Help?.

- [x] `investment-opening.html`: the layer's header (title, X) in the assistant's markup
- [x] `js/opening-assistant.js`: open and close the layer, X and Escape close only it, focus back to Help?; `uzbank:sheet-chat` to the sheet
- [x] `js/fridge-advisor-sheet.js`: hide the header and make it inert while the chat is open
- [x] `css/styles.css`: the layer, its header like the sheet's, the slide-up with its reduced-motion path; desktop untouched
- [x] Check: 390 in Light and Dark; Tab stays in the layer; the sheet's X and Back unreachable while it is open; Escape closes the layer, then a second Escape asks to leave; desktop column unchanged

## 4. Closing asks, the progress is kept, reopening resumes (D9 to D13)

What you see: X asks "Leave for now?" on every step; Investment reopens on the same step with the same values; focus on Investment shows its ring only after a keyboard close.

- [x] `js/fridge-advisor.js`: write `page: 'fridge'`, its step and values into the draft on every change; read them on load (no prefill when kept; the scene straight to the step's pose); "Show suitable products" keeps them and sets `page: 'opening'`
- [x] `js/investment-opening.js`: keep `page` and `fridge` when writing the draft; `dirty` on every screen except completion and booked
- [x] `js/fridge-advisor-sheet.js`: one prompt text; reopen by `page` (and a draft without `page` as today); the quiet focus on Investment after a pointer close (D9)
- [x] `css/styles.css`: the quiet focus class, if the fallback is needed
- [x] Check: close and reopen on fridge steps 1, 4 and 7 and on opening intro, strategy and summary; completion then Investment starts fresh with the prefill; Start over; demo reset; an old-shape draft; keyboard and pointer closes for the focus ring; desktop and 390

## 5. Review: the assistant's container on desktop (D16, D17, D18)

What you see: no line beside the assistant or above "I can do it myself"; once opened, the conversation floats in a rounded, tinted container whose "I can do it myself" sits level with Next.

- [x] `css/styles.css`: the column's and the foot's lines removed; the container for the open conversation (inset, radius, padding, secondary background, stroke), the customer's lines and the foot button on the page background, the bottom aligned with Next
- [x] Check: desktop in Light and Dark, the invitation and the conversation; Next and "I can do it myself" measured level

## 6. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line; the VoiceOver items left for Klaudiusz (D14)
- [x] Docs: `specs/roadmap.md` item 21 (and 19) marked done, the follow-up for D6 added; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the no-disabled-buttons rule in Decisions, the fridge row's "Nothing is remembered", the draft's shape, the assistant's phone layer); `apps/web/README.md` (the draft's new shape)

The earlier specs (fridge D8, 9a D3 and D6, 9b D29, 9d D18) stay as they were; this spec's decisions say what they supersede.

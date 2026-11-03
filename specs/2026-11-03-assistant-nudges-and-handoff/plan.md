# The assistant, second version (9f): plan

Branch: `feature/assistant-nudges-and-handoff`. Decisions are cited as D1 to D20 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`), through Overview > Offers > Investment into the opening, on desktop (a 960 sheet) and at 390 unless a check says otherwise. `?nudge=fast` (D4) shortens the waits.

## 1. The signals and the thresholds (D1 to D5)

What you see: nothing yet on screen; in the console (a temporary debug line, removed in group 2), "nudge: knowledge" when a step would nudge.

- [x] `js/opening-assistant-config.js`: `NUDGES` (the reading time and the nudge question per screen, D3, D6; the thresholds per User Type, D5; the high steps)
- [x] `js/opening-hesitation.js` (new): the clock (visible tab, step on screen, assistant not open, D2), the counters for switching, going back, looking up and left empty (D1), the User Type rule (D5), `?nudge=fast` (D4); one callback per step at most
- [x] `js/investment-opening.js`: report the step, answer changes, Back and summary edits, the toggles and the amount field to the hesitation module
- [x] `js/opening-assistant.js`: tell the hesitation module when the conversation is open on a step
- [x] Check: each User Type with `?nudge=fast`: Newbie fires on every counted step by time, All-rounder only on the high steps, Power user never; switching an answer three times fires at once; the clock pauses in a hidden tab (and while help is open, checked in group 2)

## 2. The nudge (D6 to D11)

What you see: the desktop invitation turning into the step's question with "Show me" and "No, thanks"; the bubble above Help? on a phone.

- [x] `js/opening-assistant.js`: the invitation's nudge state, "Show me" asking the chip, "No, thanks"; the phone's bubble on Help?; the wave; the announcement through the opening's status region (D9); the advisor line on escalation (D10)
- [x] `js/opening-assistant-config.js`: the nudge copy (D17)
- [x] `js/investment-opening.js`: the draft's `nudged` (D11), read leniently
- [x] `css/styles.css`: the bubble (tokens only, the fade, its reduced-motion path), the invitation's quiet button
- [x] Check: desktop and 390, Light, Dark and a Multi-color theme; one nudge per step, never again after a dismissal, also after closing and resuming; a step whose question was asked never nudges; the bubble covers nothing needed (open question 1) and the risk step still fits; focus never moves by itself; keyboard on "Show me", "No, thanks" and the bubble

## 3. The handoff (D12 to D16)

What you see: "Talk to an advisor" offering a callback or a video meeting, three times, a confirmation that stays.

- [x] `js/opening-assistant-config.js`: `HANDOFF` (the lines and the choices, D12, D13, D17)
- [x] `js/opening-assistant.js`: the handoff in the conversation (the two choices, the three times from the clock, the confirmation, the booked state with "Choose another time" and "Cancel it")
- [x] `js/investment-opening.js`: the draft's `handoff` (D15, a past booking dropped); the exit screen's "Book an appointment" opening the handoff and showing the booking (D16)
- [x] `css/styles.css`: the time chips (none needed: they are the conversation's own chips)
- [x] Check: a callback and a meeting on a weekday morning, a weekday evening and a weekend (the clock faked in the console); the booking shown on another step and after a resume; Cancel; the exit screen; the escalation's advisor button opens it; nothing asks for personal data

## 4. Wrap-up

- [x] `components.html`: the nudge and the handoff in "Questions and answers" (D19)
- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line; VoiceOver and touch left for Klaudiusz on the preview
- [x] Docs: `specs/roadmap.md` 9f marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` (the opening's assistant: nudges and the handoff); `apps/web/README.md` (the draft's `nudged` and `handoff`); the intervention map (the signals and the help levels as built)

# The assistant, first version (9b): requirements

Branch: `feature/opening-assistant`

Roadmap item 9b (`specs/roadmap.md`). The investment opening (9a, `specs/2026-10-29-investment-opening/`) is a plain form of ten counted screens in the fridge's sheet. Here every screen gets a "Questions?" button that opens the UZ Bank assistant: a chat with three or four written questions (chips) for that screen, each with an authored answer, and a helper character in the KayKit style. On desktop the sheet widens to 960 and the chat is a column next to the step; on a phone it is a bottom sheet over the step. The assistant explains, it never picks an answer and never advises (the rules in `designs/conversation/investment-opening/intervention-map.md`). Hesitation nudges, the real advisor handoff and free text are 9f.

## Scope

**In:**

1. A "Questions?" button on every screen of the opening, next to the heading (D1, D2)
2. The assistant panel: a column in a 960 sheet on desktop, a bottom sheet on a phone (D3 to D5)
3. The chips and their written answers for every screen, in one config file, in three lengths by User Type (D6 to D9)
4. "Talk to an advisor": a simulated callback line in the chat (D10)
5. The helper: a small 3D KayKit figure with its own recipe at the top of the panel (D11, D12)
6. Documentation: the chip and answer pattern on the Components page, the helper on the Character kit page (D16)

**Out (not in this branch):**

- Hesitation triggers, proactive nudges, remembered dismissals and the real advisor handoff (9f)
- Free text or keyword matching (interview: chips only; 9f if tests ask for it)
- The persona avatar reacting in the opening (it stays the customer and is not in the opening yet)
- The assistant in the fridge (8a to 8d stay as they are)
- Any change to the opening's screens, answers, scoring, draft or completion (9a D1 to D27)
- The strategy vehicles (9c, 9d) and the risk experience (9e)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Where help starts** (interview): a small tonal button "Questions?" on the right of each screen's heading, inside the page (`investment-opening.js` `render()`), not in the sheet's header. Keyboard order: heading, Questions?, the screen's controls. When the panel is open the button shows its pressed state (`aria-expanded="true"`, the toggled button style) and closes the panel again | The shared sheet header serves the payment and trade flows too; a page-level button changes nothing outside the opening |
| D2 | **Every screen has help** (interview): the counted screens, completion and the exit screen (`ineligible`). Screens without chips in the intervention map (intro, purpose and horizon, the exit) get new chips written here (D7) | One rule: help is always one tap away (map rule 4) |
| D3 | **Desktop: the sheet widens** (interview): from a 900px page (the 960 sheet; the parent viewport from 1024px) opening the panel sends `uzbank:sheet-layout` `wide: true`, the sheet animates from 640 to 960 with the existing width transition (9a D2), and the page becomes two columns: the step on the left (as today, about 600 wide), the panel on the right (360 wide, full body height, a divider on its left). Closing it narrows the sheet back to 640. The height stays fixed (9a D26), so no step scrolls (9a D27) and the panel scrolls inside itself when an answer is long | Interview. The step stays fully in view next to the answer, and the sheet's width change is already built and reviewed |
| D4 | **Phone and tablet: a bottom sheet** (interview): below a 900px page the panel is docked at the bottom of the full-screen sheet, up to 70% of its height, over a dimmed step (the scrim from the tokens), with rounded top corners and the safe-area inset. It closes with its close button, Escape or a tap on the dimmed step. It slides up and down with the flows' ease (0.3 s); with reduced motion it appears at once | Interview. A phone has no room for a column; the dimmed step keeps the context visible |
| D5 | **The panel stays open across screens:** Next and Back keep it open and switch it to the new screen's chips; the conversation shown is per screen (the questions asked on a screen are listed again when coming back to it, in memory only). Closing the sheet closes the panel. Nothing is stored: no new storage key, the draft (9a D18) is unchanged | Help follows the customer through the flow without asking twice; remembering dismissals is 9f |
| D6 | **Chips and answers:** each screen shows three or four chips. Tapping one adds the question (as the customer's line) and the answer (as the assistant's line) to the conversation and removes that chip from the row; follow-up chips may appear with an answer. "Talk to an advisor" is the last chip from the documents screen on and wherever the map says so (map rule 5), and in every set at the end as a quiet text button. All copy lives in `js/opening-assistant-config.js` (one entry per screen id) | Map rules 1 to 3 and 5: authored, reviewable, one file to review |
| D7 | **The copy:** drafted from the intervention map; new for intro, purpose and horizon, risk wording against 9a's actual questions, the exit screen and completion. Answers that depend on facts are aligned with 9a and the app: the documents chip says answers are kept until the tab is closed (9a D18); the strategy chip says a riskier strategy than recommended cannot be chosen online (9a D11); the summary and completion chips say the mandate stays pending until it is funded, which is not built yet (roadmap 18), instead of the map's "invested within about three working days". The two items the map marks "to write" and "to confirm" are drafted and flagged for Klaudiusz's review in group 2 (interview: drafted in the config, reviewed in group 2) | The map's first drafts predate 9a; answers must not promise what the prototype does not do |
| D8 | **Tone:** UZ Bank assistant, no name (interview). Second person, short plain sentences, no exclamation marks, no em dashes, never "I recommend"; it says "we" for the bank. The panel's title is "Questions about this step", the figure's label "UZ Bank assistant" | Interview. It speaks for the bank and does not pretend to be a person; the advisor stays the human option |
| D9 | **Answer length by User Type** (interview: length only): each answer has `short` (one or two sentences) and `more` (the rest, often an example). Newbie (`novice`) sees both; All-rounder (`standard`) sees `short` and a "More" button that adds `more` in place; Power user (`power`) sees `short`. The profile is read with `window.UZBankPersona.read().profile`; with no stored profile, the All-rounder behaviour applies. Nudges and thresholds stay in 9f | Map's help levels, reduced to what 9b needs |
| D10 | **Talk to an advisor** (interview: simulated callback): tapping it adds the question and the answer "We will call you to find a time. Your answers are kept." (the exit screen's line, D15 of 9a, plus the draft note). No form, no data entered, nothing stored, no flow change | The real handoff is 9f; nothing here may look like it collects personal data |
| D11 | **The helper** (interview: a small 3D figure): built with `createFigure()` from `js/profile-persona-character.js` with its own fixed recipe that no User Type produces (the mage head and the mage outfit; `SLOTS` gains `head: mage` and `outfit: mage`), recoloured to the theme like the persona. It stands in a small stage at the top of the panel (about 120px high on desktop, a 56px portrait in the bottom sheet's header), idles, and plays one short wave clip when an answer arrives. three.js and the models load only when the panel first opens (a dynamic import), with a quiet placeholder until then; if loading fails the panel works without it. With reduced motion it stands still | Interview. Map: two characters, the helper is its own figure in the same style; lazy loading keeps the opening as fast as it is now |
| D12 | **The helper is not the persona:** different head and outfit, no headwear, and no User Type changes it. Its look is checked next to the persona on the Character kit page (D16) | Map rule 6: the helper speaks for the bank, the persona is the customer |
| D13 | **Accessibility:** the panel is an `aside` labelled "Questions about this step" on desktop and a modal `dialog` on a phone (focus trapped, Escape closes). Opening it moves focus to the panel's title; closing returns focus to Questions?. The conversation is a `role="log"` with polite announcements, so each new answer is read once. Chips are buttons; the figure's canvas is `aria-hidden`. Focus rings use `--color-fg-interactive` | Mission principle 5; the sheet's focus rules from 9a (D24) and the fridge sheet's prompt fix |
| D14 | **Motion:** the sheet's width (existing), the bottom sheet's slide, a 0.2 s fade and rise for each new line in the conversation, the helper's wave. Each has a reduced-motion path (at once, still figure) | Motion has a job: what is new is the answer |
| D15 | **Look:** colours only from the tokens. The customer's line right-aligned on `--color-bg-secondary`, the assistant's line left-aligned on the panel background with the text in `--color-fg`; chips are the secondary button in its small size (`uz-btn--secondary uz-btn--sm`), wrapping; "Talk to an advisor" is a text button. Follows Light, Dark and every colour theme | AGENTS.md colour rule; existing button components |
| D16 | **Documentation** (default, flagged): the Components page gets a "Questions and answers" section (a static conversation with chips, both line styles and the More button); the Character kit page gets a short "The helper" entry with its recipe next to the persona | Mission principle 2: what is new becomes part of the system. Flagged because it adds two small doc sections to the scope |
| D17 | **Files:** new `js/opening-assistant.js` (the panel, chips, conversation, layout switch, the helper) and `js/opening-assistant-config.js` (all copy); `js/investment-opening.js` (Questions? in `render()`, telling the assistant the current screen, closing it on completion's Done); `investment-opening.html` (the panel's container); `css/styles.css` (an "Opening assistant" section); `js/profile-persona-character.js` (the two `SLOTS` entries); `components.html`, `character-kit.html`. No new page, storage key or dependency; three.js comes from the same CDN import the character already uses | AGENTS.md conventions; nothing for `apps/web/README.md` |

## Context

- The opening's screens (`js/investment-opening-config.js` `SCREENS`): intro, knowledge, purpose (purpose and horizon), amount, risk (three questions, one open at a time), strategy, esg, tax (Switzerland and US), documents, summary, complete, ineligible. The intervention map's step numbers map onto these ids; its steps 2 and 3 and its steps 8 and 9 are one screen each.
- `render()` (`js/investment-opening.js` about line 673) builds the heading, text, body and actions for the current screen and announces the step; Questions? is added next to the heading there.
- The opening sends `uzbank:sheet-layout` with `wide: false` on load (line 49); `js/fridge-advisor-sheet.js` `setWide()` toggles `.modal-shell--wide` and keeps `.modal-shell--fixed-height` (8d D1). The width animates (`.modal-overlay--fridge .modal-shell` transition, 0.3 s).
- The persona: `js/profile-persona.js` `read()` returns `{ values, profile, name, recipe }`; profiles `novice`, `standard`, `power`. Every persona recipe uses the rogue head and a barbarian, ranger or knight outfit.
- `createFigure()` loads the five KayKit characters and the two animation packs in parallel; the fridge scene already uses it inside an iframe.

## Open questions

1. Does the 360 column with the figure leave room for a long answer without the panel scrolling at a 640 sheet? If not, the figure shrinks once a conversation starts. Settled in group 3.
2. Which KayKit clip reads as a wave (the general pack has an interaction and a cheer clip)? Settled by eye in group 4.
3. The copy flagged in D7 (the documents brochure summary, the strategy suitability line, the funding lines) needs Klaudiusz's sign-off in group 2.

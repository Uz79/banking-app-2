# Roadmap

## 1. Baseline (done)

- The presentable app as built before the spec-driven process: see `specs/baseline/`
- Tagged `v1-presentable`
- `AGENTS.md`, `specs/mission.md`, `specs/tech-spec.md`, this roadmap, `CHANGELOG.md`, and the `/feature-spec` and `/changelog` skills in place (2026-10-19)

## 2. Playground: "Payday run" (done)

A small 3D game on its own design system page, showing what the character kit can do beyond the app.

Spec: `specs/2026-10-19-payday-run/` (branch `feature/payday-run`). Built in 13 task groups; merged status is recorded in the changelog. Interview outcome: the whole story is in v1, the result screen has a breakdown and a kept best run (`uzBankWebPlaygroundBest`), no sound, touch uses two on-screen buttons.

What was agreed before the spec (confirmed in the interview, not re-opened):

- **Placement:** a fourth card on `design-system.html`, under Character kit, admin only. The page goes full screen (no sidebar or header) and opens as a sheet that slides up like the flow screens; a close button top right (and Escape) slides it back down to the Design system page. Also a "Try it in the Playground" link at the end of `character-kit.html`.
- **Player:** the persona character, not a car. Its recipe comes from User Type; the profile sets the pace (Beat jogs, Lena runs, Max sprints).
- **Mechanics:** in the style of Shopify's Horizon Drive: a spline track (no physics library, no raycasts), steer left and right within the track width, a chase camera, instanced effects. Keyboard and touch.
- **Story:** "Payday run". Salary lands (coin burst at the start), the runner collects coins through a small town and passes gates for rent, groceries and bills, deposits what's left in a savings chest, then runs into a forest where trees grow along the track (compound growth). The finish shows the result as a balance in the app's CHF format; the best run is kept.
- **Look:** the world takes the active colour theme, like the character (monochrome plus one accent).
- **Assets:** KayKit City Builder Bits 1.0 (free) and Forest Nature Pack 1.0 (free), CC0, already downloaded to `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/`. Copy only the models used into `apps/web/assets/3d/`.
- **Tuning:** speed curves, camera lag and effect sizes live in one config object with starting values, so feel is tuned by changing numbers.
- **Performance:** 60 fps on a mid-range phone; few draw calls; reduced motion gives a calm, still alternative.

Later, as follow-ups: sound (item 5).

## 3. Playground easter egg (later)

An entry from the 3D character on the main screens (for example a double tap on Overview) that opens the Playground. Only once the game itself feels good.

## 4. Mobile Light/Dark toggle (done)

A sun or moon button in the top left of the top bar on the four main screens, under 1280px, that swaps Light and Dark. Requested directly on 2026-10-20.

Spec: `specs/2026-10-20-mobile-mode-toggle/` (branch `feature/mobile-mode-toggle`).

## 5. Playground sound: footsteps and coins (done)

Two sounds only, recorded CC0 samples from Kenney played through the Web Audio API (no library): footsteps (hard ground in the town, grass in the forest) and a coin pickup. A mute button in the HUD, remembered. This is the sound follow-up promised under item 2.

Spec: `specs/2026-10-22-playground-sound/`.

## 6. Playground gameplay: lanes, jumping, a second coin, a trophy

Acceleration lanes, jumping (the rig has jump clips), a second coin type and a trophy. The plot is defined by Klaudiusz first; no spec until then.

## 7. Playground settings dialog (done)

A settings button in the Playground HUD that pauses the run and opens a settings dialog with sections, so changes happen while nothing moves. First two sections: **Visual parameters** (which ones to be defined in the spec interview) and **Theme** (the current Light/Dark choice, so the one-off recolour of the world and character happens behind the dialog). Resume closes it; Escape means Resume. Reuses the confirmation dialog component (payday-run D24).

Spec: `specs/2026-10-25-playground-settings-dialog/` (branch `feature/playground-settings-dialog`). Decided in its interview: the four visual parameters are render quality, camera distance, effects and fog distance; Sound moves into the dialog from the HUD; Theme is Light and Dark only (Multi-color themes stay in Profile); the visual parameters are remembered in `uzBankWebPlaygroundSettings`. Still to do first: measure the paused theme switch on a throttled CPU (below).

Original open questions: which visual parameters (for example render quality or pixel ratio, camera distance), whether Sound moves into the dialog from the HUD, and whether Multi-color themes are picked here or stay in Profile. Measure the paused theme switch on a throttled CPU first: a mid-run switch on a desktop cost about one extra frame, a phone is untested. Spec: `specs/2026-10-25-playground-settings-dialog/` (branch `feature/playground-settings-dialog`). Decided in its interview: the four visual parameters are render quality, camera distance, effects and fog distance; Sound moves into the dialog from the HUD; Theme is Light and Dark only; the visual parameters are remembered in `uzBankWebPlaygroundSettings`.

## 8. "How much should I invest?": the fridge advisor (8a, 8c, 8d and 8e done)

The first step of opening an investment product, as in a bank's advisory meeting. A fridge metaphor: the main compartment is money for daily needs, the reserve drawers are reserves for the unplanned and for bigger purchases, and the freezer is what can be invested. Based on a flow Klaudiusz designed with a bank; the reference frames are in `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/261022_fridge-food/scenario`.

Split:

- **8a. The flow** (done): entry from Overview > Offers > "Investment", a 3D fridge in the theme colours with the persona character standing next to it, five beats, sliders as the input, the investable amount as the result. The follow-up that tints the active compartment instead of outlining it is also done (D26, `feature/fridge-compartment-tint`).
- **8b. The avatar acting** (later): the character opens the doors, carries items and cheers.
- **8c. Fridge follow-ups** (done; planned 2026-10-28, a follow-up in `specs/2026-10-22-fridge-advisor/`): a hint that total assets means liquid assets only (not the home, not pillar 3a); total assets prefilled from the account balances the app already knows (the customer can change it). The 3 times salary reserve rule stays as it is (confirmed). Spec: group 9 and D27 to D32 in `specs/2026-10-22-fridge-advisor/` (branch `feature/fridge-follow-ups`); prefill = Household + Savings. The hand-over of the investable amount to 9a moved to the 9a spec (D27): 9a does not exist yet, and how the amount travels depends on 9a's shape.
- **8d. The fridge as a film** (done; spec: `specs/2026-10-29-fridge-film/`). The 3D stage fills the whole sheet, and the step text and sliders sit in a floating panel on top, like the HUD panels in Klaudiusz's cartography app (`~/Documents/GitHub/cartography-lab-app`, `apps/web/src/styles/app.css`: `.hud` and `.hud-stack` place the panels over the map, `.float-panel` draws them): about 20rem wide, frosted glass with the panel background at about 70% opacity, an 8px blur and a soft shadow. The sheet stays 960 wide but takes the opening's fixed height (`.modal-shell--fixed-height`, 9a D26), so the film frame is 960 x 640, and the camera poses are tuned for that frame. On the phone the panel is docked at the bottom over the scene. The floating panel becomes a documented design-system component (Components page), not a fridge-only style. Settled in the spec: the sheet stays 960 wide (D1); the panel floats on the right, docked below 1024px (D3, D4); contrast is checked in Light, Dark and the colour themes, with a solid panel for reduced transparency (D7).
- **8e. Fridge: the persona exits and returns** (done; added and built 2026-11-02). Today the persona is hidden abruptly after the intro (8a D22: "The persona steps out after the intro"), which looks like a bug. Instead: on leaving step 1 it walks out of the frame to the side (about 1 s, a walk clip from the rig's movement pack, `rig-medium-movement.glb`); steps 2 to 6 show the fridge alone; on step 7 it walks back in and stands next to the open freezer as the amount appears. Going back reverses it. Reduced motion: it simply shows on steps 1 and 7 and not in between. Prepares 8b (the avatar acting). Spec: `specs/2026-11-02-fridge-persona-walk/` (branch `feature/fridge-persona-walk`). Settled in its interview: out to the right; on step 7 the camera pulls back a little so the open freezer and the persona's head and upper body stand side by side; on arrival it only turns and idles. Changed while building: the camera waits until the persona has left the frame before it moves to the tour's close-ups (D3).

Spec for 8a: `specs/2026-10-22-fridge-advisor/`.

## 9. Investment product opening

What follows "Show suitable products" in item 8: the full opening of an investment product (asset management, five strategies), with a scripted assistant that helps where people get stuck. Planned on 2026-10-28.

**Why:** in Klaudiusz's usability tests and interviews of the bank's existing opening flow (reference frames in `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/261028_product-opening/scenario`, German), people found it too long (about 22 screens, no progress indicator while the intro promises 10 minutes), felt uncomfortable giving their financial situation, feared they lacked the knowledge to answer (risk questions, US tax status, 13 contract documents) and wished for a person. The only way to an advisor was the ineligibility exit screen.

**Order principle:** `main` is live, so a complete plain flow comes first (9a), then steps are replaced one at a time by their richer version. Every merge leaves a whole flow, and the sequence is the case study's before and after.

**Agreed before the specs (not to be re-opened):**

- **Three modes per step:** a plain form (horizon, purpose, ESG, tax status), a playful module (the fridge for the financial situation, the risk experience) and the assistant on the knowledge-heavy steps (knowledge, US status, strategy, documents, the amount check). The intervention map in `designs/conversation/investment-opening/intervention-map.md` assigns every step and is the input for every 9 spec.
- **The form is the record, the assistant explains.** Answers are always the customer's own: the assistant explains, gives examples and points out consequences, never suggests an answer and never gives personal investment advice. Every answer it gives is authored and reviewable.
- **Scripted, not live:** chips first (three or four suggested questions per step, each with a written answer); free text, if any, only matches keywords and falls back to the chips or to an advisor.
- **Two characters:** the persona avatar stays the customer (it reacts, it does not advise). The helper is its own character in the same KayKit style and speaks for the bank. The avatar's User Type sets how the helper behaves: Newbie gets help earlier and longer answers, Power user gets help only when asked, short.
- **User Type is the input:** the three Profile sliders (financial knowledge, banking products, digital affinity, `uzBankWebPersonaProfile`) say how much help a customer needs. The financial knowledge slider may prefill the knowledge question, which the customer still confirms in the flow.
- **Strategy vehicles:** each strategy is a way of travelling, faster and riskier as it goes up, so risk reads as clearly as return (balanced presentation, as FinSA expects): Income = tent (hiking), Conservative = tricycle, Balanced = Vespa, Growth = parachute, Dynamic = jetpack. Models from Poly Pizza and Quaternius in `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/261028_product-opening/3d-models/poly-pizza_models-various` (attribution in `261028_attribution-notes` there). The Vespa is OBJ only and is converted to GLB.
- **Copy:** English, as the rest of the app.

Split:

- **9a. The opening flow, plain version** (done; built 2026-10-29). Starts at "Show suitable products" and replaces the fridge's screen 8 (8a D6). Steps: knowledge, purpose, horizon, the investable amount from the fridge (the hand-over is decided here, not in 8c) with the amount check, the three standard risk questions, the five strategy cards with the recommendation, ESG preference, tax status (Switzerland only, then US), the contract documents, the summary with edit, completion. A progress indicator throughout. Prefilled from the profile and the fridge where possible. The ineligibility screen keeps its "Book an appointment". Spec: `specs/2026-10-29-investment-opening/` (branch `feature/investment-opening`). Settled in its interview: the same sheet loads a new page and narrows from 960 to 640; about ten screens (purpose and horizon, the three risk questions, and the two tax questions each on one screen); summary edits jump to the screen and come back; answers kept for the browser session; completion adds a pending "Asset management" row on Overview. The fridge's screen 8 goes.
- **9b. The assistant, first version** (done; planned 2026-10-30, built to 2026-11-02). The helper character and a chat panel opened from a help affordance on the 9a steps, with the scripted chips from the intervention map. Comes before the richer steps because the steps where help matters most (knowledge, US status, documents) are in 9a, and the assistant is the centre of the case study. Spec: `specs/2026-10-30-opening-assistant/` (branch `feature/opening-assistant`). Settled in its interview: a "Questions?" button by every screen's heading; on desktop the sheet widens to 960 with the chat as a column, on a phone a bottom sheet; the helper is a small 3D KayKit figure, unnamed ("UZ Bank assistant"); chips only, answer length by User Type; "Talk to an advisor" is a simulated callback line. Changed at review: the sheet is 960 for the whole flow on desktop with the assistant's column always there, every step starting with an invitation ("Yes, help me", and "I can do it myself" back to it); on a phone a "Help?" button with the helper's head sits next to Next and opens the questions full screen (D24 to D30, superseding the first review change D20 to D23); and the helper is KayKit's Lorekeeper, one complete model, since the mage parts were too close to the power user's wizard hat (D19).
- **9c. Vehicles in the Character kit** (done; built 2026-11-02). The five vehicle models prepared (GLB, recoloured to the theme like the fridge and the food, sized to the persona) and shown with the persona on the Character kit page first, so the design system shows them before a flow uses them. Includes a credits section listing every CC-BY model (Airplane, Parachute, Tricycle, Motorcycle by Poly by Google; Jetpack by Roman Miller; Vespa by Jasmine Roberts; via Poly Pizza), which must be live before any CC-BY model reaches `main`. The persona sits on or hangs from each vehicle in a matching pose (the kit's sit and jump clips). Copy only the models used into `apps/web/assets/3d/`. Spec: `specs/2026-11-02-character-kit-vehicles/` (branch `feature/character-kit-vehicles`). Settled in its interview: one stage with a strategy picker in a new "Vehicles" section; the pack has no sit clip, so the sit on the tricycle and the Vespa is built by hand from bone rotations, the parachute and the jetpack use the pack's `Jump_Idle`, and the persona stands beside the tent; a small idle each (the jetpack hovers, the parachute sways); the credits list only the models shipped (Airplane and Motorcycle are not used, so they are neither copied nor credited).
- **9d. Strategy choice with the vehicles** (done; built 2026-11-03). Replaces 9a's plain strategy cards: the persona travels with each strategy's vehicle, the recommended strategy is marked, risk and expected return stay as visible as in the cards. The models' credits are on the admin-only Character kit page (9c D12); once they appear in the customer's opening, the credits need a place a customer can reach. Spec: `specs/2026-11-02-strategy-vehicles/` (branch `feature/strategy-vehicles`). Settled in its interview: one stage above 9a's cards (the cards stay the control); the strategies above the risk profile are previewed on hover or focus, dimmed, never choosable; a "Model credits" link on the step shows the credits in place of the stage; on a phone a shorter stage. Changed in the build: the flow sheet grew to `clamp(480px, 100dvh - 2 * var(--space-7), 800px)` (D14); after review the strategy step became a carousel of five cards, each with the persona and its vehicle, chosen explicitly (D16 to D19, superseding the stage beside the cards of D15), and the summary shows the chosen vehicle (D20).
- **9e. The risk experience** (done; built 2026-11-03). Replaces the three standard risk questions: the customer's own amount in the "Why invest?" chart (a good, an expected and a bad year in CHF) and what they would do in each. Feeds exactly the same scoring as the three questions, so the result stays auditable. Spec: `specs/2026-11-03-risk-experience/` (branch `feature/risk-experience`). Settled in its interview: one scenario per question with the same answer ids and scores, reworded in the customer's francs; a fan of good, expected and unfavourable over the customer's horizon, like "Warum anlegen?"; one balanced mix as an example (the strategy comes next); the plain list is replaced. Changed in the build: the footnote sits behind "How is this worked out?", an answered question folds into one line (D16), and the phone's end values drop the percent (D17), so every state fits the sheet.
- **9f. The assistant, second version** (done; built 2026-11-03). Hesitation triggers (time on a step against its expected reading time, switching between options, info icons, going back, a field focused and left empty), escalating gently: first a quiet inline chip, at most once per step, remembered when dismissed, never a pop-up. The User Type sets the thresholds. (9b gives every User Type the same panel for now: on desktop the column with its invitation on every step, on a phone Help?; 9b D24 to D29. Tuning it by User Type stays here.) The last step is a handoff to a person (appointment or callback, simulated). Signals stay in the browser. Spec: `specs/2026-11-03-assistant-nudges-and-handoff/` (branch `feature/assistant-nudges-and-handoff`). Settled in its interview: the nudges and a simple handoff in one branch (a callback or a video meeting, three times, a confirmation, nothing collected); the nudge appears in the assistant (the desktop invitation turns into the step's question, a bubble above Help? on a phone), nothing new inside the step; nudges and a booking are remembered in the session draft; the column stays the same for every User Type, only the nudges differ.
- **9g. Personalisation** (later): thematic focus, alternative investments, regional focus. Not a step of the flow, which people found too long (intervention map, row 9g): if built, an opt-in from the summary ("Personalise your strategy (optional)"), so the flow gets no longer for those who skip it.

Not part of item 9: the avatar acting in the fridge (8b). The fridge as a film (8d) comes between 9a and 9b.

## 10. All bookings: the Search button does nothing (done)

Spec: `specs/2026-10-23-bookings-search-and-balance/` (together with item 11).

The Search button on `all-bookings-and-payments.html` has no handler. Found during the fridge advisor's baseline run; it predates that branch.

## 11. Account details: Household balance (done)

Spec: `specs/2026-10-23-bookings-search-and-balance/` (together with item 10). The spec found that the transfer and trade flows and the All bookings card carry their own constant balances too, and that the Overview and Account details totals use the fixed registered figure.

The account card on Account details shows Household as 10'000 instead of the booked balance (Overview shows 9'900 at the start, 9'400 after a 500 payment). Align it with Overview. Found during the fridge advisor's baseline run; it predates that branch.

## 12. All bookings: make the page real (done)

Spec: `specs/2026-10-25-all-bookings-real/` (branch `feature/all-bookings-real`).

The tabs (Executed, Pending, Recurring) only move the highlight and all show the same static list, and the payments and transfers made in the app do not appear in it. Found while writing the spec for items 10 and 11, which leaves it as it is. The spec also replaces the Search button of item 10 with an always-visible search field in the toolbar, and records that pattern in `tech-spec.md`.

## 13. Web Analytics (Vercel) (done)

Spec: `specs/2026-10-26-web-analytics/` (branch `feature/web-analytics`). Interview outcome: paths `/from-cv`, `/from-portfolio`, `/from-linkedin`; no visible feedback for the opt-out; the parameter is removed from the address bar; the opt-out affects only the Vercel script. The loader lives in `js/analytics.js` instead of a tag in every head.

- **Why:** see real visitors and where they come from (LinkedIn, and the PDFs sent out: CV, portfolio). Cookie-free, no personal data, so no consent banner.
- **How:** Vercel Web Analytics on the Hobby plan. The app is static HTML, so the `/_vercel/insights/script.js` tag (deferred, with the queue stub) goes in the `<head>` of every page. It loads only when `location.hostname` equals the production domain: not localhost, not `*.local`, not Vercel preview URLs.
- **Source entry paths:** Vercel rewrites in `vercel.json`, for example `/from-cv`, `/from-portfolio` and `/from-linkedin`, each serving `overview.html` while the URL keeps the source path, so every source is its own row under Pages. The exact list of paths is decided in the spec.
- **Own visits:** `?analytics=off` stores a localStorage flag so the script never loads in that browser; `?analytics=on` removes it. The flag is checked before the script loads. The new key goes into the localStorage list in `apps/web/README.md`.
- **Limits to note:** 50,000 events a month shared across all Vercel projects, a one-month reporting window, no custom events, no UTM report on Hobby. PDFs already sent keep their old links and count as direct.

## 14. Booking balance: dropping the oldest booking refunds its money (done)

When the bookings list is full and the oldest booking is dropped, its amount is refunded to the balance. The balance should not change when a booking leaves the list. Found at the end of `specs/2026-10-25-all-bookings-real/`. Spec: `specs/2026-11-03-booking-balance/` (branch `feature/booking-balance`). Settled in its interview: the money of a dropped executed booking is carried per account in the stored state (with the Today header's outflow); the edit bug found while reading the code is item 23. Changed in the build: All bookings' own Today header carries it too (D10). Built 2026-11-03.

## 15. Transfer confirmation copy: "will be executed now" (done)

The transfer confirmation still says the transfer "will be executed now". The copy needs another look. Found at the end of `specs/2026-10-25-all-bookings-real/`. Spec: `specs/2026-11-03-confirmation-copy/` (branch `feature/confirmation-copy`). Settled in its interview: the payment and trade confirmations too (the same shell, the same problem); the text says what happened, following the schedule (done now, made on a date, starts on a date); "Done" on every button. Changed in the build: the transfer and the trade record on Execute and the order button, as the payment does, so the dialog comes after the booking (D10). Built 2026-11-04.

## 16. Open checks

Checks that were not run on merged branches. Each is a pass to do and record, not a feature:

- **Playground settings dialog** (`specs/2026-10-25-playground-settings-dialog/validation.md`): the recolour cost on a throttled CPU, on a phone, and at a 2x pixel ratio.
- **All bookings** (`specs/2026-10-25-all-bookings-real/validation.md`): reduced motion and a screen reader.

## 17. Retire GitHub Pages (done)

Spec: `specs/2026-10-26-retire-github-pages/` (branch `feature/retire-github-pages`). Vercel becomes the only host: the Pages workflow is deleted, the docs say Vercel, and the build runs on Vercel as a gate (build command `npm run build && rm -rf dist node_modules`, install command default, output `.` still serving `apps/web` as source). Klaudiusz changes the Vercel settings and unpublishes the Pages site after the merge.

## 18. Fund the asset management mandate

Found during 9a (D22, planned 2026-10-29). Completing the opening adds an "Asset management" row on Overview that stays "Pending", because no money moves: the internal transfer only moves money between Household and Savings and has no mandate as a target. This item adds the mandate as a transfer target, so a transfer of the amount (from completion's "Next: transfer CHF … to your custody account", or from the transfer flow) turns "Pending" into a balance that the Accounts & investment total counts. To settle in its spec: whether completion links to the prefilled transfer, what the row shows while the money is invested (the three working days), and whether a mandate can be funded more than once. Spec: `specs/2026-11-04-fund-mandate/` (branch `feature/fund-mandate`). Settled in its interview: each mandate is a transfer target, and completion gets "Transfer now" opening the transfer prefilled; the funded amount shows as the row's balance at once and counts in the total; any amount, any number of times; "Custody account" leaves the transfer's targets (its balance is fixed, so money sent there was lost).

## 19. Fridge result: the amount spills over its ring on a phone (done, in 21)

Found during 8e (2026-11-02). On step 7 at 390px the docked panel's ring is too small for its text: "You could invest" wraps and "CHF 29'400" crosses the ring's lower edge. The ring and its text predate 8e (the fridge's result panel, 8d); desktop is fine. To settle in its spec: a larger ring on a phone, smaller type inside it, or the amount under the ring. Taken into item 21 (D8 there): the label above the ring, only the amount inside.

## 20. Character kit: the helper's stage can stop drawing while on screen

Found during 9c (2026-11-02). The helper specimen's IntersectionObserver in `character-kit.html` reads `entries[0]`, but one callback can carry several entries for the same box (scrolled past quickly), and the first is the stale one. The helper can then stay still while on screen, or draw while off it. The Vehicles stage reads the latest entry (9c). To settle in its spec: the same one-line fix, and whether the specimen's own stage has the same pattern.

## 21. Phone polish of the fridge and the opening (done)

Planned and built 2026-11-03. The fridge and the opening as a customer meets them on a phone, plus two rules for every width. Regular sliders on a phone; the assistant on a phone as its own layer over the flow ("Questions about this step", its own X); no disabled call-to-action buttons (a design-system rule: Next always enabled, a tap with something missing says what under the field and moves focus there; replaces 9d D18's disabled Next); why "Show suitable products" looks pale; the fridge's result ring (item 19); a focus ring on Investment after a close only when closed by keyboard; closing asks "Leave for now?" on every step, and the progress is really kept: the fridge keeps its step and values for the session (revises fridge D8) and Investment reopens where the customer left. Spec: `specs/2026-11-03-phone-polish/` (branch `feature/phone-polish`). Settled in its interview: one session key (`uzBankWebOpeningDraft`, extended with the page and the fridge's values); completion clears everything; completion and the booked appointment close without asking; Klaudiusz checks VoiceOver on an iPhone.

## 22. Profile: "Reset demo data" is disabled while it confirms

Found during 21 (2026-11-03). The design-system rule from 21 says a call-to-action is never disabled; Profile's "Reset demo data" (`js/app-mp.js`) disables itself for 1.2 s while it shows "Reset ✓". To settle in its spec: a confirmation that does not disable the button (a status line or a toast), and whether the button should ask first.

## 23. Editing a pending payment turns it executed

Found during 14 (2026-11-03). Editing a booking from its detail (`payment-overlay.js` with `editingBookingId`) calls `UZBankPayState.updatePayment`, which rebuilds the booking from `id`, `recipientName`, `currency`, `amount` and `dateISO` only. The booking loses its `status`, `executeOn`, `accountKey`, `icon` and `direction`, so a pending payment becomes executed and its money leaves Household, and the schedule chosen in the edit is ignored. To settle in its spec: keep every field the edit does not change, and apply the edit's schedule (a pending payment edited to "now" executes, as a new payment would).

## 24. All bookings: month separators

Added 2026-11-03. The list on All bookings runs day group after day group with nothing marking where a month starts, and the month chips above it have no visible counterpart in the list.

- **Separator:** at the start of each month, a row between the day groups with the month in capital letters ("MAY"; with the year only when the list crosses a year, "DECEMBER 2025"), full width, on the separator background token, no amount.
- **Linked to the month chips:** tapping a chip scrolls to its separator; while scrolling, the chip of the month in view becomes active.
- **Sticky (optional):** the current month's separator sticks below the header until the next one pushes it away. To decide in its spec.
- **Everywhere:** in all three tabs (Executed, Pending, Recurring) and with the search field (a month with no matches shows no separator). Screen readers read it as a heading.
- **Focus after a chip (found during 25, 2026-11-03):** a click on a chip in the list, or Enter on it, docks the bar and hides the list's bar, so focus drops to the page body and the next Tab starts from the top. To settle with the chip linking above: focus moves to the same chip in the docked bar, or to the month's separator.

## 25. Focus rings app-wide (done)

Added 2026-11-03, point 7 of the phone polish brief (points 1 to 6 were built in 21). No browser-default outlines anywhere: every interactive element shows the app's ring in `--color-fg-interactive`, only for keyboard focus (`:focus-visible`), never after a click or tap. First known case: the selected month chip on All bookings shows a blue browser ring after a click. Spec: `specs/2026-11-03-focus-rings/` (branch `feature/focus-rings`). Settled in its interview: one global base rule at zero specificity, so the component rings keep winning; text fields keep their focused stroke on a click; outlines in other tokens move to `--color-fg-interactive`, the fields' inset stroke stays; a scripted audit of every page and flow.

## 26. Fridge result: the amount spills over its ring on desktop with Large type

Found during 25 (2026-11-03). With Legibility set to Large, the fridge's result on the desktop panel puts the amount across the ring's edge, as item 19 did on a phone before 21 fixed it there. To settle in its spec: whether the ring grows with the type scale, or the amount's size is capped inside it.

## 27. Sheets: Tab leaves them for the page behind

Found during 25 (2026-11-03). In the Pay sheet and the Buy sheet on desktop, Tab past the last control moves focus to the page behind the scrim (Overview's Scan and Pay, the position's Sell), which can't be seen or used while the sheet is open. The "Discard" dialogs and the opening's phone layer were not affected. To settle in its spec: make the page behind inert while a sheet is open (or keep focus in the sheet), and which sheets share the code.

## 28. Payments and transfers: the execution date can't be picked

Found during 15 (2026-11-03). Turning off "As soon as possible" (payment) or "Immediately" (transfer) shows an "Execute on" field, but nothing opens a date picker: the date stays today, so a "later" payment or transfer is pending for today, and a recurring one starts today. The confirmation now says "will be made on" and "starts on" with that date. To settle in its spec: a date picker (the app has none yet), which dates are allowed (working days, not in the past), and when a pending booking becomes executed.

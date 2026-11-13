# Roadmap

The order below is the order of work. Items keep their numbers (specs, commits and the changelog cite them), so an item moves between sections but is never renumbered. `/feature-spec` takes the first item under Next. Reordered 2026-11-08.

# Next

In order. The first is what `/feature-spec` starts.

## 40. Pay and the transfer: picking a date overrides the toggle

Added 2026-11-05, widened 2026-11-13. Spec: `specs/2026-11-13-pay-date-overrides-asap/`. In Pay's schedule step and in the internal transfer's, the toggle ("As soon as possible" / "Immediately") has "Execute on" always visible under it, and the field always opens the calendar. Pay's toggle date is the next working day (today stays unpickable), the transfer's is today (pickable, weekends too). Picking the toggle's own date keeps it on; any other date turns it off; switching it on resets the date. Screen readers hear the toggle's change. Recurring and Standing order follow the same rule. Revises 28's D2, D3 and D4. Pay's "executes now" status stays until 37.

## 49. Banking sheets don't close on Escape

Found during 32 (2026-11-05). Pay, the transfer, Buy and Sell, and a booking's sheet ignore Escape: only their close button closes them. The fridge, the opening and the Playground close on Escape (`js/fridge-advisor-sheet.js`, `js/investment-opening.js`, `js/playground-sheet.js`). To settle in its spec: Escape on every banking sheet, with the flows asking their "Discard …?" prompt first as their close button does, what Escape does while a picker, the calendar or a confirmation is open over a sheet, and focus after the close.

## 37. Pending payments and transfers execute on their date

Split from 28 (2026-11-04). A payment or transfer set for a later date stays pending forever: nothing executes it when its date arrives, so its money never moves, and a recurring one never repeats. To settle in its spec: when it runs (on load, against the device date), what an executed one looks like in the bookings and balances, how a recurring or standing order repeats, and what the status message says.

## 48. Chip: its own tokens, as in Figma

Added 2026-11-05. `.chip--tonal` (43) uses `--color-btn-tonal-*`. Figma's Chip has its own Case=FilledTonal, bound to `chip/filled tonal/*` (background, border, foreground, hover, pressed; Des-Sys-Test, Component Library > Chip, node 769:106445). Those tokens are in `designs/tokens/_NEW/260617_tokens` but not in `designs/tokens/mapped`. Bring them into the token pipeline as `--color-chip-filled-tonal-*`, make the theme engine emit them for Multi-color themes, and point the chip at them. Settle the class name against Figma's "FilledTonal", and document the Secondary case in `designs/components/chip/chip.md` too.

# Later

Not scheduled, smallest first (an estimate of size, not of value).

## 70. A stray copy of the token generator is tracked in git

Found while writing 63 and 64's spec (2026-11-08). `apps/web/scripts/generate-tokens-css 2.mjs` is tracked, is not run by `tokens:build` (which reads `generate-tokens-css.mjs`), and carries non-code text after the generator's end. To settle in its spec: whether anything reads it (it looks like an accidental copy), then remove it, and check the other `* 2.*` files in the repo for the same.

## 66. Motion specimens: Focus-mode choreography's sample stays white in Dark

Klaudiusz, 2026-11-06. On Motion specimens, the Focus-mode choreography sample's right column keeps a white background in Dark. It needs a surface token.

## 67. The status message's timing

Klaudiusz, 2026-11-06. The "Open payment!" message appears after about 9 s; the baseline smoke test and `js/status-feed.js`'s comment say 12 s (8 s was measured on 2026-11-05). To settle: what the timer actually counts from, then align the code or the baseline.

## 58. Legibility doesn't reach the Playground

Found while writing 34's spec (2026-11-06). The Playground (`playground.html`, admin only, opened as a full-screen sheet) loads neither `js/app-mp.js` nor, since 34, `js/appearance.js`, so Legibility's type and spacing scale, Typeface and Font don't apply there. To settle in its spec: loading `js/appearance.js` as the fridge and the opening do, and a check of the Playground's layouts at Small and Large, desktop and phone.

## 50. Built-in transfers can read as a transfer to the same account

Found during 46 (2026-11-05). All bookings shows the same built-in rows for Household and Savings, and a built-in transfer's sheet takes the page's account as its debit (`buildAllBookingsRowData` in `js/payment-details.js`, from `ACCOUNT_SNAPSHOTS`). So on Household's All bookings "Transfer to Household" reads "from Household to Household", and on Savings' "Transfer to Savings" reads "from Savings account to Savings account". The two lists also name Savings differently ("Savings account" in the built-in snapshots, "Savings Account" in the transfer's). To settle in its spec: per-account built-in rows, or a debit account in each transfer row's data, and one name for Savings.

## 39. Pay: a recipient's details typed on the recipient step are lost

Found while writing 29's spec (2026-11-04). The recipient step fills Recipient name, Street and City from the chosen recipient, but nothing reads the inputs back (`js/payment-overlay.js`, the `input` handler only syncs the clear buttons). A name changed there is ignored: the schedule step, the summary, the confirmation and the stored booking keep the name picked from the list. To settle in its spec: whether the typed details update the flow's recipient (and the stored booking), whether a changed name makes a new recipient or edits the saved one, and what an emptied name does on Next.

## 44. Booking sheet: an executed instance names its standing order

Added 2026-11-05, out of 43's scope. An executed booking that is an instance of a standing order (Rent, Internet & Phone) shows a line "Standing order: <frequency>" in its sheet, linking to the order in the Recurring tab. To settle in its spec: how an instance points to its order (built-in data and the payment state), what the link opens (the order's sheet, or the Recurring tab scrolled to it), and how it reads on a phone and to a screen reader.

## 45. Pay and the transfer: choose a frequency

Found while writing 43's spec (2026-11-05). Pay's and the transfer's Recurring and Standing order have no frequency choice, so a recurring booking made in the app stores Monthly (43, D9). To settle in its spec: the choices (weekly, monthly, quarterly, yearly), where the field sits in the schedule step, what an edit shows, and the confirmation's wording.

## 51. Booking sheet: Edit and Copy for a pending transfer

Found during 42 (2026-11-05). A pending transfer made in the app gets Delete in its sheet; Edit and Copy are left out, as the transfer flow (`js/iat-overlay.js`) has no way to open with an amount, accounts and a schedule filled in. To settle in its spec: a prefill path for the transfer like Pay's edit context, whether Edit updates both legs in place, what Copy of an executed transfer opens, and whether built-in transfers get Copy (they need 50 first).

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

# Parked

Waiting on Klaudiusz.

## 3. Playground easter egg (later)

An entry from the 3D character on the main screens (for example a double tap on Overview) that opens the Playground. Only once the game itself feels good.

## 6. Playground gameplay: lanes, jumping, a second coin, a trophy

Acceleration lanes, jumping (the rig has jump clips), a second coin type and a trophy. The plot is defined by Klaudiusz first; no spec until then.

# Done

Finished work, and duplicates closed in favour of another item, in number order.

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

## 4. Mobile Light/Dark toggle (done)

A sun or moon button in the top left of the top bar on the four main screens, under 1280px, that swaps Light and Dark. Requested directly on 2026-10-20.

Spec: `specs/2026-10-20-mobile-mode-toggle/` (branch `feature/mobile-mode-toggle`).

## 5. Playground sound: footsteps and coins (done)

Two sounds only, recorded CC0 samples from Kenney played through the Web Audio API (no library): footsteps (hard ground in the town, grass in the forest) and a coin pickup. A mute button in the HUD, remembered. This is the sound follow-up promised under item 2.

Spec: `specs/2026-10-22-playground-sound/`.

## 7. Playground settings dialog (done)

A settings button in the Playground HUD that pauses the run and opens a settings dialog with sections, so changes happen while nothing moves. First two sections: **Visual parameters** (which ones to be defined in the spec interview) and **Theme** (the current Light/Dark choice, so the one-off recolour of the world and character happens behind the dialog). Resume closes it; Escape means Resume. Reuses the confirmation dialog component (payday-run D24).

Spec: `specs/2026-10-25-playground-settings-dialog/` (branch `feature/playground-settings-dialog`). Decided in its interview: the four visual parameters are render quality, camera distance, effects and fog distance; Sound moves into the dialog from the HUD; Theme is Light and Dark only (Multi-color themes stay in Profile); the visual parameters are remembered in `uzBankWebPlaygroundSettings`. Still to do first: measure the paused theme switch on a throttled CPU (below).

Original open questions: which visual parameters (for example render quality or pixel ratio, camera distance), whether Sound moves into the dialog from the HUD, and whether Multi-color themes are picked here or stay in Profile. Measure the paused theme switch on a throttled CPU first: a mid-run switch on a desktop cost about one extra frame, a phone is untested.

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

## 16. Open checks (done)

Checks that were not run on merged branches. Each is a pass to do and record, not a feature. None open: the Playground settings dialog's (recolour cost on a throttled CPU, on a phone, at a 2x pixel ratio) and All bookings' (reduced motion, a screen reader) passed in Klaudiusz's manual check on 2026-11-06, recorded in their `validation.md`.

## 17. Retire GitHub Pages (done)

Spec: `specs/2026-10-26-retire-github-pages/` (branch `feature/retire-github-pages`). Vercel becomes the only host: the Pages workflow is deleted, the docs say Vercel, and the build runs on Vercel as a gate (build command `npm run build && rm -rf dist node_modules`, install command default, output `.` still serving `apps/web` as source). Klaudiusz changes the Vercel settings and unpublishes the Pages site after the merge.

## 18. Fund the asset management mandate (done)

Found during 9a (D22, planned 2026-10-29). Completing the opening adds an "Asset management" row on Overview that stays "Pending", because no money moves: the internal transfer only moves money between Household and Savings and has no mandate as a target. This item adds the mandate as a transfer target, so a transfer of the amount (from completion's "Next: transfer CHF … to your custody account", or from the transfer flow) turns "Pending" into a balance that the Accounts & investment total counts. To settle in its spec: whether completion links to the prefilled transfer, what the row shows while the money is invested (the three working days), and whether a mandate can be funded more than once. Spec: `specs/2026-11-04-fund-mandate/` (branch `feature/fund-mandate`). Settled in its interview: each mandate is a transfer target, and completion gets "Transfer now" opening the transfer prefilled; the funded amount shows as the row's balance at once and counts in the total; any amount, any number of times; "Custody account" leaves the transfer's targets (its balance is fixed, so money sent there was lost). Changed in the build: a transfer to a mandate leaves the Overview total the same, since the money moves between two rows it counts (D8); Custody account stays in the transfer's catalogue so the details of past transfers to it still open. Built 2026-11-04.

## 19. Fridge result: the amount spills over its ring on a phone (done, in 21)

Found during 8e (2026-11-02). On step 7 at 390px the docked panel's ring is too small for its text: "You could invest" wraps and "CHF 29'400" crosses the ring's lower edge. The ring and its text predate 8e (the fridge's result panel, 8d); desktop is fine. To settle in its spec: a larger ring on a phone, smaller type inside it, or the amount under the ring. Taken into item 21 (D8 there): the label above the ring, only the amount inside.

## 20. Character kit: the helper's stage can stop drawing while on screen (done)

Found during 9c (2026-11-02). The helper specimen's IntersectionObserver in `character-kit.html` reads `entries[0]`, but one callback can carry several entries for the same box (scrolled past quickly), and the first is the stale one. The helper can then stay still while on screen, or draw while off it. The Vehicles stage reads the latest entry (9c). To settle in its spec: the same one-line fix, and whether the specimen's own stage has the same pattern. Spec: `specs/2026-11-04-observer-latest-entry/` (branch `feature/observer-latest-entry`). Settled in its interview: the helper specimen and the shared persona stage (`mountStage` in `js/profile-persona-character.js`, which also draws the kit's live specimen, Profile's persona and the ambient figure on the main screens) both read the latest entry; Motion specimens' one-shot triggers stay; item 20 alone; a forced stale-then-fresh check besides real scrolling. Built 2026-11-04; the forced check showed the bug in both stages before the fix and none after.

## 21. Phone polish of the fridge and the opening (done)

Planned and built 2026-11-03. The fridge and the opening as a customer meets them on a phone, plus two rules for every width. Regular sliders on a phone; the assistant on a phone as its own layer over the flow ("Questions about this step", its own X); no disabled call-to-action buttons (a design-system rule: Next always enabled, a tap with something missing says what under the field and moves focus there; replaces 9d D18's disabled Next); why "Show suitable products" looks pale; the fridge's result ring (item 19); a focus ring on Investment after a close only when closed by keyboard; closing asks "Leave for now?" on every step, and the progress is really kept: the fridge keeps its step and values for the session (revises fridge D8) and Investment reopens where the customer left. Spec: `specs/2026-11-03-phone-polish/` (branch `feature/phone-polish`). Settled in its interview: one session key (`uzBankWebOpeningDraft`, extended with the page and the fridge's values); completion clears everything; completion and the booked appointment close without asking; Klaudiusz checks VoiceOver on an iPhone.

## 22. Profile: "Reset demo data" is disabled while it confirms (done)

Found during 21 (2026-11-03). The design-system rule from 21 says a call-to-action is never disabled; Profile's "Reset demo data" (`js/app-mp.js`) disables itself for 1.2 s while it shows "Reset ✓". To settle in its spec: a confirmation that does not disable the button (a status line or a toast), and whether the button should ask first.

Spec: `specs/2026-11-04-reset-demo-confirm/` (branch `feature/reset-demo-confirm`). Settled in its interview: a status line under the button (no toast), the shared confirm dialog asks first, and the subtitle is corrected to say what the reset clears.

## 23. Editing a pending payment turns it executed (done)

Found during 14 (2026-11-03). Editing a booking from its detail (`payment-overlay.js` with `editingBookingId`) calls `UZBankPayState.updatePayment`, which rebuilds the booking from `id`, `recipientName`, `currency`, `amount` and `dateISO` only. The booking loses its `status`, `executeOn`, `accountKey`, `icon` and `direction`, so a pending payment becomes executed and its money leaves Household, and the schedule chosen in the edit is ignored. To settle in its spec: keep every field the edit does not change, and apply the edit's schedule (a pending payment edited to "now" executes, as a new payment would).

Spec: `specs/2026-11-04-edit-pending-payment/` (branch `feature/edit-pending-payment`). Settled in its interview: the edit opens with the booking's schedule on the schedule step; the booking sheet shows a stored payment's real status (it showed every one as "Pending"), with Edit only on pending and recurring; All bookings' dead Edit buttons are item 31. Found in the build: Account details lists only executed bookings, so no button reaches a stored pending payment's edit until 31. Built 2026-11-04.

## 24. All bookings: month separators (done)

Added 2026-11-03. The list on All bookings runs day group after day group with nothing marking where a month starts, and the month chips above it have no visible counterpart in the list.

- **Separator:** at the start of each month, a row between the day groups with the month in capital letters ("MAY"; with the year only when the list crosses a year, "DECEMBER 2025"), full width, on the separator background token, no amount.
- **Linked to the month chips:** tapping a chip scrolls to its separator; while scrolling, the chip of the month in view becomes active.
- **Sticky (optional):** the current month's separator sticks below the header until the next one pushes it away. To decide in its spec.
- **Everywhere:** in all three tabs (Executed, Pending, Recurring) and with the search field (a month with no matches shows no separator). Screen readers read it as a heading.
- **Focus after a chip (found during 25, 2026-11-03):** a click on a chip in the list, or Enter on it, docks the bar and hides the list's bar, so focus drops to the page body and the next Tab starts from the top. To settle with the chip linking above: focus moves to the same chip in the docked bar, or to the month's separator.

Spec: `specs/2026-11-04-month-separators/` (branch `feature/month-separators`). Settled in its interview: no sticky separator (the docked chips with their active chip name the month); focus moves to the same chip in the docked bar; the band in `--color-bg-secondary` (the "separator background token" doesn't exist). Found in the build: in-app pending and recurring groups went above all the static ones, out of date order (D12). Built 2026-11-04.

## 25. Focus rings app-wide (done)

Added 2026-11-03, point 7 of the phone polish brief (points 1 to 6 were built in 21). No browser-default outlines anywhere: every interactive element shows the app's ring in `--color-fg-interactive`, only for keyboard focus (`:focus-visible`), never after a click or tap. First known case: the selected month chip on All bookings shows a blue browser ring after a click. Spec: `specs/2026-11-03-focus-rings/` (branch `feature/focus-rings`). Settled in its interview: one global base rule at zero specificity, so the component rings keep winning; text fields keep their focused stroke on a click; outlines in other tokens move to `--color-fg-interactive`, the fields' inset stroke stays; a scripted audit of every page and flow.

## 26. Fridge result: the amount spills over its ring on desktop with Large type (done)

Found during 25 (2026-11-03). With Legibility set to Large, the fridge's result on the desktop panel puts the amount across the ring's edge, as item 19 did on a phone before 21 fixed it there. To settle in its spec: whether the ring grows with the type scale, or the amount's size is capped inside it.

Spec: `specs/2026-11-04-fridge-ring-desktop/` (branch `feature/fridge-ring-desktop`). Found while writing it: Legibility doesn't reach the fridge page, so Large type is not the cause; a six-digit amount wraps onto two lines whatever the type size. Settled in its interview: the phone's rule on the floating panel (one line, sized by length), "You could invest" staying inside the ring; Legibility in the fridge and the opening becomes its own roadmap item (34). Built 2026-11-04.

## 27. Sheets: Tab leaves them for the page behind (done)

Found during 25 (2026-11-03). In the Pay sheet and the Buy sheet on desktop, Tab past the last control moves focus to the page behind the scrim (Overview's Scan and Pay, the position's Sell), which can't be seen or used while the sheet is open. The "Discard" dialogs and the opening's phone layer were not affected. To settle in its spec: make the page behind inert while a sheet is open (or keep focus in the sheet), and which sheets share the code.

Spec: `specs/2026-11-04-sheet-focus/` (branch `feature/sheet-focus`). Found while writing it: six sheets are affected (Pay, the transfer, Buy and Sell, the booking sheet, Account information, Share information); the Discard dialogs and the picker sheets are native dialogs and the fridge and playground already make the page inert. Settled in its interview: a shared stack helper in `js/dialog-focus.js` (Share opens over Account information); focus moves into the sheet and back to its opener; the fridge and playground stay as they are. Found in the build: dialogs around a sheet (Discard, More functions) need the helper to wait for them; with reduced motion the transfer never finishes closing (35). Built 2026-11-04.

## 28. Payments and transfers: the execution date can't be picked (done)

Found during 15 (2026-11-03). Turning off "As soon as possible" (payment) or "Immediately" (transfer) shows an "Execute on" field, but nothing opens a date picker: the date stays today, so a "later" payment or transfer is pending for today, and a recurring one starts today. The confirmation now says "will be made on" and "starts on" with that date. To settle in its spec: a date picker (the app has none yet), which dates are allowed (working days, not in the past), and when a pending booking becomes executed.

Spec: `specs/2026-11-04-execution-date/` (branch `feature/execution-date`). Settled in its interview: the app's own calendar in the form sheet (pop-up on desktop, bottom sheet on a phone); working days from the next working day to twelve months ahead, no holidays; what happens when the date arrives moves to 37. Found in the build: the transfer's Immediately switch showed the opposite state (fixed here, D13) and Pay's schedule step always names Hans Meyer (38). Built 2026-11-04.

## 29. Pay: the schedule step names the wrong recipient (done)

Found during 22 (2026-11-04). The Pay flow's Time Schedule step shows "Hans Meyer" as the recipient whoever was picked: the name is fixed in `overview.html` (the `data-step="schedule"` field) and nothing fills it. The summary, the confirmation and the booking use the right name. To settle in its spec: fill it from the chosen recipient like the amount step does, and check the same fixed name on the other pages that carry the Pay sheet.

Found again during 28 as item 38 (the cause: `paintScheduleStep` in `js/payment-overlay.js` never writes the name), closed as its duplicate. Spec: `specs/2026-11-04-schedule-recipient/` (branch `feature/schedule-recipient`). Settled in its interview: the schedule step only, with a check of every other placeholder in the Pay sheet on Overview, Payments and Account details; typed recipient fields not being read back is item 39. Changed at review: the Pay sheet's "Hans Meyer" placeholders leave the markup (D2), and the Lena Fischer case is checked down to the stored booking and the balance (D10). Built 2026-11-04.

## 30. Buy and Sell: "Discard order?" offers "Continue payment" (done)

Found during 22 (2026-11-04). Closing the trade sheet asks "Discard order?", but its stay button reads "Continue payment": `promptExit` in `js/trade-flow-overlay.js` sets the title, message and Discard label, not `stayLabel`, so the shared dialog's default shows. To settle in its spec: the label ("Continue order"), and whether the other callers of `UZBankPaymentExitPrompt` (the playground, the fridge) set theirs.

Spec: `specs/2026-11-05-exit-prompt-labels/` (branch `feature/exit-prompt-labels`). Found while writing it: the transfer's "Discard transfer?" and Pay's edit-mode "Discard changes?" also show "Continue payment"; the fridge, the Playground and the reset set their own. Settled in its interview: all three prompts in this branch, each stay button naming its task ("Continue order", "Continue transfer", "Continue editing"), and the shared dialog's defaults made neutral with Pay passing its own words. Built 2026-11-05.

## 31. All bookings: the sheet's Edit buttons do nothing (done)

Found during 23 (2026-11-04). A pending payment's sheet on All bookings shows "Edit amount" and "Edit payment", but the page doesn't load the Pay sheet (`payment-overlay.js` and its markup), so the `#pay/amount` route the buttons set goes nowhere: the sheet closes and nothing opens. Editing works on Account details. To settle in its spec: give All bookings the Pay sheet, or hide Edit there.

Spec: `specs/2026-11-05-bookings-edit/` (branch `feature/bookings-edit`). Settled in its interview: All bookings gets the Pay sheet (its markup copied from Account details, its scripts loaded), the user stays on the same tab after Done, and built-in example rows that come back after a reload are item 42. Found in the build: Pay's markup must come before the booking sheet, as `payment-overlay.js` binds to the page's first sheet (D11), and the page's built-in pending rows open as "Executed" with no Edit (43). Built 2026-11-05.

## 32. Booking sheet: a pending transfer shows "Executed" (done)

Found during 23 (2026-11-04). `buildDataFromStateBooking` in `js/payment-details.js` gives every stored transfer (and trade) the status "executed", so a transfer made with "Immediately" off or as a standing order reads "Executed" in its sheet. To settle in its spec: read the booking's status as payments do since 23, and what the sheet shows for a recurring transfer.

Spec: `specs/2026-11-05-transfer-status/` (branch `feature/transfer-status`), with 46. Settled in its interview: built with 46, since both are in `buildDataFromStateBooking`; a recurring transfer reads "Pending", as a recurring payment does, until 47. Found in the check: the banking sheets ignore Escape (49). Built 2026-11-05.

## 33. Booking rows can't be reached by keyboard (done)

Found during 23 (2026-11-04). The booking rows on Account details (and the other bookings lists) are `div`s with no `tabindex` or role, so Tab skips them and a keyboard user can't open a booking's sheet, nor edit a pending payment from it. The sheet itself works by keyboard once open. To settle in its spec: rows as buttons or links (and what they announce), on every page that lists bookings.

Spec: `specs/2026-11-06-booking-rows-keyboard/` (branch `feature/booking-rows-keyboard`), with 52, its duplicate. Settled in its interview: a row is a `<button>`, read as its visible text; focus back on the row after the sheet, on the next row after a Delete; standard gate. Found in the build: the hand-on is a small API of the sheet focus helper, so an edit's Pay sheet uses it too; a standing order's next payment on Household reads "from Savings account" (57). Built 2026-11-06.

## 34. Legibility doesn't reach the fridge and the opening (done)

Found during 26 (2026-11-04). The fridge (`fridge-advisor.html`) and the investment opening load no `app-mp.js`, so Legibility's type and spacing scale, Typeface and Font don't apply inside them: a reader on Large gets default type there, in the Overview sheet and on their own pages. To settle in its spec: how the pages pick up the appearance settings (the shared code or a small boot), and a check of every fridge and opening layout at Small and Large, the result ring and the floating panel included.

Spec: `specs/2026-11-06-legibility-fridge-opening/` (branch `feature/legibility-fridge-opening`). Settled in its interview: the Legibility code moves into its own `js/appearance.js`, loaded by every shell page and by the fridge and the opening; what breaks at Small or Large is fixed here; the Playground stays out (a new item, 58); standard gate. Found in the build: at Large on a phone the risk chart's end values and the strategy markers' names overflowed, the more so in a wide typeface (Source Serif 4), and the summary's strategy chip ran past the edge; the chart's values become rows at Large on a phone (the one per-setting rule) and the markers' names stop growing on a narrow screen. Built 2026-11-06.

## 35. Transfer sheet: with reduced motion, closing leaves an invisible layer over the page (done)

Found during 27 (2026-11-04). `closeOverlay()` in `js/iat-overlay.js` finishes only on the sheet's `transitionend`, with no fallback timer (Pay, the trade and the booking sheet have one). With reduced motion the sheet has no transition, so the overlay keeps `modal-overlay--active modal-overlay--closing`: the scrim fades to nothing but the overlay stays over the page and takes every click until a reload. Checked by injecting the reduced-motion rules on Overview (the system setting itself was not switched). To settle in its spec: a fallback timer as the other sheets have, and a pass over every sheet's close with reduced motion.

Taken before 28 (Klaudiusz, 2026-11-04). Spec: `specs/2026-11-04-sheet-close/` (branch `feature/sheet-close`). Root cause confirmed: only the transfer lacks a fallback; the other seven sheets each carry their own copy of one. Settled in its interview: one shared helper that ends every sheet's close on the slide's end, a 300 ms fallback, or at once with reduced motion; a sweep of every sheet and overlay with the real macOS setting, which Klaudiusz switches when asked. Found in the sweep: the forward arrows keep their nudge with reduced motion (36). Built 2026-11-04.

## 36. Arrow nudge: forward arrows keep moving with reduced motion (done)

Found during 35 (2026-11-04). With the macOS Reduce motion setting on, the forward arrows (Show all bookings, Details, Show all) keep their nudge loop. The reduced-motion rule in `css/styles.css` (the Arrow nudge block) uses the same selector as the forward rule but without its `:not(.uz-btn--proceed, .playground-touch__btn)`, so the forward rule outweighs it and the animation stays. The back arrows stop as they should. To settle in its spec: a reduced-motion rule that wins (matching selector or the same `:not`), and a check of the proceed button's nudge and pulse with the setting on.

Spec: `specs/2026-11-06-arrow-nudge-reduced-motion/` (branch `feature/arrow-nudge-reduced-motion`). Settled in its interview: the nudge loops are set only under `prefers-reduced-motion: no-preference`, so no reduce rule has to win; disabled arrows, outweighed the same way, are fixed here; the check covers every arrow and the proceed button with the real setting; standard gate. Found in the build: the proceed button's own rule already held; Motion specimens No. 009's code sample follows the new rule. Built 2026-11-06.

## 38. Pay: the schedule step always names Hans Meyer (duplicate of 29)

Found during 28 (2026-11-04). Pay's schedule step shows "Recipient: Hans Meyer" whoever was picked: `paintScheduleStep` in `js/payment-overlay.js` never writes the recipient's name, so the markup's placeholder stays (the amount step and the summary are right). Also on `main`. The same bug as 29, closed on 2026-11-04 and built there; its look at the other steps' placeholders is 29's D3.

## 41. Confirmation dialogs are not modal (done)

Added 2026-11-05. After Buy, the "Your order has been placed" dialog lets Tab reach the sheet behind it, including its Confirm button, which could place the order a second time. The confirmation dialogs in Buy and Sell, Pay and the transfer must keep focus like the sheets do (27's helper in `js/dialog-focus.js`) and put focus on Done when they open. The sheet's Confirm must not be reachable, nor able to place a second order, while or after the dialog shows. To settle in its spec: how each flow guards against a second confirm (a disabled button, a flag, or both), where focus goes after Done closes the dialog and the sheet, and a pass over every confirmation by keyboard and screen reader.

Spec: `specs/2026-11-05-confirmation-dialogs/` (branch `feature/confirmation-dialogs`). Widened before the interview to the dialog's content and layout (one layout for all four flows, the amount on one baseline, no empty "to" row in the trade's, one plain sentence). Settled in its interview: sentence, amount, then one secondary line; a later payment's date in the sentence; "share" or "shares" now, units for funds and a nominal amount for bonds when they exist; the sheet goes inert behind the dialog and browser Back from it closes the flow, no disabled button; VoiceOver in the merge gate. Found in the spec: Back from Pay's dialog reopens the summary with Execute live, so a second payment was possible. Found in the build: the trade's Back already closed without a prompt; Back into a `#pay/summary` entry from an earlier page load opens a fresh Pay at the summary, like any deep link. Built 2026-11-05; VoiceOver and the macOS Reduce motion pass are still to run before merge.

## 42. Edited example rows come back after a reload (done)

Found while writing 31's spec (2026-11-05). Editing one of a page's built-in example bookings (Swisscom or Tax office Zurich in Pending, for example) stores the edit as a new booking and hides the example row only in the page (`hidden` and `data-replaced` in `js/payment-overlay.js`). After a reload the example row shows again next to the edited copy. Happens on Account details today, and on All bookings once 31 gives it Pay. To settle in its spec: how a replaced example row is remembered (a field in the payment state or a new `uzBankWeb` key), on every page that lists bookings, and that the demo data reset brings the rows back. Once it lands, built-in pending and recurring rows get their Edit (43 keeps it off until then).

Spec: `specs/2026-11-05-booking-actions/` (branch `feature/booking-actions`). Widened before the interview to make built-in pending rows fully actionable: the function bar shows on them (Edit, Delete, Copy; executed payments Copy), Delete and Copy get handlers, and the footer reads "Done" on every booking. Settled in its interview: Copy stays in 42 (recipient and amount, as Pay has no message field); a pending transfer gets Delete, its Edit and Copy become a new item; standing orders stay as they are until 47; balances follow what is listed, so Apple's CHF 100 counts only while Apple is listed; standard gate. Found in the build: booking rows can't take keyboard focus (52), so focus after Delete stays as the sheet's close leaves it and a status line says what happened; Pay opens a past built-in date on the next possible day (53). Built 2026-11-05.

## 43. All bookings: built-in pending and recurring rows read "Executed" (done)

Found during 31 (2026-11-05). On All bookings, every built-in row opens a sheet that says "Executed" with no Edit, also the ones in Pending and Recurring (Swisscom, Helvetia Insurance, Tax office Zurich): `buildAllBookingsRowData` in `js/payment-details.js` sets `status: 'executed'` and ignores the row's `data-status`. Payments made in the app read their real status since 23. To settle in its spec: read the row's status (and a date for "Execute on"), what Edit does on a built-in row once it shows (it runs into 42, and may leave an empty month band), and the same check for built-in transfer rows (32).

Spec: `specs/2026-11-05-booking-chips/` (branch `feature/booking-chips`, from `feature/bookings-edit`). Direction settled before the interview: a row's icon names the counterparty, a tonal chip names "Pending" or the frequency, the booking type is row data, not the icon (which also made Rent and Account details' Pizza open as transfers). Settled in its interview: Edit stays off on built-in rows until 42; All bookings and Account details adopt it now; recurring bookings made in the app store Monthly, and a frequency choice in Pay is item 45. An executed instance's "Standing order" line is item 44. Found in the build: Pizza on Account details is a transfer in its data, so it stays one; trades appear in these lists and keep their buy and sell icons; a transfer made in the app opens as a payment on All bookings (46, from 31's setup). Built 2026-11-05.

## 46. All bookings: a transfer made in the app opens as a payment (done)

Found during 43 (2026-11-05). On All bookings, the sheet of a transfer made in the app reads "Domestic Payment": `buildDataFromStateBooking` in `js/payment-details.js` takes the accounts from `window.__UZ_IAT_ACCOUNTS__`, which `js/iat-overlay.js` sets, and All bookings doesn't load it, so the transfer falls back to the payment sheet. Account details shows the same booking as an "Internal Account Transfer". To settle in its spec: where the accounts' details come from on a page without the transfer flow (a shared account list, or loading the transfer there too).

Spec: `specs/2026-11-05-transfer-status/` (branch `feature/transfer-status`), with 32. Settled in its interview: All bookings loads `js/iat-overlay.js` without the transfer's markup, since it publishes the account list before it looks for its sheet. Found in the check: built-in transfer rows can read as a transfer to the same account (50). Built 2026-11-05.

## 47. Standing orders: the rule and its payments (done)

Added 2026-11-05. A standing order is a rule; its executions are bookings. Today tapping Rent in Recurring opens a payment sheet with Status "Pending". The rule gets a third variant of the booking sheet, next to Domestic Payment and Internal Account Transfer (not a new page): Status "Active", Frequency, Next execution; its Edit changes all future payments. An instance keeps its Pending or Executed sheet, and Edit on a pending instance changes that payment only (relates to 44). The Pending tab lists each standing order's next instance with the "Pending" chip (Rent, Netflix and Internet & Phone are missing there today). The built-in "Next on" dates are stale (01.11.2026 is past): derive them from today or move them into the future. Later, not in this item: "Skip this payment", pausing or deleting a standing order, a "Recent payments" list in the standing order's sheet.

Spec: `specs/2026-11-06-standing-orders/` (branch `feature/standing-orders`), with 53. Settled in its interview: the next instance is derived from the rule each time a list renders, and an edit of it is stored as a one-off pending payment for that date; the rule and a pending instance both get Edit and Copy, no Delete; standard gate. Out of the branch: 44, 45, 37. Found in the build: All bookings lists the same built-in rows for every account while Pay books to Household (56). Built 2026-11-06.

## 52. Booking rows can't be reached with the keyboard (duplicate of 33)

Found during 42 (2026-11-05). A booking row is a plain `div` with a click handler (`js/payment-details.js`, rows built in `js/all-bookings.js` and `js/data-render.js`): no tab stop, no role, no Enter or Space. A keyboard or screen reader user can't open a booking's sheet, so Edit, Delete and Copy are out of reach for them, and after Delete focus has no row to land on (42 announces "Payment deleted." instead). To settle in its spec: rows as buttons or links (and how a row reads: name, chip, amount), focus back on the row after the sheet closes, and after a Delete on the next row.

The same bug as 33, closed on 2026-11-06 and specified there (`specs/2026-11-06-booking-rows-keyboard/`).

## 53. Built-in pending payments are dated in the past (done)

Found during 42 (2026-11-05). On All bookings, Swisscom and Helvetia Insurance read "Execute on 30.10.2026" and Tax office Zurich "03.11.2026", already past and still Pending. Edit opens them in Pay on the next possible day instead. The same staleness as 47's "Next on" dates for Recurring. To settle in its spec: dates derived from today, or moved into the future, for Pending and Recurring together with 47.

Spec: `specs/2026-11-06-standing-orders/` (branch `feature/standing-orders`), with 47. Settled in its interview: Pending one-offs a few working days after today (Swisscom and Helvetia +2, Tax office +6); standing orders keep their day of the month (Rent the 1st, Netflix and Internet & Phone the 5th), the next one after today, a weekend moved to Monday. Built 2026-11-06.

## 54. Forms: an invalid amount shows where the error is (done)

Found 2026-11-05. In Buy, Confirm with an empty or zero amount does nothing: the click handler in `js/trade-flow-overlay.js` returns at `totals.quantity <= 0`, with no message and no focus move. Use the existing form-field error state (`.form-field--error`, `.form-field__error-row` with the alert icon, `aria-invalid`, as in the admin sign-in in `js/admin.js`). Confirm stays enabled; pressing it with an invalid amount marks the Amount field, shows "Enter an amount." and moves focus into it; the error clears once the amount is valid. Sell also checks the amount against the holding ("You hold 51 shares."). To settle in its spec: the same rule in Pay's and the transfer's amount steps, the messages for each case (empty, zero, too much, over the balance), how screen readers hear the error, and "shares" instead of "pcs." in the trade sheet ("In Custody account pcs. 51", `js/trade-flow-overlay.js` and its markup in `details-of-position.html`), left over from 41, which changed only the confirmation. The position page's own "pcs. 5" (`details-of-position.html`) goes with it.

Spec: `specs/2026-11-05-amount-errors/` (branch `feature/amount-errors`). Found while writing it: Pay's amount step has no check (0 goes on and the confirmation shows with nothing recorded), the transfer goes on with its last amount when the field is emptied, Sell accepts more shares than held, and "pcs." is also in the Custody account list and a trade booking's message. Settled in its interview: all four flows; over the balance is an error for what runs now (Pay and the transfer at Execute, back to the amount step); the error shows on leaving a field that was typed into, clears live, and Confirm checks every field; closing never shows one; VoiceOver in the merge gate. Found in the build: the trade sheet opened with 100 shares, invalid at once, so it opens with 1; after Execute finds the amount over the balance, the amount step checks the balance too; the trade's "Available in Household account" line doesn't follow the debit account (55). Built 2026-11-06.

## 55. Buy and Sell: "Available in Household account" doesn't follow the debit account (done)

Found during 54 (2026-11-05). The trade sheet's summary reads "Available in Household account" (`details-of-position.html`, a fixed label) also when Savings account is the debit account; the amount next to it may not match the account either. To settle in its spec: the label and amount from `live.debtorKey` (`js/trade-flow-overlay.js`), updated when the account picker changes it.

Spec: `specs/2026-11-08-trade-sheet-account-and-price/` (branch `feature/trade-sheet-account-and-price`), with 65. Settled in its interview: the label names the chosen account ("Available in Savings account") and follows the picker; the amount already followed it. Built 2026-11-08.

## 56. All bookings: every account lists the same built-in rows, and edits land on Household (done)

Found during 47 (2026-11-06). All bookings shows the same built-in Executed, Pending and Recurring rows for every account (`?account=savings`, the default, and `?account=household`), while Pay always books to Household (`commitPayment` in `js/payment-state.js`). Editing a built-in row on the Savings view hides it there, and the edited payment shows only on Household's view. To settle in its spec: which built-in rows belong to which account, and the debit account an edit keeps.

Spec: `specs/2026-11-06-bookings-per-account/` (branch `feature/bookings-per-account`). Settled in its interview: Pending and Recurring move to Household, so every row you can edit is Household's and Pay stays as it is; Savings keeps its Executed history; Household's Executed shows Today and Yesterday as on Account details; standard gate. Found in the build: the month chips Feb to May go with Savings' rows; a month band after a deleted row's group sat lower than the first. Built 2026-11-06.

## 57. A standing order's next payment on Household reads "from Savings account" (done, in 59)

Found during 33 (2026-11-06). On Household's All bookings, the sheet of a standing order's next payment in Pending (Internet & Phone, seen by keyboard) names "Savings account" as the debit account, although since 56 the standing orders are Household's. Not changed by 33. To settle in its spec: where the instance's sheet takes its debit account (`instanceData` and `buildAllBookingsRowData` in `js/payment-details.js`, `ACCOUNT_SNAPSHOTS`), and the same check for the rule's own sheet in Recurring and for Rent and Netflix.

Taken into 59 (`specs/2026-11-06-savings-standing-orders/`).

## 59. Savings lost its standing orders (done)

Found in Klaudiusz's manual check (2026-11-06), from 56. On Savings' All bookings, Recurring says "No standing orders." and Pending "No pending payments.", while Rent shows in Executed with its "Monthly" chip. Rent and the account's other built-in standing orders must show as rules in Recurring and as next payments in Pending. Revises 56's D3 (Pending and Recurring moved to Household) and D4 (Rent's history on Savings, its rule on Household). To settle in its spec: which standing orders are Savings' and which Household's, where an edit of a Savings rule or its next payment books (Pay books to Household), and the Pending one-offs.

Spec: `specs/2026-11-06-savings-standing-orders/` (branch `feature/savings-standing-orders`), with 57. Settled in its interview: Rent and Internet & Phone back on Savings, Netflix stays Household's; Pay books from the account a row belongs to, so an edit or Copy of a Savings row stays on Savings; 57 fixed here; standard gate. Found in the build: the payment sheet shows no debit account, so 57's "Savings account" was the hidden row's markup text and nothing visible changes; an edit of a rule after its next payment leaves both (68). Built 2026-11-06.

## 60. VoiceOver doesn't announce "Payment deleted." (done)

Found in Klaudiusz's manual check (2026-11-06). After Delete in a booking's sheet, VoiceOver says nothing; the status line "Payment deleted." (42) isn't read. To settle in its spec: why the live region is missed (inserted too late or too early, focus moving at the same moment, the region hidden), and the same check for the other status lines.

Spec: `specs/2026-11-06-deleted-announcement/` (branch `feature/deleted-announcement`). Cause read in the code: the line was set while the confirmation, a modal dialog that makes the rest of the page inert, was still closing, in a region created on the spot. Settled in its interview: the region exists from load and is set only after the dialog has closed and focus has moved; Profile's "Demo data reset." gets the same fix; the gate includes Klaudiusz's VoiceOver check. Found in the build: VoiceOver read the next row taking focus and dropped the live update, so Delete now says it as that row's one-time description (or the tab's, when no row is left); the live region stays for the demo reset. Heard in Chrome, with Reduce motion and in Safari. Built 2026-11-06.

## 61. Household's All bookings shows an empty "Today" group (done)

Found in Klaudiusz's manual check (2026-11-06). Household's Executed tab shows a "Today" header with its balance and no rows. 56's D5 put it there for payments made in the app. To settle in its spec: the group shows only once it has a row, on All bookings and Account details alike.

Spec: `specs/2026-11-06-empty-today-group/` (branch `feature/empty-today-group`). Settled in its interview: any group without a row shown is hidden, on both pages; June's band moves to the first group shown; built before 62; standard gate. Built 2026-11-06.

## 62. Demo data moves with the real date (done)

Klaudiusz, 2026-11-06. Every built-in booking is dated relative to today, so "Today" and "Yesterday" are right whenever the app is opened, and the month chips come from the data (the last months up to now). Household gets several months of bookings again, so scrolling, the month chips and deleting the last row of a month can be checked there. Widens 53 (Pending and Recurring dated from today) to Executed. To settle in its spec: how many months, the balances per day as the dates move, Account details and Overview agreeing, and the demo reset.

Spec: `specs/2026-11-06-demo-data-dates/` (branch `feature/demo-data-dates`), with 69. Settled in its interview: every built-in booking moves into one JS list that both pages draw from, each day's balance worked out from it; calendar days (standing items on their day, the current month and the four before it); a dev-only `?today=` on localhost to check other dates. Found in the build: the old sheet maps' fixed amounts contradicted the rows, so a row's sheet takes its amount from the row (D20); a standing order's next date now picks its first working-day occurrence after today (D19). Built 2026-11-06.

## 63. Month band background: a separator ink at 5% (done)

Klaudiusz, 2026-11-06. The month bands on All bookings (24) use the solid secondary background. They should use a separator-style ink at 5% opacity, as a token with Light and Dark values (and the Multi-color themes). 10% stays for strokes. To settle in its spec: the token's name and place in the pipeline, and the theme engine.

Spec: `specs/2026-11-08-field-anatomy-and-band-ink/` (branch `feature/field-anatomy-and-band-ink`), with 64. Settled in its interview: the token is `--color-separator-subtle`, derived by the theme engine and emitted by the token generator (no Figma import); the band's label stays as it is, its contrast checked in every theme. Found in the build: the label at 70% secondary ink measured 3.73:1 in Multi-color Light, so the band is two layers (`--color-bg` under the 5% ink) and the label is `--color-fg` at `--fs-text-sm` (8.02 to 13.49:1 in Light, 10.56 and 13.40 in Dark); older theme caches get the token through a one-time migration. Built 2026-11-08.

## 64. Form fields keep their height with or without the helper or error row (done)

Klaudiusz, 2026-11-06, a design system rule. In Buy and Sell, Limit grows when its error shows and pushes the order-duration control down. A field reserves its helper or error row whether or not it shows. To settle in its spec: the reserved height, a field with a two-line error, and a pass over every field with an error (Pay, the transfer, Buy and Sell, the admin sign-in).

Spec: `specs/2026-11-08-field-anatomy-and-band-ink/` (branch `feature/field-anatomy-and-band-ink`), with 63. Anatomy from Klaudiusz's Figma: a 24dp label row, 4dp gaps, the control, a 16dp text row that holds the helper or the error. Cause found in the code: the row is `min-height: 1rem` but its text line is taller, so an error grows the field. Settled in its interview: the whole anatomy on every form field (the label row too), a message fits one line, an audit of every field, a Form field specimen on the Components page, the error's markup and ARIA untouched so no VoiceOver gate. Found in the build: every text field is 88dp empty, with a helper and with an error (80dp Small); display-only value rows and account picker cards are not text fields and are left to roadmap 71; Buy's half-width Limit message wraps at Large type on a 390px phone (accepted, D7). Built 2026-11-08.

## 65. Sell: "Available in" and the account picker's label (done)

Klaudiusz, 2026-11-06. In Sell, "Available in <account>" goes, and the account picker reads "Credit account", not "Debit account". Also check: in Buy, "Price" changes to the typed limit (389.22 to 100.00); the market price shouldn't follow it. Relates to 55. To settle in its spec: what Buy shows as Price and as the expected total with a limit, and whether 55 is still needed once Sell drops the line.

Spec: `specs/2026-11-08-trade-sheet-account-and-price/` (branch `feature/trade-sheet-account-and-price`), with 55. Settled in its interview: 55 is still needed, because Buy keeps the line; Price always shows the market price and the total uses the typed limit; Sell's change is the label and the picker title only. Built 2026-11-08.

## 68. Editing a standing order after its next payment leaves two payments (done)

Found during 59 (2026-11-06). Edit a standing order's next payment (stored as a one-off with the rule's id and date, 47 D10), then Edit the rule itself: the edited rule is a new booking that replaces the old one, so Pending lists both the earlier one-off and the new rule's next payment on the same date (seen with Rent on Savings: 1'700 and 1'750 on 01.12). Not from 59; the same on Household. To settle in its spec: whether an edit of the rule carries over or drops an edited next payment, and what the customer is told.

Spec: `specs/2026-11-08-standing-order-edit-exception/` (branch `feature/standing-order-edit-exception`). Settled in its interview: the rule's edit wins and the edited next payment is dropped; Delete of the rule drops it too; the customer is told in the Pay confirmation's note line and in the Delete prompt. Found in the build: the app offers no Delete for a standing order, so the Delete half is in the state only and was tested through its API, with no prompt wording. Built 2026-11-08.

## 69. All bookings: Household's card and the list's last balance disagree (done)

Found in Klaudiusz's check of 61 (2026-11-06). After the demo reset, Household's card on All bookings reads CHF 9'900.00 while the list's newest day (Yesterday) ends at 10'000.00, likely because the pending Apple (-100) is already subtracted from the card. To settle in its spec: whether the card shows the booked or the available balance, and a label when the two differ, the same on Account details and Overview.

Spec: `specs/2026-11-06-demo-data-dates/` (branch `feature/demo-data-dates`), with 62. Settled in its interview: the cards show the booked balance; a pending payment, Apple included, counts nowhere until it executes, so no label is needed. Built 2026-11-06.

## 71. Display-only rows and account pickers against the TextField anatomy (done)

Found during 64's audit (2026-11-08). Two kinds of `.form-field` are not text fields and don't follow the 24 / 4 / control / 4 / 16 anatomy: the display-only underlined value rows (`.form-field__row` without `--bordered`: IBAN, Recipient and Bank Name in Pay's recipient step) are 89dp, or 81dp for a single line, and the account picker cards (`.debit-account`: Debit account, Credit account, from, to, Custody account) are 101dp, with no reserved text row. Neither shows a helper or an error today, so nothing jumps. To settle in its spec: which Figma case each one is (the ReadOnly TextField, the account card), what height they should have, and whether the picker cards should reserve the text row for a future error.

Spec: `specs/2026-11-08-display-rows-and-account-cards/` (branch `feature/display-rows-and-account-cards`). Settled in its interview: the value rows become Figma's ReadOnly TextField (88dp); the cards keep their size and get the anatomy around them, with the 16dp text row reserved. Found in the build: the trade sheet's two account fields are `form-field--no-footer`, so they keep reserving nothing (101dp); Pay's and the transfer's cards are 121dp (24 + 4 + 73 + 4 + 16) and no step scrolls because of it. Built 2026-11-08.

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

## 8. "How much should I invest?": the fridge advisor (8a and 8c done)

The first step of opening an investment product, as in a bank's advisory meeting. A fridge metaphor: the main compartment is money for daily needs, the reserve drawers are reserves for the unplanned and for bigger purchases, and the freezer is what can be invested. Based on a flow Klaudiusz designed with a bank; the reference frames are in `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/261022_fridge-food/scenario`.

Split:

- **8a. The flow** (done): entry from Overview > Offers > "Investment", a 3D fridge in the theme colours with the persona character standing next to it, five beats, sliders as the input, the investable amount as the result. The follow-up that tints the active compartment instead of outlining it is also done (D26, `feature/fridge-compartment-tint`).
- **8b. The avatar acting** (later): the character opens the doors, carries items and cheers.
- **8c. Fridge follow-ups** (done; planned 2026-10-28, a follow-up in `specs/2026-10-22-fridge-advisor/`): a hint that total assets means liquid assets only (not the home, not pillar 3a); total assets prefilled from the account balances the app already knows (the customer can change it). The 3 times salary reserve rule stays as it is (confirmed). Spec: group 9 and D27 to D32 in `specs/2026-10-22-fridge-advisor/` (branch `feature/fridge-follow-ups`); prefill = Household + Savings. The hand-over of the investable amount to 9a moved to the 9a spec (D27): 9a does not exist yet, and how the amount travels depends on 9a's shape.
- **8d. The fridge as a film** (planned 2026-10-29; scheduled after 9a and before 9b). The 3D stage fills the whole sheet, and the step text and sliders sit in a floating panel on top, like the HUD panels in Klaudiusz's cartography app (`~/Documents/GitHub/cartography-lab-app`, `apps/web/src/styles/app.css`: `.hud` and `.hud-stack` place the panels over the map, `.float-panel` draws them): about 20rem wide, frosted glass with the panel background at about 70% opacity, an 8px blur and a soft shadow. The sheet stays 960 wide but takes the opening's fixed height (`.modal-shell--fixed-height`, 9a D26), so the film frame is 960 x 640, and the camera poses are tuned for that frame. The phone gets its own answer, probably the panel as a bottom sheet over the scene. The floating panel becomes a documented design-system component (Components page), not a fridge-only style. To settle in its spec: whether the sheet stays 960 wide, how the panel reads over the scene in Light and Dark and in the colour themes (contrast), and the reduced-transparency fallback.

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

- **9a. The opening flow, plain version.** Starts at "Show suitable products" and replaces the fridge's screen 8 (8a D6). Steps: knowledge, purpose, horizon, the investable amount from the fridge (the hand-over is decided here, not in 8c) with the amount check, the three standard risk questions, the five strategy cards with the recommendation, ESG preference, tax status (Switzerland only, then US), the contract documents, the summary with edit, completion. A progress indicator throughout. Prefilled from the profile and the fridge where possible. The ineligibility screen keeps its "Book an appointment". Spec: `specs/2026-10-29-investment-opening/` (branch `feature/investment-opening`). Settled in its interview: the same sheet loads a new page and narrows from 960 to 640; about ten screens (purpose and horizon, the three risk questions, and the two tax questions each on one screen); summary edits jump to the screen and come back; answers kept for the browser session; completion adds a pending "Asset management" row on Overview. The fridge's screen 8 goes.
- **9b. The assistant, first version.** The helper character and a chat panel opened from a help affordance on the 9a steps, with the scripted chips from the intervention map. Comes before the richer steps because the steps where help matters most (knowledge, US status, documents) are in 9a, and the assistant is the centre of the case study. To settle: panel or bottom sheet, how the helper appears on a phone, the helper's name and tone.
- **9c. Vehicles in the Character kit.** The five vehicle models prepared (GLB, recoloured to the theme like the fridge and the food, sized to the persona) and shown with the persona on the Character kit page first, so the design system shows them before a flow uses them. Includes a credits section listing every CC-BY model (Airplane, Parachute, Tricycle, Motorcycle by Poly by Google; Jetpack by Roman Miller; Vespa by Jasmine Roberts; via Poly Pizza), which must be live before any CC-BY model reaches `main`. The persona sits on or hangs from each vehicle in a matching pose (the kit's sit and jump clips). Copy only the models used into `apps/web/assets/3d/`.
- **9d. Strategy choice with the vehicles.** Replaces 9a's plain strategy cards: the persona travels with each strategy's vehicle, the recommended strategy is marked, risk and expected return stay as visible as in the cards.
- **9e. The risk experience.** Replaces the three standard risk questions: the customer's own amount in the "Why invest?" chart (a good, an expected and a bad year in CHF) and what they would do in each. Feeds exactly the same scoring as the three questions, so the result stays auditable.
- **9f. The assistant, second version.** Hesitation triggers (time on a step against its expected reading time, switching between options, info icons, going back, a field focused and left empty), escalating gently: first a quiet inline chip, at most once per step, remembered when dismissed, never a pop-up. The User Type sets the thresholds. The last step is a handoff to a person (appointment or callback, simulated). Signals stay in the browser.
- **9g. Personalisation** (optional, may be cut): thematic focus, alternative investments, regional focus, as one optional step before the summary.

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

## 14. Booking balance: dropping the oldest booking refunds its money

When the bookings list is full and the oldest booking is dropped, its amount is refunded to the balance. The balance should not change when a booking leaves the list. Found at the end of `specs/2026-10-25-all-bookings-real/`.

## 15. Transfer confirmation copy: "will be executed now"

The transfer confirmation still says the transfer "will be executed now". The copy needs another look. Found at the end of `specs/2026-10-25-all-bookings-real/`.

## 16. Open checks

Checks that were not run on merged branches. Each is a pass to do and record, not a feature:

- **Playground settings dialog** (`specs/2026-10-25-playground-settings-dialog/validation.md`): the recolour cost on a throttled CPU, on a phone, and at a 2x pixel ratio.
- **All bookings** (`specs/2026-10-25-all-bookings-real/validation.md`): reduced motion and a screen reader.

## 17. Retire GitHub Pages (done)

Spec: `specs/2026-10-26-retire-github-pages/` (branch `feature/retire-github-pages`). Vercel becomes the only host: the Pages workflow is deleted, the docs say Vercel, and the build runs on Vercel as a gate (build command `npm run build && rm -rf dist node_modules`, install command default, output `.` still serving `apps/web` as source). Klaudiusz changes the Vercel settings and unpublishes the Pages site after the merge.

## 18. Fund the asset management mandate

Found during 9a (D22, planned 2026-10-29). Completing the opening adds an "Asset management" row on Overview that stays "Pending", because no money moves: the internal transfer only moves money between Household and Savings and has no mandate as a target. This item adds the mandate as a transfer target, so a transfer of the amount (from completion's "Next: transfer CHF … to your custody account", or from the transfer flow) turns "Pending" into a balance that the Accounts & investment total counts. To settle in its spec: whether completion links to the prefilled transfer, what the row shows while the money is invested (the three working days), and whether a mandate can be funded more than once.

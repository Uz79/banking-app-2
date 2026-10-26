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

## 8. "How much should I invest?": the fridge advisor (8a done)

The first step of opening an investment product, as in a bank's advisory meeting. A fridge metaphor: the main compartment is money for daily needs, the reserve drawers are reserves for the unplanned and for bigger purchases, and the freezer is what can be invested. Based on a flow Klaudiusz designed with a bank; the reference frames are in `~/Documents/Projects/AI Portfolio Projects/Banking App/_resources/261022_fridge-food/scenario`.

Split:

- **8a. The flow** (done): entry from Overview > Offers > "Investment", a 3D fridge in the theme colours with the persona character standing next to it, five beats, sliders as the input, the investable amount as the result. The follow-up that tints the active compartment instead of outlining it is also done (D26, `feature/fridge-compartment-tint`).
- **8b. The avatar acting** (later): the character opens the doors, carries items and cheers.

Spec for 8a: `specs/2026-10-22-fridge-advisor/`.

## 9. Investment product opening (later)

What follows "Show suitable products" in item 8: product choice, risk profile, signing. Not started; item 8a ends at that button.

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

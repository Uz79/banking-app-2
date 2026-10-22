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
- **Assets:** KayKit City Builder Bits 1.0 (free) and Forest Nature Pack 1.0 (free), CC0, already downloaded to `~/Documents/Projects/AI Portfolio Projects/Design System/_resources/`. Copy only the models used into `apps/web/assets/3d/`.
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

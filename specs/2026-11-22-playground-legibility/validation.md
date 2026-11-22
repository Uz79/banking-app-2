# Legibility reaches the Playground (58): validation

## Build

- [x] `npm run build` in `apps/web` succeeds

## Legibility applies

- [x] Large: the Playground's text and spacing grow; Small: they shrink; Regular matches the page before this change
- [ ] Typeface and Font choices from Profile apply
- [ ] A setting made in Profile is still there when the Playground opens (nothing resets it)

## Nothing breaks (D3)

- [ ] Start screen, game HUD, touch buttons, settings dialog, end screens at Small and Large: no clipped or overlapping text
- [ ] 390px at Small, Regular and Large
- [ ] Light and Dark; one Multi-color theme

## Across

- [ ] Admin guard: signed out, the Playground still redirects
- [ ] Keyboard: focus rings visible, dialogs still trap and return focus
- [ ] Reduced motion
- [ ] First visit (nothing in `localStorage`): Regular, as before

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on 2026-11-22 against feature/playground-legibility, Chrome, a 717px-wide window (the 390px resize did not take effect), Dark. Checked: build; the HUD, overlay and button text measured 14.4, 16 and 18.56px at Small, Regular and Large; no overflow in the overlay or HUD at any size; the settings dialog at Large (screenshot) and Small fits with nothing clipped. Not checked: 390px, desktop width, the game during play and the end screens, Light, Multi-color, Typeface and Font choices, keyboard, reduced motion, admin redirect when signed out, first visit, the baseline smoke test beyond the build. The page title stays 32px at every size.

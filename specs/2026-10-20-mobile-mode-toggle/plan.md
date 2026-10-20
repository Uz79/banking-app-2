# Mobile Light/Dark toggle: plan

Branch: `feature/mobile-mode-toggle`. Each group ends with something to see in the browser at 390px (`cd apps/web && npm run dev`).

## 1. The button on Overview

What you see: on Overview at 390px, a sun or moon button in the top left of the bar; tapping it switches Light and Dark; at desktop width it is gone.

- [x] `overview.html`: replace the hidden leading placeholder with the toggle button (`uz-btn uz-btn--sm uz-btn--icon-only`, two icons, `aria-label`)
- [x] `css/styles.css`: position the button in the bar's leading slot; show only the icon for `html[data-theme]`; hide the button at 1280px and up (D2, D4)
- [x] `js/mode-toggle.js` (new): click calls `UZBankApplyThemeChoice`; keeps the accessible name current (D5, D6); load it on the page
- [x] Checked in the browser at 390px (a 390px iframe on a scratch server, port 5177): both modes, the title stays centred, 32 x 32 dp with a 24 dp icon, hidden at 1400px. Not yet looked at: a Multi-color theme, keyboard, a real phone

## 2. The other three main screens

What you see: the same button on Payments, Profile and Design system (signed in as admin), and the icon follows a change made in Profile > Theme.

- [x] `payments.html`, `profile.html`, `design-system.html`: same markup and script
- [x] Checked at 390px (iframes on a scratch server): all four screens show the 32 x 32 dp button with the title centred, and the icon and name follow a switch made through `UZBankApplyThemeChoice` (as the sidebar and Profile > Theme do). Not looked at: reload on each page, a real phone
- [x] D9: no hover fill left after a tap on touch (the CSS rule is in place; the touch behaviour itself needs a phone to see)

## 3. Wrap-up

- [x] `npm run build` in `apps/web` succeeds
- [~] Work through `validation.md` in a real browser and fill in its "Checked on" line (the items that need a phone or a pass of the baseline are listed in the file as not checked)
- [~] Run the baseline smoke test (final section of `validation.md`) (only the parts this change could touch were run; the rest is listed in the file)
- [x] `specs/roadmap.md`: mark item 4 done
- [x] `specs/tech-spec.md`: a line under "Other systems" for the toggle and `js/mode-toggle.js`
- [x] `apps/web/README.md`: list `js/mode-toggle.js` in the source layout
- [x] `/changelog`, tidy, commit on the branch; merge to `main` only on an explicit ask

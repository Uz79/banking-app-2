# Native text trim (86): plan

Branch: `feature/native-text-trim`. Decisions are cited as D1 to D13 from `requirements.md`.

Each group ends with something to look at in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`), at 390px (a same-origin iframe if a window resize does not take effect, said so) and 1024px, Light and Dark. Every group runs the size check (D6) on what it retuned and records the moves in `targets.md` (D11).

## 1. Support, targets and the measuring script (D3, D6, D7)

What you see: the script's table for one component, before any change.

- [ ] Support check: `text-box` in Chrome, Safari, Firefox (versions), recorded in `specs/tech-spec.md`'s new Decisions row (D13)
- [ ] `specs/2026-11-23-native-text-trim/targets.md`: Figma values per component (Status Message, Date Picker, Scale Preset Card first), read from the Figma frames or the Design System 1.0 table
- [ ] `scripts/measure-text-offsets.js`: for each `[selector of edge, selector of text]`, cap top and baseline distance in px, and the difference from `targets.md`
- [ ] Check: the script reproduces the known differences (Status Message title about 5.1px low, body about 7.2px, Date Picker about 8px, Scale Preset Card 16 plus trim against 24)

## 2. The type classes (D2, D8)

What you see: every type class trimmed; the app should look almost unchanged where `.type-trim` was already used.

- [ ] `css/typography.css` (and the template in `scripts/generate-tokens-css.mjs`): `text-box: trim-both cap alphabetic` on `.type-hero` to `.type-caption`; `.type-trim` kept as an empty alias
- [ ] Check: Overview and the opening before and after, no visible shift where `.type-trim` was on; one page in every Typeface

## 3. Status Message, Date Picker, Scale Preset Card (D5, D7)

What you see: the three components at the Figma offsets.

- [ ] `css/styles.css`: their padding and gaps to the Figma values; markup in `partials/` and `js/` if a wrapper is needed
- [ ] Check: the size check shows zero differences above 1px for each

## 4. Overview (D5, D7, D10)
- [ ] CSS and markup of Overview's cards, list items and tiles (`overview.html`, `partials/`, `css/styles.css`): compensation out, clean values in
- [ ] Check: size check on each component; Large legibility

## 5. Payments
- [ ] `payments.html` and its cards, as they are today (item 87 rewrites them later)
- [ ] Check: size check, 390 and 1024

## 6. Accounts
- [ ] `account-details.html`, `partials/account-information-*.html`, `partials/list-item-group-account.html`, the carousel
- [ ] Check: size check, 390 and 1024, the account carousel

## 7. Bookings
- [ ] `all-bookings-and-payments.html`, the booking rows, month bands, the booking sheet, `js/data-render.js`
- [ ] Check: size check, Large legibility, the booking sheet and the Edit and Copy flows

## 8. Profile
- [ ] `profile.html` panels (User Type, Legibility, Theme), `js/theme-panel.js`
- [ ] Check: size check; all three panels; a Multi-color theme

## 9. The fridge, the opening and the assistant
- [ ] `fridge-advisor.html`, `investment-opening.html` and the assistant column (`js/investment-opening*.js`, `js/opening-assistant*.js`, `js/investment-positions.js`): the floating panel, step texts, option cards, the chips
- [ ] Check: size check on the panel, option cards and chips; the fixed-height sheet still fits every step (no scrolling on desktop)

## 10. Modals, dialogs and carousels (D9)
- [ ] Every modal, confirm dialog, sheet and carousel: the payment and transfer flows, the booking sheet, "Leave for now?", the strategy carousel, the account carousel
- [ ] Check: each opened and recorded in `validation.md`; any case left on the old model is brought to Klaudiusz

## 11. Cleanup (D4)
- [ ] Remove `.type-trim` from markup, partials, `js/`, stories and CSS; remove the `--trim-*`, `--text-trim-*` and `--text-row-gap` from `scripts/generate-tokens-css.mjs` and regenerate `css/tokens.css` and `css/typography.css`
- [ ] Check: `grep` finds no reader of the removed tokens; `npm run tokens:build` and `npm run build` pass; Storybook builds

## 12. Wrap-up
- [ ] `npm run build` in `apps/web`
- [ ] `validation.md`: the feature's checks, then the baseline smoke test; fill the "Checked on" line
- [ ] Docs: roadmap 86 to Done, `CHANGELOG.md` under Unreleased, `specs/tech-spec.md` (the Decisions row, the type-system description), `apps/web/README.md` only if a script is listed there

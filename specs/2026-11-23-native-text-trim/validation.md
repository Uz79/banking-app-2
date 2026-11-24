# Native text trim (86): validation

## Build

- [x] `npm run build` in `apps/web` succeeds (it runs `tokens:build`)
- [x] `npm run tokens:build` leaves no `--trim-*`, `--text-trim-*` or `--text-row-gap` in `css/tokens.css` and `css/typography.css`
- [x] No reader of the removed tokens or of `.type-trim` remains (`grep` over `css`, `js`, `partials`, `*.html`, `src/stories`)
- [ ] Storybook builds

## The size check (D6, D7)

- [x] The script reproduces the known differences before the change (Status Message title and body, Date Picker, Scale Preset Card)
- [ ] Zero differences above 1px for Status Message, Date Picker and Scale Preset Card at 390px and 1024px, Light and Dark
- [ ] Zero differences above 1px for every component retuned in groups 4 to 9, recorded in `targets.md`

## Pages and flows (each at 390px and 1024px, Light and Dark)

- [x] Overview: cards, list items, tiles, the Offers list
- [x] Payments: the three cards
- [x] Accounts: account details, the information overlay, the account carousel
- [x] Bookings: rows, month bands, the booking sheet, Edit and Copy
- [ ] Profile: User Type, Legibility, Theme
- [ ] The fridge: the floating panel and every step
- [ ] The opening: every screen fits the fixed-height sheet on desktop with no scrolling; the summary; the personalise screen
- [ ] The assistant: the column, the chips, the nudge bubble, the phone's Help? sheet

## Modals, dialogs, carousels (D9)

- [ ] Pay and the transfer: every step, the confirmation
- [ ] The booking sheet and "Delete" and "Leave for now?" dialogs
- [x] The strategy carousel and the account carousel: snap, peek, arrows
- [ ] Each case listed with its result; none left on the old model without Klaudiusz's say

## Typefaces and legibility (D8, D10)

- [x] One page in every Typeface and Font choice: text sits at cap top and baseline offsets within 1px of the Profile Pro result
- [ ] Large legibility on Overview, All bookings and the opening
- [ ] A Multi-color theme on one page per group

## Browsers (D3)

- [ ] Chrome and Safari trimmed as described
- [ ] Firefox: the page still works and reads; the text sits a few px lower (accepted)

## Keyboard and motion

- [ ] Focus rings are not clipped by the trimmed boxes (they sit on the box edge)
- [ ] No animation changed; reduced motion as before

## Baseline smoke test

(Copied from `specs/baseline/validation.md` when the checks are run.)

- [ ] Sections 1 to 6 of `specs/baseline/validation.md`

Checked on 2026-11-23 against `feature/native-text-trim`, Chrome 157 on port 5199, desktop at about 1100 to 1568px wide and 390px as same-origin iframes (not a window resize). `npm run build` passes and `tokens:build` leaves no `--trim-*` or `--text-trim-*`. Measured by script (`scripts/measure-text-offsets.js`, `targets.md`): Status Message title and body, Scale Preset Card and the Date Picker's weekday row hit their clean values within 1px; the list and product rows are 56px (were 67.6); the same row in the six typefaces keeps its 16px insets (heights 56 to 58.9 because the cap heights differ). Looked at in screenshots (Dark, default green theme): Overview, Payments, Account details with the carousel, All bookings, the Pay recipient search and Recipient steps, the opening's strategy carousel, and Overview and Profile at 390px. A scripted overlap check over five pages at 1100 and 390 found no colliding text. The opening's screens fit as before (the risk screen scrolls 40px on the standalone page, the same as on `main`).

Not checked: the Figma frames themselves (the targets are the components' own clean values, not read from Figma); Light mode and a Multi-color theme by eye; Large legibility; the Pay and transfer steps after Recipient, the booking sheet and its dialogs, "Leave for now?", the fridge, the assistant column and the nudge bubble, and the Profile panels, none looked at after the change; Safari and Firefox (Firefox has no `text-box`: the check is by the code, D3); keyboard focus rings; reduced motion; the baseline smoke test; Storybook; the admin design system pages. Components that set `font-size` directly are untrimmed (roadmap 92).

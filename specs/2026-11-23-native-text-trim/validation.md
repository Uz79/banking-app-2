# Native text trim (86): validation

## Build

- [ ] `npm run build` in `apps/web` succeeds (it runs `tokens:build`)
- [ ] `npm run tokens:build` leaves no `--trim-*`, `--text-trim-*` or `--text-row-gap` in `css/tokens.css` and `css/typography.css`
- [ ] No reader of the removed tokens or of `.type-trim` remains (`grep` over `css`, `js`, `partials`, `*.html`, `src/stories`)
- [ ] Storybook builds

## The size check (D6, D7)

- [ ] The script reproduces the known differences before the change (Status Message title and body, Date Picker, Scale Preset Card)
- [ ] Zero differences above 1px for Status Message, Date Picker and Scale Preset Card at 390px and 1024px, Light and Dark
- [ ] Zero differences above 1px for every component retuned in groups 4 to 9, recorded in `targets.md`

## Pages and flows (each at 390px and 1024px, Light and Dark)

- [ ] Overview: cards, list items, tiles, the Offers list
- [ ] Payments: the three cards
- [ ] Accounts: account details, the information overlay, the account carousel
- [ ] Bookings: rows, month bands, the booking sheet, Edit and Copy
- [ ] Profile: User Type, Legibility, Theme
- [ ] The fridge: the floating panel and every step
- [ ] The opening: every screen fits the fixed-height sheet on desktop with no scrolling; the summary; the personalise screen
- [ ] The assistant: the column, the chips, the nudge bubble, the phone's Help? sheet

## Modals, dialogs, carousels (D9)

- [ ] Pay and the transfer: every step, the confirmation
- [ ] The booking sheet and "Delete" and "Leave for now?" dialogs
- [ ] The strategy carousel and the account carousel: snap, peek, arrows
- [ ] Each case listed with its result; none left on the old model without Klaudiusz's say

## Typefaces and legibility (D8, D10)

- [ ] One page in every Typeface and Font choice: text sits at cap top and baseline offsets within 1px of the Profile Pro result
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

Checked on: not yet checked.

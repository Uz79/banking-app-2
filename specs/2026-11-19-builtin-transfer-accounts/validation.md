# Built-in transfers name both accounts (50): validation

## Build

- [x] `npm run build` in `apps/web` succeeds

## Rows (D1, D2)

- [x] Household's All bookings: open `Pizza`; reads Savings account to Household (it read "Private account" before D6)
- [x] Savings' All bookings: open "Transfer to Household" (320, yesterday), "Transfer to Household" (500, two months ago) and the monthly 1'500; each reads from Savings to Household
- [ ] No built-in transfer reads the same account on both sides, on Household, Savings and Custody
- [x] Household's "Transfer from Savings" (1'500) still reads from Savings to Household

## One name (D3, D5)

- [ ] The transfer sheet's "from" shows "Savings account" from Overview, Payments and Account details
- [ ] The trade flow shows "Savings account"
- [ ] A transfer made in the session (Savings to Household) lists and opens with both names right
- [x] No "Savings Account" is left in `apps/web` outside storybook output (grep)

## Across

- [ ] Light and Dark, one Multi-color theme, 390px and desktop width, keyboard (open and close a row's sheet), reduced motion (unchanged)
- [ ] Legibility Large: the longer-name rows still fit

## Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when running it.

Checked on 2026-11-19 against `feature/builtin-transfer-accounts`, Chrome, dev server on 5199, desktop width. Run: the build; every built-in transfer row's sheet on Savings (6 rows, all Savings account to Household) and on Household (Pizza and the four "Transfer from Savings"); grep for the old spelling (none left outside Storybook sources). Not checked: the transfer sheet and trade flow showing the new spelling by eye, Custody rows, a transfer made in the session, Light and Dark, a Multi-color theme, 390px, keyboard, reduced motion, Legibility Large, the baseline smoke test beyond the build.

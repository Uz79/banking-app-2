# Display-only rows and account cards against the field anatomy (71): plan

Branch: `feature/display-rows-and-account-cards`. Decisions are cited as D1 to D7 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The display-only rows (D1, D2)

- [ ] `apps/web/css/styles.css`: a non-readonly, non-bordered, non-multiline `.form-field__row` is 40dp with its underline inside and no bottom padding, its content centred
- [ ] Check: Pay's recipient step and the transfer's: IBAN, Bank Name and the other value rows measure 88dp (one line and a wrapped value); the edit button is not cropped; Account information and Share information are unchanged

## 2. The account cards (D3, D4)

- [ ] `apps/web/css/styles.css`: the `::after` spacer rule no longer excludes `:has(.debit-account)`; fields marked `--no-footer` stay as they are
- [ ] Check: every card (Pay's Debit account, the transfer's From and To, the trade sheet's accounts) is label 24, gap 4, the card, gap 4, a 16dp reserved row; the next control sits 20dp lower; Pay, the transfer, Buy and Sell still show their action without a new scroll (measure each)

## 3. The specimen (D6)

- [ ] `apps/web/components.html`: the Form field section shows the display-only row and the account card with their marks
- [ ] Check: the specimen in Light and Dark, desktop and 390px

## 4. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] Every item of `validation.md`, then the baseline smoke test (copied into it)
- [ ] `specs/roadmap.md`: 71 marked done, with what was settled and found
- [ ] `specs/tech-spec.md`: the "Field errors" row's anatomy sentence gains the two cases
- [ ] `CHANGELOG.md` under `Unreleased` (run `/changelog` and tidy)
- [ ] `apps/web/README.md`: no change expected; check

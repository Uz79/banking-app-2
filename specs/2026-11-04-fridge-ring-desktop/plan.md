# Fridge result: the amount fits its ring on desktop (26): plan

Branch: `feature/fridge-ring-desktop`. Decisions are cited as D1 to D6 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The amount on one line (D1 to D4)

- [ ] `apps/web/css/styles.css`: from 640px the ring is a size container and the amount is on one line at `min(--fs-h4, <k>cqw / --ring-chars)`; `k` measured so CHF 500'000 and CHF 999'999 clear the inner circle by 4 px or more (D2)
- [ ] `specs/roadmap.md`: the Legibility item (D5), as its own commit, with a pointer in `requirements.md`'s out-of-scope list
- [ ] Check: in the Overview sheet at desktop width, CHF 0, a five-digit amount and CHF 280'000 (sliders at maximum) each sit on one line inside the ring below "You could invest"; the phone (390) is unchanged

## 2. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [ ] Docs: `specs/roadmap.md` 26 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` unchanged (no system changed); `apps/web/README.md` unchanged (no new key or file)

# Every exit prompt names its own task (30): plan

Branch: `feature/exit-prompt-labels`. Decisions are cited as D1 to D7 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The labels and the neutral default (D1 to D4)

- [x] `apps/web/js/payment-exit-confirm.js`: neutral defaults in the markup and in `prompt()` (D2)
- [x] `apps/web/js/payment-overlay.js`: `promptExitFlow` passes Pay's own words for a new payment (D3) and "Continue editing" for an edit (D1)
- [x] `apps/web/js/iat-overlay.js`: "Continue transfer" (D1)
- [x] `apps/web/js/trade-flow-overlay.js`: "Continue order" (D1)
- [x] Check: every prompt opened once shows its own title and buttons; the stay button keeps the flow open, Discard closes it

## 2. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 30 marked done; `CHANGELOG.md` under `Unreleased`. No change to `specs/tech-spec.md` or `apps/web/README.md` (no new page, file or key)

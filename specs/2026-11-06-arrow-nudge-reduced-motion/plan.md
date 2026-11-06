# Arrow nudge with reduced motion (36): plan

Branch: `feature/arrow-nudge-reduced-motion`. Decisions are cited as D1 to D7 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && ./node_modules/.bin/vite --port 5199 --strictPort --no-open`).

## 1. The nudge loops only without reduced motion (D1 to D3, D5, D6)

- [x] `apps/web/css/styles.css`, Arrow nudge block: the forward and back rules inside `@media (prefers-reduced-motion: no-preference)`; `:disabled` and `[aria-disabled="true"]` in their `:not(…)`; the old reduce rule and the separate disabled rule removed; the block's comment updated
- [x] Check: (done with the real setting in group 2, as Chrome can't emulate it from the page) no arrow on Overview, Account details or a flow step has an animation; without it, they nudge as before and pause on hover

## 2. The check with the real setting (D4, D5)

- [x] Every page with a forward or back arrow, and Pay's, the transfer's and Buy's proceed button (arrow and pulse), with macOS Reduce motion on, then off
- [x] Motion specimens No. 009 with the setting on and off
- [x] Anything else seen moving goes onto the roadmap (nothing found)

## 3. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`), the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 36 done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md` if the motion section names the Arrow nudge's reduced-motion rule

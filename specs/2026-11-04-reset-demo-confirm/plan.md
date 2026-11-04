# Profile: "Reset demo data" asks first and confirms without disabling (22): plan

Branch: `feature/reset-demo-confirm`. Decisions are cited as D1 to D9 from `requirements.md`.

Each group ends with something to check in the browser on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`).

## 1. Ask first, confirm with a status line (D1 to D8)

- [x] `apps/web/profile.html`: load `js/dialog-focus.js` and `js/payment-exit-confirm.js` in Overview's order (D7); the new subtitle (D6); an empty `<p class="demo-reset__status" role="status">` under the button (D3)
- [x] `apps/web/js/app-mp.js`: the handler opens the prompt with D1's copy and `escapeStays: true` (D2); on "Reset" it runs `UZBankPayState.reset()` and fills the status line, emptying it first (D4); no label swap, no `disabled`, no timer (D5)
- [x] `apps/web/css/styles.css`: `.demo-reset__status` and its icon, tokens only (D8)
- [x] Check: Profile, "Reset demo data" opens "Reset demo data?"; Cancel and Escape keep a test booking; Reset clears it, shows "Demo data reset." and leaves the button enabled; focus returns to the button

## 2. Wrap-up

- [x] `npm run build` in `apps/web`
- [x] The validation pass (`validation.md`) with the baseline smoke test and the dated "Checked on" line
- [x] Docs: `specs/roadmap.md` 22 marked done; `CHANGELOG.md` under `Unreleased`; `specs/tech-spec.md`'s "Call-to-action buttons" row no longer lists Profile's reset as open; `apps/web/README.md` unchanged (no new key or file)

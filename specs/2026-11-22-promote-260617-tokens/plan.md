# Promote the 260617 token export (73): plan

Branch: `feature/promote-260617-tokens`. Decisions cited from `requirements.md`. Each group ends with something to check; the dev server is the agent's (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done).

## 1. The promote learns the export (D2, D3, D4)

- [x] `scripts/token-lib.mjs`, `scripts/promote-tokens.mjs`: accept the Figma folder layout, convert 8-digit hex to rgba, carry forward what the generator reads and the export drops; `required-manifest.json` updated
- [x] Check: `npm run tokens:validate -- 260617_tokens/tokens` passes; a dry diff lists only real changes

## 2. Promote (D1, D5, D7, D8)

- [x] Run the promote on the branch; restore `alias.space.*` and `section.padding.main` to their live values (D1, D5); drop the chip copy if the export carries it (D7)
- [x] `token-diff.md` in this folder: every added, removed and changed token and every `css/tokens.css` variable that changes
- [x] Check: `npm run tokens:build` runs; only the foreground tokens change existing variables

## 3. Emit the new groups (D6)

- [x] `scripts/generate-tokens-css.mjs`: emit every component group in the chip pattern; no stylesheet reads them
- [x] Check: `tokens.css` carries the new variables; a grep shows no use in `css/styles.css`

## 4. Look (D9)

- [x] `npm run audit:contrast` over all themes; before and after screenshots of Overview, All bookings, Pay, Profile (Light, Dark, a Multi-color theme; desktop, 390px iframe)

## 5. Wrap-up

- [x] `npm run build`; `validation.md`; baseline smoke test
- [x] `specs/roadmap.md` (73 to Done, in number order), `CHANGELOG.md`, `specs/tech-spec.md` (chip token row, token paragraph), `designs/tokens/README.md` (promote steps)

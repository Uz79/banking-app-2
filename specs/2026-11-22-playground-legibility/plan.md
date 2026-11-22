# Legibility reaches the Playground (58): plan

Branch: `feature/playground-legibility`. Decisions are cited as D1 to D5 from `requirements.md`. Browser checks run on the agent's server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`, stopped when done); the Playground needs the admin sign-in.

## 1. Load Legibility (D1, D4)

- [ ] `playground.html`: `<script src="js/appearance.js"></script>` before the `playground.js` module
- [ ] Check: with Large set in Profile, the Playground's text and spacing change; with Regular they match today

## 2. Fix what breaks (D2, D3, D5)

- [ ] Look at every Playground screen (start, game HUD and touch buttons, settings dialog, end/trophy screens) at Small and Large, desktop and 390px
- [ ] `css/styles.css` (or the page's own styles): narrow, Playground-scoped fixes for clipping, overflow or overlap found
- [ ] Check: no clipped or overlapping text at Small and Large on both widths

## 3. Wrap-up

- [ ] `npm run build` in `apps/web` succeeds
- [ ] `validation.md`, then the baseline smoke test
- [ ] `specs/roadmap.md` (58 to Done, in number order), `CHANGELOG.md` under `Unreleased`, `specs/tech-spec.md` (Legibility line)

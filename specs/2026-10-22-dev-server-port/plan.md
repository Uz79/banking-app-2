# Dev server port and network access: plan

Branch: `feature/dev-server-port`. Decisions are cited as D1 to D6 from `requirements.md`.

On the feature branch each group is committed on its own once implementation is approved. Nothing is merged to `main` without an explicit ask. Checks use my own port 5199 for the localhost part, never the user's 5175 server.

## 1. Vite config

What you see: `npm run dev` opens Overview on port 5175; if something already holds 5175 it stops with an error and does not pick another port.

- [x] `apps/web/vite.config.js`: `port: 5175`, `strictPort: true`, `host: true`, `allowedHosts: ['.local']`, `open` unchanged (D1, D2, D3)

## 2. Docs and the other mentions

What you see: no `5174` port left in the docs, and the two-port rule in `AGENTS.md`.

- [x] Replace the port in `AGENTS.md`, `specs/tech-spec.md`, `specs/baseline/validation.md`, and the `plan.md` and `validation.md` of `2026-10-19-payday-run`, `2026-10-20-mobile-mode-toggle` and `2026-10-22-playground-sound` (D6); `apps/web/README.md` has no mention; confirm with a search that nothing but the SVG path data in `designs/` still contains `5174`
- [x] `AGENTS.md` Checking work: the 5175 and 5199 line (D4)
- [x] `specs/tech-spec.md`: the dev server Decisions row (D5)

## 3. Wrap-up

- [x] `npm run build` in `apps/web` succeeds
- [ ] Run `validation.md`, including the baseline smoke test copied there; fill in the "Checked on" line (the agent's part is done; the rest is for Klaudiusz)
- [x] `CHANGELOG.md` under `Unreleased` (Changed: the dev server on 5175, network access, the AGENTS.md rule); run `/changelog` when closing the branch

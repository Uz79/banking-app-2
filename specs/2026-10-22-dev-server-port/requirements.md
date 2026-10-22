# Dev server port and network access: requirements

Branch: `feature/dev-server-port`

Dev tooling only, not on the roadmap (requested directly on 2026-10-22). No change to the app, its pages or its storage.

## Scope

**In:**

1. `apps/web/vite.config.js`: the dev server on port 5175 with `strictPort`, listening on the network (`host: true`), accepting the `.local` host name so a phone on the same Wi-Fi can open `http://klaudiuszs-macbook-pro.local:5175/overview.html`
2. Every mention of port 5174 in `AGENTS.md`, `specs/` and `apps/web/README.md` becomes 5175 (today: `AGENTS.md`, `specs/tech-spec.md`, `specs/baseline/validation.md`, and the `plan.md` and `validation.md` of the three dated specs; the README has none)
3. A line in `AGENTS.md` under "Checking work" about the two ports (D4)
4. A Decisions row in `specs/tech-spec.md` for the dev server setup (D5)

**Out:**

- Any change to the build, the deploy workflow or `npm run dev`'s other steps (`tokens:build`)
- HTTPS, a tunnel or access from outside the local network
- The `/api/yahoo` proxy (unchanged)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | `server.port: 5175` with `strictPort: true` stays on. If 5175 is taken, `npm run dev` stops with Vite's "Port 5175 is already in use" error instead of starting on another port | Interview brief: no silent move to another port, so the URL in the docs is always the right one |
| D2 | `server.host: true` (listen on all interfaces) and `server.allowedHosts: ['.local']` (any `*.local` name, so the Mac's Bonjour name works without hard-coding it). The Mac's name is `Klaudiuszs-MacBook-Pro`, so the phone URL is `http://klaudiuszs-macbook-pro.local:5175/overview.html` | Brief. A leading dot allows the domain and its subdomains. Vite blocks unknown Host headers by default, so without `allowedHosts` the phone gets "Blocked request". The dev server is then reachable by anyone on the same network while it runs; acceptable for a local prototype, noted in the Decisions row |
| D3 | `open: '/overview.html'` stays, so `npm run dev` still opens Overview on the Mac. The agent's own runs pass `--no-open` | Interview. No change to the existing habit |
| D4 | `AGENTS.md`, Checking work, gets: "My dev server runs on 5175. For your own browser checks use port 5199 (`npx vite --port 5199 --strictPort --no-open`) and stop it when done." The agent never starts or stops anything on 5175 | Brief, with `--no-open` added per D3. Keeps the user's server and the agent's checks from colliding. `--port` on the command line overrides the config's port; `strictPort` stays in force |
| D5 | `tech-spec.md` Decisions row: "Dev server: port 5175, strict, listening on the network, `.local` hosts allowed. A phone on the same Wi-Fi opens it through the Mac's `.local` name. Agents use 5199 for their own checks." | Brief. The Decisions table is where choices that would otherwise be re-argued are recorded |
| D6 | Past specs are edited too: the port in the setup lines of earlier `plan.md`, `validation.md` and `specs/baseline/validation.md` changes to 5175, including already-ticked records (only the URL in the setup text, not the "Checked on" lines' content). Their "Checked on" lines that say `npm run dev on port 5175` already refer to my own 5175 runs and stay as they are | Brief: "every mention". The setup lines are instructions for the next person, so they should work today. A note in the commit message says history was touched on purpose |

## Context

- `apps/web/vite.config.js` lines 13 to 15 today: `port: 5174`, `strictPort: true`, `open: '/overview.html'`. The `/api/yahoo` proxy follows.
- `npm run dev` is `npm run tokens:build && vite` (`apps/web/package.json`).
- Other hits for `5174` in the repo are path data inside SVG files (`designs/`), not ports, and are left alone. `node_modules`, `dist`, `storybook-static` and `package-lock.json` are not touched.
- The agent's Chrome extension can reach the Mac's `localhost` ports, so checks on 5199 work as before.

## Open questions

- Whether macOS asks to allow incoming connections the first time Node listens on all interfaces (the firewall prompt); if so, allow it once.
- Whether the phone resolves `.local` (iOS does, Android's browsers often do not): if not, the Mac's IP address works, and Vite prints it as the "Network" URL.

# AGENTS.md

Instructions for any AI agent (Claude, Codex, Junie, or other) working in this repository.

## What this project is

UZ Bank, an AI-assisted e-banking UX prototype: a presentable simulation of a banking app that doubles as the live showcase of Klaudiusz's design system (tokens, components, motion, colour themes, the 3D character kit). The web app in `apps/web` is the product. Full context lives in `specs/`:

- `specs/mission.md`: why this exists, who it's for, principles, non-goals
- `specs/tech-spec.md`: stack, page structure, the theme engine, the character kit, storage keys, the Decisions table
- `specs/roadmap.md`: what is next, in order

Read all three before making non-trivial changes. If a change doesn't fit what they describe, flag the mismatch rather than silently deviating: either the specs need updating or the change needs rethinking.

## Protect the presentable state

The app is shown to people as it is. `main` deploys to GitHub Pages on every push (`.github/workflows/deploy.yml`), so anything merged is live.

- Never work on `main` directly. Every change happens on a feature branch and reaches `main` only after its `validation.md` is done, including the baseline smoke test (`specs/baseline/validation.md`).
- The tag `v1-presentable` marks the state before the spec-driven process began. It is the fallback if something goes badly wrong.
- Don't refactor, rename, reformat or "clean up" code a spec doesn't ask for. Small, contained diffs.

## Conventions

These are the app's unwritten rules, written down. Most bugs in this repo came from missing one of them.

- **Stack:** a vanilla multi-page app built with Vite (`apps/web`). Classic `<script>` files plus a few ES modules; no framework, no TypeScript, no test runner. Don't introduce any of these without a spec that records why.
- **Colours:** only through the `--color-*` tokens. Never hand-roll a colour. Interactive and selected states use `--color-fg-interactive` (focus rings, selected states, sliders); it defaults to `--color-fg`.
- **Generated files:** `css/tokens.css` and `css/typography.css` are generated (`npm run tokens:build`), `js/theme-engine.js` is built from `scripts/theme-engine/` (see its README), and the icon sprite is built by `scripts/sync_icons_sprite.py`. Edit the source, never the output.
- **The boot script:** every shell page has the same inline boot script in `<head>` (template: `scripts/boot-inline-theme.html`). It applies Light/Dark and the cached colour tokens before paint. Keep the copies identical.
- **A new page** must be registered in five places: `vite.config.js` (build input), `NAV_DEPTH` in `js/section-build-boot.js` and in `js/shell-nav.js`, `ROOT_TAB_BY_SCREEN` in `js/shell-nav.js` (design-system pages map to `'design'`), the screen list in `bindMainScrollChrome` (`js/app-mp.js`; skip it for a full-screen page with no `[data-scroll-edge-nav]` header, which it would not wire), and the `.body[data-screen="…"]` layout rules in `css/styles.css` (copy the rules of the closest existing page). Design system pages are admin-only: `js/admin-boot.js` with `data-guard`.
- **The 3D character on a page** needs three things: the two scripts (`js/profile-persona.js`, `js/profile-persona-character.js`), the page's `data-screen` in `AMBIENT_SCREENS`, and `isolation: isolate` on `.main-content` for that screen. Without the last one the figure renders behind the page background and is invisible. See `character-kit.html`.
- **Copy:** no em dashes in user-facing text. English, short, plain.
- **Accessibility and motion:** every animation has a `prefers-reduced-motion` path. Keyboard focus stays visible (`--color-fg-interactive` outline).
- **Shared rules, narrow selectors:** app-wide CSS rules (like the arrow nudge) must target exactly the element they are for. A broad selector once animated every icon in a link.
- **localStorage keys** start with `uzBankWeb` and are listed in `apps/web/README.md`. Add new keys there.

## Workflow

- Every change to the product goes through the spec-driven workflow. There is no lighter path for small or visual-only changes: technically, every change is a feature. No implementation starts without a dated `specs/<YYYY-MM-DD>-<kebab-case-name>/` folder, created via `/feature-spec`, holding `requirements.md`, `plan.md` and `validation.md`. Date the folder to when the work starts. (`specs/baseline/` predates this rule and is undated.)
- If the work is a small follow-up to the latest dated spec folder, add a task group and new decisions to that folder instead of starting a new one. `/feature-spec` checks this.
- Exempt from the spec requirement: edits to `AGENTS.md`, to files under `specs/` that only describe (mission, tech-spec, roadmap), and to files under `.claude/skills/`. They are edited directly and reviewed as a diff, and still need an explicit ask before committing to `main`.
- Follow `specs/roadmap.md`'s order unless told otherwise.
- Add an entry to `CHANGELOG.md` under `Unreleased` for any user-visible or structural change.

## Checking work

There are no automated tests. The gates for every branch:

1. `npm run build` in `apps/web` succeeds.
2. The feature's own `validation.md`, checked in a real browser (`npm run dev`, `http://localhost:5174/overview.html`): Light and Dark, desktop and phone width (390px), keyboard, reduced motion.
3. The baseline smoke test in `specs/baseline/validation.md`, so nothing that worked before is broken.

A check that wasn't run is not a pass. Each `validation.md` ends with a dated "Checked on" line saying when, where and how, and what was not checked.

## Git

Klaudiusz handles git himself via GitHub Desktop and the GitHub web UI. By default, agents prepare and stage changes but do not commit or push on their own. Two cases differ:

- **On a feature branch, while implementing a spec's task groups:** the agent commits each task group itself, with a clear, atomic message, without asking each time.
- **Merging a feature branch into `main`, or committing anything directly to `main`:** always requires an explicit ask and Klaudiusz's go-ahead first. Remember that `main` deploys.

Closing out a branch, once its work and `validation.md` are done, goes in this order:

1. Run `/changelog` and tidy the output.
2. Commit the changelog update on the branch.
3. Merge into `main` and push. This is still always an explicit ask; don't do it unprompted.
4. Delete the branch, local and remote.

Never stage `.idea/`, `.DS_Store`, `settings.local.json` or anything under `packages/ui/.claude/`.

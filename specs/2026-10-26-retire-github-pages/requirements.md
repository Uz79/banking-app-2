# Retire GitHub Pages: requirements

Branch: `feature/retire-github-pages`

Roadmap item 17 (added with this spec). Vercel (`banking-app-2-bay.vercel.app`) is already the production host and the only one that is counted (`specs/2026-10-26-web-analytics/`). The GitHub Pages workflow still deploys the same files on every push to `main`, and the docs still say Pages. This branch makes Vercel the only host, in the repo and in the docs, and moves the one thing the workflow did that Vercel does not (the build check) onto Vercel.

## Scope

**In:**

1. **Delete `.github/workflows/deploy.yml`** (D2). It is the only file in `.github/`.
2. **Docs say Vercel:** `specs/tech-spec.md` lines 10 and 88, `AGENTS.md` line 17, `CHANGELOG.md` line 52 (the "Deploy is source" entry) and a new `Unreleased` entry, and the comment at `apps/web/js/analytics.js:37` (comment only) (D3).
3. **A build gate on Vercel:** the exact project settings that make a failing `npm run build` stop a deploy, written into the spec and the docs. Klaudiusz changes the settings (D5 to D8).
4. **Roadmap:** a new item 17 linking this spec, set to done at close-out.

**Out (not this branch):**

- Unpublishing the Pages site: Klaudiusz does it in GitHub Settings, Pages, after the merge (D9)
- Any app code, apart from the one comment (D3)
- Rewriting history: `CHANGELOG.md` line 15 and the finished web-analytics spec files keep their wording, which was true when written
- A custom domain, Vercel Speed Insights, any other host or CI

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Vercel is the only host.** `banking-app-2-bay.vercel.app`, project root `apps/web`, every push to `main` is a production deploy and every other branch gets a preview URL. | Decided by Klaudiusz before this spec. Not re-opened |
| D2 | **`.github/workflows/deploy.yml` is deleted**, and with it the `.github` folder. After the merge and push no GitHub Actions run starts. | Decided before this spec. The workflow does nothing Vercel does not, except the build (D5) |
| D3 | **Docs, with the interview answer "live docs plus the comment":** `specs/tech-spec.md:10` becomes "Deployed to Vercel on every push to `main`" and `:88` (the Decisions row "Deploy") says Vercel serves `apps/web` as it is, with the settings of D4; `AGENTS.md:17` says `main` deploys to Vercel on every push and that branches get a preview URL (the workflow path is dropped); `CHANGELOG.md:52` says Vercel instead of GitHub Pages; a `Changed` entry under `Unreleased`; the comment at `apps/web/js/analytics.js:37` drops "GitHub Pages" (the host check itself is unchanged). `CHANGELOG.md:15` and the finished spec files are left alone. | Live docs must not describe a deploy that no longer exists; history must not be rewritten |
| D4 | **The principle "deploy is source" stays:** the deployment serves `apps/web` as it is and `dist` is never deployed, so assets loaded at run time by a computed URL need no copy step in the build. On Vercel that is Framework Preset **Other**, Root Directory **`apps/web`**, Output Directory **`.`**. | Decided before this spec; the reason is in the fridge advisor D25 |
| D5 | **The build becomes a gate on Vercel** (interview answer). A failing `npm run build` fails the deployment, so it never goes live; for a failing production build Vercel keeps serving the previous production deployment. Build Command: `npm run build && rm -rf dist node_modules`. Install Command: no override, so Vercel runs its default (`npm install`, which finds `package-lock.json` in `apps/web`). Output Directory stays `.`. | The workflow was the only automatic build check. The build takes under a second and changes no tracked file (checked 2026-10-26: `git status` clean after it) |
| D6 | **Why the `rm -rf`:** with Output Directory `.` everything in `apps/web` is published, and the install and the build add `node_modules` (about 154 MB) and `dist` (about 6 MB, a second copy of every page and asset). The command removes both after the build, so what is served is the source tree, as today. Whether Vercel would exclude `node_modules` on its own is not documented clearly enough to rely on, so the removal is explicit. Checked on the first preview (validation section 3), not assumed. | Keeps D4 true while still building |
| D7 | **Settings that do not change:** preset Other, Root Directory `apps/web`, Output Directory `.`. **Settings that do:** Build Command (was `echo`, D5) and the Install Command override (was set and empty, now off). **Settings to check, not change blindly:** "Include source files outside of the Root Directory" must be on (the token build reads `designs/tokens` at the repo root, `scripts/generate-tokens-css.mjs`), and the Node.js version must satisfy `vite` 8 (`^20.19.0 \|\| >=22.12.0`; the workflow used Node 20, so 22.x is the safe pick). Klaudiusz changes the settings in the Vercel dashboard; the agent does not. | Klaudiusz's rule for Vercel settings. The two checks are what the build needs that `echo` did not |
| D8 | **Order:** (1) the branch is built and Klaudiusz pushes it, (2) Klaudiusz changes the settings, (3) a redeploy of the branch gives a preview that is checked (validation section 3), (4) the merge into `main`, (5) the Pages site is unpublished (D9). The settings apply to the next deployment of any branch, so a broken setting can only fail a deployment; it never takes the live site down. | A preview is the only place to prove D5 and D6 before `main` |
| D9 | **Unpublishing the Pages site** (GitHub Settings, Pages) is Klaudiusz's, after the merge. Until then the old site keeps serving its last build. The check is that the `github.io` address no longer serves the app. | Decided before this spec. The agent cannot and does not change repository settings |
| D10 | **The fallback, if D5 turns out messy:** a build-only GitHub Action (`npm install` and `npm run build` on push, with no Pages permissions and no deploy). It would contradict D2 (the folder would stay), so it needs Klaudiusz's go-ahead and a revision of this spec. Not built unless D5 fails its checks. | Named by Klaudiusz in the interview as the fall-back |
| D11 | **Nothing else assumed Pages.** Searched on 2026-10-26: no link to a `github.io` address in the repo (the only `github.io` hits are vendor URLs inside `storybook-static` and `packages/ui/ds-bundle`), no Vite `base`, no `404.html`, `CNAME` or `.nojekyll`, and `apps/web/README.md` and the root README do not mention a host. The app's own URLs are relative, so nothing breaks when the Pages sub-path (`/banking-app-2/`) goes away. | Answers the second interview question |
| D12 | **The build check moves from "on push" to "on deploy".** `AGENTS.md` gate 1 (`npm run build` in `apps/web`) stays as the manual gate before a merge; the Vercel build is the second line, and its result is visible in the Vercel dashboard and on the branch's preview, not as a GitHub check. Written in the `AGENTS.md` change. | Honest about where the check now lives |

## Context

- `.github/workflows/deploy.yml` (the only workflow): on push to `main`, Node 20, `npm install` and `npm run build` in `apps/web`, then uploads `apps/web` (not `dist`) as the Pages artifact.
- Vercel today: preset Other, build command `echo`, output `.`, root `apps/web`, install command overridden and empty (reported by Klaudiusz). `apps/web/vercel.json` holds the three rewrites for the source entry paths and nothing else (web analytics D5); it does not set a build or install command, and this branch does not add one: the settings stay in the dashboard (D7).
- `npm run build` is `npm run tokens:build && vite build`. It ran in 0.7 s on 2026-10-26, wrote only to `apps/web/dist` (git-ignored), and `npm ci --dry-run` is in sync with `apps/web/package-lock.json`.
- `apps/web/storybook-static` (28 MB, tracked) is published today and stays so; it is not part of this change.
- References that say Pages now: `.github/workflows/deploy.yml`, `specs/tech-spec.md:10` and `:88`, `AGENTS.md:17`, `CHANGELOG.md:15` and `:52`, `apps/web/js/analytics.js:37`, and the finished web-analytics spec files.

## Open questions

- Whether Vercel publishes `node_modules` and `dist` with Output Directory `.` if the build command did not remove them. Not needed to know: D6 removes them either way, and the first preview shows the result.
- Whether the Vercel project's Node.js version is already 22.x. Klaudiusz checks it in the dashboard (D7).

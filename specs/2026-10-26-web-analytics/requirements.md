# Web Analytics (Vercel): requirements

Branch: `feature/web-analytics`

Roadmap item 13. Count real visitors of the production site and see where they come from (LinkedIn, and the PDFs sent out: CV, portfolio), with no cookies, no personal data and no consent banner. Builds on the existing `js/analytics.js` shim. The app is a static multi-page site that Vercel serves from `apps/web` (preset Other, build command `echo`, output `.`); the Vercel settings stay as they are.

## Scope

**In:**

1. **The loader:** `js/analytics.js` injects the Vercel queue stub and `/_vercel/insights/script.js` (deferred), on the production host only (D1 to D4).
2. **Source entry paths:** `apps/web/vercel.json` with one rewrite per source, each serving `overview.html` while the URL keeps the source path (D5, D6).
3. **Own visits:** `?analytics=off` and `?analytics=on` set and clear a localStorage flag that is checked before the script loads (D7 to D9).
4. **Docs:** the new key in `apps/web/README.md`, a `tech-spec.md` Decisions row, the changelog.

**Out (one-line pointers, not this branch):**

- Switching off the GitHub Pages workflow and updating `specs/tech-spec.md` (lines 10 and 88), `AGENTS.md` (line 17) and `CHANGELOG.md` where they say GitHub Pages: a separate small decision later
- Enabling Web Analytics in the Vercel dashboard: done by Klaudiusz at go-live
- Custom events, a UTM report (not on the Hobby plan), any other analytics tool, a consent banner (not needed)
- Changing the Vercel project settings (preset, build command, output, root directory)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Vercel Web Analytics on the Hobby plan.** Cookie-free, no personal data, so no consent banner. No custom events, no UTM report. No npm package and no `inject()`. | Chosen up front. GitHub Pages serves the source without a build, so a bare npm import cannot load there; the plain script tag works on both hosts. Fits "No new runtime dependency" in `tech-spec.md` |
| D2 | **Counted host: only `banking-app-2-bay.vercel.app`.** The script loads when `location.hostname` equals it exactly (a constant at the top of `js/analytics.js`). Never on `localhost`, `*.local`, Vercel preview URLs or the GitHub Pages address. | Chosen up front. Exact equality, no pattern, so no look-alike host can match. Previews and Pages do not pollute the numbers |
| D3 | **Where the code lives: `js/analytics.js`**, the shim every page already loads. It adds the queue stub (`window.va = window.va \|\| function () { (window.vaq = window.vaq \|\| []).push(arguments); }`) and appends `<script defer src="/_vercel/insights/script.js">`. A small public method `UZBankAnalytics.isCountedHost(hostname)` holds the host check so it can be tested with other host names. | One place, no tag in 13 heads. The roadmap said "in the head of every page"; this keeps one copy instead. The method exists so validation can test the guard without a second host |
| D4 | **Order in `analytics.js`:** first read `?analytics=` (D7), then check the flag (D8), then the host (D2), then inject. If reading the flag throws (blocked storage), that counts as no flag and the host check still runs: a visitor with blocked storage cannot have opted out, so they are counted. Only an exception in the host check or in the injection itself means no script. None of these shows a console error. The existing screen and event hooks run as before. | The visit that sets the flag must not be counted; a broken storage must not break the page or silently drop a visitor |
| D5 | **Source entry paths: `/from-cv`, `/from-portfolio`, `/from-linkedin`**, each a rewrite to `/overview.html` in `apps/web/vercel.json` (`apps/web` is Vercel's root directory). One segment only. | Chosen in the interview. `js/shell-nav.js` (`normalizePath`) and `js/section-build-boot.js` (`page`) take the last path segment and fall back to `overview.html` for anything that is not `.html`, and the pages use relative `css/` and `js/` URLs that resolve from a one-segment path. A deeper path would break both |
| D6 | **`vercel.json` holds only the rewrites.** No `buildCommand`, `outputDirectory`, `cleanUrls` or headers; the dashboard settings stay as they are. Adding a source later is one more line. | Chosen up front. Rewrites cannot be tested with Vite (it ignores `vercel.json`); the preview deployment tests them |
| D7 | **Opt-out switch:** `?analytics=off` writes the flag, `?analytics=on` removes it. Any other value does nothing. Afterwards the `analytics` parameter is removed from the address bar with `history.replaceState`; the path, any other parameters and the hash stay. | Chosen in the interview: the URL goes back clean, so a copied link does not carry the switch |
| D8 | **The flag:** localStorage key `uzBankWebAnalyticsOff`, value `1`. If it is set, the Vercel script is never injected, in that browser. Storage that throws counts as "not set" for reading and is ignored for writing. Listed in `apps/web/README.md`. | AGENTS.md: keys start with `uzBankWeb` and are listed in the README |
| D9 | **No visible feedback and no scope beyond Vercel.** Setting the flag shows nothing on screen. The flag affects only the Vercel script; `analytics.js` keeps emitting `uzbank:screen` and `uzbank:event` and calling `UZ_BANK_ANALYTICS_HOOK` (it loads no Maze, Hotjar or GA4 itself; those are attached by an integrator). | Chosen in the interview. The status message script only loads on some pages, so feedback would need extra wiring; own test sessions with other tools keep working |
| D10 | **Pages without `analytics.js` stay as they are:** `index.html` (a meta refresh to `overview.html`, so the visit is counted there as `/overview.html`), `account-information.html` (a redirect to `account-details.html`) and `spa-source.html` (a reference page). The other 13 pages load it. | Found while reading; none is an entry a source link should point at. Recorded so nobody is surprised |
| D11 | **Privacy:** no cookie, no identifier of ours, nothing about a visitor stored. The only thing written is the opt-out flag, on the visitor's own device and only after they use the switch. The query parameter is never sent anywhere. | Mission: the prototype shows work to people; the numbers must not cost them privacy |
| D12 | **Limits recorded, not worked around:** 50,000 events a month shared across all of Klaudiusz's Vercel projects, a one-month reporting window, no custom events, no UTM report. PDFs already sent keep their old links and count as direct. | Hobby plan facts, so nobody expects more from the numbers |

## Context

- `js/analytics.js` (      87 lines) is an IIFE: `hook(kind, payload)` fires `window.UZ_BANK_ANALYTICS_HOOK`, a `uzbank:screen` or `uzbank:event` custom event and a `console.debug`; `UZBankAnalytics.screen()` and `.track()` are public; `emitScreen` runs on ready and on `hashchange`. Pages load it with `<script src="js/analytics.js"></script>` at the end of `<body>`.
- Paths that read `location.pathname` and are safe under a rewrite: `shell-nav.js:58-71`, `section-build-boot.js:31-34` (both fall back to `overview.html`); `payment-overlay.js`, `iat-overlay.js`, `payment-details.js` and `trade-flow-overlay.js` build URLs from `location.pathname` plus the hash, so they keep `/from-cv`; `app.js` and `app-mp.js` only look for `/payment/`.
- In-app links are relative (`overview.html`, `account-details.html`), so from `/from-cv` they go to `/overview.html` and later pages are counted under their own paths. That is the intended picture: the source row shows where a visit started.
- `.github/workflows/deploy.yml` still deploys the same files to GitHub Pages; there the host check (D2) keeps the script off.
- Vite's dev server ignores `vercel.json`, and the script URL does not exist on 5199 or Pages; the host guard is why nothing is requested there.

## Open questions

- The app uses `history.pushState` for hash routes (`#pay/...`, `#iat/...`, trade, payment details). Whether the Vercel script counts those as extra page views, and so spends the 50,000 events faster than visits suggest, cannot be seen locally or on a preview (the script is not loaded there). Checked at go-live in the Vercel dashboard by Klaudiusz; if it inflates the numbers, a follow-up decides how to handle it.
- Whether Vercel serves the rewrites exactly as written (no trailing-slash or `cleanUrls` surprise): checked on the preview deployment.

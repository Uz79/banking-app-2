# Web Analytics (Vercel): validation

Branch: `feature/web-analytics`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Rewrites and the counted host cannot be tested locally; those items are marked and belong to the preview and production checks.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

## 2. The loader (D1 to D4, D10)

- [x] On 5199 (localhost): no request to `/_vercel/insights/script.js` and no `window.va` stub on Overview and on one other page (Network tab or `performance.getEntriesByType('resource')`)
- [x] `UZBankAnalytics.isCountedHost('banking-app-2-bay.vercel.app')` is true; false for `localhost`, `127.0.0.1`, `x.local`, a `*.vercel.app` preview name, a GitHub Pages name, and a look-alike such as `banking-app-2-bay.vercel.app.example.com`
- [x] With the flag set, even the counted host name would not load it (read the code path, or call the guard with a stubbed host)
- [x] First visit, nothing in localStorage: no error, no key created
- [x] `uzbank:screen` still fires on load and on a hash step (`#pay/recipient-search`); `UZBankAnalytics.track` still emits `uzbank:event`
- [x] The 13 pages that load `analytics.js` still do; `index.html`, `account-information.html` and `spa-source.html` are unchanged

## 3. Opt-out (D7 to D9, D11)

- [x] `?analytics=off` sets `uzBankWebAnalyticsOff` to `1`; the address bar loses the parameter but keeps the path, another parameter (`?account=x`) and the hash
- [x] `?analytics=on` removes the key and cleans the address bar the same way
- [x] Another value (`?analytics=maybe`) changes nothing; the parameter is left alone
- [x] Nothing visible happens on screen; Light and Dark, a Multi-color theme and 390px: not applicable, no UI
- [x] Storage blocked or throwing: the page loads, no console error, and on the counted host the script is still injected (tested with the `localhost` copy of `analytics.js`)
- [x] The flag survives a reload and a visit to another page

## 4. Source paths (D5, D6): preview and production, not testable on 5199

- [ ] `apps/web/vercel.json` is valid JSON with exactly the three decided rewrites
- [ ] Vercel preview (after Klaudiusz pushes the branch): `/from-cv`, `/from-portfolio`, `/from-linkedin` each load the Overview with the path kept; the nav active state is right; going on to Account details and back works; a payment flow opened there keeps `/from-cv#pay/...`; no script request (preview is not the counted host)
- [ ] Production, by Klaudiusz after the merge: `/from-cv` shows up under Pages in Vercel Analytics, and the pushState question in `requirements.md` is answered

Read Visitors, not Page views, for reach; payment and trade flows add page views per step.

## 5. Baseline smoke test

Copy the checklist from `specs/baseline/validation.md` here when the branch reaches this step, and tick it.

Checked on: not yet. Group 1 progress, 2026-10-26, 5199, Chrome desktop: items ticked above in sections 2 and 3 were run (the loader path with the host constant swapped to `localhost` in a copy of the file, to see the injected tag, `defer`, the stub and the flag blocking it). Not yet run: the 13-pages and untouched-pages check, blocked storage, Light/Dark/390px, the baseline, sections 1 (final build and console pass) and 4.

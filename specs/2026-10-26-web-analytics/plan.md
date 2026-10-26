# Web Analytics (Vercel): plan

Branch: `feature/web-analytics`. Decisions are cited as D1 to D12 from `requirements.md`. Three groups: 1 and 2 build the feature, 3 is the wrap-up (build, validation, docs). Work stops after the group named in the request unless it asks for a run through to validation.

## 1. The loader and the opt-out (D1 to D4, D7 to D9, D11)

What you see: on 5199 nothing about Vercel is requested and the console is clean; `?analytics=off` sets the flag and cleans the address bar, `?analytics=on` clears it; the existing screen and event hooks still fire.

- [x] `apps/web/js/analytics.js`: constant for the counted host; `isCountedHost(hostname)` exposed on `UZBankAnalytics`; read and clean `?analytics=` (replaceState); read the flag; inject the queue stub and the deferred script only when allowed; all in try/catch
- [x] `apps/web/README.md`: `uzBankWebAnalyticsOff` in the storage keys table
- [x] Check on 5199: no request to `/_vercel/insights/script.js`, no console errors; the flag is set and cleared by the two parameters, the address bar is cleaned and keeps the hash and other parameters; `isCountedHost` is true for the production host only; hooks still fire (`uzbank:screen`)

## 2. Source entry paths (D5, D6, D10)

What you see: after the branch is pushed, the Vercel preview serves `/from-cv`, `/from-portfolio` and `/from-linkedin` as the Overview with the path kept in the address bar.

- [ ] `apps/web/vercel.json` (new): three rewrites to `/overview.html`, nothing else
- [ ] Check what can be checked locally: the file is valid JSON and matches the decided paths
- [ ] After the push (Klaudiusz): on the preview, `/from-cv` loads, the nav works, no script request (preview is not the counted host)

## 3. Wrap-up

- [ ] `npm run build` in `apps/web`
- [ ] Re-run what group 1 left open, with the results in `validation.md`:
  - blocked or throwing storage: the script is still injected on the counted host (tested with the `localhost` copy of `analytics.js`) and the page shows no error
  - the 13 pages still load `js/analytics.js`, and `index.html`, `account-information.html` and `spa-source.html` are unchanged
  - Light and Dark, a Multi-color theme and 390px: not applicable, no UI
- [ ] The baseline smoke test
- [ ] The validation pass (`validation.md`), including the baseline smoke test, with the dated "Checked on" line filled in; the production check is listed as Klaudiusz's
- [ ] Docs: `specs/roadmap.md` item 13 linked to this spec (the loader lives in `analytics.js`, not in each head), marked done only once Klaudiusz has seen it work in production; `CHANGELOG.md` under Unreleased; `specs/tech-spec.md` Decisions row (counted host, source paths, opt-out flag); `apps/web/README.md` key (group 1)

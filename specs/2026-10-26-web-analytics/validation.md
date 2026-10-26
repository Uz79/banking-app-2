# Web Analytics (Vercel): validation

Branch: `feature/web-analytics`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Rewrites and the counted host cannot be tested locally; those items are marked and belong to the preview and production checks.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below (see the note at the end on how reliable the console read was)

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

- [x] `apps/web/vercel.json` is valid JSON with exactly the three decided rewrites
- [x] Vercel preview, checked by Klaudiusz (preview URL not recorded here): `/from-cv`, `/from-portfolio` and `/from-linkedin` each load the Overview with the path kept; the nav works; a payment flow opened at `/from-cv#pay/...` works; the Profile 3D character loads; an unknown path gives 404; no insights request; no console errors. Not mentioned as checked by Klaudiusz: the nav active state on the source paths and going on to Account details and back (they said the nav works)
- [ ] Production, by Klaudiusz after the merge: `/from-cv` shows up under Pages in Vercel Analytics, and the pushState question in `requirements.md` is answered

Read Visitors, not Page views, for reach; payment and trade flows add page views per step.

## 5. Baseline smoke test

### Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 4. Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [x] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [x] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [x] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [x] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [x] Motion specimens, Components and Character kit open, and back returns to the hub
- [x] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [x] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on 2026-10-26 against `feature/web-analytics`, Chrome, vite on 5199, desktop (about 2391px wide), a 390px iframe for the phone check, mostly by script plus screenshots; Vercel preview checked by Klaudiusz (section 4).

Checked: the loader and the opt-out (section 2 and 3, including blocked storage and the injection path through a copy of `analytics.js` with the host constant swapped to `localhost`); the 13 pages that load `analytics.js` and the 3 that do not; `vercel.json`; `npm run build`; the baseline smoke test run on this branch: Overview with sidebar and character, mode toggle surviving a reload, the Open payment message appearing, the Pay flow end to end (a booking is stored), an internal transfer, Custody account to a position to Buy and its Discard dialog, Profile (User Type slider changes the title, character and preview; the Comfortable and Default presets change type and spacing app-wide; a Multi-color theme recolours Overview and the UZ Bank card restores navy on white with no colour cache; Reset demo data clears the bookings), the Design system hub, Motion specimens, Components and Character kit pages loading, Overview in the dark mode at 390px with the tab bar and no sideways scroll, Tab focus ring visible on Overview.

Not checked: All bookings tabs, month chips and search on this branch (only checked on the previous branch, and nothing here touches them), the real injection on the counted host (only the production visit does this; Klaudiusz's check), page transition directions, tapping the Open payment message to dismiss it, the Typeface, Font and Paddings controls one by one, the Motion specimens and Components pages beyond loading, system reduced motion (the setting cannot be flipped from here), the Dark and 390px repeats of everything but Overview, and whether the console read caught load-time errors on every page (the tool starts tracking when first called and the pages were visited by navigation, so a clean read is weaker evidence than a clean visit). Production, by Klaudiusz after the merge: `/from-cv` under Pages in Vercel Analytics and the pushState page-view question.

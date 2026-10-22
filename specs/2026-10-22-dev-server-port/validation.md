# Dev server port and network access: validation

Branch: `feature/dev-server-port`. The agent checks the localhost parts on its own port 5199; the phone and the real `npm run dev` on 5175 need the user's Mac and phone.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build and config

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [x] `grep` for `5174` in `AGENTS.md`, `specs/` (apart from this spec folder, which describes the change) and `apps/web/README.md` finds nothing

## 2. Dev server

- [ ] `npm run dev` starts on port 5175 and opens `http://localhost:5175/overview.html` on the Mac
- [ ] With something already on 5175, `npm run dev` fails with a clear "port in use" error and does not start on another port
- [x] The terminal shows a Network URL; the Mac's `.local` name (`http://klaudiuszs-macbook-pro.local:5175/overview.html`) opens the page on the Mac
- [ ] On the phone, on the same Wi-Fi, `http://klaudiuszs-macbook-pro.local:5175/overview.html` opens Overview (no "Blocked request" message)
- [x] The agent's own run, `npx vite --port 5199 --strictPort --no-open` from `apps/web`, serves on 5199, opens no tab, and stops cleanly
- [ ] The Yahoo proxy path (`/api/yahoo`) still answers through the new setup (Custody account prices still load)

## 3. Docs

- [x] `AGENTS.md` Checking work holds the 5175 and 5199 line and reads clearly
- [x] `specs/tech-spec.md` has the dev server Decisions row

## 4. Baseline smoke test

Copied from `specs/baseline/validation.md`. Setup: `cd apps/web && npm run build`, then the dev server and `http://localhost:5175/overview.html`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### 2. Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it

### 3. Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 4. Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### 5. Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 6. Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

---

Checked on 2026-10-22 against `feature/dev-server-port`, on the Mac, by the agent on port 5199 only (it does not touch 5175, D4), Chrome on macOS. Ticked: the build; no `5174` left outside this spec folder; the terminal prints the Network URL (`http://192.168.1.43:5199/`) and the Mac's own `.local` name answers 200 on the same server; a foreign Host header gets 403 and a `.local` Host header 200; with the port taken, `--strictPort` stops with "Port 5199 is already in use"; the 5199 run opens no tab and stops cleanly; Overview renders from 5199; the AGENTS.md and tech-spec text is in place. `/api/yahoo` reached Yahoo through the proxy but Yahoo answered 429 (rate limit), so the prices were not confirmed.

Not checked, so not ticked: `npm run dev` itself on 5175 opening Overview in the Mac's browser and failing clearly when 5175 is taken (the config values are the same ones tested on 5199, but the real command on 5175 was not run); the phone opening the page through the `.local` name; whether macOS asked about incoming connections; the Custody prices loading; the whole baseline smoke test.

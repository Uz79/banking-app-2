# Field anatomy and the month band's ink (63, 64): validation

Branch: `feature/field-anatomy-and-band-ink`. Run on the agent's server (port 5199), then the baseline smoke test. Start each section after Profile's "Reset demo data" unless it says otherwise.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings (built 2026-11-08; the 274 "can't be bundled without type=module" notices are the classic scripts as on main, and no script tag was added)
- [x] `css/tokens.css` and `js/theme-engine.js` were regenerated from their sources, not edited (the diff shows `--color-separator-subtle` in both) (`npm run tokens:build` and esbuild; the engine bundle differs by three lines)
- [ ] No console errors on Overview, Payments, Account details, All bookings (all tabs), the position page, Profile and Components (not run page by page: the console was read only on the Design system hub and the Character kit, where the only entries were the Chrome extension's "message channel closed" notice, not the app)

## 2. The month band (63, D1 to D4, D10)

- [x] All bookings, Executed, Pending and Recurring: each band is a faint 5% tint with its label, no solid secondary background (Household, desktop, Dark Multi-color: 5, 2 and 1 bands, each `--color-bg` under the 5% ink)
- [x] Light, Dark, and a Multi-color theme in each: the band reads as a band, never as a hole or a box; its two layers (`--color-bg` under the 5% ink) show in the computed style (seen: Multi-color Light and Dark, plain Light (390px frame) and plain Dark)
- [x] Saving a Multi-color theme and reloading keeps the band's colour from the first paint (boot script); "UZ Bank" restores the default look exactly (a saved Multi-color card (Custom 11) was picked in Profile and survived a reload with the engine's token; the UZ Bank card cleared every inline colour and the band fell back to `tokens.css` (white at 5% in Dark); a freshly saved new theme was not made)
- [x] First visit (nothing in `localStorage`): the band shows in the plain look (a first visit seeds the default sage Multi-color theme, whose cache carries the token (`#eaeeee0d` in Dark) and shows the band; the plain look is the UZ Bank card above)
- [x] Contrast of the label (`--color-fg`, no opacity) on the band (the 5% ink over `--color-bg`), measured 2026-11-08 from the rendered tokens: Multi-color (sage) Light 8.02, Dark 10.56; plain UZ Bank Light 13.49, Dark 13.40. All at least 4.5:1
- [x] The strokes and dividers that use `--color-separator` are unchanged (still 10% in the plain look) (plain Dark `rgba(255, 255, 255, 0.1)`, plain Light `rgba(0, 21, 126, 0.1)`; the engine's 14% and 10% untouched)
- [x] 390px: the bands and the docked month chips look as before apart from the tint (Savings in a 390px frame, plain Light: bands, chips and rows fit, no horizontal overflow)

## 3. The field anatomy (64, D5 to D8)

- [x] A field's rows measure 24 / 4 / control / 4 / 16 dp at Regular type (a script reads the label's, the control's and the text row's boxes) (label 24, control 40, row 16, field 88 on every text field)
- [x] Buy: with the Limit field's error shown and cleared, the order-duration control and everything below it do not move (measured to the pixel: top 535.55 throughout)
- [ ] Sell: the same check (same sheet and CSS as Buy, not run separately)
- [x] Pay's amount step, the transfer's amount step, Buy's Amount and Limit, and the admin sign-in: height empty = height with a helper = height with an error (Pay (real flow and helper), the transfer (through the helper only), Buy, the admin sign-in with a real wrong sign-in, and the Profile theme preview's Select-Field: 88 empty, with a helper and with an error; Sell and the transfer's own error path are not run)
- [x] A field with an info row (Amount's "Stock split 1") keeps its height when the info row gives way to an error (Buy's Amount, "Stock split 1" to the error, 88 throughout)
- [ ] The audit covers every field on every page and flow, in Light and Dark, 390px and desktop, Regular and Large type; its list of anything that wraps is in the checked line below, and each one is shortened or accepted in writing (run at desktop Regular on every page and flow that carries fields; 390px and Large only for the messages, the Pay amount, the trade sheet and the Components specimen; Dark not rerun, since heights do not depend on the theme)
- [x] Every message fits one line at Regular on 390px (every message at Regular, Large and Small on the Pay sheet; the trade sheet at Regular; the one wrap is Buy's half-width Limit at Large on 390px, "Enter a limit price above 0." (D7, accepted))
- [x] ReadOnly fields (Account and Share information) look as before (Account information: 88dp, grid, 4px gap, label 21dp (their labels take `min-height: 0`))
- [ ] The sheets still fit: Buy, Sell, Pay and the transfer show their action without a new scroll where there was none; the fridge and the opening have no step that now scrolls (not measured; fields are 4dp shorter than before, so they can only gain room)
- [x] Error behaviour unchanged (54): the error shows on leaving a typed field, clears live, Confirm checks every field and moves focus to the first error, closing never shows one (Pay and Buy by their real flows: Confirm with an empty amount stays, shows "Enter an amount.", focus in the field, 88dp, clears live; the transfer was not driven by its own error path)
- [x] `aria-invalid` and `aria-describedby` are set and cleared as before, and the empty reserved row has no text in it (read from the DOM) (read from the DOM: invalid and described-by set and removed, the empty row has no text and is hidden)
- [ ] First visit (nothing in `localStorage`), Light and Dark, a Multi-color theme (the first-visit run was the default sage theme in Dark (Pay and the transfer completed from it), Light seen on the plain look; not every combination)
- [ ] Keyboard: Tab through every flow's fields; the focus ring is visible and the order unchanged (not run through the flows; only Overview, below)
- [ ] Reduced motion: nothing animates in a field's rows (nothing animated was added to the rows; the macOS setting itself was not switched)

## 4. The Components specimen (D9)

- [x] The Form field specimen shows the anatomy with its 24 / 4 / 16 marks, empty, with a helper and with an error, all at one height (88dp each, the marks aligned to the pixel with the rows; also at Large and Small type)
- [ ] Light, Dark, desktop and 390px; the text has no em dashes (Light and Dark seen on desktop, no em dash; 390px measured in a frame, no overflow, marks hidden there, not yet looked at)
- [x] The admin guard: the Components page still asks for admin (signed out, it redirects to Profile's admin sign-in)

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Setup: `cd apps/web && npm run build`, then open the app. Desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 5.1 Build

- [x] `npm run build` succeeds with no new warnings (as section 1)
- [ ] The browser console shows no errors on any page visited below

### 5.2 Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop (desktop, plain Light and Dark: sidebar, canvas, the character in the lower right)
- [x] ★ Light/Dark toggle switches instantly and survives a reload (sidebar toggle to Light, reload: still Light)
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions (not checked)
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (see roadmap 67 for its real timing) (appeared 6.0 s after page load and a tap dismissed it, not about 12 s: the discrepancy of roadmap 67)

### 5.3 Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update (Pay 120 to the first recipient: Household 10'000.00 to 9'880.00, one executed booking, focus on Done)
- [x] Internal transfer completes (500 Household to Savings: 9'380 and 25'500, both legs booked)
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed (Discard order? with Continue order and Discard)
- [x] All bookings: tabs, month chips and search work (three tabs, a chip makes its month active (the scroll itself was not measured), search "Hans" left one row)

### 5.4 Profile

- [x] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview (the knowledge slider to 100 was stored and the profile read "Newbie" with its story, preview and character; before and after were not compared side by side)
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work (Large changed `--fs-text-sm` to 1.015rem and the preset applied; Typeface, Font and Paddings not run)
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly (Custom 11 recoloured Profile (primary action, toggles) and survived a reload; the UZ Bank card restored the plain look; not walked page by page)
- [x] Demo data reset restores the Household balance (9'380 to 10'000 and Savings 25'500 to 25'000, no bookings; the confirmation dialog asked first)

### 5.5 Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move (the hub lists Motion specimens, Components, Character kit and Playground; the arrows were not watched)
- [x] Motion specimens, Components and Character kit open, and back returns to the hub (Motion specimens and Components load, back from the Character kit returns to the hub)
- [x] The Character kit specimen loads and the profile buttons change the figure (Lena All-rounder gave a helmet, ranger kit and walk clip)

### 5.6 Accessibility

- [ ] Tab through Overview: focus is always visible (sampled: five Tabs reached Profile in the sidebar with a 2px solid ring (`:focus-visible`))
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation (the macOS setting was not switched; Klaudiusz to run it)

Checked on 2026-11-08 against `feature/field-anatomy-and-band-ink`, Chrome on the agent's server (5199), desktop (1728px) and 390px in same-origin frames, Light and Dark, the default sage Multi-color theme, Custom 11 and the UZ Bank look; demo admin switched on in `localStorage` for the design pages and cleared again. Not checked: Sell; the transfer's own error path; every flow by keyboard; reduced motion with the macOS setting; page transitions; Legibility's Typeface, Font and Paddings; the console page by page; the sheets' fit by measurement; Dark and Large across every page of the audit; the status message's 12 s; a freshly saved theme; the specimen at 390px by eye.

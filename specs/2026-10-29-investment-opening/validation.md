# Investment opening (9a): validation

Branch: `feature/investment-opening`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Start from a demo data reset and a fresh tab (no `uzBankWebOpeningDraft`) unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings, and `investment-opening.html` is in the output (the 241 "can't be bundled without type=module" notices are the same classic-script notices every page prints)
- [x] The browser console shows no errors on the fridge, the opening and Overview (only the browser extension's "message channel closed" noise, which is not the app)

## 2. Hand-over and the sheet (D1 to D4, D18, D19)

- [x] Overview > Offers > Investment opens the fridge as before; step 7's "Show suitable products" loads the opening in the same sheet, with the title "Open asset management"
- [x] The fridge now has 7 steps ("Step 7 of 7"); screen 8 is gone
- [x] Desktop: the sheet narrows from 960 to 640 in about 0.3 s; 390px: full screen, no width change. With reduced motion at once: the rule is in the loaded stylesheet, not run with the system setting on (see 7)
- [x] Desktop: the opening's sheet keeps one height, `clamp(480px, 60vh, 640px)`, on every step; Next stays at the bottom; the fridge keeps its 90vh sheet; payment and trade sheets unchanged (D26)
- [x] Desktop at a 640 sheet and phone at 390px: no step scrolls, in every state (hints and notes showing, a risk question reopened, the fall-back note) (D27)
- [x] The draft holds the fridge amount (CHF 7'900 for salary 7'000, left 1'000, unplanned 21'000, assets 34'900)
- [x] Close on any screen past the intro asks "Leave the opening?"; Leave closes; Investment then resumes at the same screen, narrow
- [x] "Start over" on the intro clears the draft and loads the fridge
- [x] A new tab starts fresh (sessionStorage); bad JSON in the draft starts fresh without errors (from Overview it opens the fridge; on its own the page writes a fresh draft at the intro)
- [x] `investment-opening.html` opened on its own shows its own header and works without the sheet; with no fridge amount the amount starts empty (D9)
- [x] Escape in the opening behaves like the close button
- [x] The exit prompt's Keep going (click or Escape) returns focus to what had it: an option in the page or the header's X; Leave (click or keyboard) returns it to Investment, ring visible from the keyboard (2026-10-29, Chrome, 5199)

## 3. Screens 1 to 4 (D5 to D9)

- [x] The step indicator shows 10 segments with the current one marked, on screens 1 to 10
- [x] Knowledge is preselected for Newbie, All-rounder and Power user per D7, with the "Preselected from your profile" line; changing it works
- [x] "Buy a home" leaves only "Under 3 years" and "3 to 5 years", with the line; switching purpose back restores all four; a horizon chosen before that is no longer allowed is cleared
- [x] Amount: prefilled with the fridge amount and the suggestion line; above it, the note and Next stays available; under 5'000, Next is blocked with "The minimum is CHF 5'000."; typed values keep the CHF format
- [x] Next is blocked with a hint wherever a required answer is missing

## 4. Risk and strategy (D10 to D12)

- [x] All three risk questions required
- [x] Lowest answers: Income; highest answers with a long horizon and Good knowledge: Dynamic; one case in each middle band
- [x] Horizon "Under 3 years" caps at Conservative, "3 to 5 years" at Balanced; knowledge "None" caps at Balanced
- [x] The recommended card has the tag and is preselected; riskier cards cannot be chosen and say "Above your risk profile"; a more careful one can be chosen
- [x] After choosing a strategy, raising the risk caps (for example a shorter horizon) falls back to the new recommendation with the note
- [x] Risk bars and return marks match the five strategies; the cards are one column at 390px

## 5. Sustainability, tax, exit, documents (D13 to D16)

- [x] Sustainability: three options, required
- [x] Tax: Yes/No both required; "No" to Switzerland only or "Yes" to US person leads to the exit; "Change my answers" returns to the tax screen with the answers kept
- [x] "Book an appointment" shows "We will call you to find a time." and Done closes the sheet; the draft is kept
- [x] Documents: the two contracts listed, the eleven information sheets one row that opens their list; names are not links; the checkbox gates Next (D27)
- [x] Tax: "What counts?" opens and closes the US criteria, by mouse and keyboard (D27)
- [x] Risk: a click, Space or Enter folds a question and moves on; arrow keys do not; Change reopens one (D27)

## 6. Summary, completion, the new product (D17, D20 to D22)

- [x] The summary shows the strategy card and three sections (Strategy, Amount, Your answers), each with one Edit (D27)
- [x] Each Edit opens its screen with "Back to summary", which returns to the summary with the change shown; the Edit on "Your answers" walks its five screens with "Next question"
- [x] An edit that changes the recommendation shows the note on the summary
- [x] "Open asset management" shows completion with the strategy, the amount and the next step; Done closes without a prompt; the draft is gone
- [x] Overview shows "Asset management", the strategy and "Pending: CHF 7'900" after Retirement savings 3a; the Accounts & Investment total is unchanged; the row survives a reload
- [x] A second opening adds a second row (Income, CHF 12'000, from a draft placed at the summary; both rows survive a reload, the total is unchanged, and a payment made afterwards keeps them)
- [x] Profile > Reset demo data removes the rows and the draft

## 7. Look, keyboard, motion (D23, D24)

- [x] Light and Dark; a Monochrome theme; a Multi-color theme (selected options, the tag and focus rings in the accent)
- [x] Desktop and 390px on every screen, nothing overflows
- [x] Keyboard only from Overview through completion: Tab order, arrow keys in option groups, Space on the checkbox, the focus ring always visible, the heading focused on each screen
- [x] The live region announces each screen (its text read from the page, "Step 2 of 10, …"; not with a screen reader)
- [ ] Reduced motion (system setting and `?reduced`): no slide, no width animation. Not run: the `prefers-reduced-motion` rules are in the loaded stylesheet, but the system setting was not switched on
- [x] No em dashes in any copy

## 8. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 1. Build

- [x] `npm run build` succeeds with no new warnings
- [x] The browser console shows no errors on any page visited below

### 2. Shell

- [x] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [x] ★ Light/Dark toggle switches instantly and survives a reload (sidebar on desktop, the top bar glyph at 390px)
- [x] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions (the recorded directions were forward, back, back; the slides themselves could not be screenshotted)
- [x] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (it drops in again 8 s later, as designed)

### 3. Banking flows

- [x] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [x] Internal transfer completes
- [x] Custody account → a position → Buy opens the trade flow and can be dismissed
- [x] All bookings: tabs, month chips and search work

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
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation. Not run: the system setting is Klaudiusz's to switch

Checked on 2026-10-29 against `feature/investment-opening`, Chrome on macOS, the agent's server on 5199: desktop (the 640 sheet and the 960 fridge) and 390px (an injected 390px frame), Light and Dark, the UZ Bank Monochrome theme and a Multi-color theme (Custom 06). Sections 2 to 7 were run across the task groups' checks and the wrap-up pass on the same day; the baseline ran in the wrap-up pass, the ★ items repeated in Dark at 390px together. Not checked: reduced motion with the system setting on (only the rules in the stylesheet); a screen reader; a window short enough for the 480 minimum height. Seen during the pass, not caused by this branch: the Pay flow's schedule step shows "Hans Meyer" whatever the recipient (hard-coded in `overview.html`; the summary is right); the trade flow's exit prompt says "Continue payment"; the Overview logo, the custody chart card and its period chips show the browser's default focus ring instead of the token colour; on Profile at 390px the character overlaps the sliders.

# Investment opening (9a): validation

Branch: `feature/investment-opening`. Tick each item in a real browser on the agent's test server (`cd apps/web && npx vite --port 5199 --strictPort --no-open`; Klaudiusz's own runs on 5175). Start from a demo data reset and a fresh tab (no `uzBankWebOpeningDraft`) unless an item says otherwise.

A check that wasn't run is not a pass. The "Checked on" line at the bottom is filled in when the checks are run.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings, and `investment-opening.html` is in the output
- [ ] The browser console shows no errors on the fridge, the opening and Overview

## 2. Hand-over and the sheet (D1 to D4, D18, D19)

- [ ] Overview > Offers > Investment opens the fridge as before; step 7's "Show suitable products" loads the opening in the same sheet, with the title "Open asset management"
- [ ] The fridge now has 7 steps ("Step 7 of 7"); screen 8 is gone
- [ ] Desktop: the sheet narrows from 960 to 640 in about 0.3 s; with reduced motion at once; 390px: full screen, no width change
- [ ] Desktop: the opening's sheet keeps one height, `clamp(480px, 60vh, 640px)`, on every step; Next stays at the bottom; the fridge keeps its 90vh sheet; payment and trade sheets unchanged (D26)
- [ ] Desktop at a 640 sheet and phone at 390px: no step scrolls, in every state (hints and notes showing, a risk question reopened, the fall-back note) (D27)
- [ ] The draft holds the fridge amount (CHF 7'900 for salary 7'000, left 1'000, unplanned 21'000, assets 34'900)
- [ ] Close on any screen past the intro asks "Leave the opening?"; Leave closes; Investment then resumes at the same screen, narrow
- [ ] "Start over" on the intro clears the draft and loads the fridge
- [ ] A new tab starts fresh (sessionStorage); bad JSON in the draft starts fresh without errors
- [ ] `investment-opening.html` opened on its own shows its own header and works without the sheet; with no fridge amount the amount starts empty (D9)
- [ ] Escape in the opening behaves like the close button

## 3. Screens 1 to 4 (D5 to D9)

- [ ] The step indicator shows 10 segments with the current one marked, on screens 1 to 10
- [ ] Knowledge is preselected for Newbie, All-rounder and Power user per D7, with the "Preselected from your profile" line; changing it works
- [ ] "Buy a home" leaves only "Under 3 years" and "3 to 5 years", with the line; switching purpose back restores all four; a horizon chosen before that is no longer allowed is cleared
- [ ] Amount: prefilled with the fridge amount and the suggestion line; above it, the note and Next stays available; under 5'000, Next is blocked with "The minimum is CHF 5'000."; typed values keep the CHF format
- [ ] Next is blocked with a hint wherever a required answer is missing

## 4. Risk and strategy (D10 to D12)

- [ ] All three risk questions required
- [ ] Lowest answers: Income; highest answers with a long horizon and Good knowledge: Dynamic; one case in each middle band
- [ ] Horizon "Under 3 years" caps at Conservative, "3 to 5 years" at Balanced; knowledge "None" caps at Balanced
- [ ] The recommended card has the tag and is preselected; riskier cards cannot be chosen and say "Above your risk profile"; a more careful one can be chosen
- [ ] After choosing a strategy, raising the risk caps (for example a shorter horizon) falls back to the new recommendation with the note
- [ ] Risk bars and return marks match the five strategies; the cards are one column at 390px

## 5. Sustainability, tax, exit, documents (D13 to D16)

- [ ] Sustainability: three options, required
- [ ] Tax: Yes/No both required; "No" to Switzerland only or "Yes" to US person leads to the exit; "Change my answers" returns to the tax screen with the answers kept
- [ ] "Book an appointment" shows "We will call you to find a time." and Done closes the sheet; the draft is kept
- [ ] Documents: the two contracts listed, the eleven information sheets one row that opens their list; names are not links; the checkbox gates Next (D27)
- [ ] Tax: "What counts?" opens and closes the US criteria, by mouse and keyboard (D27)
- [ ] Risk: a click, Space or Enter folds a question and moves on; arrow keys do not; Change reopens one (D27)

## 6. Summary, completion, the new product (D17, D20 to D22)

- [ ] The summary shows the strategy card and every answer with an edit button
- [ ] Each edit opens its screen with "Back to summary", which returns to the summary with the change shown
- [ ] An edit that changes the recommendation shows the note on the summary
- [ ] "Open asset management" shows completion with the strategy, the amount and the next step; Done closes without a prompt; the draft is gone
- [ ] Overview shows "Asset management", the strategy and "Pending: CHF 7'900" after Retirement savings 3a; the Accounts & Investment total is unchanged; the row survives a reload
- [ ] A second opening adds a second row
- [ ] Profile > Reset demo data removes the rows and the draft

## 7. Look, keyboard, motion (D23, D24)

- [ ] Light and Dark; a Monochrome theme; a Multi-color theme (selected options, the tag and focus rings in the accent)
- [ ] Desktop and 390px on every screen, nothing overflows
- [ ] Keyboard only from Overview through completion: Tab order, arrow keys in option groups, Space on the checkbox, the focus ring always visible, the heading focused on each screen
- [ ] The live region announces each screen (accessibility tree or a screen reader)
- [ ] Reduced motion (system setting and `?reduced`): no slide, no width animation
- [ ] No em dashes in any copy

## 8. Baseline smoke test

Copied from `specs/baseline/validation.md`. Check desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

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

Checked on: not run yet. When it is, a dated line goes here saying when, where and how, and what was not checked.

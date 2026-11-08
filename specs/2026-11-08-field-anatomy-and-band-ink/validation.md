# Field anatomy and the month band's ink (63, 64): validation

Branch: `feature/field-anatomy-and-band-ink`. Run on the agent's server (port 5199), then the baseline smoke test. Start each section after Profile's "Reset demo data" unless it says otherwise.

## 1. Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] `css/tokens.css` and `js/theme-engine.js` were regenerated from their sources, not edited (the diff shows `--color-separator-subtle` in both)
- [ ] No console errors on Overview, Payments, Account details, All bookings (all tabs), the position page, Profile and Components

## 2. The month band (63, D1 to D4, D10)

- [ ] All bookings, Executed, Pending and Recurring: each band is a faint 5% tint with its label, no solid secondary background
- [ ] Light, Dark, and a Multi-color theme in each: the band reads as a band, never as a hole or a box
- [ ] Saving a Multi-color theme and reloading keeps the band's colour from the first paint (boot script); "UZ Bank" restores the default look exactly
- [ ] First visit (nothing in `localStorage`): the band shows in the plain look
- [ ] Contrast of the label (`--color-fg-secondary`) on the band over `--color-bg`, recorded as ratios: Light ___, Dark ___, Multi-color Light ___, Multi-color Dark ___ (each at least 4.5:1, or noted)
- [ ] The strokes and dividers that use `--color-separator` are unchanged (still 10% in the plain look)
- [ ] 390px: the bands and the docked month chips look as before apart from the tint

## 3. The field anatomy (64, D5 to D8)

- [ ] A field's rows measure 24 / 4 / control / 4 / 16 dp at Regular type (a script reads the label's, the control's and the text row's boxes)
- [ ] Buy: with the Limit field's error shown and cleared, the order-duration control and everything below it do not move (measured to the pixel); the same in Sell
- [ ] Pay's amount step, the transfer's amount step, Buy and Sell's Amount and Limit, and the admin sign-in: height empty = height with a helper = height with an error
- [ ] A field with an info row (Amount's "Stock split 1") keeps its height when the info row gives way to an error
- [ ] The audit covers every field on every page and flow, in Light and Dark, 390px and desktop, Regular and Large type; its list of anything that wraps is in the checked line below, and each one is shortened or accepted in writing
- [ ] Every message fits one line at Regular on 390px
- [ ] ReadOnly fields (Account and Share information) look as before
- [ ] The sheets still fit: Buy, Sell, Pay and the transfer show their action without a new scroll where there was none; the fridge and the opening have no step that now scrolls
- [ ] Error behaviour unchanged (54): the error shows on leaving a typed field, clears live, Confirm checks every field and moves focus to the first error, closing never shows one
- [ ] `aria-invalid` and `aria-describedby` are set and cleared as before, and the empty reserved row has no text in it (read from the DOM)
- [ ] First visit (nothing in `localStorage`), Light and Dark, a Multi-color theme
- [ ] Keyboard: Tab through every flow's fields; the focus ring is visible and the order unchanged
- [ ] Reduced motion: nothing animates in a field's rows

## 4. The Components specimen (D9)

- [ ] The Form field specimen shows the anatomy with its 24 / 4 / 16 marks, empty, with a helper and with an error, all at one height
- [ ] Light, Dark, desktop and 390px; the text has no em dashes
- [ ] The admin guard: the Components page still asks for admin

## 5. Baseline smoke test

Copied from `specs/baseline/validation.md`. Setup: `cd apps/web && npm run build`, then open the app. Desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

### 5.1 Build

- [ ] `npm run build` succeeds with no new warnings
- [ ] The browser console shows no errors on any page visited below

### 5.2 Shell

- [ ] ★ Overview loads with sidebar (desktop) or tab bar (phone); the 3D character appears in the lower right on desktop
- [ ] ★ Light/Dark toggle switches instantly and survives a reload
- [ ] Navigating Overview → Account details → All bookings and back plays the page transitions in the right directions
- [ ] The "Open payment!" status message appears after about 12 s on a main view; tapping it dismisses it (see roadmap 67 for its real timing)

### 5.3 Banking flows

- [ ] ★ Pay: recipient search → recipient → amount → schedule → summary → confirm; the balance and bookings update
- [ ] Internal transfer completes
- [ ] Custody account → a position → Buy opens the trade flow and can be dismissed
- [ ] All bookings: tabs, month chips and search work

### 5.4 Profile

- [ ] ★ User Type: moving a slider snaps to an anchor and changes the character, title and preview
- [ ] Legibility: a preset changes type and spacing app-wide; Typeface, Font and Paddings work
- [ ] ★ Theme: picking a Multi-color theme recolours every page (focus rings and primary buttons take the accent); the UZ Bank card restores the default look exactly
- [ ] Demo data reset restores the Household balance

### 5.5 Design system (signed in as admin)

- [ ] The Design system hub shows Motion, Components and Character kit; only the trailing arrows move
- [ ] Motion specimens, Components and Character kit open, and back returns to the hub
- [ ] The Character kit specimen loads and the profile buttons change the figure

### 5.6 Accessibility

- [ ] Tab through Overview: focus is always visible
- [ ] With reduced motion on (System Settings → Accessibility → Display), page transitions and the character are still, and nothing is stuck mid-animation

Checked on: (not yet run)

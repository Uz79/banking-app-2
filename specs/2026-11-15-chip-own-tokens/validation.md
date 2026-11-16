# Chip: its own tokens (48): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`. Check Light and Dark (the sidebar's theme button), desktop and 390px.

## Build

- [ ] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Account details, All bookings, Payments and the Components page

## Tokens

- [ ] `designs/tokens/mapped/light.json` and `dark.json` differ from `main` only by the new `chip` key, equal to the 260617 export's
- [ ] `css/tokens.css` has the 15 `--color-chip-*` tokens in Light and in Dark, and nothing else changed in it
- [ ] Light: filled tonal background is the primary ink at 5%, border at 0%, foreground the primary ink; Dark: white at 10%, border 0%, foreground white
- [ ] Primary and secondary match Figma's `chip/primary` and `chip/secondary` values in both shells

## Multi-color themes and saved caches

- [ ] Picking a Multi-color theme sets all 15 tokens on the page, in Light and in Dark
- [ ] The UZ Bank card restores the default look exactly
- [ ] A saved cache without the tokens (clear them in `localStorage`, keep `uzBankWebColorTokens`) gains them on the next load, with no flash of an unfilled chip, and `uzBankWebChipTokens_v1` is set
- [ ] First visit (nothing in `localStorage`): chips are filled correctly on the first paint

## The chips in the app

- [ ] "Pending" and a frequency chip ("Monthly") on All bookings (all three tabs) and Account details: readable, same size and shape as before
- [ ] Light: the tonal chip looks as it did; Dark: it is slightly lighter (10%)
- [ ] The sheet's status chip (`#uz-pd-status-chip`) on a booking and on a standing order is unchanged
- [ ] No other chip moved: month chips, performance range chips, the assistant's chips, the theme flow's chips

## Components page and docs

- [ ] The Chip section shows regular and small in primary, secondary and filled tonal, with and without icon and dismiss, in Light and Dark, desktop and 390px
- [ ] Tab through the dismiss buttons: the focus ring is visible (`--color-fg-interactive`)
- [ ] Reduced motion: nothing in the section animates
- [ ] `designs/components/chip/chip.md` lists the three cases, the tokens and the unbuilt states; no em dashes
- [ ] Contrast of each case's text on its fill, at least 4.5:1 for the small chip: Light, Dark, a Multi-color theme in each shell (numbers written here when measured)
- [ ] The admin guard on the Components page still redirects when not signed in

## Baseline smoke test

Copied from `specs/baseline/validation.md`. Run desktop (1440px) in Light, then repeat the starred (★) items in Dark and at phone width (390px).

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

Checked on: not run yet.

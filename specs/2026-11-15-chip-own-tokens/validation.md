# Chip: its own tokens (48): validation

Setup: `cd apps/web && npx vite --port 5199 --strictPort --no-open`, open `http://localhost:5199/overview.html`. Check Light and Dark (the sidebar's theme button), desktop and 390px.

## Build

- [x] `npm run build` in `apps/web` succeeds with no new warnings
- [ ] No console errors on Overview, Account details, All bookings, Payments and the Components page (not read: the console tool was not used)

## Tokens

- [x] `designs/tokens/mapped/light.json` and `dark.json` differ from `main` only by the new `chip` key, equal to the 260617 export's
- [x] `css/tokens.css` has the 15 `--color-chip-*` tokens in Light and in Dark, and nothing else changed in it
- [x] Light: filled tonal background is the primary ink at 5%, border at 0%, foreground the primary ink; Dark: white at 10%, border 0%, foreground white
- [x] Primary and secondary match Figma's `chip/primary` and `chip/secondary` values in both shells

## Multi-color themes and saved caches

- [x] Picking a Multi-color theme sets all 15 tokens on the page, in Light and in Dark (checked in the engine for all 12 built-in themes, both shells, and on the page for the default Multi-color theme)
- [x] The UZ Bank card restores the default look exactly
- [x] A saved cache without the tokens (clear them in `localStorage`, keep `uzBankWebColorTokens`) gains them on the next load, and `uzBankWebChipTokens_v1` is set (no flash was not looked for frame by frame)
- [x] First visit (nothing in `localStorage`): chips are filled correctly on the first paint

## The chips in the app

- [x] "Pending" and a frequency chip ("Monthly") on All bookings (all three tabs) and Account details: readable, same size and shape as before
- [x] Light: the tonal chip looks as it did; Dark: it is slightly lighter (10%)
- [ ] The sheet's status chip (`#uz-pd-status-chip`) on a booking and on a standing order is unchanged (its token value was read, the same colour as before; the sheet was not opened)
- [ ] No other chip moved: month chips, performance range chips, the assistant's chips, the theme flow's chips

## Components page and docs

- [x] The Chip section shows regular and small in primary, secondary and filled tonal, with and without icon and dismiss, in Light and Dark, desktop and 390px
- [x] Tab through the dismiss buttons: the focus ring is visible (`--color-fg-interactive`)
- [ ] Reduced motion: nothing in the section animates
- [x] `designs/components/chip/chip.md` lists the three cases, the tokens and the unbuilt states; no em dashes
- [ ] Contrast of each case's text on its fill, at least 4.5:1 for the small chip: Light, Dark, every built-in Multi-color theme in each shell. **Not met in some themes, all as before:** plain look 12.1 to 14.9 (Light) and 6.2 to 14.9 (Dark); the primary chip is 3.31 to 4.38 in Custom 10, 01, 06, 05, 04, 02, because it still has the primary button's colours in those themes; Custom 02 in Light has secondary 4.03 and filled tonal 3.81 (its ink on its own tint, the same as the tonal chip had). Nothing got worse; fixing the themes is not part of this item
- [x] The admin guard on the Components page still redirects when not signed in

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

The baseline smoke test: `npm run build` only. Pay, the transfer, Buy, the Profile pages, the Design system hub and reduced motion were not run; this branch changes no code those use besides the colour tokens and `js/theme-boot.js`, which every page loads.

Not run: the 390px frame was checked on the Components page only (no horizontal overflow), not on All bookings; reduced motion (the chip has no transition, `transition-duration` is 0s); VoiceOver; the Account details chips and the Recurring tab by eye; the legacy "chip-*" names in `themeColors.ts` were left alone and not traced beyond a grep.

Checked on 2026-11-16 against `feature/chip-own-tokens`, Chrome on the agent's server (5199), Light and Dark desktop (about 1500px), one 386px-wide frame, the default Multi-color theme and the plain UZ Bank look on the page, all 12 built-in themes in the engine (node).

# Mobile Light/Dark toggle: requirements

Branch: `feature/mobile-mode-toggle`

## Scope

On mobile, a button in the upper left of the top bar swaps Light and Dark, with a sun or moon icon showing the current mode. Requested directly; it is not on the roadmap (it is added there as item 4 and linked to this folder).

In:

- The four main screens, Overview, Payments, Profile and Design system (admin), under 1280px wide, where the tab bar is shown.
- One button, using the existing Light/Dark switch (`UZBankApplyThemeChoice`), so Multi-color themes work as they do from the sidebar.

Out:

- Deeper screens (Account details, All bookings, Details of position, Investment product details, the specimen pages and the Playground). Their left slot holds the back arrow.
- Desktop (1280px and up): the sidebar already has Light and Dark.
- Any change to the sidebar control, the Profile Theme card, the theme engine or the colour tokens.

Interview outcome: the four main screens only; the icon shows the current mode; the merge gate is `npm run build`, the feature's browser checks and the baseline smoke test (no real-phone requirement).

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | The button takes the top bar's leading slot on the four main screens. Today that slot holds a hidden placeholder (`.view__nav-btn--leading.view__nav-btn--hidden`) in `overview.html`, `payments.html`, `profile.html` and `design-system.html`; the placeholder is replaced by the real button | The slot is empty on these screens and is exactly where the request points. Deeper screens need it for Back |
| D2 | Mobile only: shown under 1280px, the same breakpoint where the tab bar replaces the sidebar; hidden at 1280px and up | The sidebar already has the control on desktop |
| D3 | The button is the design system's small glyph-only button, `uz-btn uz-btn--sm uz-btn--icon-only` (32 × 32 dp: 4 dp padding and a 24 dp icon, no border or fill, hover and pressed from the component), using the sprite symbols `#i-sun` and `#i-moon`. It sits in the bar's leading slot at the same left inset as the bar's other buttons (`--space-3`), vertically centred. Review decision: 32 dp, not the bar's 44 dp icon buttons | Reuses the existing component (`designs/components/button/icon-only-button`); no new button style |
| D4 | The icon shows the current mode: sun in Light, moon in Dark. Both icons are in the markup and CSS shows one by `html[data-theme]`, so the right icon is there before first paint and stays right when the theme changes from anywhere (sidebar at a resized window, Profile Theme card, another script) | The boot script sets `data-theme` before paint; no JS is needed for the icon, so there is no flash and nothing to keep in sync |
| D5 | Tapping calls `UZBankApplyThemeChoice(other mode)`, the same function the sidebar buttons use. The switch is instant (no animation, as in the sidebar), so there is no new motion to give a reduced-motion path | One code path for the switch; Multi-color themes and `uzBankWebTheme` persistence come with it |
| D6 | Accessibility: the button's accessible name names the action, "Switch to Dark mode" or "Switch to Light mode", updated when the mode changes. It has no `aria-pressed`. The focus ring is the existing `--color-fg-interactive` outline | The name already carries the state; a pressed state would repeat it |
| D7 | A new small classic script, `js/mode-toggle.js`, wires the click and keeps the accessible name current. It is loaded on the four pages only. No new storage key | Keeps the change out of `app.js`/`app-mp.js`, which every page loads |
| D8 | The page transition (tectonics) and its stand-in cards are not changed; the button is part of the top bar, which does not take part in them | Out of scope |
| D9 | Review change: the button keeps no hover fill after a tap on a touch screen (`@media (hover: none)` clears the hover fill, except while pressed). Desktop hover is unchanged | Touch browsers leave `:hover` on the last tapped element |

## Context

- Top bar markup: `<header class="view__nav">` with a leading button, the title and a trailing button; both buttons are hidden placeholders on the main screens (`overview.html:2365`). `.view__nav-btn` is in `css/styles.css` near line 570 (absolutely positioned, 2.75rem, hover and pressed use the state tokens).
- The switch: `UZBankApplyThemeChoice` in `js/app-mp.js` applies the cached colour tokens for the other shell, calls `applyTheme` (sets `data-theme`, saves `uzBankWebTheme`, updates the sidebar segmented control and the `color-scheme` meta) and dispatches `uzbank:picker-sync`.
- Sprite: `#i-sun` and `#i-moon` already exist in each page's sprite (the sidebar uses them).

## Open questions

1. (Resolved: 32 dp glyph-only, D3.) Check that a 32 dp target is comfortable enough next to the 44 dp bar buttons on a phone; the title and the tab bar stay as they are.
2. Should the button be visible on the main screens when a status message sits above the bar? (Default: yes; the message is part of the sticky header and does not cover the slot. To be seen in the browser.)

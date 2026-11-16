# Scroll boundary indication — implementation notes

## Overview

`apps/web/js/scroll-edge-chrome.js` exports `window.UZBankScrollEdgeChrome.bind(root, options)`. It listens to the scrollport, compares `scrollTop` to content height, and toggles CSS classes that apply tokenized box shadows.

## Design spec (`overview.png`)

The annotated board in `overview.png` (formerly `content-indication/overview.png`) is the source for shadow intent. Figma labels the effect on chrome edges with snippets along these lines:

```css
/* Figma annotation (light mode reference) */
box-shadow: 0 -2px 30px 0 #FFFFFF20;  /* top bar — content beneath */
box-shadow: 0 2px 30px 0 #FFFFFF20;   /* bottom bar — content above */
```

Treat these as **design targets** (2px offset, 30px blur, ~20% opacity). The web app maps them to theme-aware tokens so light and dark mode stay legible.

## CSS tokens (app)

Defined in `apps/web/css/styles.css`:

```css
--color-overlay-tint: var(--color-fg); /* light: dark navy; dark: bright fg — visual invert */
--shadow-content-indication-after: 0 0.125rem 2rem color-mix(in srgb, var(--color-overlay-tint) 10%, transparent);
--shadow-content-indication-before: 0 -0.125rem 2rem color-mix(in srgb, var(--color-overlay-tint) 10%, transparent);
--color-overlay-scrim: color-mix(in srgb, var(--color-overlay-tint) 45%, transparent); /* light; 62% on dark */
```

Always tint from **foreground**. Light mode yields a dark scrim/shadow; dark mode inverts visually because foreground is bright.

## Classes

| Class | Edge | Applied to |
|-------|------|------------|
| `is-scroll-edge--after` | Top / downward shadow | Nav, sticky headers, modal header |
| `is-scroll-edge--before` | Bottom / upward shadow | Tab bar, modal footer, disclosure footer |
| `is-scroll-edge--stuck` | Sticky element has pinned | Combined sticky headers (all-bookings) |

Global rules:

```css
.modal__nav.is-scroll-edge--after,
.view__nav.is-scroll-edge--after,
[data-scroll-edge-nav].is-scroll-edge--after {
  box-shadow: var(--shadow-content-indication-after);
}

.tab-bar.is-scroll-edge--before,
.modal__footer.is-scroll-edge--before,
[data-scroll-edge-footer].is-scroll-edge--before {
  box-shadow: var(--shadow-content-indication-before);
}
```

## Scrollport markup

Mark the element that scrolls:

```html
<main class="main-content" data-scroll-edge>
  <!-- scrollable body -->
</main>
```

Legacy alias `[data-ai-scroll]` is still supported.

Mark chrome that participates:

```html
<nav class="view__nav" data-scroll-edge-nav>...</nav>
<footer class="tab-bar" data-scroll-edge-footer>...</footer>
```

## Binding

### Shell views (overview, payments, account-details, …)

`apps/web/js/app-mp.js` → `bindMainScrollChrome()`:

- Root: `.app`
- Nav: `[data-scroll-edge-nav]`
- Scrollport: `.main-content`
- Footer (≤1279px): `.tab-bar`

Requires `scroll-edge-chrome.js` on the page.

### All bookings (combined sticky header)

`apps/web/js/all-bookings.js` binds with `stickyAfter: '.all-bookings__sticky-header'` so title + month chips share one sticky unit and one shadow, matching Figma Sticky TopBar.

### Modals / overlays

Pass `nav: '.modal__nav'` and `footer: '.modal__footer'` (defaults). When nav sits **above** the scroll region, `scrollTop > 1` drives the top shadow. When nav is **inside** the scrollport, pin detection uses `getBoundingClientRect` against the scroll edge.

## Logic summary

| Check | Top shadow (`--after`) | Bottom shadow (`--before`) |
|-------|------------------------|----------------------------|
| Overflow? | Required | Required |
| Not at bottom | For sticky-after targets | Required |
| At top | Suppress if nothing hidden above | Bottom shadow still on when content continues below |
| At bottom | Top may still show if header pinned | Suppress |

Tolerance: `1px` for sub-pixel rounding.

`ResizeObserver` on root + `resize` listener re-run state when layout changes.

## Checklist for new screens

1. Add `data-scroll-edge` on the scroll container.
2. Add `data-scroll-edge-nav` / `data-scroll-edge-footer` on fixed chrome (or use default class selectors).
3. Include `scroll-edge-chrome.js` and call `UZBankScrollEdgeChrome.bind` (or extend `bindMainScrollChrome` screen list).
4. Do **not** set a default `box-shadow` on `.tab-bar` or `.view__nav` — shadow must be class-driven only.
5. Match a `*-content-indication` screen variant in Figma when exporting design proof.

## iOS app (`apps/ios`)

| File | Role |
|------|------|
| `EBanking/DesignSystem/Colors.swift` | `overlayScrim`, `contentIndicationShadow` — foreground tint (45%/62% scrim, 10%/25% shadow) |
| `EBanking/Components/ForegroundScrimSheet.swift` | Custom bottom sheets with foreground scrim (replaces UIKit `.sheet` dimming) |
| `EBanking/Components/ScrollEdge.swift` | Chrome shadow modifiers |
| `EBanking/Views/MainTabView.swift` | Tab bar reads `scrollEdge.bottomShadow`; resets on tab change |

Logic mirrors the design rule table: bottom shadow when content overflows and the user has not reached the bottom (`!atBottom`), including at scroll top (`mobile-bottom-indication`). Top shadow when `offsetY > 1`; both off at scroll bottom.

Shell screens wrap scroll content in `EdgeShadowScroll` and apply `.topChromeShadow(topShadow)` on `CustomNavBar`.

## Related files

| File | Role |
|------|------|
| `apps/web/js/scroll-edge-chrome.js` | State machine |
| `apps/web/js/app-mp.js` | Shell binding |
| `apps/web/js/all-bookings.js` | Sticky header binding |
| `apps/web/css/styles.css` | Tokens + class rules |

# Native text trim (86): requirements

Branch: `feature/native-text-trim`

## Scope

In: replace the margin trick (`.type-trim`, `--trim-*`, `--text-trim-*`, `--text-row-gap`) with the browser's `text-box: trim-both cap alphabetic` on the type classes, so text boxes run from cap height to baseline as the Figma text styles do; then retune every component's padding and gaps to the clean Figma values (8, 12, 16, 24). Roadmap item 86 (Next), before Design System 1.0's item 5. One branch, all of it (interview): the foundation, Status Message, Date Picker and Scale Preset Card, then one task group each for Overview, Payments, Accounts, Bookings, Profile, the fridge, the opening and the assistant, then the modal, dialog and carousel cases, then the cleanup of the old model.

Out:
- Design system pages (Motion, Components, Character kit) and the Playground, except where a shared component they use changes.
- Changing type sizes, line heights or the typefaces; only the box around the text moves.
- A fallback for browsers without `text-box` (D3).
- Rebuilding the pages with library instances (Design System 1.0's item 5).

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | One branch for all of item 86, in the task groups of `plan.md`, each committed and browser-checked at 390px and 1024px before the next. | Interview answer. The app and the library need one spacing model before item 5; a half-trimmed app keeps two. |
| D2 | `text-box: trim-both cap alphabetic` goes on the twelve type classes (`.type-hero` to `.type-caption`) in `css/typography.css`. `.type-trim` stays as an empty alias while markup is migrated, then is removed from markup, stories and CSS in the cleanup group. | The item's own plan. The alias keeps each group's diff small and the app working between commits. |
| D3 | No fallback for browsers without `text-box` (Firefox at the time of writing). The margin math is deleted, not kept behind `@supports not`. In such a browser text sits a few px lower in components. The first group records the support check (Chrome, Safari, Firefox, with versions) in `specs/tech-spec.md`. | Interview answer: one model is the point of the item; the audience is mostly Chrome and Safari. |
| D4 | `--trim-top-*`, `--trim-bottom-*`, `--text-trim-top`, `--text-trim-bottom` and `--text-row-gap` are removed from the generator (`scripts/generate-tokens-css.mjs`) and from `css/tokens.css` and `css/typography.css` once nothing reads them (cleanup group). | They encode Profile Pro's metrics by hand; the browser now reads the loaded font's own. Generated files are never edited by hand. |
| D5 | Every `calc(var(--space-n) + var(--trim-...))` padding and every `var(--text-row-gap) - trim` gap becomes the clean value from the Figma component (8, 12, 16 or 24, through the `--space-*` tokens). | Item 86; "trim compensation" disappears from the CSS. |
| D6 | The size check is a repo script, `scripts/measure-text-offsets.js`, pasted into the browser console or run through the browser tool. For each listed element it reports the distance from the component edge to the cap top and to the baseline, in px, and compares with the Figma values in `targets.md`. | Interview answer. The Design System 1.0 repo is not on this machine, so its check cannot be run here. |
| D7 | Gate: zero differences above 1px against `targets.md` for Status Message, Date Picker, Scale Preset Card and every component a page group retunes, at 390px and 1024px, Light and Dark. | The item's gate. |
| D8 | The font's own metrics decide the trim, so each typeface in Profile (Typeface, Font) trims to its own cap height and baseline. One page is checked in every typeface. | The old tokens were computed for Profile Pro only; this is a change in behaviour for the other faces, so it is checked, not assumed. |
| D9 | The modal, dialog and carousel cases that broke the first attempt (the comment at `css/typography.css:175`) are fixed in the layout, not by reverting to margins: each is checked and recorded in `validation.md`. A case that cannot be fixed is brought to Klaudiusz before it is left on the old model. | Item 86 asks for those checks; a second model must not creep back in. |
| D10 | Large legibility (the spacing scale) is checked on the dense pages (Overview, All bookings, the opening). Clean values stay on the `--space-*` tokens so the scale still applies. | Legibility scales the tokens, not the trim. |
| D11 | Each group first measures, then retunes, and lists in `targets.md` what moved (element, before px, after px). | A visible record, since there are no screenshots in the gate. |
| D12 | No new page, dependency or storage key. The Storybook stories that use `.type-trim` follow the migration. | `tech-spec.md`: nothing new. |
| D13 | `specs/tech-spec.md` gets a Decisions row: one spacing model, native trim, no fallback. | AGENTS.md: the specs describe the product as it is. |

## Context

- `css/typography.css` (lines 124 to 175): `.type-trim` is `display: block` with negative margins from `--text-trim-top` and `--text-trim-bottom`; `.type-stack-tight` and its sibling rules add trim-aware gaps; the comment at line 175 records why `text-box-trim` was dropped before ("inconsistent stack/row layout in modals and carousels"). The same comment is emitted by `scripts/generate-tokens-css.mjs` (line 353), so it must change there.
- The tokens come from `leadingTrimPx` in `scripts/generate-tokens-css.mjs` (line 91): half leading plus ascender minus cap height at the top, half leading plus descender at the bottom, from Profile Pro's metrics.
- Use today: about 74 `.type-trim` occurrences in the five main pages, partials, `js/data-render.js`, `js/investment-positions.js` and Storybook stories; 11 rules in `css/styles.css` read `--trim-*` or `--text-row-gap` (for example lines 1355, 1626, 1661, 1712, 8522, 8566). Components that do not trim at all (Status Message, Date Picker, Scale Preset Card) sit 5 to 8px off the Figma values (measured in Design System 1.0's `specs/2026-11-22-components-born-in-code/validation.md`, not readable here).
- Item 87 rewrites the Payments page's cards; it comes after this item, so the Payments group retunes the cards as they are.
- `text-box` is a CSS Inline Layout property: Chrome 133 and Safari 18.2 support it. The first group confirms the versions and Firefox's state before D3 is relied on.

## Open questions

- Where the Figma values per component come from. The item names 8, 12, 16 and 24 and three measured components, but the per-component targets must be read from the Figma component frames (the Figma file link or node ids are needed) or from the Design System 1.0 table; `targets.md` is filled from them in the first group.
- Whether every `.type-*` use should trim, or only those listed in the Figma component. A heading inside a free-flowing text block may want its leading kept (D2 trims all; exceptions get a class, recorded in `targets.md`).
- Whether the admin-only design system pages need a visual check after the type classes change (they share them), even though they are out of scope for retuning.

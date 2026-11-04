# 3D stages read the latest visibility entry (20): requirements

Branch: `feature/observer-latest-entry`

Roadmap item 20 (`specs/roadmap.md`), found during 9c. A 3D stage draws only while it is on screen, told by an `IntersectionObserver`. One callback can carry several entries for the same element (scrolled past quickly), oldest first, so a callback that reads `entries[0]` acts on a stale state: the stage can stay still while on screen, or keep drawing while off it. The Vehicles stage on the Character kit already reads the latest entry (9c).

## Scope

**In:**

1. The helper specimen on the Character kit (`character-kit.html`) reads the latest entry (D1)
2. The shared persona stage (`mountStage` in `js/profile-persona-character.js`) reads the latest entry. It draws the Character kit's live specimen, Profile's persona and the ambient figure on the five main screens (D2)

**Out (not in this branch):**

- The two one-shot "play once when first seen" triggers on Motion specimens (`motion-specimens.html`): they also read `entries[0]`, but the worst case is playing once while just off screen; nothing stays stuck (D3)
- The opening's helper (`js/opening-assistant-helper.js`): it has no observer
- Other open roadmap items (22, 23 and on stay separate, per the interview)

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **The helper specimen** reads `entries[entries.length - 1]`, the same line as the Vehicles stage | The roadmap item; one rule for both stages on the page |
| D2 | **The persona stage** (`mountStage`) reads the latest entry too, which fixes the kit's live specimen, Profile and the ambient figure at once | Interview: the same pattern, shared by every page with the persona; the roadmap's "whether the specimen's own stage has the same pattern" is answered yes |
| D3 | **Motion specimens' one-shot triggers stay as they are** | Interview. No visible bug: a stale entry can only start a one-time demo a little early |
| D4 | **No other change:** no new helper function, no refactor of the render loops, no change to when or how often the stages draw | AGENTS.md: small, contained diffs. Two one-line edits |
| D5 | **The merge gate** (interview): `npm run build`; a scripted check that hands each observer callback a stale-then-fresh entry pair and reads whether the stage draws; a real fast scroll past each stage on desktop and at 390; this branch's `validation.md`; the baseline smoke test | The bug needs several entries in one callback, which normal scrolling rarely produces, so the forced case proves the fix |

## Context

- `apps/web/character-kit.html` near line 2789: the helper's observer, `visible = entries[0].isIntersecting`. Near line 2826: the Vehicles stage's observer, `vVisible = entries[entries.length - 1].isIntersecting`.
- `apps/web/js/profile-persona-character.js` near line 554, inside `mountStage()`: `visible = entries[0].isIntersecting`, with `clock.getDelta()` on becoming visible so the first frame does not jump. `mountStage` is called by `init()` for the specimen (`[data-character-specimen]`), Profile (`#profilePanelPersona`) and `mountAmbient()` (`AMBIENT_SCREENS`: overview, payments, account-details, investment-product-details, details-of-position). On a phone the ambient stage is removed (no room), so only Profile and the kit draw it at 390.
- The ambient figure sits fixed in the corner, so it rarely leaves the viewport; the bug matters most for the kit's specimens and Profile's panel.

## Open questions

None.

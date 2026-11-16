Branch: `feature/focus-mode-sample-dark`

# Focus-mode sample keeps its panel in Dark (66): requirements

Roadmap item 66 (`specs/roadmap.md`), reported 2026-11-06 and corrected by Klaudiusz on 2026-11-16: on Motion specimens, No. 002 Focus-mode choreography loses its stage panel in Dark. Its left column (the course text) melts into the page.

## Scope

**In:** `apps/web/motion-specimens.html`, the two `.s2-stage` background rules (D1), and a look at No. 001's Dark stage (D2).

**Out:** `.ms-sheet`, `.s6-card` and `.s8-msg` (inner elements meant to stand out from the stage, D3); any other specimen; the sample's motion and markup; tokens.

## Decisions

| # | Decision | Why |
|---|---|---|
| D1 | **Remove `background` from `.s2-stage` and from `html[data-theme="dark"] .s2-stage`.** Keep `container-type`, `--k`, `--s2-ink` and `--s2-paper` as they are | Every sample stage and Core CSS block takes `background: var(--ms-surface)` (`--color-bg`) from `.ms-stage` (line 89) and `.ms-code pre` (line 120), which reads as a framed panel on the `--color-bg-secondary` page in both modes. The two overrides break that: Light sets the same `--color-bg`, Dark sets `--color-bg-secondary`, the page colour. The Dark ink/paper swap stays, it colours the cube |
| D2 | **No. 001's Dark stage (`.s1-stage`, line 134) is checked, not changed unless it shows the same problem** | It has its own Dark gradient with `--color-bg` at the sides; it is compared with No. 003 in Dark and the result is reported |
| D3 | **`.ms-sheet`, `.s6-card` and `.s8-msg` stay** | They sit on the stage and are meant to stand out from it |
| D4 | **Scope follows AGENTS.md: a short spec, one task group.** Nothing is committed by the agent: the work is left uncommitted on the branch for review in GitHub Desktop (the user's instruction, overriding the usual per-group commit) | Small fix |
| D5 | **Roadmap 66's text is corrected** to describe the real problem (left column, Dark, `.s2-stage` background override) | The old text said "right column keeps a white background", which cannot be reproduced |

## Context

- The agent could not reproduce the old wording: in Dark the stage was `rgb(57, 67, 63)` (`--color-bg-secondary`) and nothing was white. That is the page colour, so the panel is invisible.
- Colour only through `--color-*` tokens; no new token is needed.

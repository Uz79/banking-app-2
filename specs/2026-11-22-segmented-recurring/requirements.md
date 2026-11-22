# Segmented controls and "Recurring" (84): requirements

Branch: `feature/segmented-recurring`

## Scope

In:
1. The sidebar's Light / Dark switch becomes one segmented control (small variant), both options inside one track, the active one highlighted. Behaviour and persistence unchanged.
2. Pay's schedule step: the "Standing order" tab goes (Single, Recurring only). "Recurring" is the one term in UI copy, code names and the living docs. In Recurring, the toggle goes and the date field is labelled "First payment"; Single is unchanged.
3a. (D9) Labels above segmented controls use the shared label row.
3. The Repeats control uses the small variant, like the Single / Recurring control above it. Other segmented controls that mix sizes in one form are listed, not changed.

Out: changing any other mixed-size control found in 3; the transfer flow's "Immediately" label (kept, see D6); rewriting the dated spec folders and CHANGELOG entries from before this one, which are a record (D2).

## Decisions

| # | Decision | Why |
|---|----------|-----|
| D1 | The theme switch is `.segmented.segmented--sm.segmented--theme`: a row (Light, Dark) in the expanded sidebar. In the compressed sidebar (icons only, 47px wide) the same track runs as a column of two icon cells. | Two icon cells side by side do not fit 47px. One track, one active cell, in both. |
| D2 | "Standing order" becomes "Recurring" / "recurring payment" in UI copy, code names (`STANDING_ORDERS` to `RECURRING_RULES`, `standingOrders()` to `recurringRules()`), comments, `README.md`, `specs/roadmap.md`, `specs/tech-spec.md` and the transfer-edit spec (51). Older dated spec folders and CHANGELOG entries keep their words, and folder names and links are not renamed. | A rename of history would make each spec disagree with what it records. |
| D3 | No state value changes: a stored rule is already `status: 'recurring'`; "Standing order" was only a tab that stored the same thing. | Nothing in storage to migrate. |
| D4 | Revised: in Recurring the toggle row is hidden and nothing reads it; the date field alone is the first payment, labelled "First payment" (also in the summary step and the field's screen reader label). It keeps its behaviour and default (the first working day, as asap gave). The stored `executeOn` and the confirmation sentence read `live.dateLabel`, as before. Single keeps "As soon as possible" and "Execute on". The hidden toggle only follows the date so Single reopens consistent. | The toggle added a second way to say the same thing. |
| D5 | Revised: no toggle and date interplay in Recurring; the date is never replaced by the as-soon-as-possible day. Single keeps the two-way link of 40. | Picking a date in Recurring must stick. |
| D6 | The transfer flow's own labels ("Single execution", "Recurring execution", "Immediately") stay. Its Repeats control is small too. | Not asked; its wording differs for its own reasons. Listed for review. |
| D7 | Repeats uses `segmented--sm` in Pay and in the transfer flow; the mode switch gets `segmented--sm` explicitly (its look does not change). | One size inside each form. |
| D9 | A label above a segmented control uses the shared label row (`.form-field` with `.form-field__label`: 24px row, 14px type, 4px gap, `--form-field-label-row` and `--form-field-gap`). Repeats, the Playground's segmented settings, the theme panel's Theme and the Character kit's controls were bypassing it and now use it. No margin is hardcoded to match. | A label that bypasses the row sits at a different distance from its control. |
| D8 | No new storage key, page or dependency. | `tech-spec.md`: nothing new. |

## Context

- `.segmented` has no size class by default but its cells are 2rem tall, so it already measures as small (36px). `segmented--regular` is 44px.
- The theme switch lives in 11 pages' sidebar, `scripts/generate_mp_pages.py`, and several stories; `app.js` / `app-mp.js` bind it through `.segmented--theme .segmented__option` and `data-set-theme`, so markup classes can change without touching them. `shell-nav.js` adds the icons and labels.
- The Pay schedule step is in `overview.html`, `payments.html`, `account-details.html`, `all-bookings-and-payments.html`, `spa-source.html`; logic in `js/payment-overlay.js`.

## Open questions

- None.

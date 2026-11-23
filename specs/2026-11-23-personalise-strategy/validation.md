# Personalise your strategy (9g): validation

## Build

- [ ] `npm run build` in `apps/web` succeeds

## The screen

- [ ] From the summary, "Personalise" opens one screen with Thematic focus, Alternative investments and Regional focus
- [ ] Nothing is preselected except "Not included"; themes are checkboxes (several at once), region is one choice
- [ ] The alternatives risk line is visible without opening anything and names the extra risk (price swings, harder to sell)
- [ ] The intro says the choices do not change the strategy
- [ ] "Clear my choices" returns all three groups to the defaults
- [ ] No em dashes in any new text

## The summary and the flow

- [ ] A customer who never opens it sees no extra step, no new count in the indicator, and "Open product" works
- [ ] Choosing and returning shows Themes, Alternatives and Region on the summary, only for what was chosen
- [ ] "Not included" alone, with no theme and no region, reads "Not personalised"
- [ ] Back and the primary button both return to the summary, never on to completion
- [ ] The recommendation, the chosen strategy and the vehicle do not change with any choice
- [ ] Editing a strategy answer after personalising keeps the personalisation
- [ ] The draft: reload keeps the choices; completing or the demo reset clears them; a hand-edited draft with unknown ids does not break the screen
- [ ] First visit (nothing in storage) and a resumed draft from before this change both open

## The assistant

- [ ] Chips on the screen: thematic focus, alternatives and their risk, does it change my strategy or return, is it required
- [ ] Newbie, All-rounder and Power user: same wording, different length
- [ ] Every answer explains and never says what to pick; no promise of return
- [ ] The screen never nudges (with `?nudge=fast`, each User Type)
- [ ] Desktop column and the phone's Help?

## Look, access and motion

- [ ] Contrast 4.5:1 or more for every new text and selected state, measured, in Light, Dark and a Multi-color theme
- [ ] Desktop (1440): the screen fits the fixed-height sheet, or the group that does not fit opens in place
- [ ] 390px: nothing scrolls sideways, the action stays reachable
- [ ] Keyboard: Tab order, Space on checkboxes, arrow keys on radios, visible focus ring, Escape and Back as on the other screens
- [ ] Screen reader names: each group has a label, the section's Edit is named by its section
- [ ] Reduced motion: no new motion; the screen change follows the opening's reduced-motion path

## Baseline smoke test

(Copied from `specs/baseline/validation.md` when the checks are run.)

- [ ] Sections 1 to 6 of `specs/baseline/validation.md`

Checked on: not yet checked.

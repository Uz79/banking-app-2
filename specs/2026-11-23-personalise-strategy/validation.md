# Personalise your strategy (9g): validation

## Build

- [x] `npm run build` in `apps/web` succeeds

## The screen

- [x] From the summary, "Personalise" opens one screen with Thematic focus, Alternative investments and Regional focus
- [x] Nothing is preselected except "Not included"; themes are checkboxes (several at once), region is one choice
- [x] The alternatives risk line is visible without opening anything and names the extra risk (price swings, harder to sell)
- [x] The intro says the choices do not change the strategy
- [x] "Clear my choices" returns all three groups to the defaults
- [x] No em dashes in any new text

## The summary and the flow

- [x] A customer who never opens it sees no extra step, no new count in the indicator, and "Open product" works
- [x] Choosing and returning shows Themes, Alternatives and Region on the summary, only for what was chosen
- [x] "Not included" alone, with no theme and no region, reads "Not personalised"
- [x] Back and the primary button both return to the summary, never on to completion
- [x] The recommendation, the chosen strategy and the vehicle do not change with any choice
- [ ] Editing a strategy answer after personalising keeps the personalisation
- [x] The draft: reload keeps the choices; completing or the demo reset clears them; a hand-edited draft with unknown ids does not break the screen
- [ ] First visit (nothing in storage) and a resumed draft from before this change both open

## The assistant

- [x] Chips on the screen: thematic focus, alternatives and their risk, does it change my strategy or return, is it required
- [ ] Newbie, All-rounder and Power user: same wording, different length
- [x] Every answer explains and never says what to pick; no promise of return
- [ ] The screen never nudges (with `?nudge=fast`, each User Type)
- [ ] Desktop column and the phone's Help?

## Look, access and motion

- [x] Contrast 4.5:1 or more for every new text and selected state, measured, in Light, Dark and a Multi-color theme
- [ ] Desktop (1440): the screen fits the fixed-height sheet, or the group that does not fit opens in place
- [x] 390px: nothing scrolls sideways, the action stays reachable
- [ ] Keyboard: Tab order, Space on checkboxes, arrow keys on radios, visible focus ring, Escape and Back as on the other screens
- [x] Screen reader names: each group has a label, the section's Edit is named by its section
- [ ] Reduced motion: no new motion; the screen change follows the opening's reduced-motion path

## Baseline smoke test

(Copied from `specs/baseline/validation.md` when the checks are run.)

- [ ] Sections 1 to 6 of `specs/baseline/validation.md`

Checked on 2026-11-23 against `feature/personalise-strategy`, Chrome on port 5199, `investment-opening.html` on its own (a 1568×779 window, so the panel was 693px high, the same as the sheet at that window height) with a draft seeded at the summary through `sessionStorage`; 390px as a 390×740 same-origin iframe (not a window resize); `npm run build` passes. Light and Dark in the default green theme (a Multi-color theme: it is the one set), contrast measured by script with the alpha blended in. Done by script and screenshots, not by hand: the choices, the clear, the draft (reload on the screen resumes on the summary, a hand-edited draft with unknown ids is dropped), the summary line, Back, Open product, the keyboard handlers (arrow keys on the radios, one tab stop, the checkbox toggling), the group names, no console errors on the opening.

Not checked: the baseline smoke test (sections 1 to 6; only the opening was run, with a mandate created and removed); the opening opened through Overview > Offers > Investment in the real sheet at 1440 and its fixed height; the first visit with no storage; the assistant's three User Types (the chips were seen, the lengths by User Type were not); a nudge firing anywhere (`?nudge=fast` fired none on the summary either, so the absence on the screen is by the code, `screen` is null); a real Tab key walk and a screen reader; reduced motion; the Bank default (blue) theme; a different Multi-color theme; the true window resize to 390px.

Found: secondary text (`--color-fg-secondary`) measures 3.89:1 in Light on the default theme, for notes and texts that already existed. The new texts avoid it (D12); the rest is roadmap 85.

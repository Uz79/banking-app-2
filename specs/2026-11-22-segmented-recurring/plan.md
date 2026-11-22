# Segmented controls and "Recurring" (84): plan

Branch: `feature/segmented-recurring`. Decisions cited from `requirements.md`.

## 1. Theme switch (D1)

- [ ] `css/styles.css`: drop the stacked `.segmented--theme` rules; compressed sidebar runs the track as a column
- [ ] Add `segmented--sm` to every copy of the switch (pages, `scripts/generate_mp_pages.py`, stories)
- [ ] Check: expanded and compressed sidebar, Light and Dark, desktop and 390px

## 2. Recurring (D2 to D5)

- [ ] Remove the "Standing order" tab in the five pages and two stories; `js/payment-overlay.js` mode logic and sentences
- [ ] Rename standing order to Recurring in code and living docs
- [ ] Recurring: hide the toggle row, label the date field "First payment" (`js/payment-overlay.js`, `js/date-picker.js`)
- [ ] Check: Pay schedule step, Single and Recurring, toggle and date

## 3. Repeats size (D6, D7)

- [ ] `segmented--regular` to `segmented--sm` on the Repeats group (pages, `partials/iat-overlay.html`); `segmented--sm` on the mode switch
- [ ] Search for other mixed-size segmented controls and list them in the validation notes

## 3b. Label row (D9)

- [ ] Repeats, Playground settings, theme panel, Character kit use `.form-field` / `.form-field__label`
- [ ] Measure label-to-control for Repeats and Execute on

## 4. Wrap-up

- [ ] `npm run build`; `validation.md`; baseline smoke test
- [ ] `specs/roadmap.md` (84, Done), `CHANGELOG.md`, `specs/tech-spec.md`

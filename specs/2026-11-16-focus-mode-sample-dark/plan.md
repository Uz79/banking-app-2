# Focus-mode sample keeps its panel in Dark (66): plan

Branch: `feature/focus-mode-sample-dark`. Decisions are cited as D1 to D5 from `requirements.md`. Nothing is committed (D4).

## 1. The fix (D1, D2, D3)

- [x] `apps/web/motion-specimens.html`: remove `background` from both `.s2-stage` rules (lines 156 and 157)
- [x] Look at No. 001 in Dark against No. 003 and report; change `.s1-stage` only if it shows the same problem
- [x] Check: No. 002 next to No. 003 in Dark (UZ Bank): the same panel

## 2. Wrap-up (D5)

- [x] `npm run build` in `apps/web` succeeds
- [x] `validation.md`, then the baseline smoke test (the parts this page can affect)
- [x] `specs/roadmap.md`: 66's text corrected, marked done and moved to Done in number order
- [x] `CHANGELOG.md` under `Unreleased`
- [x] `specs/tech-spec.md`, `apps/web/README.md`: nothing to change (check)

## Chip

Pill-shaped status/selection surface with optional leading/trailing icons.

### Variants

- `regular / primary` — 32px height
- `small / primary` — 24px height
- Three cases, for either size (Figma: Chip, Case = Primary, Secondary, FilledTonal):
  - `primary`: the default `.chip`, a filled pill
  - `secondary`: `.chip--secondary`, an outlined pill
  - `tonal`: `.chip--tonal`, Figma's FilledTonal: a quiet status label, not a control

### States

- `default`

Hover and pressed exist as tokens for each case but are not built: no chip in the app is a button or a link yet.

### Tokens

Each case has its own set (Figma `chip/<case>/*`, mapped in `designs/tokens/mapped/light.json` and `dark.json`), emitted as `--color-chip-<case>-bg`, `-border`, `-fg`, `-hover` and `-pressed`, with `<case>` = `primary`, `secondary` or `filled-tonal`. The theme engine derives them for Multi-color themes.

| Case | Light | Dark |
| --- | --- | --- |
| primary | primary ink fill, white text | white fill, primary ink text |
| secondary | white fill, primary ink border and text | primary ink fill, white border and text |
| filled tonal | primary ink at 5%, 0% border, primary ink text | white at 10%, 0% border, white text |

### Notes

- Colours live in `.chip`, `.chip--secondary` and `.chip--tonal` in `apps/web/css/styles.css`; they no longer borrow the buttons' colours.
- The app shows the tonal chip small after a booking's name: "Pending", or a standing order's frequency ("Monthly"). It has no SVG export yet.
- SVG exports live next to this doc; the web implementation should be a semantic button/anchor when interactive.

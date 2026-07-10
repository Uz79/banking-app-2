SegmentedControl from @banking-app/ui. Use via `window.BankingAppUI.SegmentedControl` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports `.segmented` / `.segmented__option` from apps/web/css/styles.css
(see live story: Live/Components/Segmented control — "Theme toggle").

## Props

```ts
interface SegmentedControlProps {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "regular";
  /** Full-width track variant used for the theme toggle (`.segmented--theme`). */
  block?: boolean;
  "aria-label": string;
  className?: string;
}
```

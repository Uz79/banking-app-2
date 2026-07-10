Chip from @banking-app/ui. Use via `window.BankingAppUI.Chip` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports `.chip` from apps/web/css/styles.css (see live story: Live/Components/Chip).

## Props

```ts
interface ChipProps {
  size?: "sm" | "md";
  /** Icon sprite id, rendered as `<use href="#i-{icon}" />` before the label. */
  icon?: string;
  children: React.ReactNode;
  /** Renders a dismiss (×) button; called on click. */
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}
```

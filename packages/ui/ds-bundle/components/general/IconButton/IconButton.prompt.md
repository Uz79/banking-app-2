IconButton from @banking-app/ui. Use via `window.BankingAppUI.IconButton` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

## Props

```ts
interface IconButtonProps {
  /** Icon sprite id, rendered as `<use href="#i-{icon}" />`. */
  icon: string;
  variant?: "secondary" | "tonal" | "plain";
  /** Only `sm` has a dedicated 32x32 box in the current CSS; `md` falls back to `.uz-btn--icon-only` padding. */
  size?: "sm" | "md";
  "aria-label": string;
  className?: string;
  id?: string;
  style?: react.CSSProperties;
}
```

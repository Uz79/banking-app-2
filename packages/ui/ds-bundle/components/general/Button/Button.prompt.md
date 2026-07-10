Button from @banking-app/ui. Use via `window.BankingAppUI.Button` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Standard button — ports `.uz-btn` from apps/web/css/styles.css.
Renders a native `<button>` by default, or an `<a>` when `as="a"` is passed.

## Props

```ts
interface ButtonProps {
  variant?: "primary" | "secondary" | "tonal";
  size?: "sm" | "md" | "lg";
  /** Stretches the button to 100% width (`.uz-btn--block`). */
  block?: boolean;
  /** Forces the pressed visual state, independent of `:active` (`.uz-btn--pressed`). */
  pressed?: boolean;
  /** Icon sprite id, rendered as `<use href="#i-{icon}" />`. Consumers must provide a matching SVG sprite. */
  icon?: string;
  iconPosition?: "leading" | "trailing";
  children?: React.ReactNode;
  className?: string;
  id?: string;
  style?: react.CSSProperties;
  as?: "button";
}
```

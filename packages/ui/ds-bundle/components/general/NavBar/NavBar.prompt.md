NavBar from @banking-app/ui. Use via `window.BankingAppUI.NavBar` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports `.view__nav` (page header bar: centered title + absolute-positioned
leading/trailing icon buttons) from apps/web/css/styles.css — the real,
implemented equivalent of the Figma "Nav bar" component (there is no
literal `.nav-bar` class in the codebase; the sidebar has its own
`.sidebar__nav`, out of scope here).

## Props

```ts
interface NavBarProps {
  title: React.ReactNode;
  /** Icon sprite id for the leading (back) button. Omit to hide it (`.view__nav-btn--hidden`). */
  onBack?: () => void;
  backLabel?: string;
  /** Icon sprite id for a trailing action button. */
  trailingIcon?: string;
  onTrailing?: () => void;
  trailingLabel?: string;
  className?: string;
}
```

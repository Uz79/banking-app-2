GroupAccountListItem from @banking-app/ui. Use via `window.BankingAppUI.GroupAccountListItem` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

## Props

```ts
interface GroupAccountListItemProps {
  icon?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  currency: React.ReactNode;
  value: React.ReactNode;
  /** Non-interactive card (e.g. account-information summary). */
  static?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
}
```

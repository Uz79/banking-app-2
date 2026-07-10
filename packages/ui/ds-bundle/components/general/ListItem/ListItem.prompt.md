ListItem from @banking-app/ui. Use via `window.BankingAppUI.ListItem` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports the default `.list-item` variant (icon + content + optional chevron)
from apps/web/css/styles.css, including the shared Tier-A state-layer
pattern (`::before` hover/pressed tint).

## Props

```ts
interface ListItemProps {
  icon?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Trailing chevron (`.list-item__chevron`), typically for navigable rows. */
  chevron?: boolean;
  /** Non-interactive row: disables hover/active state layer and pointer cursor. */
  static?: boolean;
  onClick?: () => void;
  className?: string;
}
```

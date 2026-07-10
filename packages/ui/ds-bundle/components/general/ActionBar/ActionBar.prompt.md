ActionBar from @banking-app/ui. Use via `window.BankingAppUI.ActionBar` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports `.action-buttons` / `.action-button` (row of circular quick-action
buttons, e.g. "Pay" / "Internal Transfer") from apps/web/css/styles.css —
the codebase's real implementation of the Figma "Action bar" component.

## Props

```ts
interface ActionBarProps {
  items: ActionBarItem[];
  className?: string;
}
```

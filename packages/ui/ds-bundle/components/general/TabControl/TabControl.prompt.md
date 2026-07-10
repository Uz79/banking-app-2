TabControl from @banking-app/ui. Use via `window.BankingAppUI.TabControl` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports `.tab-bar` (fixed bottom tab navigation) from apps/web/css/styles.css
— the codebase's real implementation of the Figma "Tab Control" component
(there is no literal `.tab-control` class).

## Props

```ts
interface TabControlProps {
  items: TabControlItem[];
  activeKey: string;
  onSelect?: (key: string) => void;
  className?: string;
}
```

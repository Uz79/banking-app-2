SelectField from @banking-app/ui. Use via `window.BankingAppUI.SelectField` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

## Props

```ts
interface SelectFieldProps {
  label: React.ReactNode;
  id?: string;
  error?: React.ReactNode;
  children: React.ReactNode;
  style?: react.CSSProperties;
}
```

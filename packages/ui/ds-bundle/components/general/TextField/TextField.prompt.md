TextField from @banking-app/ui. Use via `window.BankingAppUI.TextField` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

## Props

```ts
interface TextFieldProps {
  label: React.ReactNode;
  id?: string;
  error?: React.ReactNode;
  /** Shows a clear (x) button once the field has a value. Uncontrolled inputs only. */
  clearable?: boolean;
  clearLabel?: string;
  children?: React.ReactNode;
  style?: react.CSSProperties;
}
```

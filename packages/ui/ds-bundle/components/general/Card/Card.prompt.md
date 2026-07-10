Card from @banking-app/ui. Use via `window.BankingAppUI.Card` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports `.section-card` (header + bordered body) from apps/web/css/styles.css.
Page-specific modifiers (`--performance`, `--positions`, `--my-positions`,
`--key-figures`) are not ported — this covers the base card only.

## Props

```ts
interface CardProps {
  title?: React.ReactNode;
  /** Right-aligned header content, e.g. an amount or account-type label. */
  headerEnd?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}
```

## Related

`CardAmount`

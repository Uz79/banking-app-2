Expander from @banking-app/ui. Use via `window.BankingAppUI.Expander` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports `.expander` from apps/web/css/styles.css (title/subtitle/leading-icon/chevron
structure — see the CSS block; the "Further options" live story uses a simplified
ad-hoc markup that doesn't define its own CSS, so this component follows the
canonical BEM structure instead).

## Props

```ts
interface ExpanderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Icon sprite id shown in the leading 32x32 icon circle. */
  leadingIcon?: string;
  /** Content revealed when expanded. */
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}
```

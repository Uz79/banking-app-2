Dialog from @banking-app/ui. Use via `window.BankingAppUI.Dialog` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports the base `.modal-overlay` / `.modal-shell` / `.modal` structure from
apps/web/css/styles.css: centered sheet, scrim, nav (title + back/close),
body, footer. Out of scope: the multi-step `.modal__step` wizard system,
the offscreen/closing exit-animation states (JS-driven), and the
recipient-search-active nav variant — those are page-flow specific.

## Props

```ts
interface DialogProps {
  open: boolean;
  title: React.ReactNode;
  onClose: () => void;
  onBack?: () => void;
  closeLabel?: string;
  backLabel?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}
```

Carousel from @banking-app/ui. Use via `window.BankingAppUI.Carousel` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<ThemeRoot>` (full provider chain in README.md — components read theme/i18n from that context).

Ports `.carousel` (single-slide track with prev/next arrows + dot
pagination) from apps/web/css/styles.css. The original relies on JS to
translate `.carousel__slides`; this component does that via an inline
`translateX` based on the active index, matching the CSS transition.

## Props

```ts
interface CarouselProps {
  children: react.ReactNode[];
  index?: number;
  onIndexChange?: (index: number) => void;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}
```

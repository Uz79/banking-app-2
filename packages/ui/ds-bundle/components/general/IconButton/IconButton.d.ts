import * as React from 'react';

/**
 * IconButton — from @banking-app/ui@0.1.0.
 */
export interface IconButtonProps {
  /** Icon sprite id, rendered as `<use href="#i-{icon}" />`. */
  icon: string;
  variant?: "secondary" | "tonal" | "plain";
  /** Only `sm` has a dedicated 32x32 box in the current CSS; `md` falls back to `.uz-btn--icon-only` padding. */
  size?: "sm" | "md";
  "aria-label": string;
  className?: string;
  id?: string;
  style?: react.CSSProperties;
}

export declare const IconButton: React.ComponentType<IconButtonProps>;

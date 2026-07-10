import * as React from 'react';

/**
 * Chip — from @banking-app/ui@0.1.0.
 */
export interface ChipProps {
  size?: "sm" | "md";
  /** Icon sprite id, rendered as `<use href="#i-{icon}" />` before the label. */
  icon?: string;
  children: React.ReactNode;
  /** Renders a dismiss (×) button; called on click. */
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export declare const Chip: React.ComponentType<ChipProps>;

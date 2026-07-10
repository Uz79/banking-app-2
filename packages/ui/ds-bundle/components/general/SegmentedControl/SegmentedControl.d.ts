import * as React from 'react';

/**
 * SegmentedControl — from @banking-app/ui@0.1.0.
 */
export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "regular";
  /** Full-width track variant used for the theme toggle (`.segmented--theme`). */
  block?: boolean;
  "aria-label": string;
  className?: string;
}

export declare const SegmentedControl: React.ComponentType<SegmentedControlProps>;

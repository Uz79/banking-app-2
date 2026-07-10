import * as React from 'react';

/**
 * Expander — from @banking-app/ui@0.1.0.
 */
export interface ExpanderProps {
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

export declare const Expander: React.ComponentType<ExpanderProps>;

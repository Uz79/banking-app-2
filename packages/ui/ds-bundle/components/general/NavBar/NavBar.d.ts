import * as React from 'react';

/**
 * NavBar — from @banking-app/ui@0.1.0.
 */
export interface NavBarProps {
  title: React.ReactNode;
  /** Icon sprite id for the leading (back) button. Omit to hide it (`.view__nav-btn--hidden`). */
  onBack?: () => void;
  backLabel?: string;
  /** Icon sprite id for a trailing action button. */
  trailingIcon?: string;
  onTrailing?: () => void;
  trailingLabel?: string;
  className?: string;
}

export declare const NavBar: React.ComponentType<NavBarProps>;

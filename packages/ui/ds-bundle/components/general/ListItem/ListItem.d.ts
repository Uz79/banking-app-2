import * as React from 'react';

/**
 * ListItem — from @banking-app/ui@0.1.0.
 */
export interface ListItemProps {
  icon?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Trailing chevron (`.list-item__chevron`), typically for navigable rows. */
  chevron?: boolean;
  /** Non-interactive row: disables hover/active state layer and pointer cursor. */
  static?: boolean;
  onClick?: () => void;
  className?: string;
}

export declare const ListItem: React.ComponentType<ListItemProps>;

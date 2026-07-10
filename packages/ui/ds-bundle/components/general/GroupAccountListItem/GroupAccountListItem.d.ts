import * as React from 'react';

/**
 * GroupAccountListItem — from @banking-app/ui@0.1.0.
 */
export interface GroupAccountListItemProps {
  icon?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  currency: React.ReactNode;
  value: React.ReactNode;
  /** Non-interactive card (e.g. account-information summary). */
  static?: boolean;
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
}

export declare const GroupAccountListItem: React.ComponentType<GroupAccountListItemProps>;

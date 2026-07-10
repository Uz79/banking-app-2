import * as React from 'react';

/**
 * TabControl — from @banking-app/ui@0.1.0.
 */
export interface TabControlProps {
  items: TabControlItem[];
  activeKey: string;
  onSelect?: (key: string) => void;
  className?: string;
}

export declare const TabControl: React.ComponentType<TabControlProps>;

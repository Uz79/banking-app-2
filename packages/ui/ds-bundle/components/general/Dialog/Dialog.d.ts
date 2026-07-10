import * as React from 'react';

/**
 * Dialog — from @banking-app/ui@0.1.0.
 * @replaces dialog
 */
export interface DialogProps {
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

export declare const Dialog: React.ComponentType<DialogProps>;

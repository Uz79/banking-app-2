import * as React from 'react';

/**
 * TextField — from @banking-app/ui@0.1.0.
 * @replaces input
 */
export interface TextFieldProps {
  label: React.ReactNode;
  id?: string;
  error?: React.ReactNode;
  /** Shows a clear (x) button once the field has a value. Uncontrolled inputs only. */
  clearable?: boolean;
  clearLabel?: string;
  children?: React.ReactNode;
  style?: react.CSSProperties;
}

export declare const TextField: React.ComponentType<TextFieldProps>;

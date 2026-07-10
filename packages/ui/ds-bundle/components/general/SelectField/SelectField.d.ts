import * as React from 'react';

/**
 * SelectField — from @banking-app/ui@0.1.0.
 */
export interface SelectFieldProps {
  label: React.ReactNode;
  id?: string;
  error?: React.ReactNode;
  children: React.ReactNode;
  style?: react.CSSProperties;
}

export declare const SelectField: React.ComponentType<SelectFieldProps>;

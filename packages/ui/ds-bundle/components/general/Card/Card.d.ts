import * as React from 'react';

/**
 * Card — from @banking-app/ui@0.1.0.
 */
export interface CardProps {
  title?: React.ReactNode;
  /** Right-aligned header content, e.g. an amount or account-type label. */
  headerEnd?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export declare const Card: React.ComponentType<CardProps>;

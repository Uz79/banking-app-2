import * as React from 'react';

/**
 * Button — from @banking-app/ui@0.1.0.
 * @replaces button
 */
export interface ButtonProps {
  variant?: "primary" | "secondary" | "tonal";
  size?: "sm" | "md" | "lg";
  /** Stretches the button to 100% width (`.uz-btn--block`). */
  block?: boolean;
  /** Forces the pressed visual state, independent of `:active` (`.uz-btn--pressed`). */
  pressed?: boolean;
  /** Icon sprite id, rendered as `<use href="#i-{icon}" />`. Consumers must provide a matching SVG sprite. */
  icon?: string;
  iconPosition?: "leading" | "trailing";
  children?: React.ReactNode;
  className?: string;
  id?: string;
  style?: react.CSSProperties;
  as?: "button";
}

export declare const Button: React.ComponentType<ButtonProps>;

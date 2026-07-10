import * as React from 'react';

/**
 * Carousel — from @banking-app/ui@0.1.0.
 */
export interface CarouselProps {
  children: react.ReactNode[];
  index?: number;
  onIndexChange?: (index: number) => void;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

export declare const Carousel: React.ComponentType<CarouselProps>;

/**
 * Scaling utilities for consistent component sizing
 */

export const SCALE_LEVELS = {
  compact: 0.875,
  normal: 1,
  comfortable: 1.125,
  large: 1.25,
} as const

export type ScaleLevel = keyof typeof SCALE_LEVELS

/**
 * Get the current scale factor from CSS custom property
 */
export function getCurrentScale(): number {
  if (typeof window === "undefined") return 1
  const scaleFactor = getComputedStyle(document.documentElement).getPropertyValue("--scale-factor")
  return Number.parseFloat(scaleFactor) || 1
}

/**
 * Apply scaling to a numeric value
 */
export function scaleValue(value: number, scale?: number): number {
  const currentScale = scale || getCurrentScale()
  return value * currentScale
}

/**
 * Generate scaled CSS custom properties for a component
 */
export function generateScaledProperties(baseValues: Record<string, number>): Record<string, string> {
  const properties: Record<string, string> = {}

  Object.entries(baseValues).forEach(([key, value]) => {
    properties[`--${key}`] = `calc(${value}px * var(--scale-factor))`
  })

  return properties
}

/**
 * Component scaling helper - returns inline styles for scaled components
 */
export function useScaledStyles(baseStyles: Record<string, number>) {
  return generateScaledProperties(baseStyles)
}

/**
 * Responsive scaling breakpoints
 */
export const RESPONSIVE_SCALES = {
  mobile: 0.9,
  tablet: 0.95,
  desktop: 1,
  large: 1.05,
} as const

/**
 * Get recommended scale based on screen size
 */
export function getRecommendedScale(): ScaleLevel {
  if (typeof window === "undefined") return "normal"

  const width = window.innerWidth

  if (width < 768) return "compact" // Mobile
  if (width < 1024) return "normal" // Tablet
  if (width < 1440) return "normal" // Desktop
  return "comfortable" // Large screens
}

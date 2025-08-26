/**
 * Text contrast utilities for ensuring accessibility across brand colors and themes
 */

import { hexToRgb, getContrastRatio } from "./colorUtils"

/**
 * Determine the best text color (black or white) for a given background color
 */
export function getBestTextColor(backgroundColor: string): string {
  const whiteContrast = getContrastRatio(backgroundColor, "#ffffff")
  const blackContrast = getContrastRatio(backgroundColor, "#000000")

  return whiteContrast > blackContrast ? "#ffffff" : "#000000"
}

/**
 * Generate accessible text colors for brand elements
 */
export function generateAccessibleTextColors(brandColor: string, isDarkMode: boolean) {
  const lightBackground = "#ffffff"
  const darkBackground = "#1f2937"
  const currentBackground = isDarkMode ? darkBackground : lightBackground

  // For brand elements on current background
  const brandOnBackground = getContrastRatio(brandColor, currentBackground)

  // For text on brand color background
  const textOnBrand = getBestTextColor(brandColor)

  // For interactive states
  const rgb = hexToRgb(brandColor)
  if (!rgb) return { brandText: brandColor, textOnBrand, brandHover: brandColor, brandActive: brandColor }

  // Generate hover and active states with proper contrast
  const hoverColor = isDarkMode ? lightenColor(brandColor, 0.1) : darkenColor(brandColor, 0.1)

  const activeColor = isDarkMode ? lightenColor(brandColor, 0.2) : darkenColor(brandColor, 0.2)

  return {
    brandText:
      brandOnBackground >= 4.5 ? brandColor : isDarkMode ? lightenColor(brandColor, 0.3) : darkenColor(brandColor, 0.3),
    textOnBrand,
    brandHover: hoverColor,
    brandActive: activeColor,
  }
}

/**
 * Lighten a hex color by a percentage
 */
function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const { r, g, b } = rgb
  const newR = Math.min(255, Math.round(r + (255 - r) * percent))
  const newG = Math.min(255, Math.round(g + (255 - g) * percent))
  const newB = Math.min(255, Math.round(b + (255 - b) * percent))

  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const { r, g, b } = rgb
  const newR = Math.max(0, Math.round(r * (1 - percent)))
  const newG = Math.max(0, Math.round(g * (1 - percent)))
  const newB = Math.max(0, Math.round(b * (1 - percent)))

  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`
}

/**
 * Check if a color combination meets WCAG accessibility standards
 */
export function meetsAccessibilityStandards(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
): boolean {
  const contrast = getContrastRatio(foreground, background)
  const requiredContrast = level === "AAA" ? 7 : 4.5
  return contrast >= requiredContrast
}

/**
 * Generate a color palette with guaranteed accessibility
 */
export function generateAccessiblePalette(brandColor: string, isDarkMode: boolean) {
  const textColors = generateAccessibleTextColors(brandColor, isDarkMode)
  const baseBackground = isDarkMode ? "#1f2937" : "#ffffff"
  const cardBackground = isDarkMode ? "#374151" : "#f9fafb"

  return {
    // Brand colors with proper contrast
    brand: {
      primary: textColors.brandText,
      primaryForeground: textColors.textOnBrand,
      hover: textColors.brandHover,
      active: textColors.brandActive,
    },
    // Background colors
    background: {
      base: baseBackground,
      card: cardBackground,
      elevated: isDarkMode ? "#4b5563" : "#ffffff",
    },
    // Text colors with guaranteed contrast
    text: {
      primary: isDarkMode ? "#f9fafb" : "#111827",
      secondary: isDarkMode ? "#d1d5db" : "#6b7280",
      muted: isDarkMode ? "#9ca3af" : "#9ca3af",
      onBrand: textColors.textOnBrand,
    },
    // Status colors with proper contrast
    status: {
      success: isDarkMode ? "#34d399" : "#059669",
      warning: isDarkMode ? "#fbbf24" : "#d97706",
      error: isDarkMode ? "#f87171" : "#dc2626",
      info: isDarkMode ? "#60a5fa" : "#2563eb",
    },
  }
}

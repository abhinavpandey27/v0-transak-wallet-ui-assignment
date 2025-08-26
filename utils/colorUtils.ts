/**
 * Color utilities for brand customization and color generation
 */

export interface HSL {
  h: number
  s: number
  l: number
}

export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h: number
  let s: number
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
      default:
        h = 0
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360
  s /= 100
  l /= 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

/**
 * Generate complementary color
 */
export function generateComplementary(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const complementaryHue = (hsl.h + 180) % 360
  const complementaryRgb = hslToRgb(complementaryHue, hsl.s, hsl.l)

  return rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b)
}

/**
 * Generate color variations (lighter/darker)
 */
export function generateColorVariations(hex: string): {
  lighter: string
  light: string
  base: string
  dark: string
  darker: string
} {
  const rgb = hexToRgb(hex)
  if (!rgb) return { lighter: hex, light: hex, base: hex, dark: hex, darker: hex }

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)

  return {
    lighter: rgbToHex(...Object.values(hslToRgb(hsl.h, hsl.s, Math.min(hsl.l + 30, 95)))),
    light: rgbToHex(...Object.values(hslToRgb(hsl.h, hsl.s, Math.min(hsl.l + 15, 90)))),
    base: hex,
    dark: rgbToHex(...Object.values(hslToRgb(hsl.h, hsl.s, Math.max(hsl.l - 15, 10)))),
    darker: rgbToHex(...Object.values(hslToRgb(hsl.h, hsl.s, Math.max(hsl.l - 30, 5)))),
  }
}

/**
 * Check if color meets WCAG contrast requirements
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)

  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Ensure color meets accessibility standards
 */
export function ensureAccessibleColor(foreground: string, background: string, targetRatio = 4.5): string {
  const currentRatio = getContrastRatio(foreground, background)
  if (currentRatio >= targetRatio) return foreground

  const rgb = hexToRgb(foreground)
  if (!rgb) return foreground

  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const backgroundRgb = hexToRgb(background)
  if (!backgroundRgb) return foreground

  const backgroundHsl = rgbToHsl(backgroundRgb.r, backgroundRgb.g, backgroundRgb.b)

  // Adjust lightness to meet contrast requirements
  let adjustedLightness = hsl.l
  const step = backgroundHsl.l > 50 ? -5 : 5

  while (
    getContrastRatio(rgbToHex(...Object.values(hslToRgb(hsl.h, hsl.s, adjustedLightness))), background) < targetRatio
  ) {
    adjustedLightness += step
    if (adjustedLightness <= 0 || adjustedLightness >= 100) break
  }

  return rgbToHex(...Object.values(hslToRgb(hsl.h, hsl.s, adjustedLightness)))
}

/**
 * Generate theme-aware brand colors that work in both light and dark modes
 */
export function generateThemeAwareBrandColors(primaryColor: string, isDarkMode: boolean) {
  const variations = generateColorVariations(primaryColor)

  if (isDarkMode) {
    // For dark mode, use lighter variations and ensure good contrast
    return {
      primary: ensureAccessibleColor(variations.light, "#1f2937", 4.5), // Against dark gray
      primaryForeground: ensureAccessibleColor("#ffffff", variations.light, 4.5),
      primaryHover: variations.base,
      primaryActive: variations.dark,
      accent: ensureAccessibleColor(variations.lighter, "#1f2937", 3.0),
    }
  } else {
    // For light mode, use standard variations
    return {
      primary: primaryColor,
      primaryForeground: ensureAccessibleColor("#ffffff", primaryColor, 4.5),
      primaryHover: variations.dark,
      primaryActive: variations.darker,
      accent: ensureAccessibleColor(variations.light, "#ffffff", 3.0),
    }
  }
}

/**
 * Popular brand color presets
 */
export const BRAND_COLOR_PRESETS = [
  { name: "Blue", color: "#3B82F6" },
  { name: "Purple", color: "#8B5CF6" },
  { name: "Green", color: "#10B981" },
  { name: "Orange", color: "#F59E0B" },
  { name: "Red", color: "#EF4444" },
  { name: "Pink", color: "#EC4899" },
  { name: "Indigo", color: "#6366F1" },
  { name: "Teal", color: "#14B8A6" },
  { name: "Black", color: "#000000" },
  { name: "Gray", color: "#6B7280" },
]

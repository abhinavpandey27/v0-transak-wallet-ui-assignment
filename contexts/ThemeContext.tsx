"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useTheme as useNextTheme } from "next-themes"
import type { ThemeConfig, TypographyConfig, ScalingConfig, BrandConfig } from "@/types/theme"
import { DEFAULT_TYPOGRAPHY_CONFIG } from "@/data/fonts"
import { generateColorVariations, generateComplementary, generateThemeAwareBrandColors } from "@/utils/colorUtils"

interface ThemeContextType {
  config: ThemeConfig
  updateTypography: (typography: Partial<TypographyConfig>) => void
  updateScaling: (scaling: Partial<ScalingConfig>) => void
  updateBrand: (brand: Partial<BrandConfig>) => void
  resetToDefaults: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const DEFAULT_CONFIG: ThemeConfig = {
  mode: "system",
  typography: DEFAULT_TYPOGRAPHY_CONFIG,
  scaling: {
    level: "normal",
  },
  brand: {
    primaryColor: "#000000",
    autoGenerateSecondary: true,
  },
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useNextTheme()
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_CONFIG)

  // Load saved configuration from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("wallet-theme-config")
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        setConfig({ ...DEFAULT_CONFIG, ...parsed })
      } catch (error) {
        console.error("Failed to parse saved theme config:", error)
      }
    }
  }, [])

  // Save configuration to localStorage
  useEffect(() => {
    localStorage.setItem("wallet-theme-config", JSON.stringify(config))
    applyThemeToDOM(config)
  }, [config])

  // Sync with next-themes
  useEffect(() => {
    if (config.mode !== "system") {
      setTheme(config.mode)
    }
  }, [config.mode, setTheme])

  const applyThemeToDOM = (themeConfig: ThemeConfig) => {
    const root = document.documentElement

    // Apply typography
    root.style.setProperty("--font-primary", `var(${themeConfig.typography.fontFamily})`)

    // Apply scaling
    const scaleValues = {
      compact: 0.875,
      normal: 1,
      comfortable: 1.125,
      large: 1.25,
    }
    const scale = themeConfig.scaling.customScale || scaleValues[themeConfig.scaling.level]
    root.style.setProperty("--scale-factor", scale.toString())

    // Apply brand colors
    if (themeConfig.brand.primaryColor) {
      const variations = generateColorVariations(themeConfig.brand.primaryColor)
      const secondary = themeConfig.brand.autoGenerateSecondary
        ? generateComplementary(themeConfig.brand.primaryColor)
        : themeConfig.brand.customSecondary || generateComplementary(themeConfig.brand.primaryColor)

      // Determine if we're in dark mode
      const isDarkMode =
        theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

      // Generate theme-aware colors
      const themeColors = generateThemeAwareBrandColors(themeConfig.brand.primaryColor, isDarkMode)

      // Set brand color variables
      root.style.setProperty("--brand-primary", themeColors.primary)
      root.style.setProperty("--brand-primary-foreground", themeColors.primaryForeground)
      root.style.setProperty("--brand-primary-hover", themeColors.primaryHover)
      root.style.setProperty("--brand-primary-active", themeColors.primaryActive)
      root.style.setProperty("--brand-accent", themeColors.accent)
      root.style.setProperty("--brand-secondary", secondary)

      // Update CSS custom properties for primary color with proper OKLCH conversion
      const primaryRgb = hexToRgb(themeColors.primary)
      if (primaryRgb) {
        // Convert RGB to OKLCH-like values for better color space handling
        const { r, g, b } = primaryRgb
        const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
        root.style.setProperty(
          "--primary",
          `oklch(${luminance.toFixed(3)} 0.15 ${Math.round((Math.atan2(g - r, b - r) * 180) / Math.PI)})`,
        )
        root.style.setProperty("--primary-foreground", `oklch(${isDarkMode ? "0.145" : "0.985"} 0 0)`)
      }
    }
  }

  const updateTypography = (typography: Partial<TypographyConfig>) => {
    setConfig((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...typography },
    }))
  }

  const updateScaling = (scaling: Partial<ScalingConfig>) => {
    setConfig((prev) => ({
      ...prev,
      scaling: { ...prev.scaling, ...scaling },
    }))
  }

  const updateBrand = (brand: Partial<BrandConfig>) => {
    setConfig((prev) => ({
      ...prev,
      brand: { ...prev.brand, ...brand },
    }))
  }

  const resetToDefaults = () => {
    setConfig(DEFAULT_CONFIG)
    localStorage.removeItem("wallet-theme-config")
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  return (
    <ThemeContext.Provider
      value={{
        config,
        updateTypography,
        updateScaling,
        updateBrand,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useCustomTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useCustomTheme must be used within a ThemeProvider")
  }
  return context
}

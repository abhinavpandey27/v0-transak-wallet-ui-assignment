"use client"

import { useCustomTheme } from "@/contexts/ThemeContext"
import { useTheme } from "next-themes"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { generateAccessiblePalette, meetsAccessibilityStandards } from "@/utils/contrastUtils"
import { getContrastRatio } from "@/utils/colorUtils"

export function ContrastPreview() {
  const { config } = useCustomTheme()
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const palette = generateAccessiblePalette(config.brand.primaryColor, isDarkMode)
  const brandContrast = getContrastRatio(config.brand.primaryColor, isDarkMode ? "#1f2937" : "#ffffff")
  const meetsAA = meetsAccessibilityStandards(config.brand.primaryColor, isDarkMode ? "#1f2937" : "#ffffff", "AA")
  const meetsAAA = meetsAccessibilityStandards(config.brand.primaryColor, isDarkMode ? "#1f2937" : "#ffffff", "AAA")

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Accessibility Preview</h3>

        {/* Contrast Ratios */}
        <Card className="p-4 mb-4">
          <h4 className="font-medium mb-3">Contrast Analysis</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Brand on Background:</span>
              <span className={`font-mono ${meetsAA ? "text-green-600" : "text-red-600"}`}>
                {brandContrast.toFixed(2)}:1 {meetsAA ? "✓ AA" : "✗"} {meetsAAA ? "✓ AAA" : ""}
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              WCAG AA requires 4.5:1, AAA requires 7:1 for normal text
            </div>
          </div>
        </Card>

        {/* Brand Color Examples */}
        <Card className="p-6 space-y-4">
          <h4 className="font-medium">Brand Color Usage</h4>

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap">
            <CustomButton variant="brand">Brand Button</CustomButton>
            <CustomButton variant="outline" className="border-brand-primary text-brand-primary">
              Brand Outline
            </CustomButton>
            <button
              className="px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: palette.brand.primary,
                color: palette.brand.primaryForeground,
              }}
            >
              Custom Brand
            </button>
          </div>

          {/* Text Examples */}
          <div className="space-y-2">
            <p className="text-brand-primary font-medium">Brand colored text on background</p>
            <div className="p-3 rounded-lg" style={{ backgroundColor: config.brand.primaryColor }}>
              <p style={{ color: palette.text.onBrand }}>Text on brand background</p>
            </div>
          </div>

          {/* Status Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: palette.status.success }}>
              <span style={{ color: palette.text.primary }}>Success Message</span>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: palette.status.error }}>
              <span style={{ color: palette.text.primary }}>Error Message</span>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: palette.status.warning }}>
              <span style={{ color: palette.text.primary }}>Warning Message</span>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: palette.status.info }}>
              <span style={{ color: palette.text.primary }}>Info Message</span>
            </div>
          </div>
        </Card>

        {/* Accessibility Tips */}
        <Card className="p-4">
          <h4 className="font-medium mb-2">Accessibility Tips</h4>
          <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <li>• Use high contrast colors for better readability</li>
            <li>• Test your colors in both light and dark modes</li>
            <li>• Consider colorblind users - don't rely on color alone</li>
            <li>• Maintain consistent contrast ratios across your brand</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}

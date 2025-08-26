"use client"

import { useState } from "react"
import { useCustomTheme } from "@/contexts/ThemeContext"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Palette, Check, RefreshCw } from "lucide-react"
import {
  BRAND_COLOR_PRESETS,
  generateComplementary,
  generateColorVariations,
  getContrastRatio,
} from "@/utils/colorUtils"

export function BrandSettings() {
  const { config, updateBrand } = useCustomTheme()
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState(config.brand.primaryColor)

  const colorVariations = generateColorVariations(config.brand.primaryColor)
  const complementaryColor = generateComplementary(config.brand.primaryColor)
  const contrastRatio = getContrastRatio(config.brand.primaryColor, "#ffffff")

  const handleColorChange = (color: string) => {
    updateBrand({ primaryColor: color })
    setCustomColor(color)
  }

  const handleAutoGenerateToggle = () => {
    updateBrand({ autoGenerateSecondary: !config.brand.autoGenerateSecondary })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Brand Colors
        </h3>

        {/* Current Brand Color */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Brand Color</label>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-600 cursor-pointer"
              style={{ backgroundColor: config.brand.primaryColor }}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            <div className="flex-1">
              <div className="font-medium">{config.brand.primaryColor.toUpperCase()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Contrast ratio: {contrastRatio.toFixed(2)} {contrastRatio >= 4.5 ? "✓" : "⚠️"}
              </div>
            </div>
          </div>
        </div>

        {/* Color Picker */}
        {showColorPicker && (
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Custom Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                    placeholder="#000000"
                  />
                  <CustomButton onClick={() => handleColorChange(customColor)} size="sm">
                    Apply
                  </CustomButton>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Presets</label>
                <div className="grid grid-cols-5 gap-2">
                  {BRAND_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleColorChange(preset.color)}
                      className="relative w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:scale-105 transition-transform"
                      style={{ backgroundColor: preset.color }}
                      title={preset.name}
                    >
                      {config.brand.primaryColor === preset.color && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Color Variations Preview */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Color Variations</label>
          <div className="flex gap-2">
            {Object.entries(colorVariations).map(([name, color]) => (
              <div key={name} className="flex-1 text-center">
                <div
                  className="w-full h-12 rounded-lg border border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: color }}
                />
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 capitalize">{name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Color Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Secondary Color</label>
            <CustomButton
              variant="outline"
              size="sm"
              onClick={handleAutoGenerateToggle}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              {config.brand.autoGenerateSecondary ? "Auto" : "Manual"}
            </CustomButton>
          </div>

          {config.brand.autoGenerateSecondary ? (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: complementaryColor }}
              />
              <div>
                <div className="font-medium">{complementaryColor.toUpperCase()}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Auto-generated complementary color</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.brand.customSecondary || complementaryColor}
                onChange={(e) => updateBrand({ customSecondary: e.target.value })}
                className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600"
              />
              <input
                type="text"
                value={config.brand.customSecondary || complementaryColor}
                onChange={(e) => updateBrand({ customSecondary: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                placeholder="#000000"
              />
            </div>
          )}
        </div>

        {/* Brand Preview */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand Preview</label>
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: config.brand.primaryColor }} />
                <h4 className="text-lg font-semibold">Your Brand</h4>
              </div>
              <div className="flex gap-2">
                <CustomButton
                  style={{
                    backgroundColor: config.brand.primaryColor,
                    borderColor: config.brand.primaryColor,
                    color: "white",
                  }}
                >
                  Primary Button
                </CustomButton>
                <CustomButton
                  variant="outline"
                  style={{
                    borderColor: config.brand.primaryColor,
                    color: config.brand.primaryColor,
                  }}
                >
                  Secondary Button
                </CustomButton>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: config.brand.primaryColor }} />
                <span style={{ color: config.brand.primaryColor }}>Brand accent text</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Reset Button */}
        <CustomButton
          variant="outline"
          onClick={() =>
            updateBrand({ primaryColor: "#000000", autoGenerateSecondary: true, customSecondary: undefined })
          }
          className="w-full"
        >
          Reset to Default
        </CustomButton>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useCustomTheme } from "@/contexts/ThemeContext"
import { TOP_GOOGLE_FONTS } from "@/data/fonts"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Check, Type } from "lucide-react"

export function TypographySettings() {
  const { config, updateTypography } = useCustomTheme()
  const [showFontPicker, setShowFontPicker] = useState(false)

  const scaleOptions = [
    { value: "compact", label: "Compact", description: "Dense text for more content" },
    { value: "normal", label: "Normal", description: "Standard text size" },
    { value: "comfortable", label: "Comfortable", description: "Spacious text for readability" },
    { value: "large", label: "Large", description: "Large text for accessibility" },
  ]

  const weightOptions = [
    { value: "light", label: "Light" },
    { value: "normal", label: "Normal" },
    { value: "medium", label: "Medium" },
    { value: "semibold", label: "Semibold" },
    { value: "bold", label: "Bold" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Type className="w-5 h-5" />
          Typography
        </h3>

        {/* Font Family Picker */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Font Family</label>
          <div className="relative">
            <CustomButton
              variant="outline"
              onClick={() => setShowFontPicker(!showFontPicker)}
              className="w-full justify-between"
            >
              {config.typography.fontName}
              <span className="text-xs text-gray-500">Aa</span>
            </CustomButton>

            {showFontPicker && (
              <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {TOP_GOOGLE_FONTS.map((font) => (
                    <button
                      key={font.family}
                      onClick={() => {
                        updateTypography({
                          fontFamily: font.variable,
                          fontName: font.name,
                        })
                        setShowFontPicker(false)
                      }}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left"
                      style={{ fontFamily: `var(${font.variable}), sans-serif` }}
                    >
                      <div>
                        <div className="font-medium">{font.name}</div>
                        <div className="text-sm text-gray-500">The quick brown fox</div>
                      </div>
                      {config.typography.fontFamily === font.variable && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Font Scale */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Text Size</label>
          <div className="grid grid-cols-2 gap-2">
            {scaleOptions.map((option) => (
              <CustomButton
                key={option.value}
                variant={config.typography.scale === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateTypography({ scale: option.value as any })}
                className="flex flex-col items-start p-3 h-auto"
              >
                <span className="font-medium">{option.label}</span>
                <span className="text-xs text-gray-500">{option.description}</span>
              </CustomButton>
            ))}
          </div>
        </div>

        {/* Font Weights */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Heading Weight</label>
            <select
              value={config.typography.headingWeight}
              onChange={(e) => updateTypography({ headingWeight: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {weightOptions.map((weight) => (
                <option key={weight.value} value={weight.value}>
                  {weight.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Body Weight</label>
            <select
              value={config.typography.bodyWeight}
              onChange={(e) => updateTypography({ bodyWeight: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              {weightOptions.slice(0, 3).map((weight) => (
                <option key={weight.value} value={weight.value}>
                  {weight.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useCustomTheme } from "@/contexts/ThemeContext"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Maximize2, Minimize2 } from "lucide-react"

export function ScalingSettings() {
  const { config, updateScaling } = useCustomTheme()

  const scaleOptions = [
    {
      value: "compact",
      label: "Compact",
      description: "Dense layout for large screens",
      scale: 0.875,
      icon: <Minimize2 className="w-4 h-4" />,
    },
    {
      value: "normal",
      label: "Normal",
      description: "Default comfortable sizing",
      scale: 1,
      icon: <div className="w-4 h-4 border border-current rounded" />,
    },
    {
      value: "comfortable",
      label: "Comfortable",
      description: "Spacious layout with more breathing room",
      scale: 1.125,
      icon: <div className="w-4 h-4 border-2 border-current rounded" />,
    },
    {
      value: "large",
      label: "Large",
      description: "Accessibility-focused large sizing",
      scale: 1.25,
      icon: <Maximize2 className="w-4 h-4" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Maximize2 className="w-5 h-5" />
          Interface Scaling
        </h3>

        {/* Scale Level Options */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Scale Level</label>
          <div className="grid grid-cols-1 gap-3">
            {scaleOptions.map((option) => (
              <Card
                key={option.value}
                className={`p-4 cursor-pointer transition-all ${
                  config.scaling.level === option.value ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => updateScaling({ level: option.value as any })}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">{option.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-sm text-gray-500">{option.scale}x</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Preview</label>
          <Card className="p-4">
            <div className="space-y-3">
              <h4 className="text-scaled-lg font-semibold">Sample Heading</h4>
              <p className="text-scaled-base text-gray-600">
                This is how your text will appear with the current scaling settings. The interface will adjust
                proportionally.
              </p>
              <div className="flex gap-2">
                <CustomButton size="sm" className="text-scaled-sm">
                  Small Button
                </CustomButton>
                <CustomButton className="text-scaled-base">Normal Button</CustomButton>
              </div>
            </div>
          </Card>
        </div>

        {/* Custom Scale Slider */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Custom Scale (Advanced)</label>
          <div className="space-y-2">
            <input
              type="range"
              min="0.75"
              max="1.5"
              step="0.05"
              value={config.scaling.customScale || 1}
              onChange={(e) => updateScaling({ customScale: Number.parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.75x</span>
              <span>Current: {(config.scaling.customScale || 1).toFixed(2)}x</span>
              <span>1.5x</span>
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <CustomButton
          variant="outline"
          onClick={() => updateScaling({ level: "normal", customScale: undefined })}
          className="w-full"
        >
          Reset to Default
        </CustomButton>
      </div>
    </div>
  )
}

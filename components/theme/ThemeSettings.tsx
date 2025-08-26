"use client"

import { useTheme } from "next-themes"
import { useCustomTheme } from "@/contexts/ThemeContext"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Sun, Moon, Monitor, Palette } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeSettings() {
  const { theme, setTheme, systemTheme } = useTheme()
  const { config, updateBrand } = useCustomTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="space-y-6">Loading theme settings...</div>
  }

  const themeOptions = [
    {
      value: "light",
      label: "Light Mode",
      description: "Clean, bright interface",
      icon: <Sun className="w-5 h-5" />,
      preview: "bg-white text-gray-900 border-gray-200",
    },
    {
      value: "dark",
      label: "Dark Mode",
      description: "Easy on the eyes in low light",
      icon: <Moon className="w-5 h-5" />,
      preview: "bg-gray-900 text-white border-gray-700",
    },
    {
      value: "system",
      label: "System",
      description: "Matches your device settings",
      icon: <Monitor className="w-5 h-5" />,
      preview:
        systemTheme === "dark" ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200",
    },
  ]

  const currentTheme = theme || "system"

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Appearance
        </h3>

        {/* Theme Mode Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme Mode</label>
          <div className="grid grid-cols-1 gap-3">
            {themeOptions.map((option) => (
              <Card
                key={option.value}
                className={`p-4 cursor-pointer transition-all ${
                  currentTheme === option.value
                    ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => setTheme(option.value)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">{option.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{option.description}</p>
                  </div>
                  <div className={`w-12 h-8 rounded border-2 ${option.preview} flex-shrink-0`} />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Theme</label>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">
                  {currentTheme === "system" ? `System (${systemTheme})` : currentTheme}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {currentTheme === "system"
                    ? "Automatically switches based on your device settings"
                    : `Always use ${currentTheme} mode`}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {currentTheme === "light" && <Sun className="w-5 h-5 text-yellow-500" />}
                {currentTheme === "dark" && <Moon className="w-5 h-5 text-blue-500" />}
                {currentTheme === "system" && <Monitor className="w-5 h-5 text-gray-500" />}
              </div>
            </div>
          </Card>
        </div>

        {/* Theme Preview */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</label>
          <div className="grid grid-cols-2 gap-4">
            {/* Light Preview */}
            <Card className="p-4 bg-white text-gray-900 border-gray-200">
              <div className="space-y-2">
                <div className="font-semibold">Light Theme</div>
                <div className="text-sm text-gray-600">Sample content in light mode</div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded" />
                  <div className="w-3 h-3 bg-green-500 rounded" />
                  <div className="w-3 h-3 bg-orange-500 rounded" />
                </div>
              </div>
            </Card>

            {/* Dark Preview */}
            <Card className="p-4 bg-gray-900 text-white border-gray-700">
              <div className="space-y-2">
                <div className="font-semibold">Dark Theme</div>
                <div className="text-sm text-gray-400">Sample content in dark mode</div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded" />
                  <div className="w-3 h-3 bg-green-400 rounded" />
                  <div className="w-3 h-3 bg-orange-400 rounded" />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Quick Toggle */}
        <div className="flex gap-2">
          <CustomButton
            variant={currentTheme === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("light")}
            className="flex-1"
          >
            <Sun className="w-4 h-4 mr-2" />
            Light
          </CustomButton>
          <CustomButton
            variant={currentTheme === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("dark")}
            className="flex-1"
          >
            <Moon className="w-4 h-4 mr-2" />
            Dark
          </CustomButton>
          <CustomButton
            variant={currentTheme === "system" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("system")}
            className="flex-1"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Auto
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

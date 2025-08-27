"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Sun, Moon, Monitor, Palette, Type } from "lucide-react"
import { TOP_GOOGLE_FONTS } from "@/data/fonts"
import { useSimpleTheme } from "@/contexts/SimpleThemeContext"

export function ThemeSettings() {
  const { theme, setTheme } = useSimpleTheme()
  const [selectedFont, setSelectedFont] = useState('--font-instrument-sans')
  const [mounted, setMounted] = useState(false)

  // Initialize font on mount
  useEffect(() => {
    setMounted(true)
    const savedFont = localStorage.getItem('selected-font') || '--font-instrument-sans'
    setSelectedFont(savedFont)
    
    // Apply font to DOM
    document.documentElement.style.setProperty('--font-primary', `var(${savedFont})`)
  }, [])

  const changeFont = (fontVariable: string) => {
    setSelectedFont(fontVariable)
    document.documentElement.style.setProperty('--font-primary', `var(${fontVariable})`)
    localStorage.setItem('selected-font', fontVariable)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="space-y-6">Loading theme settings...</div>
  }

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light Mode",
      description: "Clean, bright interface",
      icon: <Sun className="w-5 h-5" />,
      preview: "bg-white text-gray-900 border-gray-200",
    },
    {
      value: "dark" as const,
      label: "Dark Mode",
      description: "Easy on the eyes in low light",
      icon: <Moon className="w-5 h-5" />,
      preview: "bg-gray-900 text-white border-gray-700",
    },
  ]

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
                  theme === option.value
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

        {/* Typography Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Typography
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TOP_GOOGLE_FONTS.map((font) => (
              <Card
                key={font.variable}
                className={`p-3 cursor-pointer transition-all ${
                  selectedFont === font.variable
                    ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => changeFont(font.variable)}
              >
                <div className="text-center">
                  <div className="font-medium text-sm">{font.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {font.weights.join(', ')} weights
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Theme Toggle */}
        <div className="flex gap-2">
          <CustomButton
            variant={theme === "light" ? "primary" : "outline"}
            size="sm"
            onClick={() => setTheme("light")}
            className="flex-1"
          >
            <Sun className="w-4 h-4 mr-2" />
            Light
          </CustomButton>
          <CustomButton
            variant={theme === "dark" ? "primary" : "outline"}
            size="sm"
            onClick={() => setTheme("dark")}
            className="flex-1"
          >
            <Moon className="w-4 h-4 mr-2" />
            Dark
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

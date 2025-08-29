"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Sun, Moon, Monitor } from "lucide-react"
import { TOP_GOOGLE_FONTS } from "@/data/fonts"
import { useTheme } from "next-themes"

export function ThemeSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme()
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
      value: "system" as const,
      label: "System",
      description: "Follow your OS appearance",
      icon: <Monitor className="w-5 h-5" />,
      preview: "bg-white text-gray-900 border-gray-200 dark:bg-gray-900 dark:text-white dark:border-gray-700",
    },
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
    <div className="space-y-8">
      {/* Theme Mode */}
      <section className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme Mode</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Theme Mode">
          {themeOptions.map((option) => {
            const selected = (theme || 'system') === option.value
            return (
              <Card
                key={option.value}
                role="radio"
                aria-checked={selected}
                tabIndex={0}
                onClick={() => setTheme(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setTheme(option.value)
                }}
                className={`p-3 cursor-pointer transition-all flex items-center gap-3 ${
                  selected
                    ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex-shrink-0">{option.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{option.label}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{option.description}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Typography */}
      <section className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Typography</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOP_GOOGLE_FONTS.map((font) => (
            <Card
              key={font.variable}
              className={`p-3 cursor-pointer transition-all text-center ${
                selectedFont === font.variable
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => changeFont(font.variable)}
            >
              <div className="font-medium text-sm truncate">{font.name}</div>
              <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 truncate">
                {font.weights.join(', ')} weights
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* No extra quick actions to avoid duplication */}
    </div>
  )
}

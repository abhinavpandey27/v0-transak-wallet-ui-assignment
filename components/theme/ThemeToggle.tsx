"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"
import { useSimpleTheme } from "@/contexts/SimpleThemeContext"

export function ThemeToggle() {
  const { theme, toggleTheme } = useSimpleTheme()
  const [mounted, setMounted] = useState(false)

  // Initialize on mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <CustomButton variant="outline" size="sm" disabled>
        <Sun className="w-4 h-4" />
      </CustomButton>
    )
  }

  return (
    <CustomButton
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2"
    >
      {theme === 'light' ? (
        <>
          <Sun className="w-4 h-4" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </CustomButton>
  )
}

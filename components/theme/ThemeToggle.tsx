"use client"

import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
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

  const current = (theme === 'system' ? resolvedTheme : theme) || 'light'

  return (
    <CustomButton
      variant="outline"
      size="sm"
      onClick={() => setTheme(current === 'light' ? 'dark' : 'light')}
      className="flex items-center gap-2"
    >
      {current === 'light' ? (
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

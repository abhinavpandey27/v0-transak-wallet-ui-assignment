"use client"

import type React from "react"

import { ThemeProvider as NextThemeProvider } from "next-themes"
import { ThemeProvider as CustomThemeProvider } from "@/contexts/ThemeContext"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem suppressHydrationWarning={true}>
      <CustomThemeProvider>{children}</CustomThemeProvider>
    </NextThemeProvider>
  )
}

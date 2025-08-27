"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface SimpleThemeContextType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

const SimpleThemeContext = createContext<SimpleThemeContextType | undefined>(undefined)

export function SimpleThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    setThemeState(savedTheme)
    
    // Apply theme to DOM
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme)
    
    // Apply theme to DOM
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div className="flex h-screen bg-gray-50">Loading...</div>
  }

  return (
    <SimpleThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </SimpleThemeContext.Provider>
  )
}

export function useSimpleTheme() {
  const context = useContext(SimpleThemeContext)
  if (context === undefined) {
    throw new Error("useSimpleTheme must be used within a SimpleThemeProvider")
  }
  return context
}

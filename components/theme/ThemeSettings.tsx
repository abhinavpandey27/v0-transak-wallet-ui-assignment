"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Sun, Moon, Monitor } from "lucide-react"
import { TOP_GOOGLE_FONTS } from "@/data/fonts"
import { useTheme } from "next-themes"
import { useBranding } from "@/contexts/BrandingContext"

interface ThemeSettingsProps {
  compact?: boolean
}

export function ThemeSettings({ compact = false }: ThemeSettingsProps) {
  const { theme, setTheme } = useTheme()
  const [selectedFont, setSelectedFont] = useState('--font-instrument-sans')
  const [mounted, setMounted] = useState(false)
  const { brandHex, setBrandHex, presets, setLogo, logo, presetId } = useBranding()
  const [hexInput, setHexInput] = useState(brandHex)
  const [uploadError, setUploadError] = useState<string | null>(null)

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

  if (compact) {
    return (
      <div className="space-y-4">
        {/* Compact Theme Mode */}
        <section className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme Mode">
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
                  className={`p-2 cursor-pointer transition-all flex flex-col items-center gap-1 ${
                    selected
                      ? "ring-2 ring-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_8%,white)] dark:bg-[var(--brand-soft)]"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex-shrink-0">{option.icon}</div>
                  <div className="text-xs font-medium">{option.label.replace(' Mode', '')}</div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Compact Branding */}
        <section className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
          {/* Presets */}
          <div className="grid grid-cols-3 gap-2">
            {presets.map((p) => {
              const active = presetId === p.id
              return (
                <Card
                  key={p.id}
                  className={`p-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                    active ? "ring-2 ring-[var(--brand)] bg-gray-50 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setBrandHex(p.color)
                    setLogo({ type: 'preset', value: p.logo, alt: p.alt || p.name }, p.id)
                    setHexInput(p.color)
                  }}
                >
                  <img src={p.logo} alt={p.name} className="h-8" />
                  <div className="text-xs" style={{ color: p.color }}>{p.name}</div>
                </Card>
              )
            })}
          </div>

          {/* Color picker */}
          <div className="flex items-center gap-2 mt-2">
            <input
              aria-label="Brand color"
              type="color"
              value={hexInput}
              onChange={(e) => {
                setHexInput(e.target.value)
                setBrandHex(e.target.value)
              }}
              className="h-9 w-12 rounded cursor-pointer border border-gray-200 dark:border-gray-700"
            />
            <input
              aria-label="Brand hex"
              type="text"
              value={hexInput}
              onChange={(e) => {
                const v = e.target.value
                setHexInput(v)
                if (/^#?[0-9a-fA-F]{6}$/.test(v)) setBrandHex(v)
              }}
              placeholder="#2563eb"
              className="h-9 flex-1 rounded border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-sm"
            />
          </div>

          {/* Upload logo (SVG only <= 512KB) */}
          <div className="mt-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Upload SVG logo (max 0.5MB)</label>
            <input
              type="file"
              accept="image/svg+xml"
              onChange={async (e) => {
                setUploadError(null)
                const file = e.target.files?.[0]
                if (!file) return
                if (file.type !== 'image/svg+xml') {
                  setUploadError('Only SVG files are allowed')
                  return
                }
                if (file.size > 512 * 1024) {
                  setUploadError('SVG must be <= 0.5MB')
                  return
                }
                const text = await file.text()
                const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(text)))
                setLogo({ type: 'upload', value: dataUrl, alt: file.name }, null)
              }}
              className="mt-1 block w-full text-xs"
            />
            {uploadError && <div className="text-xs text-red-500 mt-1">{uploadError}</div>}
          </div>
        </section>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Compact Typography */}
        <section className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Font</label>
          <div className="grid grid-cols-3 gap-2">
            {TOP_GOOGLE_FONTS.slice(0, 6).map((font) => (
              <Card
                key={font.variable}
                className={`p-2 cursor-pointer transition-all text-center ${
                  selectedFont === font.variable
                    ? "ring-2 ring-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_8%,white)] dark:bg-[var(--brand-soft)]"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => changeFont(font.variable)}
              >
                <div className="font-medium text-xs truncate">{font.name.replace(/\s+/g, ' ').split(' ')[0]}</div>
              </Card>
            ))}
          </div>
          {TOP_GOOGLE_FONTS.length > 6 && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              {TOP_GOOGLE_FONTS.slice(6).map((font) => (
                <Card
                  key={font.variable}
                  className={`p-2 cursor-pointer transition-all text-center ${
                    selectedFont === font.variable
                      ? "ring-2 ring-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_8%,white)] dark:bg-[var(--brand-soft)]"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => changeFont(font.variable)}
                >
                  <div className="font-medium text-xs truncate">{font.name.replace(/\s+/g, ' ').split(' ')[0]}</div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Theme Mode */}
      <section className="space-y-3 gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme Mode</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2" role="radiogroup" aria-label="Theme Mode">
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
                    ? "ring-2 ring-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_8%,white)] dark:bg-[var(--brand-soft)]"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex-shrink-0">{option.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{option.label}</div>
                  
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Branding */}
      <section className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Branding</label>
        {/* Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {presets.map((p) => {
            const active = presetId === p.id
            return (
              <Card
                key={p.id}
                className={`p-3 cursor-pointer transition-all flex flex-col items-center gap-2 ${
                  active ? "ring-2 ring-[var(--brand)] bg-gray-50 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => {
                  setBrandHex(p.color)
                  setLogo({ type: 'preset', value: p.logo, alt: p.alt || p.name }, p.id)
                  setHexInput(p.color)
                }}
              >
                <img src={p.logo} alt={p.name} className="h-8" />
                <div className="text-xs" style={{ color: p.color }}>{p.name}</div>
              </Card>
            )
          })}
        </div>

        {/* Color + hex */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <input
              aria-label="Brand color"
              type="color"
              value={hexInput}
              onChange={(e) => {
                setHexInput(e.target.value)
                setBrandHex(e.target.value)
              }}
              className="h-10 w-12 rounded cursor-pointer border border-gray-200 dark:border-gray-700"
            />
          </div>
          <input
            aria-label="Brand hex"
            type="text"
            value={hexInput}
            onChange={(e) => {
              const v = e.target.value
              setHexInput(v)
              if (/^#?[0-9a-fA-F]{6}$/.test(v)) setBrandHex(v)
            }}
            placeholder="#2563eb"
            className="h-10 flex-1 rounded border border-gray-200 dark:border-gray-700 bg-transparent px-3 text-sm"
          />
        </div>

        {/* Upload */}
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400">Upload SVG logo (max 0.5MB)</label>
          <input
            type="file"
            accept="image/svg+xml"
            onChange={async (e) => {
              setUploadError(null)
              const file = e.target.files?.[0]
              if (!file) return
              if (file.type !== 'image/svg+xml') {
                setUploadError('Only SVG files are allowed')
                return
              }
              if (file.size > 512 * 1024) {
                setUploadError('SVG must be <= 0.5MB')
                return
              }
              const text = await file.text()
              const dataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(text)))
              setLogo({ type: 'upload', value: dataUrl, alt: file.name }, null)
            }}
            className="mt-1 block w-full text-sm"
          />
          {uploadError && <div className="text-sm text-red-500 mt-1">{uploadError}</div>}
        </div>
      </section>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Typography */}
      <section className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Typography</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
          {TOP_GOOGLE_FONTS.map((font) => (
              <Card
                key={font.variable}
                className={`p-3 cursor-pointer transition-all text-center ${
                selectedFont === font.variable
                  ? "ring-2 ring-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_8%,white)] dark:bg-[var(--brand-soft)]"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => changeFont(font.variable)}
            >
              <div className="font-medium text-sm truncate">{font.name}</div>
              
            </Card>
          ))}
        </div>
      </section>

      {/* No extra quick actions to avoid duplication */}
    </div>
  )
}

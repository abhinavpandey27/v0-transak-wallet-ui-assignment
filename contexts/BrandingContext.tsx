"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

type LogoSource =
  | { type: "preset"; value: string; alt?: string }
  | { type: "upload"; value: string; alt?: string } // value is data URL string for SVG

export interface BrandPreset {
  id: string
  name: string
  color: string // hex e.g. #2563eb
  logo: string // public path to SVG
  alt?: string
}

export interface BrandingConfig {
  brandHex: string
  logo: LogoSource
  presetId?: string | null
}

interface BrandingContextType extends BrandingConfig {
  setBrandHex: (hex: string) => void
  setLogo: (logo: LogoSource, presetId?: string | null) => void
  presets: BrandPreset[]
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined)

// Bundled presets (public assets)
const BUNDLED_PRESETS: BrandPreset[] = [
  { id: "transak", name: "Transak", color: "#2563eb", logo: "/transak-logo.svg", alt: "Transak" },
  { id: "emerald", name: "Emerald", color: "#059669", logo: "/placeholder-logo.svg", alt: "Emerald" },
  { id: "amber", name: "Amber", color: "#d97706", logo: "/placeholder-logo.svg", alt: "Amber" },
  { id: "violet", name: "Violet", color: "#7c3aed", logo: "/placeholder-logo.svg", alt: "Violet" },
]

const STORAGE_KEY = "branding-config"

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<BrandingConfig>(() => {
    if (typeof window === "undefined") {
      return {
        brandHex: "#2563eb",
        logo: { type: "preset", value: "/transak-logo.svg", alt: "Transak" },
        presetId: "transak",
      }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw) as BrandingConfig
    } catch {}
    return {
      brandHex: "#2563eb",
      logo: { type: "preset", value: "/transak-logo.svg", alt: "Transak" },
      presetId: "transak",
    }
  })

  // Persist to localStorage (preview only)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {}
  }, [config])

  // Apply CSS variables derived from brand
  useEffect(() => {
    applyBrandVariables(config.brandHex)
  }, [config.brandHex])

  const setBrandHex = (hex: string) => {
    setConfig((c) => ({ ...c, brandHex: normalizeHex(hex), presetId: null }))
  }
  const setLogo = (logo: LogoSource, presetId?: string | null) => {
    setConfig((c) => ({ ...c, logo, presetId: presetId ?? null }))
  }

  const value = useMemo<BrandingContextType>(
    () => ({ ...config, setBrandHex, setLogo, presets: BUNDLED_PRESETS }),
    [config]
  )

  return <BrandingContext.Provider value={value}>{children}</BrandingContext.Provider>
}

export function useBranding() {
  const ctx = useContext(BrandingContext)
  if (!ctx) throw new Error("useBranding must be used within BrandingProvider")
  return ctx
}

// --- Helpers ---
function normalizeHex(hex: string) {
  const h = hex.trim()
  if (/^#?[0-9a-fA-F]{6}$/.test(h)) return h.startsWith("#") ? h : `#${h}`
  return "#2563eb"
}

// Compute contrast and set foreground for AA by choosing black/white automatically.
function applyBrandVariables(hex: string) {
  if (typeof document === "undefined") return
  const root = document.documentElement
  const rgb = hexToRgb(hex)
  const hexNorm = normalizeHex(hex)
  if (!rgb) return

  const black = { r: 0, g: 0, b: 0 }
  const white = { r: 255, g: 255, b: 255 }
  const contrastWithBlack = contrastRatio(rgb, black)
  const contrastWithWhite = contrastRatio(rgb, white)
  let foreground = contrastWithBlack >= contrastWithWhite ? "#000000" : "#ffffff"
  let bgRgb = { ...rgb }
  // Enforce AA: if chosen fg has < 4.5 contrast, adjust background lightness toward better contrast
  const target = foreground === "#000000" ? black : white
  let tries = 0
  while (contrastRatio(bgRgb, target) < 4.5 && tries < 20) {
    // move lightness away from target color by 3% steps
    const delta = foreground === "#000000" ? -3 : 3
    bgRgb = adjustLightness(bgRgb, delta)
    tries++
  }
  const finalHex = rgbToHex(bgRgb)

  root.style.setProperty("--brand", finalHex)
  root.style.setProperty("--brand-foreground", foreground)
  // Also drive shadcn primary tokens from brand
  root.style.setProperty("--primary", finalHex)
  root.style.setProperty("--primary-foreground", foreground)
  // Derivatives
  const hover = adjustLightness(bgRgb, -8)
  const active = adjustLightness(bgRgb, -14)
  const ring = adjustAlpha(bgRgb, 0.4)
  root.style.setProperty("--brand-hover", rgbToHex(hover))
  root.style.setProperty("--brand-active", rgbToHex(active))
  root.style.setProperty("--brand-ring", ring)
}

function hexToRgb(hex: string) {
  const normalized = normalizeHex(hex).slice(1)
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  if ([r, g, b].some((v) => Number.isNaN(v))) return null
  return { r, g, b }
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b]
    .map((v) => Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0"))
    .join("")}`
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const srgb = [r, g, b].map((v) => v / 255)
  const lin = srgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

function contrastRatio(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  const L1 = relativeLuminance(a)
  const L2 = relativeLuminance(b)
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return (lighter + 0.05) / (darker + 0.05)
}

function adjustLightness(rgb: { r: number; g: number; b: number }, delta: number) {
  // naive HSL lightness adjust
  const { h, s, l } = rgbToHsl(rgb)
  const l2 = Math.max(0, Math.min(1, l + delta / 100))
  return hslToRgb({ h, s, l: l2 })
}

function adjustAlpha(rgb: { r: number; g: number; b: number }, alpha: number) {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, Math.min(1, alpha))})`
}

function rgbToHsl({ r, g, b }: { r: number; g: number; b: number }) {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255
  const max = Math.max(r1, g1, b1), min = Math.min(r1, g1, b1)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r1: h = (g1 - b1) / d + (g1 < b1 ? 6 : 0); break
      case g1: h = (b1 - r1) / d + 2; break
      case b1: h = (r1 - g1) / d + 4; break
    }
    h /= 6
  }
  return { h, s, l }
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }) {
  if (s === 0) {
    const v = Math.round(l * 255)
    return { r: v, g: v, b: v }
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const r = hue2rgb(p, q, h + 1 / 3)
  const g = hue2rgb(p, q, h)
  const b = hue2rgb(p, q, h - 1 / 3)
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

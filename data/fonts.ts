import type { GoogleFont } from "@/types/theme"

export const TOP_GOOGLE_FONTS: GoogleFont[] = [
  {
    name: "Inter",
    family: "Inter",
    weights: [400, 500, 600, 700],
    variable: "--font-inter",
  },
  {
    name: "Instrument Sans",
    family: "Instrument_Sans",
    weights: [400, 500, 600, 700],
    variable: "--font-instrument-sans",
  },
  {
    name: "IBM Plex Sans",
    family: "IBM_Plex_Sans",
    weights: [400, 500, 600, 700],
    variable: "--font-ibm-plex-sans",
  },
  {
    name: "Manrope",
    family: "Manrope",
    weights: [400, 500, 600, 700],
    variable: "--font-manrope",
  },
  {
    name: "Plus Jakarta Sans",
    family: "Plus_Jakarta_Sans",
    weights: [400, 500, 600, 700],
    variable: "--font-plus-jakarta-sans",
  },
  {
    name: "Space Grotesk",
    family: "Space_Grotesk",
    weights: [400, 500, 600, 700],
    variable: "--font-space-grotesk",
  },
  {
    name: "Be Vietnam Pro",
    family: "Be_Vietnam_Pro",
    weights: [400, 500, 600, 700],
    variable: "--font-be-vietnam-pro",
  },
  {
    name: "System",
    family: "system-ui",
    weights: [400, 500, 600, 700],
    variable: "--font-system",
  },
]

export const DEFAULT_TYPOGRAPHY_CONFIG = {
  fontFamily: "--font-instrument-sans",
  fontName: "Instrument Sans",
  scale: "normal" as const,
  headingWeight: "semibold" as const,
  bodyWeight: "normal" as const,
}

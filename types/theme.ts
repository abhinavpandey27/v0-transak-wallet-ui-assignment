export interface TypographyConfig {
  fontFamily: string
  fontName: string
  scale: "compact" | "normal" | "comfortable" | "large"
  headingWeight: "normal" | "medium" | "semibold" | "bold"
  bodyWeight: "light" | "normal" | "medium"
}

export interface ScalingConfig {
  level: "compact" | "normal" | "comfortable" | "large"
  customScale?: number
}

export interface BrandConfig {
  primaryColor: string
  autoGenerateSecondary: boolean
  customSecondary?: string
}

export interface ThemeConfig {
  mode: "light" | "dark" | "system"
  typography: TypographyConfig
  scaling: ScalingConfig
  brand: BrandConfig
}

export interface GoogleFont {
  name: string
  family: string
  weights: number[]
  variable: string
}

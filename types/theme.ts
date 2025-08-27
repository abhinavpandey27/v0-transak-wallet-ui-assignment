export interface TypographyConfig {
  fontFamily: string
  fontName: string
  scale: "compact" | "normal" | "comfortable" | "large"
  headingWeight: "normal" | "medium" | "semibold" | "bold"
  bodyWeight: "light" | "normal" | "medium"
}

export interface ThemeConfig {
  mode: "light" | "dark"
  typography: TypographyConfig
}

export interface GoogleFont {
  name: string
  family: string
  weights: number[]
  variable: string
}

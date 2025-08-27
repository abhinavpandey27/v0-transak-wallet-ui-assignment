import type React from "react"
import type { Metadata } from "next"
import {
  Instrument_Sans,
  Inter,
  IBM_Plex_Sans,
  Manrope,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Be_Vietnam_Pro,
} from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { SimpleThemeProvider } from "@/contexts/SimpleThemeContext"

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta-sans",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
})

export const metadata: Metadata = {
  title: "Crypto Wallet UI",
  description: "A comprehensive crypto wallet interface with customizable themes",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const fontVariables = [
    instrumentSans.variable,
    inter.variable,
    ibmPlexSans.variable,
    manrope.variable,
    plusJakartaSans.variable,
    spaceGrotesk.variable,
    beVietnamPro.variable,
  ].join(" ")

  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SimpleThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SimpleThemeProvider>
      </body>
    </html>
  )
}

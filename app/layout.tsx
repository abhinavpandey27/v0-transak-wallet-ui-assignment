import type React from "react"
import type { Metadata } from "next"
import { Instrument_Sans } from "next/font/google"
import "./globals.css"

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={instrumentSans.variable}>
      <head>
        <style>{`
html {
  font-family: ${instrumentSans.style.fontFamily};
  --font-sans: ${instrumentSans.style.fontFamily};
  --font-mono: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}

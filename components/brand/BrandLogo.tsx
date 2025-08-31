"use client"

import React from "react"
import { useBranding } from "@/contexts/BrandingContext"

interface BrandLogoProps {
  className?: string
  width?: number
  height?: number
  alt?: string
}

export default function BrandLogo({ className, width = 96, height = 32, alt }: BrandLogoProps) {
  const { logo } = useBranding()
  const finalAlt = alt || ("alt" in logo ? logo.alt || "Brand" : "Brand")

  if (logo.type === "upload") {
    // Render uploaded SVG via img data URL to avoid dangerous HTML
    return <img src={logo.value} alt={finalAlt} width={width} height={height} className={className} />
  }
  return <img src={logo.value} alt={finalAlt} width={width} height={height} className={className} />
}

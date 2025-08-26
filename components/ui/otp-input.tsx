"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  disabled?: boolean
  error?: boolean
  className?: string
}

export function OTPInput({ length = 6, onComplete, disabled = false, error = false, className }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Reset OTP when disabled state changes (for resend functionality)
  useEffect(() => {
    if (disabled) {
      setOtp(new Array(length).fill(""))
    }
  }, [disabled, length])

  const handleChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Call onComplete when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === length) {
      onComplete(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace navigation
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      }
    }

    // Handle arrow key navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "")

    if (pastedData.length === length) {
      const newOtp = pastedData.split("")
      setOtp(newOtp)
      onComplete(pastedData)
      // Focus last input
      inputRefs.current[length - 1]?.focus()
    }
  }

  return (
    <div className={cn("flex justify-center items-center space-x-3", className)}>
      {otp.map((digit, index) => (
        <div key={index} className="flex items-center">
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-12 h-12 text-center text-lg font-medium rounded-lg transition-colors",
              "border-2 bg-background text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-opacity-20",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : "border-muted-foreground/20 focus:border-cyan-500 focus:ring-cyan-500",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            aria-label={`Digit ${index + 1} of ${length}`}
          />
          {/* Add separator after 3rd digit for 6-digit OTP */}
          {length === 6 && index === 2 && <span className="mx-2 text-muted-foreground font-medium select-none">-</span>}
        </div>
      ))}
    </div>
  )
}

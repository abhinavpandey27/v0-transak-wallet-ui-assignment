"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  currentStep: "login" | "otp" | "dashboard"
  email: string
  setEmail: (email: string) => void
  sendOTP: (email: string) => Promise<void>
  verifyOTP: (otp: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Sample OTP for demo purposes
const DEMO_OTP = "123456"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentStep, setCurrentStep] = useState<"login" | "otp" | "dashboard">("login")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem("family-auth")
    if (authStatus === "authenticated") {
      setIsAuthenticated(true)
      setCurrentStep("dashboard")
    }
  }, [])

  const sendOTP = async (emailAddress: string): Promise<void> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailAddress) && !emailAddress.match(/^\+?[\d\s-()]+$/)) {
        throw new Error("Please enter a valid email or phone number")
      }

      setEmail(emailAddress)
      setCurrentStep("otp")
      console.log(`[v0] Demo OTP sent: ${DEMO_OTP}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (otp: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (otp === DEMO_OTP) {
        setIsAuthenticated(true)
        setCurrentStep("dashboard")
        localStorage.setItem("family-auth", "authenticated")
        return true
      } else {
        throw new Error("Invalid verification code. Please try again.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setCurrentStep("login")
    setEmail("")
    setError(null)
    localStorage.removeItem("family-auth")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentStep,
        email,
        setEmail,
        sendOTP,
        verifyOTP,
        logout,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

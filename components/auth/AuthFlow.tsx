"use client"

import { useAuth } from "@/contexts/AuthContext"
import LoginScreen from "./LoginScreen"
import OTPScreen from "./OTPScreen"
import WalletDashboard from "@/components/wallet-dashboard"

export default function AuthFlow() {
  const { isAuthenticated, currentStep } = useAuth()

  if (isAuthenticated && currentStep === "dashboard") {
    return <WalletDashboard />
  }

  if (currentStep === "otp") {
    return <OTPScreen />
  }

  // Default to login screen
  return <LoginScreen />
}

"use client"

import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { OTPInput } from "@/components/ui/otp-input"
import { ArrowLeft, Mail } from "lucide-react"

export default function OTPScreen() {
  const { email, verifyOTP, sendOTP, isLoading, error, setEmail } = useAuth()

  const handleOTPComplete = async (otp: string) => {
    await verifyOTP(otp)
  }

  const handleResend = async () => {
    await sendOTP(email)
  }

  const handleBack = () => {
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="px-6 py-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="p-2 hover:bg-muted">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Email Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-2">
            <h1 className="text-xl font-semibold text-foreground">We've emailed you a verification code</h1>
            <p className="text-muted-foreground">Please enter the code we sent you below.</p>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <OTPInput length={6} onComplete={handleOTPComplete} disabled={isLoading} error={!!error} />

            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            {/* Resend Options */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">We've sent you another validation code.</p>
              <p className="text-sm text-muted-foreground">
                Still didn't get a code?{" "}
                <button
                  onClick={handleResend}
                  disabled={isLoading}
                  className="text-foreground font-medium hover:underline"
                >
                  Check your email
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="px-6 py-8">
        <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
          <button className="hover:text-foreground transition-colors">Developers</button>
          <button className="hover:text-foreground transition-colors">Privacy</button>
          <button className="hover:text-foreground transition-colors">Terms</button>
        </div>
      </div>

      {/* Bottom Branding */}
      
    </div>
  )
}

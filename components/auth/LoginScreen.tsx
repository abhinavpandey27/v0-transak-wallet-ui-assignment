"use client"

import type React from "react"
import { CustomButton } from "@/components/ui/custom-button"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Input } from "@/components/ui/input"

export default function LoginScreen() {
  const [emailInput, setEmailInput] = useState("")
  const { sendOTP, isLoading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (emailInput.trim()) {
      await sendOTP(emailInput.trim())
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="flex justify-center h-12">
            <img src="/transak-logo.svg" alt="Transak" className="w-24 h-24" />
          </div>

          {/* Welcome Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Welcome to Transak</h1>
            <p className="text-muted-foreground">Log in or sign up to get started.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <CustomButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || !emailInput.trim()}
            >
              {isLoading ? "Sending..." : "Continue"}
            </CustomButton>

            <p className="text-center text-sm text-muted-foreground">
              We'll create an account if you don't have one yet.
            </p>
          </form>
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

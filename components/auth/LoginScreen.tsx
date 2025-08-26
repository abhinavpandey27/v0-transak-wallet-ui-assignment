"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1">
                <div className="w-2 h-2 bg-white dark:bg-black rounded-sm"></div>
                <div className="w-2 h-2 bg-white dark:bg-black rounded-sm"></div>
                <div className="w-2 h-2 bg-white dark:bg-black rounded-sm"></div>
                <div className="w-2 h-2 bg-white dark:bg-black rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Welcome to Family</h1>
            <p className="text-muted-foreground">Log in or sign up to get started.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Email or Phone Number"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="h-12 border-2 border-cyan-400 focus:border-cyan-500 focus:ring-cyan-500"
                disabled={isLoading}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-medium"
              disabled={isLoading || !emailInput.trim()}
            >
              {isLoading ? "Sending..." : "Continue"}
            </Button>

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
      <div className="bg-black dark:bg-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1 h-1 bg-black rounded-sm"></div>
                <div className="w-1 h-1 bg-black rounded-sm"></div>
                <div className="w-1 h-1 bg-black rounded-sm"></div>
                <div className="w-1 h-1 bg-black rounded-sm"></div>
              </div>
            </div>
            <span className="text-white font-medium">Family</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <span className="text-sm">curated by</span>
            <span className="font-bold">Mobbin</span>
          </div>
        </div>
      </div>
    </div>
  )
}

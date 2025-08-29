"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { User, MapPin, Target, Camera, Mail, Lock, Key, Smartphone, Shield, ChevronRight } from "lucide-react"

interface KYCStep {
  id: string
  title: string
  description: string
  status: "completed" | "pending" | "failed"
  timestamp?: string
  icon: React.ComponentType<{ className?: string }>
}

interface KYCSecurityScreenProps {
  verificationDate?: string
}

export default function KYCSecurityScreen({ verificationDate = "12 Mar 2025, 11:02 AM" }: KYCSecurityScreenProps) {
  const [authenticatorEnabled, setAuthenticatorEnabled] = useState(false)

  const kycSteps: KYCStep[] = [
    {
      id: "personal-details",
      title: "Personal Details",
      description: "Added personal details · Self-verified",
      status: "completed",
      timestamp: "12 Mar 2025, 10:42 AM",
      icon: User,
    },
    {
      id: "address",
      title: "Address",
      description: "Residential address submitted · Verified",
      status: "completed",
      timestamp: "12 Mar 2025, 10:47 AM",
      icon: MapPin,
    },
    {
      id: "purpose",
      title: "Purpose of Using Transak",
      description: "Selected: Buying crypto for personal investment",
      status: "completed",
      timestamp: "12 Mar 2025, 10:47 AM",
      icon: Target,
    },
    {
      id: "id-proof",
      title: "ID Proof and Selfie",
      description: "ID and selfie uploaded and Verified by our partner Onfido",
      status: "completed",
      timestamp: "12 Mar 2025, 11:02 AM",
      icon: Camera,
    },
  ]

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div className="max-w-full sm:max-w-[640px] w-full">
      {/* KYC Verification Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">KYC Verification</h2>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 space-y-4">
          {kycSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-center gap-2 justify-between">
                {/* Number circle */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 text-black bg-slate-100">
                    {index + 1}
                  </div>
                  {/* Smaller icon */}
                  <div className="w-8 h-8 rounded-full dark:bg-gray-700 flex items-center justify-center flex-shrink-0 bg-transparent">
                    <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  {/* Title */}
                  <span className="font-medium text-gray-900 dark:text-white">{step.title}</span>
                </div>
                {/* Status chip */}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStepStatusColor(step.status)}`}>
                  {step.status === "completed" ? "Completed" : step.status === "pending" ? "Pending" : "Failed"}
                </span>
              </div>
            )
          })}

          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-800 dark:text-green-300">
                KYC Verified | All account features unlocked.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Login-in Method Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Login-in Method</h2>
        <Card className="p-4 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">Login Method</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-300">samlee.mobbin+1@gmail.com</span>
              <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Authentication Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Authentication</h2>
        <div className="bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
          <Card className="p-4 border-0 rounded-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Password</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-300">Enabled</span>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </Card>

          <Card className="p-4 border-0 rounded-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Passkey</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-300">1 Passkey</span>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preferences</h2>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
          <Card className="p-4 border-0 rounded-none border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Authenticator App</span>
              </div>
              <button
                onClick={() => setAuthenticatorEnabled(!authenticatorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  authenticatorEnabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    authenticatorEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </Card>

          <Card className="p-4 border-0 rounded-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">Account Recovery</span>
              </div>
              <div className="flex items-center gap-2">
                <CustomButton
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Generate Codes
                </CustomButton>
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

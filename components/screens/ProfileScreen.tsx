"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { CustomButton } from "@/components/ui/custom-button"
import { User, Shield, LogOut, Mail, Phone, Calendar, Building, MapPin, Globe, Hash } from "lucide-react"

interface ProfileData {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  dob: string
  kyc_status: "pending" | "verified" | "rejected"
  address: {
    line1: string
    city: string
    state: string
    postal_code: string
    country_name: string
    country_code: string
  }
  avatar: {
    type: string
    background_color: string
  }
}

interface ProfileScreenProps {
  profileData: ProfileData
  setProfileData: (data: ProfileData | ((prev: ProfileData) => ProfileData)) => void
}

export default function ProfileScreen({ profileData, setProfileData }: ProfileScreenProps) {
  const [showAvatarDialog, setShowAvatarDialog] = useState(false)

  const avatarOptions = [
    { emoji: "😊", color: "from-orange-300 to-yellow-400" },
    { emoji: "🚀", color: "from-blue-300 to-purple-400" },
    { emoji: "🌟", color: "from-yellow-300 to-orange-400" },
    { emoji: "🎯", color: "from-green-300 to-blue-400" },
    { emoji: "💎", color: "from-purple-300 to-pink-400" },
    { emoji: "🔥", color: "from-red-300 to-orange-400" },
    { emoji: "⚡", color: "from-cyan-300 to-blue-400" },
    { emoji: "🎨", color: "from-pink-300 to-purple-400" },
  ]

  return (
    <div className="max-w-[640px] w-full my-0 mb-14">
      {/* Profile Avatar Section */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div
            className={`w-24 h-24 bg-gradient-to-br from-orange-300 to-yellow-400 rounded-full flex items-center justify-center relative cursor-pointer hover:scale-105 transition-transform`}
            onClick={() => setShowAvatarDialog(true)}
          >
            <div className="text-white text-4xl">{profileData.avatar.type}</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-[var(--brand)] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">+</span>
            </div>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {profileData.first_name} {profileData.last_name}
        </h2>
      </div>

      {/* Personal Details Section */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-left text-base">Your Details</h3>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">First Name</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.first_name}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">Last Name</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.last_name}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">Email</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.email}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">Phone</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.phone}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">Date of Birth</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.dob}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">KYC Status</span>
            </div>
            <span
              className={`font-medium px-2 py-1 rounded-full text-xs ${
                profileData.kyc_status === "verified"
                  ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                  : profileData.kyc_status === "pending"
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
              }`}
            >
              {profileData.kyc_status.charAt(0).toUpperCase() + profileData.kyc_status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-left text-base">Your Address</h3>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">Street Address</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.address.line1}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <Building className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">City</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.address.city}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">State</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.address.state}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
            <div className="flex items-center gap-3">
              <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">Postal Code</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.address.postal_code}
            </span>
          </div>
          <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">Country</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white break-words text-right max-w-[60%]">
              {profileData.address.country_name}
            </span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-center">
        <CustomButton
          variant="outline"
          size="lg"
          className="w-full text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </CustomButton>
      </div>

      {/* Avatar Selection Dialog */}
      {showAvatarDialog && (
        <Sheet open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
          <SheetContent>
            <div className="flex items-center justify-between mb-2">
              <SheetTitle>Choose Avatar</SheetTitle>
              <SheetClose aria-label="Close" className="text-sm text-gray-500 hover:underline">Close</SheetClose>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {avatarOptions.map((option, index) => (
                <button
                  key={index}
                  className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform ${
                    profileData.avatar.type === option.emoji
                      ? "ring-2 ring-[var(--brand)] ring-offset-2 dark:ring-offset-gray-800"
                      : ""
                  }`}
                  onClick={() =>
                    setProfileData((prev) => ({
                      ...prev,
                      avatar: { type: option.emoji, background_color: option.color },
                    }))
                  }
                >
                  <span className="text-white text-2xl">{option.emoji}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <CustomButton variant="outline" size="md" className="flex-1" onClick={() => setShowAvatarDialog(false)}>
                Cancel
              </CustomButton>
              <CustomButton variant="primary" size="md" className="flex-1" onClick={() => setShowAvatarDialog(false)}>
                Save
              </CustomButton>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

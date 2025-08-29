"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Home, User, CreditCard, Shield, MoreHorizontal, LogOut, Menu } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "next-themes"
import { SettingsDialog } from "@/components/theme/SettingsDialog"
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet"

import WalletScreen from "@/components/screens/WalletScreen"
import DepositFlow from "@/components/flows/DepositFlow"
import WithdrawalFlow from "@/components/flows/WithdrawalFlow"
import ProfileScreen from "@/components/screens/ProfileScreen"
import TransactionLimitsScreen from "@/components/screens/TransactionLimitsScreen"
import KYCSecurityScreen from "@/components/screens/KYCSecurityScreen"

import { availableCurrencies, transactions, cryptoTransactions, initialProfileData } from "@/data/mockData"
import type { Currency, ProfileData } from "@/types"

export default function WalletDashboard() {
  const [activeTab, setActiveTab] = useState("fiat")
  const { theme } = useTheme()
  const { logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [currentScreen, setCurrentScreen] = useState("wallet")
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Transaction limits state
  const [limitsActiveTab, setLimitsActiveTab] = useState("daily")
  const [limitsCurrency, setLimitsCurrency] = useState<Currency>(availableCurrencies[0])

  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    const newWidth = e.clientX
    if (newWidth >= 200 && newWidth <= 400) {
      setSidebarWidth(newWidth)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  const handleLogout = () => {
    console.log("[v0] Logging out user")
    logout()
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing])

  // Initialize on mount
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      console.log("[v0] Theme state:", { theme })
      console.log("[v0] Document class list:", document.documentElement.classList.toString())
    }
  }, [theme, mounted])

  const getScreenTitle = () => {
    switch (currentScreen) {
      case "deposit":
        return "Deposit"
      case "withdraw":
        return "Withdraw"
      case "profile":
        return "Account"
      case "transactionLimits":
        return "Transaction Limits"
      case "security":
        return "KYC and Security"
      default:
        return "Your Wallet"
    }
  }

  const currentTheme = theme || "light"

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="flex min-h-[100dvh] bg-gray-50">Loading...</div>
  }

  if (currentScreen === "deposit") {
    return <DepositFlow onComplete={() => setCurrentScreen("wallet")} />
  }

  if (currentScreen === "withdraw") {
    return <WithdrawalFlow onBack={() => setCurrentScreen("wallet")} onComplete={() => setCurrentScreen("wallet")} />
  }

  return (
    <div className="flex min-h-[100dvh] bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:flex hidden flex-col h-full relative"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Logo */}
        <div className="p-6 border-gray-200 dark:border-gray-700 flex-shrink-0 border-b-0">
          <div className="flex items-center gap-2">
            <img src="/transak-logo.svg" alt="Transak" className="w-content h-10" />

            <button
              onClick={() => setShowSettingsDialog(true)}
              className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto px-5">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setCurrentScreen("wallet")}
              aria-current={currentScreen === "wallet" ? "page" : undefined}
              className={`flex w-full text-left items-center gap-3 rounded-lg py-3 px-4 ${
                currentScreen === "wallet"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Your Wallet</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen("profile")}
              aria-current={currentScreen === "profile" ? "page" : undefined}
              className={`flex w-full text-left items-center gap-3 py-3 px-4 rounded-lg ${
                currentScreen === "profile"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Your Account</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen("transactionLimits")}
              aria-current={currentScreen === "transactionLimits" ? "page" : undefined}
              className={`flex w-full text-left items-center gap-3 py-3 px-4 rounded-lg ${
                currentScreen === "transactionLimits"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Transaction Limits</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentScreen("security")}
              aria-current={currentScreen === "security" ? "page" : undefined}
              className={`flex w-full text-left items-center gap-3 py-3 px-4 rounded-lg ${
                currentScreen === "security"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>KYC and Security</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full text-left items-center gap-3 py-3 px-4 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 flex-shrink-0 pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-start gap-0.5">
                <span>Powered by</span>
                <span className="font-extrabold">Transak</span>
              </div>
              <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700 justify-start">
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Developers
                </a>
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}

        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors ${
            isResizing ? "bg-blue-500" : "bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Right Pane */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {/* Mobile Top Bar */}
        <div className="md:hidden sticky top-0 z-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 flex items-center justify-between">
            <button
              aria-label="Open navigation"
              className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h1 className="text-base font-semibold text-gray-900 dark:text-white">{getScreenTitle()}</h1>
            <button
              aria-label="Open settings"
              onClick={() => setShowSettingsDialog(true)}
              className="w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 flex justify-center overflow-y-auto pb-72 h-full pt-8 pl-0 pr-0">
          {currentScreen === "wallet" && (
            <WalletScreen
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              transactions={transactions}
              cryptoTransactions={cryptoTransactions}
              onNavigateToDeposit={() => setCurrentScreen("deposit")}
              onNavigateToWithdraw={() => setCurrentScreen("withdraw")}
            />
          )}
          {currentScreen === "profile" && <ProfileScreen profileData={profileData} setProfileData={setProfileData} />}
          {currentScreen === "transactionLimits" && (
            <TransactionLimitsScreen
              limitsActiveTab={limitsActiveTab}
              setLimitsActiveTab={setLimitsActiveTab}
              limitsCurrency={limitsCurrency}
              setLimitsCurrency={setLimitsCurrency}
              availableCurrencies={availableCurrencies}
            />
          )}
          {currentScreen === "security" && <KYCSecurityScreen />}
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog} />

      {/* Mobile Navigation Sheet */}
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent>
          <div className="flex items-center justify-between mb-2">
            <SheetTitle>Navigation</SheetTitle>
            <SheetClose aria-label="Close navigation" className="text-sm text-gray-500 hover:underline">
              Close
            </SheetClose>
          </div>
          <div className="mt-2 divide-y divide-gray-200 dark:divide-gray-700">
            <button
              type="button"
              onClick={() => {
                setCurrentScreen("wallet")
                setMobileNavOpen(false)
              }}
              className="w-full text-left py-3 text-gray-900 dark:text-white"
            >
              Your Wallet
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentScreen("profile")
                setMobileNavOpen(false)
              }}
              className="w-full text-left py-3 text-gray-900 dark:text-white"
            >
              Your Account
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentScreen("transactionLimits")
                setMobileNavOpen(false)
              }}
              className="w-full text-left py-3 text-gray-900 dark:text-white"
            >
              Transaction Limits
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentScreen("security")
                setMobileNavOpen(false)
              }}
              className="w-full text-left py-3 text-gray-900 dark:text-white"
            >
              KYC and Security
            </button>
            <button
              type="button"
              onClick={() => {
                handleLogout()
                setMobileNavOpen(false)
              }}
              className="w-full text-left py-3 text-red-600 dark:text-red-400"
            >
              Log Out
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

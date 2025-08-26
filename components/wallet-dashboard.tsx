"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Home, User, CreditCard, Shield, MoreHorizontal, Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { SettingsDialog } from "@/components/theme/SettingsDialog"

import WalletScreen from "@/components/screens/WalletScreen"
import DepositScreen from "@/components/screens/DepositScreen"
import WithdrawScreen from "@/components/screens/WithdrawScreen"
import ProfileScreen from "@/components/screens/ProfileScreen"
import TransactionLimitsScreen from "@/components/screens/TransactionLimitsScreen"
import KYCSecurityScreen from "@/components/screens/KYCSecurityScreen"

import {
  availableCurrencies,
  cryptoTokens,
  transactions,
  cryptoTransactions,
  bankAccounts,
  initialProfileData,
} from "@/data/mockData"
import type { Currency, Token, ProfileData } from "@/types"

export default function WalletDashboard() {
  const [activeTab, setActiveTab] = useState("fiat")
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentScreen, setCurrentScreen] = useState("wallet")
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [isResizing, setIsResizing] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)

  // Deposit screen state
  const [depositAmount, setDepositAmount] = useState("")
  const [depositDescription, setDepositDescription] = useState("")
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(availableCurrencies[0])
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [showTokenDialog, setShowTokenDialog] = useState(false)

  // Withdraw screen state
  const [selectedSendingToken, setSelectedSendingToken] = useState<Token>(cryptoTokens[1]) // ETH
  const [selectedWithdrawCurrency, setSelectedWithdrawCurrency] = useState<Currency>(availableCurrencies[0])
  const [selectedBankAccount, setSelectedBankAccount] = useState(0)
  const [showQRCode, setShowQRCode] = useState(false)

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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      console.log("[v0] Theme state:", { theme, systemTheme, resolvedTheme })
      console.log("[v0] Document class list:", document.documentElement.classList.toString())
    }
  }, [theme, systemTheme, resolvedTheme, mounted])

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

  const currentTheme = theme === "system" ? systemTheme || "light" : theme || "light"

  const handleThemeChange = (newTheme: string) => {
    console.log("[v0] Changing theme from", theme, "to", newTheme)
    setTheme(newTheme)

    // Force immediate DOM update for debugging
    setTimeout(() => {
      console.log("[v0] After theme change - Document classes:", document.documentElement.classList.toString())
      console.log("[v0] After theme change - Computed style:", window.getComputedStyle(document.body).backgroundColor)
    }, 100)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="flex h-screen bg-gray-50">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full relative"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Logo */}
        <div className="p-6 border-gray-200 dark:border-gray-700 flex-shrink-0 border-b-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black dark:bg-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white dark:bg-black rounded-full"></div>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Logoipsum</span>
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
            <div
              onClick={() => setCurrentScreen("wallet")}
              className={`flex items-center gap-3 rounded-lg py-3 px-4 cursor-pointer ${
                currentScreen === "wallet"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Your Wallet</span>
            </div>
            <div
              onClick={() => setCurrentScreen("profile")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                currentScreen === "profile"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Your Profile</span>
            </div>
            <div
              onClick={() => setCurrentScreen("transactionLimits")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                currentScreen === "transactionLimits"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span>Transaction Limits</span>
            </div>
            <div
              onClick={() => setCurrentScreen("security")}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                currentScreen === "security"
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>KYC and Security</span>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Powered by Transak</span>
            <div className="flex items-center gap-3">
              <button className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Developer</button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Terms</button>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <button className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">Privacy Policy</button>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
            <button
              onClick={() => handleThemeChange("light")}
              className={`flex-1 text-xs px-3 py-2 rounded-md transition-all flex items-center justify-center gap-1 ${
                theme === "light"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Sun className="w-3 h-3" />
              Light
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              className={`flex-1 text-xs px-3 py-2 rounded-md transition-all flex items-center justify-center gap-1 ${
                theme === "dark"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Moon className="w-3 h-3" />
              Dark
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              className={`flex-1 text-xs px-3 py-2 rounded-md transition-all flex items-center justify-center gap-1 ${
                theme === "system"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Monitor className="w-3 h-3" />
              System
            </button>
          </div>
        </div>

        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 transition-colors ${
            isResizing ? "bg-blue-500" : "bg-transparent hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
          onMouseDown={handleMouseDown}
        />
      </div>

      {/* Right Pane */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
        {/* Page Header Section */}
        <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 py-6">
          <div className="max-w-[640px] w-full text-center">
            <h1 className="font-semibold text-gray-900 dark:text-white text-xl">{getScreenTitle()}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 flex justify-center overflow-y-auto">
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
          {currentScreen === "deposit" && (
            <DepositScreen
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              depositDescription={depositDescription}
              setDepositDescription={setDepositDescription}
              selectedCurrency={selectedCurrency}
              setSelectedCurrency={setSelectedCurrency}
              selectedToken={selectedToken}
              setSelectedToken={setSelectedToken}
              availableCurrencies={availableCurrencies}
              cryptoTokens={cryptoTokens}
              showTokenDialog={showTokenDialog}
              setShowTokenDialog={setShowTokenDialog}
            />
          )}
          {currentScreen === "withdraw" && (
            <WithdrawScreen
              selectedSendingToken={selectedSendingToken}
              setSelectedSendingToken={setSelectedSendingToken}
              selectedWithdrawCurrency={selectedWithdrawCurrency}
              setSelectedWithdrawCurrency={setSelectedWithdrawCurrency}
              selectedBankAccount={selectedBankAccount}
              setSelectedBankAccount={setSelectedBankAccount}
              showQRCode={showQRCode}
              setShowQRCode={setShowQRCode}
              availableCurrencies={availableCurrencies}
              cryptoTokens={cryptoTokens}
              bankAccounts={bankAccounts}
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
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { Home, User, CreditCard, Shield, MoreHorizontal, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useSimpleTheme } from "@/contexts/SimpleThemeContext"
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
  const { theme, setTheme } = useSimpleTheme()
  const { logout } = useAuth()
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

            <div
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 mt-4 border-t border-gray-200 dark:border-gray-700 pt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 flex-shrink-0 pb-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-between">
                <span>Powered by</span>
                <span className="font-medium">Transak</span>
              </div>
              <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
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

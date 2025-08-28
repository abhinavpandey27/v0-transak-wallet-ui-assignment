"use client"

import { useState } from "react"
import { ChevronDown, X, AlertCircle, Loader2 } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"
import type { Token, Currency, BankAccount } from "../WithdrawalFlow"
import BankDetailsCard from "@/components/shared/BankDetailsCard"

interface TokenSelectionScreenProps {
  selectedToken: Token | null
  selectedCurrency: Currency | null
  onTokenSelect: (token: Token) => void
  onCurrencySelect: (currency: Currency) => void
  onNext: () => void
  onChangeBankAccount?: () => void
  availableTokens?: Token[]
  availableCurrencies?: Currency[]
  bankAccount?: BankAccount | null
  isLoading: boolean
  error: string | null
}

export default function TokenSelectionScreen({
  selectedToken,
  selectedCurrency,
  onTokenSelect,
  onCurrencySelect,
  onNext,
  onChangeBankAccount,
  availableTokens = [],
  availableCurrencies = [],
  bankAccount,
  isLoading,
  error,
}: TokenSelectionScreenProps) {
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false)
  const [showBankAccountDialog, setShowBankAccountDialog] = useState(false)
  const [selectedBankIndex, setSelectedBankIndex] = useState(0)
  const [currentBankIndex, setCurrentBankIndex] = useState(0)

  const mockBankAccounts = [
    {
      id: "bank_1",
      bankName: "Simulator Bank",
      beneficiaryName: "Doe Jane",
      iban: "GB41SEOU19870010404544",
      bankAddress: "The Bower, 207-211 Old Street, London, England",
      bankCountry: "Malta",
      isDefault: true,
    },
    {
      id: "bank_2",
      bankName: "Chase Bank",
      beneficiaryName: "John Smith",
      iban: "US64SVBKUS6S3300958879",
      bankAddress: "270 Park Avenue, New York, NY 10017",
      bankCountry: "United States",
      isDefault: false,
    },
    {
      id: "bank_3",
      bankName: "HSBC Bank",
      beneficiaryName: "Alice Johnson",
      iban: "GB33BUKB20201555555555",
      bankAddress: "8 Canada Square, London E14 5HQ",
      bankCountry: "United Kingdom",
      isDefault: false,
    },
  ]

  const currentBankAccount = mockBankAccounts[currentBankIndex]

  const canProceed = selectedToken && selectedCurrency && currentBankAccount && !isLoading
  const showBankDetails = selectedToken && selectedCurrency && currentBankAccount

  const hasTokens = availableTokens.length > 0
  const hasCurrencies = availableCurrencies.length > 0

  const handleNext = () => {
    if (!selectedToken || !selectedCurrency || !currentBankAccount) {
      return // Validation handled by button state
    }
    onNext()
  }

  const handleChangeBankAccount = () => {
    setSelectedBankIndex(currentBankIndex)
    setShowBankAccountDialog(true)
  }

  const handleBankAccountSelection = () => {
    setCurrentBankIndex(selectedBankIndex)
    setShowBankAccountDialog(false)
  }

  return (
    <div className="space-y-6 mt-8">
      <div className="dark:bg-gray-800 rounded-xl p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">You are Sending</span>
          {selectedToken ? (
            <button
              onClick={() => setShowTokenDialog(true)}
              disabled={isLoading || !hasTokens}
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-medium text-white">
                ₿
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedToken.symbol}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          ) : (
            <button
              onClick={() => setShowTokenDialog(true)}
              disabled={isLoading || !hasTokens}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {!hasTokens && !isLoading ? "No Tokens Available" : "Select Token"}
            </button>
          )}
        </div>
      </div>

      {selectedToken && (
        <div className="dark:bg-gray-800 rounded-xl p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">You are Withdrawing</span>
            {selectedCurrency ? (
              <button
                onClick={() => setShowCurrencyDialog(true)}
                disabled={isLoading || !hasCurrencies}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src={`https://flagcdn.com/24x18/${selectedCurrency.code.slice(0, 2).toLowerCase()}.png`}
                  alt={selectedCurrency.code}
                  className="w-6 h-4 object-cover rounded-sm"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                    e.currentTarget.nextElementSibling!.style.display = "inline"
                  }}
                />
                <span className="text-lg hidden">{selectedCurrency.flag}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedCurrency.code}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            ) : (
              <button
                onClick={() => setShowCurrencyDialog(true)}
                disabled={isLoading || !hasCurrencies}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ChevronDown className="w-4 h-4" />
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!hasCurrencies && !isLoading ? "No Currencies Available" : "Select Currency"}
              </button>
            )}
          </div>
        </div>
      )}

      {showBankDetails && (
        <div className="space-y-4">
          <div className="flex items-center text-center justify-start">
            <div className="text-sm text-gray-600 dark:text-gray-400">Fiat will be deposited in this bank account</div>
            
          </div>

          <BankDetailsCard
            bankDetails={{
              bankName: currentBankAccount.bankName,
              beneficiaryName: currentBankAccount.beneficiaryName,
              iban: currentBankAccount.iban,
              bankAddress: currentBankAccount.bankAddress,
              bankCountry: currentBankAccount.bankCountry,
            }}
            showCopyButtons={false}
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">Error</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && !selectedToken && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading available tokens and currencies...</p>
        </div>
      )}

      {showBankDetails && (
        <div className="space-y-3">
          <CustomButton onClick={handleNext} disabled={!canProceed} variant="primary" size="lg" className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Next"
            )}
          </CustomButton>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Want to withdraw to another bank account?{" "}
              <button
                onClick={handleChangeBankAccount}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-bold underline transition-colors"
              >
                Change Bank Account
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Token Selection Dialog */}
      {showTokenDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Token</h3>
              <button
                onClick={() => setShowTokenDialog(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading tokens...</span>
              </div>
            ) : availableTokens.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No tokens available</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableTokens.map((token) => (
                  <button
                    key={token.id}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-left ${
                      selectedToken?.id === token.id
                        ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      onTokenSelect(token)
                      setShowTokenDialog(false)
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
                      {token.icon || token.symbol.slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{token.symbol}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{token.name}</div>
                      {token.balance !== undefined && (
                        <div className="text-xs text-gray-400">Balance: {token.balance}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Currency Selection Dialog */}
      {showCurrencyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Currency</h3>
              <button
                onClick={() => setShowCurrencyDialog(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading currencies...</span>
              </div>
            ) : availableCurrencies.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">No currencies available</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableCurrencies.map((currency) => (
                  <button
                    key={currency.code}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-left ${
                      selectedCurrency?.code === currency.code
                        ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    onClick={() => {
                      onCurrencySelect(currency)
                      setShowCurrencyDialog(false)
                    }}
                  >
                    <span className="text-2xl">{currency.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{currency.code}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{currency.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bank Account Selection Dialog */}
      {showBankAccountDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Bank Account</h3>
              <button
                onClick={() => setShowBankAccountDialog(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto mb-6">
              {mockBankAccounts.map((account, index) => (
                <button
                  key={account.id}
                  className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                    selectedBankIndex === index
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                  onClick={() => setSelectedBankIndex(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">{account.bankName}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{account.beneficiaryName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">{account.iban}</div>
                    </div>
                    {account.isDefault && (
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBankAccountDialog(false)}
                className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
              <CustomButton onClick={handleBankAccountSelection} variant="primary" size="md" className="flex-1">
                Done
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

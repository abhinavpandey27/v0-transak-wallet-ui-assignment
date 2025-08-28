"use client"

import { useState } from "react"
import { ChevronRight, X, AlertCircle, Loader2, Building, User, Hash, MapPin, Globe, Wallet } from "lucide-react"
import { CustomButton } from "@/components/ui/custom-button"
import type { Token, Currency, BankAccount } from "../WithdrawalFlow"

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

  const canProceed = selectedToken && selectedCurrency && bankAccount && !isLoading
  const showBankDetails = selectedToken && selectedCurrency && bankAccount

  const hasTokens = availableTokens.length > 0
  const hasCurrencies = availableCurrencies.length > 0

  const handleNext = () => {
    if (!selectedToken || !selectedCurrency || !bankAccount) {
      return // Validation handled by button state
    }
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="dark:bg-gray-800 rounded-xl p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">You are Sending</span>
          {selectedToken ? (
            <button
              onClick={() => setShowTokenDialog(true)}
              disabled={isLoading || !hasTokens}
              className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
                {selectedToken.icon || selectedToken.symbol.slice(0, 2)}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedToken.symbol}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ) : (
            <button
              onClick={() => setShowTokenDialog(true)}
              disabled={isLoading || !hasTokens}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {!hasTokens && !isLoading ? "No Tokens Available" : "Select Token"}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {selectedToken && (
        <div className="dark:bg-gray-800 rounded-xl p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300 text-lg font-medium">You are Withdrawing</span>
            {selectedCurrency ? (
              <button
                onClick={() => setShowCurrencyDialog(true)}
                disabled={isLoading || !hasCurrencies}
                className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-lg">{selectedCurrency.flag}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedCurrency.code}</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ) : (
              <button
                onClick={() => setShowCurrencyDialog(true)}
                disabled={isLoading || !hasCurrencies}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!hasCurrencies && !isLoading ? "No Currencies Available" : "Select Currency"}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {showBankDetails && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Fiat will be deposited in this bank account
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Bank Name</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{bankAccount.bankName}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Beneficiary Name</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{bankAccount.beneficiaryName}</span>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Hash className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">IBAN / Account</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{bankAccount.iban}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Bank address</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{bankAccount.bankAddress}</span>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Bank country</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{bankAccount.bankCountry}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Wallet Address</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white font-mono text-sm">
                {bankAccount.walletAddress}
              </span>
            </div>
          </div>
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
            <button
              onClick={onChangeBankAccount}
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium underline transition-colors"
            >
              Want to withdraw in another account? Change Bank Account
            </button>
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
    </div>
  )
}

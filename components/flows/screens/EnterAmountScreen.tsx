"use client"

import { useState, useEffect } from "react"
import { CustomButton } from "@/components/ui/custom-button"
import { ChevronRight, X, Plus } from "lucide-react"
import type { Currency, Token } from "@/types"

interface EnterAmountScreenProps {
  flowState: any
  updateFlowState: (updates: any) => void
  onNext: () => void
  canProceed: boolean
  isLoading: boolean
  availableCurrencies: Currency[]
  cryptoTokens: Token[]
  quoteHook: any
}

export default function EnterAmountScreen({
  flowState,
  updateFlowState,
  onNext,
  canProceed,
  isLoading,
  availableCurrencies,
  cryptoTokens,
  quoteHook,
}: EnterAmountScreenProps) {
  const [showCurrencyDialog, setShowCurrencyDialog] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)

  useEffect(() => {
    const amountNum = Number.parseFloat(flowState.amount)
    if (!flowState.token || !amountNum || amountNum <= 0) {
      quoteHook.clearQuote()
      return
    }

    quoteHook.getQuote({
      amount: amountNum,
      fromCurrency: flowState.currency.code,
      toCurrency: flowState.token.symbol,
      tokenId: flowState.token.id,
    })
  }, [flowState.amount, flowState.currency, flowState.token, quoteHook])

  const handleAmountChange = (value: string) => {
    const regex = /^\d*\.?\d{0,2}$/
    if (regex.test(value) || value === "") {
      updateFlowState({ amount: value })
    }
  }

  const formatCrypto = (qty: number, symbol: string) => {
    const formatted = qty.toPrecision(6).replace(/\.?0+$/, "")
    return `${formatted} ${symbol}`
  }

  const getQuoteText = () => {
    if (!flowState.token) return "Select token"
    if (quoteHook.loading) return "Fetching…"
    if (quoteHook.error) return "Can't fetch price. Retry"
    if (quoteHook.data?.estimatedAmount) {
      return formatCrypto(quoteHook.data.estimatedAmount, flowState.token.symbol)
    }
    return "Enter amount to see estimate"
  }

  return (
    <div className="py-8 space-y-8">
      {/* Amount Input Card */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter the Fiat Amount</p>

          {/* Amount Input */}
          <div className="flex items-center justify-center mb-4">
            <span className="text-5xl font-semibold text-gray-900 dark:text-white">{flowState.currency.symbol}</span>
            <input
              type="text"
              value={flowState.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className="text-5xl font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none text-center tabular-nums ml-2"
              style={{ width: `${Math.max((flowState.amount || "").length || 1, 1)}ch` }}
              inputMode="decimal"
              disabled={isLoading}
            />

            {/* Currency Selector */}
            <button
              onClick={() => setShowCurrencyDialog(true)}
              disabled={isLoading}
              className={`ml-4 flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              <span>{flowState.currency.code}</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </button>
          </div>

          {/* Down Arrow */}
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <ChevronRight className="w-4 h-4 rotate-90 text-gray-600 dark:text-gray-300" />
            </div>
          </div>

          {/* You will receive */}
          <div className="text-left">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">You will receive</p>
            <button
              onClick={() => setShowTokenDialog(true)}
              disabled={isLoading}
              className={`w-full flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-xl transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-600"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  {flowState.token ? (
                    <span className="text-xs font-medium">{flowState.token.symbol.slice(0, 2)}</span>
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
                <div className="text-left">
                  <div
                    className={`font-semibold ${
                      quoteHook.error ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {getQuoteText()}
                  </div>
                  {quoteHook.data?.fees && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Fee: {flowState.currency.symbol}
                      {quoteHook.data.fees.totalFee.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <CustomButton
        variant="primary"
        size="lg"
        fullWidth
        onClick={onNext}
        disabled={!canProceed || isLoading || !quoteHook.data}
        className="text-base"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Loading...
          </div>
        ) : (
          "Next"
        )}
      </CustomButton>

      {/* Info Text */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <div className="w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You will have to deposit the said amount in Transak's bank account
        </p>
      </div>

      {/* Currency Dialog */}
      {showCurrencyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Currency</h3>
              <button onClick={() => setShowCurrencyDialog(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {availableCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    updateFlowState({ currency })
                    setShowCurrencyDialog(false)
                  }}
                >
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                    {currency.code.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div className="text-sm text-gray-500">{currency.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Token Dialog */}
      {showTokenDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Token</h3>
              <button onClick={() => setShowTokenDialog(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {cryptoTokens.map((token) => (
                <button
                  key={token.id}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    updateFlowState({ token })
                    setShowTokenDialog(false)
                  }}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                    {token.symbol.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{token.name}</div>
                    <div className="text-sm text-gray-500">{token.symbol}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { CustomButton } from "@/components/ui/custom-button"
import { X, ChevronDown } from "lucide-react"
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

const currencyFlags: Record<string, string> = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  INR: "🇮🇳",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  JPY: "🇯🇵",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  KRW: "🇰🇷",
}

const tokenIcons: Record<string, string> = {
  ETH: "Ⓔ",
  BTC: "₿",
  USDT: "₮",
  USDC: "Ⓤ",
  DAI: "◈",
  MATIC: "⬟",
  BNB: "◆",
  ADA: "₳",
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
  const [isEmptyState, setIsEmptyState] = useState(true)

  const sampleAmount = "25"

  const sampleCurrency = useMemo(
    () => availableCurrencies.find((c) => c.code === "USD") || availableCurrencies[0],
    [availableCurrencies],
  )

  const defaultToken = useMemo(() => cryptoTokens.find((t) => t.symbol === "ETH") || cryptoTokens[0], [cryptoTokens])

  useEffect(() => {
    if (!flowState.currency || !flowState.token) {
      updateFlowState({
        currency: sampleCurrency,
        token: defaultToken,
        amount: flowState.amount || "",
      })
    }
  }, []) // Empty dependency array - run only once on mount

  useEffect(() => {
    const amountNum = Number.parseFloat(flowState.amount)
    const currencyCode = flowState.currency?.code
    const tokenSymbol = flowState.token?.symbol
    const tokenId = flowState.token?.id

    if (!currencyCode || !tokenSymbol || !tokenId || !amountNum || amountNum <= 0) {
      if (quoteHook?.clearQuote) {
        quoteHook.clearQuote()
      }
      return
    }

    const timeoutId = setTimeout(() => {
      if (quoteHook?.getQuote) {
        quoteHook.getQuote({
          amount: amountNum,
          fromCurrency: currencyCode,
          toCurrency: tokenSymbol,
          tokenId: tokenId,
        })
      }
    }, 500) // Debounce for 500ms

    return () => clearTimeout(timeoutId)
  }, [flowState.amount, flowState.currency?.code, flowState.token?.symbol, flowState.token?.id])

  const handleAmountChange = useCallback(
    (value: string) => {
      const regex = /^\d*\.?\d{0,2}$/
      if (regex.test(value) || value === "") {
        if (isEmptyState && value) {
          setIsEmptyState(false)
        }
        updateFlowState({ amount: value })
      }
    },
    [isEmptyState, updateFlowState],
  )

  const handleInputFocus = useCallback(() => {
    if (isEmptyState) {
      setIsEmptyState(false)
      updateFlowState({ amount: "" })
    }
  }, [isEmptyState, updateFlowState])

  const formatCrypto = (qty: number, symbol: string) => {
    const formatted = qty.toPrecision(6).replace(/\.?0+$/, "")
    return `${formatted}`
  }

  const getDisplayAmount = () => {
    if (isEmptyState || !flowState.amount) {
      return sampleAmount
    }
    return flowState.amount
  }

  const getQuoteAmount = () => {
    if (isEmptyState) return "0.0089" // Sample quote for $25
    if (!flowState.token) return "---"
    if (quoteHook.loading) return "..."
    if (quoteHook.error) return "Error"
    if (quoteHook.data?.estimatedAmount) {
      return formatCrypto(quoteHook.data.estimatedAmount, flowState.token.symbol)
    }
    return "0.0000"
  }

  return (
    <div className="py-8">
      {/* Row 1 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 relative mb-[-0.75rem]">
        {/* -my-3 equivalent */}
        <div className="text-left mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Enter the Fiat Amount</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="text"
              value={flowState.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              onFocus={handleInputFocus}
              placeholder={sampleAmount}
              className={`text-4xl font-bold bg-transparent border-none outline-none tabular-nums ${
                isEmptyState ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"
              }`}
              style={{ width: `${Math.max((getDisplayAmount() || "").length || 2, 2)}ch` }}
              inputMode="decimal"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={() => setShowCurrencyDialog(true)}
            disabled={isLoading}
            className={`flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <span className="text-lg">{currencyFlags[flowState.currency?.code] || "🌍"}</span>
            <span>{flowState.currency?.code || "USD"}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center relative z-10 my-[-0.75rem]">
        <div className="w-8 h-8 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </div>
      </div>

      {/* Row 2 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8">
        <div className="text-left mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">You will receive</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span
              className={`text-4xl font-bold tabular-nums ${
                isEmptyState ? "text-gray-400 dark:text-gray-500" : "text-gray-900 dark:text-white"
              }`}
            >
              {getQuoteAmount()}
            </span>
          </div>

          <button
            onClick={() => setShowTokenDialog(true)}
            disabled={isLoading}
            className={`flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            <span className="text-lg">{tokenIcons[flowState.token?.symbol] || "◯"}</span>
            <span>{flowState.token?.symbol || "ETH"}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CTA */}
      <div className="mb-6">
        <CustomButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={onNext}
          disabled={!canProceed || isLoading || isEmptyState || !flowState.amount}
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
      </div>

      {/* Info */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <div className="w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You will have to deposit the said amount in Transak's bank account
        </p>
      </div>

      {showCurrencyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4">
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
                  onClick={() => {
                    updateFlowState({ currency })
                    setShowCurrencyDialog(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="text-xl">{currencyFlags[currency.code] || "🌍"}</span>
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-sm text-gray-500">{currency.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTokenDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm mx-4">
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
                  onClick={() => {
                    updateFlowState({ token })
                    setShowTokenDialog(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="text-xl">{tokenIcons[token.symbol] || "◯"}</span>
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-sm text-gray-500">{token.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

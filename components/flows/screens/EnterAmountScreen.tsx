"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { CustomButton } from "@/components/ui/custom-button"
import { X, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet"
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

const getCurrencyFlag = (currencyCode: string): string => {
  const flagMap: Record<string, string> = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    INR: "in",
    CAD: "ca",
    AUD: "au",
    JPY: "jp",
    CHF: "ch",
    CNY: "cn",
    KRW: "kr",
  }
  const countryCode = flagMap[currencyCode] || "us"
  return `https://flagcdn.com/24x18/${countryCode}.png`
}

const getTokenIcon = (tokenSymbol: string): string => {
  return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${tokenSymbol.toLowerCase()}.png`
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
  const [validationError, setValidationError] = useState<string | null>(null)

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
  }, [sampleCurrency, defaultToken, flowState.currency, flowState.token, flowState.amount])

  useEffect(() => {
    const estimatedAmount = quoteHook.data?.estimatedAmount
    if (estimatedAmount) {
      updateFlowState({ tokenAmount: estimatedAmount })
    }
  }, [quoteHook.data?.estimatedAmount])

  const calculateTokenAmount = useCallback((amount: string, currency: Currency, token: Token): number => {
    const amountNum = Number.parseFloat(amount)
    if (!amountNum || amountNum <= 0) return 0

    // Realistic exchange rates (approximate market rates)
    const currencyToUSD: Record<string, number> = {
      USD: 1.0,
      EUR: 1.08,
      GBP: 1.27,
      INR: 0.012,
      CAD: 0.74,
      AUD: 0.66,
      JPY: 0.0067,
      CHF: 1.11,
      CNY: 0.14,
      KRW: 0.00076,
    }

    const tokenPricesUSD: Record<string, number> = {
      BTC: 43000,
      ETH: 2300,
      USDT: 1.0,
      USDC: 1.0,
      BNB: 310,
      ADA: 0.38,
      SOL: 98,
      DOT: 5.2,
      MATIC: 0.75,
      AVAX: 24,
    }

    const usdAmount = amountNum * (currencyToUSD[currency.code] || 1.0)
    const tokenPrice = tokenPricesUSD[token.symbol] || 1.0

    return usdAmount / tokenPrice
  }, [])

  const calculatedTokenAmount = useMemo(() => {
    if (!flowState.amount || !flowState.currency || !flowState.token) return 0
    return calculateTokenAmount(flowState.amount, flowState.currency, flowState.token)
  }, [flowState.amount, flowState.currency, flowState.token, calculateTokenAmount])

  useEffect(() => {
    updateFlowState({ tokenAmount: calculatedTokenAmount })
  }, [calculatedTokenAmount])

  const handleAmountChange = useCallback(
    (value: string) => {
      const regex = /^\d*\.?\d{0,2}$/
      if (regex.test(value) || value === "") {
        if (isEmptyState && value) {
          setIsEmptyState(false)
        }

        const amountNum = Number.parseFloat(value)
        if (value && amountNum < 10) {
          setValidationError("Minimum amount is $10")
        } else if (value && amountNum > 10000) {
          setValidationError("Maximum amount is $10,000")
        } else {
          setValidationError(null)
        }

        updateFlowState({ amount: value })
      }
    },
    [isEmptyState],
  )

  const handleInputFocus = useCallback(() => {
    if (isEmptyState) {
      setIsEmptyState(false)
      updateFlowState({ amount: "" })
    }
  }, [isEmptyState])

  const formatCrypto = (qty: number, symbol: string) => {
    if (qty === 0) return "0.0000"
    if (qty >= 1) {
      return qty.toFixed(4).replace(/\.?0+$/, "")
    } else if (qty >= 0.0001) {
      return qty.toFixed(6).replace(/\.?0+$/, "")
    } else {
      // For very small amounts, use scientific notation or more decimal places
      return qty.toPrecision(4)
    }
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

    // Use immediate calculation instead of API
    const amount = calculatedTokenAmount
    if (amount === 0) return "0.0000"

    return formatCrypto(amount, flowState.token.symbol)
  }

  // Keep API call for validation but don't depend on it for display
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
    }, 1000) // Longer debounce since this is just for validation

    return () => clearTimeout(timeoutId)
  }, [flowState.amount, flowState.currency?.code, flowState.token?.symbol, flowState.token?.id])

  return (
    <div className="py-8">
      {/* Row 1 */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 relative mb-[-0.75rem]">
        <div className="text-left mb-4">
          <p
            className={`text-sm font-medium ${
              validationError ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {validationError || "Enter the Fiat Amount"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="text"
              value={flowState.amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              onFocus={handleInputFocus}
              placeholder={sampleAmount}
              className={`text-4xl bg-transparent border-none outline-none tabular-nums font-sans font-semibold tracking-wide ${
                isEmptyState
                  ? "text-gray-400 dark:text-gray-500"
                  : validationError
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-900 dark:text-white"
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
            <img
              src={getCurrencyFlag(flowState.currency?.code || "USD")}
              alt={`${flowState.currency?.code || "USD"} flag`}
              className="w-6 h-4 rounded-sm object-cover"
              onError={(e) => {
                // Fallback to emoji if image fails to load
                e.currentTarget.style.display = "none"
                e.currentTarget.nextElementSibling!.textContent = "🌍"
              }}
            />
            <span className="hidden">🌍</span>
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
        <div className="text-left mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">You will receive</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span
              className={`text-4xl tabular-nums font-semibold tracking-wide ${
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
            <img
              src={getTokenIcon(flowState.token?.symbol || "ETH")}
              alt={`${flowState.token?.symbol || "ETH"} icon`}
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) => {
                // Fallback to text symbol if image fails to load
                e.currentTarget.style.display = "none"
                e.currentTarget.nextElementSibling!.textContent = "◯"
              }}
            />
            <span className="hidden text-lg">◯</span>
            <span>{flowState.token?.symbol || "ETH"}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description (optional) */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (optional)
        </label>
        <textarea
          rows={2}
          maxLength={140}
          value={flowState.description || ""}
          onChange={(e) => updateFlowState({ description: e.target.value })}
          placeholder="Add a note for this deposit (e.g., invoice #1234)"
          className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {(flowState.description?.length || 0)}/140
        </div>
      </div>

      {/* CTA */}
      <div className="mb-6">
        <CustomButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={onNext}
          disabled={!canProceed || isLoading || isEmptyState || !flowState.amount || !!validationError}
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
        <div className="w-5 h-5 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Deposit this amount to Transak's secure bank account and receive your selected tokens directly in your wallet.
        </p>
      </div>

      {showCurrencyDialog && (
        <Sheet open={showCurrencyDialog} onOpenChange={setShowCurrencyDialog}>
          <SheetContent>
            <div className="flex items-center justify-between mb-2">
              <SheetTitle>Select Currency</SheetTitle>
              <SheetClose aria-label="Close" className="text-sm text-gray-500 hover:underline">
                Close
              </SheetClose>
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
                  <img
                    src={getCurrencyFlag(currency.code) || "/placeholder.svg"}
                    alt={`${currency.code} flag`}
                    className="w-8 h-6 rounded-sm object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      e.currentTarget.nextElementSibling!.textContent = "🌍"
                    }}
                  />
                  <span className="hidden text-xl">🌍</span>
                  <span className="font-medium">{currency.code}</span>
                  <span className="text-sm text-gray-500">{currency.name}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {showTokenDialog && (
        <Sheet open={showTokenDialog} onOpenChange={setShowTokenDialog}>
          <SheetContent>
            <div className="flex items-center justify-between mb-2">
              <SheetTitle>Select Token</SheetTitle>
              <SheetClose aria-label="Close" className="text-sm text-gray-500 hover:underline">
                Close
              </SheetClose>
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
                  <img
                    src={getTokenIcon(token.symbol) || "/placeholder.svg"}
                    alt={`${token.symbol} icon`}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      e.currentTarget.nextElementSibling!.textContent = "◯"
                    }}
                  />
                  <span className="hidden text-xl">◯</span>
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-sm text-gray-500">{token.name}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

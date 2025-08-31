"use client"
import { CustomButton } from "@/components/ui/custom-button"
import type React from "react"

import { Hash, MapPin, Globe, Wallet, X, CreditCard, User, ChevronRight, Plus } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

interface Currency {
  code: string
  symbol: string
  name: string
  iconUrl?: string
}

interface Token {
  id: string
  symbol: string
  name: string
  iconUrl?: string
  rate: number
}

interface QuoteState {
  state: "idle" | "loading" | "success" | "error"
  value?: number
  error?: string
}

interface DepositScreenProps {
  depositAmount: string
  setDepositAmount: (amount: string) => void
  depositDescription: string
  setDepositDescription: (description: string) => void
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  selectedToken: Token | null
  setSelectedToken: (token: Token | null) => void
  availableCurrencies: Currency[]
  cryptoTokens: Token[]
  showTokenDialog: boolean
  setShowTokenDialog: (show: boolean) => void
}

function CurrencyPicker({
  value,
  onChange,
  availableCurrencies,
}: {
  value: Currency
  onChange: (currency: Currency) => void
  availableCurrencies: Currency[]
}) {
  const [showDialog, setShowDialog] = useState(false)

  const CurrencyIcon = ({ currency }: { currency: Currency }) => {
    const [hasError, setHasError] = useState(false)

    if (!currency.iconUrl || hasError) {
      return (
        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
          {currency.code.slice(0, 2)}
        </div>
      )
    }

    return (
      <img
        src={currency.iconUrl || "/placeholder.svg"}
        alt={currency.name}
        className="w-6 h-6 rounded-full"
        onError={() => setHasError(true)}
        decoding="async"
        loading="lazy"
      />
    )
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-2 rounded-full transition-colors focus-visible:outline-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        aria-label={`Selected currency: ${value.name}`}
      >
        <CurrencyIcon currency={value} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{value.code}</span>
        <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Currency</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors text-left ${
                    value.code === currency.code
                      ? "border border-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_8%,white)] dark:bg-[var(--brand-soft)]"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    onChange(currency)
                    setShowDialog(false)
                  }}
                >
                  <CurrencyIcon currency={currency} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{currency.code}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{currency.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function AmountInput({
  currency,
  value,
  onChange,
}: {
  currency: Currency
  value: string
  onChange: (value: string) => void
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Allow only digits and decimal separator, max 2 decimals
    const regex = /^\d*\.?\d{0,2}$/
    if (regex.test(input) || input === "") {
      onChange(input)
    }
  }

  return (
    <div className="text-center py-0">
      {/* treat symbol + input as one centered unit */}
      <div className="inline-flex items-baseline justify-center">
        <span className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white leading-none">
          {currency.symbol}
        </span>

        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="0"
          className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white
                     bg-transparent border-none outline-none leading-none
                     text-center tabular-nums"
          /* width grows/shrinks with character count (at least 1ch) */
          style={{ width: `${Math.max((value || "").length || 0, 1)}ch` }}
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]{0,2}"
          aria-label="Deposit amount"
        />
      </div>
    </div>
  )
}

function DescriptionField({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.slice(0, 120) // Max 120 chars
    onChange(input)
  }

  if (!isExpanded && !value) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full max-w-[320px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-2xl text-sm text-gray-500 dark:text-gray-400 transition-colors focus-visible:outline-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        aria-label="Add description (optional)"
      >
        Add Description
      </button>
    )
  }

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={() => !value && setIsExpanded(false)}
      placeholder="What's this deposit for?"
      className="w-full bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none focus:bg-gray-200 dark:focus:bg-gray-700 transition-colors"
      maxLength={120}
      autoFocus={isExpanded}
      aria-label="Deposit description (optional)"
    />
  )
}

function TokenRow({
  token,
  quote,
  onPress,
}: {
  token: Token | null
  quote: QuoteState
  onPress: () => void
}) {
  const formatCrypto = (qty: number, symbol: string) => {
    // Format to 6 significant digits, strip trailing zeros
    const formatted = qty.toPrecision(6).replace(/\.?0+$/, "")
    return `${formatted} ${symbol}`
  }

  const getValueText = () => {
    if (!token) return "Select token"
    if (quote.state === "idle") return "Enter amount to see estimate"
    if (quote.state === "loading") return "Fetching…"
    if (quote.state === "error") return "Can't fetch price. Retry"
    if (quote.state === "success" && quote.value) {
      return formatCrypto(quote.value, token.symbol)
    }
    return "Enter amount to see estimate"
  }

  const TokenIcon = ({ token }: { token: Token | null }) => {
    const [hasError, setHasError] = useState(false)

    if (!token) {
      return (
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <Plus className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
      )
    }

    if (!token.iconUrl || hasError) {
      return (
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300">
          {token.symbol.slice(0, 2)}
        </div>
      )
    }

    return (
      <img
        src={token.iconUrl || "/placeholder.svg"}
        alt={token.name}
        className="w-8 h-8 rounded-full"
        onError={() => setHasError(true)}
        decoding="async"
        loading="lazy"
      />
    )
  }

  return (
    <button
      onClick={onPress}
      className="w-full rounded-2xl bg-white dark:bg-white/5 px-4 py-4 flex items-center justify-between gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
      role="button"
      aria-label={token ? `Selected token: ${token.name}` : "Select token"}
    >
      <div className="flex items-center gap-3">
        <TokenIcon token={token} />
        <div className="text-left">
          <div className="text-sm text-gray-600 dark:text-gray-300">You will get</div>
          <div
            className={`font-semibold ${
              quote.state === "error" ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"
            }`}
          >
            {getValueText()}
          </div>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  )
}

export default function DepositScreen({
  depositAmount,
  setDepositAmount,
  depositDescription,
  setDepositDescription,
  selectedCurrency,
  setSelectedCurrency,
  selectedToken,
  setSelectedToken,
  availableCurrencies,
  cryptoTokens,
  showTokenDialog,
  setShowTokenDialog,
}: DepositScreenProps) {
  const [quote, setQuote] = useState<QuoteState>({ state: "idle" })

  const getQuote = useCallback(
    async (amount: number, currency: Currency, tokenId: string) => {
      setQuote({ state: "loading" })
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const mockRate = selectedToken?.rate || 0.002
        const value = amount * mockRate
        setQuote({ state: "success", value })
      } catch (error) {
        setQuote({ state: "error", error: "Failed to fetch quote" })
      }
    },
    [selectedToken],
  )

  // Debounced quote fetching
  useEffect(() => {
    const amountNum = Number.parseFloat(depositAmount)
    if (!selectedToken || !amountNum || amountNum <= 0) {
      setQuote({ state: "idle" })
      return
    }

    const timeoutId = setTimeout(() => {
      getQuote(amountNum, selectedCurrency, selectedToken.id)
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [depositAmount, selectedCurrency, selectedToken, getQuote])

  return (
    <div className="max-w-[640px] w-full">
      {/* OUTER SURFACE */}
      <div className="rounded-3xl max-w-[640px] p-6 md:p-8 shadow-none md:px-0 md:py-0 bg-transparent">
        {/* MAIN CARD (light grey) */}
        <div className="rounded-3xl bg-gray-100/70 dark:bg-white/5 p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-sm text-gray-600 dark:text-gray-300">You are Depositing</h2>
            <CurrencyPicker
              value={selectedCurrency}
              onChange={setSelectedCurrency}
              availableCurrencies={availableCurrencies}
            />
          </div>

          {/* Amount */}
          <div className="mb-4 md:mb-6">
            <AmountInput currency={selectedCurrency} value={depositAmount} onChange={setDepositAmount} />
          </div>

          {/* Description (compact pill) */}
          <div className="mb-4 md:mb-6 flex justify-center">
            <div className="w-full max-w-[320px]">
              <DescriptionField value={depositDescription} onChange={setDepositDescription} />
            </div>
          </div>

          {/* Token Sliver */}
          <div className="mb-0">
            <TokenRow token={selectedToken} quote={quote} onPress={() => setShowTokenDialog(true)} />
          </div>
        </div>
        {/* /MAIN CARD */}

        {/* BANK DETAILS SECTION (outside the grey card) */}
        <div className="mt-6 md:mt-8 space-y-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Bank Name</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">Simulator Bank</span>
          </div>

          <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Beneficiary Name</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">Doe Jane</span>
          </div>

          <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">IBAN / Account</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">GB41SEOU19870010404544</span>
          </div>

          <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Bank Address</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm text-right">
              123 Financial District, Valletta VLT 1234, Malta
            </span>
          </div>

          <div className="flex justify-between items-center py-3 px-4 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Bank Country</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">Malta</span>
          </div>

          <div className="flex justify-between items-center py-3 px-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <Wallet className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Wallet Address</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">0x742d35...a3b4</span>
          </div>
        </div>
        {/* /BANK DETAILS */}

        {/* CTA */}
        <div className="mt-6 md:mt-8">
          <CustomButton variant="primary" size="lg" fullWidth className="text-base">
            Deposit {selectedCurrency.symbol}
            {depositAmount || "0"}
          </CustomButton>
        </div>
      </div>
      {/* /OUTER SURFACE */}

      {showTokenDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-96 max-w-sm mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Token</h3>
              <button
                onClick={() => setShowTokenDialog(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {cryptoTokens.map((token) => (
                <div
                  key={token.symbol}
                  onClick={() => {
                    setSelectedToken(token)
                    setShowTokenDialog(false)
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedToken?.symbol === token.symbol
                      ? "border border-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_8%,white)] dark:bg-[var(--brand-soft)]"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <img src={token.iconUrl || "/placeholder.svg"} alt={token.name} className="w-10 h-10" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{token.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</div>
                  </div>
                  {selectedToken?.symbol === token.symbol && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: 'var(--brand)' }}>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

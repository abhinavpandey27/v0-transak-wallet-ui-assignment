"use client"

import { CustomButton } from "@/components/ui/custom-button"
import TokenSelector from "@/components/shared/TokenSelector"
import BankAccountCard from "@/components/shared/BankAccountCard"
import { ChevronRight, X } from "lucide-react"
import { useState } from "react"

interface Currency {
  code: string
  symbol: string
  name: string
  iconUrl?: string
}

interface Token {
  symbol: string
  name: string
  color: string
}

interface BankAccount {
  id: number
  bankName: string
  iban: string
  beneficiary: string
  address: string
}

interface WithdrawScreenProps {
  selectedSendingToken: Token
  setSelectedSendingToken: (token: Token) => void
  selectedWithdrawCurrency: Currency
  setSelectedWithdrawCurrency: (currency: Currency) => void
  selectedBankAccount: number
  setSelectedBankAccount: (index: number) => void
  showQRCode: boolean
  setShowQRCode: (show: boolean) => void
  availableCurrencies: Currency[]
  cryptoTokens: Token[]
  bankAccounts: BankAccount[]
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
                      ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
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

export default function WithdrawScreen({
  selectedSendingToken,
  setSelectedSendingToken,
  selectedWithdrawCurrency,
  setSelectedWithdrawCurrency,
  selectedBankAccount,
  setSelectedBankAccount,
  showQRCode,
  setShowQRCode,
  availableCurrencies,
  cryptoTokens,
  bankAccounts,
}: WithdrawScreenProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <div className="max-w-[640px] w-full">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mb-8">
        {/* You are Sending Section */}
        <div className="flex justify-between mb-4 items-center">
          <span className="text-gray-600 dark:text-gray-300 text-base">You are Sending</span>
          <TokenSelector
            selectedToken={selectedSendingToken}
            onTokenChange={(token) => {
              setSelectedSendingToken(token)
              setShowQRCode(false) // Reset QR visibility when token changes
            }}
            availableTokens={cryptoTokens}
          />
        </div>

        <div className="flex justify-between mb-8 items-center">
          <span className="text-gray-600 dark:text-gray-300 text-base">You are Withdrawing in</span>
          <CurrencyPicker
            value={selectedWithdrawCurrency}
            onChange={(currency) => {
              setSelectedWithdrawCurrency(currency)
              setShowQRCode(false) // Reset QR visibility when currency changes
            }}
            availableCurrencies={availableCurrencies}
          />
        </div>

        <div className="text-center relative">
          {!showQRCode ? (
            <div className="relative">
              {/* Background QR hint */}
              <div className="inline-block p-6 bg-white dark:bg-gray-700 rounded-xl mb-6 opacity-30">
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-3xl text-gray-400 dark:text-gray-500">QR</div>
                </div>
              </div>
              {/* Overlay button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CustomButton variant="primary" size="lg" onClick={() => setShowQRCode(true)}>
                  Show QR Code
                </CustomButton>
              </div>
            </div>
          ) : (
            <div>
              <div className="inline-block p-4 bg-white dark:bg-gray-700 rounded-xl mb-4 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(`${selectedSendingToken.symbol}:0x973fF8EcFB22c4Fe69Db152f327587DDfAfB?amount=1&currency=${selectedWithdrawCurrency.code}`)}`}
                  alt="Dynamic QR Code"
                  className="w-56 h-56"
                />
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700 dark:text-gray-300">
                <span className="text-sm font-sans">0x973fF8EcFB22c4Fe69Db152f327587DDfAfB</span>
                <button
                  onClick={() => copyToClipboard("0x973fF8EcFB22c4Fe69Db152f327587DDfAfB")}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bank Accounts Selection */}
      <div className="space-y-3">
        {bankAccounts.map((account, index) => (
          <BankAccountCard
            key={account.id}
            account={account}
            isSelected={selectedBankAccount === index}
            onSelect={() => setSelectedBankAccount(index)}
          />
        ))}
      </div>
    </div>
  )
}

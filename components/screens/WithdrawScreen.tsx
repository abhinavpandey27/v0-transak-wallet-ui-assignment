"use client"

import { CustomButton } from "@/components/ui/custom-button"
import CurrencySelector from "@/components/shared/CurrencySelector"
import TokenSelector from "@/components/shared/TokenSelector"
import BankAccountCard from "@/components/shared/BankAccountCard"

interface Currency {
  code: string
  symbol: string
  name: string
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
      <div className="bg-gray-100 rounded-xl p-6 mb-8">
        {/* You are Sending Section */}
        <div className="flex justify-between mb-4 items-center">
          <span className="text-gray-600 text-base">You are Sending</span>
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
          <span className="text-gray-600 text-base">You are Withdrawing in</span>
          <CurrencySelector
            selectedCurrency={selectedWithdrawCurrency}
            onCurrencyChange={(currency) => {
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
              <div className="inline-block p-8 bg-white rounded-xl mb-6 opacity-30">
                <div className="w-80 h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-6xl text-gray-400">QR</div>
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
              <div className="inline-block p-8 bg-white rounded-xl mb-6 shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(`${selectedSendingToken.symbol}:0x973fF8EcFB22c4Fe69Db152f327587DDfAfB?amount=1&currency=${selectedWithdrawCurrency.code}`)}`}
                  alt="Dynamic QR Code"
                  className="w-80 h-80"
                />
              </div>
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <span className="text-base font-sans">0x973fF8EcFB22c4Fe69Db152f327587DDfAfB</span>
                <button
                  onClick={() => copyToClipboard("0x973fF8EcFB22c4Fe69Db152f327587DDfAfB")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

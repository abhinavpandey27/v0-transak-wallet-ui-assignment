"use client"
import { Button } from "@/components/ui/button"

interface BankDetails {
  bankName: string
  beneficiaryName: string
  iban: string
  bankAddress: string
  bankCountry: string
  walletAddress: string
}

interface WithdrawalBankDetailsScreenProps {
  selectedToken: {
    symbol: string
    name: string
    icon: string
  }
  selectedCurrency: {
    code: string
    name: string
    flag: string
  }
  bankDetails: BankDetails
  onNext: () => void
  onChangeBankAccount: () => void
  onBack: () => void
}

export default function WithdrawalBankDetailsScreen({
  selectedToken,
  selectedCurrency,
  bankDetails,
  onNext,
  onChangeBankAccount,
  onBack,
}: WithdrawalBankDetailsScreenProps) {
  return (
    <div className="min-h-[100dvh] bg-white dark:bg-gray-900 flex flex-col">
      {/* Header */}
      

      {/* Content */}
      <div className="flex-1 flex items-start justify-center p-4 bg-transparent px-0 py-0">
        <div className="w-full max-w-md space-y-6">
          {/* Token and Currency Selection */}
          <div className="space-y-4">
            <div className="dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between bg-gray-50">
              <span className="text-gray-600 dark:text-gray-300">You are Sending</span>
              <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1">
                <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {selectedToken.symbol.charAt(0)}
                </div>
                <span className="text-sm font-medium">{selectedToken.symbol}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between bg-gray-50">
              <span className="text-gray-600 dark:text-gray-300">You are Withdrawing</span>
              <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1">
                <span className="text-lg">{selectedCurrency.flag}</span>
                <span className="text-sm font-medium">{selectedCurrency.code}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Fiat will be deposited in this bank account</p>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Bank Name</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{bankDetails.bankName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Beneficiary Name</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{bankDetails.beneficiaryName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">IBAN / Account</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{bankDetails.iban}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Bank address</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{bankDetails.bankAddress}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Bank country</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{bankDetails.bankCountry}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Wallet Address</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{bankDetails.walletAddress}</span>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <Button onClick={onNext} className="w-full bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-[var(--brand-foreground)] focus-visible:ring-[var(--brand-ring)]">
            Next
          </Button>

          {/* Change Bank Account Link */}
          <div className="text-center">
            <button onClick={onChangeBankAccount} className="text-sm text-[var(--brand)] hover:opacity-90 underline">
              Want to withdraw in another account? Change Bank Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

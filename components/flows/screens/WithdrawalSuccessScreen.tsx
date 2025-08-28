"use client"
import { CustomButton } from "@/components/ui/custom-button"

interface BankDetails {
  bankName: string
  beneficiaryName: string
  iban: string
  bankAddress: string
  bankCountry: string
  walletAddress: string
}

interface WithdrawalSuccessScreenProps {
  amount: string
  currency: {
    code: string
    name: string
    flag: string
  }
  bankDetails: BankDetails
  onDone: () => void
}

export default function WithdrawalSuccessScreen({
  amount,
  currency,
  bankDetails,
  onDone,
}: WithdrawalSuccessScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}

      {/* Content */}
      <div className="flex-1 flex items-start justify-center p-4 bg-white">
        <div className="w-full max-w-md space-y-6">
          {/* Success Message */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center space-y-4">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Success Text */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Fiat Withdrawn</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Withdrawn{" "}
                <span className="font-semibold">
                  {amount} {currency.code}
                </span>{" "}
                on the following bank account
              </p>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3">
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

          {/* Done Button */}
          <CustomButton onClick={onDone} variant="primary" size="lg" className="w-full">
            Done
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

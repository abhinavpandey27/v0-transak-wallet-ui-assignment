"use client"

import { CustomButton } from "@/components/ui/custom-button"
import { CreditCard, User, Hash, MapPin, Globe, Wallet } from "lucide-react"

interface BankDetailsScreenProps {
  flowState: any
  onNext: () => void
  canProceed: boolean
  isLoading: boolean
}

export default function BankDetailsScreen({ flowState, onNext, canProceed, isLoading }: BankDetailsScreenProps) {
  return (
    <div className="py-8 space-y-8">
      {/* Header Text */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Deposit{" "}
          <span className="font-semibold">
            {flowState.amount} {flowState.currency.code}
          </span>{" "}
          to the below bank details. We'll convert your deposit to{" "}
          <span className="font-semibold">{flowState.token?.name}</span> instantly after we receive it.
        </p>
      </div>

      {/* Bank Details Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex justify-between items-center py-4 px-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Bank Name</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">{flowState.bankDetails?.bankName}</span>
          </div>

          <div className="flex justify-between items-center py-4 px-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Beneficiary Name</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {flowState.bankDetails?.beneficiaryName}
            </span>
          </div>

          <div className="flex justify-between items-center py-4 px-4">
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">IBAN / Account</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">{flowState.bankDetails?.iban}</span>
          </div>

          <div className="flex justify-between items-center py-4 px-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Bank address</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm text-right">
              {flowState.bankDetails?.bankAddress}
            </span>
          </div>

          <div className="flex justify-between items-center py-4 px-4">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Bank country</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {flowState.bankDetails?.bankCountry}
            </span>
          </div>

          <div className="flex justify-between items-center py-4 px-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <Wallet className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Wallet Address</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              {flowState.bankDetails?.walletAddress}
            </span>
          </div>
        </div>
      </div>

      {/* I have paid Button */}
      <CustomButton
        variant="primary"
        size="lg"
        fullWidth
        onClick={onNext}
        disabled={!canProceed || isLoading}
        className="text-base"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          "I have paid"
        )}
      </CustomButton>

      {/* Test Environment Notice */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 flex items-start gap-3">
        <div className="w-5 h-5 bg-gray-400 dark:bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This is a test environment where we are simulating the test environment
        </p>
      </div>
    </div>
  )
}

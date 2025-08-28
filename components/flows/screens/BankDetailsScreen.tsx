"use client"

import { CustomButton } from "@/components/ui/custom-button"
import BankDetailsCard from "@/components/shared/BankDetailsCard"

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
        <p className="dark:text-gray-400 leading-relaxed text-gray-900">
          Deposit{" "}
          <span className="font-semibold">
            {flowState.amount} {flowState.currency.code}
          </span>{" "}
          to the below bank details. We'll convert your deposit to{" "}
          <span className="font-semibold">{flowState.token?.name}</span> instantly after we receive it.
        </p>
      </div>

      {/* Bank Details Card */}
      <BankDetailsCard bankDetails={flowState.bankDetails} showCopyButtons={true} />

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

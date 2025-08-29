"use client"

import { CustomButton } from "@/components/ui/custom-button"
import { CheckCircle } from "lucide-react"
import BankDetailsCard from "@/components/shared/BankDetailsCard"

interface PaymentVerifiedScreenProps {
  flowState: any
  onComplete: () => void
  verificationData: any
}

export default function PaymentVerifiedScreen({ flowState, onComplete, verificationData }: PaymentVerifiedScreenProps) {
  const receivedAmount = verificationData?.tokenAmount
    ? verificationData.tokenAmount.toFixed(6)
    : flowState.token
      ? (Number.parseFloat(flowState.amount) * (flowState.token.rate || 0.002)).toFixed(6)
      : "0"

  return (
    <div className="py-8 space-y-8">
      {/* Success State */}
      <div className="text-center border-gray-100 border dark:border-gray-700 rounded-xl py-6 bg-gray-50 dark: bg-gray-800">
        {/* Green Check */}
        <div className="w-16 h-16 mx-auto mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Payment Verified</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We have added{" "}
          <span className="font-semibold text-green-600 dark:text-green-400">
            +{receivedAmount} {flowState.token?.symbol}
          </span>{" "}
          to your wallet
        </p>

        {verificationData?.completedAt && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Completed at: {new Date(verificationData.completedAt).toLocaleString()}
          </p>
        )}
      </div>

      {/* Bank Details Card (Read-only) with copy functionality */}
      <BankDetailsCard bankDetails={flowState.bankDetails} showCopyButtons={true} />

      {/* Done Button */}
      <CustomButton variant="primary" size="lg" fullWidth onClick={onComplete} className="text-base">
        Done
      </CustomButton>
    </div>
  )
}

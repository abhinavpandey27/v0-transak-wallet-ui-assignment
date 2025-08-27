"use client"

import { CustomButton } from "@/components/ui/custom-button"
import { CheckCircle, CreditCard, User, Hash, MapPin, Globe, Wallet, Copy } from "lucide-react"
import { useState } from "react"

interface PaymentVerifiedScreenProps {
  flowState: any
  onComplete: () => void
  verificationData: any
}

export default function PaymentVerifiedScreen({ flowState, onComplete, verificationData }: PaymentVerifiedScreenProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const receivedAmount = verificationData?.tokenAmount
    ? verificationData.tokenAmount.toFixed(6)
    : flowState.token
      ? (Number.parseFloat(flowState.amount) * (flowState.token.rate || 0.002)).toFixed(6)
      : "0"

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* Success State */}
      <div className="text-center">
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
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="flex justify-between items-center py-4 px-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Bank Name</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {flowState.bankDetails?.bankName}
              </span>
              <button
                onClick={() => copyToClipboard(flowState.bankDetails?.bankName || "", "bankName")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Copy className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 px-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Beneficiary Name</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {flowState.bankDetails?.beneficiaryName}
              </span>
              <button
                onClick={() => copyToClipboard(flowState.bankDetails?.beneficiaryName || "", "beneficiary")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              >
                <Copy className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 px-4">
            <div className="flex items-center gap-3">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">IBAN / Account</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white text-sm">{flowState.bankDetails?.iban}</span>
              <button
                onClick={() => copyToClipboard(flowState.bankDetails?.iban || "", "iban")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Copy className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-4 px-4 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300 text-sm">Bank address</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white text-sm text-right">
                {flowState.bankDetails?.bankAddress}
              </span>
              <button
                onClick={() => copyToClipboard(flowState.bankDetails?.bankAddress || "", "address")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              >
                <Copy className="w-3 h-3 text-gray-400" />
              </button>
            </div>
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
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {flowState.bankDetails?.walletAddress}
              </span>
              <button
                onClick={() => copyToClipboard(flowState.bankDetails?.walletAddress || "", "wallet")}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
              >
                <Copy className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {copiedField && (
        <div className="text-center">
          <p className="text-sm text-green-600 dark:text-green-400">✓ Copied to clipboard</p>
        </div>
      )}

      {/* Done Button */}
      <CustomButton variant="primary" size="lg" fullWidth onClick={onComplete} className="text-base">
        Done
      </CustomButton>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { CustomButton } from "@/components/ui/custom-button"
import { AlertCircle, RefreshCw } from "lucide-react"
import BankDetailsCard from "@/components/shared/BankDetailsCard"

interface VerificationScreenProps {
  flowState: any
  onNext: () => void
  verificationHook: any
}

export default function VerificationScreen({ flowState, onNext, verificationHook }: VerificationScreenProps) {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [showTimeout, setShowTimeout] = useState(false)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      setTimeElapsed(elapsed)

      // Show timeout warning after 30 seconds
      if (elapsed > 30) {
        setShowTimeout(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const isVerificationFailed = verificationHook.data?.status === "failed"
  const isVerificationSuccess = verificationHook.data?.status === "success"

  return (
    <div className="py-8 space-y-8">
      {/* Loading/Status State */}
      <div className="text-center border-gray-100 border dark:border-gray-700 rounded-xl py-6 bg-gray-50 dark:bg-gray-800">
        {!isVerificationFailed && !isVerificationSuccess && (
          <>
            {/* Spinner */}
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-400 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Verifying your Payment to the Bank
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">This may take a few moments</p>

            <p className="text-sm text-gray-500 dark:text-gray-400">Time elapsed: {formatTime(timeElapsed)}</p>
          </>
        )}

        {showTimeout && !isVerificationFailed && !isVerificationSuccess && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm">Verification is taking longer than expected. This is normal for bank transfers.</p>
            </div>
          </div>
        )}

        {isVerificationFailed && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Verification Failed</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {verificationHook.data?.failureReason || "We couldn't verify your payment. Please try again."}
            </p>

            <CustomButton
              variant="outline"
              size="sm"
              onClick={() =>
                verificationHook.initiateVerification({
                  transactionId: flowState.transactionId,
                  amount: Number.parseFloat(flowState.amount),
                  currency: flowState.currency.code,
                  reference: flowState.transactionId,
                })
              }
              className="mb-4"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Verification
            </CustomButton>
          </>
        )}
      </div>

      {/* Bank Details Card (Read-only) */}
      <BankDetailsCard
        bankDetails={flowState.bankDetails}
        showCopyButtons={false}
        className={isVerificationFailed ? "opacity-50" : "opacity-75"}
      />

      {/* Verifying Button (Disabled/Loading) */}
      <CustomButton variant="primary" size="lg" fullWidth disabled={true} className="text-base opacity-75">
        {isVerificationFailed ? (
          "Verification Failed"
        ) : isVerificationSuccess ? (
          "Verification Complete"
        ) : (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying your Transaction
          </div>
        )}
      </CustomButton>

      {verificationHook.isPolling && (
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">Checking payment status every 2 seconds...</p>
        </div>
      )}
    </div>
  )
}

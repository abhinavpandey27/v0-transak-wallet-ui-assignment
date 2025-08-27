"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { ArrowLeft } from "lucide-react"
import type { Currency, Token } from "@/types"
import { availableCurrencies, cryptoTokens } from "@/data/mockData"
import { useDepositFlow } from "@/hooks/useDepositApi"
import ErrorBoundary from "./ErrorBoundary"

// Flow step types
type DepositStep = "amount" | "bank-details" | "verification" | "success"

// Enhanced error types
type FlowError = {
  type: "validation" | "api" | "network" | "timeout"
  message: string
  field?: string
}

// Enhanced flow state interface
interface DepositFlowState {
  step: DepositStep
  amount: string
  currency: Currency
  token: Token | null
  description: string
  bankDetails: BankDetails | null
  transactionId: string | null
  verificationStatus: "pending" | "success" | "failed"
  isLoading: boolean
  error: FlowError | null
  canGoBack: boolean
  canProceed: boolean
  progress: number
}

interface BankDetails {
  bankName: string
  beneficiaryName: string
  iban: string
  bankAddress: string
  bankCountry: string
  walletAddress: string
}

// Individual screen components
import EnterAmountScreen from "./screens/EnterAmountScreen"
import BankDetailsScreen from "./screens/BankDetailsScreen"
import VerificationScreen from "./screens/VerificationScreen"
import PaymentVerifiedScreen from "./screens/PaymentVerifiedScreen"

export default function DepositFlow({ onComplete }: { onComplete: () => void }) {
  const [flowState, setFlowState] = useState<DepositFlowState>({
    step: "amount",
    amount: "25",
    currency: availableCurrencies[0], // EUR
    token: cryptoTokens[0], // ETH
    description: "",
    bankDetails: null,
    transactionId: null,
    verificationStatus: "pending",
    isLoading: false,
    error: null,
    canGoBack: true,
    canProceed: false,
    progress: 25,
  })

  const mockBankDetails: BankDetails = {
    bankName: "Simulator Bank",
    beneficiaryName: "Doe Jane",
    iban: "GB41SEOU19870010404544",
    bankAddress: "The Bower, 207-211 Old Street, London, England",
    bankCountry: "Malta",
    walletAddress: "0x973fF8EcFB22c4Fe69Db152f327587DDfAfB",
  }

  const validateCurrentStep = useMemo((): FlowError | null => {
    switch (flowState.step) {
      case "amount":
        if (!flowState.amount || Number.parseFloat(flowState.amount) <= 0) {
          return { type: "validation", message: "Please enter a valid amount", field: "amount" }
        }
        if (!flowState.token) {
          return { type: "validation", message: "Please select a token to receive", field: "token" }
        }
        if (Number.parseFloat(flowState.amount) < 10) {
          return { type: "validation", message: "Minimum deposit amount is 10", field: "amount" }
        }
        if (Number.parseFloat(flowState.amount) > 10000) {
          return { type: "validation", message: "Maximum deposit amount is 10,000", field: "amount" }
        }
        return null
      case "bank-details":
        if (!flowState.bankDetails) {
          return { type: "api", message: "Bank details not available" }
        }
        return null
      case "verification":
        return null
      case "success":
        return null
      default:
        return { type: "validation", message: "Invalid step" }
    }
  }, [flowState.step, flowState.amount, flowState.token, flowState.bankDetails])

  const updateFlowState = useCallback((updates: Partial<DepositFlowState>) => {
    setFlowState((prev) => {
      const newState = { ...prev, ...updates }

      // Calculate progress based on step
      let progress = 25
      switch (newState.step) {
        case "amount":
          progress = 25
          break
        case "bank-details":
          progress = 50
          break
        case "verification":
          progress = 75
          break
        case "success":
          progress = 100
          break
      }

      return {
        ...newState,
        progress,
        canGoBack: newState.step !== "verification" && !newState.isLoading,
      }
    })
  }, [])

  const { quote, bankDetails, verification, resetAll } = useDepositFlow()

  const goToNextStep = useCallback(async () => {
    if (validateCurrentStep) {
      updateFlowState({ error: validateCurrentStep })
      return
    }

    updateFlowState({ isLoading: true, error: null })

    try {
      switch (flowState.step) {
        case "amount":
          updateFlowState({
            step: "bank-details",
            bankDetails: mockBankDetails,
            isLoading: false,
          })
          break

        case "bank-details":
          updateFlowState({
            step: "verification",
            transactionId: "mock-transaction-id",
            isLoading: false,
          })
          break

        case "verification":
          // This step transitions automatically via polling
          break

        case "success":
          resetAll()
          onComplete()
          break
      }
    } catch (error) {
      updateFlowState({
        isLoading: false,
        error: {
          type: "api",
          message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        },
      })
    }
  }, [flowState.step, validateCurrentStep, updateFlowState, onComplete, resetAll, mockBankDetails])

  const goToPreviousStep = useCallback(() => {
    if (!flowState.canGoBack) return

    updateFlowState({ error: null })

    switch (flowState.step) {
      case "bank-details":
        updateFlowState({ step: "amount" })
        break
      case "verification":
        updateFlowState({ step: "bank-details" })
        break
      case "success":
        updateFlowState({ step: "verification" })
        break
      default:
        onComplete() // Go back to wallet
    }
  }, [flowState.step, flowState.canGoBack, updateFlowState, onComplete])

  useEffect(() => {
    const canProceed = !validateCurrentStep && !flowState.isLoading
    setFlowState((prev) => ({
      ...prev,
      error: validateCurrentStep,
      canProceed,
    }))
  }, [validateCurrentStep, flowState.isLoading])

  useEffect(() => {
    if (flowState.step === "verification") {
      // Simulate verification success after 3 seconds
      const timer = setTimeout(() => {
        updateFlowState({
          step: "success",
          verificationStatus: "success",
        })
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [flowState.step, updateFlowState])

  const getScreenTitle = () => {
    switch (flowState.step) {
      case "amount":
        return "Deposit"
      case "bank-details":
        return "Deposit"
      case "verification":
        return "Deposit"
      case "success":
        return "Deposit"
      default:
        return "Deposit"
    }
  }

  const handleError = useCallback(
    (error: Error, errorInfo?: React.ErrorInfo) => {
      console.error("Deposit Flow Error:", error, errorInfo)

      // Log to monitoring service in production
      if (process.env.NODE_ENV === "production") {
        // Analytics/monitoring service call would go here
      }

      // Update flow state with error
      updateFlowState({
        error: {
          type: "api",
          message: error.message || "An unexpected error occurred",
        },
        isLoading: false,
      })
    },
    [updateFlowState],
  )

  const retryCurrentOperation = useCallback(async () => {
    updateFlowState({ error: null, isLoading: true })

    try {
      // Retry based on current step
      switch (flowState.step) {
        case "amount":
          // Retry quote fetching
          if (flowState.token && flowState.amount) {
            quote.getQuote({
              amount: Number.parseFloat(flowState.amount),
              fromCurrency: flowState.currency.code,
              toCurrency: flowState.token.symbol,
              tokenId: flowState.token.id,
            })
          }
          break
        case "bank-details":
          // Retry bank details fetching
          if (quote.data?.quoteId) {
            await bankDetails.fetchBankDetails({
              amount: Number.parseFloat(flowState.amount),
              currency: flowState.currency.code,
              tokenId: flowState.token!.id,
              quoteId: quote.data.quoteId,
            })
          }
          break
        case "verification":
          // Retry verification
          if (bankDetails.data) {
            await verification.initiateVerification({
              transactionId: bankDetails.data.reference,
              amount: Number.parseFloat(flowState.amount),
              currency: flowState.currency.code,
              reference: bankDetails.data.reference,
            })
          }
          break
      }

      updateFlowState({ isLoading: false })
    } catch (error) {
      handleError(error instanceof Error ? error : new Error("Retry failed"))
    }
  }, [flowState, quote, bankDetails, verification, updateFlowState, handleError])

  return (
    <ErrorBoundary onError={handleError}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={goToPreviousStep}
              disabled={!flowState.canGoBack}
              className={`p-2 rounded-full transition-colors ${
                flowState.canGoBack ? "hover:bg-gray-100 dark:hover:bg-gray-700" : "opacity-50 cursor-not-allowed"
              }`}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{getScreenTitle()}</h1>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1">
            <div
              className="bg-blue-500 h-1 transition-all duration-500 ease-out"
              style={{ width: `${flowState.progress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex justify-center p-4">
          <div className="w-full max-w-md">
            {flowState.error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-red-600 dark:text-red-400 mb-2">{flowState.error.message}</p>
                    {flowState.error.type === "api" && (
                      <button
                        onClick={retryCurrentOperation}
                        disabled={flowState.isLoading}
                        className="text-sm text-red-700 dark:text-red-300 underline hover:no-underline disabled:opacity-50"
                      >
                        {flowState.isLoading ? "Retrying..." : "Try Again"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {process.env.NODE_ENV === "development" && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <details>
                  <summary className="text-sm font-medium text-yellow-800 dark:text-yellow-200 cursor-pointer">
                    🧪 Testing Controls
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => (window as any).depositTestHelpers?.simulateNetworkIssues()}
                        className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded text-yellow-800 dark:text-yellow-200"
                      >
                        Network Issues
                      </button>
                      <button
                        onClick={() => (window as any).depositTestHelpers?.testValidationErrors()}
                        className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded text-yellow-800 dark:text-yellow-200"
                      >
                        Validation Errors
                      </button>
                      <button
                        onClick={() => (window as any).depositTestHelpers?.testServiceErrors()}
                        className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded text-yellow-800 dark:text-yellow-200"
                      >
                        Service Errors
                      </button>
                      <button
                        onClick={() => (window as any).depositTestHelpers?.resetTests()}
                        className="p-2 bg-yellow-100 dark:bg-yellow-800 rounded text-yellow-800 dark:text-yellow-200"
                      >
                        Reset Tests
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            )}

            {flowState.step === "amount" && (
              <EnterAmountScreen
                flowState={flowState}
                updateFlowState={updateFlowState}
                onNext={goToNextStep}
                canProceed={flowState.canProceed}
                isLoading={flowState.isLoading}
                availableCurrencies={availableCurrencies}
                cryptoTokens={cryptoTokens}
                quoteHook={quote}
              />
            )}
            {flowState.step === "bank-details" && (
              <BankDetailsScreen
                flowState={flowState}
                onNext={goToNextStep}
                canProceed={flowState.canProceed}
                isLoading={flowState.isLoading}
              />
            )}
            {flowState.step === "verification" && (
              <VerificationScreen flowState={flowState} onNext={goToNextStep} verificationHook={verification} />
            )}
            {flowState.step === "success" && (
              <PaymentVerifiedScreen
                flowState={flowState}
                onComplete={onComplete}
                verificationData={verification.data}
              />
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import TokenSelectionScreen from "./screens/TokenSelectionScreen"
import WithdrawalQRScreen from "./screens/WithdrawalQRScreen"
import WithdrawalSuccessScreen from "./screens/WithdrawalSuccessScreen"
import { useWithdrawalFlow } from "@/hooks/useWithdrawalApi"

// Types
export interface Token {
  id: string
  symbol: string
  name: string
  icon: string
  balance?: number
}

export interface Currency {
  code: string
  name: string
  flag: string
}

export interface BankAccount {
  id: string
  bankName: string
  beneficiaryName: string
  iban: string
  bankAddress: string
  bankCountry: string
  walletAddress: string
}

export interface WithdrawalState {
  step: "token-selection" | "qr-send" | "success"
  selectedToken: Token | null
  selectedCurrency: Currency | null
  bankAccount: BankAccount | null
  walletAddress: string
  transactionId: string
  amount: string
  isLoading: boolean
  error: string | null
}

export interface WithdrawalFlowProps {
  onBack: () => void
  onComplete: () => void
}

const INITIAL_STATE: WithdrawalState = {
  step: "token-selection",
  selectedToken: null,
  selectedCurrency: null,
  bankAccount: null,
  walletAddress: "",
  transactionId: "",
  amount: "",
  isLoading: false,
  error: null,
}

export default function WithdrawalFlow({ onBack, onComplete }: WithdrawalFlowProps) {
  const [state, setState] = useState<WithdrawalState>(INITIAL_STATE)
  const { quote, walletAddress, status, bankAccounts, tokens, currencies, resetAll } = useWithdrawalFlow()

  const updateState = useCallback((updates: Partial<WithdrawalState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }, [])

  useEffect(() => {
    tokens.fetchTokens()
    currencies.fetchCurrencies()
    bankAccounts.fetchBankAccounts()
  }, [])

  useEffect(() => {
    if (
      state.selectedToken &&
      state.selectedCurrency &&
      !state.bankAccount &&
      bankAccounts.data &&
      bankAccounts.data.length > 0
    ) {
      console.log("[v0] Auto-populating bank account:", bankAccounts.data[0])
      updateState({
        bankAccount: bankAccounts.data[0],
        isLoading: false,
      })
    }
  }, [state.selectedToken, state.selectedCurrency, state.bankAccount, bankAccounts.data, updateState])

  useEffect(() => {
    if (state.selectedToken && state.selectedCurrency && !state.bankAccount && bankAccounts.loading) {
      updateState({ isLoading: true })
    }
  }, [state.selectedToken, state.selectedCurrency, state.bankAccount, bankAccounts.loading, updateState])

  useEffect(() => {
    if (state.step === "qr-send" && state.selectedToken && state.selectedCurrency && !state.walletAddress) {
      const generateWallet = async () => {
        try {
          updateState({ isLoading: true, error: null })
          const response = await walletAddress.generateAddress({
            tokenId: state.selectedToken!.id,
            currency: state.selectedCurrency!.code,
            amount: Number.parseFloat(state.amount) || 0.1,
            quoteId: "mock_quote_id",
          })
          updateState({
            walletAddress: response.walletAddress,
            transactionId: response.transactionId,
            isLoading: false,
          })
        } catch (error) {
          updateState({
            isLoading: false,
            error: error instanceof Error ? error.message : "Failed to generate wallet address",
          })
        }
      }
      generateWallet()
    }
  }, [state.step, state.selectedToken, state.selectedCurrency, state.walletAddress, state.amount])

  useEffect(() => {
    if (state.step === "qr-send" && state.transactionId && state.walletAddress) {
      status.startPolling({
        transactionId: state.transactionId,
        walletAddress: state.walletAddress,
      })

      return () => {
        status.stopPolling()
      }
    }
  }, [state.step, state.transactionId, state.walletAddress])

  useEffect(() => {
    if (status.data?.status === "completed") {
      updateState({
        step: "success",
        amount: status.data.fiatAmount?.toString() || "456",
      })
    }
  }, [status.data?.status])

  const goToNextStep = useCallback(() => {
    switch (state.step) {
      case "token-selection":
        if (state.selectedToken && state.selectedCurrency && state.bankAccount) {
          updateState({ step: "qr-send" })
        }
        break
      case "qr-send":
        updateState({ step: "success" })
        break
      case "success":
        onComplete()
        break
    }
  }, [state.step, state.selectedToken, state.selectedCurrency, state.bankAccount, updateState, onComplete])

  const goToPreviousStep = useCallback(() => {
    switch (state.step) {
      case "qr-send":
        status.stopPolling()
        updateState({
          step: "token-selection",
          walletAddress: "",
          transactionId: "",
        })
        break
      case "success":
        updateState({ step: "qr-send" })
        break
      default:
        resetAll()
        onBack()
        break
    }
  }, [state.step, updateState, onBack, resetAll, status])

  const handleTokenSelect = useCallback(
    (token: Token) => {
      updateState({ selectedToken: token })
    },
    [updateState],
  )

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      console.log("[v0] Currency selected:", currency)
      updateState({ selectedCurrency: currency })
      if (!bankAccounts.data || bankAccounts.data.length === 0) {
        bankAccounts.fetchBankAccounts()
      }
    },
    [updateState, bankAccounts],
  )

  const handleChangeBankAccount = useCallback(() => {
    console.log("[v0] Change bank account requested")
    // TODO: Implement bank account selection dialog
  }, [])

  const handleWithdrawalTimeout = useCallback(() => {
    updateState({
      step: "success",
      amount: "456", // Mock amount for timeout scenario
    })
  }, [updateState])

  const screenTitle = useMemo(() => {
    switch (state.step) {
      case "token-selection":
        return "Withdraw"
      case "qr-send":
        return "Withdraw"
      case "success":
        return "Withdraw"
      default:
        return "Withdraw"
    }
  }, [state.step])

  const renderCurrentScreen = () => {
    switch (state.step) {
      case "token-selection":
        return (
          <TokenSelectionScreen
            selectedToken={state.selectedToken}
            selectedCurrency={state.selectedCurrency}
            onTokenSelect={handleTokenSelect}
            onCurrencySelect={handleCurrencySelect}
            onNext={goToNextStep}
            onChangeBankAccount={handleChangeBankAccount}
            availableTokens={tokens.data || []}
            availableCurrencies={currencies.data || []}
            bankAccount={state.bankAccount}
            isLoading={state.isLoading || tokens.loading || currencies.loading || bankAccounts.loading}
            error={state.error || tokens.error || currencies.error || bankAccounts.error}
          />
        )
      case "qr-send":
        return (
          <WithdrawalQRScreen
            selectedToken={state.selectedToken!}
            selectedCurrency={state.selectedCurrency!}
            walletAddress={state.walletAddress}
            onComplete={handleWithdrawalTimeout}
            onBack={goToPreviousStep}
          />
        )
      case "success":
        return (
          <WithdrawalSuccessScreen
            amount={state.amount}
            currency={state.selectedCurrency!}
            bankDetails={state.bankAccount!}
            onDone={onComplete}
          />
        )
      default:
        return null
    }
  }

  const progress = useMemo(() => {
    switch (state.step) {
      case "token-selection":
        return 33
      case "qr-send":
        return 66
      case "success":
        return 100
      default:
        return 0
    }
  }, [state.step])

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-transparent">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-full mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousStep}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">{screenTitle}</h1>
            <div className="w-9" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1">
          <div className="bg-blue-500 h-1 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="max-w-md mx-auto px-0 py-0">{renderCurrentScreen()}</div>
    </div>
  )
}

"use client"

import { useState, useCallback, useRef } from "react"
import {
  withdrawalApi,
  type WithdrawalQuoteRequest,
  type WithdrawalQuoteResponse,
  type WalletAddressRequest,
  type WalletAddressResponse,
  type WithdrawalStatusRequest,
  type WithdrawalStatusResponse,
  type BankAccount,
  WithdrawalApiError,
} from "@/services/withdrawalApi"

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useWithdrawalQuote() {
  const [state, setState] = useState<ApiState<WithdrawalQuoteResponse>>({
    data: null,
    loading: false,
    error: null,
  })

  const getQuote = useCallback(async (request: WithdrawalQuoteRequest) => {
    setState({ data: null, loading: true, error: null })
    try {
      const data = await withdrawalApi.getQuote(request)
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof WithdrawalApiError ? error.message : "Failed to get quote"
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  const clearQuote = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    getQuote,
    clearQuote,
  }
}

export function useWalletAddress() {
  const [state, setState] = useState<ApiState<WalletAddressResponse>>({
    data: null,
    loading: false,
    error: null,
  })

  const generateAddress = useCallback(async (request: WalletAddressRequest) => {
    setState({ data: null, loading: true, error: null })
    try {
      const data = await withdrawalApi.generateWalletAddress(request)
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof WithdrawalApiError ? error.message : "Failed to generate wallet address"
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  const clearAddress = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    generateAddress,
    clearAddress,
  }
}

export function useWithdrawalStatus() {
  const [state, setState] = useState<ApiState<WithdrawalStatusResponse>>({
    data: null,
    loading: false,
    error: null,
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const checkStatus = useCallback(async (request: WithdrawalStatusRequest) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const data = await withdrawalApi.checkWithdrawalStatus(request)
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof WithdrawalApiError ? error.message : "Failed to check status"
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }))
      throw error
    }
  }, [])

  const startPolling = useCallback(
    (request: WithdrawalStatusRequest, intervalMs = 2000) => {
      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      // Start polling
      intervalRef.current = setInterval(() => {
        checkStatus(request).catch(console.error)
      }, intervalMs)

      // Initial check
      checkStatus(request).catch(console.error)
    },
    [checkStatus],
  )

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const clearStatus = useCallback(() => {
    stopPolling()
    setState({ data: null, loading: false, error: null })
  }, [stopPolling])

  return {
    ...state,
    checkStatus,
    startPolling,
    stopPolling,
    clearStatus,
  }
}

export function useBankAccounts() {
  const [state, setState] = useState<ApiState<BankAccount[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchBankAccounts = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const data = await withdrawalApi.getBankAccounts()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof WithdrawalApiError ? error.message : "Failed to fetch bank accounts"
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  return {
    ...state,
    fetchBankAccounts,
  }
}

export function useWithdrawalTokens() {
  const [state, setState] = useState<ApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchTokens = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const data = await withdrawalApi.getAvailableTokens()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof WithdrawalApiError ? error.message : "Failed to fetch tokens"
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  return {
    ...state,
    fetchTokens,
  }
}

export function useWithdrawalCurrencies() {
  const [state, setState] = useState<ApiState<any[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchCurrencies = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const data = await withdrawalApi.getAvailableCurrencies()
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = error instanceof WithdrawalApiError ? error.message : "Failed to fetch currencies"
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [])

  return {
    ...state,
    fetchCurrencies,
  }
}

// Combined hook for withdrawal flow
export function useWithdrawalFlow() {
  const quote = useWithdrawalQuote()
  const walletAddress = useWalletAddress()
  const status = useWithdrawalStatus()
  const bankAccounts = useBankAccounts()
  const tokens = useWithdrawalTokens()
  const currencies = useWithdrawalCurrencies()

  const resetAll = useCallback(() => {
    quote.clearQuote()
    walletAddress.clearAddress()
    status.clearStatus()
  }, [quote.clearQuote, walletAddress.clearAddress, status.clearStatus])

  return {
    quote,
    walletAddress,
    status,
    bankAccounts,
    tokens,
    currencies,
    resetAll,
  }
}

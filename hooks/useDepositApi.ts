"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import {
  depositApi,
  DepositApiError,
  type QuoteRequest,
  type QuoteResponse,
  type BankDetailsRequest,
  type BankDetailsResponse,
  type VerificationRequest,
  type VerificationResponse,
} from "@/services/depositApi"

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  lastUpdated: number | null
}

interface UseQuoteOptions {
  debounceMs?: number
  retryAttempts?: number
  retryDelayMs?: number
}

export function useQuote(options: UseQuoteOptions = {}) {
  const { debounceMs = 500, retryAttempts = 3, retryDelayMs = 1000 } = options

  const [state, setState] = useState<ApiState<QuoteResponse>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  })

  const debounceRef = useRef<NodeJS.Timeout>()
  const retryCountRef = useRef(0)
  const abortControllerRef = useRef<AbortController>()

  const fetchQuote = useCallback(
    async (request: QuoteRequest, attempt = 0) => {
      try {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()

        setState((prev) => ({ ...prev, loading: true, error: null }))

        const response = await depositApi.getQuote(request)

        setState({
          data: response,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        })

        retryCountRef.current = 0
      } catch (error) {
        if (error instanceof DepositApiError) {
          // Don't retry validation errors
          if (error.code.includes("AMOUNT_ERROR")) {
            setState((prev) => ({
              ...prev,
              loading: false,
              error: error.message,
            }))
            return
          }

          // Retry network/service errors
          if (attempt < retryAttempts && (error.statusCode === 503 || error.statusCode === 500)) {
            retryCountRef.current = attempt + 1
            setTimeout(() => {
              fetchQuote(request, attempt + 1)
            }, retryDelayMs * Math.pow(2, attempt)) // Exponential backoff
            return
          }
        }

        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to fetch quote",
        }))
      }
    },
    [retryAttempts, retryDelayMs],
  )

  const getQuote = useCallback(
    (request: QuoteRequest) => {
      // Clear existing debounce
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      // Debounce the API call
      debounceRef.current = setTimeout(() => {
        fetchQuote(request)
      }, debounceMs)
    },
    [fetchQuote, debounceMs],
  )

  const clearQuote = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    })
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    ...state,
    getQuote,
    clearQuote,
    retryCount: retryCountRef.current,
  }
}

export function useBankDetails() {
  const [state, setState] = useState<ApiState<BankDetailsResponse>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  })

  const fetchBankDetails = useCallback(async (request: BankDetailsRequest) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const response = await depositApi.getBankDetails(request)

      setState({
        data: response,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch bank details",
      }))
    }
  }, [])

  const clearBankDetails = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    })
  }, [])

  return {
    ...state,
    fetchBankDetails,
    clearBankDetails,
  }
}

export function useVerification() {
  const [state, setState] = useState<ApiState<VerificationResponse>>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  })

  const pollIntervalRef = useRef<NodeJS.Timeout>()
  const [isPolling, setIsPolling] = useState(false)

  const initiateVerification = useCallback(async (request: VerificationRequest) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }))

      const { transactionId } = await depositApi.initiateVerification(request)

      // Start polling for status
      setIsPolling(true)
      pollIntervalRef.current = setInterval(async () => {
        try {
          const status = await depositApi.checkVerificationStatus(transactionId)

          setState({
            data: status,
            loading: false,
            error: null,
            lastUpdated: Date.now(),
          })

          // Stop polling if verification is complete
          if (status.status === "success" || status.status === "failed") {
            setIsPolling(false)
            if (pollIntervalRef.current) {
              clearInterval(pollIntervalRef.current)
            }
          }
        } catch (error) {
          // Continue polling on status check errors
          console.warn("Verification status check failed:", error)
        }
      }, 2000) // Poll every 2 seconds
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to initiate verification",
      }))
      setIsPolling(false)
    }
  }, [])

  const stopVerification = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    setIsPolling(false)
    setState((prev) => ({ ...prev, loading: false }))
  }, [])

  const clearVerification = useCallback(() => {
    stopVerification()
    setState({
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,
    })
  }, [stopVerification])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [])

  return {
    ...state,
    initiateVerification,
    stopVerification,
    clearVerification,
    isPolling,
  }
}

// Combined hook for the entire deposit flow
export function useDepositFlow() {
  const quote = useQuote({ debounceMs: 400 })
  const bankDetails = useBankDetails()
  const verification = useVerification()

  const resetAll = useCallback(() => {
    quote.clearQuote()
    bankDetails.clearBankDetails()
    verification.clearVerification()
  }, [quote.clearQuote, bankDetails.clearBankDetails, verification.clearVerification])

  return {
    quote,
    bankDetails,
    verification,
    resetAll,
  }
}

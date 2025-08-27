"use client"

import { useState, useEffect } from "react"

interface WithdrawalQRScreenProps {
  selectedToken: {
    symbol: string
    name: string
    icon: string
  }
  selectedCurrency: {
    code: string
    name: string
    flag: string
  }
  walletAddress: string
  onComplete: () => void
  onBack: () => void
}

export default function WithdrawalQRScreen({
  selectedToken,
  selectedCurrency,
  walletAddress,
  onComplete,
  onBack,
}: WithdrawalQRScreenProps) {
  const [timeLeft, setTimeLeft] = useState(260) // 4m 20s in seconds
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Auto-complete after timer expires
          setTimeout(onComplete, 1000)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onComplete])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Withdraw</h1>
        <div className="w-9" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Instructions */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Send <span className="font-semibold">{selectedToken.symbol}</span> to the below wallet address to receive{" "}
              <span className="font-semibold">{selectedCurrency.code}</span> directly in your selected bank account.
            </p>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(walletAddress)}`}
                  alt="Wallet QR Code"
                  className="w-80 h-80"
                />
              </div>
            </div>

            {/* Wallet Address */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3">
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate">{walletAddress}</span>
              <button onClick={copyToClipboard} className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                {copied ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl p-4">
            <div className="bg-blue-500 text-white rounded-lg px-3 py-1 text-sm font-medium">
              {formatTime(timeLeft)}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Once we receive your tokens on the above wallet address, we will automatically take you forward
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

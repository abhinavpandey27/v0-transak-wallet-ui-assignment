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
  const [qrLoading, setQrLoading] = useState(true)

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

  const handleQrLoad = () => {
    setQrLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      

      {/* Content */}
      <div className="flex-1 flex items-start justify-center p-4">
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
                {qrLoading && (
                  <div className="w-80 h-80 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse flex items-center justify-center">
                    <div className="text-gray-400 dark:text-gray-500">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(walletAddress)}`}
                  alt="Wallet QR Code"
                  className={`w-80 h-80 ${qrLoading ? "hidden" : "block"}`}
                  onLoad={handleQrLoad}
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

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
  const [timeLeft, setTimeLeft] = useState(12) // 12 seconds demo countdown
  const [copied, setCopied] = useState(false)
  const [qrLoading, setQrLoading] = useState(true)
  const hasAddress = Boolean(walletAddress)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const totalTime = 260
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  useEffect(() => {
    // When a new wallet address arrives, show skeleton until the QR image loads
    if (hasAddress) setQrLoading(true)
  }, [hasAddress])

  const copyToClipboard = async () => {
    try {
      if (!hasAddress) return
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
    <div className="min-h-[100dvh] dark:bg-gray-900 flex flex-col bg-transparent pb-safe">
      <div className="flex-1 flex items-start justify-center p-4 py-8 mt-4 bg-transparent">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-gray-white dark:bg-gray-900 rounded-xl p-6 text-center space-y-4 px-0 py-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Send Your Crypto</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Transfer <span className="font-semibold" style={{ color: 'var(--brand)' }}>{selectedToken.symbol}</span> to the wallet address
              below. Once confirmed, you'll receive{" "}
              <span className="font-semibold text-green-600">{selectedCurrency.code}</span> directly in your selected
              bank account.
            </p>

            <div className="flex justify-center">
              <div className="p-4 rounded-xl shadow-sm bg-gray-50 dark:bg-gray-800">
                {(!hasAddress || qrLoading) && (
                  <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse flex items-center justify-center">
                    <div className="text-gray-400 dark:text-gray-500">
                      <svg className="w-12 h-12 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                {hasAddress && (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(walletAddress)}`}
                    alt="Wallet QR Code"
                    className={`w-64 h-64 sm:w-80 sm:h-80 ${qrLoading ? "hidden" : "block"}`}
                    onLoad={handleQrLoad}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between dark:bg-gray-700 rounded-lg p-3 bg-gray-50">
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate mr-2 min-h-[1.25rem]">
                {hasAddress ? walletAddress : "Generating address…"}
              </span>
              <button
                onClick={copyToClipboard}
                aria-label="Copy wallet address"
                disabled={!hasAddress}
                className={`ml-2 p-2 rounded-lg transition-colors flex-shrink-0 ${
                  hasAddress ? "hover:bg-gray-100 dark:hover:bg-gray-600" : "opacity-50 cursor-not-allowed"
                }`}
              >
                {copied ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label="Copied">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" role="img" aria-label="Copy">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
              <span className="sr-only" aria-live="polite">{copied ? "Address copied" : ""}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 dark:bg-gray-800 rounded-xl p-4 bg-gray-50">
            <div className="relative w-12 h-12 flex-shrink-0">
              {/* Background circle */}
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200 dark:text-gray-600"
                />
                {/* Progress circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
                  className="text-blue-500 transition-all duration-1000 ease-linear"
                  strokeLinecap="round"
                />
              </svg>
              {/* Timer text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">Waiting for your transaction</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                We'll automatically proceed once your crypto is received and confirmed on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

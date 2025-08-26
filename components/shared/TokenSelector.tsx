"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"

interface Token {
  symbol: string
  name: string
  color: string
  rate?: number
}

interface TokenSelectorProps {
  selectedToken: Token
  onTokenChange: (token: Token) => void
  availableTokens: Token[]
  className?: string
}

export default function TokenSelector({
  selectedToken,
  onTokenChange,
  availableTokens,
  className = "",
}: TokenSelectorProps) {
  const [showDialog, setShowDialog] = useState(false)

  const getCryptoLogo = (symbol: string) => {
    return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${symbol.toLowerCase()}.svg`
  }

  return (
    <>
      <div
        onClick={() => setShowDialog(true)}
        className={`flex items-center gap-scaled-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer transition-colors py-scaled-1 px-scaled-1 rounded-full ${className}`}
      >
        <img
          src={getCryptoLogo(selectedToken.symbol) || "/placeholder.svg"}
          alt={selectedToken.name}
          className="w-8 h-8 rounded-full"
        />
        <span className="text-scaled-sm font-medium text-gray-700 dark:text-gray-300">{selectedToken.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-scaled-6 w-96 max-w-sm mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-scaled-4">
              <h3 className="text-scaled-lg font-semibold text-gray-900 dark:text-white">Select Token</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {availableTokens.map((token) => (
                <div
                  key={token.symbol}
                  onClick={() => {
                    onTokenChange(token)
                    setShowDialog(false)
                  }}
                  className={`flex items-center gap-scaled-3 p-scaled-3 rounded-lg cursor-pointer transition-colors ${
                    selectedToken.symbol === token.symbol
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <img src={getCryptoLogo(token.symbol) || "/placeholder.svg"} alt={token.name} className="w-10 h-10" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white text-scaled-sm">{token.name}</div>
                    <div className="text-scaled-sm text-gray-500 dark:text-gray-400">{token.symbol}</div>
                  </div>
                  {selectedToken.symbol === token.symbol && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

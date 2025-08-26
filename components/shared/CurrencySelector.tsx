"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"

interface Currency {
  code: string
  symbol: string
  name: string
}

interface CurrencySelectorProps {
  selectedCurrency: Currency
  onCurrencyChange: (currency: Currency) => void
  availableCurrencies: Currency[]
  className?: string
}

export default function CurrencySelector({
  selectedCurrency,
  onCurrencyChange,
  availableCurrencies,
  className = "",
}: CurrencySelectorProps) {
  const [showDialog, setShowDialog] = useState(false)

  return (
    <>
      <div
        onClick={() => setShowDialog(true)}
        className={`flex items-center gap-scaled-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer transition-colors py-scaled-1 px-scaled-1 rounded-full ${className}`}
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-400 font-semibold text-scaled-sm">
            {selectedCurrency.symbol}
          </span>
        </div>
        <span className="text-scaled-sm font-medium text-gray-700 dark:text-gray-300">{selectedCurrency.code}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-scaled-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-scaled-4">
              <h3 className="text-scaled-lg font-semibold text-gray-900 dark:text-white">Select Currency</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {availableCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  onClick={() => {
                    onCurrencyChange(currency)
                    setShowDialog(false)
                  }}
                  className={`flex items-center gap-scaled-3 p-scaled-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCurrency.code === currency.code
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 font-semibold text-scaled-sm">
                      {currency.symbol}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white text-scaled-sm">{currency.code}</div>
                    <div className="text-scaled-sm text-gray-500 dark:text-gray-400">{currency.name}</div>
                  </div>
                  {selectedCurrency.code === currency.code && (
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

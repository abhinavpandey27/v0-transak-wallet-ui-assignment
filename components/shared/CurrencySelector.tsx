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
      <div className={`flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer transition-colors py-1 px-1 rounded-full ${className}`}>
        <img src={selectedCurrency.flag} alt={selectedCurrency.name} className="w-6 h-6 rounded-full" />
        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
          {selectedCurrency.symbol}
        </span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedCurrency.code}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Currency</h3>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableCurrencies.map((currency) => (
                <div
                  key={currency.code}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCurrency.code === currency.code
                      ? "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    onCurrencyChange(currency)
                    setShowDialog(false)
                  }}
                >
                  <img src={currency.flag} alt={currency.name} className="w-6 h-6 rounded-full" />
                  <div className="flex-1">
                    <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">
                      {currency.symbol}
                    </span>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{currency.code}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{currency.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

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
        className={`flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors py-1 px-1 rounded-full ${className}`}
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">{selectedCurrency.symbol}</span>
        </div>
        <span className="text-sm font-medium text-gray-700">{selectedCurrency.code}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Select Currency</h3>
              <button onClick={() => setShowDialog(false)} className="text-gray-400 hover:text-gray-600">
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
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCurrency.code === currency.code ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-sm">{currency.symbol}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{currency.code}</div>
                    <div className="text-sm text-gray-500">{currency.name}</div>
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

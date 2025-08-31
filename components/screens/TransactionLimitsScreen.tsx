"use client"

import { useState } from "react"
import { CustomButton } from "@/components/ui/custom-button"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"

interface Currency {
  code: string
  symbol: string
  name: string
}

interface TransactionLimitsScreenProps {
  limitsActiveTab: string
  setLimitsActiveTab: (tab: string) => void
  limitsCurrency: Currency
  setLimitsCurrency: (currency: Currency) => void
  availableCurrencies: Currency[]
}

import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet"

export default function TransactionLimitsScreen({
  limitsActiveTab,
  setLimitsActiveTab,
  limitsCurrency,
  setLimitsCurrency,
  availableCurrencies,
}: TransactionLimitsScreenProps) {
  const [showLimitsCurrencyDialog, setShowLimitsCurrencyDialog] = useState(false)

  const transactionLimits = {
    daily: {
      bankTransfer: { limit: 1435.2, used: 1435.2, remaining: 0 },
      creditCard: { limit: 1435.2, used: 1435.2, remaining: 0 },
    },
    monthly: {
      bankTransfer: { limit: 43056.0, used: 15000.0, remaining: 28056.0 },
      creditCard: { limit: 43056.0, used: 20000.0, remaining: 23056.0 },
    },
    yearly: {
      bankTransfer: { limit: 516720.0, used: 180000.0, remaining: 336720.0 },
      creditCard: { limit: 516720.0, used: 240000.0, remaining: 276720.0 },
    },
  }

  const formatLimitAmount = (amount: number) => {
    return `${limitsCurrency.symbol}${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="max-w-full sm:max-w-[640px] w-full">
      <div className="mb-8">
        {/* Tab Navigation - Full Width */}
        <div className="relative bg-gray-100 dark:bg-gray-700 p-1 flex rounded-full">
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setLimitsActiveTab("daily")}
            className={`rounded-full flex-1 ${limitsActiveTab === "daily" ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300"}`}
          >
            Daily Limit
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setLimitsActiveTab("monthly")}
            className={`rounded-full flex-1 ${limitsActiveTab === "monthly" ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300"}`}
          >
            Monthly Limit
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setLimitsActiveTab("yearly")}
            className={`rounded-full flex-1 ${limitsActiveTab === "yearly" ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300"}`}
          >
            Yearly Limit
          </CustomButton>
        </div>
      </div>

      {/* Bank Transfer Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-left">Bank Transfer</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <TrendingUp className="w-4 h-4" />
                Limit
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatLimitAmount(
                  transactionLimits[limitsActiveTab as keyof typeof transactionLimits].bankTransfer.limit,
                )}
              </div>
            </div>
            <div className="text-left sm:border-l border-gray-200 dark:border-gray-600 sm:pl-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <TrendingDown className="w-4 h-4" />
                Used
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatLimitAmount(
                  transactionLimits[limitsActiveTab as keyof typeof transactionLimits].bankTransfer.used,
                )}
              </div>
            </div>
            <div className="text-left sm:border-l border-gray-200 dark:border-gray-600 sm:pl-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4" />
                Remaining
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatLimitAmount(
                  transactionLimits[limitsActiveTab as keyof typeof transactionLimits].bankTransfer.remaining,
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Card Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-left">Credit and Debit Card</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-left">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <TrendingUp className="w-4 h-4" />
                Limit
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatLimitAmount(
                  transactionLimits[limitsActiveTab as keyof typeof transactionLimits].creditCard.limit,
                )}
              </div>
            </div>
            <div className="text-left sm:border-l border-gray-200 dark:border-gray-600 sm:pl-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <TrendingDown className="w-4 h-4" />
                Used
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatLimitAmount(
                  transactionLimits[limitsActiveTab as keyof typeof transactionLimits].creditCard.used,
                )}
              </div>
            </div>
            <div className="text-left sm:border-l border-gray-200 dark:border-gray-600 sm:pl-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                <DollarSign className="w-4 h-4" />
                Remaining
              </div>
              <div className="text-xl font-semibold text-gray-900 dark:text-white">
                {formatLimitAmount(
                  transactionLimits[limitsActiveTab as keyof typeof transactionLimits].creditCard.remaining,
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-8">
        Want to see limits in a currency other than {limitsCurrency.name} ({limitsCurrency.symbol})?{" "}
        <button
          onClick={() => setShowLimitsCurrencyDialog(true)}
          className="text-[var(--brand)] hover:opacity-90 underline font-medium"
        >
          Change Currency
        </button>
      </div>

      {showLimitsCurrencyDialog && (
        <Sheet open={showLimitsCurrencyDialog} onOpenChange={setShowLimitsCurrencyDialog}>
          <SheetContent>
            <div className="flex items-center justify-between mb-2">
              <SheetTitle>Select Currency</SheetTitle>
              <SheetClose aria-label="Close" className="text-sm text-gray-500 hover:underline">Close</SheetClose>
            </div>
            <div className="space-y-2">
              {availableCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setLimitsCurrency(currency)
                    setShowLimitsCurrencyDialog(false)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">{currency.symbol}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white">{currency.code}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{currency.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

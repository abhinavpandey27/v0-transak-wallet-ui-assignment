"use client"

import { ArrowUp, ArrowDown, Loader2, AlertTriangle, X, Download, Upload } from "lucide-react"

interface Transaction {
  id: number
  type: string
  currency: string
  symbol: string
  date: string
  transactionId: string
  amount: string
  crypto: string
  status: string
  transactionType: string
}

interface TransactionItemProps {
  transaction: Transaction
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const getCryptoLogo = (symbol: string) => {
    return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${symbol.toLowerCase()}.svg`
  }

  const getStatusIndicator = (status: string, transactionType: string) => {
    const baseClasses =
      "absolute -top-1 -left-1 w-6 h-6 rounded-full border-[1.5px] border-white dark:border-gray-800 flex items-center justify-center shadow-sm"

    switch (status) {
      case "pending":
        return (
          <div className={`${baseClasses} bg-yellow-500`}>
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          </div>
        )
      case "error":
        return (
          <div className={`${baseClasses} bg-red-500`}>
            <X className="w-4 h-4 text-white" />
          </div>
        )
      case "warning":
        return (
          <div className={`${baseClasses} bg-orange-500`}>
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
        )
      case "completed":
        if (transactionType === "deposit" || transactionType === "buy") {
          return (
            <div className={`${baseClasses} bg-green-500`}>
              <ArrowUp className="w-4 h-4 text-white" />
            </div>
          )
        } else if (transactionType === "withdraw") {
          return (
            <div className={`${baseClasses} bg-green-500`}>
              <ArrowDown className="w-4 h-4 text-white" />
            </div>
          )
        }
        break
      default:
        return (
          <div className={`${baseClasses} bg-gray-400`}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )
    }
  }

  return (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border-gray-200 dark:border-gray-600 border-0 border-b px-4 justify-start gap-4 py-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-700 w-16 h-16 bg-transparent border-none">
            <img
              src={getCryptoLogo(transaction.symbol) || "/placeholder.svg"}
              alt={transaction.currency}
              className="w-16 h-16 object-contain"
            />
          </div>
          {getStatusIndicator(transaction.status, transaction.transactionType)}
        </div>
      </div>
      <div className="text-right space-y-1 w-full">
        {/* Row 1: Date/Time vs EUR Amount */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{transaction.amount}</span>
        </div>
        {/* Row 2: Currency vs Crypto Amount */}
        <div className="flex justify-between items-center">
          <span className="text-base font-medium text-gray-900 dark:text-white">{transaction.currency}</span>
          <span className="text-base text-gray-900 dark:text-white font-semibold">{transaction.crypto}</span>
        </div>
        {/* Row 3: Full ID vs Description */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">ID: {transaction.transactionId}</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">Sandbox Testing</span>
        </div>
      </div>
    </div>
  )
}

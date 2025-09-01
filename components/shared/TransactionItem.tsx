"use client"

import { ArrowUp, ArrowDown } from "lucide-react"

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
  description?: string
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

    const bg =
      status === "error"
        ? "bg-red-500"
        : status === "warning"
          ? "bg-orange-500"
          : status === "pending"
            ? "bg-yellow-500"
            : "bg-green-500"

    const isDeposit = transactionType === "deposit" || transactionType === "buy"
    const Icon = isDeposit ? ArrowDown : ArrowUp // deposit ↓, withdraw ↑ to match CTAs

    return (
      <div className={`${baseClasses} ${bg}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    )
  }

  const addSign = (value: string, sign: "+" | "-") => {
    if (!value) return value
    const hasSign = value.trim().startsWith("-") || value.trim().startsWith("+")
    return hasSign ? value : `${sign}${value}`
  }

  const isDeposit = transaction.transactionType === "deposit" || transaction.transactionType === "buy"
  const isWithdraw = transaction.transactionType === "withdraw"

  // Fiat is the primary figure: negative for deposit (outflow), positive for withdraw (inflow)
  const fiatDisplay = isDeposit
    ? addSign(transaction.amount, "-")
    : isWithdraw
      ? addSign(transaction.amount, "+")
      : transaction.amount

  // Crypto sign is opposite
  const cryptoDisplay = isWithdraw ? addSign(transaction.crypto, "-") : transaction.crypto

  const fiatColor = (() => {
    if (transaction.status === "pending" || transaction.status === "warning") return "text-gray-500 dark:text-gray-400"
    if (transaction.status === "error") return "text-red-600 dark:text-red-500"
    if (isDeposit) return "text-red-600 dark:text-red-500"
    if (isWithdraw) return "text-green-600 dark:text-green-500"
    return "text-gray-900 dark:text-white"
  })()

  return (
    <div className="flex items-start px-4 py-4 bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 gap-3 sm:gap-4">
      {/* Left: Token avatar with status indicator */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
          <img
            src={getCryptoLogo(transaction.symbol) || "/placeholder.svg"}
            alt={transaction.currency}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
          />
        </div>
        {getStatusIndicator(transaction.status, transaction.transactionType)}
      </div>

      {/* Right: 3 compact rows matching reference */}
      <div className="w-full min-w-0">
        {/* Row 1: Date at left, fiat amount (signed) at right */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{transaction.date}</span>
          <span className={`text-xs sm:text-sm tabular-nums ${fiatColor}`}>{fiatDisplay}</span>
        </div>

        {/* Row 2: Token name at left, crypto amount at right (bold) */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {transaction.currency} ({transaction.symbol})
          </span>
          <span className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white tabular-nums">{cryptoDisplay}</span>
        </div>

        {/* Row 3: ID at left, status/description at right */}
        <div className="flex items-start sm:items-center justify-between gap-2 mt-0.5 flex-col sm:flex-row">
          <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-all">ID: {transaction.transactionId}</span>
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 self-start sm:self-auto">
            {transaction.description ||
              (transaction.status === "pending"
                ? "Pending confirmation"
                : transaction.status === "error"
                  ? "Failed — see details"
                  : transaction.status === "warning"
                    ? "Action required"
                    : transaction.transactionType === "deposit"
                      ? "Bank transfer deposit"
                      : transaction.transactionType === "withdraw"
                        ? "On-chain withdrawal"
                        : transaction.transactionType === "buy"
                          ? "Card purchase"
                          : "Completed")}
          </span>
        </div>
      </div>
    </div>
  )
}

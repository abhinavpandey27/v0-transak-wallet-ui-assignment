"use client"

import type { CryptoHolding } from "@/types"

interface Props {
  holding: CryptoHolding
  onClick?: (h: CryptoHolding) => void
}

const iconFor = (symbol: string) =>
  `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${symbol.toLowerCase()}.svg`

const fmtEUR = (n: number) =>
  `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`

const fmtQty = (n: number) => {
  if (n === 0) return "0"
  if (Math.abs(n) >= 1) return n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 8 })
  return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 8 })
}

export default function CryptoHoldingItem({ holding, onClick }: Props) {
  const value = holding.priceEur * holding.quantity
  const change = holding.changePct24h
  const changeStr = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`

  return (
    <button
      type="button"
      onClick={() => onClick?.(holding)}
      className="w-full text-left flex items-start px-4 py-4 bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 gap-3 sm:gap-4"
      aria-label={`${holding.name} (${holding.symbol}). Qty ${holding.quantity}. Value ${fmtEUR(value)}.`}
    >
      {/* Avatar */}
      <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
        <img src={iconFor(holding.symbol)} alt={`${holding.symbol} icon`} className="w-8 h-8 object-contain" />
      </div>

      {/* Content */}
      <div className="w-full min-w-0">
        {/* Row 1 */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
            {holding.name} ({holding.symbol})
          </span>
          <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white tabular-nums">
            {fmtQty(holding.quantity)}
          </span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {fmtEUR(holding.priceEur)}
            <span className={`ml-2 ${change >= 0 ? "text-green-600" : "text-red-500"}`}>{changeStr}</span>
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-300 tabular-nums">{fmtEUR(value)}</span>
        </div>
      </div>
    </button>
  )
}

"use client"

import type { CryptoHolding } from "@/types"
import CryptoHoldingItem from "./CryptoHoldingItem"

interface Props {
  holdings: CryptoHolding[]
  isLoading?: boolean
  onItemClick?: (h: CryptoHolding) => void
}

export default function CryptoHoldingsList({ holdings, isLoading, onItemClick }: Props) {
  const sorted = [...holdings].sort((a, b) => b.priceEur * b.quantity - a.priceEur * a.quantity)

  if (isLoading) {
    return (
      <div className="space-y-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700 gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-3 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="text-right">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!sorted.length) {
    return (
      <div className="px-4 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        No tokens yet. Deposit to get started.
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {sorted.map((h) => (
        <CryptoHoldingItem key={`${h.symbol}-${h.network}`} holding={h} onClick={onItemClick} />
      ))}
    </div>
  )
}


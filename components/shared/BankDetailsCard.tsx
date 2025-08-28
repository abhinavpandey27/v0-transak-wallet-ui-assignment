"use client"

import { CreditCard, User, Hash, MapPin, Globe, Wallet, Copy, Check } from "lucide-react"
import { useState } from "react"

interface BankDetailsCardProps {
  bankDetails: {
    bankName?: string
    beneficiaryName?: string
    iban?: string
    bankAddress?: string
    bankCountry?: string
    walletAddress?: string
  }
  showCopyButtons?: boolean
  className?: string
}

function TruncatedText({ text, maxLength = 25 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!text || text.length <= maxLength) {
    return <span className="font-medium text-gray-900 dark:text-white text-sm">{text}</span>
  }

  const truncated = `${text.slice(0, Math.floor(maxLength / 2))}...${text.slice(-Math.floor(maxLength / 2))}`

  return (
    <div className="flex-1 min-w-0 text-right">
      {isExpanded ? (
        <span
          className="font-medium text-gray-900 dark:text-white text-sm cursor-pointer break-all leading-tight"
          onClick={() => setIsExpanded(false)}
        >
          {text}
        </span>
      ) : (
        <span
          className="font-medium text-gray-900 dark:text-white text-sm cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          {truncated}
        </span>
      )}
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy className="w-3 h-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
      )}
    </button>
  )
}

export default function BankDetailsCard({ bankDetails, showCopyButtons = true, className = "" }: BankDetailsCardProps) {
  const bankDetailRows = [
    {
      icon: CreditCard,
      label: "Bank Name",
      value: bankDetails?.bankName,
      key: "bankName",
    },
    {
      icon: User,
      label: "Beneficiary Name",
      value: bankDetails?.beneficiaryName,
      key: "beneficiaryName",
    },
    {
      icon: Hash,
      label: "IBAN / Account",
      value: bankDetails?.iban,
      key: "iban",
      truncate: true,
    },
    {
      icon: MapPin,
      label: "Bank address",
      value: bankDetails?.bankAddress,
      key: "bankAddress",
      truncate: true,
      maxLength: 30,
    },
    {
      icon: Globe,
      label: "Bank country",
      value: bankDetails?.bankCountry,
      key: "bankCountry",
    },
  ].filter((row) => row.value) // Remove rows with empty values

  // Only add wallet address if it exists and has content
  if (bankDetails?.walletAddress && bankDetails.walletAddress.trim()) {
    bankDetailRows.push({
      icon: Wallet,
      label: "Wallet Address",
      value: bankDetails.walletAddress,
      key: "walletAddress",
      truncate: true,
      maxLength: 20,
    })
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
    >
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {bankDetailRows.map((row, index) => {
          const Icon = row.icon
          const isEven = index % 2 === 0

          return (
            <div
              key={row.key}
              className={`flex justify-between items-center py-4 px-4 ${
                isEven ? "bg-gray-50 dark:bg-gray-750" : "bg-white dark:bg-gray-800"
              }`}
            >
              <div className="flex items-center gap-3 flex-shrink-0">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap">{row.label}</span>
              </div>
              <div className="flex items-center min-w-0 flex-1 justify-end">
                {row.truncate ? (
                  <TruncatedText text={row.value || ""} maxLength={row.maxLength || 25} />
                ) : (
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{row.value}</span>
                )}
                {showCopyButtons && <CopyButton text={row.value || ""} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

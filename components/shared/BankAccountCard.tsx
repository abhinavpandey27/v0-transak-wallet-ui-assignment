"use client"

import { CreditCard } from "lucide-react"

interface BankAccount {
  id: number
  bankName: string
  iban: string
  beneficiary: string
  address: string
  currency: string
}

interface BankAccountCardProps {
  account: BankAccount
  isSelected: boolean
  onSelect: (account: BankAccount) => void
}

export default function BankAccountCard({ account, isSelected, onSelect }: BankAccountCardProps) {
  return (
          <div
        onClick={() => onSelect(account)}
        className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${
          isSelected
            ? "border-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_8%,white)] dark:bg-[var(--brand-soft)]"
            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center"
               style={{ background: 'color-mix(in_oklab, var(--brand) 15%, white)' }}>
            <CreditCard className="w-6 h-6" style={{ color: 'var(--brand)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
              <div className="font-semibold text-gray-900 dark:text-white truncate">
                {account.beneficiary}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {account.currency}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Bank Name</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{account.bankName}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">IBAN / Account</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white break-all">{account.iban}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <div className="font-medium text-gray-900 dark:text-white text-sm mb-1">{account.beneficiary}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 break-words">{account.address}</div>
            </div>
          </div>
        </div>
      </div>
  )
}

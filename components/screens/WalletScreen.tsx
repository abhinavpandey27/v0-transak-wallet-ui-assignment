"use client"

import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Download, Upload, Filter } from "lucide-react"
import TransactionItem from "@/components/shared/TransactionItem"

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

interface WalletScreenProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  transactions: Transaction[]
  cryptoTransactions: Transaction[]
  onNavigateToDeposit: () => void
  onNavigateToWithdraw: () => void
}

export default function WalletScreen({
  activeTab,
  setActiveTab,
  transactions,
  cryptoTransactions,
  onNavigateToDeposit,
  onNavigateToWithdraw,
}: WalletScreenProps) {
  return (
    <div className="max-w-[640px] w-full">
      {/* Balance Card */}
      <Card className="p-8 mb-8 bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-none px-6 py-6">
        <div className="text-center">
          <p className="text-gray-600 mb-2 text-left font-sans">Your Total Balance</p>
          <h2 className="text-5xl text-gray-900 mb-4 text-left font-semibold">$1435.20</h2>
          <p className="mx-auto text-left text-sm text-slate-500">
            Your Virtual Account is active to perform fiat and crypto transactions
          </p>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <CustomButton variant="primary" size="lg" onClick={onNavigateToDeposit} className="flex-1">
          <Download className="w-5 h-5" />
          Deposit
        </CustomButton>
        <CustomButton variant="primary" size="lg" onClick={onNavigateToWithdraw} className="flex-1">
          <Upload className="w-5 h-5" />
          Withdraw
        </CustomButton>
      </div>

      {/* Tabs and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative bg-gray-100 p-1 flex rounded-full">
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("fiat")}
            className={`rounded-full ${activeTab === "fiat" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
          >
            Fiat Account
          </CustomButton>
          <CustomButton
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("crypto")}
            className={`rounded-full ${activeTab === "crypto" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"}`}
          >
            Crypto Wallet
          </CustomButton>
        </div>
        <CustomButton variant="outline" size="sm">
          <Filter className="w-4 h-4" />
          Filters
        </CustomButton>
      </div>

      {/* Transactions List */}
      <div className="transition-opacity duration-200 ease-in-out">
        {(activeTab === "fiat" ? transactions : cryptoTransactions).map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  )
}

"use client"

import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Download, Upload, Filter } from "lucide-react"
import TransactionItem from "@/components/shared/TransactionItem"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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
  // Dummy data for the balance chart - 6 months
  const chartData = [
    { month: "Jul", balance: 980 },
    { month: "Aug", balance: 1120 },
    { month: "Sep", balance: 1080 },
    { month: "Oct", balance: 1250 },
    { month: "Nov", balance: 1380 },
    { month: "Dec", balance: 1435.20 },
  ]

  return (
    <div className="w-full">
      {/* Enhanced Balance Overview - Narrow, Centered */}
      <div className="flex justify-center">
        <div className="max-w-[640px] w-full">
          <Card className="p-6 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">Your Total Balance</p>
                <h2 className="text-3xl text-gray-900 dark:text-white font-semibold">$1435.20</h2>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">% Change in 6M</p>
                <p className="text-green-600 dark:text-green-400 text-lg font-semibold">+32%</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Balance Chart - Full Width */}
      <Card className="p-6 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mx-4">
        <div className="mb-4">
          
          
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(156, 163, 175, 0.2)"
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  border: "1px solid rgba(59, 130, 246, 0.5)",
                  borderRadius: "8px",
                  color: "#ffffff"
                }}
                labelStyle={{ color: "#ffffff" }}
                formatter={(value: any) => [`$${value}`, "Balance"]}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="rgb(59, 130, 246)"
                strokeWidth={2}
                dot={{ 
                  fill: "rgb(59, 130, 246)", 
                  stroke: "#ffffff", 
                  strokeWidth: 2, 
                  r: 4 
                }}
                activeDot={{ 
                  r: 6, 
                  fill: "rgb(59, 130, 246)" 
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Action Buttons - Narrow, Centered */}
      <div className="flex justify-center">
        <div className="max-w-[640px] w-full">
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
        </div>
      </div>

      {/* Tabs and Filters - Narrow, Centered */}
      <div className="flex justify-center">
        <div className="max-w-[640px] w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="relative bg-gray-100 dark:bg-gray-700 p-1 flex rounded-full">
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("fiat")}
                className={`rounded-full text-sm ${activeTab === "fiat" ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300"}`}
              >
                Fiat Account
              </CustomButton>
              <CustomButton
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("crypto")}
                className={`rounded-full text-sm ${activeTab === "crypto" ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-600 dark:text-gray-300"}`}
              >
                Crypto Wallet
              </CustomButton>
            </div>
            <CustomButton variant="outline" size="sm" className="text-sm">
              <Filter className="w-4 h-4" />
              Filters
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Transactions List - Narrow, Centered */}
      <div className="flex justify-center">
        <div className="max-w-[640px] w-full">
          <div className="transition-opacity duration-200 ease-in-out">
            {(activeTab === "fiat" ? transactions : cryptoTransactions).map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

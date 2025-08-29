"use client"

import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Download, Upload, Filter } from "lucide-react"
import TransactionItem from "@/components/shared/TransactionItem"
import { useState } from "react"
import { Line } from "react-chartjs-2"
import "@/lib/chart"

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
  // Time period state
  const [selectedPeriod, setSelectedPeriod] = useState("6M")

  // Time period options
  const timePeriods = ["1D", "1W", "1M", "3M", "6M", "1Y"]

  // Dynamic data based on selected period
  const getChartData = (period: string) => {
    switch (period) {
      case "1D":
        return {
          labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"],
          data: [980, 1020, 1080, 1120, 1180, 1220, 1250],
        }
      case "1W":
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          data: [980, 1020, 1080, 1120, 1180, 1220, 1250],
        }
      case "1M":
        return {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          data: [980, 1080, 1180, 1250],
        }
      case "3M":
        return {
          labels: ["Jan", "Feb", "Mar"],
          data: [980, 1080, 1250],
        }
      case "6M":
        return {
          labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          data: [980, 1120, 1080, 1250, 1380, 1435.2],
        }
      case "1Y":
        return {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          data: [800, 850, 900, 950, 1000, 1050, 980, 1120, 1080, 1250, 1380, 1435.2],
        }
      default:
        return {
          labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          data: [980, 1120, 1080, 1250, 1380, 1435.2],
        }
    }
  }

  // Get current period data
  const currentData = getChartData(selectedPeriod)

  // Calculate change percentage based on selected period
  const calculateChange = (period: string) => {
    const data = getChartData(period)
    const startValue = data.data[0]
    const endValue = data.data[data.data.length - 1]
    const change = ((endValue - startValue) / startValue) * 100
    return change
  }

  // Memoize change percentage to avoid recompute on render
  const changePct = calculateChange(selectedPeriod)

  return (
    <div className="w-full">
      {/* Enhanced Balance Overview - Narrow, Centered */}
      <div className="flex justify-center">
        <div className="max-w-[640px] w-full">
          <Card className="mb-8 bg-white dark:bg-gray-800 border-0 shadow-none">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-5 py-5">
              {/* Row 1: Your Total Balance on Left and Change Toggle on Right */}
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-600 dark:text-gray-300 text-sm">Your Total Balance</p>
                <div className="flex items-center gap-0.5">
                  <span className="text-gray-600 dark:text-gray-300 text-sm">Change in</span>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent border-none outline-none cursor-pointer hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {timePeriods.map((period) => (
                      <option
                        key={period}
                        value={period}
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {period}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Balance Value on Left and Change % on Right */}
              <div className="flex justify-between items-end">
                <h2 className="text-gray-900 dark:text-white font-semibold text-4xl">$1435.20</h2>
                <div className="flex items-center">
                  <span
                    className={`text-xl px-3 py-1.5 rounded-lg font-semibold ${
                      changePct >= 0
                        ? "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
                        : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    {changePct >= 0 ? "+" : ""}
                    {changePct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Balance Chart - Full Width */}
      <Card className="p-6 mb-8 bg-white dark:bg-gray-800 mx-4">
        <div className="h-80">
          <Line
            data={{
              labels: currentData.labels,
              datasets: [
                {
                  label: "Balance",
                  data: currentData.data,
                  borderColor: "rgb(59, 130, 246)",
                  backgroundColor: (context: any) => {
                    const chart = context.chart
                    const { ctx, chartArea } = chart
                    if (!chartArea) return null

                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
                    gradient.addColorStop(0, "rgba(59, 130, 246, 0.3)")
                    gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.15)")
                    gradient.addColorStop(1, "rgba(59, 130, 246, 0.0)")
                    return gradient
                  },
                  fill: true,
                  tension: 0.4,
                  pointBackgroundColor: "rgb(59, 130, 246)",
                  pointBorderColor: "#ffffff",
                  pointBorderWidth: 2,
                  pointRadius: 4,
                  pointHoverRadius: 6,
                  pointHitRadius: 12,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: "rgba(17, 24, 39, 0.95)",
                  titleColor: "#ffffff",
                  bodyColor: "#ffffff",
                  borderColor: "rgba(59, 130, 246, 0.6)",
                  borderWidth: 2,
                  cornerRadius: 8,
                  displayColors: false,
                  padding: 12,
                  titleFont: {
                    size: 14,
                    weight: "bold",
                  },
                  bodyFont: {
                    size: 13,
                  },
                  callbacks: {
                    label: (context: any) =>
                      `Balance: $${context.parsed.y.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  },
                },
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    color: "#6b7280",
                    font: {
                      size: 12,
                    },
                  },
                  border: {
                    display: false,
                  },
                },
                y: {
                  display: false,
                  grid: {
                    color: "rgba(156, 163, 175, 0.1)",
                  },
                },
              },
              elements: {
                point: {
                  hoverBackgroundColor: "rgb(59, 130, 246)",
                },
              },
              layout: {
                padding: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
              },
            }}
          />
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

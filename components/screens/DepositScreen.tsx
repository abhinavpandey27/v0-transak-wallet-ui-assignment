"use client"

import { Card } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { ArrowRight, Building2, UserCheck, Hash, MapPin, Globe, Wallet, X } from "lucide-react"
import CurrencySelector from "@/components/shared/CurrencySelector"

interface Currency {
  code: string
  symbol: string
  name: string
}

interface Token {
  symbol: string
  name: string
  color: string
  rate: number
}

interface DepositScreenProps {
  depositAmount: string
  setDepositAmount: (amount: string) => void
  depositDescription: string
  setDepositDescription: (description: string) => void
  selectedCurrency: Currency
  setSelectedCurrency: (currency: Currency) => void
  selectedToken: Token | null
  setSelectedToken: (token: Token | null) => void
  availableCurrencies: Currency[]
  cryptoTokens: Token[]
  showTokenDialog: boolean
  setShowTokenDialog: (show: boolean) => void
}

export default function DepositScreen({
  depositAmount,
  setDepositAmount,
  depositDescription,
  setDepositDescription,
  selectedCurrency,
  setSelectedCurrency,
  selectedToken,
  setSelectedToken,
  availableCurrencies,
  cryptoTokens,
  showTokenDialog,
  setShowTokenDialog,
}: DepositScreenProps) {
  const getCryptoLogo = (symbol: string) => {
    return `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/color/${symbol.toLowerCase()}.svg`
  }

  const calculateTokenAmount = () => {
    if (!selectedToken || !depositAmount) return "0"
    const amount = Number.parseFloat(depositAmount)
    const tokenAmount = amount * selectedToken.rate
    return tokenAmount.toFixed(6)
  }

  return (
    <div className="max-w-[640px] w-full">
      {/* You are Depositing Section */}
      <div className="text-center mb-scaled-8 px-scaled-6 py-scaled-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
        <div className="flex justify-between mb-scaled-4 items-center">
          <span className="text-gray-600 dark:text-gray-300 text-scaled-base">You are Depositing</span>
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
            availableCurrencies={availableCurrencies}
          />
        </div>

        <div className="relative mb-scaled-4">
          <input
            type="text"
            value={depositAmount}
            onChange={(e) => {
              // Only allow numbers and decimal point
              const value = e.target.value.replace(/[^0-9.]/g, "")
              setDepositAmount(value)
            }}
            placeholder=""
            className="text-scaled-4xl font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none text-center w-full placeholder-transparent"
            style={{ caretColor: "#374151" }}
          />
          {depositAmount === "" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-scaled-4xl font-semibold text-gray-300 dark:text-gray-600">
                {selectedCurrency.symbol} 5
              </span>
            </div>
          )}
          {depositAmount !== "" && (
            <span
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-scaled-4xl font-semibold text-gray-900 dark:text-white pointer-events-none"
              style={{ marginLeft: `-${depositAmount.length * 1.8}rem` }}
            >
              {selectedCurrency.symbol}
            </span>
          )}
        </div>

        <input
          type="text"
          value={depositDescription}
          onChange={(e) => setDepositDescription(e.target.value)}
          placeholder="Add Description"
          className="text-gray-500 dark:text-gray-400 text-scaled-base mb-scaled-8 bg-transparent border-none outline-none text-center w-full placeholder-gray-500 dark:placeholder-gray-400"
        />

        {/* You will get Card */}
        <Card
          className="p-scaled-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          onClick={() => setShowTokenDialog(true)}
        >
          {!selectedToken ? (
            // Empty state
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-scaled-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400 dark:text-gray-300 text-scaled-lg font-bold">+</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-scaled-sm text-gray-600 dark:text-gray-300">Choose a token</div>
                  <div className="font-medium text-gray-500 dark:text-gray-400 text-scaled-lg">Select your token</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          ) : (
            // Selected token state
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-scaled-3">
                <img
                  src={getCryptoLogo(selectedToken.symbol) || "/placeholder.svg"}
                  alt={selectedToken.name}
                  className="w-12 h-12"
                />
                <div className="text-left">
                  <div className="text-scaled-sm text-gray-600 dark:text-gray-300">You will get</div>
                  <div className="font-semibold text-gray-900 dark:text-white text-scaled-lg">
                    {calculateTokenAmount()} {selectedToken.symbol}
                  </div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>
          )}
        </Card>
      </div>

      {/* Bank Details Section */}
      <div className="space-y-0 mb-scaled-8 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center py-scaled-3 px-scaled-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-scaled-3">
            <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300 text-scaled-sm">Bank Name</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-scaled-sm">Simulator Bank</span>
        </div>
        <div className="flex justify-between items-center py-scaled-3 px-scaled-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-scaled-3">
            <UserCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300 text-scaled-sm">Beneficiary Name</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-scaled-sm">Doe Jane</span>
        </div>
        <div className="flex justify-between items-center py-scaled-3 px-scaled-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-scaled-3">
            <Hash className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300 text-scaled-sm">IBAN / Account</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-scaled-sm">GB41SEOU19870010404544</span>
        </div>
        <div className="flex justify-between items-center py-scaled-3 px-scaled-4 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center gap-scaled-3">
            <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300 text-scaled-sm">Bank address</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-scaled-sm text-right">
            The Bower, 207-211 Old Street, London, England
          </span>
        </div>
        <div className="flex justify-between items-center py-scaled-3 px-scaled-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-scaled-3">
            <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300 text-scaled-sm">Bank country</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-scaled-sm">Malta</span>
        </div>
        <div className="flex justify-between items-center py-scaled-3 px-scaled-4 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-scaled-3">
            <Wallet className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-300 text-scaled-sm">Wallet Address</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-white text-scaled-sm">
            0x973fF8EcFB22c4Fe69Db152f327587DDfA1B
          </span>
        </div>
      </div>

      {/* Simulate Deposit Button */}
      <CustomButton variant="primary" size="lg" fullWidth className="text-scaled-base">
        Simulate Deposit
      </CustomButton>

      {/* Token Selection Dialog */}
      {showTokenDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-scaled-6 w-96 max-w-sm mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-scaled-4">
              <h3 className="text-scaled-lg font-semibold text-gray-900 dark:text-white">Select Token</h3>
              <button
                onClick={() => setShowTokenDialog(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {cryptoTokens.map((token) => (
                <div
                  key={token.symbol}
                  onClick={() => {
                    setSelectedToken(token)
                    setShowTokenDialog(false)
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedToken?.symbol === token.symbol
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <img src={getCryptoLogo(token.symbol) || "/placeholder.svg"} alt={token.name} className="w-10 h-10" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{token.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{token.symbol}</div>
                  </div>
                  {selectedToken?.symbol === token.symbol && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
